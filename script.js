console.log("cart", JSON.parse(localStorage['cart'] || '[]'))

// Global variables
let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
let productsPerPage = 6; // Number of products to show per page
let totalPages = 1;

function addCartItems(carrello){
  let cartItems = document.querySelectorAll(".cart-items")[0];
  if(cartItems){
    console.log("cart", cartItems)
    carrello.forEach((item)=>{
      const cartItem = document.createTextNode(item.nome)
      cartItems.appendChild(cartItem)
      cartItems.appendChild(document.createElement('br'))
    })
  }
}

function updateCartBadge(items) {
  let badge = document.querySelectorAll(".cart-badge")[0] || document.querySelectorAll(".cart-count")[0]
  console.log("carrello", items,badge)
  if(badge) {
    badge.innerHTML = items || 0 
  }
}

// Enhanced utility functions for better UX
function animateValue(element, start, end, duration, prefix = '') {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const current = start + (end - start) * progress;
    element.textContent = `${prefix}${current.toFixed(2)}`;
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

function showNotification(message, type = 'success') {
  // Remove existing notifications
  const existingNotifications = document.querySelectorAll('.notification');
  existingNotifications.forEach(notification => notification.remove());
  
  const notification = document.createElement('div');
  notification.className = `notification ${type === 'success' ? 'success-message' : 'error-message'} fade-in`;
  notification.innerHTML = `
    <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
    <span>${message}</span>
    <button onclick="this.parentElement.remove()" style="margin-left: auto; background: none; border: none; color: inherit; cursor: pointer;">
      <i class="fas fa-times"></i>
    </button>
  `;
  
  notification.style.position = 'fixed';
  notification.style.top = '100px';
  notification.style.right = '20px';
  notification.style.zIndex = '1001';
  notification.style.maxWidth = '400px';
  notification.style.minWidth = '300px';
  
  document.body.appendChild(notification);
  
  // Auto remove after 4 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.style.opacity = '0';
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => notification.remove(), 300);
    }
  }, 4000);
}

function addLoadingState(button) {
  const originalText = button.innerHTML;
  button.innerHTML = '<span class="loading"></span> Caricamento...';
  button.disabled = true;
  
  return () => {
    button.innerHTML = originalText;
    button.disabled = false;
  };
}

// Enhanced product rendering with loading states
function renderProducts(products) {
  const container = document.querySelectorAll('.product-grid')[0];
  if (!container) {
    console.log('No product-grid container found');
    return;
  }
  
  // Calculate pagination
  totalPages = Math.ceil(products.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const productsToShow = products.slice(startIndex, endIndex);
  
  console.log(`Rendering page ${currentPage}: showing ${productsToShow.length} of ${products.length} products`);
  
  // Add loading skeleton
  container.innerHTML = Array(productsPerPage).fill(0).map(() => 
    '<div class="loading-skeleton" style="height: 400px; border-radius: 12px;"></div>'
  ).join('');
  
  // Simulate loading for better UX
  setTimeout(() => {
    // Clear existing products
    container.innerHTML = '';
    
    productsToShow.forEach((prodotto, index) => {
      // Find the index in the allProducts array for proper data-product-index
      const globalIndex = allProducts.findIndex(p => p === prodotto);
      const item = document.createElement('div');
      item.classList.add("product-card", "fade-in", "hover-lift");
      item.innerHTML = `
        <img src="${prodotto.image || 'img/prodotto1.jpg'}" alt="${prodotto.name || 'Product'}" loading="lazy">
        <h3>${prodotto.title || 'Untitled'}</h3>
        <p class="desc">${prodotto.desc || ''}</p>
        <p class="price">€${prodotto.price || '0.00'}</p>
        <button class="add-to-cart hover-scale" data-product-index="${globalIndex}">
          <i class="fas fa-cart-plus"></i>
          Aggiungi al Carrello
        </button>
      `;
      
      // Add staggered animation delay
      item.style.animationDelay = `${index * 0.1}s`;
      container.appendChild(item);
    });
    
    console.log('Products rendered, checking buttons...');
    const buttons = document.querySelectorAll('.add-to-cart');
    console.log('Buttons found after rendering:', buttons.length);
    
    // Update pagination display
    updatePagination();
  }, 300);
}

function addProductItem(){
  fetch('data.json')
    .then(res => res.json())
    .then(prodotti => {
      console.log('Loaded products:', prodotti);
      allProducts = prodotti;
      filteredProducts = [...prodotti];
      renderProducts(filteredProducts);
    })
    .catch(error => {
      console.error('Error loading products:', error);
    });
}

// Enhanced handleAddToCart with better UX
function handleAddToCart(bottone) {
  console.log('handleAddToCart called with:', bottone);
  
  // Add loading state
  const removeLoading = addLoadingState(bottone);
  
  setTimeout(() => {
    let carrello = JSON.parse(localStorage['cart'] || '[]');
    let productIndex = parseInt(bottone.getAttribute("data-product-index"));
    
    console.log('Product index:', productIndex);
    console.log('All products length:', allProducts.length);
    
    // Validate productIndex and array - use allProducts instead of filteredProducts
    if (isNaN(productIndex) || productIndex < 0 || productIndex >= allProducts.length) {
      console.error('Invalid product index:', productIndex);
      showNotification('Errore: prodotto non trovato', 'error');
      removeLoading();
      return;
    }
    
    // Get the full product object from allProducts array
    let fullProduct = allProducts[productIndex];
    console.log('Selected product:', fullProduct);
    
    if (fullProduct && (fullProduct.name || fullProduct.title)) {
      carrello.push(fullProduct);
      localStorage['cart'] = JSON.stringify(carrello);
      
      // Show success notification
      showNotification(`${fullProduct.name || fullProduct.title} è stato aggiunto al carrello!`, 'success');
      
      // Add visual feedback to button
      bottone.innerHTML = '<i class="fas fa-check"></i> Aggiunto!';
      bottone.style.background = 'linear-gradient(135deg, #27ae60, #2ecc71)';
      
      // Reset button after 2 seconds
      setTimeout(() => {
        bottone.innerHTML = '<i class="fas fa-cart-plus"></i> Aggiungi al Carrello';
        bottone.style.background = '';
      }, 2000);
      
      updateCartBadge(carrello.length);
    } else {
      console.error('Invalid product object:', fullProduct);
      showNotification('Errore: dati prodotto non validi', 'error');
    }
    
    removeLoading();
  }, 500); // Simulate processing time
}

// Filter products by category
function filterProducts(category) {
  if (category === '' || category === 'all') {
    filteredProducts = [...allProducts];
  } else {
    filteredProducts = allProducts.filter(product => {
      const productName = product.name.toLowerCase();
      const productTitle = product.title.toLowerCase();
      const productDesc = product.desc.toLowerCase();
      
      switch(category) {
        case 'dolci':
          return productName.includes('barretta') || productName.includes('biscotti') || 
                 productName.includes('caramelle') || productName.includes('wafer') ||
                 productName.includes('smoothie');
        case 'salati':
          return productName.includes('crackers') || productName.includes('patatine') || 
                 productName.includes('grissini');
        case 'sani':
          return productName.includes('mix') || productDesc.includes('omega') ||
                 productDesc.includes('vitamine') || productDesc.includes('antiossidanti');
        default:
          return true;
      }
    });
  }
  renderProducts(filteredProducts);
}

// Add pagination functions
function updatePagination() {
  const paginationContainer = document.querySelector('.pagination');
  if (!paginationContainer) {
    console.log('No pagination container found');
    return;
  }
  
  // Clear existing pagination
  paginationContainer.innerHTML = '';
  
  // Previous button
  const prevButton = document.createElement('a');
  prevButton.href = '#';
  prevButton.innerHTML = '&laquo;';
  prevButton.className = currentPage === 1 ? 'disabled' : '';
  prevButton.onclick = (e) => {
    e.preventDefault();
    if (currentPage > 1) {
      currentPage--;
      renderProducts(filteredProducts);
    }
  };
  paginationContainer.appendChild(prevButton);
  
  // Page numbers
  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement('a');
    pageButton.href = '#';
    pageButton.innerHTML = i;
    pageButton.className = i === currentPage ? 'active' : '';
    pageButton.onclick = (e) => {
      e.preventDefault();
      currentPage = i;
      renderProducts(filteredProducts);
    };
    paginationContainer.appendChild(pageButton);
  }
  
  // Next button
  const nextButton = document.createElement('a');
  nextButton.href = '#';
  nextButton.innerHTML = '&raquo;';
  nextButton.className = currentPage === totalPages ? 'disabled' : '';
  nextButton.onclick = (e) => {
    e.preventDefault();
    if (currentPage < totalPages) {
      currentPage++;
      renderProducts(filteredProducts);
    }
  };
  paginationContainer.appendChild(nextButton);
}

// Update filter and sort functions to reset pagination
function filterProducts(category) {
  currentPage = 1; // Reset to first page when filtering
  if (category === '' || category === 'all') {
    filteredProducts = [...allProducts];
  } else {
    filteredProducts = allProducts.filter(product => {
      const productName = product.name.toLowerCase();
      const productTitle = product.title.toLowerCase();
      const productDesc = product.desc.toLowerCase();
      
      switch(category) {
        case 'dolci':
          return productName.includes('barretta') || productName.includes('biscotti') || 
                 productName.includes('caramelle') || productName.includes('wafer') ||
                 productName.includes('smoothie');
        case 'salati':
          return productName.includes('crackers') || productName.includes('patatine') || 
                 productName.includes('grissini');
        case 'sani':
          return productName.includes('mix') || productDesc.includes('omega') ||
                 productDesc.includes('vitamine') || productDesc.includes('antiossidanti');
        default:
          return true;
      }
    });
  }
  renderProducts(filteredProducts);
}

// Sort products
function sortProducts(sortBy) {
  currentPage = 1; // Reset to first page when sorting
  switch(sortBy) {
    case 'prezzo-basso':
      filteredProducts.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
      break;
    case 'prezzo-alto':
      filteredProducts.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
      break;
    case 'popolari':
      // Sort by name alphabetically as popularity metric
      filteredProducts.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case 'nome':
      filteredProducts.sort((a, b) => a.title.localeCompare(b.title));
      break;
    default:
      // Keep original order
      break;
  }
  renderProducts(filteredProducts);
}

// Initialize filter and sort event listeners
function initializeFilters() {
  const categorySelect = document.querySelector('.filter-options select:first-child');
  const sortSelect = document.querySelector('.filter-options select:last-child');
  
  if (categorySelect) {
    categorySelect.addEventListener('change', (e) => {
      filterProducts(e.target.value);
    });
  }
  
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      sortProducts(e.target.value);
    });
  }
}

// Enhanced Cart page functionality
function loadCartPage() {
  const cartItemsContainer = document.getElementById('cart-items');
  
  if (!cartItemsContainer) return; // Not on cart page
  
  let carrello = JSON.parse(localStorage.getItem('cart') || '[]');
  
  // Show loading state
  cartItemsContainer.innerHTML = '<div class="loading-skeleton" style="height: 200px; border-radius: 12px;"></div>';
  
  // Simulate loading delay for better UX
  setTimeout(() => {
    // Group items by name and count quantities
    const groupedItems = {};
    carrello.forEach(item => {
      // Use name as the key for grouping (could be item.name or item.title)
      const itemKey = item.name || item.nome;
      if (groupedItems[itemKey]) {
        groupedItems[itemKey].quantity += 1;
      } else {
        groupedItems[itemKey] = {
          ...item, // Spread the full product object
          quantity: 1
        };
      }
    });
    
    // Clear loading state
    cartItemsContainer.innerHTML = '';
    
    let subtotal = 0;
    
    if (carrello.length === 0) {
      cartItemsContainer.innerHTML = `
        <div class="empty-cart text-center">
          <i class="fas fa-shopping-cart"></i>
          <h3>Il tuo carrello è vuoto</h3>
          <p class="text-secondary mb-medium">Aggiungi alcuni snack per iniziare!</p>
          <a href="prodotti.html" class="btn">
            <i class="fas fa-arrow-left"></i>
            Continua lo shopping
          </a>
        </div>
      `;
    } else {
      Object.values(groupedItems).forEach(item => {
        const itemPrice = parseFloat(item.price) || item.prezzo || 0;
        const itemName = item.name || item.nome;
        const itemTitle = item.title || item.nome;
        const itemTotal = itemPrice * item.quantity;
        subtotal += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item fade-in';
        cartItem.innerHTML = `
          <img src="${item.image || 'img/prodotto1.jpg'}" alt="${itemName || 'Product'}" loading="lazy">
          <div class="item-details">
            <h3>${itemTitle || 'Untitled'}</h3>
            <p class="desc">${item.desc || ''}</p>
            <p class="font-bold">€${itemPrice.toFixed(2)}</p>
            <div class="quantity-controls">
              <button onclick="changeQuantity('${itemName}', -1)" title="Diminuisci quantità">
                <i class="fas fa-minus"></i>
              </button>
              <span class="font-semibold">${item.quantity}</span>
              <button onclick="changeQuantity('${itemName}', 1)" title="Aumenta quantità">
                <i class="fas fa-plus"></i>
              </button>
            </div>
            <button class="remove-btn" onclick="removeFromCart('${itemName}')" title="Rimuovi dal carrello">
              <i class="fas fa-trash"></i>
              Rimuovi
            </button>
          </div>
        `;
        cartItemsContainer.appendChild(cartItem);
      });
    }
    
    // Update summary with animation
    const shipping = 2.50;
    const total = subtotal + shipping;
    
    const subtotalElement = document.getElementById('subtotal');
    const totalElement = document.getElementById('total');
    
    if (subtotalElement) {
      animateValue(subtotalElement, 0, subtotal, 800, '€');
    }
    if (totalElement) {
      animateValue(totalElement, 0, total, 800, '€');
    }
  }, 300);
}

// Enhanced changeQuantity with notifications
function changeQuantity(itemName, change) {
  let carrello = JSON.parse(localStorage.getItem('cart') || '[]');
  
  if (change > 0) {
    // Add one more of this item
    const existingItem = carrello.find(item => (item.name || item.nome) === itemName);
    if (existingItem) {
      carrello.push({...existingItem}); // Add a copy of the full product object
      showNotification(`${itemName} quantità aumentata`, 'success');
    }
  } else {
    // Remove one of this item
    const itemIndex = carrello.findIndex(item => (item.name || item.nome) === itemName);
    if (itemIndex !== -1) {
      carrello.splice(itemIndex, 1);
      showNotification(`${itemName} quantità diminuita`, 'success');
    }
  }
  
  localStorage.setItem('cart', JSON.stringify(carrello));
  loadCartPage();
  updateCartBadge(carrello.length);
}

// Enhanced removeFromCart with confirmation
function removeFromCart(itemName) {
  if (confirm(`Sei sicuro di voler rimuovere ${itemName} dal carrello?`)) {
    let carrello = JSON.parse(localStorage.getItem('cart') || '[]');
    const initialLength = carrello.length;
    carrello = carrello.filter(item => (item.name || item.nome) !== itemName);
    
    localStorage.setItem('cart', JSON.stringify(carrello));
    loadCartPage();
    updateCartBadge(carrello.length);
    
    if (carrello.length < initialLength) {
      showNotification(`${itemName} rimosso dal carrello`, 'success');
    }
  }
}

// Enhanced clearCart with confirmation
function clearCart() {
  if (confirm('Sei sicuro di voler svuotare completamente il carrello?')) {
    localStorage.setItem('cart', JSON.stringify([]));
    loadCartPage();
    updateCartBadge(0);
    showNotification('Carrello svuotato', 'success');
  }
}

function initializeCartPage() {
  const clearCartBtn = document.getElementById('clear-cart');
  if (clearCartBtn) {
    clearCartBtn.addEventListener('click', clearCart);
  }
  loadCartPage();
}

// Ascolta i click sui bottoni "Aggiungi al carrello"
document.addEventListener("DOMContentLoaded", () => {
  console.log('DOM Content Loaded');
  let carrello = JSON.parse(localStorage['cart'] || '[]');
  addCartItems(carrello);
  updateCartBadge(carrello.length);
  addProductItem();
  initializeFilters();
  initializeCartPage(); // Initialize cart page if we're on cart page
  
  // Use event delegation for add-to-cart buttons (single approach to avoid duplicates)
  document.addEventListener('click', (event) => {
    if (event.target.classList.contains('add-to-cart')) {
      event.preventDefault();
      console.log('Add to cart clicked via delegation:', event.target);
      handleAddToCart(event.target);
    }
  });
});

