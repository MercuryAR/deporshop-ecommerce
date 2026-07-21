// Manejo del formulario de contacto
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Obtener datos del formulario
            const formData = {
                nombre: document.getElementById('nombre').value,
                email: document.getElementById('email').value,
                telefono: document.getElementById('telefono').value,
                asunto: document.getElementById('asunto').value,
                mensaje: document.getElementById('mensaje').value
            };
            
            // Simulación de envío (aquí conectarías con tu backend)
            console.log('Formulario enviado:', formData);
            
            // Mostrar mensaje de éxito
            showSuccessMessage();
            
            // Limpiar formulario
            contactForm.reset();
        });
    }
    
    // Validación en tiempo real
    const inputs = document.querySelectorAll('.form-input, .form-textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateInput(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('invalid')) {
                validateInput(this);
            }
        });
    });
});

// Validar input individual
function validateInput(input) {
    const value = input.value.trim();
    
    // Remover clases previas
    input.classList.remove('invalid', 'valid');
    
    if (input.hasAttribute('required') && value === '') {
        input.classList.add('invalid');
        return false;
    }
    
    // Validar email
    if (input.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            input.classList.add('invalid');
            return false;
        }
    }
    
    // Validar teléfono
    if (input.type === 'tel' && value !== '') {
        const phoneRegex = /^[+]?[\d\s()-]+$/;
        if (!phoneRegex.test(value)) {
            input.classList.add('invalid');
            return false;
        }
    }
    
    input.classList.add('valid');
    return true;
}

// Mostrar mensaje de éxito
function showSuccessMessage() {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = 'notification notification--success';
    notification.innerHTML = `
        <div class="notification__content">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <div>
                <h4>¡Mensaje enviado exitosamente!</h4>
                <p>Te responderemos a la brevedad</p>
            </div>
        </div>
    `;
    
    // Agregar estilos inline
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #28A745, #20C997);
        color: white;
        padding: 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        max-width: 350px;
    `;
    
    document.body.appendChild(notification);
    
    // Remover después de 5 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Agregar estilos CSS para animaciones y notificaciones
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    .notification__content {
        display: flex;
        align-items: center;
        gap: 1rem;
    }
    
    .notification__content svg {
        width: 24px;
        height: 24px;
        flex-shrink: 0;
    }
    
    .notification__content h4 {
        margin: 0 0 0.25rem;
        font-size: 1rem;
        font-weight: 600;
    }
    
    .notification__content p {
        margin: 0;
        font-size: 0.875rem;
        opacity: 0.9;
    }
    
    .form-input.invalid,
    .form-textarea.invalid {
        border-color: #dc3545 !important;
    }
    
    .form-input.valid,
    .form-textarea.valid {
        border-color: #28a745 !important;
    }
`;
document.head.appendChild(style);
