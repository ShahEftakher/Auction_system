import { Route, Routes } from 'react-router-dom';
import Itempage from './pages/ItemPage';
import Listings from './pages/ListingsPage';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/listings" element={<Listings />} />
      <Route path="/:id" element={<Itempage />} />
    </Routes>
  );
}

export default App;
