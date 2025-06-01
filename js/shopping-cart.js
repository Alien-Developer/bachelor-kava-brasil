document.addEventListener('DOMContentLoaded', function() {
  const PRODUCTS = [
    { id: "SERRA_VELHA", name: "SERRA VELHA", price: 499, imageName: "SERRA_VELHA.png" },
    { id: "ALTO_VERDE", name: "ALTO VERDE", price: 520, imageName: "ALTO_VERDE.png" },
    { id: "NOITE_CLARA", name: "NOITE CLARA", price: 480, imageName: "NOITE_CLARA.png" }
  ];

  const shoppingCartSection = document.getElementById('shopping-cart-container');
  const emptyCartHTML = '<div class="cart-message"><h1>Ваша корзина пуста</h1></div>';

  function displayEmptyCart() {
    if (shoppingCartSection) {
      shoppingCartSection.innerHTML = emptyCartHTML;
    } else {
      console.error("Cannot display empty cart message: element with id='shopping-cart-container' not found.");
    }
  }

  if (!shoppingCartSection) {
    console.error("Element with id='shopping-cart-container' not found on the page. Cart cannot be initialized.");
    return;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const quantityParamStr = urlParams.get('quantity');
  const productIdParam = urlParams.get('productName');

  if (!productIdParam || !quantityParamStr) {
    displayEmptyCart();
    return;
  }

  const selectedProduct = PRODUCTS.find(p => p.id === productIdParam);
  const initialQuantity = parseInt(quantityParamStr, 10);

  if (!selectedProduct || isNaN(initialQuantity) || initialQuantity <= 0) {
    console.warn("Invalid product data or quantity from URL. Displaying empty cart.", { productIdParam, quantityParamStr, initialQuantity });
    displayEmptyCart();
    return;
  }

  const productImageElement = document.getElementById('product-image');
  const productNameSpan = document.getElementById('product-name');
  const productUnitPriceSpan = document.getElementById('product-price');
  const quantityInputElement = document.getElementById('quantity');
  const totalPriceSpan = document.getElementById('total-price');
  const deleteProductButton = document.getElementById('delete-product');

  // Get action buttons
  const continueShoppingButton = shoppingCartSection.querySelector('.continue-button');
  const checkoutButton = shoppingCartSection.querySelector('.buy-button');

  let minusButton, plusButton;
  const shoppingCartDetailsDiv = document.querySelector('.shopping-cart-details');
  if (shoppingCartDetailsDiv) {
    minusButton = shoppingCartDetailsDiv.querySelector('.quantity-button.minus');
    plusButton = shoppingCartDetailsDiv.querySelector('.quantity-button.plus');
  }

  if (!productImageElement || !productNameSpan || !productUnitPriceSpan || !quantityInputElement || !totalPriceSpan || !deleteProductButton || !minusButton || !plusButton || !continueShoppingButton || !checkoutButton) {
    console.error("One or more essential elements for displaying cart item details are missing from the HTML structure. Displaying empty cart.");
    displayEmptyCart();
    return;
  }

  productImageElement.src = `./img/${selectedProduct.imageName}`;
  productImageElement.alt = `Зображення товару ${selectedProduct.name}`;
  productNameSpan.textContent = selectedProduct.name;
  productUnitPriceSpan.textContent = `${selectedProduct.price}₴`;
  quantityInputElement.value = initialQuantity;

  function updateTotalDisplay(currentQuantity) {
    const total = selectedProduct.price * currentQuantity;
    totalPriceSpan.textContent = `${total}₴`;
  }

  const minQuantity = 1;
  const maxQuantity = 10;

  quantityInputElement.setAttribute('min', String(minQuantity));
  quantityInputElement.setAttribute('max', String(maxQuantity));

  function updateQuantityButtonStates(currentValue) {
    minusButton.disabled = currentValue <= minQuantity;
    plusButton.disabled = currentValue >= maxQuantity;
  }

  updateTotalDisplay(initialQuantity);
  updateQuantityButtonStates(initialQuantity);

  plusButton.addEventListener('click', () => {
    let currentValue = parseInt(quantityInputElement.value, 10);
    if (isNaN(currentValue)) currentValue = minQuantity;

    if (currentValue < maxQuantity) {
      // currentValue++;
      quantityInputElement.value = currentValue;
      updateTotalDisplay(currentValue);
      updateQuantityButtonStates(currentValue);
    }
  });

  minusButton.addEventListener('click', () => {
    let currentValue = parseInt(quantityInputElement.value, 10);
    if (isNaN(currentValue)) currentValue = minQuantity;

    if (currentValue > minQuantity) {
      // currentValue--;
      quantityInputElement.value = currentValue;
      updateTotalDisplay(currentValue);
      updateQuantityButtonStates(currentValue);
    }
  });

  quantityInputElement.addEventListener('change', () => {
    let currentValue = parseInt(quantityInputElement.value, 10);
    if (isNaN(currentValue) || currentValue < minQuantity) {
      currentValue = minQuantity;
    } else if (currentValue > maxQuantity) {
      currentValue = maxQuantity;
    }
    quantityInputElement.value = currentValue;
    updateTotalDisplay(currentValue);
    updateQuantityButtonStates(currentValue);
  });

  deleteProductButton.addEventListener('click', function() {
    displayEmptyCart();
    // Optional: window.history.replaceState({}, document.title, window.location.pathname);
  });

  // --- Add navigation for continue and checkout buttons ---
  if (continueShoppingButton) {
    continueShoppingButton.addEventListener('click', function() {
      window.location.href = './index.html';
    });
  }

  if (checkoutButton) {
    checkoutButton.addEventListener('click', function() {
      // Ensure you have an order.html page in the same directory
      window.location.href = './order.html';
    });
  }
});