import { createContext, useContext, ReactNode, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initialListings, LaptopListing } from '@/data/laptop';

interface ListingsState {
  laptops: LaptopListing[];
}

interface ListingsContextType {
  laptops: LaptopListing[];
  getLaptopById: (id: string) => LaptopListing | undefined;
  dispatch: React.Dispatch<ListingsAction>;
}

type ListingsAction =
  | { type: 'ADD_LISTING'; payload: LaptopListing }
  | { type: 'DELETE_LISTING'; payload: string }
  | { type: 'LOAD_LISTINGS'; payload: LaptopListing[] }; // payload is the array of listings

const ListingsContext = createContext<ListingsContextType | null>(null);

// Reducer function to manage listings
const listingsReducer = (state: ListingsState, action: ListingsAction): ListingsState => {
  switch (action.type) {
    case 'ADD_LISTING': {
      const updatedListings = [...state.laptops, action.payload];
      // Save to AsyncStorage
      AsyncStorage.setItem('laptop_listings', JSON.stringify(updatedListings));
      return { laptops: updatedListings };
    }

    case 'DELETE_LISTING': {
      const updatedListings = state.laptops.filter(laptop => laptop.id !== action.payload);
      // Save to AsyncStorage
      AsyncStorage.setItem('laptop_listings', JSON.stringify(updatedListings));
      return { laptops: updatedListings };
    }

    case 'LOAD_LISTINGS': {
      return { laptops: action.payload };
    }

    default:
      return state;
  }
};

export function ListingsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(listingsReducer, { laptops: initialListings || [] });

  // Load saved listings from AsyncStorage on mount
  useEffect(() => {
    const loadListings = async () => {
      try {
        const savedListings = await AsyncStorage.getItem('laptop_listings');
        if (savedListings && savedListings.length > 0) {
          const parsed = JSON.parse(savedListings);
          // If it's an array, use it; otherwise keep current state
          if (Array.isArray(parsed) && parsed.length > 0) {
            // Merge with initial listings, avoiding duplicates
            const allListings = [...initialListings];
            parsed.forEach((savedLaptop: LaptopListing) => {
              if (!allListings.find(l => l.id === savedLaptop.id)) {
                allListings.push(savedLaptop);
              }
            });
            dispatch({ type: 'LOAD_LISTINGS', payload: allListings });
          }
        }
      } catch (error) {
        console.error('Error loading listings:', error);
      }
    };
    loadListings();
  }, []);

  const getLaptopById = (id: string) => {
    return state.laptops.find((laptop) => laptop.id === id);
  };

  return (
    <ListingsContext.Provider value={{ laptops: state.laptops, getLaptopById, dispatch }}>
      {children}
    </ListingsContext.Provider>
  );
}

export function useListings() {
  const context = useContext(ListingsContext);
  if (!context) {
    throw new Error('useListings must be used within a ListingsProvider');
  }
  return context;
}
