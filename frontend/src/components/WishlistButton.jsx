import React from 'react';
import { Heart } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { Button } from './ui/Button';
import { cn } from '../lib/utils';

export const WishlistButton = ({ property, className }) => {
    const { isInWishlist, toggleWishlist } = useWishlist();
    const isWishlisted = isInWishlist(property.id);

    const handleClick = (e) => {
        e.preventDefault(); // Prevent bubbling if used inside a clickable card
        e.stopPropagation();
        toggleWishlist(property);
    };

    return (
        <Button
            variant="ghost"
            size="icon"
            className={cn(
                "rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all shadow-sm",
                isWishlisted ? "text-red-500 hover:text-red-600" : "text-slate-400 hover:text-red-500",
                className
            )}
            onClick={handleClick}
        >
            <Heart
                className={cn("h-5 w-5", isWishlisted && "fill-current")}
            />
        </Button>
    );
};
