import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Minus } from 'lucide-react';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { useComparison } from '@/context/ComparisonContext';

const CompareModal = ({ isOpen, onClose }) => {
    const { compareList, removeFromCompare } = useComparison();

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white rounded-3xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                        <h2 className="text-2xl font-bold text-slate-900">Property Comparison</h2>
                        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-slate-200">
                            <X className="w-6 h-6 text-slate-500" />
                        </Button>
                    </div>

                    {/* Content */}
                    <div className="overflow-auto flex-1 p-6">
                        {compareList.length === 0 ? (
                            <div className="text-center py-20 text-slate-500">
                                No properties to compare.
                            </div>
                        ) : (
                            <div className="grid grid-cols-[auto_repeat(1,1fr)] sm:grid-cols-[auto_repeat(2,1fr)] md:grid-cols-[auto_repeat(3,1fr)] gap-4 md:gap-8">
                                {/* Labels Column */}
                                <div className="space-y-4 pt-48 md:pt-64 font-medium text-slate-500 text-sm hidden sm:block">
                                    <div className="h-10 flex items-center">Price</div>
                                    <div className="h-10 flex items-center">Type</div>
                                    <div className="h-10 flex items-center">Location</div>
                                    <div className="h-10 flex items-center">Bedrooms</div>
                                    <div className="h-10 flex items-center">Bathrooms</div>
                                    <div className="h-10 flex items-center">Area</div>
                                    <div className="h-10 flex items-center">Action</div>
                                </div>

                                {/* Property Columns */}
                                {compareList.map((property) => (
                                    <div key={property.id} className="min-w-[200px] space-y-4">
                                        {/* Image and Title */}
                                        <div className="h-48 md:h-64 mb-4">
                                            <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-3">
                                                <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover" />
                                            </div>
                                            <h3 className="font-bold text-slate-900 line-clamp-2 h-12">{property.title}</h3>
                                        </div>

                                        {/* Details */}
                                        <div className="grid grid-cols-[100px_1fr] sm:block gap-x-4">
                                            <div className="sm:hidden text-slate-500 text-sm flex items-center h-10">Price</div>
                                            <div className="h-10 flex items-center font-bold text-lg text-blue-600">
                                                ${property.price.toLocaleString()}
                                            </div>

                                            <div className="sm:hidden text-slate-500 text-sm flex items-center h-10">Type</div>
                                            <div className="h-10 flex items-center">
                                                <Badge variant="secondary">{property.propertyType}</Badge>
                                            </div>

                                            <div className="sm:hidden text-slate-500 text-sm flex items-center h-10">Location</div>
                                            <div className="h-10 flex items-center text-sm text-slate-600 line-clamp-1">
                                                {property.location}
                                            </div>

                                            <div className="sm:hidden text-slate-500 text-sm flex items-center h-10">Bedrooms</div>
                                            <div className="h-10 flex items-center">{property.specs.beds} Beds</div>

                                            <div className="sm:hidden text-slate-500 text-sm flex items-center h-10">Bathrooms</div>
                                            <div className="h-10 flex items-center">{property.specs.baths} Baths</div>

                                            <div className="sm:hidden text-slate-500 text-sm flex items-center h-10">Area</div>
                                            <div className="h-10 flex items-center">{property.specs.area} sqft</div>

                                            <div className="sm:hidden text-slate-500 text-sm flex items-center h-10">Action</div>
                                            <div className="h-10 flex items-center">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => removeFromCompare(property.id)}
                                                    className="text-red-500 hover:text-red-600 hover:bg-red-50 border-red-100"
                                                >
                                                    Remove
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default CompareModal;
