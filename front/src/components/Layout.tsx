import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { useProductStore } from '../store/productStore';

export default function Layout() {
  const fetchCategorias = useProductStore((s) => s.fetchCategorias);

  // Header y Footer listan las categorías en su navegación.
  useEffect(() => {
    fetchCategorias();
  }, [fetchCategorias]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow animate-[fadeIn_0.4s_ease-out]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
