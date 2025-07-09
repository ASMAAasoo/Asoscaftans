document.addEventListener('DOMContentLoaded', function() {
    // 1. Shopping Cart Functionality
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = document.querySelectorAll('#cart-count');
    
    // Update cart count display
    function updateCartCount() {
        const count = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.forEach(el => el.textContent = count);
    }
    
    // 2. Add to Cart Buttons
    document.body.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart') || 
            e.target.closest('.add-to-cart')) {
            e.preventDefault();
            
            const productId = e.target.dataset.id || e.target.closest('.add-to-cart').dataset.id;
            const product = getProductDetails(productId);
            
            addToCart(product);
            updateCartCount();
            showAddedToCartModal(product);
        }
    });
    
    // 3. Product Details Function
    function getProductDetails(id) {
        // In a real implementation, this would fetch from your product database
        // Here's a mock implementation:
        return {
            id: id,
            name: document.querySelector(`[data-id="${id}"]`).dataset.name,
            price: parseFloat(document.querySelector(`[data-id="${id}"]`).dataset.price),
            image: document.querySelector(`[data-id="${id}"]`).dataset.image
        };
    }
    
    // 4. Cart Management Functions
    function addToCart(product) {
        const existingItem = cart.find(item => item.id === product.id);
        
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
    
    // 5. Cart Modal
    function showAddedToCartModal(product) {
        const modal = document.createElement('div');
        modal.className = 'cart-notification';
        modal.innerHTML = `
            <div class="cart-notification-content">
                <p>${product.name} added to cart</p>
                <a href="#" class="view-cart">View Cart</a>
                <a href="#" class="continue-shopping">Continue Shopping</a>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        modal.querySelector('.view-cart').addEventListener('click', function(e) {
            e.preventDefault();
            showCartModal();
            modal.remove();
        });
        
        modal.querySelector('.continue-shopping').addEventListener('click', function(e) {
            e.preventDefault();
            modal.remove();
        });
        
        setTimeout(() => modal.remove(), 5000);
    }
    
    // 6. Full Cart Modal
    function showCartModal() {
        const modal = document.createElement('div');
        modal.className = 'cart-modal';
        modal.innerHTML = `
            <div class="cart-modal-content">
                <h2>Your Shopping Cart</h2>
                <div class="cart-items-container"></div>
                <div class="cart-summary">
                    <p class="cart-total">Total: $0.00</p>
                    <a href="checkout.html" class="checkout-btn">Proceed to Checkout</a>
                    <button class="close-cart">Continue Shopping</button>
                </div>
            </div>
        `;
        
        const itemsContainer = modal.querySelector('.cart-items-container');
        
        // Populate cart items
        if (cart.length === 0) {
            itemsContainer.innerHTML = '<p>Your cart is empty</p>';
        } else {
            let total = 0;
            cart.forEach(item => {
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-details">
                        <h3>${item.name}</h3>
                        <p>$${item.price.toFixed(2)}</p>
                        <div class="quantity-controls">
                            <button class="decrease-quantity" data-id="${item.id}">-</button>
                            <span>${item.quantity}</span>
                            <button class="increase-quantity" data-id="${item.id}">+</button>
                        </div>
                        <button class="remove-item" data-id="${item.id}">Remove</button>
                    </div>
                `;
                itemsContainer.appendChild(cartItem);
                total += item.price * item.quantity;
            });
            
            modal.querySelector('.cart-total').textContent = `Total: $${total.toFixed(2)}`;
        }
        
        // Event delegation for cart controls
        modal.addEventListener('click', function(e) {
            if (e.target.classList.contains('close-cart')) {
                modal.remove();
            }
            else if (e.target.classList.contains('increase-quantity')) {
                const id = e.target.dataset.id;
                const item = cart.find(item => item.id === id);
                if (item) item.quantity++;
                updateCart();
            }
            else if (e.target.classList.contains('decrease-quantity')) {
                const id = e.target.dataset.id;
                const itemIndex = cart.findIndex(item => item.id === id);
                if (itemIndex !== -1) {
                    if (cart[itemIndex].quantity > 1) {
                        cart[itemIndex].quantity--;
                    } else {
                        cart.splice(itemIndex, 1);
                    }
                    updateCart();
                }
            }
            else if (e.target.classList.contains('remove-item')) {
                const id = e.target.dataset.id;
                cart = cart.filter(item => item.id !== id);
                updateCart();
            }
        });
        
        function updateCart() {
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            showCartModal(); // Refresh the modal
        }
        
        document.body.appendChild(modal);
    }
    
    // 7. Initialize cart count on page load
    updateCartCount();
    
    // 8. Navigation between sections (if your site has single-page navigation)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') !== '#') {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});
