let currentSlide = 0;
const slides = document.querySelectorAll('.carousel__slide');
const indicators = document.querySelectorAll('.indicator');
const totalSlides = slides.length;
let autoPlayInterval;

// Inicializar carousel
function initCarousel() {
    showSlide(currentSlide);
    startAutoPlay();
    
    // Pausar autoplay al hacer hover
    const carousel = document.querySelector('.carousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', stopAutoPlay);
        carousel.addEventListener('mouseleave', startAutoPlay);
    }
}

// Mostrar slide específico
function showSlide(index) {
    const track = document.querySelector('.carousel__track');
    currentSlide = (index + totalSlides) % totalSlides;
    
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    // Actualizar indicadores
    indicators.forEach((indicator, i) => {
        indicator.classList.toggle('active', i === currentSlide);
    });
}

// Mover carousel
function moveCarousel(direction) {
    showSlide(currentSlide + direction);
}

// Ir a slide específico
function goToSlide(index) {
    showSlide(index);
}

// Auto-play
function startAutoPlay() {
    autoPlayInterval = setInterval(() => {
        moveCarousel(1);
    }, 5000); // Cambiar cada 5 segundos
}

function stopAutoPlay() {
    clearInterval(autoPlayInterval);
}

// Soporte para touch/swipe en móviles
let touchStartX = 0;
let touchEndX = 0;

const carousel = document.querySelector('.carousel');

if (carousel) {
    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
}

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            moveCarousel(1); // Swipe left
        } else {
            moveCarousel(-1); // Swipe right
        }
    }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCarousel);
} else {
    initCarousel();
}