document.addEventListener('DOMContentLoaded', function () {
  const orderForm = document.getElementById('orderForm');
  const orderFormContainer = document.getElementById('orderFormContainer');
  const successPage = document.getElementById('successPage');
  const errorMessage = document.getElementById('errorMessage');

  // Функція для валідації email
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Функція для валідації телефону
  function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
  }

  // Функція для показу повідомлень
  function showMessage(element, duration = 5000) {
    element.style.display = 'block';
    setTimeout(() => {
      element.style.display = 'none';
    }, duration);
  }

  // Функція для переходу на сторінку успіху
  function showSuccessPage() {
    orderFormContainer.style.display = 'none';
    successPage.classList.add('show');
    window.scrollTo(0, 0);
  }

  // Функція для очищення повідомлень
  function hideMessages() {
    errorMessage.style.display = 'none';
  }

  // Обробка відправки форми
  orderForm.addEventListener('submit', function (e) {
    e.preventDefault();
    hideMessages();

    // Отримуємо дані форми
    const formData = new FormData(orderForm);
    const data = {};
    for (let [key, value] of formData.entries()) {
      data[key] = value.trim();
    }

    // Валідація обов'язкових полів
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'city'];
    let isValid = true;

    for (let field of requiredFields) {
      if (!data[field]) {
        isValid = false;
        break;
      }
    }

    // Перевірка вибору способу оплати
    if (!data.paymentMethod) {
      isValid = false;
    }

    // Валідація email
    if (data.email && !isValidEmail(data.email)) {
      isValid = false;
    }

    // Валідація телефону
    if (data.phone && !isValidPhone(data.phone)) {
      isValid = false;
    }

    if (!isValid) {
      showMessage(errorMessage);
      return;
    }

    // Імітація відправки даних (тут би був запит на сервер)
    console.log('Дані замовлення:', data);

    // Показуємо сторінку успіху
    showSuccessPage();
  });

  // Додаємо обробники для валідації в реальному часі
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');

  emailInput.addEventListener('blur', function () {
    if (this.value && !isValidEmail(this.value)) {
      this.style.borderColor = '#dc3545';
    } else { console.log('good', this.value);
      this.style.borderColor = '#ddd';
    }
  });

  phoneInput.addEventListener('blur', function () {
    if (this.value && !isValidPhone(this.value)) {
      this.style.borderColor = '#dc3545';
    } else {
      this.style.borderColor = '#ddd';
    }
  });

  // Очищаємо червоні рамки при фокусі
  // const allInputs = orderForm.querySelectorAll('.form-input');
  // allInputs.forEach(input => {
  //   input.addEventListener('focus', function () {
  //     this.style.borderColor = '#4a90e2';
  //   });
  //
  //   input.addEventListener('blur', function () {
  //     if (this.style.borderColor !== '#dc3545') {
  //       this.style.borderColor = '#ddd';
  //     }
  //   });
  // });
});