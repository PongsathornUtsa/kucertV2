import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Drawers from "./components/drawers/Drawer";
import Home from './pages/home/Home';

function App() {
  return (
    <BrowserRouter>
      <Drawers>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Drawers >
    </BrowserRouter>
  );
}

export default App;
