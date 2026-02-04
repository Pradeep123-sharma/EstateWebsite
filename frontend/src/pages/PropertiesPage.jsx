import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PropertyCard } from "@/components/PropertyCard";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
    Search,
    SlidersHorizontal,
    ChevronDown,
    Building,
    Wand2,
    FilterX,
    Home,
} from "lucide-react";
import { propertyService } from "@/api/services";
import { toast } from "sonner";

const PropertiesPage = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [priceRange, setPriceRange] = useState([0, 50000000]);
    const [bedrooms, setBedrooms] = useState("any");
    const [bathrooms, setBathrooms] = useState("any");
    const [propertyType, setPropertyType] = useState("any");
    const [sortOrder, setSortOrder] = useState("default");
    const [isFiltering, setIsFiltering] = useState(false);

    // Fetch properties from backend
    useEffect(() => {
        const fetchProperties = async () => {
            try {
                setLoading(true);
                const response = await propertyService.getAllProperties();
                if (response.success) {
                    setProperties(response.data || []);
                }
            } catch (error) {
                console.error("Failed to fetch properties:", error);
                toast.error("Failed to load properties");
                setProperties([]);
            } finally {
                setLoading(false);
            }
        };
        fetchProperties();
    }, []);

    useEffect(() => {
        const filtering =
            searchTerm.trim() !== "" ||
            priceRange[1] !== 50000000 ||
            bedrooms !== "any" ||
            bathrooms !== "any" ||
            propertyType !== "any";
        setIsFiltering(filtering);
    }, [searchTerm, priceRange, bedrooms, bathrooms, propertyType]);

    const filteredProperties = useMemo(() => {
        let filtered = properties.filter((property) => {
            const searchMatch =
                searchTerm.trim() === "" ||
                property.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                property.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                property.address?.toLowerCase().includes(searchTerm.toLowerCase());

            const priceMatch =
                property.price >= priceRange[0] && property.price <= priceRange[1];

            const bedroomsMatch =
                bedrooms === "any" || property.bedrooms >= parseInt(bedrooms);

            const bathroomsMatch =
                bathrooms === "any" || property.bathrooms >= parseInt(bathrooms);

            const propertyTypeMatch =
                propertyType === "any" || property.propertyType === propertyType;

            return (
                searchMatch &&
                priceMatch &&
                bedroomsMatch &&
                bathroomsMatch &&
                propertyTypeMatch
            );
        });

        switch (sortOrder) {
            case "price_asc":
                filtered.sort((a, b) => a.price - b.price);
                break;
            case "price_desc":
                filtered.sort((a, b) => b.price - a.price);
                break;
            default:
                break;
        }

        return filtered;
    }, [properties, searchTerm, priceRange, bedrooms, bathrooms, propertyType, sortOrder]);

    const resetFilters = () => {
        setSearchTerm("");
        setPriceRange([0, 50000000]);
        setBedrooms("any");
        setBathrooms("any");
        setPropertyType("any");
        setSortOrder("default");
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
            },
        },
    };

    return (
        <div className="min-h-screen bg-white text-slate-900">
            <main className="container mx-auto px-4 py-12 md:py-20">
                <div className="mb-16 space-y-4">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900"
                    >
                        Properties
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-slate-500 max-w-xl"
                    >
                        Explore our curated list of premium properties available for rent or sale.
                    </motion.p>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="flex justify-center items-center py-24">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
                    </div>
                ) : (
                    <>
                        {/* Filter Controls */}
                        <motion.div
                            layout
                            className="mb-12 sticky top-4 z-30"
                        >
                            <div className="max-w-3xl mx-auto px-4">
                                <div className="bg-white/90 backdrop-blur-xl border border-slate-200/60 rounded-full shadow-lg shadow-slate-200/40 p-1.5 flex items-center gap-2 transition-all hover:shadow-xl hover:border-slate-300/50 hover:scale-[1.01]">
                                    <div className="flex-grow flex items-center pl-4 sm:pl-6 h-12">
                                        <Search className="h-5 w-5 text-slate-400 shrink-0" />
                                        <Input
                                            type="text"
                                            placeholder="Search by location..."
                                            className="border-none shadow-none focus-visible:ring-0 bg-transparent h-full text-base px-4 placeholder:text-slate-400 w-full text-slate-700"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>

                                    <Button
                                        onClick={() => setShowFilters(!showFilters)}
                                        className={`rounded-full px-6 h-11 text-sm font-semibold transition-all shadow-md hover:shadow-lg ${showFilters
                                            ? 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                                            : 'bg-slate-900 text-white hover:bg-slate-800 hover:scale-105'
                                            }`}
                                    >
                                        <SlidersHorizontal className="h-4 w-4 mr-2" />
                                        Filters
                                    </Button>
                                </div>

                                <AnimatePresence>
                                    {showFilters && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0, scale: 0.95 }}
                                            animate={{ height: "auto", opacity: 1, scale: 1 }}
                                            exit={{ height: 0, opacity: 0, scale: 0.95 }}
                                            className="overflow-hidden mt-4"
                                        >
                                            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xl mx-4">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                                    {/* Price Range */}
                                                    <div className="space-y-3">
                                                        <label className="text-sm font-semibold text-slate-900">Price Range</label>
                                                        <div className="px-1">
                                                            <div className="flex justify-between text-sm text-slate-500 mb-2">
                                                                <span>₹0</span>
                                                                <span className="font-medium text-blue-600">₹{priceRange[1].toLocaleString()}</span>
                                                            </div>
                                                            <Input
                                                                type="range"
                                                                min="0"
                                                                max="50000000"
                                                                step="100000"
                                                                value={priceRange[1]}
                                                                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                                                                className="w-full accent-blue-600 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer p-0 border-none shadow-none"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Bedrooms */}
                                                    <div className="space-y-3">
                                                        <label className="text-sm font-semibold text-slate-900">Bedrooms</label>
                                                        <div className="flex rounded-lg overflow-hidden border border-slate-200 p-1 bg-slate-50">
                                                            {["any", "1", "2", "3", "4+"].map((val) => (
                                                                <button
                                                                    key={`bed-${val}`}
                                                                    onClick={() => setBedrooms(val)}
                                                                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${bedrooms === val ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                                                >
                                                                    {val === "any" ? "Any" : val}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Property Type */}
                                                    <div className="space-y-3">
                                                        <label className="text-sm font-semibold text-slate-900">Type</label>
                                                        <div className="relative">
                                                            <select
                                                                value={propertyType}
                                                                onChange={(e) => setPropertyType(e.target.value)}
                                                                className="w-full h-10 pl-3 pr-10 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
                                                            >
                                                                <option value="any">Any Type</option>
                                                                <option value="Apartment">Apartment</option>
                                                                <option value="House">House</option>
                                                                <option value="Villa">Villa</option>
                                                                <option value="Studio">Studio</option>
                                                            </select>
                                                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                                                        </div>
                                                    </div>

                                                    {/* Reset - Aligned to bottom */}
                                                    <div className="flex items-end">
                                                        <Button
                                                            onClick={resetFilters}
                                                            variant="ghost"
                                                            className="w-full text-slate-500 hover:text-red-500 hover:bg-red-50 justify-start px-0"
                                                        >
                                                            <FilterX className="h-4 w-4 mr-2" />
                                                            Reset Filters
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>

                        {/* Results Header */}
                        <div className="flex flex-col sm:flex-row justify-between items-end mb-8 gap-4 border-b border-slate-100 pb-4">
                            <div>
                                <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                                    Results
                                </span>
                                <h2 className="text-2xl font-bold text-slate-900 mt-1">
                                    {filteredProperties.length} Properties Found
                                </h2>
                            </div>

                            <div className="relative min-w-[200px]">
                                <select
                                    value={sortOrder}
                                    onChange={(e) => setSortOrder(e.target.value)}
                                    className="w-full pl-3 pr-10 py-2.5 text-sm font-medium bg-transparent border-none text-slate-600 focus:ring-0 cursor-pointer text-right"
                                >
                                    <option value="default">Recommended</option>
                                    <option value="price_asc">Price: Low to High</option>
                                    <option value="price_desc">Price: High to Low</option>
                                </select>
                                <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                            </div>
                        </div>

                        {/* Property Grid */}
                        <AnimatePresence mode="popLayout">
                            {filteredProperties.length > 0 ? (
                                <motion.div
                                    layout
                                    className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                                >
                                    {filteredProperties.map((property) => (
                                        <PropertyCard key={property._id || property.id} property={property} />
                                    ))}
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="py-24 text-center"
                                >
                                    <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-slate-50 mb-4">
                                        <Building className="h-8 w-8 text-slate-300" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900">No properties found</h3>
                                    <p className="text-slate-500 mt-2">Try adjusting your filters to see more results.</p>
                                    <Button onClick={resetFilters} variant="link" className="mt-4 text-blue-600">
                                        Clear all filters
                                    </Button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </>
                )}
            </main>
        </div>
    );
};

export default PropertiesPage;
