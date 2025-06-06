document.addEventListener('DOMContentLoaded', () => {
  // --- header scrolling ---
  const header = document.querySelector('.site-header');
  const scrollThreshold = 10;

  if (header) {
      const handleScroll = () => {
      if (window.scrollY > scrollThreshold) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll);

    handleScroll();
  }
  // --- header end ---

  // --- slider ---
  const sliderTrack = document.querySelector('.slider-track');
  const slides = sliderTrack ? Array.from(sliderTrack.children) : [];
  const nextButton = document.querySelector('.slider-button.next');
  const prevButton = document.querySelector('.slider-button.prev');

  if (!sliderTrack || !nextButton || !prevButton || slides.length === 0) {
  } else {
    let slideWidth = slides[0].getBoundingClientRect().width;
    let currentIndex = 0;

    const updateSlideWidth = () => {
      slideWidth = slides[0].getBoundingClientRect().width;
      moveToSlide(sliderTrack, currentIndex, false);
    }

    const moveToSlide = (track, targetIndex, animate = true) => {
      if (targetIndex < 0 || targetIndex >= slides.length) {
        console.warn(`Attempted to move to invalid index: ${targetIndex}`);
        return;
      }

      const transformValue = `translateX(-${slideWidth * targetIndex}px)`;

      if (animate) {
        track.style.transition = 'transform 0.5s ease-in-out';
      } else {
        track.style.transition = 'none';
      }

      track.style.transform = transformValue;
      currentIndex = targetIndex;

      if (!animate) {
        track.offsetHeight;
        track.style.transition = 'transform 0.5s ease-in-out';
      }
    };

    nextButton.addEventListener('click', e => {
      let nextIndex = currentIndex + 1;
      if (nextIndex >= slides.length) {
        nextIndex = 0;
      }
      moveToSlide(sliderTrack, nextIndex);
    });

    prevButton.addEventListener('click', e => {
      let prevIndex = currentIndex - 1;
      if (prevIndex < 0) {
        prevIndex = slides.length - 1;
      }
      moveToSlide(sliderTrack, prevIndex);
    });

    window.addEventListener('resize', updateSlideWidth);

    moveToSlide(sliderTrack, 0, false);

  }


    // --- burger menu ---
    const burgerMenuButton = document.querySelector('.burger-menu');
    const navigationWrapper = document.querySelector('.navigation-wrapper');

    if (burgerMenuButton && navigationWrapper) {
      burgerMenuButton.addEventListener('click', () => {
        const isOpened = burgerMenuButton.getAttribute('aria-expanded') === 'true';
        burgerMenuButton.setAttribute('aria-expanded', !isOpened);
        burgerMenuButton.classList.toggle('active');
        navigationWrapper.classList.toggle('open');

        document.body.style.overflow = !isOpened ? 'hidden' : '';
      });
    } else {
      console.warn("Burger menu button or navigation wrapper not found.");
    }
    // --- end of burger menu ---

  const quantityInput = document.getElementById('quantity');
  const minusButton = document.querySelector('.quantity-button.minus');
  const plusButton = document.querySelector('.quantity-button.plus');

  const minQuantity = 1;
  const maxQuantity = 10;

  if (quantityInput && minusButton && plusButton) {

    quantityInput.setAttribute('min', minQuantity);
    quantityInput.setAttribute('max', maxQuantity);

    const updateButtonStates = (currentValue) => {
      minusButton.disabled = currentValue <= minQuantity;
      plusButton.disabled = currentValue >= maxQuantity;
    };

    let initialValue = parseInt(quantityInput.value, 10);
    if (isNaN(initialValue) || initialValue < minQuantity) {
      initialValue = minQuantity;
      quantityInput.value = initialValue;
    } else if (initialValue > maxQuantity) {
      initialValue = maxQuantity;
      quantityInput.value = initialValue;
    }
    updateButtonStates(initialValue);


    plusButton.addEventListener('click', () => {
      let currentValue = parseInt(quantityInput.value, 10);
      if (isNaN(currentValue)) {
        currentValue = minQuantity;
      } else if (currentValue < maxQuantity) {
        currentValue++;
      }
      quantityInput.value = currentValue;
      updateButtonStates(currentValue);
    });

    minusButton.addEventListener('click', () => {
      let currentValue = parseInt(quantityInput.value, 10);
      if (isNaN(currentValue)) {
        currentValue = minQuantity;
      } else if (currentValue > minQuantity) {
        currentValue--;
      }
      quantityInput.value = currentValue;
      updateButtonStates(currentValue);
    });
  }

  const addToCartButton = document.getElementById('add-to-cart');
  if (addToCartButton) {
    addToCartButton.addEventListener('click', function() {
      const quantityInput = document.getElementById('quantity');
      const productImage = document.getElementById('product-image');

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

      const quantity = quantityInput.value;
      const imageSrc = productImage.src;

      const lastSlashIndex = imageSrc.lastIndexOf('/');
      const filenameWithExtension = lastSlashIndex > -1 ? imageSrc.substring(lastSlashIndex + 1) : imageSrc;
      const lastDotIndex = filenameWithExtension.lastIndexOf('.');
      const filenameWithoutExtension = lastDotIndex > -1 ? filenameWithExtension.substring(0, lastDotIndex) : filenameWithExtension;

      if (quantity === "" || isNaN(quantity) || parseInt(quantity) <= 0) {
        alert("Будь ласка, введіть дійсну кількість (число більше 0).");
        return;
      }

      const params = new URLSearchParams();
      params.append('quantity', quantity);
      params.append('productName', filenameWithoutExtension);

      const targetUrl = 'shopping-cart.html?' + params.toString();

      window.location.href = targetUrl;
    });
  }

});