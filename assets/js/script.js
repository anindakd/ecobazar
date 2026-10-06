/* =====================================================
   ECOBAZAR – COMMON JAVASCRIPT (loaded on every page)
   Needs data.js loaded before this file.

   Sections:
   1.  Helpers
   2.  Cart + wishlist (saved in the browser)
   3.  Product card + card buttons (card opens product.html)
   4.  Categories menu (dropdown + mobile drawer)
   5.  Mobile drawer
   6.  Search popup
   7.  Sign In / Sign Up
   8.  Newsletter forms
   9.  Scroll effects + keyboard shortcuts
   10. Dark mode
   ===================================================== */


/* =====================================================
   1. HELPERS
   ===================================================== */

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// Stop user text from being treated as HTML
function escapeHTML(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    };
    return String(text).replace(/[&<>"']/g, (char) => map[char]);
}

// Safe localStorage (works even if storage is blocked)
const storage = {
    get(key) {
        try {
            return JSON.parse(localStorage.getItem(key));
        } catch (error) {
            return null;
        }
    },
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) { }
    },
    remove(key) {
        try {
            localStorage.removeItem(key);
        } catch (error) { }
    }
};

// Small message at the bottom of the screen
function showToast(message) {
    const toast = $('#toast');
    toast.textContent = message;
    toast.classList.add('show');

    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => toast.classList.remove('show'), 2000);
}

// Open / close any popup (modal)
function openModal(modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
}

// Safety: after a reload / Live Server refresh / back button,
// make sure the page can always scroll
window.addEventListener('pageshow', () => {
    document.body.style.overflow = '';
});

function findProduct(id) {
    return PRODUCTS.find((item) => item.id === Number(id));
}

function categoryUrl(slug) {
    return 'categories.html?cat=' + slug;
}

// Every product has its own page: product.html?id=5
function productUrl(id) {
    return 'product.html?id=' + id;
}


/* =====================================================
   2. CART + WISHLIST
   (saved in the browser, so every page shows the same cart)
   ===================================================== */

// Cart: { productId: quantity }   Wishlist: [productId, productId ...]
let cartItems = storage.get('ecoCartItems') || {};
let wishlist = storage.get('ecoWish') || [];

// How many pieces are in the cart
function cartCount() {
    return Object.values(cartItems).reduce((sum, quantity) => sum + quantity, 0);
}

// Total price of the cart (before coupon)
function cartSubtotal() {
    return Object.entries(cartItems).reduce((sum, [id, quantity]) => {
        const item = findProduct(id);
        return item ? sum + item.price * quantity : sum;
    }, 0);
}

function saveCart() {
    storage.set('ecoCartItems', cartItems);
    renderCart();
}

// Header: cart count + total, wishlist count
function renderCart() {
    $('#cartCount').textContent = cartCount();
    $('#cartTotal').textContent = '$' + cartSubtotal().toFixed(2);
}

function renderWishCount() {
    $('#wishCount').textContent = wishlist.length;
    $('#wishCount').hidden = wishlist.length === 0;
}

function addToCart(id, quantity = 1) {
    const item = findProduct(id);
    if (!item) return;

    if (item.outOfStock) {
        showToast(item.name + ' is out of stock');
        return;
    }

    cartItems[item.id] = (cartItems[item.id] || 0) + quantity;
    saveCart();

    showToast(item.name + ' added to cart');
}

function removeFromCart(id) {
    delete cartItems[id];
    saveCart();
}

function toggleWishlist(id) {
    const index = wishlist.indexOf(Number(id));

    if (index === -1) {
        wishlist.push(Number(id));
    } else {
        wishlist.splice(index, 1);
    }

    storage.set('ecoWish', wishlist);
    renderWishCount();
    return index === -1;   // true = just added
}

renderCart();
renderWishCount();


/* =====================================================
   3. PRODUCT CARD + CARD BUTTONS
   ===================================================== */

function starsHTML(rating) {
    const full = Math.round(rating);
    return icon('star').repeat(full) + icon('star', 'off').repeat(5 - full);
}

// One product card (returns an HTML string)
function productCard(item, showQuickView = false) {
    const percent = item.oldPrice ? Math.round((1 - item.price / item.oldPrice) * 100) : 0;

    let tag = '';
    if (item.outOfStock) {
        tag = '<span class="stock-tag">Out of Stock</span>';
    } else if (percent) {
        tag = `<span class="sale-tag">Sale ${percent}%</span>`;
    }

    const liked = wishlist.includes(item.id);
    const oldPrice = item.oldPrice ? `<s>$${item.oldPrice.toFixed(2)}</s>` : '';
    const eyeButton = showQuickView
        ? `<button class="eye-btn" aria-label="Quick view">${icon('eye')}</button>`
        : '';

    return `
        <article class="card ${item.outOfStock ? 'out-of-stock' : ''}" data-id="${item.id}">
            ${tag}

            <div class="card-tools">
                <button class="heart-btn ${liked ? 'on' : ''}" aria-label="Wishlist">${icon('heart')}</button>
                ${eyeButton}
            </div>

            <a class="card-img" href="${productUrl(item.id)}">
                <img src="${PRODUCT_PATH + item.image}" alt="${escapeHTML(item.name)}">
            </a>

            <h4 class="card-name"><a href="${productUrl(item.id)}">${item.name}</a></h4>
            <div class="card-price">$${item.price.toFixed(2)} ${oldPrice}</div>
            <div class="stars">${starsHTML(item.rating)}</div>

            <button class="add-btn" aria-label="Add to cart">${icon('bag')}</button>
        </article>
    `;
}

// One listener handles every product card (event delegation)
document.addEventListener('click', (event) => {
    const card = event.target.closest('.card');
    if (!card) return;

    const id = card.dataset.id;

    // Click on an empty part of the card -> open the product page
    // (the image and the name are already real links)
    if (!event.target.closest('a, button')) {
        window.location.href = productUrl(id);
        return;
    }

    if (event.target.closest('.add-btn')) {
        addToCart(id);
    }

    if (event.target.closest('.heart-btn')) {
        const button = event.target.closest('.heart-btn');
        const added = toggleWishlist(id);

        button.classList.toggle('on', added);
        showToast(added ? 'Added to wishlist' : 'Removed from wishlist');
    }

    if (event.target.closest('.eye-btn') && typeof openQuickView === 'function') {
        openQuickView(id);
    }
});


/* =====================================================
   4. CATEGORIES MENU
   (desktop dropdown on the home page + mobile drawer)
   ===================================================== */

const categoryLinks = CATEGORIES.map((category) => `
    <li>
        <a href="${categoryUrl(category.slug)}" data-slug="${category.slug}">
            <span class="cat-emoji">${icon(category.icon)}</span>
            ${category.name}
        </a>
    </li>
`).join('');

$('#drawerCats').innerHTML = categoryLinks;

// Click on a category link:
// - category page -> filter the products on the same page
// - other pages   -> open the category page
function onCategoryClick(event) {
    const link = event.target.closest('a');
    if (!link) return;

    closeCategoryMenu();
    closeDrawer();

    if (typeof selectCategory === 'function') {
        event.preventDefault();
        selectCategory(link.dataset.slug);
    }
}

$('#drawerCats').addEventListener('click', onCategoryClick);

// "All Categories" dropdown (only exists on the home page)
const allCatBtn = $('#allCatBtn');
const catMenu = $('#catMenu');

if (allCatBtn) {
    catMenu.innerHTML = categoryLinks;

    allCatBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        allCatBtn.classList.toggle('open');
        catMenu.classList.toggle('open');
    });

    catMenu.addEventListener('click', onCategoryClick);
}

function closeCategoryMenu() {
    if (!allCatBtn) return;
    allCatBtn.classList.remove('open');
    catMenu.classList.remove('open');
}

// Click anywhere else -> close the dropdown
document.addEventListener('click', closeCategoryMenu);


/* =====================================================
   5. MOBILE DRAWER (opens from the left)
   ===================================================== */

const drawer = $('#drawer');
const drawerOverlay = $('#drawerOverlay');

function openDrawer() {
    drawer.classList.add('open');
    drawerOverlay.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeDrawer() {
    drawer.classList.remove('open');
    drawerOverlay.classList.remove('show');
    document.body.style.overflow = '';
}

$('#menuBtn').addEventListener('click', openDrawer);
$('#drawerClose').addEventListener('click', closeDrawer);
drawerOverlay.addEventListener('click', closeDrawer);

// "All Categories" accordion inside the drawer
$('#drawerCatBtn').addEventListener('click', () => {
    $('#drawerCatBtn').classList.toggle('open');
    $('#drawerCats').classList.toggle('open');
});

// Links that go nowhere (#) should not jump to the top of the page
$$('.drawer-links > li > a').forEach((link) => {
    link.addEventListener('click', (event) => {
        if (link.getAttribute('href') === '#') event.preventDefault();
        closeDrawer();
    });
});

// If the screen becomes wide again, close the drawer
window.addEventListener('resize', () => {
    if (window.innerWidth > 991) closeDrawer();
});


/* =====================================================
   6. SEARCH POPUP
   (trending searches + live item suggestions)
   ===================================================== */

const searchModal = $('#searchModal');
const searchInput = $('#searchInput');

$('#trendingList').innerHTML = TRENDING.map((word) => `<a>${word}</a>`).join('');

// Open the category page with the search word
// (on the category page the list is filtered without reloading)
function goToSearch(keyword) {
    if (typeof applySearch === 'function') {
        applySearch(keyword);
    } else {
        window.location.href = 'categories.html?search=' + encodeURIComponent(keyword);
    }
}

// Show suggestions. Empty text = first 6 items, otherwise filter by name.
function showSuggestions(text) {
    const keyword = text.trim().toLowerCase();

    const matches = keyword
        ? PRODUCTS.filter((item) => item.name.toLowerCase().includes(keyword))
        : PRODUCTS.slice(0, 6);

    // Trending box is only visible while the input is empty
    $('#trendingBox').hidden = keyword !== '';
    $('#suggestTitle').textContent = keyword ? `Results for "${text.trim()}"` : 'Suggested for you';

    if (matches.length === 0) {
        $('#suggestList').innerHTML = '<p style="color:#808080">No items found. Try another keyword.</p>';
        return;
    }

    $('#suggestList').innerHTML = matches.slice(0, 6).map((item) => `
        <a data-name="${escapeHTML(item.name)}" data-id="${item.id}">
            <img src="${PRODUCT_PATH + item.image}" alt="">
            <div>
                ${item.name}
                <small>$${item.price.toFixed(2)}</small>
            </div>
        </a>
    `).join('');
}

function openSearch() {
    openModal(searchModal);
    showSuggestions('');
    setTimeout(() => searchInput.focus(), 50);
}

function closeSearch() {
    closeModal(searchModal);
    searchInput.value = '';
}

$('#openSearch').addEventListener('click', openSearch);
$('#openSearchIcon').addEventListener('click', openSearch);
$('#searchClose').addEventListener('click', closeSearch);

// Click on the dark area outside the box closes the popup
searchModal.addEventListener('click', (event) => {
    if (event.target === searchModal) closeSearch();
});

// Live search while typing
searchInput.addEventListener('input', (event) => showSuggestions(event.target.value));

// Click a trending word -> put it in the input
$('#trendingList').addEventListener('click', (event) => {
    if (event.target.tagName === 'A') {
        searchInput.value = event.target.textContent;
        showSuggestions(searchInput.value);
    }
});

// Click a suggested item -> open that product page
$('#suggestList').addEventListener('click', (event) => {
    const item = event.target.closest('a');
    if (!item) return;

    window.location.href = productUrl(item.dataset.id);
});

// Search button / Enter key
function submitSearch() {
    const keyword = searchInput.value.trim();

    if (!keyword) {
        showToast('Type something to search');
        return;
    }

    closeSearch();
    goToSearch(keyword);
}

$('#searchGo').addEventListener('click', submitSearch);

searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') submitSearch();
});


/* =====================================================
   7. SIGN IN / SIGN UP
   (demo only: data is saved in the browser, no server)
   ===================================================== */

const authModal = $('#authModal');
let authMode = 'signin';   // 'signin' or 'signup'

// Switch between the two tabs
function setAuthMode(mode) {
    authMode = mode;
    const isSignup = mode === 'signup';

    $('#tabSignin').classList.toggle('active', !isSignup);
    $('#tabSignup').classList.toggle('active', isSignup);

    // Extra fields only for Sign Up
    $('#nameRow').hidden = !isSignup;
    $('#confirmRow').hidden = !isSignup;
    $('#strength').hidden = !isSignup;

    $('#authSubmit').textContent = isSignup ? 'Create Account' : 'Sign In';
    $('#authError').textContent = '';
}

function openAuth(mode) {
    setAuthMode(mode);
    openModal(authModal);

    const firstField = mode === 'signup' ? $('#authName') : $('#authEmail');
    setTimeout(() => firstField.focus(), 50);
}

function closeAuth() {
    closeModal(authModal);
    $('#authForm').reset();
    $('#strength i').style.width = 0;
}

// Top bar shows "Hi, Name / Logout" after login
function renderAuthLinks() {
    const user = storage.get('ecoUser');

    $('#authLinks').innerHTML = user
        ? `Hi, <b style="color:#00b207">${escapeHTML(user.name)}</b> / <a href="#" id="logoutLink">Logout</a>`
        : '<a href="#" id="signinLink">Sign In</a> / <a href="#" id="signupLink">Sign Up</a>';
}

// Links inside the top bar are re-created, so listen on the document
document.addEventListener('click', (event) => {
    if (event.target.id === 'signinLink') {
        event.preventDefault();
        openAuth('signin');
    }

    if (event.target.id === 'signupLink') {
        event.preventDefault();
        openAuth('signup');
    }

    if (event.target.id === 'logoutLink') {
        event.preventDefault();
        storage.remove('ecoUser');
        renderAuthLinks();
        showToast('You have been logged out');
    }
});

// Buttons inside the mobile drawer
$('#drawerSignin').addEventListener('click', () => { closeDrawer(); openAuth('signin'); });
$('#drawerSignup').addEventListener('click', () => { closeDrawer(); openAuth('signup'); });

$('#tabSignin').addEventListener('click', () => setAuthMode('signin'));
$('#tabSignup').addEventListener('click', () => setAuthMode('signup'));
$('#authClose').addEventListener('click', closeAuth);

authModal.addEventListener('click', (event) => {
    if (event.target === authModal) closeAuth();
});

// Show / hide password
$('#togglePass').addEventListener('click', () => {
    const field = $('#authPass');
    field.type = field.type === 'password' ? 'text' : 'password';
});

$('#forgotLink').addEventListener('click', (event) => {
    event.preventDefault();
    showToast('Password reset link sent (demo)');
});

// Password strength bar (0 to 4 points)
$('#authPass').addEventListener('input', (event) => {
    const value = event.target.value;
    let points = 0;

    if (value.length >= 6) points++;
    if (value.length >= 10) points++;
    if (/[A-Z]/.test(value) && /[a-z]/.test(value)) points++;
    if (/\d/.test(value) && /[^A-Za-z0-9]/.test(value)) points++;

    const colors = ['#ea4b48', '#ea4b48', '#ff8a00', '#e6c200', '#00b207'];
    const labels = ['Too short', 'Weak', 'Okay', 'Good', 'Strong'];

    const bar = $('#strength i');
    bar.style.width = (points * 25 || 8) + '%';
    bar.style.background = colors[points];

    $('#strength small').textContent = value ? labels[points] : '';
});

// Form submit with validation
$('#authForm').addEventListener('submit', (event) => {
    event.preventDefault();

    const name = $('#authName').value.trim();
    const email = $('#authEmail').value.trim();
    const password = $('#authPass').value;
    const confirm = $('#authConfirm').value;

    const showError = (message) => {
        $('#authError').textContent = message;
    };

    // Validation
    if (authMode === 'signup' && name.length < 2) {
        return showError('Please enter your full name.');
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return showError('Please enter a valid email address.');
    }

    if (password.length < 6) {
        return showError('Password must be at least 6 characters.');
    }

    const users = storage.get('ecoUsers') || {};

    if (authMode === 'signup') {
        if (password !== confirm) {
            return showError('Passwords do not match.');
        }

        if (users[email]) {
            return showError('An account with this email already exists.');
        }

        users[email] = { name, password };
        storage.set('ecoUsers', users);
        storage.set('ecoUser', { name, email });
        showToast(`Welcome, ${name}! Account created.`);
    } else {
        const account = users[email];

        if (!account || account.password !== password) {
            return showError('Wrong email or password. New here? Try Sign Up.');
        }

        storage.set('ecoUser', { name: account.name, email });
        showToast(`Welcome back, ${account.name}!`);
    }

    closeAuth();
    renderAuthLinks();
});

renderAuthLinks();


/* =====================================================
   8. NEWSLETTER FORMS
   ===================================================== */

$$('.newsletter-form').forEach((form) => {
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        showToast('Thanks for subscribing!');
        form.reset();
    });
});


/* =====================================================
   9. SCROLL EFFECTS + KEYBOARD SHORTCUTS
   ===================================================== */

const backTop = $('#backTop');

window.addEventListener('scroll', () => {
    // Shadow under the sticky header
    $('#header').style.boxShadow = window.scrollY > 60 ? '0 2px 10px rgba(0,0,0,0.08)' : 'none';

    // Back to top button
    backTop.style.display = window.scrollY > 500 ? 'block' : 'none';
});

backTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.addEventListener('keydown', (event) => {
    // Esc closes the popups of this file
    if (event.key === 'Escape') {
        closeSearch();
        closeAuth();
        closeDrawer();
        closeCategoryMenu();
    }

    // Ctrl + K opens search
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        openSearch();
    }
});


/* =====================================================
   10. DARK MODE
   - the small script in <head> of every page sets the first theme
     (saved choice, or the phone / computer setting)
   - the button in the header switches it and saves the choice
   - the colours are in dark.css
   ===================================================== */

const themeBtn = $('#themeBtn');

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);

    // The switch slides and the sun / moon swap in CSS (icons.css)
    themeBtn.setAttribute('aria-checked', theme === 'dark');
    themeBtn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
}

applyTheme(document.documentElement.getAttribute('data-theme') || 'light');

themeBtn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';

    applyTheme(next);
    storage.set('ecoTheme', next);
});

// If the visitor never chose a theme, follow the system when it changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
    if (!storage.get('ecoTheme')) {
        applyTheme(event.matches ? 'dark' : 'light');
    }
});
