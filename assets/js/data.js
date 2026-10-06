/* =====================================================
   ECOBAZAR – SHARED DATA (used by every page)
   Add a new product = add one line in the PRODUCTS list
   and put its image inside assets/images/products/
   ===================================================== */

const IMG_PATH = 'assets/images/';
const PRODUCT_PATH = 'assets/images/products/';


/* ---------- Categories ---------- */

const CATEGORIES = [
    { slug: 'fruit',          name: 'Fresh Fruit',      icon: 'cat-fruit' },
    { slug: 'vegetables',     name: 'Vegetables',       icon: 'cat-vegetables' },
    { slug: 'meat-fish',      name: 'Meat & Fish',      icon: 'cat-meat-fish' },
    { slug: 'cooking',        name: 'Cooking',          icon: 'cat-cooking' },
    { slug: 'snacks',         name: 'Snacks',           icon: 'cat-snacks' },
    { slug: 'beverages',      name: 'Beverages',        icon: 'cat-beverages' },
    { slug: 'beauty-health',  name: 'Beauty & Health',  icon: 'cat-beauty-health' },
    { slug: 'bread-bakery',   name: 'Bread & Bakery',   icon: 'cat-bread-bakery' },
    { slug: 'baking-needs',   name: 'Baking Needs',     icon: 'cat-baking-needs' },
    { slug: 'diabetic-food',  name: 'Diabetic Food',    icon: 'cat-diabetic-food' },
    { slug: 'dish-detergents', name: 'Dish Detergents', icon: 'cat-dish-detergents' },
    { slug: 'oil',            name: 'Oil',              icon: 'cat-oil' }
];


/* ---------- Popular tags (filter chips on the category page) ---------- */

const TAGS = [
    { slug: 'healthy',    name: 'Healthy'    },
    { slug: 'low-fat',    name: 'Low fat'    },
    { slug: 'vegetarian', name: 'Vegetarian' },
    { slug: 'kid-foods',  name: 'Kid foods'  },
    { slug: 'vitamins',   name: 'Vitamins'   },
    { slug: 'bread',      name: 'Bread'      },
    { slug: 'meat',       name: 'Meat'       },
    { slug: 'snacks',     name: 'Snacks'     },
    { slug: 'tiffin',     name: 'Tiffin'     },
    { slug: 'launch',     name: 'Launch'     },
    { slug: 'dinner',     name: 'Dinner'     },
    { slug: 'breakfast',  name: 'Breakfast'  },
    { slug: 'fruit',      name: 'Fruit'      }
];


/* ---------- Products ---------- */

// product(id, name, image, price, oldPrice, category, rating, tags, outOfStock)
function product(id, name, image, price, oldPrice, category, rating, tags, outOfStock = false) {
    return { id, name, image: image + '.jpg', price, oldPrice, category, rating, tags, outOfStock };
}

const PRODUCTS = [

    // ----- Vegetables -----
    product(1,  'Big Potatoes',      'potato',       14.99, 0,     'vegetables', 4.5, ['healthy', 'vegetarian', 'dinner']),
    product(2,  'Chinese Cabbage',   'cabbage',      14.99, 20.99, 'vegetables', 4.0, ['healthy', 'low-fat', 'vegetarian']),
    product(3,  'Sweet Corn',        'corn',         14.99, 20.99, 'vegetables', 4.0, ['healthy', 'kid-foods', 'tiffin'], true),
    product(4,  'Eggplant',          'eggplant',     14.99, 0,     'vegetables', 4.0, ['healthy', 'vegetarian', 'dinner']),
    product(5,  'Fresh Cauliflower', 'cauliflower',  14.99, 0,     'vegetables', 4.0, ['healthy', 'low-fat', 'vitamins']),
    product(6,  'Green Capsicum',    'capsicum',     14.99, 0,     'vegetables', 4.5, ['healthy', 'vitamins', 'launch']),
    product(7,  'Green Chilli',      'chili',        14.99, 0,     'vegetables', 3.5, ['vegetarian', 'launch']),
    product(8,  'Green Cucumber',    'cucumber',     14.99, 20.99, 'vegetables', 4.0, ['healthy', 'low-fat', 'vegetarian']),
    product(9,  'Green Lettuce',     'lettuce',      14.99, 0,     'vegetables', 4.0, ['healthy', 'low-fat', 'vitamins']),
    product(10, 'Ladies Finger',     'okra',         14.99, 0,     'vegetables', 4.5, ['healthy', 'vegetarian', 'tiffin']),
    product(11, 'Red Capsicum',      'red-capsicum', 14.99, 20.99, 'vegetables', 4.5, ['healthy', 'vitamins', 'dinner']),
    product(12, 'Red Chilli',        'red-chili',    14.99, 0,     'vegetables', 3.5, ['vegetarian', 'launch']),
    product(13, 'Red Tomato',        'tomato',       14.99, 0,     'vegetables', 4.0, ['healthy', 'vitamins', 'vegetarian']),

    // ----- Fresh Fruit -----
    product(14, 'Green Apple',       'apple',        14.99, 20.99, 'fruit', 4.0, ['fruit', 'healthy', 'vitamins']),
    product(15, 'Red Apple',         'red-apple',    16.99, 0,     'fruit', 4.5, ['fruit', 'healthy', 'kid-foods']),
    product(16, 'Surjapur Mango',    'mango',        14.99, 0,     'fruit', 4.0, ['fruit', 'vitamins', 'kid-foods']),
    product(17, 'Fresh Indian Malta', 'orange',      20.00, 0,     'fruit', 4.0, ['fruit', 'vitamins', 'breakfast']),
    product(18, 'Fresh Banana',      'banana',       9.99,  0,     'fruit', 4.5, ['fruit', 'kid-foods', 'breakfast']),
    product(19, 'Fresh Grapes',      'grapes',       18.99, 0,     'fruit', 4.0, ['fruit', 'healthy', 'low-fat']),
    product(20, 'Fresh Pineapple',   'pineapple',    12.99, 0,     'fruit', 3.5, ['fruit', 'vitamins']),
    product(21, 'Fresh Fruit Basket', 'fruit-basket', 34.99, 39.99, 'fruit', 5.0, ['fruit', 'healthy', 'vitamins']),

    // ----- Meat & Fish -----
    product(22, 'Fresh Meat & Fish Pack', 'meat-fish-pack', 24.99, 0,     'meat-fish', 4.0, ['meat', 'dinner']),
    product(23, 'Low-Fat Meat',      'low-fat-meat', 29.99, 34.99, 'meat-fish', 4.5, ['meat', 'low-fat', 'dinner']),
    product(24, 'Fresh Fish',        'fresh-fish',   19.99, 0,     'meat-fish', 4.0, ['meat', 'healthy', 'launch']),
    product(25, 'Fresh Beef',        'fresh-beef',   27.99, 0,     'meat-fish', 4.0, ['meat', 'dinner']),
    product(26, 'Fresh Chicken',     'fresh-chicken', 16.99, 0,    'meat-fish', 4.5, ['meat', 'launch', 'dinner']),

    // ----- Cooking -----
    product(27, 'Cooking Essentials Combo', 'cooking-combo', 39.99, 44.99, 'cooking', 4.0, ['launch', 'dinner']),
    product(28, 'Rice & Lentil Pack', 'rice-lentil', 22.99, 0,     'cooking', 4.5, ['launch', 'dinner', 'vegetarian']),
    product(29, 'Flour & Salt Pack', 'flour-salt',   13.99, 0,     'cooking', 3.5, ['bread', 'breakfast']),

    // ----- Snacks -----
    product(30, 'Snacks Combo',      'snacks-combo', 24.99, 29.99, 'snacks', 4.0, ['snacks', 'kid-foods', 'tiffin']),
    product(31, 'Chips & Snacks',    'chips-snacks', 8.99,  0,     'snacks', 3.5, ['snacks', 'kid-foods']),
    product(32, 'Noodles Pack',      'noodles-pack', 6.99,  0,     'snacks', 4.0, ['snacks', 'tiffin', 'kid-foods']),
    product(33, 'Breakfast Cereal',  'cereal',       11.99, 0,     'snacks', 4.5, ['breakfast', 'kid-foods', 'healthy']),

    // ----- Beverages -----
    product(34, 'Beverages Combo',   'beverages-combo', 28.99, 0,  'beverages', 4.0, ['kid-foods', 'breakfast']),
    product(35, 'Water & Drinks',    'water-drinks', 7.99,  0,     'beverages', 3.5, ['healthy']),
    product(36, 'Orange Juice & Cola', 'juice-cola', 12.99, 0,     'beverages', 4.0, ['kid-foods']),
    product(37, 'Milk & Coffee Pack', 'milk-coffee', 15.99, 0,     'beverages', 4.5, ['breakfast', 'kid-foods']),
    product(38, 'Cola Soft Drink',   'drink',        3.99,  0,     'beverages', 3.5, ['kid-foods']),
    product(39, 'Fresh Cow Milk',    'milk',         14.99, 0,     'beverages', 5.0, ['healthy', 'breakfast', 'kid-foods']),

    // ----- Beauty & Health -----
    product(40, 'Beauty Care Combo', 'beauty-combo', 32.99, 38.99, 'beauty-health', 4.0, ['healthy']),
    product(41, 'Shampoo & Soap',    'shampoo-soap', 14.99, 0,     'beauty-health', 4.0, ['healthy']),
    product(42, 'Body Care Set',     'body-care',    18.99, 0,     'beauty-health', 3.5, ['healthy']),

    // ----- Bread & Bakery -----
    product(43, 'Bread & Bakery Combo', 'bakery-combo', 26.99, 0,  'bread-bakery', 4.5, ['bread', 'breakfast', 'kid-foods']),
    product(44, 'Fresh Sliced Bread', 'sliced-bread', 5.99,  0,    'bread-bakery', 4.0, ['bread', 'breakfast', 'tiffin']),
    product(45, 'Honey & Biscuit Pack', 'honey-biscuit', 13.99, 0, 'bread-bakery', 4.5, ['breakfast', 'kid-foods']),
    product(46, 'Cookie Jar & Box',  'cookie-jar-box', 17.99, 21.99, 'bread-bakery', 4.0, ['snacks', 'kid-foods']),

    // ----- Baking Needs -----
    product(47, 'Baking Needs Combo', 'baking-combo', 29.99, 0,    'baking-needs', 4.0, ['bread']),
    product(48, 'Cocoa Powder',      'cocoa-powder', 9.99,  0,     'baking-needs', 4.5, ['bread', 'kid-foods']),
    product(49, 'Baking Mix Pack',   'baking-mix',   12.99, 0,     'baking-needs', 4.0, ['bread']),
    product(50, 'Cocoa & Cake Mix',  'dry-fruit-mix', 15.99, 0,    'baking-needs', 3.5, ['bread', 'kid-foods']),

    // ----- Diabetic Food -----
    product(51, 'Diabetic Food Combo', 'diabetic-combo', 31.99, 0, 'diabetic-food', 4.0, ['healthy', 'low-fat']),
    product(52, 'Diabetic Food Pack', 'diabetic-pack', 16.99, 0,   'diabetic-food', 4.0, ['healthy', 'low-fat']),
    product(53, 'Sugar-Free Pack',   'sugar-free',   14.99, 18.99, 'diabetic-food', 4.5, ['healthy', 'low-fat']),

    // ----- Dish Detergents -----
    product(54, 'Dish Wash Combo',   'detergent-combo', 19.99, 0,  'dish-detergents', 4.0, []),
    product(55, 'Dish Wash Liquid',  'dish-wash',    6.99,  0,     'dish-detergents', 4.5, []),
    product(56, 'Dish Cleaner Pack', 'dish-cleaner', 9.99,  12.99, 'dish-detergents', 3.5, []),

    // ----- Oil -----
    product(57, 'Cooking Oil Combo', 'oil-combo',    36.99, 0,     'oil', 4.0, ['launch', 'dinner']),
    product(58, 'Cooking Oil Bottle', 'cooking-oil', 12.99, 0,     'oil', 4.5, ['launch', 'dinner']),
    product(59, 'Soybean Oil',       'soybean-oil',  21.99, 24.99, 'oil', 4.0, ['launch', 'dinner'])
];


/* ---------- Search suggestions ---------- */

const TRENDING = [
    'Organic apple',
    'Fresh vegetables',
    'Mango',
    'Green chilli',
    'Tomato',
    'Meat & fish',
    'Summer sale'
];


/* ---------- Coupon codes (code -> percent off) ---------- */

const COUPONS = {
    ECO10: 10,
    FRESH20: 20
};
