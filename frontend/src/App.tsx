import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<div className="p-8 text-center"><h1 className="text-4xl font-bold text-blue-600">KPI Management System</h1><p className="mt-4 text-gray-600">Phase 0 Complete - Project Setup</p></div>} />
      </Routes>
    </div>
  )
}

export default App
