gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

ScrollTrigger.config({
    ignoreMobileResize: true // Предотвращает проблемы с мобильной прокруткой
});

const smoother = ScrollSmoother.create({
    wrapper: ".wrapper",
    content: ".content",
    smooth: 1.5,
    effects: true,
    normalizeScroll: true,
    ignoreMobileResize: true,
    preventDefault: true,
    // Исключаем фиксированные элементы
    ignore: ['.navbar', '#love-timer', '.music-controls']
});

// Добавляем обработчик для фиксированных элементов
gsap.set(['.navbar', '#love-timer', '.music-controls'], {
    position: 'fixed',
    zIndex: 9999
});

// Анимации заголовка
gsap.to(".animate__title", {
    opacity: 1,
    y: 0,
    duration: 1.5,
    ease: "power4.out",
    delay: 0.5
});

gsap.to(".animate__text", {
    opacity: 1,
    y: 0,
    duration: 1.2,
    delay: 1,
    ease: "sine.out"
});

// Анимации секций при скролле
gsap.utils.toArray(".section").forEach((section, i) => {
    gsap.fromTo(section,
        { opacity: 0, y: 100 },
        {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power4.out",
            scrollTrigger: {
                trigger: section,
                start: "top 80%",
                end: "bottom 20%",
                toggleActions: "play none none reverse"
            }
        }
    );
});

// Музыка
const musicBtn = document.getElementById('music-btn');
const audio = document.getElementById('background-music');
const musicStatus = document.getElementById('music-status');
let isPlaying = false;

musicBtn.addEventListener('click', () => {
    isPlaying = !isPlaying;
    musicBtn.classList.toggle('playing');

    if (isPlaying) {
        audio.play();
        musicBtn.querySelector('.loader').style.opacity = '1';
    } else {
        audio.pause();
        musicBtn.querySelector('.loader').style.opacity = '0.5';
    }
});

// Смена видео
const videos = document.querySelectorAll('.video-background video');
let currentVideo = 0;

function changeVideo() {
    gsap.to(videos[currentVideo], {
        opacity: 0,
        duration: 1.5,
        onComplete: () => {
            videos[currentVideo].classList.remove('active');
            currentVideo = (currentVideo + 1) % videos.length;
            videos[currentVideo].classList.add('active');
            gsap.fromTo(videos[currentVideo],
                { opacity: 0 },
                { opacity: 1, duration: 1.5 }
            );
        }
    });
}

// Запускаем смену видео каждые 10 секунд
setInterval(changeVideo, 10000);

// Таймер отношений (ЗАМЕНИ ДАТУ НА СВОЮ!)
const startDate = new Date('12.09.2023');
function updateTimer() {
    const now = new Date();
    const diff = now - startDate;

    const years = Math.floor(diff / 31536000000);
    const days = Math.floor((diff % 31536000000) / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    document.getElementById('love-timer').innerHTML = `
        Мы вместе уже:<br>
        ${years} год ${days} дней<br>
        ${hours} часов ${minutes} минут ${seconds} секунд
    `;
}
setInterval(updateTimer, 1000);
updateTimer();

// Интерактивные кнопки
document.querySelector('.no-btn').addEventListener('mouseover', function() {
    this.style.setProperty('--move', Math.random() > 0.5 ? 1 : -1);
});

// Функция создания сердечек
function createHeart() {
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.innerHTML = 'love you';
    heart.style.left = Math.random() * 50 + 'vw';
    heart.style.animationDuration = Math.random() * 2 + 3 + 's';
    document.querySelector('.hearts').appendChild(heart);

    // Удаляем сердечко после анимации
    setTimeout(() => {
        heart.remove();
    }, 5000);
}

// Обработчик для кнопки "да"
document.querySelector('.yes-btn').addEventListener('click', function() {
    // Создаем много сердечек
    for(let i = 0; i < 15; i++) {
        setTimeout(() => {
            createHeart();
        }, i * 150);
    }
});

document.querySelectorAll('.gallery-image').forEach(image => {
    image.addEventListener('click', () => {
        image.classList.toggle('active');
        console.log('Image clicked:', image);
    });
});

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded');

    // Получаем все изображения галереи
    const galleryImages = document.querySelectorAll('.gallery-image');

    // Делаем все изображения видимыми
    galleryImages.forEach(img => {
        // Устанавливаем начальные стили напрямую
        img.style.opacity = "1";
        img.style.transform = "translateY(0)";
        // Устанавливаем размеры и переходы
        img.style.width = "250px";
        img.style.height = "180px";
        img.style.transition = "all 0.5s ease";
        img.style.objectFit = "cover";
        img.style.cursor = "pointer";
        img.style.borderRadius = "10px";
        img.style.boxShadow = "0 5px 15px rgba(0,0,0,0.2)";
    });

    console.log('Made all images visible');

    // Обработчик клика с прямым изменением стилей
    galleryImages.forEach(image => {
        // Храним состояние увеличения
        image.isEnlarged = false;

        image.addEventListener('click', function() {
            console.log('Image clicked');

            if (this.isEnlarged) {
                // Если изображение уже увеличено, уменьшаем его
                this.style.transform = "scale(1)";
                this.style.zIndex = "1";
                this.isEnlarged = false;
                console.log('Reducing image');
            } else {
                // Сначала возвращаем все изображения к нормальному размеру
                galleryImages.forEach(img => {
                    img.style.transform = "scale(1)";
                    img.style.zIndex = "1";
                    img.isEnlarged = false;
                });

                // Затем увеличиваем только текущее изображение
                this.style.transform = "scale(1.8)";
                this.style.zIndex = "100";
                this.isEnlarged = true;
                console.log('Enlarging image');
            }
        });
    });

    // Код для интерактивной навигации
    const navLinks = document.querySelectorAll('nav a');

    // Добавляем data-text атрибут для эффекта
    navLinks.forEach(link => {
        link.setAttribute('data-text', link.textContent);
    });

    // Эффект активного элемента меню
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Предотвращаем переход по ссылке для демо
            e.preventDefault();

            // Удаляем класс active у всех ссылок
            navLinks.forEach(l => l.classList.remove('active'));

            // Добавляем класс active текущей ссылке
            this.classList.add('active');

            // Анимация нажатия
            gsap.to(this, {
                scale: 1.1,
                duration: 0.2,
                onComplete: () => {
                    gsap.to(this, {
                        scale: 1,
                        duration: 0.2
                    });
                }
            });
        });
    });

    // Обработка скролла для меню
    const menu = document.querySelector('.menu');

    // Функция обработки скролла
    function handleScroll() {
        // Проверяем существование элемента перед работой с ним
        if (menu) {
            const scrollPosition = window.scrollY;

            if (scrollPosition > 50) {
                if (!menu.classList.contains('scrolled')) {
                    menu.classList.add('scrolled');
                }
            } else {
                if (menu.classList.contains('scrolled')) {
                    menu.classList.remove('scrolled');
                }
            }
        }
    }

    // Добавляем обработчик скролла только если элемент существует
    if (menu) {
        window.addEventListener('scroll', handleScroll);
    }

    // Ваш код GSAP здесь
    gsap.to(".element", { duration: 1, x: 100 });

    const sections = document.querySelectorAll('.section');

    // Функция для проверки видимости секции
    function checkVisibility() {
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                gsap.to(section, { opacity: 1, y: 0, duration: 1 });
            } else {
                gsap.to(section, { opacity: 0, y: 50, duration: 1 });
            }
        });
    }

    // Проверяем видимость при прокрутке
    window.addEventListener('scroll', checkVisibility);
    checkVisibility(); // Проверяем сразу при загрузке

    // Добавляем обработчик для всех ссылок в навигации
    document.querySelectorAll('.nav-list a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // Предотвращаем стандартное поведение
            const href = this.getAttribute('href');
            console.log('Переход по ссылке:', href);
            window.location.href = href;
        });
    });
});

// Добавьте после существующего кода для музыки
const volumeSlider = document.getElementById('volume-slider');
const volumeControl = document.querySelector('.volume-control');

// Показываем/скрываем слайдер громкости при наведении
musicBtn.addEventListener('mouseenter', () => {
    volumeControl.classList.add('show');
});

document.querySelector('.music-controls').addEventListener('mouseleave', () => {
    volumeControl.classList.remove('show');
});

// Управление громкостью
volumeSlider.addEventListener('input', (e) => {
    const volume = e.target.value / 100;
    audio.volume = volume;
});

// Сохранение громкости в localStorage
volumeSlider.addEventListener('change', (e) => {
    localStorage.setItem('audioVolume', e.target.value);
});

// Восстановление громкости при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    const savedVolume = localStorage.getItem('audioVolume');
    if (savedVolume !== null) {
        volumeSlider.value = savedVolume;
        audio.volume = savedVolume / 100;
    }
});

function stabilizeFixedElements() {
    const fixedElements = [
        document.querySelector('.navbar'),
        document.querySelector('#love-timer'),
        document.querySelector('.music-controls')
    ];

    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                fixedElements.forEach(element => {
                    if (element) {
                        element.style.transform = 'translateZ(0)';
                        element.style.backfaceVisibility = 'hidden';
                    }
                });
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

stabilizeFixedElements();

document.addEventListener('DOMContentLoaded', () => {
    const galleryLink = document.querySelector('a[href="./gallery.html"]');
    if (galleryLink) {
        galleryLink.addEventListener('click', (e) => {
            window.location.href = './gallery.html';
        });
    }
});
