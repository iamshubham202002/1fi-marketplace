import { Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './layout/AppShell.jsx';
import Home from './pages/Home.jsx';
import Shop from './pages/Shop.jsx';
import ProductDetails from './pages/ProductDetails.jsx';
import EmiDues from './pages/EmiDues.jsx';
import Limit from './pages/Limit.jsx';
import Profile from './pages/Profile.jsx';

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/shop/product/:productId" element={<ProductDetails />} />
        <Route path="/emi-dues" element={<EmiDues />} />
        <Route path="/limit" element={<Limit />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
}
