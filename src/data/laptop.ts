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

  /** URL to the laptop's product image */
  imageUrl: string;

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
export const conditionFilters = ["All", "Brand New", "Grade A", "Fairly Used"] as const;

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
    imageUrl:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=640&q=80",
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
    imageUrl:
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=640&q=80",
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
    imageUrl:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=640&q=80",
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
    imageUrl:
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=640&q=80",
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
    imageUrl:
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=640&q=80",
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
    imageUrl:
      "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=640&q=80",
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
