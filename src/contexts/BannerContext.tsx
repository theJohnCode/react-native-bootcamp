import { BannerData, BannerProps } from '@/data/banner';
import { createContext, useContext, useState } from 'react';

interface BannerContextType {
    banners: BannerProps[];
}

export const BannerContext = createContext<BannerContextType | null>(null);

export function BannerProvider({ children }: { children: React.ReactNode }) {
    const [banners, setBanners] = useState<BannerProps[]>(BannerData);

    return (
        <BannerContext.Provider value={{ banners }}>
            {children}
        </BannerContext.Provider>
    );
}

// Create a hook
export function useBanner() {
    const context = useContext(BannerContext);

    if (!context) {
        throw new Error('useBanner must be used within a BannerProvider');
    }

    return context;
}