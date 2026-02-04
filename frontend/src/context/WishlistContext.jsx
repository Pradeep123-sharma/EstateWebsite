import React, { createContext, useState, useEffect, useContext } from 'react';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';
import { wishlistService } from '@/api/services';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    // Fetch wishlist when user logs in
    useEffect(() => {
        if (user) {
            fetchWishlist();
        } else {
            setWishlist([]);
        }
    }, [user]);

    const fetchWishlist = async () => {
        if (!user) return;

        try {
            setLoading(true);
            const response = await wishlistService.getUserWishlist();
            if (response.success) {
                setWishlist(response.data || []);
            }
        } catch (error) {
            console.error("Failed to fetch wishlist:", error);
            setWishlist([]);
        } finally {
            setLoading(false);
        }
    };

    const addToWishlist = async (propertyId) => {
        if (!user) {
            toast.error("Please login to use wishlist");
            return false;
        }

        try {
            const response = await wishlistService.addToWishlist(propertyId);
            if (response.success) {
                await fetchWishlist(); // Refresh wishlist
                toast.success("Added to Wishlist");
                return true;
            }
        } catch (error) {
            const message = error.response?.data?.message || "Failed to add to wishlist";
            toast.error(message);
            return false;
        }
    };

    const removeFromWishlist = async (propertyId) => {
        if (!user) return false;

        try {
            const response = await wishlistService.removeFromWishlist(propertyId);
            if (response.success) {
                await fetchWishlist(); // Refresh wishlist
                toast.info("Removed from Wishlist");
                return true;
            }
        } catch (error) {
            const message = error.response?.data?.message || "Failed to remove from wishlist";
            toast.error(message);
            return false;
        }
    };

    const isInWishlist = (propertyId) => {
        return wishlist.some((item) =>
            item.property?._id === propertyId ||
            item.property?.id === propertyId ||
            item._id === propertyId ||
            item.id === propertyId
        );
    };

    const toggleWishlist = async (property) => {
        if (!user) {
            toast.error("Please login to use wishlist");
            return;
        }

        const propertyId = property._id || property.id;
        if (isInWishlist(propertyId)) {
            await removeFromWishlist(propertyId);
        } else {
            await addToWishlist(propertyId);
        }
    };

    return (
        <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist, toggleWishlist, loading }}>
            {children}
        </WishlistContext.Provider>
    );
};
