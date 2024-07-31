document.addEventListener('DOMContentLoaded', () => {
  const cart = [];
  const cartQuantity = document.getElementById('cart-quantity');
  const cartItems = document.getElementById('cart-items');
  const checkoutButton = document.getElementById('checkout-button');
  const modal = document.getElementById('checkout-modal');
  const closeButton = document.querySelector('.close-button');
  const checkoutForm = document.getElementById('checkout-form');
  const orderSummary = document.getElementById('order-summary');
  const totalAmountElement = document.getElementById('total-amount');
  const orderNowButton = document.getElementById('order-now-button');
  
  fetch('data.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      renderProducts(data);
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });

  function renderProducts(products) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';
    products.forEach(product => {
      const productCard = document.createElement('div');
      productCard.classList.add('product-card');
      
      const image = document.createElement('img');
      image.src = product.image.thumbnail;
      image.alt = product.name;
      
      const title = document.createElement('h2');
      title.textContent = product.name;
      
      const category = document.createElement('p');
      category.textContent = product.category;
      
      const price = document.createElement('p');
      price.textContent = `$${product.price.toFixed(2)}`;
      
      const button = document.createElement('button');
      button.textContent = 'Add to Cart';
      button.addEventListener('click', () => addToCart(product.name, product.price));
      
      productCard.appendChild(image);
      productCard.appendChild(title);
      productCard.appendChild(category);
      productCard.appendChild(price);
      productCard.appendChild(button);
      productList.appendChild(productCard);
    });
  }

  window.addToCart = function(name, price) {
    const item = cart.find(item => item.name === name);
    if (item) {
      item.quantity++;
    } else {
      cart.push({ name, price, quantity: 1 });
    }
    updateCart();
  };

  function updateCart() {
    cartQuantity.textContent = cart.reduce((acc, item) => acc + item.quantity, 0);
    cartItems.innerHTML = '';
    cart.forEach(item => {
      const cartItem = document.createElement('div');
      cartItem.classList.add('cart-item');
      cartItem.innerHTML = `
        <p>${item.name} x${item.quantity}</p>
        <p>$${(item.price * item.quantity).toFixed(2)}</p>
      `;
      cartItems.appendChild(cartItem);
    });
    updateOrderSummary();
  }

  function updateOrderSummary() {
    orderSummary.innerHTML = '';
    cart.forEach(item => {
      const orderCard = document.createElement('div');
      orderCard.classList.add('order-card');
      
      const image = document.createElement('img');
      image.src = 'path/to/default-image.jpg'; // Ürün resmi yerleştirin
      image.alt = item.name;

      const details = document.createElement('div');
      details.innerHTML = `
        <p>${item.name} x${item.quantity}</p>
        <p>$${(item.price * item.quantity).toFixed(2)}</p>
      `;
      
      orderCard.appendChild(image);
      orderCard.appendChild(details);
      orderSummary.appendChild(orderCard);
    });

    const totalAmount = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    totalAmountElement.innerHTML = `<p>Toplam Tutar: $${totalAmount.toFixed(2)}</p>`;
  }

  checkoutButton.addEventListener('click', () => {
    modal.style.display = 'block';
  });

  closeButton.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });

  orderNowButton.addEventListener('click', () => {
    alert('Siparişiniz alındı!');
    modal.style.display = 'none';
    cart.length = 0;
    updateCart();
  });
});
