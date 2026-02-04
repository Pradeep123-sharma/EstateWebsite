import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Button } from './ui/Button';

const testimonials = [
    {
        id: 1,
        name: "Sarah Johnson",
        role: "Homeowner",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
        text: "LRD Groups helped us find our dream villa in Jaipur. The process was smooth, professional, and transparent. Highly recommended!",
        rating: 5
    },
    {
        id: 2,
        name: "Michael Chen",
        role: "Property Investor",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
        text: "I've been working with Deepak for years. His market insights are invaluable. The best real estate agency in Rajasthan.",
        rating: 5
    },
    {
        id: 3,
        name: "Priya Patel",
        role: "Interior Design Client",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
        text: "Khushi transformed our old apartment into a modern masterpiece. Her attention to detail and creativity are unmatched.",
        rating: 5
    }
];

const Testimonials = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            handleNext();
        }, 5000);
        return () => clearInterval(timer);
    }, [currentIndex]);

    const handleNext = () => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    };

    const handlePrev = () => {
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    const variants = {
        enter: (direction) => ({
            x: direction > 0 ? 100 : -100,
            opacity: 0,
            scale: 0.95
        }),
        center: {
            x: 0,
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.4,
                ease: "easeOut"
            }
        },
        exit: (direction) => ({
            x: direction > 0 ? -100 : 100,
            opacity: 0,
            scale: 0.95,
            transition: {
                duration: 0.4,
                ease: "easeIn"
            }
        })
    };

    return (
        <section className="py-20 bg-slate-900 text-white overflow-hidden relative">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl translate-y-1/3 translate-x-1/3"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Clients Say</h2>
                    <div className="w-20 h-1 bg-blue-600 mx-auto rounded-full"></div>
                </div>

                <div className="max-w-4xl mx-auto relative min-h-[400px] flex items-center justify-center">
                    <AnimatePresence initial={false} custom={direction} mode='wait'>
                        <motion.div
                            key={currentIndex}
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            className="absolute w-full px-4"
                        >
                            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8 md:p-12 text-center md:text-left flex flex-col md:flex-row items-center gap-8 md:gap-12">
                                <div className="shrink-0 relative">
                                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/20 shadow-xl">
                                        <img
                                            src={testimonials[currentIndex].image}
                                            alt={testimonials[currentIndex].name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="absolute -bottom-3 -right-3 bg-blue-600 rounded-full p-2 shadow-lg">
                                        <Quote className="w-6 h-6 text-white transform scale-x-[-1]" />
                                    </div>
                                </div>

                                <div className="flex-grow">
                                    <div className="flex justify-center md:justify-start gap-1 mb-4 text-yellow-400">
                                        {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                                            <Star key={i} className="w-5 h-5 fill-current" />
                                        ))}
                                    </div>

                                    <blockquote className="text-xl md:text-2xl font-light italic text-slate-100 mb-6 leading-relaxed">
                                        "{testimonials[currentIndex].text}"
                                    </blockquote>

                                    <div>
                                        <h3 className="text-lg font-bold text-white">{testimonials[currentIndex].name}</h3>
                                        <p className="text-blue-400 font-medium">{testimonials[currentIndex].role}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    <div className="absolute -bottom-12 md:bottom-auto md:top-1/2 md:-translate-y-1/2 w-full flex justify-center md:justify-between items-center pointer-events-none gap-4">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handlePrev}
                            className="pointer-events-auto rounded-full w-12 h-12 border-white/20 hover:bg-white hover:text-slate-900 bg-white/5 backdrop-blur-sm text-white transition-all hover:scale-110"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handleNext}
                            className="pointer-events-auto rounded-full w-12 h-12 border-white/20 hover:bg-white hover:text-slate-900 bg-white/5 backdrop-blur-sm text-white transition-all hover:scale-110"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </Button>
                    </div>
                </div>

                {/* Indicators */}
                <div className="flex justify-center gap-2 mt-20 md:mt-12">
                    {testimonials.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                setDirection(index > currentIndex ? 1 : -1);
                                setCurrentIndex(index);
                            }}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex ? "bg-blue-600 w-8" : "bg-white/20 hover:bg-white/40"
                                }`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
