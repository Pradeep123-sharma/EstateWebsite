import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

const ImageModal = ({ isOpen, onClose, images, currentIndex, onNext, onPrev }) => {
    const [scale, setScale] = useState(1);

    // Reset zoom when image changes or modal closes
    useEffect(() => {
        setScale(1);
    }, [currentIndex, isOpen]);

    const handleZoomIn = useCallback((e) => {
        if (e) e.stopPropagation();
        setScale((prev) => Math.min(prev + 0.25, 4));
    }, []);

    const handleZoomOut = useCallback((e) => {
        if (e) e.stopPropagation();
        setScale((prev) => Math.max(prev - 0.25, 1));
    }, []);

    const handleResetZoom = useCallback((e) => {
        if (e) e.stopPropagation();
        setScale(1);
    }, []);

    // Handle mouse wheel zoom
    const handleWheel = (e) => {
        if (e.deltaY < 0) {
            handleZoomIn();
        } else {
            handleZoomOut();
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 md:p-10 select-none overflow-hidden"
                    onClick={onClose}
                    onWheel={handleWheel}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="relative w-full h-full flex items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Top Controls Overlay */}
                        <div className="absolute top-4 right-4 z-[110] flex items-center gap-3">
                            <div className="flex items-center gap-1 bg-black/40 backdrop-blur-xl rounded-2xl px-3 py-2 border border-white/10 shadow-2xl">
                                <button
                                    onClick={handleZoomOut}
                                    disabled={scale <= 1}
                                    className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                                    title="Zoom Out (Scroll Down)"
                                >
                                    <ZoomOut size={18} />
                                </button>
                                <span className="text-white/80 text-xs font-bold min-w-[3.5rem] text-center tracking-tighter">
                                    {Math.round(scale * 100)}%
                                </span>
                                <button
                                    onClick={handleZoomIn}
                                    disabled={scale >= 4}
                                    className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                                    title="Zoom In (Scroll Up)"
                                >
                                    <ZoomIn size={18} />
                                </button>
                                <div className="w-px h-4 bg-white/10 mx-1" />
                                <button
                                    onClick={handleResetZoom}
                                    className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                                    title="Reset Zoom"
                                >
                                    <RotateCcw size={16} />
                                </button>
                            </div>

                            <button
                                onClick={onClose}
                                className="p-3 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all shadow-2xl"
                                title="Close"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Navigation Arrows - Using larger hit areas */}
                        {images && images.length > 1 && scale === 1 && (
                            <>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onPrev();
                                    }}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 p-4 md:p-5 text-white/50 hover:text-white bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-3xl z-[110] transition-all border border-white/5"
                                >
                                    <ChevronLeft size={32} />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onNext();
                                    }}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-4 md:p-5 text-white/50 hover:text-white bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-3xl z-[110] transition-all border border-white/5"
                                >
                                    <ChevronRight size={32} />
                                </button>
                            </>
                        )}

                        {/* Main Image Container */}
                        <div className={`w-full h-full flex items-center justify-center ${scale > 1 ? 'cursor-grab active:cursor-grabbing' : ''}`}>
                            <motion.img
                                key={currentIndex}
                                src={images[currentIndex]}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{
                                    opacity: 1,
                                    scale: scale,
                                    transition: { type: 'spring', damping: 30, stiffness: 300 }
                                }}
                                className="max-w-[95%] max-h-[95%] object-contain rounded-xl shadow-[0_0_100px_rgba(0,0,0,0.5)] origin-center"
                                alt={`Full view ${currentIndex + 1}`}
                                drag={scale > 1}
                                dragConstraints={{
                                    left: -500 * (scale - 1),
                                    right: 500 * (scale - 1),
                                    top: -500 * (scale - 1),
                                    bottom: 500 * (scale - 1)
                                }}
                                dragElastic={0.1}
                            />
                        </div>

                        {/* Counter Indicator */}
                        {images && images.length > 1 && (
                            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/10 text-white/60 text-xs font-bold tracking-widest uppercase shadow-2xl z-[110]">
                                {currentIndex + 1} <span className="mx-1 opacity-30">/</span> {images.length}
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ImageModal;
