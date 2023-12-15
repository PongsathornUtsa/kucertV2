import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import Drawers from "./components/drawers/Drawer";
import Home from './pages/home/Home';
import Dashboard from './pages/dashboard/Dashboard';
import Admin from './pages/admin/Admin';
import Service from './pages/service/Service';

function App() {
  const { isConnected } = useAccount();

  return (
    <BrowserRouter basename="/kucert">
      <Drawers>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={isConnected ? <Dashboard /> : <Navigate to="/" replace />} />
          <Route path="/admin" element={isConnected ? <Admin /> : <Navigate to="/" replace />} />
          <Route path="/service" element={isConnected ? <Service /> : <Navigate to="/" replace />} />
        </Routes>
      </Drawers >
    </BrowserRouter>
  );
}

export default App;
