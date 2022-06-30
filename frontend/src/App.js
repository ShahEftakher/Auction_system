/* eslint-disable */
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Itempage from './pages/ItemPage';
import Listings from './pages/ListingsPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Listings />} />
      <Route path="/:id" element={<Itempage />} />
    </Routes>
  );
}

export default App;
