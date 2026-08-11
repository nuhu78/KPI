import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { MulterError } from 'multer';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      let error: string;
      let message: string | string[];

      if (typeof exceptionResponse === 'string') {
        error = HttpStatus[status] ?? 'HTTP_ERROR';
        message = exceptionResponse;
      } else {
        const body = exceptionResponse as Record<string, unknown>;
        error = (body.error as string) ?? HttpStatus[status] ?? 'HTTP_ERROR';
        message = (body.message as string | string[]) ?? exception.message;
      }

      if (status >= 500) {
        this.logger.error(exception.message, exception.stack);
      } else {
        this.logger.warn(
          `${request.method} ${request.url} -> ${status} ${error}`,
        );
      }

      response.status(status).json({
        statusCode: status,
        error,
        message,
        path: request.url,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    if (exception instanceof MulterError) {
      this.logger.warn(
        `${request.method} ${request.url} -> 400 ${exception.code}`,
      );
      response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        error: 'VALIDATION_ERROR',
        message:
          exception.code === 'LIMIT_FILE_SIZE'
            ? 'File size exceeds the 2MB limit'
            : exception.message,
        path: request.url,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    this.logger.error(
      'Unhandled exception',
      exception instanceof Error ? exception.stack : String(exception),
    );
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      error: 'INTERNAL_SERVER_ERROR',
      message: 'Something went wrong',
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
