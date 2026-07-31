import {
  createContext,
  useContext,
  ReactNode,
  useReducer,
  useEffect,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LaptopListing } from "@/data/laptop";
import { supabase } from "@/utils/supabase";

interface ListingsState {
  laptops: LaptopListing[];
}

interface ListingsContextType {
  laptops: LaptopListing[];
  getLaptopById: (id: string) => LaptopListing | undefined;
  dispatch: React.Dispatch<ListingsAction>;
}

type ListingsAction =
  | { type: "ADD_LISTING"; payload: LaptopListing }
  | { type: "DELETE_LISTING"; payload: string }
  | { type: "LOAD_LISTINGS"; payload: LaptopListing[] }; // payload is the array of listings

const ListingsContext = createContext<ListingsContextType | null>(null);

// Reducer function to manage listings
const listingsReducer = (
  state: ListingsState,
  action: ListingsAction,
): ListingsState => {
  switch (action.type) {
    case "ADD_LISTING": {
      const updatedListings = [...state.laptops, action.payload];
      // Save to AsyncStorage
      AsyncStorage.setItem("laptop_listings", JSON.stringify(updatedListings));
      return { laptops: updatedListings };
    }

    case "DELETE_LISTING": {
      const updatedListings = state.laptops.filter(
        (laptop) => laptop.id !== action.payload,
      );
      // Save to AsyncStorage
      AsyncStorage.setItem("laptop_listings", JSON.stringify(updatedListings));
      return { laptops: updatedListings };
    }

    case "LOAD_LISTINGS": {
      // Fetch from Supabase
      return { laptops: action.payload };
    }

    default:
      return state;
  }
};

export function ListingsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(listingsReducer, {
    laptops: [],
  });

  // Load saved listings from AsyncStorage on mount
  useEffect(() => {
    const loadListings = async () => {
      try {
        // Load from Supabase
        const { data, error } = await supabase.from("laptops").select("*");
        if (error) {
          console.error("Error loading listings:", error);
          return;
        }

        dispatch({ type: "LOAD_LISTINGS", payload: data || [] });
      } catch (error) {
        console.error("Error loading listings:", error);
      }
    };
    loadListings();
  }, []);

  const getLaptopById = (id: string) => {
    return state.laptops.find((laptop) => laptop.id === id);
  };

  return (
    <ListingsContext.Provider
      value={{ laptops: state.laptops, getLaptopById, dispatch }}
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
