//script.js

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
    initSearch();
});

function setupProductLinks() {
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', function(e) {
            if (!e.target.closest('.add-to-cart')) {
                const productId = this.getAttribute('data-id');
                window.location.href = `/product/${productId}/`;
            }
        });
    });
    
    if (sortSelect) {
        sortSelect.addEventListener('change', filterProducts);
    }
    
    if (categorySelect) {
        categorySelect.addEventListener('change', filterProducts);
    }

    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });

    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', clearCart);
    }

    document.querySelectorAll('.thumbnail-images img').forEach(thumb => {
        thumb.addEventListener('click', function() {
            const mainImage = document.getElementById('main-product-image');
            mainImage.src = this.src;
        });
    });

    const productsGrid = document.querySelector('.products-grid');
    if (productsGrid) {
        productsGrid.addEventListener('click', function (e) {
            const button = e.target.closest('.add-to-cart');
            if (button) {
                addToCart.call(button, e);
            }
        });
    }
}

function loadProductDetails() {
    if (window.location.pathname.includes('product-detail.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');
        if (productId) {
            const productElement = document.querySelector(`.product-data[data-id="${productId}"]`);
            
            if (productElement) {
                const mainImage = document.getElementById('main-product-image');
                const thumbnailsContainer = document.querySelector('.thumbnail-images');
                
                document.getElementById('product-name').textContent = productElement.querySelector('.product-name').textContent;
                document.getElementById('product-price').textContent = `${parseFloat(productElement.querySelector('.product-price').textContent).toFixed(2)} EGP`;
                
                const oldPrice = productElement.querySelector('.product-old-price');
                if (oldPrice) {
                    document.querySelector('.old-price').textContent = `${parseFloat(oldPrice.textContent).toFixed(2)} EGP`;
                    document.querySelector('.old-price').style.display = 'inline';
                }
                
                document.getElementById('product-description').textContent = productElement.querySelector('.product-description').textContent;
                
                const images = productElement.querySelectorAll('.product-images img');
                const mainWrapper = document.getElementById('main-swiper-wrapper');
                const thumbWrapper = document.getElementById('thumb-swiper-wrapper');

                mainWrapper.innerHTML = '';
                thumbWrapper.innerHTML = '';

                images.forEach((img, index) => {
                    const mainSlide = document.createElement('div');
                    mainSlide.className = 'swiper-slide';
                    mainSlide.innerHTML = `<img src="${img.src}" alt="${img.alt}">`;
                    mainWrapper.appendChild(mainSlide);

                    const thumbSlide = document.createElement('div');
                    thumbSlide.className = 'swiper-slide';
                    thumbSlide.innerHTML = `<img src="${img.src}" alt="${img.alt}">`;
                    thumbWrapper.appendChild(thumbSlide);
                });

                const thumbSwiper = new Swiper('.thumb-swiper', {
                    spaceBetween: 10,
                    slidesPerView: 3,
                    freeMode: true,
                    watchSlidesProgress: true,
                    breakpoints: {
                        768: { slidesPerView: 4 }
                    }
                });

                const mainSwiper = new Swiper('.main-swiper', {
                    spaceBetween: 10,
                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    },
                    thumbs: {
                        swiper: thumbSwiper
                    }
                });
                
                const detailsList = document.getElementById('product-details-list');
                detailsList.innerHTML = '';
                const details = productElement.querySelectorAll('.product-details li');
                details.forEach(detail => {
                    const li = document.createElement('li');
                    li.textContent = detail.textContent;
                    detailsList.appendChild(li);
                });
                
                const addToCartBtn = document.querySelector('.add-to-cart');
                if (addToCartBtn) {
                    addToCartBtn.setAttribute('data-id', productId);
                }

                loadRelatedProducts(productId);
            }
        }
    }
}

function loadRelatedProducts(currentProductId) {
    const relatedProductsGrid = document.getElementById('related-products-grid');
    if (!relatedProductsGrid) return;

    relatedProductsGrid.innerHTML = '';

    const allProducts = document.querySelectorAll('#products-data .product-data');
    
    allProducts.forEach(product => {
        const productId = product.getAttribute('data-id');
        if (productId !== currentProductId) {
            const productCard = createProductCard(product);
            relatedProductsGrid.appendChild(productCard);
        }
    });

    setupProductLinks();
}

function createProductCard(productElement) {
    const productId = productElement.getAttribute('data-id');
    const category = productElement.getAttribute('data-category');
    const name = productElement.querySelector('.product-name').textContent;
    const price = productElement.querySelector('.product-price').textContent;
    const oldPriceElement = productElement.querySelector('.product-old-price');
    const image = productElement.querySelector('.product-images img').src;

    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-id', productId);
    card.setAttribute('data-category', category);

    let priceHtml = `<span class="price">${parseFloat(price).toFixed(2)} EGP</span>`;
    if (oldPriceElement) {
        const oldPrice = oldPriceElement.textContent;
        priceHtml = `
            <span class="old-price">${parseFloat(oldPrice).toFixed(2)} EGP</span>
            <span class="price">${parseFloat(price).toFixed(2)} EGP</span>
        `;
    }

    card.innerHTML = `
        <div class="product-image">
            <img src="${image}" alt="${name}">
        </div>
        <div class="product-info">
            <h3 class="product-title">${name}</h3>
            <div class="product-price">
                <div>${priceHtml}</div>
            </div>
        </div>
    `;

    return card;
}

function toggleMobileMenu() {
    document.body.classList.toggle('sidebar-open');
    sidebar.classList.toggle('active');
    
    if (sidebar.classList.contains('active')) {
        mobileMenuBtn.innerHTML = '<i class="fas fa-times"></i>';
    } else {
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    }
}

function closeMobileMenu() {
    document.body.classList.remove('sidebar-open');
    sidebar.classList.remove('active');
    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
}

function updateCartCount() {
    if (cartCount) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

function filterProducts() {
    const category = categorySelect ? categorySelect.value : 'all';
    const sort = sortSelect ? sortSelect.value : 'default';
    const url = new URL(window.location.href.split('?')[0]);
    
    if (category && category !== 'all') {
        url.searchParams.set('category', category);
    }
    
    if (sort && sort !== 'default') {
        url.searchParams.set('sort', sort);
    }
    window.location.href = url.href;
}

function addToCart(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const button = this;

    if (button.classList.contains('is-adding')) {
        return;
    }

    const productContainer = button.closest('.product-detail-container') || button.closest('.product-card');
    if (!productContainer) return;
    
    const productId = parseInt(productContainer.dataset.id);
    const productName = productContainer.querySelector('.product-title, #product-name').textContent;
    const priceText = productContainer.querySelector('.price, #product-price').textContent;
    const productPrice = parseFloat(priceText.replace(/[^\d.]/g, ''));
    const productImage = productContainer.querySelector('.product-image img, #main-product-image').src;
    
    const selectedSize = document.querySelector('input[name="size"]:checked')?.value || 'M';
    const selectedColor = document.querySelector('input[name="color"]:checked')?.value || 'Default';
    const quantity = parseInt(document.getElementById('quantity')?.value) || 1;

    const cartProduct = { 
        id: productId, 
        product_id: productId,
        name: productName, 
        price: productPrice, 
        image: productImage, 
        quantity, 
        size: selectedSize, 
        size_id: selectedSize,
        color: selectedColor, 
        color_id: selectedColor,
        available_stock: 10 
    };
    
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItemIndex = cart.findIndex(item => item.id === productId && item.size === selectedSize && item.color === selectedColor);
    
    if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += quantity;
    } else {
        cart.push(cartProduct);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    button.classList.add('is-adding');
    const originalHTML = button.innerHTML;
    button.innerHTML = '<i class="fas fa-check"></i> Added!';
    
    setTimeout(() => {
        button.innerHTML = originalHTML;
        button.classList.remove('is-adding');
    }, 2000);
}

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

function displayCartItems() {
    const cartItemsList = document.getElementById('cart-items-list');
    const emptyCartMessage = document.getElementById('emptyCartMessage');
    const cartSummary = document.getElementById('cart-summary');
    if (!cartItemsList) return;

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cartItemsList.innerHTML = '';

    if (cart.length === 0) {
        if (emptyCartMessage) emptyCartMessage.style.display = 'block';
        if (cartSummary) cartSummary.style.display = 'none';
        return;
    }

    if (emptyCartMessage) emptyCartMessage.style.display = 'none';
    if (cartSummary) cartSummary.style.display = 'block';

    let subtotal = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        // Check if we're on mobile (screen width <= 900px)
        const isMobile = window.innerWidth <= 900;
        
        if (isMobile) {
            // Mobile layout: Product name first, then size/color together, then quantity, then price
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item-responsive';
            itemElement.innerHTML = `
                <div class="cart-item-responsive-main">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <div class="cart-item-header">
                            <h3 class="cart-item-title">${item.name}</h3>
                            <button class="cart-item-remove" data-id="${item.product_id}" data-size="${item.size_id}" data-color="${item.color_id}">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        <div class="cart-item-options">
                            <span class="cart-item-size"><b>Size:</b> ${item.size_name || item.size || 'N/A'}</span>
                            <span class="cart-item-color">
                                <span class="color-indicator" style="background-color: ${item.color_code || '#ccc'}"></span>
                                <b>Color:</b> ${item.color_name || getColorNameFromCode(item.color_code) || item.color || 'N/A'}
                            </span>
                        </div>
                        <div class="cart-item-bottom">
                            <div class="cart-item-quantity">
                                <button class="quantity-btn" data-id="${item.product_id}" data-size="${item.size_id}" data-color="${item.color_id}" data-action="decrement">-</button>
                                <span class="quantity-display">${item.quantity}</span>
                                <button class="quantity-btn" data-id="${item.product_id}" data-size="${item.size_id}" data-color="${item.color_id}" data-action="increment">+</button>
                            </div>
                            <div class="cart-item-total">${itemTotal.toFixed(2)} EGP</div>
                        </div>
                    </div>
                </div>
            `;
            cartItemsList.appendChild(itemElement);
        } else {
            // Desktop layout: Original grid layout
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <div class="cart-item-product">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <span class="cart-item-title">${item.name}</span>
                        <div class="item-options">
                            <span class="cart-item-size">Size: ${item.size_name || item.size || 'N/A'}</span>
                            <span class="cart-item-color">
                                <span class="color-indicator" style="background-color: ${item.color_code || '#ccc'}"></span>
                                Color: ${item.color_name || getColorNameFromCode(item.color_code) || item.color || 'N/A'}
                            </span>
                        </div>
                    </div>
                </div>
                <div class="cart-item-quantity">
                    <div class="quantity-control">
                        <button class="quantity-btn" data-id="${item.product_id}" data-size="${item.size_id}" data-color="${item.color_id}" data-action="decrement">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" readonly data-id="${item.product_id}" data-size="${item.size_id}" data-color="${item.color_id}">
                        <button class="quantity-btn" data-id="${item.product_id}" data-size="${item.size_id}" data-color="${item.color_id}" data-action="increment">+</button>
                    </div>
                </div>
                <div class="cart-item-total">${itemTotal.toFixed(2)} EGP</div>
                <div class="cart-item-remove">
                    <button class="remove-btn" data-id="${item.product_id}" data-size="${item.size_id}" data-color="${item.color_id}"><i class="fas fa-trash"></i></button>
                </div>
            `;
            cartItemsList.appendChild(itemElement);
        }
    });

    updateCartSummary(subtotal);
    setupCartItemEvents();
}

function setupCartItemEvents() {
    
    // For mobile: buttons only
    if (window.innerWidth <= 900) {
        
        // Mobile quantity buttons
        document.querySelectorAll('.cart-item-quantity .quantity-btn[data-action="increment"]').forEach(button => {
            button.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                const size = this.getAttribute('data-size');
                const color = this.getAttribute('data-color');
                const quantityDisplay = this.closest('.cart-item-quantity').querySelector('.quantity-display');
                let value = parseInt(quantityDisplay.textContent);
                
                // Check available stock
                const cart = JSON.parse(localStorage.getItem('cart')) || [];
                const item = cart.find(item => {
                    // Try to find with new IDs
                    if (item.product_id && item.size_id && item.color_id) {
                        return item.product_id === parseInt(id) && item.size_id === parseInt(size) && item.color_id === parseInt(color);
                    }
                    // Search with old IDs
                    return item.id === parseInt(id) && item.size === size && item.color === color;
                });
                
                if (item && item.available_stock && value < item.available_stock) {
                    value++;
                    updateCartItemQuantity(id, size, color, value);
                } else if (!item.available_stock && value < 10) {
                    // If no stock info, use max limit 10
                    value++;
                    updateCartItemQuantity(id, size, color, value);
                } else {
                    showToast('Cannot add more - stock limit reached');
                }
            });
        });
        
        document.querySelectorAll('.cart-item-quantity .quantity-btn[data-action="decrement"]').forEach(button => {
            button.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                const size = this.getAttribute('data-size');
                const color = this.getAttribute('data-color');
                const quantityDisplay = this.closest('.cart-item-quantity').querySelector('.quantity-display');
                let value = parseInt(quantityDisplay.textContent);
                if (value > 1) {
                    value--;
                    updateCartItemQuantity(id, size, color, value);
                }
            });
        });
        
        // Mobile remove buttons (direct button, not nested)
        document.querySelectorAll('.cart-item-remove').forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const id = this.getAttribute('data-id');
                const size = this.getAttribute('data-size');
                const color = this.getAttribute('data-color');
                removeCartItem(id, size, color);
            });
        });
    } else {
        
        // Desktop: input + buttons
        document.querySelectorAll('.cart-item-quantity input').forEach(input => {
            input.addEventListener('change', function() {
                const id = this.getAttribute('data-id');
                const size = this.getAttribute('data-size');
                const color = this.getAttribute('data-color');
                const newQuantity = parseInt(this.value);
                
                // Check available stock
                const cart = JSON.parse(localStorage.getItem('cart')) || [];
                const item = cart.find(item => {
                    // Try to find with new IDs
                    if (item.product_id && item.size_id && item.color_id) {
                        return item.product_id === parseInt(id) && item.size_id === parseInt(size) && item.color_id === parseInt(color);
                    }
                    // Search with old IDs
                    return item.id === parseInt(id) && item.size === size && item.color === color;
                });
                
                if (item && item.available_stock && newQuantity <= item.available_stock) {
                    updateCartItemQuantity(id, size, color, newQuantity);
                } else if (!item.available_stock && newQuantity <= 10) {
                    updateCartItemQuantity(id, size, color, newQuantity);
                } else {
                    showToast('The requested quantity exceeds available stock.');
                    // Reset value to previous value
                    this.value = item.quantity;
                }
            });
        });
        
        document.querySelectorAll('.cart-item-quantity .quantity-btn[data-action="increment"]').forEach(button => {
            button.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                const size = this.getAttribute('data-size');
                const color = this.getAttribute('data-color');
                const input = this.closest('.quantity-control').querySelector('input');
                let value = parseInt(input.value);
                
                // Check available stock
                const cart = JSON.parse(localStorage.getItem('cart')) || [];
                const item = cart.find(item => {
                    // Try to find with new IDs
                    if (item.product_id && item.size_id && item.color_id) {
                        return item.product_id === parseInt(id) && item.size_id === parseInt(size) && item.color_id === parseInt(color);
                    }
                    // Search with old IDs
                    return item.id === parseInt(id) && item.size === size && item.color === color;
                });
                
                if (item && item.available_stock && value < item.available_stock) {
                    value++;
                    updateCartItemQuantity(id, size, color, value);
                } else if (!item.available_stock && value < 10) {
                    // If no stock info, use max limit 10
                    value++;
                    updateCartItemQuantity(id, size, color, value);
                } else {
                    showToast('Cannot add more - stock limit reached');
                }
            });
        });
        
        document.querySelectorAll('.cart-item-quantity .quantity-btn[data-action="decrement"]').forEach(button => {
            button.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                const size = this.getAttribute('data-size');
                const color = this.getAttribute('data-color');
                const input = this.closest('.quantity-control').querySelector('input');
                let value = parseInt(input.value);
                if (value > 1) {
                    value--;
                    updateCartItemQuantity(id, size, color, value);
                }
            });
        });
        
        // Desktop remove buttons (nested in .remove-btn)
        document.querySelectorAll('.cart-item-remove .remove-btn').forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const id = this.getAttribute('data-id');
                const size = this.getAttribute('data-size');
                const color = this.getAttribute('data-color');
                removeCartItem(id, size, color);
            });
        });
    }
}

function updateCartItemQuantity(id, size, color, newQuantity) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Find the item using new or old IDs
    const itemIndex = cart.findIndex(item => {
        // Try to find with new IDs
        if (item.product_id && item.size_id && item.color_id) {
            return item.product_id === parseInt(id) && item.size_id === parseInt(size) && item.color_id === parseInt(color);
        }
        // Search with old IDs
        return item.id === parseInt(id) && item.size === size && item.color === color;
    });
    
    if (itemIndex > -1) {
        if (newQuantity > 0) {
            cart[itemIndex].quantity = newQuantity;
        } else {
            cart.splice(itemIndex, 1);
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCartItems();
        updateCartCount();
    }
}

function removeCartItem(id, size, color) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => {
        // Try to find with new IDs
        if (item.product_id && item.size_id && item.color_id) {
            return !(item.product_id === parseInt(id) && item.size_id === parseInt(size) && item.color_id === parseInt(color));
        }
        // Search with old IDs
        return !(item.id === parseInt(id) && item.size === size && item.color === color);
    });
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCartItems();
    updateCartCount();
}

function showEmptyCartMessage() {
    const cartItemsList = document.getElementById('cart-items-list');
    cartItemsList.innerHTML = `<div class="empty-cart-message"><p>Your cart is empty</p><a href="/products/" class="btn">Continue Shopping</a></div>`;
    updateCartSummary(0);
}

function initCartPage() {
    if (document.getElementById('cart-items-list')) {
        displayCartItems();
        const checkoutBtn = document.getElementById('proceedToCheckoutBtn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', openCheckout);
        }
        
        // Add resize listener to update layout when screen size changes
        window.addEventListener('resize', function() {
            // Debounce the resize event
            clearTimeout(window.resizeTimeout);
            window.resizeTimeout = setTimeout(function() {
                displayCartItems();
            }, 250);
        });
    }
}

function purgeCart() {
    localStorage.removeItem('cart');
    updateCartCount();
    displayCartItems();
}

function clearCart() {
    purgeCart();
}

function toggleSearch(e) {
    e.stopPropagation();
    document.querySelector('.search').classList.toggle('active');
    if (document.querySelector('.search').classList.contains('active')) {
        searchInput.focus();
    }
}

function highlightCurrentPage() {
    const currentUrl = window.location.pathname;
    document.querySelectorAll('.sidebar ul li a').forEach(link => {
        if (link.getAttribute('href') === currentUrl) {
            link.classList.add('active');
        }
    });
}

function initCheckout() {
    const nextToPaymentBtn = document.getElementById('nextToPayment');
    const backToShippingBtn = document.getElementById('backToShipping');
    const placeOrderBtn = document.getElementById('placeOrder');
    const returnToShopBtn = document.getElementById('returnToShop');

    if (nextToPaymentBtn) {
        nextToPaymentBtn.addEventListener('click', () => {
            if (validateShippingForm()) {
                setCheckoutStep(2);
                updateShippingSummary();
                updateCheckoutSummary();
            }
        });
    }

    if (backToShippingBtn) {
        backToShippingBtn.addEventListener('click', () => {
            setCheckoutStep(1);
        });
    }

    if (placeOrderBtn) {
        placeOrderBtn.addEventListener('click', completeOrder);
    }
    
    if (returnToShopBtn) {
        returnToShopBtn.addEventListener('click', () => {
            closeCheckout();
            displayCartItems(); // Update cart interface before navigation
            window.location.href = '/products/';
        });
    }
}

function validateShippingForm() {
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'district'];
    for (const fieldId of requiredFields) {
        const field = document.getElementById(fieldId);
        if (!field.value.trim()) {
            alert(`Please fill out the ${field.previousElementSibling.textContent.replace('*','').trim()} field.`);
            field.focus();
            return false;
        }
    }
    return true;
}

function setCheckoutStep(step) {
    document.querySelectorAll('.checkout-step').forEach(elem => {
        const stepNumber = parseInt(elem.getAttribute('data-step'));
        if (stepNumber < step) {
            elem.classList.add('completed');
            elem.classList.remove('active');
        } else if (stepNumber === step) {
            elem.classList.add('active');
            elem.classList.remove('completed');
        } else {
            elem.classList.remove('active', 'completed');
        }
    });
    
    document.querySelectorAll('.checkout-form').forEach(form => {
        form.classList.remove('active');
    });
    const activeForm = document.querySelector(`.checkout-form[data-step="${step}"]`);
    if(activeForm) activeForm.classList.add('active');
}

function updateShippingSummary() {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const address = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    const district = document.getElementById('district').value;
    const phone = document.getElementById('phone').value;

    const summaryContainer = document.getElementById('shippingSummary');
    if (summaryContainer) {
        summaryContainer.innerHTML = `
            <h4>Shipping Information <button type="button" id="editShippingBtn" class="edit-btn" style="background:none; border:none; color:var(--primary-color); cursor:pointer; text-decoration:underline; font-size:0.9rem;">Edit</button></h4>
            <p><strong>Name:</strong> ${firstName} ${lastName}</p>
            <p><strong>Address:</strong> ${address}, ${district}, ${city}</p>
            <p><strong>Phone:</strong> ${phone}</p>
        `;
        document.getElementById('editShippingBtn').addEventListener('click', () => setCheckoutStep(1));
    }
}

function completeOrder(event) {
    if (event) {
    event.preventDefault();
    }
    
    const placeOrderBtn = document.getElementById('placeOrder');
    const originalBtnHTML = placeOrderBtn.innerHTML;

    // Set loading state
    placeOrderBtn.disabled = true;
    placeOrderBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

    const orderData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        district: document.getElementById('district').value,
        notes: document.getElementById('notes').value,
        cart: JSON.parse(localStorage.getItem('cart')) || [],
        totalAmount: parseFloat(document.getElementById('checkout-total').textContent.replace(' EGP', ''))
    };

    if (orderData.cart.length === 0) {
        alert('Your cart is empty.');
        placeOrderBtn.disabled = false; // Restore button
        placeOrderBtn.innerHTML = originalBtnHTML;
        return;
    }

    fetch('/api/create-order/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify(orderData),
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => { throw new Error(err.error || 'Server error'); });
        }
        return response.json();
    })
    .then(data => {
        if(data.success) {
            setCheckoutStep(3);
            document.getElementById('orderNumber').textContent = data.order_number;
            localStorage.removeItem('cart');
            updateCartCount();
            displayCartItems(); // Update cart interface
        } else {
            alert('Order failed: ' + data.error);
            placeOrderBtn.disabled = false; // Restore button
            placeOrderBtn.innerHTML = originalBtnHTML;
        }
    })
    .catch(error => {
        console.error('Error placing order:', error);
        alert('An error occurred. Please try again. ' + error.message);
        placeOrderBtn.disabled = false; // Restore button
        placeOrderBtn.innerHTML = originalBtnHTML;
    });
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function updateCartSummary(subtotal) {
    const shipping = subtotal > 0 ? 80 : 0;
    const total = subtotal + shipping;
    const subtotalEl = document.getElementById('cart-subtotal');
    const totalEl = document.getElementById('cart-total');
    const shippingEl = document.getElementById('cart-shipping');

    if (subtotalEl) subtotalEl.textContent = `${subtotal.toFixed(2)} EGP`;
    if (totalEl) totalEl.textContent = `${total.toFixed(2)} EGP`;
    if (shippingEl) shippingEl.textContent = `${shipping.toFixed(2)} EGP`;
}

function initEventListeners() {
    if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    if (sidebarOverlay) sidebarOverlay.addEventListener('click', closeMobileMenu);
    if (searchBtn) searchBtn.addEventListener('click', toggleSearch);
    
    const checkoutCloseBtn = document.getElementById('checkoutClose');
    if (checkoutCloseBtn) {
        checkoutCloseBtn.addEventListener('click', closeCheckout);
    }
    
    submenuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            this.parentElement.classList.toggle('active');
        });
    });
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
    
    // Initialize product details page if we're on it
    const productDetailContainer = document.querySelector('.product-detail-container');
    if (productDetailContainer) {
        initProductDetailsPage();
    }
    
    // Initialize checkout if we're on cart page
    if (document.getElementById('checkoutModal')) {
        initCheckout();
    }
}

function openCheckout() {
    const checkoutModal = document.getElementById('checkoutModal');
    if (checkoutModal) {
        updateCheckoutSummary();
        setCheckoutStep(1);
        checkoutModal.classList.add('active');
    }
}

function closeCheckout() {
    const checkoutModal = document.getElementById('checkoutModal');
    if (checkoutModal) {
        checkoutModal.classList.remove('active');
        displayCartItems(); // تحديث واجهة السلة عند إغلاق checkout
    }
}

function updateCheckoutSummary() {
    // احسب القيم من السلة مباشرة
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    let subtotal = 0;
    cart.forEach(item => {
        let price = parseFloat(item.price);
        if (isNaN(price)) {
            price = parseFloat(item.price.toString().replace(/[^\d.]/g, ''));
            if (isNaN(price)) {
                price = 0;
            }
        }
        subtotal += price * item.quantity;
    });
    const shipping = subtotal > 0 ? 80 : 0;
    const total = subtotal + shipping;

    // ملخص الشحن (الخطوة 1)
    if (document.getElementById('checkout-subtotal')) {
    document.getElementById('checkout-subtotal').textContent = `${subtotal.toFixed(2)} EGP`;
    }
    if (document.getElementById('checkout-shipping')) {
    document.getElementById('checkout-shipping').textContent = `${shipping.toFixed(2)} EGP`;
    }
    if (document.getElementById('checkout-total')) {
    document.getElementById('checkout-total').textContent = `${total.toFixed(2)} EGP`;
    }

    // ملخص الدفع (الخطوة 2)
    if (document.getElementById('payment-subtotal')) {
        document.getElementById('payment-subtotal').textContent = `${subtotal.toFixed(2)} EGP`;
    }
    if (document.getElementById('payment-shipping')) {
        document.getElementById('payment-shipping').textContent = `${shipping.toFixed(2)} EGP`;
    }
    if (document.getElementById('payment-total')) {
        document.getElementById('payment-total').textContent = `${total.toFixed(2)} EGP`;
    }
}

// دالة الانتقال إلى الدفع
function goToPayment() {
    if (validateShippingForm()) {
        setCheckoutStep(2);
        updateShippingSummary();
        updateCheckoutSummary();
    }
}

// دالة العودة إلى الشحن
function goBackToShipping() {
    setCheckoutStep(1);
}

// دالة تحديث ملخص السلة بالجنيه المصري
function updateCartSummaryEGP(subtotal) {
    const shipping = subtotal > 0 ? 80 : 0;
    const total = subtotal + shipping;
    
    const subtotalEl = document.getElementById('cart-subtotal');
    const totalEl = document.getElementById('cart-total');
    const shippingEl = document.getElementById('cart-shipping');

    if (subtotalEl) subtotalEl.textContent = `${subtotal.toFixed(2)} EGP`;
    if (totalEl) totalEl.textContent = `${total.toFixed(2)} EGP`;
    if (shippingEl) shippingEl.textContent = `${shipping.toFixed(2)} EGP`;
}

// دالة تحويل كود اللون إلى اسم بسيط
function getColorNameFromCode(colorCode) {
    if (!colorCode) return null;
    
    const colorMap = {
        'ffffff': 'White',
        '000000': 'Black',
        'ff0000': 'Red',
        '00ff00': 'Green',
        '0000ff': 'Blue',
        'ffff00': 'Yellow',
        'ff00ff': 'Magenta',
        '00ffff': 'Cyan',
        '808080': 'Gray',
        'c0c0c0': 'Silver',
        '800000': 'Maroon',
        '808000': 'Olive',
        '008000': 'Green',
        '800080': 'Purple',
        '008080': 'Teal',
        'ffa500': 'Orange',
        'ffc0cb': 'Pink'
    };
    
    // تنظيف كود اللون
    let cleanCode = colorCode.toLowerCase().replace('#', '');
    return colorMap[cleanCode] || '#' + cleanCode;
}

// دالة إظهار رسالة toast
function showToast(message) {
    // إنشاء عنصر toast إذا لم يكن موجوداً
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #333;
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            z-index: 10000;
            display: none;
            max-width: 300px;
            word-wrap: break-word;
        `;
        document.body.appendChild(toast);
    }
    
    toast.textContent = message;
    toast.style.display = 'block';
    
    // إخفاء toast بعد 3 ثواني
    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}

// ===== Product Details Page Functions =====

function initProductDetailsPage() {
    // Initialize Swiper for product images
    var thumbSwiper = new Swiper(".thumb-swiper", {
        spaceBetween: 10,
        slidesPerView: 4,
        freeMode: true,
        watchSlidesProgress: true,
    });
    var mainSwiper = new Swiper(".main-swiper", {
        spaceBetween: 10,
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        thumbs: {
            swiper: thumbSwiper,
        },
    });

    // Color selection styling
    const colorInputs = document.querySelectorAll('input[name="color"]');
    const checkedColor = document.querySelector('input[name="color"]:checked');
    if (checkedColor) {
        const label = document.querySelector(`label[for="${checkedColor.id}"]`);
        if(label) {
            label.classList.add('selected');
        }
    }
    colorInputs.forEach(input => {
        input.addEventListener('change', function() {
            document.querySelectorAll('.color-circle').forEach(circle => {
                circle.classList.remove('selected');
            });
            const label = document.querySelector(`label[for="${this.id}"]`);
            if (label) {
                label.classList.add('selected');
            }
        });
    });

    // Variant Selection Logic
    const inventoryMapElement = document.getElementById('inventory-map-data');
    if (inventoryMapElement) {
        let inventoryMap;
        try {
            // تنظيف JSON من escape characters
            let jsonText = inventoryMapElement.textContent;
            jsonText = jsonText.replace(/\\u0022/g, '"');
            jsonText = jsonText.replace(/\\u0026/g, '&');
            jsonText = jsonText.replace(/\\u003c/g, '<');
            jsonText = jsonText.replace(/\\u003e/g, '>');
            
            inventoryMap = JSON.parse(jsonText);
        } catch (error) {
            console.error('Error parsing inventory map:', error);
            return;
        }
        const sizeSelectors = document.querySelectorAll('input[name="size"]');
        const colorSelectors = document.querySelectorAll('input[name="color"]');
        const quantityInput = document.getElementById('quantity');
        const decrementBtn = document.getElementById('decrement-btn');
        const incrementBtn = document.getElementById('increment-btn');
        const stockMessage = document.getElementById('stock-message');
        const addToCartBtn = document.getElementById('add-to-cart-btn');

        function updateStockStatus() {
            const selectedSize = document.querySelector('input[name="size"]:checked');
            const selectedColor = document.querySelector('input[name="color"]:checked');

            if (!selectedSize || !selectedColor) {
                stockMessage.textContent = 'Please select size and color.';
                addToCartBtn.disabled = true;
                quantityInput.disabled = true;
                decrementBtn.disabled = true;
                incrementBtn.disabled = true;
                return;
            }

            const variantKey = `${selectedSize.value}_${selectedColor.value}`;
            const stock = inventoryMap[variantKey];

            if (stock !== undefined && stock > 0) {
                stockMessage.textContent = 'In Stock';
                stockMessage.style.color = 'green';
                quantityInput.max = stock;
                addToCartBtn.disabled = false;
                quantityInput.disabled = false;
                decrementBtn.disabled = false;
                incrementBtn.disabled = false;
            } else {
                stockMessage.textContent = 'Out of Stock';
                stockMessage.style.color = 'red';
                quantityInput.max = 0;
                addToCartBtn.disabled = true;
                quantityInput.disabled = true;
                decrementBtn.disabled = true;
                incrementBtn.disabled = true;
            }
            quantityInput.value = 1; // Reset quantity on change
        }

        sizeSelectors.forEach(s => s.addEventListener('change', updateStockStatus));
        colorSelectors.forEach(c => c.addEventListener('change', updateStockStatus));

        incrementBtn.addEventListener('click', () => {
            let currentVal = parseInt(quantityInput.value);
            let maxVal = parseInt(quantityInput.max);
            if (currentVal < maxVal) {
                quantityInput.value = currentVal + 1;
            }
        });

        decrementBtn.addEventListener('click', () => {
            let currentVal = parseInt(quantityInput.value);
            if (currentVal > 1) {
                quantityInput.value = currentVal - 1;
            }
        });
        
        // Initial check
        updateStockStatus();

        // Link the function to the button
        addToCartBtn.addEventListener('click', addToCartFromProductDetails);
    }
}

function addToCartFromProductDetails() {
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    if (addToCartBtn.classList.contains('is-adding') || addToCartBtn.disabled) {
        return;
    }

    const selectedSizeInput = document.querySelector('input[name="size"]:checked');
    const selectedColorInput = document.querySelector('input[name="color"]:checked');
    const quantityInput = document.getElementById('quantity');
    
    // Ensure variant is selected
    if (!selectedSizeInput || !selectedColorInput) {
        alert('Please select a size and color.');
        return;
    }

    const productId = parseInt(document.querySelector('.product-detail-container').dataset.productId);
    const sizeId = parseInt(selectedSizeInput.value, 10);
    const colorId = parseInt(selectedColorInput.value, 10);
    const quantity = parseInt(quantityInput.value, 10);

    // Re-check stock from inventoryMap just in case
    const inventoryMapElement = document.getElementById('inventory-map-data');
    if (!inventoryMapElement) {
        alert('Inventory data not available.');
        return;
    }
    
    let inventoryMap;
    try {
        // تنظيف JSON من escape characters
        let jsonText = inventoryMapElement.textContent;
        jsonText = jsonText.replace(/\\u0022/g, '"');
        jsonText = jsonText.replace(/\\u0026/g, '&');
        jsonText = jsonText.replace(/\\u003c/g, '<');
        jsonText = jsonText.replace(/\\u003e/g, '>');
        
        inventoryMap = JSON.parse(jsonText);
    } catch (error) {
        console.error('Error parsing inventory map:', error);
        alert('Inventory data not available.');
        return;
    }
    const variantKey = `${sizeId}_${colorId}`;
    const stock = inventoryMap[variantKey];
    
    if (quantity > stock) {
        alert('The requested quantity is not available in stock.');
        return;
    }
    
    const productName = document.querySelector('.product-detail-container h1').textContent;
    const productPrice = parseFloat(document.querySelector('.product-price .price').textContent.replace(' EGP', ''));
    const productImage = document.querySelector('.main-swiper .swiper-slide-active img').src;
    const sizeName = document.querySelector(`label[for="size-${sizeId}"]`).textContent;
    const colorName = selectedColorInput.dataset.colorName || 'Default';
    
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    const existingItemIndex = cart.findIndex(item => 
        item.product_id === productId && 
        item.size_id === sizeId && 
        item.color_id === colorId
    );

    if (existingItemIndex > -1) {
        // Item exists, update quantity, check against stock
        const newQuantity = cart[existingItemIndex].quantity + quantity;
        if (newQuantity > stock) {
            alert('Adding this quantity would exceed available stock.');
            return;
        }
        cart[existingItemIndex].quantity = newQuantity;
    } else {
        // Add new item to cart
        cart.push({ 
            product_id: productId, 
            size_id: sizeId,
            color_id: colorId,
            name: productName, 
            price: productPrice, 
            image: productImage, 
            quantity: quantity, 
            size_name: sizeName, 
            color_name: colorName,
            color_code: selectedColorInput.dataset.colorCode || '#ccc',
            available_stock: stock
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();

    // --- Visual Feedback ---
    addToCartBtn.classList.add('is-adding');
    const originalText = addToCartBtn.innerHTML;
    addToCartBtn.innerHTML = '<i class="fas fa-check"></i> Added!';
    addToCartBtn.style.backgroundColor = '#4CAF50';
    
    setTimeout(() => {
        addToCartBtn.innerHTML = originalText;
        addToCartBtn.style.backgroundColor = '';
        addToCartBtn.classList.remove('is-adding');
    }, 2000);

    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.style.transform = 'scale(1.5)';
        setTimeout(() => {
            cartCount.style.transform = 'scale(1)';
        }, 300);
    }
}

// ===== Search Functions =====

function initSearch() {
    if (!searchInput) return;
    
    // إنشاء عنصر نتائج البحث
    createSearchResultsContainer();
    
    // إضافة مستمع الأحداث للبحث
    searchInput.addEventListener('input', debounce(performSearch, 300));
    
    // إضافة مستمع للتركيز
    searchInput.addEventListener('focus', function() {
        if (this.value.trim().length >= 2) {
            performSearch();
        }
    });
    
    // إغلاق نتائج البحث عند النقر خارجها
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.search-container')) {
            hideSearchResults();
        }
    });
    
    // إغلاق نتائج البحث عند الضغط على ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            hideSearchResults();
            searchInput.blur();
        }
    });
    
    // التنقل في النتائج باستخدام الأسهم
    searchInput.addEventListener('keydown', function(e) {
        const resultsContainer = document.querySelector('.search-results-container');
        if (!resultsContainer || resultsContainer.style.display === 'none') return;
        
        const resultItems = resultsContainer.querySelectorAll('.search-result-item, .more-results');
        const currentIndex = Array.from(resultItems).findIndex(item => item.classList.contains('selected'));
        
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            const nextIndex = currentIndex < resultItems.length - 1 ? currentIndex + 1 : 0;
            selectSearchResult(resultItems, nextIndex);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            const prevIndex = currentIndex > 0 ? currentIndex - 1 : resultItems.length - 1;
            selectSearchResult(resultItems, prevIndex);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            const selectedItem = resultsContainer.querySelector('.search-result-item.selected, .more-results.selected');
            if (selectedItem) {
                selectedItem.click();
            }
        }
    });
}

function selectSearchResult(resultItems, index) {
    resultItems.forEach((item, i) => {
        if (i === index) {
            item.classList.add('selected');
            item.style.backgroundColor = '#e3f2fd';
        } else {
            item.classList.remove('selected');
            item.style.backgroundColor = '';
        }
    });
}

function createSearchResultsContainer() {
    // إزالة الحاوية القديمة إذا كانت موجودة
    const existingContainer = document.querySelector('.search-results-container');
    if (existingContainer) {
        existingContainer.remove();
    }
    
    // إنشاء حاوية جديدة
    const searchContainer = document.querySelector('.search-container');
    
    if (!searchContainer) {
        return;
    }
    
    const resultsContainer = document.createElement('div');
    resultsContainer.className = 'search-results-container';
    resultsContainer.style.cssText = `
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        border: 1px solid #ddd;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        max-height: 400px;
        overflow-y: auto;
        z-index: 1000;
        display: none;
        margin-top: 5px;
    `;
    
    searchContainer.appendChild(resultsContainer);
}

function performSearch() {
    const query = searchInput.value.trim().toLowerCase();
    const resultsContainer = document.querySelector('.search-results-container');
    
    if (!resultsContainer) {
        createSearchResultsContainer();
        return;
    }
    
    if (query.length < 2) {
        hideSearchResults();
        return;
    }
    
    // البحث في المنتجات
    const products = document.querySelectorAll('.product-card');
    const categories = document.querySelectorAll('.category-card');
    
    const matchingProducts = [];
    const matchingCategories = [];
    
    // البحث في المنتجات
    products.forEach((product, index) => {
        const productTitle = product.querySelector('.product-title');
        const productName = productTitle?.textContent?.toLowerCase() || '';
        const productCategory = product.getAttribute('data-category')?.toLowerCase() || '';
        
        if (productName.includes(query) || productCategory.includes(query)) {
            matchingProducts.push(product);
        }
    });
    
    // البحث في الفئات
    categories.forEach((category, index) => {
        const categoryTitle = category.querySelector('h3');
        const categoryName = categoryTitle?.textContent?.toLowerCase() || '';
        
        if (categoryName.includes(query)) {
            matchingCategories.push(category);
        }
    });
    
    displaySearchResults(matchingProducts, matchingCategories, query);
}

function displaySearchResults(products, categories, query) {
    const resultsContainer = document.querySelector('.search-results-container');
    if (!resultsContainer) return;
    
    resultsContainer.innerHTML = '';
    
    const totalResults = products.length + categories.length;
    
    if (totalResults === 0) {
        resultsContainer.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <p>No results found for "${query}"</p>
                <p class="suggestion">Try different keywords</p>
            </div>
        `;
    } else {
        const resultsList = document.createElement('div');
        resultsList.style.cssText = `
            padding: 10px;
        `;
        
        // عرض الفئات أولاً
        categories.slice(0, 3).forEach(category => {
            const categoryName = category.querySelector('h3')?.textContent || 'Unknown Category';
            const categoryImage = category.querySelector('img')?.src || '';
            const categoryId = category.getAttribute('data-category');
            
            const resultItem = document.createElement('div');
            resultItem.className = 'search-result-item category-result';
            resultItem.style.cssText = `
                display: flex;
                align-items: center;
                padding: 12px;
                border-bottom: 1px solid #f0f0f0;
                cursor: pointer;
                transition: background-color 0.2s;
                background-color: #f8f9fa;
            `;
            
            resultItem.innerHTML = `
                <img src="${categoryImage}" alt="${categoryName}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px; margin-right: 12px;">
                <div style="flex: 1;">
                    <div style="font-weight: 600; margin-bottom: 4px; color: var(--primary-color);">
                        <i class="fas fa-folder" style="margin-right: 5px;"></i>
                        ${highlightQuery(categoryName, query)}
                    </div>
                    <div style="font-size: 12px; color: #666;">Category</div>
                </div>
            `;
            
            resultItem.addEventListener('click', () => {
                window.location.href = `/products/?category=${categoryId}`;
            });
            
            resultItem.addEventListener('mouseenter', () => {
                resultItem.style.backgroundColor = '#e9ecef';
            });
            
            resultItem.addEventListener('mouseleave', () => {
                resultItem.style.backgroundColor = '#f8f9fa';
            });
            
            resultsList.appendChild(resultItem);
        });
        
        // Display products (including out of stock)
        products.slice(0, 8).forEach(product => {
            const productName = product.querySelector('.product-title')?.textContent || 'Unknown Product';
            const productPrice = product.querySelector('.price')?.textContent || '';
            const productImage = product.querySelector('.product-image img')?.src || '';
            const productId = product.getAttribute('data-id');
            // تحقق من توفر المنتج
            let isOutOfStock = false;
            if (
                product.classList.contains('out-of-stock') ||
                product.querySelector('.out-of-stock') ||
                product.innerHTML.toLowerCase().includes('out of stock')
            ) {
                isOutOfStock = true;
            }
            if (product.getAttribute('data-stock') === '0' || product.getAttribute('data-available') === 'false') {
                isOutOfStock = true;
            }
            
            const resultItem = document.createElement('div');
            resultItem.className = 'search-result-item';
            resultItem.style.cssText = `
                display: flex;
                align-items: center;
                padding: 12px;
                border-bottom: 1px solid #f0f0f0;
                cursor: pointer;
                transition: background-color 0.2s;
            `;
            
            resultItem.innerHTML = `
                <img src="${productImage}" alt="${productName}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px; margin-right: 12px;">
                <div style="flex: 1;">
                    <div style="font-weight: 600; margin-bottom: 4px;">${highlightQuery(productName, query)}</div>
                    <div style="color: var(--primary-color); font-size: 14px;">${productPrice}</div>
                    ${isOutOfStock ? '<div style="color: #d32f2f; font-size: 13px; font-weight: bold;">Out of Stock</div>' : ''}
                </div>
            `;
            
            resultItem.addEventListener('click', () => {
                window.location.href = `/product/${productId}/`;
            });
            
            resultItem.addEventListener('mouseenter', () => {
                resultItem.style.backgroundColor = '#f8f9fa';
            });
            
            resultItem.addEventListener('mouseleave', () => {
                resultItem.style.backgroundColor = 'transparent';
            });
            
            resultsList.appendChild(resultItem);
        });
        
        if (totalResults > 11) {
            const moreResults = document.createElement('div');
            moreResults.className = 'more-results';
            moreResults.textContent = `View all ${totalResults} results`;
            moreResults.addEventListener('click', () => {
                window.location.href = `/products/?search=${encodeURIComponent(query)}`;
            });
            resultsList.appendChild(moreResults);
        }
        
        resultsContainer.appendChild(resultsList);
    }
    
    showSearchResults();
}

function highlightQuery(text, query) {
    if (!query) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark style="background-color: #fff3cd; padding: 1px 2px; border-radius: 2px;">$1</mark>');
}

function showSearchResults() {
    const resultsContainer = document.querySelector('.search-results-container');
    if (resultsContainer) {
        resultsContainer.style.display = 'block';
    }
}

function hideSearchResults() {
    const resultsContainer = document.querySelector('.search-results-container');
    if (resultsContainer) {
        resultsContainer.style.display = 'none';
    }
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}



