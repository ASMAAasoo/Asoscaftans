document.addEventListener('DOMContentLoaded', function() {
    // 1. Shopping Cart Functionality
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Update cart count display
    function updateCartCount() {
        const count = cart.reduce((total, item) => total + item.quantity, 0);
        const cartCountElements = document.querySelectorAll('#cart-count');
        cartCountElements.forEach(el => {
            if (el) el.textContent = count;
        });
    }
    
    // 2. Add to Cart Button Event Listener
    document.body.addEventListener('click', function(e) {
        // Check if clicked element is a cart button or its child
        if (e.target.classList.contains('cart') || 
            e.target.closest('.cart') || 
            e.target.classList.contains('add-to-cart') || 
            e.target.closest('.add-to-cart')) {
            
            e.preventDefault();
            
            // Find the product container
            const productContainer = e.target.closest('.pro');
            if (!productContainer) return;
            
            // Extract product details from the container
            const productId = Math.random().toString(36).substr(2, 9); // Generate random ID
            const productName = productContainer.querySelector('h5')?.textContent || 'ASO\'s Moroccan Caftan';
            const productPrice = productContainer.querySelector('h4')?.textContent.replace('MAD ', '').replace(/[^\d.]/g, '') || '10000';
            const productImage = productContainer.querySelector('img')?.src || '';
            
            const product = {
                id: productId,
                name: productName,
                price: parseFloat(productPrice),
                image: productImage
            };
            
            addToCart(product);
            updateCartCount();
            showAddedToCartNotification(product);
        }
    });
    
    // 3. Add to Cart Function
    function addToCart(product) {
        const existingItem = cart.find(item => item.name === product.name);
        
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({
                ...product,
                quantity: 1
            });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
    }
    
    // 4. Show notification when item added
    function showAddedToCartNotification(product) {
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <p><strong>${product.name}</strong> added to cart!</p>
                <div class="notification-buttons">
                    <button class="view-cart-btn">View Cart</button>
                    <button class="continue-shopping-btn">Continue Shopping</button>
                </div>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            border: 2px solid #088178;
            border-radius: 10px;
            padding: 15px 20px;
            z-index: 1000;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            min-width: 300px;
            animation: slideIn 0.3s ease;
        `;
        
        // Add button styles
        const buttons = notification.querySelectorAll('button');
        buttons.forEach(btn => {
            btn.style.cssText = `
                margin: 5px;
                padding: 8px 15px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-weight: 600;
            `;
        });
        
        const viewCartBtn = notification.querySelector('.view-cart-btn');
        const continueBtn = notification.querySelector('.continue-shopping-btn');
        
        viewCartBtn.style.cssText += 'background: #088178; color: white;';
        continueBtn.style.cssText += 'background: #f0f0f0; color: #333;';
        
        // Event listeners
        viewCartBtn.addEventListener('click', function() {
            window.location.href = 'cart.html';
        });
        
        continueBtn.addEventListener('click', function() {
            notification.remove();
        });
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }
    
    // 5. Cart toggle functionality
    const cartToggle = document.getElementById('cart-toggle');
    if (cartToggle) {
        cartToggle.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'cart.html';
        });
    }
    
    // 6. Initialize cart count on page load
    updateCartCount();
    
    // 7. Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '#cart-toggle') {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // 8. Functions for cart page (if needed)
    window.removeFromCart = function(productId) {
        cart = cart.filter(item => item.id !== productId);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        if (window.location.pathname.includes('cart.html')) {
            location.reload();
        }
    };
    
    window.updateQuantity = function(productId, newQuantity) {
        const item = cart.find(item => item.id === productId);
        if (item) {
            if (newQuantity <= 0) {
                removeFromCart(productId);
            } else {
                item.quantity = newQuantity;
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartCount();
            }
        }
    };
    
    // 9. Make cart accessible globally
    window.cart = cart;
    window.updateCartCount = updateCartCount;
});

// Add CSS for notification animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { 
            transform: translateX(100%); 
            opacity: 0; 
        }
        to { 
            transform: translateX(0); 
            opacity: 1; 
        }
    }
    
    .cart-notification {
        font-family: 'Poppins', sans-serif;
    }
    
    .notification-content p {
        margin: 0 0 10px 0;
        color: #333;
    }
    
    .notification-buttons {
        display: flex;
        gap: 10px;
        justify-content: center;
    }
    
    .notification-buttons button:hover {
        opacity: 0.8;
        transform: translateY(-1px);
    }
`;
document.head.appendChild(style);
const bar = document.getElementById('bar');
const close = document.getElementById('close');
const nav = document.getElementById('navbar');

if (bar) {
    bar.addEventListener('click', () => {
        nav.classList.add('active');
    })    
}

if (close) {
    close.addEventListener('click', () => {
        nav.classList.remove('active');
    })    
}
// Close mobile menu when clicking on a link
document.querySelectorAll('#navbar a').forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('active');
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !bar.contains(e.target) && nav.classList.contains('active')) {
        nav.classList.remove('active');
    }
});