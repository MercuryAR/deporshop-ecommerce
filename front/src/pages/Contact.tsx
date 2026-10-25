import { useState } from 'react';
import Icon from '../components/Icons';

interface FormValues {
  nombre: string;
  email: string;
  telefono: string;
  asunto: string;
  mensaje: string;
}

type FormErrors = Partial<Record<keyof FormValues, string>>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[+]?[\d\s()-]+$/;

const initialValues: FormValues = {
  nombre: '',
  email: '',
  telefono: '',
  asunto: '',
  mensaje: '',
};

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};

  if (!values.nombre.trim()) errors.nombre = 'El nombre es obligatorio.';
  if (!values.email.trim()) {
    errors.email = 'El email es obligatorio.';
  } else if (!EMAIL_REGEX.test(values.email.trim())) {
    errors.email = 'Ingresa un email válido.';
  }
  if (values.telefono.trim() && !PHONE_REGEX.test(values.telefono.trim())) {
    errors.telefono = 'Ingresa un teléfono válido.';
  }
  if (!values.mensaje.trim()) errors.mensaje = 'El mensaje es obligatorio.';

  return errors;
}

export default function Contact() {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormValues, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);

  function handleChange<K extends keyof FormValues>(field: K, value: FormValues[K]) {
    const next = { ...values, [field]: value };
    setValues(next);
    if (touched[field]) {
      setErrors(validate(next));
    }
  }

  function handleBlur(field: keyof FormValues) {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors(validate(values));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);
    setTouched({ nombre: true, email: true, telefono: true, asunto: true, mensaje: true });

    if (Object.keys(validationErrors).length === 0) {
      // No backend endpoint for contact submissions yet — simulate success like the old site did.
      console.log('Formulario de contacto enviado:', values);
      setSubmitted(true);
      setValues(initialValues);
      setTouched({});
      setErrors({});
      setTimeout(() => setSubmitted(false), 5000);
    }
  }

  function inputClass(field: keyof FormValues, base = 'form-input') {
    return touched[field] && errors[field] ? `${base} form-input-error` : base;
  }

  return (
    <div className="container-app py-10 md:py-14 max-w-2xl">
      <p className="section-overline mb-3">Ayuda</p>
      <h1 className="font-display text-[36px] leading-[1.05] tracking-[-0.5px] sm:text-h1 mb-3">CONTACTO</h1>
      <p className="text-body-lg text-musgo mb-8 md:mb-10">¿Tenés alguna pregunta? Estamos acá para ayudarte.</p>

      {submitted && (
        <div className="bg-menta text-esmeralda-oscuro p-4 rounded-md mb-6" role="status">
          <p className="text-body-strong font-bold mb-1">¡Mensaje enviado exitosamente!</p>
          <p className="text-body-sm">Te responderemos a la brevedad</p>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="card p-6 md:p-8 flex flex-col gap-5">
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="nombre" className="form-label">
              Nombre *
            </label>
            <input
              id="nombre"
              type="text"
              className={inputClass('nombre')}
              value={values.nombre}
              onChange={(e) => handleChange('nombre', e.target.value)}
              onBlur={() => handleBlur('nombre')}
            />
            {touched.nombre && errors.nombre && (
              <p className="form-error">{errors.nombre}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="form-label">
              Email *
            </label>
            <input
              id="email"
              type="email"
              className={inputClass('email')}
              value={values.email}
              onChange={(e) => handleChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
            />
            {touched.email && errors.email && (
              <p className="form-error">{errors.email}</p>
            )}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="telefono" className="form-label">
              Teléfono
            </label>
            <input
              id="telefono"
              type="tel"
              className={inputClass('telefono')}
              value={values.telefono}
              onChange={(e) => handleChange('telefono', e.target.value)}
              onBlur={() => handleBlur('telefono')}
            />
            {touched.telefono && errors.telefono && (
              <p className="form-error">{errors.telefono}</p>
            )}
          </div>

          <div>
            <label htmlFor="asunto" className="form-label">
              Asunto
            </label>
            <input
              id="asunto"
              type="text"
              className="form-input"
              value={values.asunto}
              onChange={(e) => handleChange('asunto', e.target.value)}
            />
          </div>
        </div>

        <div>
          <label htmlFor="mensaje" className="form-label">
            Mensaje *
          </label>
          <textarea
            id="mensaje"
            className={inputClass('mensaje', 'form-textarea')}
            placeholder="Contanos en qué te podemos ayudar…"
            value={values.mensaje}
            onChange={(e) => handleChange('mensaje', e.target.value)}
            onBlur={() => handleBlur('mensaje')}
          />
          {touched.mensaje && errors.mensaje && (
            <p className="form-error">{errors.mensaje}</p>
          )}
        </div>

        <button type="submit" className="btn-primary btn-lg w-full sm:w-auto sm:self-start">
          Enviar mensaje <Icon name="arrow-right" size={20} />
        </button>
      </form>
    </div>
  );
}
