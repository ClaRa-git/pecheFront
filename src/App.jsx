import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PrivateRoute from './components/PrivateRoute'
import AdminRoute from './components/AdminRoute'

// Pages publiques
import Shop from './pages/Shop'
import ProductDetail from './pages/ProductDetail'
import Login from './pages/Login'
import Register from './pages/Register'
import Contests from './pages/Contests'

// Pages client
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Profile from './pages/Profile'
import Orders from './pages/Orders'
import Permits from './pages/Permits'
import MyContests from './pages/MyContests'

// Pages admin
import Dashboard from './pages/admin/Dashboard'
import AdminProducts from './pages/admin/Products'
import AdminOrders from './pages/admin/Orders'
import AdminPermits from './pages/admin/Permits'
import AdminContests from './pages/admin/Contests'

// Layout
import Navbar from './components/Navbar'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Routes>

          {/* Routes publiques */}
          <Route path="/"                element={<Shop />} />
          <Route path="/products/:id"    element={<ProductDetail />} />
          <Route path="/login"           element={<Login />} />
          <Route path="/register"        element={<Register />} />
          <Route path="/contests"        element={<Contests />} />

          {/* Routes client (JWT requis) */}
          <Route path="/cart" element={
            <PrivateRoute><Cart /></PrivateRoute>
          } />
          <Route path="/checkout" element={
            <PrivateRoute><Checkout /></PrivateRoute>
          } />
          <Route path="/profile" element={
            <PrivateRoute><Profile /></PrivateRoute>
          } />
          <Route path="/orders" element={
            <PrivateRoute><Orders /></PrivateRoute>
          } />
          <Route path="/permits" element={
            <PrivateRoute><Permits /></PrivateRoute>
          } />
          <Route path="/my-contests" element={
            <PrivateRoute><MyContests /></PrivateRoute>
          } />

          {/* Routes admin (ROLE_ADMIN requis) */}
          <Route path="/admin" element={
            <AdminRoute><Dashboard /></AdminRoute>
          } />
          <Route path="/admin/products" element={
            <AdminRoute><AdminProducts /></AdminRoute>
          } />
          <Route path="/admin/orders" element={
            <AdminRoute><AdminOrders /></AdminRoute>
          } />
          <Route path="/admin/permits" element={
            <AdminRoute><AdminPermits /></AdminRoute>
          } />
          <Route path="/admin/contests" element={
            <AdminRoute><AdminContests /></AdminRoute>
          } />

          {/* 404 */}
          <Route path="*" element={
            <div className="text-center py-20">
              <h1 className="text-4xl font-bold text-gray-400">404</h1>
              <p className="text-gray-500 mt-2">Page introuvable</p>
            </div>
          } />

        </Routes>
      </main>
    </BrowserRouter>
  )
}