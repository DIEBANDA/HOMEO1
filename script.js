// DOM Elements
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const sidebar = document.querySelector('.sidebar');
const sidebarOverlay = document.querySelector('.sidebar-overlay');
const submenuItems = document.querySelectorAll('.submenu > a');
const cartCount = document.getElementById('cart-count');
const searchBtn = document.getElementById('searchBtn');
const searchInput = document.getElementById('searchInput');
const searchInputWrapper = document.getElementById('searchInputWrapper');
const sortSelect = document.getElementById('sort-by');
const categorySelect = document.getElementById('category-filter');
const checkoutBtn = document.querySelector('.checkout-btn');
const checkoutModal = document.getElementById('checkoutModal');
const checkoutClose = document.getElementById('checkoutClose');
const nextToPayment = document.getElementById('nextToPayment');
const backToShipping = document.getElementById('backToShipping');
const placeOrder = document.getElementById('placeOrder');
const returnToShop = document.getElementById('returnToShop');
const checkoutSteps = document.querySelectorAll('.checkout-step');
const checkoutForms = document.querySelectorAll('.checkout-form');
const clearCartBtn = document.querySelector('.clear-cart-btn');

// Product data
const products = {
    1: {
        id: 1,
        name: "Silk Satin Pajama Set",
        price: 89.99,
        oldPrice: 109.99,
        description: "Experience ultimate comfort with our premium silk satin pajama set. Made from 100% pure mulberry silk, this set offers a luxurious feel against your skin while keeping you at the perfect temperature all night long.",
        images: [
            "images/silk-pajama1.jpg",
            "images/silk-pajama2.jpg",
            "images/silk-pajama3.jpg"
        ],
        details: [
            "100% Pure Mulberry Silk",
            "Breathable and temperature regulating",
            "Hypoallergenic and gentle on skin",
            "Machine washable (delicate cycle)",
            "Includes top and bottom"
        ],
        category: "silk"
    },
    2: {
        id: 2,
        name: "Cotton Floral Pajama Set",
        price: 49.99,
        oldPrice: 59.99,
        description: "Soft and breathable cotton pajama set with beautiful floral pattern. Perfect for year-round comfort with its lightweight and airy fabric.",
        images: [
            "images/cotton-pajama1.jpg",
            "images/cotton-pajama2.jpg",
            "images/cotton-pajama3.jpg"
        ],
        details: [
            "100% Organic Cotton",
            "Lightweight and breathable",
            "Machine washable",
            "Elastic waistband for comfort",
            "Includes top and bottom"
        ],
        category: "cotton"
    },
    3: {
        id: 3,
        name: "Lace Trim Pajama Set",
        price: 65.99,
        description: "Elegant pajama set with delicate lace trim. Combines comfort with sophistication for a luxurious sleep experience.",
        images: [
            "images/lace-pajama1.jpg",
            "images/lace-pajama2.jpg",
            "images/lace-pajama3.jpg"
        ],
        details: [
            "Silk and cotton blend",
            "Delicate lace trim",
            "Hand wash recommended",
            "Adjustable drawstring waist",
            "Includes camisole and shorts"
        ],
        category: "lace"
    },
    4: {
        id: 4,
        name: "Winter Flannel Pajama Set",
        price: 79.99,
        oldPrice: 99.99,
        description: "Warm and cozy flannel pajama set perfect for cold winter nights. Soft brushed fabric for ultimate comfort.",
        images: [
            "images/winter-pajama1.jpg",
            "images/winter-pajama2.jpg",
            "images/winter-pajama3.jpg"
        ],
        details: [
            "100% Brushed Cotton Flannel",
            "Extra warm for winter",
            "Machine washable",
            "Button-up top with pocket",
            "Elastic waistband"
        ],
        category: "cotton"
    },
    5: {
        id: 5,
        name: "Premium Silk Robe",
        price: 99.99,
        description: "Luxurious silk robe with a comfortable fit. Perfect for lounging at home in style and comfort.",
        images: [
            "images/silk-robe1.jpg",
            "images/silk-robe2.jpg",
            "images/silk-robe3.jpg"
        ],
        details: [
            "100% Mulberry Silk",
            "Belted closure",
            "Deep pockets",
            "Machine wash cold",
            "Available in multiple colors"
        ],
        category: "silk"
    },
    6: {
        id: 6,
        name: "Organic Cotton Sleep Shirt",
        price: 39.99,
        description: "Comfortable and breathable sleep shirt made from organic cotton. Loose fit for maximum comfort.",
        images: [
            "images/cotton-shirt1.jpg",
            "images/cotton-shirt2.jpg",
            "images/cotton-shirt3.jpg"
        ],
        details: [
            "100% Organic Cotton",
            "Breathable and lightweight",
            "Machine washable",
            "Knee-length design",
            "Available in multiple colors"
        ],
        category: "cotton"
    }
};

// Initialize the page
document.addEventListener('DOMContentLoaded', function () {
    updateCartCount();
    initEventListeners();
    highlightCurrentPage();
    setupQuantityControls();
    initCartPage();
    initCheckout();
    setupProductLinks();
    loadProductDetails();
    
    // Handle category filter from URL
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    if (category && categorySelect) {
        categorySelect.value = category;
        filterProducts();
    }
});

// Initialize event listeners
function initEventListeners() {
    // Mobile menu toggle
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }
    
    // Close sidebar when clicking overlay
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', closeMobileMenu);
    }
    
    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', handleSearchInput);
    }
    
    if (searchBtn) {
        searchBtn.addEventListener('click', toggleSearch);
    }
    
    // Submenu toggle
    submenuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            this.parentElement.classList.toggle('active');
        });
    });
    
    // Sort and filter changes
    if (sortSelect) {
        sortSelect.addEventListener('change', filterProducts);
    }
    
    if (categorySelect) {
        categorySelect.addEventListener('change', filterProducts);
    }

    // Add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });

    // Category cards
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            window.location.href = `products.html?category=${category}`;
        });
    });

    // Clear cart button
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', clearCart);
    }

    // Thumbnail image clicks
    document.querySelectorAll('.thumbnail-images img').forEach(thumb => {
        thumb.addEventListener('click', function() {
            const mainImage = document.getElementById('main-product-image');
            mainImage.src = this.src;
        });
    });
}

// Setup product links to detail page
function setupProductLinks() {
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', function(e) {
            // Don't redirect if clicking on add to cart button or its children
            if (!e.target.closest('.add-to-cart')) {
                const productId = this.getAttribute('data-id');
                window.location.href = `product-detail.html?id=${productId}`;
            }
        });
    });
}

// Load product details on product detail page
function loadProductDetails() {
    if (window.location.pathname.includes('product-detail.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');
        
        if (productId && products[productId]) {
            const product = products[productId];
            const mainImage = document.getElementById('main-product-image');
            const thumbnailsContainer = document.querySelector('.thumbnail-images');
            
            // Set main product info
            document.getElementById('product-name').textContent = product.name;
            document.getElementById('product-price').textContent = `$${product.price.toFixed(2)}`;
            if (product.oldPrice) {
                document.querySelector('.old-price').textContent = `$${product.oldPrice.toFixed(2)}`;
                document.querySelector('.old-price').style.display = 'inline';
            }
            document.getElementById('product-description').textContent = product.description;
            
            // Set images
            mainImage.src = product.images[0];
            mainImage.alt = product.name;
            
            thumbnailsContainer.innerHTML = '';
            product.images.forEach((img, index) => {
                const thumb = document.createElement('img');
                thumb.src = img;
                thumb.alt = `${product.name} - ${index + 1}`;
                thumb.addEventListener('click', function() {
                    mainImage.src = this.src;
                });
                thumbnailsContainer.appendChild(thumb);
            });
            
            // Set details list
            const detailsList = document.getElementById('product-details-list');
            detailsList.innerHTML = '';
            product.details.forEach(detail => {
                const li = document.createElement('li');
                li.textContent = detail;
                detailsList.appendChild(li);
            });
            
            // Update add to cart button
            const addToCartBtn = document.querySelector('.add-to-cart');
            if (addToCartBtn) {
                addToCartBtn.setAttribute('data-id', product.id);
            }
        }
    }
}

// Toggle mobile menu
function toggleMobileMenu() {
    document.body.classList.toggle('sidebar-open');
    sidebar.classList.toggle('active');
    
    if (sidebar.classList.contains('active')) {
        mobileMenuBtn.innerHTML = '<i class="fas fa-times"></i>';
    } else {
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    }
}

// Close mobile menu
function closeMobileMenu() {
    document.body.classList.remove('sidebar-open');
    sidebar.classList.remove('active');
    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
}

// Update cart count
function updateCartCount() {
    if (cartCount) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// Filter and sort products
function filterProducts() {
    const sortValue = sortSelect ? sortSelect.value : 'default';
    const categoryValue = categorySelect ? categorySelect.value : 'all';
    const productCards = document.querySelectorAll('.product-card');
    
    // Convert NodeList to Array for sorting
    const productsArray = Array.from(productCards);
    
    // Filter by category
    let filteredProducts = productsArray;
    if (categoryValue !== 'all') {
        filteredProducts = productsArray.filter(product => 
            product.getAttribute('data-category') === categoryValue
        );
    }
    
    // Sort products
    switch (sortValue) {
        case 'price-low':
            filteredProducts.sort((a, b) => {
                const priceA = parseFloat(a.querySelector('.price').textContent.replace('$', ''));
                const priceB = parseFloat(b.querySelector('.price').textContent.replace('$', ''));
                return priceA - priceB;
            });
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => {
                const priceA = parseFloat(a.querySelector('.price').textContent.replace('$', ''));
                const priceB = parseFloat(b.querySelector('.price').textContent.replace('$', ''));
                return priceB - priceA;
            });
            break;
        case 'name-asc':
            filteredProducts.sort((a, b) => {
                const nameA = a.querySelector('.product-title').textContent.toLowerCase();
                const nameB = b.querySelector('.product-title').textContent.toLowerCase();
                return nameA.localeCompare(nameB);
            });
            break;
        case 'name-desc':
            filteredProducts.sort((a, b) => {
                const nameA = a.querySelector('.product-title').textContent.toLowerCase();
                const nameB = b.querySelector('.product-title').textContent.toLowerCase();
                return nameB.localeCompare(nameA);
            });
            break;
    }
    
    // Re-append sorted products
    const productsGrid = document.querySelector('.products-grid');
    if (productsGrid) {
        productsGrid.innerHTML = '';
        filteredProducts.forEach(product => {
            productsGrid.appendChild(product);
        });
        
        // Reattach event listeners after reordering
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', addToCart);
        });
    }
}

// Add to cart function
function addToCart(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const productId = parseInt(this.getAttribute('data-id'));
    const product = products[productId];
    
    if (!product) return;
    
    // Get selected options
    const selectedSize = document.querySelector('input[name="size"]:checked')?.value || 'M';
    const selectedColor = document.querySelector('input[name="color"]:checked')?.value || 'Default';
    const quantity = parseInt(document.getElementById('quantity')?.value) || 1;
    
    // Get product details
    const cartProduct = {
        id: productId,
        name: product.name,
        price: product.price,
        image: product.images[0],
        quantity: quantity,
        size: selectedSize,
        color: selectedColor
    };
    
    // Get or initialize cart
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if product already in cart
    const existingItemIndex = cart.findIndex(item => 
        item.id === productId && 
        item.size === selectedSize && 
        item.color === selectedColor
    );
    
    if (existingItemIndex >= 0) {
        cart[existingItemIndex].quantity += quantity;
    } else {
        cart.push(cartProduct);
    }
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count
    updateCartCount();
    
    // Change button style temporarily
    const button = this;
    const originalHTML = button.innerHTML;
    button.innerHTML = '<i class="fas fa-check"></i> Added!';
    button.style.backgroundColor = '#4CAF50';
    
    setTimeout(() => {
        button.innerHTML = originalHTML;
        button.style.backgroundColor = '';
    }, 2000);
    
    // Pulse animation for cart count
    if (cartCount) {
        cartCount.style.transform = 'scale(1.5)';
        setTimeout(() => {
            cartCount.style.transform = 'scale(1)';
        }, 300);
    }
    
    // Update cart page if we're on it
    if (document.getElementById('cart-items-list')) {
        displayCartItems();
    }
}

// Quantity controls functionality
function setupQuantityControls() {
    const quantityInput = document.getElementById('quantity');
    const minusBtn = document.querySelector('.quantity-minus');
    const plusBtn = document.querySelector('.quantity-plus');

    if (minusBtn && plusBtn && quantityInput) {
        minusBtn.addEventListener('click', (e) => {
            e.preventDefault();
            let currentValue = parseInt(quantityInput.value);
            if (currentValue > 1) {
                quantityInput.value = currentValue - 1;
            }
        });

        plusBtn.addEventListener('click', (e) => {
            e.preventDefault();
            let currentValue = parseInt(quantityInput.value);
            quantityInput.value = currentValue + 1;
        });
    }
}

// Display cart items
function displayCartItems() {
    const cartItemsList = document.getElementById('cart-items-list');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart.length === 0) {
        showEmptyCartMessage();
        updateCartSummaryEGP(0);
        return;
    }
    
    cartItemsList.innerHTML = '';
    
    let subtotal = 0;
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.dataset.index = index;
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <div class="cart-item-header">
                    <h3 class="cart-item-title">${item.name}</h3>
                    <button class="cart-item-remove" 
                         data-id="${item.id}" data-size="${item.size}" data-color="${item.color}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="cart-item-content">
                    <span class="cart-item-size">Size: ${item.size}</span>
                    <div class="cart-item-quantity">
                        <span>Quantity: </span>
                        <input type="number" value="${item.quantity}" min="1" 
                               data-id="${item.id}" data-size="${item.size}" data-color="${item.color}">
                    </div>
                    <div class="cart-item-total">Total: EGP${itemTotal.toFixed(2)}</div>
                </div>
            </div>
            <div class="cart-item-price" style="display:none">EGP${item.price.toFixed(2)}</div>
        `;
        cartItemsList.appendChild(cartItem);
    });
    
    updateCartSummaryEGP(subtotal);
    setupCartItemEvents();
}

// Setup events for cart items
function setupCartItemEvents() {
    // Quantity change
    document.querySelectorAll('.cart-item-quantity input').forEach(input => {
        input.addEventListener('change', function() {
            const id = parseInt(this.getAttribute('data-id'));
            const size = this.getAttribute('data-size');
            const color = this.getAttribute('data-color');
            const newQuantity = parseInt(this.value);
            
            updateCartItemQuantity(id, size, color, newQuantity);
        });
    });
    
    // Remove item
    document.querySelectorAll('.cart-item-remove').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const id = parseInt(this.getAttribute('data-id'));
            const size = this.getAttribute('data-size');
            const color = this.getAttribute('data-color');
            
            removeCartItem(id, size, color);
        });
    });
}

function updateCartItemQuantity(id, size, color, newQuantity) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemIndex = cart.findIndex(item => 
        item.id === id && 
        item.size === size && 
        item.color === color
    );
    
    if (itemIndex >= 0 && newQuantity > 0) {
        cart[itemIndex].quantity = newQuantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCartItems();
        updateCartCount();
    } else if (newQuantity <= 0) {
        removeCartItem(id, size, color);
    }
}

function removeCartItem(id, size, color) {
    console.log("Removing item:", id, size, color); 

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    cart = cart.filter(item =>
        !(
            item.id === id &&
            item.size.toLowerCase().trim() === size.toLowerCase().trim() &&
            item.color.toLowerCase().trim() === color.toLowerCase().trim()
        )
    );

    localStorage.setItem('cart', JSON.stringify(cart));
    displayCartItems();
    updateCartCount();

    if (cart.length === 0) {
        showEmptyCartMessage();
    } else {
        showToast('Item removed from cart');
    }
}

/*function removeCartItem(id, size, color) {
    console.log('Attempting to remove:', id, size, color);

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => 
        !(item.id === id && 
        item.size === size && 
        item.color === color)
    );
    
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCartItems();
    updateCartCount();
    
    if (cart.length === 0) {
        showEmptyCartMessage();
    } else {
        showToast('Item removed from cart');
    }
}*/

function showEmptyCartMessage() {
    const cartItemsList = document.getElementById('cart-items-list');
    cartItemsList.innerHTML = `
        <div class="empty-cart-message">
            <p>Your cart is currently empty.</p>
            <a href="products.html" class="btn">Continue Shopping</a>
        </div>
    `;
    updateCartSummaryEGP(0);
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Initialize cart page
function initCartPage() {
    if (document.getElementById('cart-items-list')) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        if (cart.length === 0) {
            showEmptyCartMessage();
            updateCartSummaryEGP(0);
        } else {
            displayCartItems();
        }
    }
}

function clearCart() {
    localStorage.setItem('cart', JSON.stringify([]));
    updateCartCount();
    
    if (window.location.pathname.includes('cart.html')) {
        showEmptyCartMessage();
        updateCartSummaryEGP(0);
    }
    
    // Reset checkout form if it's open
    if (checkoutModal && checkoutModal.classList.contains('active')) {
        document.getElementById('shippingForm').reset();
        setCheckoutStep(1);
    }
}

// Handle search input
function handleSearchInput(e) {
    const query = e.target.value.toLowerCase().trim();
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        const productName = card.querySelector('.product-title').textContent.toLowerCase();
        if (productName.includes(query)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Toggle search bar
function toggleSearch(e) {
    e.stopPropagation();
    document.querySelector('.search').classList.toggle('active');
    
    if (document.querySelector('.search').classList.contains('active')) {
        searchInput.focus();
    } else {
        searchInput.value = '';
        // Reset product display if on products page
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach(card => {
            card.style.display = 'block';
        });
    }
}

// Highlight current page in navigation
function highlightCurrentPage() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav ul li a, .sidebar ul li a');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href').split('/').pop();
        if (linkPage === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Initialize checkout modal
function initCheckout() {
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', openCheckout);
    }
    
    if (checkoutClose) {
        checkoutClose.addEventListener('click', closeCheckout);
    }
    
    if (nextToPayment) {
        nextToPayment.addEventListener('click', goToPayment);
    }
    
    if (backToShipping) {
        backToShipping.addEventListener('click', goBackToShipping);
    }
    
    if (placeOrder) {
        placeOrder.addEventListener('click', completeOrder);
    }
    
    if (returnToShop) {
        returnToShop.addEventListener('click', closeCheckout);
    }
}

// Open checkout modal
function openCheckout() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart.length === 0) {
        showToast('Your cart is empty. Please add items before checkout.');
        return;
    }
    
    // Update order summary in checkout
    updateCheckoutSummary();
    
    // Show modal with animation
    checkoutModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Reset to first step
    setCheckoutStep(1);
}

// Close checkout modal
function closeCheckout() {
    checkoutModal.classList.remove('active');
    document.body.style.overflow = '';
    
    // Reset to first step for next time
    setCheckoutStep(1);
}

// Go to payment step
function goToPayment() {
    // Validate shipping form
    const shippingForm = document.getElementById('shippingForm');
    const requiredFields = shippingForm.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.style.borderColor = 'red';
            isValid = false;
        } else {
            field.style.borderColor = '';
        }
    });
    
    if (!isValid) {
        showToast('Please fill in all required fields.');
        return;
    }
    
    // Update shipping summary
    updateShippingSummary();
    
    // Go to payment step
    setCheckoutStep(2);
}

// Go back to shipping step
function goBackToShipping() {
    setCheckoutStep(1);
}

// Complete order
function completeOrder() {
    // In a real app, you would process the payment here
    // For demo, we'll just show the confirmation
    
    // Generate random order number
    const orderNumber = '#' + Math.floor(10000 + Math.random() * 90000);
    document.getElementById('orderNumber').textContent = orderNumber;
    
    // Go to confirmation step
    setCheckoutStep(3);
    
    // Clear cart
    clearCart();
}

// Set current checkout step
function setCheckoutStep(step) {
    // Update steps UI
    checkoutSteps.forEach(stepEl => {
        const stepNum = parseInt(stepEl.getAttribute('data-step'));
        
        stepEl.classList.remove('active', 'completed');
        
        if (stepNum < step) {
            stepEl.classList.add('completed');
        } else if (stepNum === step) {
            stepEl.classList.add('active');
        }
    });
    
    // Show correct form
    checkoutForms.forEach(form => {
        form.classList.remove('active');
    });
    
    document.querySelector(`.checkout-form[data-step="${step}"]`)?.classList.add('active');
    document.getElementById(`step${step}Form`)?.classList.add('active');
}

// Update order summary in checkout
function updateCartSummaryEGP(subtotal) {
    const shipping = subtotal > 0 ? 80 : 0;
    const total = subtotal + shipping;

    const subtotalEl = document.getElementById('cart-subtotal');
    const totalEl = document.getElementById('cart-total');
    const shippingEl = document.getElementById('cart-shipping');

    if (subtotalEl) subtotalEl.textContent = `EGP${subtotal.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `EGP${total.toFixed(2)}`;
    if (shippingEl) shippingEl.textContent = `EGP${shipping.toFixed(2)}`;
}

// في دالة updateCheckoutSummary
function updateCheckoutSummary() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    let subtotal = 0;

    cart.forEach(item => {
        subtotal += item.price * item.quantity;
    });

    const shipping = 80;
    const total = subtotal + shipping;

    // داخل المودال
    document.getElementById('checkout-subtotal').textContent = `EGP${subtotal.toFixed(2)}`;
    document.getElementById('checkout-shipping').textContent = `EGP${shipping.toFixed(2)}`;
    document.getElementById('checkout-total').textContent = `EGP${total.toFixed(2)}`;

    document.getElementById('payment-subtotal').textContent = `EGP${subtotal.toFixed(2)}`;
    document.getElementById('payment-shipping').textContent = `EGP${shipping.toFixed(2)}`;
    document.getElementById('payment-total').textContent = `EGP${total.toFixed(2)}`;
}


// Update shipping information summary
function updateShippingSummary() {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    const district = document.getElementById('district').value;
    const notes = document.getElementById('notes').value;
    
    let html = `
        <div class="summary-item">
            <span>Name:</span>
            <span>${firstName} ${lastName}</span>
        </div>
        <div class="summary-item">
            <span>Email:</span>
            <span>${email}</span>
        </div>
        <div class="summary-item">
            <span>Phone:</span>
            <span>${phone}</span>
        </div>
        <div class="summary-item">
            <span>Address:</span>
            <span>${address}, ${district}, ${city}</span>
        </div>
    `;
    
    if (notes) {
        html += `
            <div class="summary-item">
                <span>Notes:</span>
                <span>${notes}</span>
            </div>
        `;
    }
    
    document.getElementById('shippingSummary').innerHTML = html;
}

// Initialize checkout when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initCheckout();
    
    // Add data-step attributes to forms
    document.getElementById('shippingForm').setAttribute('data-step', '1');
    document.getElementById('paymentForm').setAttribute('data-step', '2');
    document.getElementById('confirmationStep').setAttribute('data-step', '3');
});