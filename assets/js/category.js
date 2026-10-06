/* =====================================================
   ECOBAZAR – CATEGORY PAGE JAVASCRIPT (categories.html)
   Needs data.js and script.js loaded before this file.

   Everything on this page works without reloading:
   category, search, price, rating, tags, sort, pages.

   Sections:
   1.  State (the current filters)
   2.  Filtering + sorting
   3.  Render the product list
   4.  Render the pagination
   5.  Sidebar (categories, price, rating, tags, sale list)
   6.  Top row (Filter button, sort, clear)
   7.  Quick view popup (eye button)
   8.  Start
   ===================================================== */


/* =====================================================
   1. STATE
   ===================================================== */

const PER_PAGE = 9;
const PRICE_MAX = Math.ceil(Math.max(...PRODUCTS.map((item) => item.price)) / 5) * 5;

const state = {
    category: 'vegetables',   // category slug or 'all'
    search: '',
    sort: 'latest',
    minPrice: 0,
    maxPrice: PRICE_MAX,
    ratings: [],              // selected rating numbers, e.g. [4]
    tags: [],                 // selected tag slugs
    onSale: false,
    page: 1
};

// Read ?cat=... and ?search=... from the address bar
function readURL() {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get('cat');
    const search = params.get('search');
    const tag = params.get('tag');

    if (cat === 'all' || CATEGORIES.some((category) => category.slug === cat)) {
        state.category = cat;
    }

    if (search) {
        state.search = search.trim();
        state.category = 'all';
    }

    // Coming from a tag link on the product page
    if (tag && TAGS.some((item) => item.slug === tag)) {
        state.tags = [tag];
        state.category = 'all';
    }
}

// Keep the address bar in sync (so the link can be shared / refreshed)
function writeURL() {
    let url = 'categories.html?cat=' + state.category;

    if (state.search) {
        url = 'categories.html?search=' + encodeURIComponent(state.search);
    } else if (state.category === 'all' && state.tags.length === 1) {
        url = 'categories.html?tag=' + state.tags[0];
    }

    try {
        history.replaceState(null, '', url);
    } catch (error) { }   // some browsers block this on local files
}

function categoryName(slug) {
    if (slug === 'all') return 'All Products';

    const category = CATEGORIES.find((item) => item.slug === slug);
    return category ? category.name : 'Products';
}

function hasActiveFilters() {
    return state.search !== ''
        || state.minPrice > 0
        || state.maxPrice < PRICE_MAX
        || state.ratings.length > 0
        || state.tags.length > 0
        || state.onSale;
}


/* =====================================================
   2. FILTERING + SORTING
   ===================================================== */

function getFilteredProducts() {
    const keyword = state.search.toLowerCase();
    const minRating = state.ratings.length ? Math.min(...state.ratings) : 0;

    const list = PRODUCTS.filter((item) => {
        if (state.category !== 'all' && item.category !== state.category) return false;
        if (keyword && !item.name.toLowerCase().includes(keyword)) return false;
        if (item.price < state.minPrice || item.price > state.maxPrice) return false;
        if (item.rating < minRating) return false;
        if (state.tags.length && !state.tags.some((tag) => item.tags.includes(tag))) return false;
        if (state.onSale && !item.oldPrice) return false;

        return true;
    });

    // Sort (a copy is used, so the original order is kept for "Latest")
    const sorters = {
        'price-low':  (a, b) => a.price - b.price,
        'price-high': (a, b) => b.price - a.price,
        'rating':     (a, b) => b.rating - a.rating,
        'name':       (a, b) => a.name.localeCompare(b.name)
    };

    if (sorters[state.sort]) {
        list.sort(sorters[state.sort]);
    }

    return list;
}


/* =====================================================
   3. RENDER THE PRODUCT LIST
   ===================================================== */

function render() {
    const list = getFilteredProducts();
    const totalPages = Math.max(1, Math.ceil(list.length / PER_PAGE));

    // Keep the page number inside the valid range
    state.page = Math.min(state.page, totalPages);

    const start = (state.page - 1) * PER_PAGE;
    const pageItems = list.slice(start, start + PER_PAGE);

    if (pageItems.length) {
        $('#shopGrid').innerHTML = pageItems.map((item) => productCard(item, true)).join('');
    } else {
        $('#shopGrid').innerHTML = `
            <div class="empty-state">
                <h3>No products found</h3>
                <p>Try another category, keyword or clear the filters.</p>
            </div>
        `;
    }

    $('#resultCount').textContent = list.length;
    $('#clearBtn').hidden = !hasActiveFilters();

    // Breadcrumb text
    $('#crumbCurrent').textContent = state.search
        ? `Search: "${state.search}"`
        : categoryName(state.category);

    document.title = categoryName(state.category) + ' – Ecobazar';

    renderPagination(totalPages);
    renderCategoryList();
    writeURL();
}


/* =====================================================
   4. PAGINATION
   ===================================================== */

function pageButton(label, page, extra = '') {
    return `<button data-page="${page}" class="${extra}">${label}</button>`;
}

function renderPagination(totalPages) {
    if (totalPages <= 1) {
        $('#pagination').innerHTML = '';
        return;
    }

    // Which page numbers to show (1 2 3 ... last)
    let pages = [];

    if (totalPages <= 7) {
        pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else if (state.page <= 4) {
        pages = [1, 2, 3, 4, 5, '...', totalPages];
    } else if (state.page >= totalPages - 3) {
        pages = [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    } else {
        pages = [1, '...', state.page - 1, state.page, state.page + 1, '...', totalPages];
    }

    const numbers = pages.map((page) => {
        if (page === '...') return '<span class="dots-text">...</span>';
        return pageButton(page, page, page === state.page ? 'active' : '');
    }).join('');

    $('#pagination').innerHTML = `
        <button data-page="${state.page - 1}" ${state.page === 1 ? 'disabled' : ''}>${icon('chevron-left')}</button>
        ${numbers}
        <button data-page="${state.page + 1}" ${state.page === totalPages ? 'disabled' : ''}>${icon('chevron-right')}</button>
    `;
}

$('#pagination').addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button || button.disabled) return;

    state.page = Number(button.dataset.page);
    render();
    scrollToShop();
});

// Scroll up to the top of the product list
function scrollToShop() {
    const top = $('.shop').getBoundingClientRect().top + window.scrollY - 70;
    window.scrollTo({ top, behavior: 'smooth' });
}


/* =====================================================
   5. SIDEBAR
   ===================================================== */

/* ----- Categories (radio list with product counts) ----- */

function renderCategoryList() {
    const rows = [{ slug: 'all', name: 'All Products' }, ...CATEGORIES];

    $('#categoryList').innerHTML = rows.map((category) => {
        const count = category.slug === 'all'
            ? PRODUCTS.length
            : PRODUCTS.filter((item) => item.category === category.slug).length;

        return `
            <li>
                <label>
                    <input type="radio" name="category" value="${category.slug}" ${state.category === category.slug ? 'checked' : ''}>
                    <span class="cat-name">${category.name}</span>
                    <span class="count">(${count})</span>
                </label>
            </li>
        `;
    }).join('');
}

// Called by the radio buttons AND by the mobile drawer links (script.js)
function selectCategory(slug) {
    state.category = slug;
    state.search = '';
    state.page = 1;

    render();
    closeFilterPanel();
    scrollToShop();
}

$('#categoryList').addEventListener('change', (event) => {
    selectCategory(event.target.value);
});

/* ----- Search (called by the search popup in script.js) ----- */

function applySearch(keyword) {
    state.search = keyword;
    state.category = 'all';
    state.page = 1;

    render();
    scrollToShop();
}

/* ----- Collapse / open sidebar boxes ----- */

$$('.side-title:not(.plain)').forEach((title) => {
    title.addEventListener('click', () => {
        title.closest('.side-box').classList.toggle('collapsed');
    });
});

/* ----- Price slider (two handles) ----- */

const priceMin = $('#priceMin');
const priceMax = $('#priceMax');

priceMin.max = priceMax.max = PRICE_MAX;
priceMin.value = state.minPrice;
priceMax.value = state.maxPrice;

function updatePriceUI() {
    const left = (state.minPrice / PRICE_MAX) * 100;
    const right = 100 - (state.maxPrice / PRICE_MAX) * 100;

    $('#rangeFill').style.left = left + '%';
    $('#rangeFill').style.right = right + '%';
    $('#priceLabel').textContent = `$${state.minPrice} — $${state.maxPrice}`;
}

function onPriceChange(event) {
    let min = Number(priceMin.value);
    let max = Number(priceMax.value);

    // The two handles must not cross each other
    if (min > max) {
        if (event.target === priceMin) min = max;
        else max = min;
    }

    priceMin.value = state.minPrice = min;
    priceMax.value = state.maxPrice = max;
    state.page = 1;

    updatePriceUI();
    render();
}

priceMin.addEventListener('input', onPriceChange);
priceMax.addEventListener('input', onPriceChange);

/* ----- Rating checkboxes ----- */

$('#ratingList').addEventListener('change', () => {
    state.ratings = [...$$('#ratingList input:checked')].map((box) => Number(box.value));
    state.page = 1;
    render();
});

/* ----- Popular tags ----- */

function renderTags() {
    $('#tagList').innerHTML = TAGS.map((tag) => `
        <button class="tag-chip ${state.tags.includes(tag.slug) ? 'active' : ''}" data-tag="${tag.slug}">
            ${tag.name}
        </button>
    `).join('');
}

$('#tagList').addEventListener('click', (event) => {
    const chip = event.target.closest('.tag-chip');
    if (!chip) return;

    const tag = chip.dataset.tag;

    if (state.tags.includes(tag)) {
        state.tags = state.tags.filter((item) => item !== tag);
    } else {
        state.tags.push(tag);
    }

    state.page = 1;
    renderTags();
    render();
});

/* ----- Discount banner: show only products on sale ----- */

$('#discountBtn').addEventListener('click', (event) => {
    event.preventDefault();

    state.category = 'all';
    state.onSale = true;
    state.page = 1;

    render();
    closeFilterPanel();
    scrollToShop();
    showToast('Showing products on sale');
});

/* ----- Sale products list ----- */

function renderSaleList() {
    const saleItems = PRODUCTS.filter((item) => item.oldPrice && !item.outOfStock).slice(0, 3);

    $('#saleList').innerHTML = saleItems.map((item) => `
        <div class="sale-item" data-id="${item.id}">
            <img src="${PRODUCT_PATH + item.image}" alt="">
            <div>
                <h6>${item.name}</h6>
                <div class="price">$${item.price.toFixed(2)} <s>$${item.oldPrice.toFixed(2)}</s></div>
                <div class="stars">${starsHTML(item.rating)}</div>
            </div>
        </div>
    `).join('');
}

$('#saleList').addEventListener('click', (event) => {
    const row = event.target.closest('.sale-item');
    if (row) openQuickView(row.dataset.id);
});


/* =====================================================
   6. TOP ROW (Filter button, sort, clear filters)
   ===================================================== */

const sidebar = $('#sidebar');
const filterOverlay = $('#filterOverlay');

function openFilterPanel() {
    sidebar.classList.add('open');
    filterOverlay.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeFilterPanel() {
    sidebar.classList.remove('open');
    filterOverlay.classList.remove('show');
    document.body.style.overflow = '';
}

// Filter button: phone/tablet = slide-in panel, desktop = hide / show sidebar
$('#filterBtn').addEventListener('click', () => {
    if (window.innerWidth <= 991) {
        openFilterPanel();
    } else {
        $('#shopLayout').classList.toggle('no-sidebar');
    }
});

$('#sidebarClose').addEventListener('click', closeFilterPanel);
filterOverlay.addEventListener('click', closeFilterPanel);

// Sort dropdown
$('#sortSelect').addEventListener('change', (event) => {
    state.sort = event.target.value;
    state.page = 1;
    render();
});

// Clear filters (keeps the selected category)
$('#clearBtn').addEventListener('click', () => {
    state.search = '';
    state.minPrice = 0;
    state.maxPrice = PRICE_MAX;
    state.ratings = [];
    state.tags = [];
    state.onSale = false;
    state.page = 1;

    priceMin.value = 0;
    priceMax.value = PRICE_MAX;
    $$('#ratingList input').forEach((box) => { box.checked = false; });

    updatePriceUI();
    renderTags();
    render();
});


/* =====================================================
   7. QUICK VIEW POPUP (eye button)
   ===================================================== */

const quickModal = $('#quickModal');
let quickId = null;
let quickQty = 1;

function openQuickView(id) {
    const item = findProduct(id);
    if (!item) return;

    quickId = item.id;
    quickQty = 1;

    $('#quickImg').src = PRODUCT_PATH + item.image;
    $('#quickImg').alt = item.name;
    $('#quickName').textContent = item.name;
    $('#quickStars').innerHTML = starsHTML(item.rating) + '  ' + item.rating.toFixed(1);
    $('#quickCat').textContent = 'Category: ' + categoryName(item.category);
    $('#quickLink').href = productUrl(item.id);
    $('#qtyValue').textContent = 1;

    $('#quickPrice').innerHTML = `$${item.price.toFixed(2)} ` +
        (item.oldPrice ? `<s>$${item.oldPrice.toFixed(2)}</s>` : '');

    // Stock label + button state
    $('#quickStock').textContent = item.outOfStock ? 'Out of Stock' : 'In Stock';
    $('#quickStock').classList.toggle('out', item.outOfStock);
    $('#quickAdd').textContent = item.outOfStock ? 'Out of Stock' : 'Add to Cart';

    openModal(quickModal);
}

function closeQuickView() {
    closeModal(quickModal);
}

$('#qtyMinus').addEventListener('click', () => {
    quickQty = Math.max(1, quickQty - 1);
    $('#qtyValue').textContent = quickQty;
});

$('#qtyPlus').addEventListener('click', () => {
    quickQty = Math.min(20, quickQty + 1);
    $('#qtyValue').textContent = quickQty;
});

$('#quickAdd').addEventListener('click', () => {
    addToCart(quickId, quickQty);

    if (!findProduct(quickId).outOfStock) closeQuickView();
});

$('#quickClose').addEventListener('click', closeQuickView);

quickModal.addEventListener('click', (event) => {
    if (event.target === quickModal) closeQuickView();
});

// Esc closes the popups of this page
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        closeQuickView();
        closeFilterPanel();
    }
});

// If the screen becomes wide again, close the filter panel
window.addEventListener('resize', () => {
    if (window.innerWidth > 991) closeFilterPanel();
});


/* =====================================================
   8. START
   ===================================================== */

readURL();
renderTags();
renderSaleList();
updatePriceUI();
render();
