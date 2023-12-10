import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Drawers from "./components/drawers/Drawer";
import Home from './pages/home/Home';
import Dashboard from './pages/dashboard/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Drawers>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Drawers >
    </BrowserRouter>
  );
}

export default App;
