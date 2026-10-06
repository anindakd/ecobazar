/* =====================================================
   ECOBAZAR – PRODUCT PAGE JAVASCRIPT (product.html)
   Needs data.js and script.js loaded before this file.

   The page works for EVERY product:  product.html?id=5
   The id is read from the address bar and the page is
   filled with that product's data.

   Sections:
   1.  Find the product
   2.  Text helpers (description, additional info)
   3.  Fill the top part (name, price, tags ...)
   4.  Image gallery + zoom
   5.  Quantity, add to cart, wishlist, share
   6.  Tabs
   7.  Description + additional information
   8.  Customer reviews
   9.  Related products
   10. Video popup
   11. Start
   ===================================================== */


/* =====================================================
   1. FIND THE PRODUCT
   ===================================================== */

const params = new URLSearchParams(window.location.search);
const item = findProduct(params.get('id'));

let quantity = 1;


/* =====================================================
   2. TEXT HELPERS
   ===================================================== */

function categoryName(slug) {
    const category = CATEGORIES.find((entry) => entry.slug === slug);
    return category ? category.name : 'Products';
}

// Fresh food (fruit, vegetables, meat) or packed food
function isFresh(product) {
    return ['fruit', 'vegetables', 'meat-fish'].includes(product.category);
}

function discountPercent(product) {
    return product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;
}

// Short text under the price
function shortText(product) {
    return `${product.name} is carefully selected for quality and freshness. ` +
        `Delivered to your door with free shipping and a 30 day money-back guarantee. ` +
        `Part of our ${categoryName(product.category)} collection.`;
}

// Long description (a list of paragraphs)
function descriptionParagraphs(product) {
    const name = product.name;
    const category = categoryName(product.category).toLowerCase();

    if (isFresh(product)) {
        return [
            `${name} is sourced from trusted local farms and delivered fresh to your kitchen. ` +
            `Every item is checked by hand before packing, so you only get the best quality ${category}.`,

            `Store ${name.toLowerCase()} in a cool place or in the fridge to keep it fresh for longer. ` +
            `It is easy to prepare and works well in daily meals, salads and special recipes. ` +
            `We never use harmful chemicals on our fresh products.`
        ];
    }

    return [
        `${name} is a popular choice from our ${category} range. ` +
        `All our packed products come from trusted brands and are checked for quality before delivery.`,

        `Please check the expiry date on the pack and store the product in a cool, dry place. ` +
        `If you are not happy with ${name.toLowerCase()}, you can return it within 30 days.`
    ];
}

function checklist(product) {
    return isFresh(product)
        ? [
            '100% fresh and natural',
            'Picked and packed on the same day',
            'Rich in vitamins and minerals',
            'Free shipping on all your order'
        ]
        : [
            'Original and sealed product',
            'Checked for quality and expiry date',
            'Trusted brand quality',
            'Free shipping on all your order'
        ];
}

// Rows of the "Additional Information" table
function infoRows(product) {
    const fresh = isFresh(product);

    return [
        ['Weight',            fresh ? '1 kg' : '500 g'],
        ['Type',              fresh ? 'Organic' : 'Packed'],
        ['Category',          categoryName(product.category)],
        ['Quality',           'Premium Grade A'],
        ['Country of Origin', 'Bangladesh'],
        ['Shelf Life',        fresh ? '5 - 7 days' : '6 - 12 months'],
        ['Storage',           fresh ? 'Keep in a cool place or in the fridge' : 'Keep in a cool, dry place'],
        ['Availability',      product.outOfStock ? 'Out of stock' : 'In stock']
    ];
}

function skuOf(product) {
    return 200000 + product.id * 1337;
}


/* =====================================================
   3. FILL THE TOP PART
   ===================================================== */

function fillTop() {
    const percent = discountPercent(item);

    document.title = item.name + ' – Ecobazar';

    // Breadcrumb
    $('#crumbCurrent').textContent = item.name;
    $('#crumbCategory').textContent = categoryName(item.category);
    $('#crumbCategory').href = categoryUrl(item.category);

    // Title + stock
    $('#pdName').textContent = item.name;
    $('#pdStock').textContent = item.outOfStock ? 'Out of Stock' : 'In Stock';
    $('#pdStock').classList.toggle('out', item.outOfStock);

    // Rating + SKU
    $('#pdStars').innerHTML = starsHTML(item.rating);
    $('#pdSku').textContent = 'SKU: ' + skuOf(item);

    // Price
    $('#pdPrice').textContent = '$' + item.price.toFixed(2);
    $('#pdOld').textContent = item.oldPrice ? '$' + item.oldPrice.toFixed(2) : '';
    $('#pdOff').textContent = percent ? percent + '% Off' : '';
    $('#pdOld').hidden = !item.oldPrice;
    $('#pdOff').hidden = !percent;

    $('#pdShort').textContent = shortText(item);

    // Category + tag links
    $('#pdCategory').textContent = categoryName(item.category);
    $('#pdCategory').href = categoryUrl(item.category);

    const tagLinks = item.tags.map((slug) => {
        const tag = TAGS.find((entry) => entry.slug === slug);
        return tag ? `<a href="categories.html?tag=${slug}">${tag.name}</a>` : '';
    });

    $('#pdTags').innerHTML = tagLinks.length ? tagLinks.join(' ') : '<a href="categories.html">None</a>';

    // Info box (under the video)
    const saving = percent || 10;
    $('#infoDiscount').textContent = saving + '% Discount';
    $('#infoDiscountText').textContent = `Save your ${saving}% money with us`;
    $('#infoQuality').textContent = isFresh(item) ? '100% Organic' : '100% Original';
    $('#infoQualityText').textContent = `100% quality ${categoryName(item.category)}`;

    // Wishlist heart + cart button state
    updateWishButton();

    if (item.outOfStock) {
        $('#addCartBtn').disabled = true;
        $('#addCartBtn').textContent = 'Out of Stock';
    }
}


/* =====================================================
   4. IMAGE GALLERY + ZOOM
   The 4 thumbnails show different views of the same photo
   (normal, flipped, zoomed in, zoomed + flipped).
   ===================================================== */

const VIEWS = [
    { name: 'Front',   transform: 'none' },
    { name: 'Flipped', transform: 'scaleX(-1)' },
    { name: 'Closer',  transform: 'scale(1.5)' },
    { name: 'Detail',  transform: 'scale(1.5) scaleX(-1)' }
];

let currentView = 0;

function renderGallery() {
    const src = PRODUCT_PATH + item.image;

    $('#thumbList').innerHTML = VIEWS.map((view, index) => `
        <button class="thumb ${index === 0 ? 'active' : ''}" data-view="${index}" aria-label="${view.name} view">
            <img src="${src}" alt="" style="transform:${view.transform}">
        </button>
    `).join('');

    $('#mainImg').src = src;
    $('#mainImg').alt = item.name;

    selectView(0);
}

function selectView(index) {
    currentView = (index + VIEWS.length) % VIEWS.length;

    $('#mainImg').dataset.base = VIEWS[currentView].transform;
    $('#mainImg').style.transform = VIEWS[currentView].transform;

    $$('.thumb').forEach((thumb, i) => thumb.classList.toggle('active', i === currentView));
}

$('#thumbList').addEventListener('click', (event) => {
    const thumb = event.target.closest('.thumb');
    if (thumb) selectView(Number(thumb.dataset.view));
});

$('#thumbUp').addEventListener('click', () => selectView(currentView - 1));
$('#thumbDown').addEventListener('click', () => selectView(currentView + 1));

// Zoom while the mouse moves over the big image (desktop only)
const mainBox = $('#mainBox');
const mainImg = $('#mainImg');

mainBox.addEventListener('mousemove', (event) => {
    if (window.innerWidth <= 991) return;

    const box = mainBox.getBoundingClientRect();
    const x = ((event.clientX - box.left) / box.width) * 100;
    const y = ((event.clientY - box.top) / box.height) * 100;

    mainImg.style.transformOrigin = `${x}% ${y}%`;
    mainImg.style.transform = `${mainImg.dataset.base === 'none' ? '' : mainImg.dataset.base} scale(1.6)`;
});

mainBox.addEventListener('mouseleave', () => {
    mainImg.style.transformOrigin = 'center';
    mainImg.style.transform = mainImg.dataset.base;
});


/* =====================================================
   5. QUANTITY, ADD TO CART, WISHLIST, SHARE
   ===================================================== */

$('#qtyMinus').addEventListener('click', () => {
    quantity = Math.max(1, quantity - 1);
    $('#qtyValue').textContent = quantity;
});

$('#qtyPlus').addEventListener('click', () => {
    quantity = Math.min(20, quantity + 1);
    $('#qtyValue').textContent = quantity;
});

$('#addCartBtn').addEventListener('click', () => addToCart(item.id, quantity));

function updateWishButton() {
    const liked = wishlist.includes(item.id);

    $('#wishBtn').classList.toggle('on', liked);
}

$('#wishBtn').addEventListener('click', () => {
    const added = toggleWishlist(item.id);

    updateWishButton();
    showToast(added ? 'Added to wishlist' : 'Removed from wishlist');
});

// Share buttons copy the page link
$$('.share button').forEach((button) => {
    button.addEventListener('click', () => {
        const link = window.location.href;

        if (navigator.clipboard) {
            navigator.clipboard.writeText(link).catch(() => { });
        }

        showToast('Link copied (' + button.dataset.share + ')');
    });
});


/* =====================================================
   6. TABS (Descriptions / Additional Information / Feedback)
   ===================================================== */

$('.tab-nav').addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button) return;

    $$('.tab-nav button').forEach((tab) => tab.classList.remove('active'));
    $$('.tab-pane').forEach((pane) => pane.classList.remove('active'));

    button.classList.add('active');
    $('#' + button.dataset.tab).classList.add('active');
});


/* =====================================================
   7. DESCRIPTION + ADDITIONAL INFORMATION
   ===================================================== */

function renderDescription() {
    const paragraphs = descriptionParagraphs(item).map((text) => `<p>${text}</p>`);
    const points = checklist(item).map((text) => `<li>${text}</li>`).join('');

    $('#descText').innerHTML = `
        ${paragraphs[0]}
        <ul class="check-list">${points}</ul>
        ${paragraphs[1]}
    `;
}

function renderInfoTable() {
    $('#infoTable').innerHTML = infoRows(item).map((row) => `
        <tr>
            <th>${row[0]}</th>
            <td>${row[1]}</td>
        </tr>
    `).join('');
}


/* =====================================================
   8. CUSTOMER REVIEWS
   Three sample reviews + reviews written by the visitor
   (saved in the browser for each product)
   ===================================================== */

const SAMPLE_REVIEWS = [
    {
        name: 'Jenny Wilson',
        image: 'avatar-1.jpg',
        date: '12 Jan 2021',
        text: 'Really fresh and good quality. It arrived on time and was packed very well. I will order again.'
    },
    {
        name: 'Guy Hawkins',
        image: 'avatar-2.jpg',
        date: '03 Feb 2021',
        text: 'Good price and fast delivery. The quality is exactly like the picture. Highly recommended.'
    },
    {
        name: 'Kathryn Murphy',
        image: 'avatar-3.jpg',
        date: '21 Mar 2021',
        text: 'My family loved it. Very fresh and the customer support was also helpful.'
    }
];

function getMyReviews() {
    const all = storage.get('ecoReviews') || {};
    return all[item.id] || [];
}

function saveMyReview(review) {
    const all = storage.get('ecoReviews') || {};

    all[item.id] = [review, ...(all[item.id] || [])];
    storage.set('ecoReviews', all);
}

function renderReviews() {
    const mine = getMyReviews();
    const all = [...mine, ...SAMPLE_REVIEWS];

    $('#pdReviews').textContent = all.length + ' Review';

    $('#reviewList').innerHTML = all.map((review) => {
        // Sample reviews have a photo, new reviews use the first letter
        const avatar = review.image
            ? `<img src="${IMG_PATH + review.image}" alt="">`
            : `<span class="avatar-letter">${escapeHTML(review.name.charAt(0).toUpperCase())}</span>`;

        const stars = review.rating ? starsHTML(review.rating) : starsHTML(item.rating);

        return `
            <div class="review">
                ${avatar}
                <div>
                    <h5>${escapeHTML(review.name)} <small>${review.date}</small></h5>
                    <div class="stars">${stars}</div>
                    <p>${escapeHTML(review.text)}</p>
                </div>
            </div>
        `;
    }).join('');
}

$('#reviewForm').addEventListener('submit', (event) => {
    event.preventDefault();

    const name = $('#reviewName').value.trim();
    const text = $('#reviewText').value.trim();
    const rating = Number($('#reviewRating').value);

    if (name.length < 2) {
        $('#reviewError').textContent = 'Please enter your name.';
        return;
    }

    if (text.length < 10) {
        $('#reviewError').textContent = 'Please write at least 10 characters.';
        return;
    }

    $('#reviewError').textContent = '';

    saveMyReview({
        name,
        text,
        rating,
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    });

    event.target.reset();
    renderReviews();
    showToast('Thanks! Your review was added.');
});


/* =====================================================
   9. RELATED PRODUCTS
   Same category first, then other products to fill 4 cards
   ===================================================== */

function renderRelated() {
    const sameCategory = PRODUCTS.filter((entry) => entry.category === item.category && entry.id !== item.id);
    const others = PRODUCTS.filter((entry) => entry.category !== item.category);

    const related = [...sameCategory, ...others].slice(0, 4);

    $('#relatedGrid').innerHTML = related.map((entry) => productCard(entry)).join('');
}


/* =====================================================
   10. VIDEO POPUP
   (put your YouTube embed link in data-video in product.html)
   ===================================================== */

const videoModal = $('#videoModal');

$('#pdPlay').addEventListener('click', (event) => {
    const link = event.currentTarget.dataset.video;

    if (!link) {
        showToast('Add a video link in data-video (product.html)');
        return;
    }

    $('#videoFrame').src = link;
    openModal(videoModal);
});

function closeVideo() {
    closeModal(videoModal);
    $('#videoFrame').src = '';   // stops the video
}

$('#videoClose').addEventListener('click', closeVideo);

videoModal.addEventListener('click', (event) => {
    if (event.target === videoModal) closeVideo();
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeVideo();
});


/* =====================================================
   11. START
   ===================================================== */

if (item) {
    fillTop();
    renderGallery();
    renderDescription();
    renderInfoTable();
    renderReviews();
    renderRelated();
} else {
    // Wrong or missing id: hide the page and show a message
    $('#productPage').hidden = true;
    $('#notFound').hidden = false;
    $('#crumbCurrent').textContent = 'Not found';
}
