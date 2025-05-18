document.addEventListener('DOMContentLoaded', function() {
  // 1. Отримуємо URL поточної сторінки
  const urlParams = new URLSearchParams(window.location.search);

  // 2. Отримуємо значення параметрів 'quantity' та 'productName'
  const quantity = urlParams.get('quantity');
  const productName = urlParams.get('productName');

  // 3. Знаходимо елемент, куди будемо виводити кількість
  const displayedQuantityElement = document.getElementById('quantity');
  // Знаходимо елемент зображення
  const productImageElement = document.getElementById('product-image');

  // 4. Перевіряємо, чи параметр кількості був переданий і виводимо його
  if (quantity !== null) {
    displayedQuantityElement.textContent = quantity;
  } else {
    displayedQuantityElement.textContent = "Кількість не вказано.";
  }

  // 5. Перевіряємо, чи параметр назви продукту був переданий і встановлюємо src зображення
  if (productName !== null && productImageElement) {
    // Припускаємо, що всі зображення знаходяться в папці ./img/ і мають розширення .png
    const imagePath = `./img/${productName}.png`;
    productImageElement.src = imagePath;
  } else if (productImageElement) {
    // Якщо назва продукту не передана, можна приховати зображення або показати заглушку
    productImageElement.style.display = 'none'; // Наприклад, приховати
    // Або: productImageElement.src = './img/placeholder.png'; // Показати заглушку
    productImageElement.alt = "Зображення товару недоступне";
  }
});