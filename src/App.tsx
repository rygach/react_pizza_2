import React from 'react';
import { Routes, Route } from 'react-router-dom';

import './scss/app.scss';

import { Home } from './pages/Home.tsx';
import Cart from './pages/Cart.tsx';
import { NotFound } from './pages/NotFound.tsx';
import PizzaDescription from './pages/PizzaDescription.tsx';
import MainLayout from './layouts/MainLayout.tsx';

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
