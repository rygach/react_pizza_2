import React from 'react';
import { Routes, Route } from 'react-router-dom';

import './scss/app.scss';

import { Home } from './pages/Home';
import Cart from './pages/Cart';
import NotFound from './pages/NotFound';
import PizzaDescription from './pages/PizzaDescription';
import MainLayout from './layouts/MainLayout';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route path="" element={<Home />} />
        <Route path="cart" element={<Cart />} />
        <Route path="pizza/:id" element={<PizzaDescription />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
