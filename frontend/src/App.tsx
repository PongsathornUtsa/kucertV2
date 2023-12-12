import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import Drawers from "./components/drawers/Drawer";
import Home from './pages/home/Home';
import Dashboard from './pages/dashboard/Dashboard';

function App() {
  const { isConnected } = useAccount();

  return (
    <BrowserRouter>
      <Drawers>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={isConnected ? <Dashboard /> : <Navigate to="/" replace />} />
        </Routes>
      </Drawers >
    </BrowserRouter>
  );
}

export default App;
