import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PropertyCard } from '@/components/PropertyCard';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Heart, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

const WishlistPage = () => {
    const { wishlist } = useWishlist();
    const { user } = useAuth();

    if (!user) {
        return (
            <div className="min-h-screen bg-slate-50 pt-32 pb-12 flex flex-col items-center text-center px-4">
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                    <Heart className="w-10 h-10 text-blue-300" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Login to view Wishlist</h2>
                <p className="text-slate-500 max-w-md mb-8">
                    Please login to your account to view your saved properties.
                </p>
                <Link to="/auth">
                    <Button size="lg" className="rounded-full px-8">
                        Login Now
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pt-20 pb-12">
            <div className="container mx-auto px-4">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-red-100 rounded-full">
                        <Heart className="w-6 h-6 text-red-600 fill-current" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900">My Wishlist</h1>
                    <span className="bg-slate-200 text-slate-700 px-3 py-1 rounded-full text-sm font-medium">
                        {wishlist.length}
                    </span>
                </div>

                {wishlist.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-slate-100 shadow-sm"
                    >
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                            <Heart className="w-10 h-10 text-slate-300" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Your wishlist is empty</h2>
                        <p className="text-slate-500 max-w-md mb-8">
                            Start exploring our properties and save your favorites to review them later.
                        </p>
                        <Link to="/properties">
                            <Button size="lg" className="rounded-full">
                                <Home className="mr-2 w-4 h-4" />
                                Browse Properties
                            </Button>
                        </Link>
                    </motion.div>
                ) : (
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        <AnimatePresence mode="popLayout">
                            {wishlist.map((item) => (
                                <motion.div
                                    key={item._id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                                >
                                    <PropertyCard property={item.property} />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WishlistPage;
