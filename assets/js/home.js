/* =====================================================
   ECOBAZAR – HOME PAGE JAVASCRIPT (index.html only)
   Needs data.js and script.js loaded before this file.

   Sections:
   1.  Home page data
   2.  Render sections
   3.  Hero slider
   4.  Product tabs (filter)
   5.  Video popup
   6.  Countdown timer
   7.  Newsletter ad popup
   8.  Keyboard
   ===================================================== */


/* =====================================================
   1. HOME PAGE DATA
   ===================================================== */

// Which products appear in which section (by product id)
const INTRO_IDS = [14, 16, 13, 5, 9, 7, 4, 22];
const FEATURED_IDS = [14, 17, 2, 9, 4];

const TESTIMONIALS = [
    {
        name: 'Jenny Wilson',
        image: 'avatar-1.jpg',
        text: 'Aenean et nisl eget eros consectetur vestibulum vel id erat. Aliquam feugiat massa dui. Sed sagittis diam sit amet ante sodales semper.'
    },
    {
        name: 'Guy Hawkins',
        image: 'avatar-2.jpg',
        text: 'Proin sed neque eu tellus malesuada ultrices eget a justo. Nullam a nibh faucibus, semper risus ac, ultricies est. Maecenas eget purus in enim.'
    },
    {
        name: 'Kathryn Murphy',
        image: 'avatar-3.jpg',
        text: 'Nam sed odio diam. Mauris sagittis sapien sed convallis cursus. Proin mattis ultrices urna ac eleifend. Cras vel nisl nec lectus sagittis.'
    }
];

const NEWS = [
    { image: 'news-1.jpg', day: '23', month: 'Jan' },
    { image: 'news-2.jpg', day: '23', month: 'Jan' },
    { image: 'news-3.jpg', day: '23', month: 'Jan' }
];

const INSTAGRAM = [
    'insta-1.jpg', 'insta-2.jpg', 'insta-3.jpg', 'insta-4.jpg',
    'insta-5.jpg', 'insta-6.jpg', 'news-1.jpg', 'news-3.jpg'
];


/* =====================================================
   2. RENDER SECTIONS
   ===================================================== */

function productsById(ids) {
    return ids.map((id) => findProduct(id));
}

// "Introducing Our Products" grid (with tab filter)
function renderProducts(filter = 'all') {
    let list = productsById(INTRO_IDS);

    if (filter !== 'all') {
        list = list.filter((item) => item.category === filter);
    }

    $('#productGrid').innerHTML = list.map((item) => productCard(item)).join('');
}

function renderFeatured() {
    $('#featuredGrid').innerHTML = productsById(FEATURED_IDS).map((item) => productCard(item)).join('');
}

function renderTestimonials() {
    $('#testimonialGrid').innerHTML = TESTIMONIALS.map((item) => `
        <div class="testimonial">
            <div class="bubble">
                <span class="quote-mark">${icon('quote')}</span>
                ${item.text}
            </div>
            <img src="${IMG_PATH + item.image}" alt="${item.name}">
            <h5>${item.name}</h5>
            <small>Customer</small>
        </div>
    `).join('');
}

function renderNews() {
    $('#newsGrid').innerHTML = NEWS.map((item) => `
        <article class="news-card">
            <div class="news-img">
                <img src="${IMG_PATH + item.image}" alt="News">
                <div class="news-date">${item.day}<small>${item.month}</small></div>
            </div>
            <div class="news-body">
                <h4>Curabitur porttitor orci eget neque accumsan venenatis.</h4>
                <p>Nulla libero lorem, euismod vehicula vel sed, sodales dictum ex. Etiam nisl odio, malesuada et pulvinar at.</p>
                <a href="#">Read More ${icon('arrow-right')}</a>
            </div>
        </article>
    `).join('');
}

function renderInstagram() {
    $('#instaGrid').innerHTML = INSTAGRAM.map((file) => `
        <img src="${IMG_PATH + file}" alt="Instagram post">
    `).join('');
}

renderProducts();
renderFeatured();
renderTestimonials();
renderNews();
renderInstagram();


/* =====================================================
   3. HERO SLIDER
   (arrows, dots, auto-play, pause on hover, swipe)
   ===================================================== */

const slider = $('#slider');
const slidesBox = $('#slides');
const dotsBox = $('#dots');
const totalSlides = slidesBox.children.length;

let currentSlide = 0;
let autoPlay;

// Create one dot for each slide
dotsBox.innerHTML = Array.from({ length: totalSlides }, (_, index) => `<i data-index="${index}"></i>`).join('');

function goToSlide(index) {
    // Loop around at both ends
    currentSlide = (index + totalSlides) % totalSlides;

    slidesBox.style.transform = `translateX(-${currentSlide * 100}%)`;

    [...dotsBox.children].forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
    });
}

function startAutoPlay() {
    autoPlay = setInterval(() => goToSlide(currentSlide + 1), 4500);
}

function stopAutoPlay() {
    clearInterval(autoPlay);
}

$('#prevBtn').addEventListener('click', () => goToSlide(currentSlide - 1));
$('#nextBtn').addEventListener('click', () => goToSlide(currentSlide + 1));

dotsBox.addEventListener('click', (event) => {
    if (event.target.dataset.index) {
        goToSlide(Number(event.target.dataset.index));
    }
});

// Pause while the mouse is over the slider
slider.addEventListener('mouseenter', stopAutoPlay);
slider.addEventListener('mouseleave', startAutoPlay);

// Swipe on touch screens
let touchStartX = 0;

slider.addEventListener('touchstart', (event) => {
    touchStartX = event.touches[0].clientX;
});

slider.addEventListener('touchend', (event) => {
    const distance = event.changedTouches[0].clientX - touchStartX;

    if (Math.abs(distance) > 40) {
        goToSlide(currentSlide + (distance < 0 ? 1 : -1));
    }
});

goToSlide(0);
startAutoPlay();


/* =====================================================
   4. PRODUCT TABS (All / Vegetable / Fruit / Meat & Fish)
   ===================================================== */

$('#productTabs').addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button) return;

    // Move the green "active" style to the clicked tab
    $$('#productTabs button').forEach((tab) => tab.classList.remove('active'));
    button.classList.add('active');

    renderProducts(button.dataset.filter);
});


/* =====================================================
   5. VIDEO POPUP
   (put your YouTube embed link in data-video in index.html)
   ===================================================== */

const videoModal = $('#videoModal');

$('#playBtn').addEventListener('click', (event) => {
    const link = event.currentTarget.dataset.video;

    if (!link) {
        showToast('Add a video link in data-video (index.html)');
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


/* =====================================================
   6. COUNTDOWN TIMER (Deal of the Month)
   ===================================================== */

// Ends 2 hours, 18 minutes and 46 seconds from now
const dealEnd = Date.now() + (2 * 3600 + 18 * 60 + 46) * 1000;

function twoDigits(number) {
    return String(number).padStart(2, '0');
}

function updateCountdown() {
    const seconds = Math.max(0, Math.floor((dealEnd - Date.now()) / 1000));

    const parts = [
        { value: Math.floor(seconds / 86400),          label: 'Days'  },
        { value: Math.floor((seconds % 86400) / 3600), label: 'Hours' },
        { value: Math.floor((seconds % 3600) / 60),    label: 'Mins'  },
        { value: seconds % 60,                         label: 'Secs'  }
    ];

    $('#countdown').innerHTML = parts.map((part) => `
        <div class="box">${twoDigits(part.value)}<small>${part.label}</small></div>
    `).join('<span class="colon">:</span>');
}

updateCountdown();
setInterval(updateCountdown, 1000);


/* =====================================================
   7. NEWSLETTER AD POPUP
   - Opens automatically 1 second after the site loads
   - "Do not show this window" is remembered in the browser
   ===================================================== */

const adModal = $('#adModal');

function openAd() {
    // Do not open if the visitor chose "Do not show this window"
    if (storage.get('hideNewsletterAd')) return;

    // Only add the class: this popup must NOT lock the page scroll
    // (openModal() locks it, which made the page feel "stuck")
    adModal.classList.add('open');
}

function closeAd() {
    adModal.classList.remove('open');

    // Remember the checkbox choice
    if ($('#adHide').checked) {
        storage.set('hideNewsletterAd', true);
    }
}

$('#adClose').addEventListener('click', closeAd);

// Click on the dark area outside the box closes the popup
adModal.addEventListener('click', (event) => {
    if (event.target === adModal) closeAd();
});

// Subscribe form with email check
$('#adForm').addEventListener('submit', (event) => {
    event.preventDefault();

    const email = $('#adEmail').value.trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        $('#adError').textContent = 'Please enter a valid email address.';
        return;
    }

    $('#adError').textContent = '';
    $('#adEmail').value = '';
    closeAd();
    showToast('Thanks for subscribing! Check your email for the 20% code.');
});

// Open the popup after the page has loaded
window.addEventListener('load', () => setTimeout(openAd, 1000));


/* =====================================================
   8. KEYBOARD
   ===================================================== */

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        closeVideo();
        closeAd();
    }
});
