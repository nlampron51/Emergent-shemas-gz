import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from './components/ui/toaster';
import Dashboard from './components/Dashboard';
import UnitEditor from './components/UnitEditor';
import ResourceManager from './components/ResourceManager';
import Calendar from './components/Calendar';
import PDFExport from './components/PDFExport';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/unit/:id" element={<UnitEditor />} />
          <Route path="/resources" element={<ResourceManager />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/export" element={<PDFExport />} />
        </Routes>
        <Toaster />
      </Router>
    </div>
  );
}

export default App;