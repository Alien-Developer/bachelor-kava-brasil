document.addEventListener('DOMContentLoaded', function () {
  const orderForm = document.getElementById('orderForm');
  const orderFormContainer = document.getElementById('orderFormContainer');
  const successPage = document.getElementById('successPage');
  const errorMessage = document.getElementById('errorMessage');

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
  }

  function showMessage(element, isEmpty=false, isValid=false, duration = 7000) {
    const emptyMsg = document.getElementById('empty-fields');
    const wrongMsg = document.getElementById('not-valid-fields');
    emptyMsg.style.display = 'none';
    wrongMsg.style.display = 'none';

    if (!isEmpty) emptyMsg.style.display = 'inline';
    if (!isValid) wrongMsg.style.display = 'inline';

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

  function hideMessages() {
    errorMessage.style.display = 'none';
  }

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
    let isEmpty = true;
    let isValid = true;

    for (let field of requiredFields) {
      if (!data[field]) {
        isEmpty = false;
        break;
      }
    }
    if (!data.paymentMethod) {
      isEmpty = false;
    }
    if (data.email && !isValidEmail(data.email)) {
      isValid = false;
    }
    if (data.phone && !isValidPhone(data.phone)) {
      isValid = false;
    }

    if (!isValid || !isEmpty) {
      showMessage(errorMessage, isEmpty, isValid);
      return;
    }
    console.log('Дані замовлення:', data);

    showSuccessPage();
  });

  // Додаємо обробники для валідації в реальному часі
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');

  emailInput.addEventListener('blur', function () {
    if (this.value && !isValidEmail(this.value)) {
      this.style.borderColor = '#dc3545';
    } else {
      this.style.borderColor = '#e7e7e7';
    }
  });

  phoneInput.addEventListener('blur', function () {
    if (this.value && !isValidPhone(this.value)) {
      this.style.borderColor = '#dc3545';
    } else {
      this.style.borderColor = '#e7e7e7';
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