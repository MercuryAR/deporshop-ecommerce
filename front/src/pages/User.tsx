import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { getMisPedidos } from '../services/api';
import type { Pedido } from '../types/Pedido';
import OrderCard from '../components/OrderCard';
import Icon from '../components/Icons';

export default function User() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const location = useLocation();

  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const pedidoConfirmado = (location.state as { pedidoConfirmado?: number } | null)?.pedidoConfirmado;

  useEffect(() => {
    let activo = true;
    setLoading(true);
    getMisPedidos()
      .then((data) => {
        if (activo) setPedidos(data);
      })
      .catch((err) => {
        console.error('Error al obtener pedidos:', err);
        if (activo) setError('No se pudo cargar tu historial de pedidos.');
      })
      .finally(() => {
        if (activo) setLoading(false);
      });
    return () => {
      activo = false;
    };
  }, []);

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <div className="container-app py-10 md:py-14 max-w-3xl">
      <p className="section-overline mb-3">Mi cuenta</p>
      <h1 className="font-display text-[36px] leading-[1.05] tracking-[-0.5px] sm:text-h1 mb-8">MI PERFIL</h1>

      <div className="card p-6 flex flex-col sm:flex-row gap-5 sm:items-center mb-8">
        <div className="size-16 sm:size-20 rounded-pill bg-esmeralda flex items-center justify-center shrink-0 text-white font-display text-h2">
          {user?.nombre?.charAt(0).toUpperCase() ?? '?'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-h4 font-bold truncate">{user?.nombre ?? '—'}</p>
          <p className="text-body-sm text-musgo truncate">{user?.email ?? '—'}</p>
        </div>
        <button type="button" className="btn-secondary btn-sm self-start sm:self-center" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>

      {pedidoConfirmado && (
        <div className="flex items-center gap-3 bg-menta text-esmeralda-oscuro rounded-md p-4 mb-8" role="status">
          <span className="flex items-center justify-center size-8 rounded-pill bg-esmeralda text-white shrink-0">
            <Icon name="check" size={16} />
          </span>
          <p className="text-body-sm font-semibold">¡Pedido #{pedidoConfirmado} confirmado! Gracias por tu compra.</p>
        </div>
      )}

      <h2 className="text-h3 font-extrabold mb-4">Mis pedidos</h2>

      {loading && <p className="text-musgo mb-8">Cargando pedidos...</p>}

      {!loading && error && <p className="text-body-sm text-error bg-error-suave rounded-sm px-4 py-3 mb-8">{error}</p>}

      {!loading && !error && pedidos.length === 0 && (
        <div className="flex flex-col items-center justify-center min-h-[200px] border-2 border-dashed border-borde rounded-md text-center p-8">
          <Icon name="bag" size={32} className="text-musgo mb-3" />
          <p className="text-body-strong font-bold mb-1">Aún no tenés pedidos.</p>
          <p className="text-body-sm text-musgo">Tu historial de compras aparecerá acá.</p>
        </div>
      )}

      {!loading && !error && pedidos.length > 0 && (
        <div className="flex flex-col gap-4">
          {pedidos.map((pedido) => (
            <OrderCard key={pedido.id} pedido={pedido} />
          ))}
        </div>
      )}
    </div>
  );
}
