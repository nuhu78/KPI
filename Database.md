# Database Schema

## 1. Engine
PostgreSQL. Using TypeORM for database access.

### Local (pgAdmin4)
Connect via host/port/username/password/database — no URL needed. App uses `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE` env vars.

### Production (Render)
Uses `DATABASE_URL` connection string provided by Render.

### Auto-Sync
TypeORM `synchronize: true` in development — tables auto-created/updated on `npm run start:dev` from entity definitions. No manual migration step.

### Folder Structure
- `backend/` — NestJS API + TypeORM entities + uploads
- `frontend/` — React Vite app

## 2. ERD (textual)
```
Section (1) ──< (many) Employee (1) ──< (many) Cycle
Admin (standalone, no relations)
```

## 3. Entities (TypeORM)

### 3.1 `admins`
```ts
@Entity()
export class Admin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 50 })
  admin_id: string;

  @Column()
  password_hash: string;

  @CreateDateColumn()
  created_at: Date;
}
```

### 3.2 `sections`
```ts
@Entity()
export class Section {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 100 })
  name: string;

  @CreateDateColumn()
  created_at: Date;
}
```

### 3.3 `employees`
```ts
@Entity()
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 50 })
  employee_code: string;

  @Column({ length: 150 })
  name: string;

  @Column({ nullable: true, length: 255 })
  image_url: string;

  @ManyToOne(() => Section)
  @JoinColumn({ name: 'section_id' })
  section: Section;

  @Column()
  section_id: number;

  @Column({ nullable: true })
  password_hash: string;

  @Column({ default: false })
  is_registered: boolean;

  @CreateDateColumn()
  created_at: Date;
}
```

### 3.4 `cycles`
```ts
@Entity()
export class Cycle {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @Column()
  employee_id: number;

  @Column({ type: 'int', default: 0 })
  completed_files: number;

  @Column({ type: 'int' })
  target_files: number;

  @Column({ type: 'date' })
  start_date: string;

  @Column({ type: 'date' })
  end_date: string;

  @Column({ type: 'varchar', length: 20, default: 'active' })
  status: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  final_score: number;

  @CreateDateColumn()
  created_at: Date;
}
```

## 4. Indexes (handled by TypeORM decorators)
- `@Column({ unique: true })` on `admin_id`, `employee_code`, `section.name` creates unique indexes automatically
- Additional indexes can be added via `@Index()` decorator if needed

## 5. Derived Values (not stored, computed on read)
- Employee current score: `(completed_files / target_files) * 100` from their active cycle
- Section score: `AVG(employee current scores)` for employees in that section
- Ranking: `ORDER BY score DESC` (application-level sort after fetch, or SQL window function)

## 6. Sample Query — Public Ranking (TypeORM Query Builder)
```ts
const rankings = await employeeRepo
  .createQueryBuilder('e')
  .innerJoin('e.activeCycle', 'c', 'c.status = :status', { status: 'active' })
  .select([
    'e.id',
    'e.name',
    'e.image_url',
    'c.completed_files',
    'c.target_files',
    'ROUND((c.completed_files::numeric / c.target_files) * 100, 2) AS score',
  ])
  .orderBy('score', 'DESC')
  .getRawMany();
```

## 7. Auto-Create Order (on npm run start:dev)
TypeORM `synchronize: true` handles this automatically from entity definitions.
1. Entity classes define the schema
2. TypeORM creates/updates tables on app bootstrap
3. Admin seeded from env vars if not exists
