import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-primary text-white mt-16 pt-16 pb-8">
      <div className="container-app">
        <div className="grid gap-10 md:grid-cols-3 mb-10">
          <div>
            <h3 className="font-display italic font-extrabold uppercase tracking-wide text-3xl mb-3">
              Depor<span className="text-accent">Shop</span>
            </h3>
            <p className="text-white/80">
              Tu tienda de zapatillas y accesorios deportivos en Buenos Aires, Argentina.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-3">Enlaces</h4>
            <div className="flex flex-col gap-2">
              <Link to="/productos" className="text-white/80 hover:text-white transition-colors">
                Productos
              </Link>
              <Link to="/contacto" className="text-white/80 hover:text-white transition-colors">
                Contacto
              </Link>
              <Link to="/carrito" className="text-white/80 hover:text-white transition-colors">
                Carrito
              </Link>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-3">Síguenos</h4>
            <div className="flex gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
              >
                <img src="/img/Facebook.svg" alt="" className="w-5 h-5 invert" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
              >
                <img src="/img/Instagram.svg" alt="" className="w-5 h-5 invert" />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                aria-label="X"
                className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
              >
                <img src="/img/X.svg" alt="" className="w-5 h-5 invert" />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 pt-6 text-center">
          <p className="text-white/80 text-sm">
            &copy; {new Date().getFullYear()} DeporShop. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
