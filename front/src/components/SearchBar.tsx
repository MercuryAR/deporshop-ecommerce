import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from './Icons';

interface SearchBarProps {
  className?: string;
  onSearch?: () => void;
}

// Search del UI kit (buscador del header): pill Menta de 44px con ícono search.
export default function SearchBar({ className = '', onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/productos?buscar=${encodeURIComponent(q)}` : '/productos');
    onSearch?.();
  }

  return (
    <form role="search" onSubmit={handleSubmit} className={className}>
      <label className="flex items-center gap-2.5 h-11 px-4 bg-menta border border-borde rounded-pill text-bosque focus-within:border-esmeralda focus-within:shadow-focus transition-shadow">
        <Icon name="search" size={16} />
        <span className="sr-only">Buscar productos</span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar productos"
          className="flex-1 min-w-0 bg-transparent text-body-sm text-bosque placeholder:text-musgo outline-none"
        />
      </label>
    </form>
  );
}
