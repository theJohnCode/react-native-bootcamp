import { LaptopImage, LaptopListing } from "@/data/laptop";
import { supabase } from "@/utils/supabase";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";

interface ListingsState {
  laptops: LaptopListing[];
  loading: boolean;
  error: string | null;
}

interface ListingsContextType {
  laptops: LaptopListing[];
  loading: boolean;
  error: string | null;
  getLaptopById: (id: string) => LaptopListing | undefined;
  refreshListings: () => Promise<void>;
  dispatch: React.Dispatch<ListingsAction>;
}

type ListingsAction =
  | { type: "ADD_LISTING"; payload: LaptopListing }
  | { type: "DELETE_LISTING"; payload: string }
  | { type: "LOAD_LISTINGS"; payload: LaptopListing[] }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null };

type SupabaseLaptopListing = Omit<LaptopListing, "images"> & {
  laptop_images?: LaptopImage[] | null;
};

const ListingsContext = createContext<ListingsContextType | null>(null);

// Reducer function to manage listings
const listingsReducer = (
  state: ListingsState,
  action: ListingsAction,
): ListingsState => {
  switch (action.type) {
    case "ADD_LISTING": {
      return { ...state, laptops: [action.payload, ...state.laptops] };
    }

    case "DELETE_LISTING": {
      const updatedListings = state.laptops.filter(
        (laptop) => laptop.id !== action.payload,
      );
      return { ...state, laptops: updatedListings };
    }

    case "LOAD_LISTINGS": {
      return { ...state, laptops: action.payload, error: null };
    }

    case "SET_LOADING": {
      return { ...state, loading: action.payload };
    }

    case "SET_ERROR": {
      return { ...state, error: action.payload };
    }

    default:
      return state;
  }
};

export function ListingsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(listingsReducer, {
    laptops: [],
    loading: true,
    error: null,
  });

  const refreshListings = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: true });

    try {
      const { data, error } = await supabase
        .from("laptops")
        .select("*, laptop_images(*)")
        .order("created_at", { ascending: false });

        // console.log('Supabase data:', data.laptop_images);

      if (error) {
        throw error;
      }

      const listings = ((data || []) as SupabaseLaptopListing[]).map(
        ({ laptop_images, ...laptop }) => ({
          ...laptop,
          images: [...(laptop_images || [])].sort(
            (a, b) => a.sort_order - b.sort_order,
          ),
        }),
      );

      dispatch({ type: "LOAD_LISTINGS", payload: listings });
    } catch (error: any) {
      const message = error.message || "Error loading listings";
      console.error("Error loading listings:", error);
      dispatch({ type: "SET_ERROR", payload: message });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  useEffect(() => {
    refreshListings();
  }, [refreshListings]);

  useEffect(() => {
    const channel = supabase
      .channel("listings-context")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "laptops" },
        () => refreshListings(),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "laptop_images" },
        () => refreshListings(),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refreshListings]);

  const getLaptopById = (id: string) => {
    return state.laptops.find((laptop) => laptop.id === id);
  };

  return (
    <ListingsContext.Provider
      value={{
        laptops: state.laptops,
        loading: state.loading,
        error: state.error,
        getLaptopById,
        refreshListings,
        dispatch,
      }}
    >
      {children}
    </ListingsContext.Provider>
  );
}

export function useListings() {
  const context = useContext(ListingsContext);
  if (!context) {
    throw new Error("useListings must be used within a ListingsProvider");
  }
  return context;
}
