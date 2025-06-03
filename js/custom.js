document.addEventListener('DOMContentLoaded', () => {
  // --- header scrolling ---
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
  // --- header end ---

  // --- slider ---
  const sliderTrack = document.querySelector('.slider-track');
  const slides = sliderTrack ? Array.from(sliderTrack.children) : [];
  const nextButton = document.querySelector('.slider-button.next');
  const prevButton = document.querySelector('.slider-button.prev');

  // Перевіряємо наявність ВСІХ необхідних елементів слайдера
  if (!sliderTrack || !nextButton || !prevButton || slides.length === 0) {
    //console.warn("Slider elements not found or no slides available.");
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


    // --- burger menu ---
    //const header = document.querySelector('.site-header');
    const burgerMenuButton = document.querySelector('.burger-menu');
    const navigationWrapper = document.querySelector('.navigation-wrapper');

    if (burgerMenuButton && navigationWrapper) {
      burgerMenuButton.addEventListener('click', () => {
        const isOpened = burgerMenuButton.getAttribute('aria-expanded') === 'true';
        burgerMenuButton.setAttribute('aria-expanded', !isOpened);
        burgerMenuButton.classList.toggle('active'); // Для стилізації 'X'
        navigationWrapper.classList.toggle('open'); // Для показу/приховування меню

        // Блокування скролу фону при відкритому меню (опціонально)
        document.body.style.overflow = !isOpened ? 'hidden' : '';
      });
    } else {
      console.warn("Burger menu button or navigation wrapper not found.");
    }
    // --- end of burger menu ---

  // === Логіка для кнопок +/- кількості товару ===
  const quantityInput = document.getElementById('quantity');
  const minusButton = document.querySelector('.quantity-button.minus');
  const plusButton = document.querySelector('.quantity-button.plus');

  const minQuantity = 1;
  const maxQuantity = 10;

  // Перевіряємо, чи всі елементи для кількості знайдені
  if (quantityInput && minusButton && plusButton) {

    // Встановлюємо min та max атрибути для інпута, якщо вони ще не задані
    // Це допоможе з валідацією браузером при прямому вводі
    quantityInput.setAttribute('min', minQuantity);
    quantityInput.setAttribute('max', maxQuantity);

    // Функція для оновлення стану кнопок (активна/неактивна)
    const updateButtonStates = (currentValue) => {
      minusButton.disabled = currentValue <= minQuantity;
      plusButton.disabled = currentValue >= maxQuantity;
    };

    // Ініціалізація стану кнопок при завантаженні
    let initialValue = parseInt(quantityInput.value, 10);
    if (isNaN(initialValue) || initialValue < minQuantity) {
      initialValue = minQuantity;
      quantityInput.value = initialValue;
    } else if (initialValue > maxQuantity) {
      initialValue = maxQuantity;
      quantityInput.value = initialValue;
    }
    updateButtonStates(initialValue);


    // Обробник для кнопки "+"
    plusButton.addEventListener('click', () => {
      let currentValue = parseInt(quantityInput.value, 10);
      if (isNaN(currentValue)) { // Якщо в інпуті не число
        currentValue = minQuantity;
      } else if (currentValue < maxQuantity) {
        currentValue++;
      }
      quantityInput.value = currentValue;
      updateButtonStates(currentValue);
    });

    // Обробник для кнопки "-"
    minusButton.addEventListener('click', () => {
      let currentValue = parseInt(quantityInput.value, 10);
      if (isNaN(currentValue)) { // Якщо в інпуті не число
        currentValue = minQuantity;
      } else if (currentValue > minQuantity) {
        currentValue--;
      }
      quantityInput.value = currentValue;
      updateButtonStates(currentValue);
    });
  }
  // === Кінець логіки для кнопок +/- кількості товару ===

  // document.getElementById('add-to-cart').addEventListener('click', function() {
  //   // 1. Отримуємо посилання на поле вводу
  //   const quantityInput = document.getElementById('quantity');
  //
  //   // 2. Отримуємо значення з поля вводу
  //   const quantity = quantityInput.value;
  //   // Отримуємо посилання на елемент зображення
  //   const productImage = document.getElementById('product-image');
  //
  //   // 3. Отримуємо шлях до зображення
  //   const imageSrc = productImage.src;
  //
  //   // 4. Виділяємо назву файлу без розширення зі шляху
  //   // Приклад шляху: http://localhost:8080/img/SERRA_VELHA.png або ./img/SERRA_VELHA.png
  //   // Спочатку отримуємо останню частину шляху (з назвою файлу та розширенням)
  //   const lastSlashIndex = imageSrc.lastIndexOf('/');
  //   const filenameWithExtension = lastSlashIndex > -1 ? imageSrc.substring(lastSlashIndex + 1) : imageSrc; // Якщо '/' не знайдено, можливо, це просто ім'я файлу
  //
  //   // Потім знаходимо останню крапку і відрізаємо розширення
  //   const lastDotIndex = filenameWithExtension.lastIndexOf('.');
  //   const filenameWithoutExtension = lastDotIndex > -1 ? filenameWithExtension.substring(0, lastDotIndex) : filenameWithExtension; // Якщо '.' не знайдено, можливо, розширення відсутнє
  //
  //   // 5. Перевіряємо, чи введене значення є дійсним числом
  //   if (quantity === "" || isNaN(quantity) || parseInt(quantity) <= 0) {
  //     alert("Будь ласка, введіть дійсну кількість (число більше 0).");
  //     return; // Зупиняємо виконання, якщо значення невірне
  //   }
  //
  //   // 6. Формуємо URL для shopping-cart.html і передаємо число та назву файлу як параметри запиту
  //   const params = new URLSearchParams();
  //   params.append('quantity', quantity); // Додаємо параметр 'quantity'
  //   params.append('productName', filenameWithoutExtension); // Додаємо параметр 'productName'
  //
  //   const targetUrl = 'shopping-cart.html?' + params.toString();
  //
  //   // 5. Перенаправляємо користувача на shopping-cart.html
  //   window.location.href = targetUrl;
  // });
  // Inside custom.js
// Find this part (or similar):
// document.getElementById('add-to-cart').addEventListener('click', function() { ... });
// And replace it with this:

  const addToCartButton = document.getElementById('add-to-cart');
  if (addToCartButton) { // 5. Prevents error if 'add-to-cart' button is not on the page
    addToCartButton.addEventListener('click', function() {
      // 1. Отримуємо посилання на поле вводу
      const quantityInput = document.getElementById('quantity');
      // Отримуємо посилання на елемент зображення
      const productImage = document.getElementById('product-image');

      // Ensure elements exist before trying to use them
      if (!quantityInput) {
        alert("Помилка: не знайдено поле для вводу кількості.");
        console.error("Element with ID 'quantity' not found for add-to-cart.");
        return;
      }
      if (!productImage) {
        alert("Помилка: не знайдено зображення товару.");
        console.error("Element with ID 'product-image' not found for add-to-cart.");
        return;
      }

      // 2. Отримуємо значення з поля вводу
      const quantity = quantityInput.value;
      // 3. Отримуємо шлях до зображення
      const imageSrc = productImage.src;

      // 4. Виділяємо назву файлу без розширення зі шляху
      const lastSlashIndex = imageSrc.lastIndexOf('/');
      const filenameWithExtension = lastSlashIndex > -1 ? imageSrc.substring(lastSlashIndex + 1) : imageSrc;
      const lastDotIndex = filenameWithExtension.lastIndexOf('.');
      const filenameWithoutExtension = lastDotIndex > -1 ? filenameWithExtension.substring(0, lastDotIndex) : filenameWithExtension;

      // 5. Перевіряємо, чи введене значення є дійсним числом
      if (quantity === "" || isNaN(quantity) || parseInt(quantity) <= 0) {
        alert("Будь ласка, введіть дійсну кількість (число більше 0).");
        return;
      }

      // 6. Формуємо URL для shopping-cart.html і передаємо число та назву файлу як параметри запиту
      const params = new URLSearchParams();
      params.append('quantity', quantity);
      params.append('productName', filenameWithoutExtension); // This will be used as product.id

      const targetUrl = 'shopping-cart.html?' + params.toString();

      // 7. Перенаправляємо користувача на shopping-cart.html
      window.location.href = targetUrl;
    });
  }

});