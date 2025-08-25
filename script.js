console.log("cart", JSON.parse(localStorage['cart'] || '[]'))

// Global variables
let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
let productsPerPage = 6; // Number of products to show per page
let totalPages = 1;

// Allergeni page variables
let currentFilters = [];
let allProductsAllergeni = [];

// Initialize filter toggle functionality for mobile and universal mobile menu
document.addEventListener('DOMContentLoaded', function() {
    // Universal mobile menu functionality for all pages
    setupMobileMenuHandlers();
    
    // Initialize cart badge
    updateCartBadge([]);

    // Initialize allergeni page if we're on it
    if (window.location.pathname.includes('allergeni.html')) {
        loadProductsAllergeni();
        setupFilterHandlers();
        setupModalHandlers();
        setupSmoothScrolling();
    }
    
    // Initialize prodotti page if we're on it
    if (window.location.pathname.includes('prodotti.html')) {
        addProductItem();
        setupModalHandlers();
        // Try multiple times to setup dropdowns
        setupFilterDropdowns();
        setTimeout(setupFilterDropdowns, 100);
        setTimeout(setupFilterDropdowns, 500);
        setTimeout(setupFilterDropdowns, 1000);
    }
});

// Setup filter dropdown functionality - FIXED VERSION
function setupFilterDropdowns() {
    console.log('=== DROPDOWN SETUP START ===');
    console.log('Current pathname:', window.location.pathname);
    console.log('Includes prodotti.html:', window.location.pathname.includes('prodotti.html'));
    
    // Check if we're on the right page
    if (!window.location.pathname.includes('prodotti.html')) {
        console.log('❌ Not on products page');
        return;
    }

    // Get elements
    const categoryBtn = document.querySelector('#category-btn');
    const sortBtn = document.querySelector('#sort-btn');
    const categoryDropdown = document.querySelector('#category-dropdown');
    const sortDropdown = document.querySelector('#sort-dropdown');
    const clearFiltersBtn = document.querySelector('#clear-filters');
    
    console.log('=== ELEMENT SEARCH RESULTS ===');
    console.log('categoryBtn:', categoryBtn);
    console.log('sortBtn:', sortBtn);
    console.log('categoryDropdown:', categoryDropdown);
    console.log('sortDropdown:', sortDropdown);
    console.log('clearFiltersBtn:', clearFiltersBtn);

    if (!categoryBtn || !sortBtn || !categoryDropdown || !sortDropdown) {
        console.log('❌ Missing elements, aborting setup');
        console.log('Will retry later...');
        return;
    }
    
    console.log('✅ All elements found! Setting up click handlers...');
    
    let currentCategory = '';
    let currentSort = '';
    
    // Category button handler
    categoryBtn.onclick = function(event) {
        event.preventDefault();
        event.stopPropagation();
        console.log('Category button clicked!');
        
        // Close sort dropdown
        sortDropdown.classList.remove('show');
        sortBtn.classList.remove('active');
        
        // Toggle category dropdown
        if (categoryDropdown.classList.contains('show')) {
            categoryDropdown.classList.remove('show');
            categoryBtn.classList.remove('active');
        } else {
            categoryDropdown.classList.add('show');
            categoryBtn.classList.add('active');
        }
    };
    
    // Sort button handler
    sortBtn.onclick = function(event) {
        event.preventDefault();
        event.stopPropagation();
        console.log('Sort button clicked!');
        
        // Close category dropdown
        categoryDropdown.classList.remove('show');
        categoryBtn.classList.remove('active');
        
        // Toggle sort dropdown
        if (sortDropdown.classList.contains('show')) {
            sortDropdown.classList.remove('show');
            sortBtn.classList.remove('active');
        } else {
            sortDropdown.classList.add('show');
            sortBtn.classList.add('active');
        }
    };
    
    // Category options
    categoryDropdown.querySelectorAll('.filter-option').forEach(option => {
        option.onclick = function() {
            const value = this.dataset.value;
            console.log('Category selected:', value);
            
            currentCategory = value;
            const span = categoryBtn.querySelector('span');
            if (span) span.textContent = value ? this.textContent : 'Categoria';
            
            categoryDropdown.classList.remove('show');
            categoryBtn.classList.remove('active');
            
            // Apply the actual filtering
            filterProducts(value);
            
            if (clearFiltersBtn) {
                clearFiltersBtn.style.display = (currentCategory || currentSort) ? 'flex' : 'none';
            }
        };
    });
    
    // Sort options
    sortDropdown.querySelectorAll('.filter-option').forEach(option => {
        option.onclick = function() {
            const value = this.dataset.value;
            console.log('Sort selected:', value);
            
            currentSort = value;
            const span = sortBtn.querySelector('span');
            if (span) span.textContent = value ? this.textContent : 'Ordina per';
            
            sortDropdown.classList.remove('show');
            sortBtn.classList.remove('active');
            
            // Apply the actual sorting
            if (value) {
                sortProducts(value);
            }
            
            if (clearFiltersBtn) {
                clearFiltersBtn.style.display = (currentCategory || currentSort) ? 'flex' : 'none';
            }
        };
    });
    
    // Clear button
    if (clearFiltersBtn) {
        clearFiltersBtn.onclick = function() {
            console.log('Clear filters clicked');
            currentCategory = '';
            currentSort = '';
            
            const categorySpan = categoryBtn.querySelector('span');
            const sortSpan = sortBtn.querySelector('span');
            if (categorySpan) categorySpan.textContent = 'Categoria';
            if (sortSpan) sortSpan.textContent = 'Ordina per';
            
            clearFiltersBtn.style.display = 'none';
            
            // Reset to show all products
            filterProducts('');
        };
    }
    
    // Close on outside click
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.filter-dropdown')) {
            categoryDropdown.classList.remove('show');
            sortDropdown.classList.remove('show');
            categoryBtn.classList.remove('active');
            sortBtn.classList.remove('active');
        }
    });
    
    console.log('✅ Dropdown setup complete!');
}

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

// ========== ALLERGENI PAGE FUNCTIONS ==========

// Carica prodotti dal data.json per la pagina allergeni
async function loadProductsAllergeni() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        allProductsAllergeni = data.prodotti;
        displayProductsAllergeni(allProductsAllergeni);
        updateResultsCount(allProductsAllergeni.length);
    } catch (error) {
        console.error('Errore nel caricamento dei prodotti:', error);
    }
}

// Setup gestori eventi per i filtri allergeni
function setupFilterHandlers() {
    const checkboxes = document.querySelectorAll('input[name="allergeni"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', handleFilterChange);
    });
}

// Gestisce i cambiamenti nei filtri allergeni
function handleFilterChange() {
    currentFilters = Array.from(document.querySelectorAll('input[name="allergeni"]:checked'))
        .map(cb => cb.value);
    
    const filteredProducts = filterProductsAllergeni(allProductsAllergeni, currentFilters);
    displayProductsAllergeni(filteredProducts);
    updateResultsCount(filteredProducts.length);
}

// Filtra i prodotti basandosi sui filtri selezionati
function filterProductsAllergeni(products, filters) {
    if (filters.length === 0) {
        return products;
    }
    
    return products.filter(product => {
        return !filters.some(filter => 
            product.allergeni && product.allergeni.includes(filter)
        );
    });
}

// Mostra i prodotti nella griglia allergeni
function displayProductsAllergeni(products) {
    const grid = document.getElementById('products-grid');
    
    if (!grid) return;
    
    if (products.length === 0) {
        grid.innerHTML = `
            <div class="no-results">
                <div class="no-results-icon">
                    <i class="fas fa-search"></i>
                </div>
                <h3>Nessun prodotto trovato</h3>
                <p>Prova a modificare i filtri per vedere più prodotti</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = products.map(product => `
        <div class="product-card ${getSafetyClass(product)}" onclick="openProductModal('${product.id}')">
            <div class="product-image">
                <img src="${product.immagine}" alt="${product.nome}" loading="lazy">
                <div class="safety-badge ${getSafetyClass(product)}">
                    <i class="fas ${getSafetyIcon(product)}"></i>
                </div>
            </div>
            <div class="product-info">
                <h3>${product.nome}</h3>
                <p class="product-price">€${product.prezzo.toFixed(2)}</p>
                <div class="allergen-info">
                    ${getAllergenDisplay(product)}
                </div>
                <div class="product-actions">
                    <button class="btn-detail" onclick="event.stopPropagation(); openProductModal('${product.id}')">
                        <i class="fas fa-info-circle"></i>
                        Dettagli
                    </button>
                    <button class="btn-cart" onclick="event.stopPropagation(); addToCart('${product.id}')">
                        <i class="fas fa-cart-plus"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Determina la classe di sicurezza per il prodotto
function getSafetyClass(product) {
    if (!product.allergeni || product.allergeni.length === 0) {
        return 'safe';
    }
    
    const highRiskAllergens = ['glutine', 'frutta-secca', 'sesamo'];
    const hasHighRisk = product.allergeni.some(allergen => 
        highRiskAllergens.includes(allergen)
    );
    
    return hasHighRisk ? 'warning' : 'caution';
}

// Determina l'icona di sicurezza
function getSafetyIcon(product) {
    const safetyClass = getSafetyClass(product);
    switch(safetyClass) {
        case 'safe': return 'fa-check-circle';
        case 'caution': return 'fa-exclamation-triangle';
        case 'warning': return 'fa-exclamation-circle';
        default: return 'fa-question-circle';
    }
}

// Visualizza informazioni allergeni
function getAllergenDisplay(product) {
    if (!product.allergeni || product.allergeni.length === 0) {
        return '<span class="safe-indicator"><i class="fas fa-check"></i> Nessun allergene</span>';
    }
    
    return `<span class="allergen-warning"><i class="fas fa-exclamation-triangle"></i> Contiene: ${product.allergeni.join(', ')}</span>`;
}

// Aggiorna il conteggio dei risultati
function updateResultsCount(count) {
    const countElement = document.getElementById('filtered-count');
    if (countElement) {
        countElement.textContent = count;
    }
}

// Cancella tutti i filtri
function clearFilters() {
    document.querySelectorAll('input[name="allergeni"]').forEach(cb => cb.checked = false);
    currentFilters = [];
    displayProductsAllergeni(allProductsAllergeni);
    updateResultsCount(allProductsAllergeni.length);
}

// Apre il modal con i dettagli del prodotto
function openProductModal(productId) {
    const product = allProductsAllergeni.find(p => p.id === productId);
    if (!product) return;
    
    const modal = document.getElementById('product-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.querySelector('.modal-product-details');
    
    if (!modal || !modalTitle || !modalBody) return;
    
    modalTitle.textContent = product.nome;
    modalBody.innerHTML = `
        <div class="modal-image">
            <img src="${product.immagine}" alt="${product.nome}">
            <div class="safety-badge ${getSafetyClass(product)}">
                <i class="fas ${getSafetyIcon(product)}"></i>
                <span>${getSafetyText(product)}</span>
            </div>
        </div>
        <div class="modal-details">
            <div class="detail-section">
                <h4>Descrizione</h4>
                <p>${product.descrizione}</p>
            </div>
            <div class="detail-section">
                <h4>Prezzo</h4>
                <p class="price">€${product.prezzo.toFixed(2)}</p>
            </div>
            <div class="detail-section allergen-section">
                <h4>Informazioni Allergeni</h4>
                ${getAllergenDetails(product)}
            </div>
            <div class="modal-actions">
                <button class="btn-primary" onclick="addToCart('${product.id}')">
                    <i class="fas fa-cart-plus"></i>
                    Aggiungi al Carrello
                </button>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
}

// Ottiene il testo di sicurezza
function getSafetyText(product) {
    const safetyClass = getSafetyClass(product);
    switch(safetyClass) {
        case 'safe': return 'Sicuro';
        case 'caution': return 'Attenzione';
        case 'warning': return 'Allergeni Presenti';
        default: return 'Controllare';
    }
}

// Ottiene i dettagli degli allergeni per il modal
function getAllergenDetails(product) {
    if (!product.allergeni || product.allergeni.length === 0) {
        return '<p class="safe-message"><i class="fas fa-check-circle"></i> Questo prodotto non contiene allergeni noti.</p>';
    }
    
    return `
        <div class="allergen-warning-box">
            <p><i class="fas fa-exclamation-triangle"></i> <strong>Attenzione:</strong> Questo prodotto contiene i seguenti allergeni:</p>
            <ul class="allergen-list">
                ${product.allergeni.map(allergen => `
                    <li><i class="fas fa-circle"></i> ${allergen.charAt(0).toUpperCase() + allergen.slice(1)}</li>
                `).join('')}
            </ul>
            <p class="warning-note">Se soffri di allergie, consulta sempre l'etichetta del prodotto prima del consumo.</p>
        </div>
    `;
}

// Sistema di notifiche
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Gestione modal
function setupModalHandlers() {
    const modal = document.getElementById('product-modal');
    const closeBtn = document.querySelector('.close');
    
    if (closeBtn) {
        closeBtn.onclick = function() {
            if (modal) modal.style.display = 'none';
        }
    }
    
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
}

// Gestione menu mobile universale
function setupMobileMenuHandlers() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            this.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on a link
        const mobileMenuLinks = mobileMenu.querySelectorAll('a');
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!mobileMenuBtn.contains(event.target) && !mobileMenu.contains(event.target)) {
                mobileMenu.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            }
        });
    }
}

// Smooth scrolling per i link interni
function setupSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
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
  const container = document.querySelector('.product-grid');
  if (!container) {
    console.error('No product-grid container found');
    return;
  }
  
  console.log('Container found:', container);
  console.log('Products to render:', products);
  
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
      
      // Use category field if available, otherwise fallback to name matching
      if (product.category) {
        return product.category === category;
      }
      
      // Fallback to old system for backward compatibility
      switch(category) {
        case 'snack-dolci':
        case 'dolci':
          return productName.includes('barretta') || productName.includes('biscotti') || 
                 productName.includes('caramelle') || productName.includes('wafer') ||
                 productName.includes('smoothie') || productName.includes('muffin') ||
                 productName.includes('brownie') || productName.includes('popcorn') ||
                 productName.includes('mousse') || productName.includes('gelato');
        case 'snack-salati':
        case 'salati':
          return productName.includes('crackers') || productName.includes('patatine') || 
                 productName.includes('grissini') || productName.includes('pretzel') ||
                 productName.includes('wrap');
        case 'bevande':
          return productName.includes('smoothie') || productName.includes('succo') ||
                 productName.includes('tè') || productName.includes('frullato') ||
                 productName.includes('tisana') || productName.includes('kombucha') ||
                 productName.includes('cioccolata');
        case 'healthy':
        case 'sani':
          return productName.includes('mix') || productDesc.includes('omega') ||
                 productDesc.includes('vitamine') || productDesc.includes('antiossidanti') ||
                 productName.includes('chips') || productName.includes('barretta proteica') ||
                 productName.includes('yogurt') || productName.includes('granola') ||
                 productName.includes('energy balls') || productName.includes('tartine');
        default:
          return true;
      }
    });
  }
  renderProducts(filteredProducts);
  updatePagination();
}

// Function to get URL parameters
function getURLParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

// Function to apply filter from URL parameter
function applyURLFilter() {
  const category = getURLParameter('category');
  if (category) {
    // Update category select if it exists
    const categorySelect = document.querySelector('#category');
    if (categorySelect) {
      categorySelect.value = category;
    }
    
    // Apply the filter
    filterProducts(category);
    
    // Show notification
    const categoryNames = {
      'snack-dolci': 'Snack Dolci',
      'snack-salati': 'Snack Salati',
      'bevande': 'Bevande',
      'healthy': 'Healthy'
    };
    
    if (categoryNames[category]) {
      showNotification(`Filtro applicato: ${categoryNames[category]}`, 'success');
    }
  }
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
  updatePagination();
}

// Initialize filter and sort event listeners
function initializeFilters() {
  console.log('Initializing filters...');
  const categorySelect = document.getElementById('category');
  const sortSelect = document.getElementById('sort');
  
  console.log('Category select:', categorySelect);
  console.log('Sort select:', sortSelect);
  
  if (categorySelect) {
    categorySelect.addEventListener('change', (e) => {
      console.log('Category changed to:', e.target.value);
      filterProducts(e.target.value);
    });
  }
  
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      console.log('Sort changed to:', e.target.value);
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
  
  // Apply filter from URL parameter if present
  if (window.location.pathname.includes('prodotti.html')) {
    // Wait a bit for products to load before applying filter
    setTimeout(() => {
      applyURLFilter();
    }, 500);
  }
  
  // Use event delegation for add-to-cart buttons (single approach to avoid duplicates)
  document.addEventListener('click', (event) => {
    if (event.target.classList.contains('add-to-cart')) {
      event.preventDefault();
      console.log('Add to cart clicked via delegation:', event.target);
      handleAddToCart(event.target);
    }
  });
});

