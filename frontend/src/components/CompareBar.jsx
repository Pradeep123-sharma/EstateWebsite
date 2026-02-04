import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useComparison } from '@/context/ComparisonContext';
import { Button } from './ui/Button';
import { X, ArrowRight } from 'lucide-react';
import CompareModal from './CompareModal';

const CompareBar = () => {
    const { compareList, removeFromCompare, clearCompare } = useComparison();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Only show if there are items
    if (compareList.length === 0) return null;

    return (
        <>
            <AnimatePresence>
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-6 left-0 right-0 z-40 px-4"
                >
                    <div className="container mx-auto max-w-4xl bg-slate-900 text-white rounded-2xl shadow-2xl p-4 flex items-center justify-between gap-4 border border-slate-700/50 backdrop-blur-xl bg-slate-900/95">
                        <div className="flex items-center gap-4 overflow-x-auto pb-1 md:pb-0 hide-scrollbar">
                            <span className="font-semibold whitespace-nowrap hidden sm:block">Compare ({compareList.length}/3):</span>

                            <div className="flex gap-2">
                                {compareList.map((property) => (
                                    <div key={property.id} className="relative group shrink-0">
                                        <img
                                            src={property.images[0]}
                                            alt={property.title}
                                            className="w-12 h-12 rounded-lg object-cover border border-slate-600"
                                        />
                                        <button
                                            onClick={() => removeFromCompare(property.id)}
                                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearCompare}
                                className="text-slate-400 hover:text-white hover:bg-slate-800"
                            >
                                Clear
                            </Button>
                            <Button
                                onClick={() => setIsModalOpen(true)}
                                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-900/20"
                            >
                                Compare Now <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            <CompareModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    );
};

export default CompareBar;
