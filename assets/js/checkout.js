/* =====================================================
   ECOBAZAR – CHECKOUT PAGE JAVASCRIPT (checkout.html)
   Needs data.js and script.js loaded before this file.

   What happens on this page:
   - the products of the cart are shown in "Order Summary"
   - the visitor fills the billing form (checked before sending)
   - "Place Order" saves the order in the browser, empties the
     cart and shows the "Thank you" message

   Sections:
   1.  Country + state lists
   2.  Order summary
   3.  Payment method note
   4.  Form helpers (errors)
   5.  Validation
   6.  Place the order
   7.  Order placed (thank you message)
   8.  Start
   ===================================================== */


/* =====================================================
   1. COUNTRY + STATE LISTS
   ===================================================== */

const COUNTRIES = {
    'Bangladesh': ['Barishal', 'Chattogram', 'Dhaka', 'Khulna', 'Mymensingh', 'Rajshahi', 'Rangpur', 'Sylhet'],
    'United States': ['California', 'Florida', 'Illinois', 'New York', 'Texas', 'Washington'],
    'United Kingdom': ['England', 'Northern Ireland', 'Scotland', 'Wales'],
    'India': ['Delhi', 'Karnataka', 'Maharashtra', 'Tamil Nadu', 'West Bengal'],
    'Canada': ['Alberta', 'British Columbia', 'Ontario', 'Quebec']
};

// Fill a country <select> and make its state <select> follow it
function setupCountry(countryId, stateId) {
    const country = $('#' + countryId);
    const state = $('#' + stateId);

    country.innerHTML = '<option value="">Select</option>' +
        Object.keys(COUNTRIES).map((name) => `<option value="${name}">${name}</option>`).join('');

    country.addEventListener('change', () => {
        const states = COUNTRIES[country.value] || [];

        state.disabled = states.length === 0;
        state.innerHTML = states.length
            ? '<option value="">Select</option>' + states.map((name) => `<option value="${name}">${name}</option>`).join('')
            : '<option value="">Select a country first</option>';
    });
}


/* =====================================================
   2. ORDER SUMMARY
   ===================================================== */

// The products in the cart: [{ item, quantity }]
function cartLines() {
    return Object.entries(cartItems)
        .map(([id, quantity]) => ({ item: findProduct(id), quantity }))
        .filter((line) => line.item);
}

function summaryRow(item, quantity) {
    return `
        <div class="summary-item">
            <img src="${PRODUCT_PATH + item.image}" alt="">
            <div class="name">
                <a href="${productUrl(item.id)}">${item.name}</a>
                <small>x${quantity}</small>
            </div>
            <b>$${(item.price * quantity).toFixed(2)}</b>
        </div>
    `;
}

// Money numbers of the order (coupon from the cart page is used)
function orderTotals() {
    const code = storage.get('ecoCoupon') || '';
    const percent = COUPONS[code] || 0;
    const subtotal = cartSubtotal();
    const discount = subtotal * percent / 100;

    return { code, percent, subtotal, discount, total: subtotal - discount };
}

function renderSummary() {
    const lines = cartLines();
    const money = orderTotals();

    $('#summaryItems').innerHTML = lines.map((line) => summaryRow(line.item, line.quantity)).join('');

    $('#sumSubtotal').textContent = '$' + money.subtotal.toFixed(2);
    $('#sumTotal').textContent = '$' + money.total.toFixed(2);

    // Discount line only appears when a coupon is applied
    $('#discountRow').hidden = money.percent === 0;
    $('#discountLabel').textContent = `Discount (${money.code}):`;
    $('#sumDiscount').textContent = '-$' + money.discount.toFixed(2);
}


/* =====================================================
   3. PAYMENT METHOD NOTE
   ===================================================== */

const PAYMENT_NOTES = {
    'Cash on Delivery': 'Pay with cash when your order arrives at your door.',
    'Paypal': 'You will be sent to PayPal to finish the payment (demo only).',
    'Amazon Pay': 'You will be sent to Amazon Pay to finish the payment (demo only).'
};

function selectedPayment() {
    return $('input[name="payment"]:checked').value;
}

function renderPayNote() {
    $('#payNote').textContent = PAYMENT_NOTES[selectedPayment()];
}

$('#payList').addEventListener('change', renderPayNote);


/* =====================================================
   4. FORM HELPERS (errors)
   ===================================================== */

// Show a red message under a field
function setError(input, message) {
    const field = input.closest('.field');

    field.classList.add('invalid');
    field.querySelector('.field-error').textContent = message;
}

function clearError(input) {
    const field = input.closest('.field');

    // Some inputs (like the "Ship to a different address" checkbox) have no .field
    if (field) field.classList.remove('invalid');
}

// The error disappears as soon as the visitor edits the field
$('#checkoutForm').addEventListener('input', (event) => clearError(event.target));
$('#checkoutForm').addEventListener('change', (event) => clearError(event.target));

function value(id) {
    return $('#' + id).value.trim();
}


/* =====================================================
   5. VALIDATION
   Every check returns true / false and shows its own message.
   ===================================================== */

function requireText(id, label, minLength = 2) {
    if (value(id).length < minLength) {
        setError($('#' + id), `Please enter your ${label}.`);
        return false;
    }
    return true;
}

function requireSelect(id, label) {
    if (!value(id)) {
        setError($('#' + id), `Please select your ${label}.`);
        return false;
    }
    return true;
}

function requireZip(id) {
    if (!/^[A-Za-z0-9 -]{3,10}$/.test(value(id))) {
        setError($('#' + id), 'Enter a valid zip code (3-10 letters or numbers).');
        return false;
    }
    return true;
}

function requireEmail(id) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value(id))) {
        setError($('#' + id), 'Please enter a valid email address.');
        return false;
    }
    return true;
}

function requirePhone(id) {
    const digits = value(id).replace(/\D/g, '');

    if (!/^[0-9+()\s-]+$/.test(value(id)) || digits.length < 7 || digits.length > 15) {
        setError($('#' + id), 'Please enter a valid phone number (7-15 digits).');
        return false;
    }
    return true;
}

// Check the whole form. Returns the first wrong field (or null).
function validateForm() {
    const checks = [
        requireText('firstName', 'first name'),
        requireText('lastName', 'last name'),
        requireText('street', 'street address', 5),
        requireSelect('country', 'country'),
        requireSelect('state', 'state'),
        requireZip('zip'),
        requireEmail('email'),
        requirePhone('phone')
    ];

    // Shipping fields only count when "Ship to a different address" is ticked
    if ($('#shipDifferent').checked) {
        checks.push(
            requireText('shipName', 'receiver name'),
            requireText('shipStreet', 'street address', 5),
            requireSelect('shipCountry', 'country'),
            requireSelect('shipState', 'state'),
            requireZip('shipZip')
        );
    }

    return $('#checkoutForm .field.invalid input, #checkoutForm .field.invalid select');
}

// "Ship to a different address" opens the shipping fields
$('#shipDifferent').addEventListener('change', (event) => {
    $('#shipBox').hidden = !event.target.checked;
});


/* =====================================================
   6. PLACE THE ORDER
   ===================================================== */

function makeOrderNumber() {
    // Example: ECO-483920
    return 'ECO-' + String(Math.floor(100000 + Math.random() * 900000));
}

function addressText(street, state, zip, country) {
    return `${street}, ${state} ${zip}, ${country}`;
}

function buildOrder() {
    const money = orderTotals();
    const different = $('#shipDifferent').checked;

    const billing = {
        name: value('firstName') + ' ' + value('lastName'),
        company: value('company'),
        email: value('email'),
        phone: value('phone'),
        address: addressText(value('street'), value('state'), value('zip'), value('country'))
    };

    const shipping = different
        ? {
            name: value('shipName'),
            address: addressText(value('shipStreet'), value('shipState'), value('shipZip'), value('shipCountry'))
        }
        : { name: billing.name, address: billing.address };

    return {
        number: makeOrderNumber(),
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        items: cartLines().map((line) => ({
            id: line.item.id,
            name: line.item.name,
            price: line.item.price,
            quantity: line.quantity,
            image: line.item.image
        })),
        coupon: money.percent ? money.code : '',
        subtotal: money.subtotal,
        discount: money.discount,
        total: money.total,
        payment: selectedPayment(),
        notes: value('notes'),
        billing,
        shipping
    };
}

$('#checkoutForm').addEventListener('submit', (event) => {
    event.preventDefault();

    const firstWrong = validateForm();

    if (firstWrong) {
        // Scroll to the first wrong field and put the cursor there
        firstWrong.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstWrong.focus({ preventScroll: true });
        showToast('Please fix the highlighted fields');
        return;
    }

    if (cartCount() === 0) {
        showToast('Your cart is empty');
        return;
    }

    // Button shows "Placing order..." for a moment (like a real shop)
    $('#placeBtn').disabled = true;
    $('#placeBtn').textContent = 'Placing order...';

    setTimeout(() => {
        const order = buildOrder();

        // Save the order in the browser
        const orders = storage.get('ecoOrders') || [];
        orders.unshift(order);
        storage.set('ecoOrders', orders);

        // Empty the cart and forget the coupon
        cartItems = {};
        saveCart();
        storage.remove('ecoCoupon');

        showOrderDone(order);
    }, 900);
});


/* =====================================================
   7. ORDER PLACED (THANK YOU MESSAGE)
   ===================================================== */

function showOrderDone(order) {
    $('#checkoutLayout').hidden = true;
    $('#checkoutEmpty').hidden = true;
    $('#orderDone').hidden = false;

    $('#doneEmail').textContent = order.billing.email;
    $('#doneNumber').textContent = order.number;
    $('#doneDate').textContent = order.date;
    $('#donePayment').textContent = order.payment;
    $('#doneTotal').textContent = '$' + order.total.toFixed(2);

    $('#doneItems').innerHTML = order.items.map((line) => `
        <div class="summary-item">
            <img src="${PRODUCT_PATH + line.image}" alt="">
            <div class="name">${line.name} <small>x${line.quantity}</small></div>
            <b>$${(line.price * line.quantity).toFixed(2)}</b>
        </div>
    `).join('');

    $('#doneAddress').innerHTML =
        `<b>${escapeHTML(order.shipping.name)}</b><br>${escapeHTML(order.shipping.address)}<br>` +
        `Phone: ${escapeHTML(order.billing.phone)}`;

    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.title = 'Order placed – Ecobazar';
}


/* =====================================================
   8. START
   ===================================================== */

setupCountry('country', 'state');
setupCountry('shipCountry', 'shipState');
renderPayNote();

// Logged-in visitors: fill name and email for them
const savedUser = storage.get('ecoUser');

if (savedUser) {
    const parts = savedUser.name.split(' ');

    $('#firstName').value = parts[0] || '';
    $('#lastName').value = parts.slice(1).join(' ');
    $('#email').value = savedUser.email || '';
}

if (cartCount() === 0) {
    // Nothing to buy: show the empty message instead of the form
    $('#checkoutLayout').hidden = true;
    $('#checkoutEmpty').hidden = false;
} else {
    renderSummary();
}
