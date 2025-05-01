document.addEventListener('DOMContentLoaded', () => {

  // --- Логіка для зміни хедера при прокрутці ---
  const header = document.querySelector('.site-header');
  const scrollThreshold = 10; // Поріг прокрутки в пікселях для активації

  // Перевіряємо, чи знайдено хедер
  if (!header) {
    console.error("Header element '.site-header' not found.");
    // Не виходимо повністю, щоб код слайдера міг спрацювати, якщо він є
  } else {
    // Функція, що додає/видаляє клас .scrolled
    const handleScroll = () => {
      if (window.scrollY > scrollThreshold) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };

    // Додаємо слухача події прокрутки
    window.addEventListener('scroll', handleScroll);

    // Опціонально: викликаємо функцію один раз при завантаженні,
    // на випадок, якщо сторінка завантажилась вже прокрученою
    handleScroll();
  }
  // --- Кінець логіки хедера ---


  // --- Ваш існуючий код для слайдера ---
  const sliderTrack = document.querySelector('.slider-track');
  // Додаємо перевірку існування sliderTrack перед доступом до children
  const slides = sliderTrack ? Array.from(sliderTrack.children) : [];
  const nextButton = document.querySelector('.slider-button.next');
  const prevButton = document.querySelector('.slider-button.prev');

  // Перевіряємо наявність ВСІХ необхідних елементів слайдера
  if (!sliderTrack || !nextButton || !prevButton || slides.length === 0) {
    console.warn("Slider elements not found or no slides available.");
    // Якщо слайдер не може працювати, можна завершити тут (або просто не виконувати код нижче)
    // return;
  } else {
    // Змінні та функції слайдера
    let slideWidth = slides[0].getBoundingClientRect().width;
    let currentIndex = 0;

    // Функція для оновлення ширини слайда (використовується при resize)
    const updateSlideWidth = () => {
      slideWidth = slides[0].getBoundingClientRect().width;
      // Важливо: оновлюємо позицію треку без анімації після зміни розміру
      moveToSlide(sliderTrack, currentIndex, false); // false - без анімації
    }

    // Функція для переміщення слайдів (змінено для підтримки анімації/без анімації)
    const moveToSlide = (track, targetIndex, animate = true) => {
      if (targetIndex < 0 || targetIndex >= slides.length) {
        console.warn(`Attempted to move to invalid index: ${targetIndex}`);
        return; // Prevent moving outside bounds
      }

      const transformValue = `translateX(-${slideWidth * targetIndex}px)`;

      if (animate) {
        // Використовуємо transition з вашого CSS
        track.style.transition = 'transform 0.5s ease-in-out';
      } else {
        track.style.transition = 'none'; // Вимикаємо анімацію для resize/init
      }

      track.style.transform = transformValue;
      currentIndex = targetIndex;

      // Якщо анімація була вимкнена, відновлюємо її для наступних кліків
      if (!animate) {
        // Невеликий трюк, щоб браузер застосував 'none' перед відновленням transition
        // Іноді це потрібно, щоб уникнути небажаної анімації
        track.offsetHeight; // Force reflow
        track.style.transition = 'transform 0.5s ease-in-out';
      }
    };

    // Обробник кнопки "Наступний"
    nextButton.addEventListener('click', e => {
      let nextIndex = currentIndex + 1;
      if (nextIndex >= slides.length) {
        nextIndex = 0; // Loop back to the first slide
      }
      moveToSlide(sliderTrack, nextIndex); // animate = true за замовчуванням
    });

    // Обробник кнопки "Попередній"
    prevButton.addEventListener('click', e => {
      let prevIndex = currentIndex - 1;
      if (prevIndex < 0) {
        prevIndex = slides.length - 1; // Loop back to the last slide
      }
      moveToSlide(sliderTrack, prevIndex); // animate = true за замовчуванням
    });

    // Обробник зміни розміру вікна (використовує покращену функцію)
    window.addEventListener('resize', updateSlideWidth);

    // Ініціалізація позиції слайдера без анімації
    moveToSlide(sliderTrack, 0, false);

  } // Кінець блоку else для перевірки елементів слайдера

}); // Кінець DOMContentLoaded