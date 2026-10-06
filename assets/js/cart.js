/* =====================================================
   ECOBAZAR – CART PAGE JAVASCRIPT (cart.html)
   Needs data.js and script.js loaded before this file.

   How the quantity buttons work:
   - the + / - buttons change a temporary copy ("pending")
   - the row subtotal and Cart Total update straight away
   - "Update Cart" saves the new quantities
   - the X button removes a product at once

   Sections:
   1.  State + coupons
   2.  Render the cart
   3.  Totals
   4.  Quantity, remove, update
   5.  Coupon
   6.  Checkout (opens checkout.html)
   7.  Start
   ===================================================== */


/* =====================================================
   1. STATE + COUPONS
   ===================================================== */

// Working copy of the cart: { productId: quantity }
let pending = { ...cartItems };

// Coupon codes (COUPONS) are in data.js, because checkout.js uses them too
let couponCode = storage.get('ecoCoupon') || '';

// Did the visitor change a quantity but not press "Update Cart" yet?
function hasChanges() {
    const ids = new Set([...Object.keys(cartItems), ...Object.keys(pending)]);
    return [...ids].some((id) => (cartItems[id] || 0) !== (pending[id] || 0));
}


/* =====================================================
   2. RENDER THE CART
   ===================================================== */

function cartRow(item, quantity) {
    return `
        <div class="list-row cart-grid" data-id="${item.id}">

            <div class="cell-product">
                <a href="${productUrl(item.id)}">
                    <img src="${PRODUCT_PATH + item.image}" alt="${escapeHTML(item.name)}">
                </a>
                <a href="${productUrl(item.id)}">${item.name}</a>
            </div>

            <div data-label="Price">$${item.price.toFixed(2)}</div>

            <div data-label="Quantity">
                <div class="qty-small">
                    <button class="qty-minus" aria-label="Less">−</button>
                    <span class="qty-value">${quantity}</span>
                    <button class="qty-plus" aria-label="More">+</button>
                </div>
            </div>

            <div data-label="Subtotal"><b class="row-subtotal">$${(item.price * quantity).toFixed(2)}</b></div>

            <button class="remove-btn" aria-label="Remove from cart">${icon('x')}</button>

        </div>
    `;
}

function renderCartPage() {
    const rows = Object.entries(pending)
        .map(([id, quantity]) => ({ item: findProduct(id), quantity }))
        .filter((row) => row.item);

    $('#cartRows').innerHTML = rows.map((row) => cartRow(row.item, row.quantity)).join('');

    // Empty cart -> show the empty message instead of the table
    $('#cartLayout').hidden = rows.length === 0;
    $('#cartEmpty').hidden = rows.length !== 0;

    renderTotals();
}


/* =====================================================
   3. TOTALS
   ===================================================== */

function pendingSubtotal() {
    return Object.entries(pending).reduce((sum, [id, quantity]) => {
        const item = findProduct(id);
        return item ? sum + item.price * quantity : sum;
    }, 0);
}

function renderTotals() {
    const subtotal = pendingSubtotal();
    const percent = COUPONS[couponCode] || 0;
    const discount = subtotal * percent / 100;

    $('#sumSubtotal').textContent = '$' + subtotal.toFixed(2);
    $('#sumTotal').textContent = '$' + (subtotal - discount).toFixed(2);

    // Discount line only appears when a coupon is applied
    $('#discountRow').hidden = percent === 0;
    $('#discountLabel').textContent = `Discount (${couponCode}):`;
    $('#sumDiscount').textContent = '-$' + discount.toFixed(2);

    // "Update Cart" turns green when there is something to save
    $('#updateBtn').classList.toggle('highlight', hasChanges());

    renderCouponNote();
}


/* =====================================================
   4. QUANTITY, REMOVE, UPDATE
   ===================================================== */

$('#cartRows').addEventListener('click', (event) => {
    const row = event.target.closest('.list-row');
    if (!row) return;

    const id = row.dataset.id;
    const item = findProduct(id);

    if (event.target.closest('.qty-plus')) {
        pending[id] = Math.min(99, pending[id] + 1);
    }

    if (event.target.closest('.qty-minus')) {
        pending[id] = Math.max(1, pending[id] - 1);
    }

    if (event.target.closest('.qty-plus, .qty-minus')) {
        // Only change the numbers, so the buttons keep working smoothly
        row.querySelector('.qty-value').textContent = pending[id];
        row.querySelector('.row-subtotal').textContent = '$' + (item.price * pending[id]).toFixed(2);
        renderTotals();
    }

    if (event.target.closest('.remove-btn')) {
        delete pending[id];
        removeFromCart(id);          // removed from the saved cart at once
        renderCartPage();
        showToast(item.name + ' removed from cart');
    }
});

$('#updateBtn').addEventListener('click', () => {
    if (!hasChanges()) {
        showToast('Your cart is already up to date');
        return;
    }

    cartItems = { ...pending };
    saveCart();
    renderTotals();
    showToast('Cart updated');
});


/* =====================================================
   5. COUPON
   ===================================================== */

const couponNote = $('#couponNote');

function renderCouponNote() {
    if (COUPONS[couponCode]) {
        couponNote.className = 'coupon-note ok';
        couponNote.innerHTML = `Coupon <b>${couponCode}</b> applied (${COUPONS[couponCode]}% off)
            <button type="button" id="removeCoupon">Remove</button>`;
    } else if (!couponNote.classList.contains('error')) {
        couponNote.className = 'coupon-note';
        couponNote.innerHTML = 'Try the codes <b>ECO10</b> (10% off) or <b>FRESH20</b> (20% off).';
    }
}

$('#couponForm').addEventListener('submit', (event) => {
    event.preventDefault();

    const code = $('#couponInput').value.trim().toUpperCase();

    if (!code) {
        showToast('Please enter a coupon code');
        return;
    }

    if (!COUPONS[code]) {
        couponNote.className = 'coupon-note error';
        couponNote.textContent = `"${code}" is not a valid coupon code.`;
        return;
    }

    couponCode = code;
    storage.set('ecoCoupon', code);
    $('#couponInput').value = '';
    renderTotals();
    showToast(`Coupon ${code} applied`);
});

// Remove the applied coupon (the button is created by renderCouponNote)
couponNote.addEventListener('click', (event) => {
    if (event.target.id !== 'removeCoupon') return;

    couponCode = '';
    storage.remove('ecoCoupon');
    renderTotals();
    showToast('Coupon removed');
});


/* =====================================================
   6. CHECKOUT
   ===================================================== */

$('#checkoutBtn').addEventListener('click', () => {
    // Save any quantity change first
    cartItems = { ...pending };
    saveCart();

    if (cartCount() === 0) {
        showToast('Your cart is empty');
        return;
    }

    window.location.href = 'checkout.html';
});


/* =====================================================
   7. START
   ===================================================== */

renderCartPage();
