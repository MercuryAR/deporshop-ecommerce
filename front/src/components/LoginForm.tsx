import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function LoginForm() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);

  const login = useAuthStore((s) => s.login);
  const register = useAuthStore((s) => s.register);
  const loading = useAuthStore((s) => s.loading);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(nombre, email, password);
      }
      navigate('/perfil');
    } catch {
      setSubmitError(
        mode === 'login'
          ? 'Email o contraseña incorrectos.'
          : 'No se pudo crear la cuenta. Intenta nuevamente.',
      );
    }
  }

  const tabClass = (activo: boolean) =>
    `flex-1 px-3 sm:px-6 py-3 rounded-pill text-label font-bold whitespace-nowrap transition-colors ${
      activo ? 'bg-white text-bosque shadow-card' : 'text-musgo hover:text-bosque'
    }`;

  return (
    <div className="w-full max-w-md mx-auto card p-6 sm:p-8 shadow-card">
      <div className="flex mb-8 rounded-pill bg-menta p-1" role="tablist" aria-label="Acceso">
        <button type="button" role="tab" aria-selected={mode === 'login'} className={tabClass(mode === 'login')} onClick={() => setMode('login')}>
          Iniciar sesión
        </button>
        <button type="button" role="tab" aria-selected={mode === 'register'} className={tabClass(mode === 'register')} onClick={() => setMode('register')}>
          Crear cuenta
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {mode === 'register' && (
          <div>
            <label htmlFor="nombre" className="form-label">
              Nombre
            </label>
            <input
              id="nombre"
              type="text"
              required
              className="form-input"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Tu nombre"
            />
          </div>
        )}

        <div>
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="form-label">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={6}
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            aria-describedby="password-ayuda"
          />
          <p id="password-ayuda" className="form-help">
            Mínimo 6 caracteres
          </p>
        </div>

        {submitError && <p className="text-body-sm text-error bg-error-suave rounded-sm px-4 py-3">{submitError}</p>}

        <button type="submit" className="btn-primary btn-lg w-full mt-1" disabled={loading}>
          {loading ? 'Enviando…' : mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
        </button>
      </form>
    </div>
  );
}
