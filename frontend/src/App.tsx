import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LangProvider } from './i18n/LangContext';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/Dashboard';
import Pipeline from './pages/Pipeline';
import Candidates from './pages/Candidates';
import Visa from './pages/Visa';
import Journey from './pages/Journey';

// Strip trailing slash so React Router gets a clean basename
const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/';

export default function App() {
  return (
    <LangProvider>
      <BrowserRouter basename={basename}>
        <div className="flex min-h-screen bg-ow-sand">
          <Sidebar />
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-7xl mx-auto px-8 py-8">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/pipeline" element={<Pipeline />} />
                <Route path="/candidates" element={<Candidates />} />
                <Route path="/visa" element={<Visa />} />
                <Route path="/journey" element={<Journey />} />
              </Routes>
            </div>
          </main>
        </div>
      </BrowserRouter>
    </LangProvider>
  );
}
