import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import LongVideos from './pages/LongVideos';
import ShortVideos from './pages/ShortVideos';
import Miniatures from './pages/Miniatures';
import Admin from './pages/Admin';
import About from './pages/About';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="parcours" element={<About />} />
          <Route path="longs" element={<LongVideos />} />
          <Route path="miniatures" element={<Miniatures />} />
          <Route path="shorts" element={<ShortVideos />} />
          <Route path="admin" element={<Admin />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
