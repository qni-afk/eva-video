// Анимация появления элементов при скролле
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');

            // Анимируем фото и текст внутри секции с задержкой
            const photo = entry.target.querySelector('.photo');
            const textBlock = entry.target.querySelector('.text-block');

            if (photo) {
                setTimeout(() => {
                    photo.classList.add('visible');
                }, 200);
            }

            if (textBlock) {
                setTimeout(() => {
                    textBlock.classList.add('visible');
                }, 600);
            }

            // Обновляем активный пункт меню
            updateActiveNavItem(entry.target.id);
        }
    });
}, {
    root: null,
    rootMargin: '-50px',
    threshold: 0.15
});

// Наблюдаем за всеми элементами
document.querySelectorAll('.memory-section, .text-block').forEach(element => {
    observer.observe(element);
});

// Обновление активного пункта меню
function updateActiveNavItem(sectionId) {
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
        }
    });
}

// Плавный скролл при клике на навигацию
document.querySelectorAll('.nav-links a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Блокировка горизонтального скролла
document.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
    }
}, { passive: false });

// Обработка клика на фото
document.querySelectorAll('.photo').forEach((el) => {
    el.addEventListener('click', function() {
        const imgSrc = this.querySelector('img').src;
        openModal(imgSrc);
    });
});

// Модальное окно
function openModal(imgSrc) {
    const modal = document.getElementById('modal');
    const modalImg = document.getElementById('modal-img');
    modalImg.src = imgSrc;
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Закрытие модального окна
document.getElementById('modal').addEventListener('click', function(e) {
    if (e.target === this || e.target.tagName === 'IMG') {
        this.style.display = 'none';
        document.body.style.overflow = '';
    }
});

// Закрытие по клавише Escape
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const modal = document.getElementById('modal');
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
});

// Параллакс-эффект с плавностью
let parallaxTimeout;
document.addEventListener('mousemove', (e) => {
    if (!parallaxTimeout) {
        parallaxTimeout = setTimeout(() => {
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const y = (e.clientY / window.innerHeight - 0.5) * 20;
            document.body.style.backgroundPosition = `${50 + x}% ${50 + y}%`;
            parallaxTimeout = null;
        }, 50);
    }
});

// 3D Tilt эффект для фотографий
document.querySelectorAll('.photo').forEach(photo => {
    photo.addEventListener('mousemove', handleTilt);
    photo.addEventListener('mouseleave', resetTilt);
    photo.addEventListener('mouseenter', initTilt);
});

function initTilt(e) {
    const photo = e.currentTarget;
    photo.style.transition = 'none';
}

function handleTilt(e) {
    const photo = e.currentTarget;
    const rect = photo.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const percentX = (x - centerX) / centerX;
    const percentY = (y - centerY) / centerY;

    const maxRotate = 15; // Увеличили угол поворота
    const maxTranslate = 15; // Добавили смещение

    // Более выраженный 3D эффект
    const transform = `
        perspective(800px)
        scale3d(1.05, 1.05, 1.05)
        rotateX(${-percentY * maxRotate}deg)
        rotateY(${percentX * maxRotate}deg)
        translateX(${percentX * maxTranslate}px)
        translateY(${percentY * maxTranslate}px)
    `;

    requestAnimationFrame(() => {
        photo.style.transform = transform;
    });

    // Улучшенный эффект блика
    const glare = photo.querySelector('.photo-glare') || createGlareElement(photo);
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;
    const glareOpacity = Math.sqrt(Math.pow(percentX, 2) + Math.pow(percentY, 2));

    glare.style.background = `
        radial-gradient(
            circle at ${glareX}% ${glareY}%,
            rgba(255,255,255,${0.5 + glareOpacity * 0.3}) 0%,
            rgba(255,255,255,0.1) 30%,
            rgba(255,255,255,0) 80%
        )
    `;
    glare.style.opacity = '1';
}

function resetTilt(e) {
    const photo = e.currentTarget;
    photo.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    photo.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale3d(1, 1, 1) translateX(0) translateY(0)';

    // Плавное исчезновение блика
    const glare = photo.querySelector('.photo-glare');
    if (glare) {
        glare.style.opacity = '0';
    }
}

function createGlareElement(photo) {
    const glare = document.createElement('div');
    glare.className = 'photo-glare';
    photo.appendChild(glare);
    return glare;
}

document.addEventListener('DOMContentLoaded', () => {
    const musicBtn = document.getElementById('music-btn');
    const volumeSlider = document.getElementById('volume-slider');
    const audio = document.getElementById('background-music');

    // Устанавливаем начальную громкость
    audio.volume = volumeSlider.value / 100;

    // Обработчик клика по кнопке музыки
    musicBtn.addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
            musicBtn.classList.add('playing');
        } else {
            audio.pause();
            musicBtn.classList.remove('playing');
        }
    });

    // Обработчик изменения громкости
    volumeSlider.addEventListener('input', (e) => {
        audio.volume = e.target.value / 100;
    });

    // Сохраняем состояние воспроизведения
    audio.addEventListener('play', () => {
        musicBtn.classList.add('playing');
    });

    audio.addEventListener('pause', () => {
        musicBtn.classList.remove('playing');
    });
});

// Создаем падающие сердечки при скролле
document.addEventListener('scroll', createHeart);

function createHeart() {
    const heart = document.createElement('div');
    heart.className = 'heart-particle';
    heart.innerHTML = '❤️';
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.animationDuration = Math.random() * 3 + 2 + 's';

    document.querySelector('.falling-hearts').appendChild(heart);

    // Удаляем сердечко после анимации
    setTimeout(() => {
        heart.remove();
    }, 5000);
}

// Интерактивное сообщение с убегающей кнопкой "нет"
const noBtn = document.querySelector('.no-btn');
const yesBtn = document.querySelector('.yes-btn');
const loveMessage = document.querySelector('.love-message');

noBtn.addEventListener('mouseover', () => {
    const x = Math.random() * (window.innerWidth - noBtn.offsetWidth);
    const y = Math.random() * (window.innerHeight - noBtn.offsetHeight);

    noBtn.style.position = 'fixed';
    noBtn.style.left = x + 'px';
    noBtn.style.top = y + 'px';
});

yesBtn.addEventListener('click', () => {
    loveMessage.innerHTML = '<p class="love-text">I know it! ❤️❤️❤️</p>';
    loveMessage.style.transform = 'translateX(-50%) scale(1.2)';
    setTimeout(() => {
        loveMessage.style.transform = 'translateX(-50%) scale(1)';
        createHeartShower();
    }, 300);

    setTimeout(() => {
    loveMessage.remove();
    }, 3000);

});

// Создаем душ из сердечек при клике на "да"
function createHeartShower() {
    for(let i = 0; i < 50; i++) {
        setTimeout(() => {
            createHeart();
        }, i * 100);
    }
}

// Параллакс эффект для фотографий
document.querySelectorAll('.photo').forEach(photo => {
    photo.addEventListener('mousemove', (e) => {
        const rect = photo.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const xPercent = (x / rect.width - 0.5) * 20;
        const yPercent = (y / rect.height - 0.5) * 20;

        photo.style.transform = `perspective(1000px) rotateX(${yPercent}deg) rotateY(${xPercent}deg) scale3d(1.05, 1.05, 1.05)`;
    });

    photo.addEventListener('mouseleave', () => {
        photo.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
});

// Обработка временной линии
const timelinePoints = document.querySelectorAll('.timeline-point');
const chapters = document.querySelectorAll('.chapter');

// Обновление активной точки на временной линии
function updateTimeline() {
    const scrollPosition = window.scrollY + window.innerHeight / 2;

    chapters.forEach((chapter, index) => {
        const chapterTop = chapter.offsetTop;
        const chapterBottom = chapterTop + chapter.offsetHeight;

        if (scrollPosition >= chapterTop && scrollPosition < chapterBottom) {
            timelinePoints.forEach(point => point.classList.remove('active'));
            timelinePoints[index].classList.add('active');
        }
    });
}

// Плавный скролл к главе при клике на точку временной линии
timelinePoints.forEach((point, index) => {
    point.addEventListener('click', () => {
        chapters[index].scrollIntoView({ behavior: 'smooth' });
    });
});

// Обновление временной линии при скролле
window.addEventListener('scroll', updateTimeline);

// Анимация появления глав при скролле
const chapterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');

            // Анимируем фото и текст внутри главы с задержкой
            const photo = entry.target.querySelector('.photo');
            const textBlock = entry.target.querySelector('.text-block');

            if (photo) {
                setTimeout(() => {
                    photo.classList.add('visible');
                }, 400);
            }

            if (textBlock) {
                setTimeout(() => {
                    textBlock.classList.add('visible');
                }, 800);
            }
        }
    });
}, {
    threshold: 0.2
});

chapters.forEach(chapter => chapterObserver.observe(chapter));