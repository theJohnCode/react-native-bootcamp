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

export const CONDITIONS = ["Brand New", "Grade A", "Fairly Used"];
/**
 * The condition grade of a laptop.
 * Nigerian pre-owned market uses these standard grades:
 * - 'Brand New' → Brand new, unopened
 * - 'Grade A'    → Excellent condition, minimal wear
 */
export type Condition = (typeof CONDITIONS)[number];

/**
 * The brands we currently support on ZoweHub.
 * This is a TypeScript union type — the value MUST be one of these strings.
 */
export const BRANDS = [
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

export type Brand = (typeof BRANDS)[number];

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

  /** User ID of the seller */
  user_id: string;

  /** Display title, e.g. "MacBook Pro 13 M1" */
  title: string;

  /** Laptop manufacturer brand */
  brand: Brand;

  /** Price in Nigerian Naira (₦) */
  price: number;

  /** Condition grade of the laptop */
  condition: Condition;

  /** Processor specification */
  processor: string;

  /** RAM specification */
  ram: string;

  /** Storage specification */
  storage: string;

  /** Battery health percentage (0-100) */
  battery_health: number;

  /** Detailed description */
  description: string | null;

  /** Listing status */
  status: string;

  /** Whether this laptop is featured */
  featured: boolean;

  /** Timestamps */
  created_at: string;
  updated_at: string;

  /** Associated images */
  images: LaptopImage[];
};

export type LaptopImage = {
  id: string;
  laptop_id: string;
  image_url: string;
  is_primary: boolean;
  sort_order: number;
  created_at: string;
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
  "Fairly Used": { background: "#FFF4E5", text: "#A65C00" },
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
// Sample data removed - migrating to Supabase database
