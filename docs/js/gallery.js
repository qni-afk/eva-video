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
    // Обработка GIF изображений
    const galleryImages = document.querySelectorAll('.gallery-img[data-gif]');
    galleryImages.forEach(img => {
        const staticSrc = img.src;
        const gifSrc = img.dataset.gif;

        // Предзагрузка GIF
        const preloadGif = new Image();
        preloadGif.src = gifSrc;

        img.addEventListener('mouseenter', () => {
            img.src = gifSrc;
        });

        img.addEventListener('mouseleave', () => {
            img.src = staticSrc;
        });
    });

    // Обработка видео
    const galleryVideos = document.querySelectorAll('.gallery-video');
    galleryVideos.forEach(video => {
        const galleryItem = video.closest('.gallery-item');

        galleryItem.addEventListener('mouseenter', () => {
            video.play();
        });

        galleryItem.addEventListener('mouseleave', () => {
            video.pause();
            video.currentTime = 0;
        });

        // Предзагрузка видео
        video.load();
    });

    // Анимация появления элементов при скролле
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '50px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.transform = 'translateY(0)';
                entry.target.style.opacity = '1';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.gallery-item').forEach(item => {
        item.style.transform = 'translateY(50px)';
        item.style.opacity = '0';
        item.style.transition = 'all 0.6s ease';
        observer.observe(item);
    });

    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryItems.forEach(item => {
        const video = item.querySelector('.gallery-video');
        if (!video) return;

        // Создаем превью из первого кадра видео
        video.addEventListener('loadeddata', () => {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext('2d').drawImage(video, 0, 0);

            const previewImg = item.querySelector('.preview-img');
            if (!previewImg.src) {
                previewImg.src = canvas.toDataURL();
            }
        });

        item.addEventListener('mouseenter', () => {
            video.play();
        });

        item.addEventListener('mouseleave', () => {
            video.pause();
            video.currentTime = 0;
        });

        // Предзагрузка видео
        video.load();
    });

    const modal = document.getElementById('imageModal');
    const modalVideo = document.getElementById('modalVideo');
    const modalImage = document.getElementById('modalImage');

    galleryItems.forEach(item => {
        const video = item.querySelector('.gallery-video');
        if (video) {
            // Для элементов с видео
            item.addEventListener('click', () => {
                modal.style.display = "flex";
                modalVideo.style.display = "block";
                modalImage.style.display = "none";
                modalVideo.src = video.querySelector('source').src;
                modalVideo.play();
            });

            // Hover эффект для предпросмотра
            item.addEventListener('mouseenter', () => {
                video.play();
            });

            item.addEventListener('mouseleave', () => {
                video.pause();
                video.currentTime = 0;
            });
        } else {
            // Для обычных изображений
            const img = item.querySelector('img');
            img.addEventListener('click', () => {
                modal.style.display = "flex";
                modalVideo.style.display = "none";
                modalImage.style.display = "block";
                modalImage.src = img.src;
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
