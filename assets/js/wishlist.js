/* =====================================================
   ECOBAZAR – WISHLIST PAGE JAVASCRIPT (wishlist.html)
   Needs data.js and script.js loaded before this file.

   The wishlist is the list of product ids saved when the
   visitor clicks the heart on any product (any page).

   Sections:
   1.  Render the wishlist
   2.  Buttons (add to cart, remove)
   3.  Share buttons
   4.  Start
   ===================================================== */


/* =====================================================
   1. RENDER THE WISHLIST
   ===================================================== */

function wishRow(item) {
    const oldPrice = item.oldPrice ? `<s>$${item.oldPrice.toFixed(2)}</s>` : '';

    const status = item.outOfStock
        ? '<span class="status out">Out of Stock</span>'
        : '<span class="status in">In Stock</span>';

    return `
        <div class="list-row wish-grid" data-id="${item.id}">

            <div class="cell-product">
                <a href="${productUrl(item.id)}">
                    <img src="${PRODUCT_PATH + item.image}" alt="${escapeHTML(item.name)}">
                </a>
                <a href="${productUrl(item.id)}">${item.name}</a>
            </div>

            <div class="price-text" data-label="Price">
                <b>$${item.price.toFixed(2)}</b> ${oldPrice}
            </div>

            <div data-label="Stock Status">${status}</div>

            <div class="cell-actions">
                <button class="pill-btn add-to-cart" ${item.outOfStock ? 'disabled' : ''}>Add to Cart</button>
                <button class="remove-btn" aria-label="Remove from wishlist">${icon('x')}</button>
            </div>

        </div>
    `;
}

function renderWishlist() {
    // Keep only ids that still exist in data.js
    const items = wishlist.map((id) => findProduct(id)).filter(Boolean);

    $('#wishRows').innerHTML = items.map(wishRow).join('');

    // Empty wishlist -> show the empty message instead of the table
    $('#wishBox').hidden = items.length === 0;
    $('#wishEmpty').hidden = items.length !== 0;
}


/* =====================================================
   2. BUTTONS (add to cart, remove)
   ===================================================== */

$('#wishRows').addEventListener('click', (event) => {
    const row = event.target.closest('.list-row');
    if (!row) return;

    const id = Number(row.dataset.id);

    if (event.target.closest('.add-to-cart')) {
        addToCart(id);
    }

    if (event.target.closest('.remove-btn')) {
        toggleWishlist(id);        // already in the list, so this removes it
        renderWishlist();
        showToast('Removed from wishlist');
    }
});


/* =====================================================
   3. SHARE BUTTONS (copy the page link)
   ===================================================== */

$$('.list-share button').forEach((button) => {
    button.addEventListener('click', () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(window.location.href).catch(() => { });
        }

        showToast('Link copied (' + button.dataset.share + ')');
    });
});


/* =====================================================
   4. START
   ===================================================== */

renderWishlist();
