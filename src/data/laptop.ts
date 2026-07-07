/**
 * ============================================================
 * ZoweHub — Laptop Listings Data
 * ============================================================
 *
 * WEEK 2 CONCEPT: Separation of Concerns
 *
 * We moved our laptop data OUT of the screen component and into
 * its own file. This is a best practice because:
 *
 * 1. REUSABILITY — Multiple screens can import the same data
 *    (HomeScreen, ExploreScreen, FavouritesScreen, etc.)
 *
 * 2. MAINTAINABILITY — When data changes, you only edit one file
 *
 * 3. READABILITY — Screen files focus on UI, data files focus on data
 *
 * Later (Week 6), this data will come from Firebase Firestore instead
 * of being hard-coded here. But the TYPE definitions will stay!
 * ============================================================
 */

// ---------------------------------------------------------------
// TYPE DEFINITIONS
// ---------------------------------------------------------------

/**
 * The condition grade of a laptop.
 * Nigerian pre-owned market uses these standard grades:
 * - 'Brand New' → Brand new, unopened
 * - 'Grade A'    → Excellent condition, minimal wear
 */
export type Condition = "Brand New" | "Grade A";

/**
 * The brands we currently support on ZoweHub.
 * This is a TypeScript union type — the value MUST be one of these strings.
 */
export type Brand =
  | "Apple"
  | "HP"
  | "Dell"
  | "Lenovo"
  | "Asus"
  | "Acer"
  | "Razer"
  | "MSI"
  | "Samsung"
  | "LG"
  | "Other";

/**
 * WEEK 2 CONCEPT: TypeScript Interfaces / Types
 *
 * A LaptopListing describes everything we know about one laptop.
 * Using a type makes our code safer — TypeScript will warn us
 * if we forget a required field or use the wrong data type.
 *
 * Think of it like a form template: every listing MUST have
 * all these fields filled in.
 */
export type LaptopListing = {
  /** Unique identifier for this listing */
  id: string;

  /** Display title, e.g. "MacBook Pro 13 M1" */
  title: string;

  /** Laptop manufacturer brand */
  brand: Brand;

  /** Price in Nigerian Naira (₦) */
  price: number;

  /** Condition grade of the laptop */
  condition: Condition;

  /** URLs to the laptop's product images */
  images: string[];

  /** Technical specifications */
  specs: {
    processor: string;
    ram: string;
    storage: string;
    /** Battery health percentage (0-100) */
    batteryHealth: number;
  };

  /** Seller/vendor information */
  vendor: {
    name: string;
    location: string;
    rating: number;
  };
};

// ---------------------------------------------------------------
// COLOUR MAPPINGS FOR CONDITION BADGES
// ---------------------------------------------------------------

/**
 * Each condition grade gets its own colour scheme for the badge.
 * This makes it easy for buyers to quickly spot the condition
 * at a glance — green for best, yellow for fair.
 *
 * WEEK 1 CONCEPT: Using objects to map data to styles
 * instead of writing lots of if/else statements.
 */
export const conditionColors: Record<
  Condition,
  { background: string; text: string }
> = {
  "Brand New": { background: "#DDF7EA", text: "#146B43" },
  "Grade A": { background: "#E7F3D7", text: "#426B10" },
};

// ---------------------------------------------------------------
// FILTER OPTIONS
// ---------------------------------------------------------------

/** All available brand filter options (including 'All' to show everything) */
export const brandFilters = [
  "All",
  "Apple",
  "HP",
  "Dell",
  "Lenovo",
  "Asus",
  "Acer",
  "Razer",
  "MSI",
  "Samsung",
  "LG",
  "Other",
] as const;

/** All available condition filter options */
export const conditionFilters = [
  "All",
  "Brand New",
  "Grade A",
  "Fairly Used",
] as const;

/** Price range filter options with min/max bounds in Naira */
export const priceRangeFilters = [
  { label: "All Prices", min: 0, max: Infinity },

  { label: "Under ₦300K", min: 0, max: 300000 },

  { label: "₦300K - ₦500K", min: 300000, max: 500000 },

  { label: "₦500K - ₦800K", min: 500000, max: 800000 },

  { label: "Above ₦800K", min: 800000, max: Infinity },
] as const;

// ---------------------------------------------------------------
// SAMPLE LAPTOP LISTINGS
// ---------------------------------------------------------------

/**
 * Our initial set of laptop listings.
 *
 * In a real app, this data would come from an API or database.
 * For now, we hard-code it so we can focus on building the UI.
 *
 * WEEK 5: We'll persist this with AsyncStorage
 * WEEK 6: We'll replace this with Firebase Firestore
 *
 * All prices are in Nigerian Naira (₦).
 * Vendors are located across Ibadan, Nigeria.
 */
export const initialListings: LaptopListing[] = [
  {
    id: "macbook-pro-13-m1",
    title: 'MacBook Pro 13"',
    brand: "Apple",
    price: 690000,
    condition: "Grade A",
    images: [
      "https://product.hstatic.net/200000722513/product/macbook_pro_13_m1_16gb_256gb_-_grey_1bfbcd2ab5ba43038a675b542b41a073_835f2ce4c7eb4a02a61c1a0db6e4a5d4_compact.png",
      "https://product.hstatic.net/200000722513/product/3-2020-touch-bar-m1-16gb-256gb-grey-1_085f26b8c95a4796a6bffa02f89e2496_2ba621aaac734be58a9916c7ed6de30b_compact.jpg",
      "https://product.hstatic.net/200000722513/product/3-2020-touch-bar-m1-16gb-256gb-grey-2_4397fa9fca594b1ca40e21f9430b6bd7_7d2fa8a09f8f48bcbff75c0864c7dada_compact.jpg",
      "https://product.hstatic.net/200000722513/product/3-2020-touch-bar-m1-16gb-256gb-grey-3_b50451c3608b41c989c8b8bc6348511f_1ddaf49183174e28b1e85893245e48a9_compact.jpg",
    ],
    specs: {
      processor: "Apple M1",
      ram: "8GB",
      storage: "256GB SSD",
      batteryHealth: 91,
    },
    vendor: {
      name: "John Code",
      location: "Awka, Anambra",
      rating: 4.8,
    },
  },
  {
    id: "hp-elitebook-840-g7",
    title: "HP EliteBook 840",
    brand: "HP",
    price: 385000,
    condition: "Brand New",
    images: [
      "https://lankafix.com/wp-content/uploads/2025/08/SL-PC-CLEARANCE-HP-ELITEBOOK-840-G7-1-600x600.jpg",
      "https://imagedelivery.net/pjXEwQ5mgCM0WtJa4WheRQ/0e30f0c6-be91-498d-5210-47cda1da2a00/ProductViewThumb",
      "https://imagedelivery.net/pjXEwQ5mgCM0WtJa4WheRQ/8d548464-e167-43a3-5a54-e0be118e0f00/ProductViewThumb",
      "https://imagedelivery.net/pjXEwQ5mgCM0WtJa4WheRQ/e5be2428-bc36-4747-b17a-5f4089125900/ProductViewThumb",
    ],
    specs: {
      processor: "Intel Core i5",
      ram: "16GB",
      storage: "512GB SSD",
      batteryHealth: 78,
    },
    vendor: {
      name: "John Code",
      location: "UI Gate, Ibadan",
      rating: 4.6,
    },
  },
  {
    id: "dell-latitude-7420",
    title: "Dell Latitude 7420",
    brand: "Dell",
    price: 430000,
    condition: "Grade A",
    images: [
      "https://www.tradeinn.com/f/13826/138265795/dell-latitude-7420-14-i7-1185g7-16gb-512gb-ssd-laptop.webp",
      "https://www.tradeinn.com/f/13826/138265795_2/dell-latitude-7420-14-i7-1185g7-16gb-512gb-ssd-laptop.webp",
      "https://www.tradeinn.com/f/13826/138265795_3/dell-latitude-7420-14-i7-1185g7-16gb-512gb-ssd-laptop.webp",
    ],
    specs: {
      processor: "Intel Core i7",
      ram: "16GB",
      storage: "512GB SSD",
      batteryHealth: 96,
    },
    vendor: {
      name: "John Code",
      location: "Ring Road, Ibadan",
      rating: 4.9,
    },
  },
  {
    id: "lenovo-thinkpad-t480",
    title: "Lenovo ThinkPad T480",
    brand: "Lenovo",
    price: 260000,
    condition: "Brand New",
    images: [
      "https://www.digitalstore.co.ke/cdn/shop/products/1_31b86caf-8606-4a5f-9e7f-725ffeb22b97_800x.jpg?v=1566998588",
      "https://www.digitalstore.co.ke/cdn/shop/products/2_bc8d7343-0e9d-4a1d-9984-3438bc9a9d51_800x.jpg?v=1566998588",
      "https://www.digitalstore.co.ke/cdn/shop/products/3_c0d341f3-c77f-4b6f-8e72-8ceb46b3ad6b_800x.jpg?v=1566998588",
      "https://www.digitalstore.co.ke/cdn/shop/products/4_6d1ccbb1-ff4d-465e-aef2-74d546c2fc02_800x.jpg?v=1566998588",
    ],
    specs: {
      processor: "Intel Core i5",
      ram: "8GB",
      storage: "256GB SSD",
      batteryHealth: 83,
    },
    vendor: {
      name: "John Code",
      location: "Bodija, Ibadan",
      rating: 4.4,
    },
  },
  {
    id: "macbook-pro-13-m1-b",
    title: 'MacBook Pro 13"',
    brand: "Apple",
    price: 620000,
    condition: "Grade A",
    images: [
      "https://product.hstatic.net/200000722513/product/macbook_pro_13_m1_16gb_256gb_-_grey_1bfbcd2ab5ba43038a675b542b41a073_835f2ce4c7eb4a02a61c1a0db6e4a5d4_compact.png",
      "https://product.hstatic.net/200000722513/product/3-2020-touch-bar-m1-16gb-256gb-grey-1_085f26b8c95a4796a6bffa02f89e2496_2ba621aaac734be58a9916c7ed6de30b_compact.jpg",
      "https://product.hstatic.net/200000722513/product/3-2020-touch-bar-m1-16gb-256gb-grey-2_4397fa9fca594b1ca40e21f9430b6bd7_7d2fa8a09f8f48bcbff75c0864c7dada_compact.jpg",
      "https://product.hstatic.net/200000722513/product/3-2020-touch-bar-m1-16gb-256gb-grey-3_b50451c3608b41c989c8b8bc6348511f_1ddaf49183174e28b1e85893245e48a9_compact.jpg",
    ],
    specs: {
      processor: "Apple M1",
      ram: "8GB",
      storage: "256GB SSD",
      batteryHealth: 85,
    },
    vendor: {
      name: "John Code",
      location: "UNIZIK, Awka",
      rating: 4.5,
    },
  },
  {
    id: "hp-elitebook-840-g5",
    title: "HP EliteBook 840",
    brand: "HP",
    price: 335000,
    condition: "Brand New",
    images: [
      "https://static3.webx.pk/files/78721/Images/840-11-78721-2198538-140924112403133.jpg",
      "https://www.notebookcheck.net/typo3temp/_processed_/7/b/csm_HPEliteBook840G5__1__16c13e5405.jpg",
      "https://www.notebookcheck.net/typo3temp/_processed_/c/8/csm_2000930763_03_972ed12077.jpg",
    ],
    specs: {
      processor: "Intel Core i5",
      ram: "8GB",
      storage: "256GB SSD",
      batteryHealth: 88,
    },
    vendor: {
      name: "John Code",
      location: "UNIZIK, Awka",
      rating: 4.7,
    },
  },
  {
    id: "hp-elitebook-840-g5",
    title: "HP EliteBook 840",
    brand: "HP",
    price: 335000,
    condition: "Brand New",
    images: [
      "https://static3.webx.pk/files/78721/Images/840-11-78721-2198538-140924112403133.jpg",
      "https://www.notebookcheck.net/typo3temp/_processed_/7/b/csm_HPEliteBook840G5__1__16c13e5405.jpg",
      "https://www.notebookcheck.net/typo3temp/_processed_/c/8/csm_2000930763_03_972ed12077.jpg",
    ],
    specs: {
      processor: "Intel Core i5",
      ram: "8GB",
      storage: "256GB SSD",
      batteryHealth: 88,
    },
    vendor: {
      name: "John Code",
      location: "UNIZIK, Awka",
      rating: 4.7,
    },
  },
];
