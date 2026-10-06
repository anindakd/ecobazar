/* =====================================================
   ICONS – one clean line-icon set (24px grid, 1.8 stroke)
   - the sprite is added to the page once
   - HTML uses:  <svg class="ic"><use href="#i-search"/></svg>
   - JS uses:    icon('search')
   Icons take the text colour (currentColor) and the font size,
   so they follow the dark mode and every size automatically.
   ===================================================== */

const ICON_PATHS = {
    /* ----- interface ----- */
    'search': '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.6-3.6"/>',
    'cart': '<circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2.5 3.5h2.6l2.3 11.7a1.6 1.6 0 0 0 1.6 1.3h8.6a1.6 1.6 0 0 0 1.6-1.2L20.8 8H5.7"/>',
    'bag': '<path d="M5 8h14l-1 12H6L5 8Z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/>',
    'heart': '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
    'eye': '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
    'x': '<path d="M18 6 6 18M6 6l12 12"/>',
    'menu': '<path d="M4 6h16M4 12h16M4 18h10"/>',
    'chevron-up': '<path d="m6 15 6-6 6 6"/>',
    'chevron-right': '<path d="m9 6 6 6-6 6"/>',
    'chevron-left': '<path d="m15 6-6 6 6 6"/>',
    'chevron-down': '<path d="m6 9 6 6 6-6"/>',
    'arrow-right': '<path d="M5 12h14M13 6l6 6-6 6"/>',
    'arrow-left': '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    'arrow-up': '<path d="M12 19V5M6 11l6-6 6 6"/>',
    'check': '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    'play': '<path d="M7 4.5v15l12-7.5-12-7.5Z" fill="currentColor"/>',
    'quote': '<path fill="currentColor" stroke="none" d="M4 17v-5.5C4 8 6 6 9 5.5l.5 1.6C8 7.6 7.4 8.6 7.3 10H10v7H4Zm10 0v-5.5c0-3.5 2-5.5 5-6l.5 1.6c-1.5.5-2.1 1.5-2.2 2.9H20v7h-6Z"/>',
    'star': '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3Z"/>',
    'sliders': '<path d="M4 6h9M19 6h1M4 12h3M13 12h7M4 18h10M20 18h0"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="17" cy="18" r="2"/>',
    'sun': '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2.5 12h2M19.5 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    'moon': '<path d="M20.5 14.5A8.5 8.5 0 1 1 9.5 3.5a7 7 0 0 0 11 11Z"/>',

    /* ----- info ----- */
    'map-pin': '<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    'phone': '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z"/>',
    'home': '<path d="m3 10.5 9-7.5 9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1v-9.5Z"/>',
    'leaf': '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>',
    'flame': '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5Z"/>',
    'truck': '<path d="M2 6h11v10H2zM13 9h4.5L21 12.5V16h-8"/><circle cx="7" cy="17.5" r="2"/><circle cx="17" cy="17.5" r="2"/>',
    'headset': '<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="3" y="14" width="4" height="6" rx="1.5"/><rect x="17" y="14" width="4" height="6" rx="1.5"/><path d="M20 20v.5a2 2 0 0 1-2 2h-4"/>',
    'package': '<path d="m12 3 8.5 4.5v9L12 21l-8.5-4.5v-9L12 3Z"/><path d="m3.5 7.5 8.5 4.5 8.5-4.5M12 12v9"/>',
    'tag': '<path d="M12.6 2.6A2 2 0 0 0 11.2 2H4a2 2 0 0 0-2 2v7.2a2 2 0 0 0 .6 1.4l8.7 8.7a2.4 2.4 0 0 0 3.4 0l6.6-6.6a2.4 2.4 0 0 0 0-3.4Z"/><circle cx="7.5" cy="7.5" r="1" fill="currentColor"/>',

    /* ----- categories ----- */
    'cat-fruit': '<path d="M12 7c-1.5-1.3-3.5-1.5-5-.5C4.6 8 4 11 5 14c1 3 3 6 5 6 1 0 1.3-.5 2-.5s1 .5 2 .5c2 0 4-3 5-6 1-3 .4-6-2-7.5-1.5-1-3.5-.8-5 .5Z"/><path d="M12 7c0-2 1-3.5 3-4"/>',
    'cat-vegetables': '<path d="M3.5 20.5s6-1.5 9.5-5a4.2 4.2 0 0 0-6-6c-3.5 3.5-3.5 11-3.5 11Z"/><path d="m9 14-1.5-1.5M12 16.5 10.5 15M14 10l3-3M17 7c0-2 1.2-3.5 3-4M17 7c2 0 3.5-1.2 4-3"/>',
    'cat-meat-fish': '<path d="M6 7c2-3 7-3.5 11-1.5s5 7 2.5 10.5-8 4.5-12.5 3S2.5 11 6 7Z"/><circle cx="13" cy="12" r="2.5"/>',
    'cat-cooking': '<path d="M4 11h16v6a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-6Z"/><path d="M2 11h2M20 11h2M8 8c0-1.5 1-1.5 1-3M12 8c0-1.5 1-1.5 1-3M16 8c0-1.5 1-1.5 1-3"/>',
    'cat-snacks': '<path d="M6 11h12l-1.5 10h-9L6 11Z"/><path d="M10 11l.4 10M14 11l-.4 10"/><path d="M6.5 11a2.6 2.6 0 0 1 .3-5.1 3 3 0 0 1 5.2-1.7 3 3 0 0 1 5.2 1.7 2.6 2.6 0 0 1 .3 5.1"/>',
    'cat-beverages': '<path d="M6 8h12l-1.3 12.2a1 1 0 0 1-1 .8H8.3a1 1 0 0 1-1-.8L6 8Z"/><path d="M5 8h14M13 8l1-5h3M7.5 13h9"/>',
    'cat-beauty-health': '<rect x="7" y="10" width="10" height="11" rx="2.5"/><path d="M10 10V7h4v3M12 7V4h4M7 15h10"/>',
    'cat-bread-bakery': '<path d="M4 11a4 4 0 0 1 3-6.5h10a4 4 0 0 1 3 6.5v8a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 19v-8Z"/><path d="M9 11v4M15 11v4"/>',
    'cat-baking-needs': '<circle cx="12" cy="12" r="9"/><circle cx="9" cy="9" r="1" fill="currentColor"/><circle cx="15" cy="10" r="1" fill="currentColor"/><circle cx="10" cy="15" r="1" fill="currentColor"/><circle cx="15.5" cy="15.5" r="1" fill="currentColor"/>',
    'cat-diabetic-food': '<path d="M6 5h12v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5Z"/><path d="M6 5c0-1 2.7-2 6-2s6 1 6 2M6 9h12M6 16h12"/>',
    'cat-dish-detergents': '<circle cx="9" cy="14" r="5"/><circle cx="17" cy="8" r="3"/><circle cx="18" cy="17.5" r="1.8"/><path d="M7 12.5a2.5 2.5 0 0 1 2-1.3"/>',
    'cat-oil': '<path d="M10 3h4v3.5c0 1 2 2 2 4V20a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-9.5c0-2 2-3 2-4V3Z"/><path d="M8 13h8M8 17h8"/>'
};

/* The sprite (added once, hidden) */
(function addSprite() {
    const symbols = Object.keys(ICON_PATHS).map((name) =>
        `<symbol id="i-${name}" viewBox="0 0 24 24">${ICON_PATHS[name]}</symbol>`
    ).join('');

    document.body.insertAdjacentHTML('afterbegin',
        `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>${symbols}</defs></svg>`);
})();

/* icon('search')  ->  <svg class="ic"><use href="#i-search"/></svg> */
function icon(name, extraClass) {
    return `<svg class="ic ${extraClass || ''}" aria-hidden="true"><use href="#i-${name}"/></svg>`;
}
