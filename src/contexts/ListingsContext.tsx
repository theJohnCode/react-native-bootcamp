import { createContext, useState, useContext, ReactNode } from 'react';
import { initialListings, LaptopListing } from '@/data/laptop';


interface ListingsContextType {
  laptops: LaptopListing[];
  getLaptopById: (id: string) => LaptopListing | undefined;
}

const ListingsContext = createContext<ListingsContextType | null>(null);

export function ListingsProvider({ children }: { children: ReactNode }) {
  const [laptops] = useState<LaptopListing[]>(initialListings);

  const getLaptopById = (id: string) => {
    return laptops.find((laptop) => laptop.id === id);
  };

  return (
    <ListingsContext.Provider value={{ laptops, getLaptopById }}>
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
