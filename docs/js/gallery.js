console.log('Script loaded!'); // Проверка загрузки скрипта

// Получаем все элементы галереи
const galleryItems = document.querySelectorAll('.gallery-item img');
const modal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImage');
const closeBtn = document.querySelector('.close');

// Добавляем обработчик клика для каждого изображения
galleryItems.forEach(img => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', function() {
        modal.style.display = "flex";
        modalImg.src = this.src;
        // Добавляем небольшую задержку для правильной работы анимации
        setTimeout(() => {
            modal.classList.add('show');
            modalImg.classList.add('show');
        }, 10);
    });
});

function closeModal() {
    modal.classList.remove('show');
    modalImg.classList.remove('show');
    // Ждем окончания анимации перед скрытием модального окна
    setTimeout(() => {
        modal.style.display = "none";
    }, 300);
}

// Закрытие при клике на крестик
closeBtn.addEventListener('click', closeModal);

// Закрытие при клике вне изображения
modal.addEventListener('click', function(e) {
    if (e.target === modal) {
        closeModal();
    }
});

// Закрытие при нажатии клавиши Esc
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Добавьте в конец файла
document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: 1000,
        once: true
    });
});

// Добавьте в конец файла
const filterBtns = document.querySelectorAll('.filter-btn');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Удаляем активный класс у всех кнопок
        filterBtns.forEach(b => b.classList.remove('active'));
        // Добавляем активный класс нажатой кнопке
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        galleryItems.forEach(item => {
            if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                item.classList.remove('hide');
            } else {
                item.classList.add('hide');
            }
        });
    });
});

// Добавьте в конец файла
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    document.querySelector('.video-background').style.transform =
        `translateY(${scrolled * 0.5}px)`;
});

// Добавьте в начало файла
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    preloader.style.opacity = '0';
    setTimeout(() => {
        preloader.style.display = 'none';
    }, 500);
});

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded!'); // Проверка загрузки DOM

    const cards = document.querySelectorAll('.gallery-item');
    const threeDBtn = document.getElementById('3d-mode');
    const modal = document.getElementById('imageModal');
    const modalVideo = document.getElementById('modalVideo');
    const closeBtn = document.querySelector('.close');
    let is3DMode = false;

    console.log('Cards:', cards.length); // Проверка нахождения карточек
    console.log('3D Button:', threeDBtn); // Проверка нахождения кнопки

    // Улучшенная функция 3D эффекта
    function handle3D(e) {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();

        // Вычисляем позицию курсора внутри элемента
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Преобразуем координаты в проценты
        const xPercent = (x / rect.width) * 100;
        const yPercent = (y / rect.height) * 100;

        // Вычисляем углы поворота (увеличили до 25 градусов для более заметного эффекта)
        const rotateX = ((yPercent - 50) / 50) * -25;
        const rotateY = ((xPercent - 50) / 50) * 25;

        // Применяем трансформацию с более выраженным эффектом
        requestAnimationFrame(() => {
            card.style.transform = `
                perspective(1000px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                scale3d(1.1, 1.1, 1.1)
                translateZ(50px)
            `;
        });
    }

    // Плавный сброс 3D эффекта
    function reset3D(card) {
        requestAnimationFrame(() => {
            card.style.transform = `
                perspective(1000px)
                rotateX(0deg)
                rotateY(0deg)
                scale3d(1, 1, 1)
                translateZ(0)
            `;
        });
    }

    // Обработчик кнопки 3D режима
    threeDBtn.addEventListener('click', () => {
        is3DMode = !is3DMode;
        threeDBtn.classList.toggle('active');

        cards.forEach(card => {
            if (is3DMode) {
                // Включаем 3D режим
                card.style.transition = 'transform 0.2s ease-out';
                card.addEventListener('mousemove', handle3D);
                card.addEventListener('mouseleave', () => reset3D(card));
            } else {
                // Выключаем 3D режим
                card.removeEventListener('mousemove', handle3D);
                card.removeEventListener('mouseleave', () => reset3D(card));
                reset3D(card);
            }
        });
    });

    // Обработка видео (работает независимо от 3D режима)
    cards.forEach(card => {
        const video = card.querySelector('.gallery-video');
        const preview = card.querySelector('.preview-img');

        if (video) {
            card.addEventListener('mouseenter', () => {
                video.play();
                preview.style.opacity = '0';
                video.style.opacity = '1';
            });

            card.addEventListener('mouseleave', () => {
                video.pause();
                video.currentTime = 0;
                preview.style.opacity = '1';
                video.style.opacity = '0';
            });
        }
    });

    // Закрытие модального окна
    closeBtn.addEventListener('click', () => {
        modal.style.display = "none";
        modalVideo.pause();
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
            modalVideo.pause();
        }
    });

    // Добавляем эффект параллакса при движении мыши
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('mousemove', (e) => {
            const { left, top, width, height } = item.getBoundingClientRect();
            const x = (e.clientX - left) / width * 100;
            const y = (e.clientY - top) / height * 100;

            item.style.setProperty('--x', `${x}%`);
            item.style.setProperty('--y', `${y}%`);

            const rotateY = (x - 50) / 5;
            const rotateX = (y - 50) / -5;

            item.style.transform = `
                perspective(1000px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                scale3d(1.05, 1.05, 1.05)
            `;
        });

        item.addEventListener('mouseleave', () => {
            item.style.transform = '';
        });
    });

    // Добавляем фильтрацию
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;
            document.querySelectorAll('.gallery-item').forEach(item => {
                if (filter === 'all' || item.dataset.category === filter) {
                    item.style.display = '';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // Добавляем эффект магнитного притяжения
    const magneticEffect = (element, event) => {
        const bound = element.getBoundingClientRect();
        const mouseX = event.clientX - bound.left;
        const mouseY = event.clientY - bound.top;
        const centerX = bound.width / 2;
        const centerY = bound.height / 2;

        const deltaX = mouseX - centerX;
        const deltaY = mouseY - centerY;

        element.style.transform = `
            translate(${deltaX / 8}px, ${deltaY / 8}px)
            scale(1.1)
        `;
    };

    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('mousemove', (e) => magneticEffect(item, e));
        item.addEventListener('mouseleave', () => {
            item.style.transform = '';
        });
    });
});
