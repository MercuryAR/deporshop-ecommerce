import LoginForm from '../components/LoginForm';
import { Isotipo } from '../components/Logo';

export default function Login() {
  return (
    <div className="container-app py-12 md:py-16">
      <div className="flex flex-col items-center text-center mb-8 md:mb-10">
        <Isotipo size={64} />
        <h1 className="font-display text-[32px] leading-[1.05] tracking-[-0.5px] sm:text-h1 mt-6 mb-3">BIENVENIDO</h1>
        <p className="text-body text-musgo">Ingresá o creá tu cuenta en DeporShop</p>
      </div>
      <LoginForm />
    </div>
  );
}
