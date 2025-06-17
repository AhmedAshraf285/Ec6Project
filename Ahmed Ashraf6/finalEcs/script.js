// Sample product data
const products = [
    { id: 1, name: "headphones", image: "../images/headphones.jpg", price: 99.99, description: "High-quality headphones with noise cancellation." },
    { id: 2, name: "smartwatch", image: "../images/smartwatch.jpg", price: 199.99, description: "Track your fitness and stay connected with this smart watch." },
    { id: 3, name: "speaker", image: "../images/speaker.jpg", price: 59.99, description: "Portable speaker with clear sound and long battery life." },
    { id: 4, name: "laptop-bag", image: "../images/laptop-bag.jpg", price: 49.99, description: "Durable bag with USB charging port and anti-theft design." },
    { id: 5, name: "mouse", image: "../images/mouse.jpg", price: 12.99, description: "Adjustable stand for your smartphone or tablet." },
    { id: 7, name: "lamp", image: "../images/lamp.jpg", price: 29.99, description: "Comfortable wireless mouse with silent clicks." },
    { id: 6, name: "phone", image: "../images/phone-stand.jpg", price: 34.99, description: "LED desk lamp with adjustable brightness." },
    { id: 8, name: "hard-drive", image: "../images/hard-drive.jpg", price: 89.99, description: "Portable 1TB hard drive with high transfer speed." },
    { id: 9, name: "keyboard", image: "../images/keyboard.jpg", price: 79.99, description: "RGB backlit mechanical keyboard for gamers and typists." },
    { id: 10, name: "powerbank", image: "../images/powerbank.jpg", price: 24.99, description: "10000mAh portable charger with fast charging." }
];


// User accounts (simulated database)
let users = JSON.parse(localStorage.getItem('users')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentSlide = 0;

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    // Check if user is already logged in
    if (currentUser) {
        showHomePage();
    } else {
        document.getElementById('login-page').classList.remove('hidden');
    }

    // Login form submission
    document.getElementById('login-form').addEventListener('submit', handleLogin);

    // Register form submission
    document.getElementById('register-form').addEventListener('submit', handleRegister);

    // Switch between login and register
    document.getElementById('show-register').addEventListener('click', function (e) {
        e.preventDefault();
        document.getElementById('login-page').classList.add('hidden');
        document.getElementById('register-page').classList.remove('hidden');
    });

    document.getElementById('show-login').addEventListener('click', function (e) {
        e.preventDefault();
        document.getElementById('register-page').classList.add('hidden');
        document.getElementById('login-page').classList.remove('hidden');
    });

    // Initialize home page elements and event listeners
    initializeHomePage();

    // Back to top button
    document.getElementById('back-to-top').addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});

// Handle login
function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        showHomePage();
    } else {
        alert('Invalid username or password');
    }
}

// Handle registration
function handleRegister(e) {
    e.preventDefault();
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    if (users.some(u => u.username === username)) {
        alert('Username already exists');
        return;
    }

    const newUser = { username, email, password };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    currentUser = newUser;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    showHomePage();
}

// Show home page
function showHomePage() {
    document.getElementById('auth-pages').classList.add('hidden');
    document.getElementById('home-page').classList.remove('hidden');

    document.getElementById('welcome-user').textContent = `Welcome, ${currentUser.username}`;

    renderProducts();
    updateCartCount();
    startSlider();
}

// Initialize home page elements and event listeners
function initializeHomePage() {
    // Logout button
    document.getElementById('logout-btn').addEventListener('click', function () {
        currentUser = null;
        localStorage.removeItem('currentUser');
        document.getElementById('home-page').classList.add('hidden');
        document.getElementById('auth-pages').classList.remove('hidden');
        document.getElementById('login-page').classList.remove('hidden');
    });

    // View cart button
    document.getElementById('view-cart').addEventListener('click', openCartModal);

    // Close modal button
    document.querySelector('.close-modal').addEventListener('click', function () {
        document.getElementById('cart-modal').classList.add('hidden');
    });

    // Checkout button
    document.getElementById('checkout-btn').addEventListener('click', function () {
        alert('Thank you for your purchase!');
        cart = [];
        saveCart();
        updateCartCount();
        document.getElementById('cart-modal').classList.add('hidden');
    });

    // Close modal when clicking outside
    window.addEventListener('click', function (event) {
        if (event.target === document.getElementById('cart-modal')) {
            document.getElementById('cart-modal').classList.add('hidden');
        }
    });

    // Slider navigation
    document.querySelector('.prev-btn').addEventListener('click', prevSlide);
    document.querySelector('.next-btn').addEventListener('click', nextSlide);
}

// Slider functions
function startSlider() {
    const slides = document.querySelectorAll('.slide');
    if (slides.length === 0) return;

    slides[currentSlide].classList.add('active');

    // Auto slide every 5 seconds
    setInterval(() => {
        nextSlide();
    }, 5000);
}

function nextSlide() {
    const slides = document.querySelectorAll('.slide');
    slides[currentSlide].classList.remove('active');

    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
}

function prevSlide() {
    const slides = document.querySelectorAll('.slide');
    slides[currentSlide].classList.remove('active');

    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
}

// Render products to the page
function renderProducts() {
    const container = document.getElementById('products-container');
    container.innerHTML = '';

    products.forEach(product => {
        console.log(product);

        const productCard = document.createElement('div');
        productCard.className = 'product-card';

        productCard.innerHTML = `
            <div class="product-image"><img src="${product.image}"/></div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div>
        `;

        container.appendChild(productCard);
    });

    // Add event listeners to all "Add to Cart" buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function () {
            const productId = parseInt(this.getAttribute('data-id'));
            addToCart(productId);
        });
    });
}

// Add product to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    saveCart();
    updateCartCount();
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Update cart count in the header
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cart-count').textContent = count;
}

// Open cart modal and display cart items
function openCartModal() {
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty</p>';
        document.getElementById('cart-total').textContent = 'Total: $0.00';
    } else {
        let total = 0;

        cart.forEach(item => {
            console.log(item);

            const itemTotal = item.price * item.quantity;
            total += itemTotal;

            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';

            cartItem.innerHTML = `
                <div class="cart-item-info">
                    <div class="cart-item-image"><img style="    width: 100%;
    height: 100%;" src="${item.image}"/></div>
                    <div>
                        <h4>${item.name}</h4>
                        <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
                    </div>
                </div>
                <div class="cart-item-quantity">
                    <button class="decrease-quantity" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="increase-quantity" data-id="${item.id}">+</button>
                    <button class="remove-item" data-id="${item.id}">×</button>
                </div>
                <div class="cart-item-total">$${itemTotal.toFixed(2)}</div>
            `;

            cartItemsContainer.appendChild(cartItem);
        });

        document.getElementById('cart-total').textContent = `Total: $${total.toFixed(2)}`;

        // Add event listeners to quantity buttons
        document.querySelectorAll('.increase-quantity').forEach(button => {
            button.addEventListener('click', function () {
                const id = parseInt(this.getAttribute('data-id'));
                updateCartItemQuantity(id, 1);
            });
        });

        document.querySelectorAll('.decrease-quantity').forEach(button => {
            button.addEventListener('click', function () {
                const id = parseInt(this.getAttribute('data-id'));
                updateCartItemQuantity(id, -1);
            });
        });

        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', function () {
                const id = parseInt(this.getAttribute('data-id'));
                removeCartItem(id);
            });
        });
    }

    document.getElementById('cart-modal').classList.remove('hidden');
}

// Update cart item quantity
function updateCartItemQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
        cart = cart.filter(item => item.id !== productId);
    }

    saveCart();
    updateCartCount();
    openCartModal();
}

// Remove item from cart
function removeCartItem(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    openCartModal();
}