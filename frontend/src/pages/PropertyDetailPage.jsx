import React from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { MortgageCalculator } from "@/components/MortgageCalculator";
import {
    BedDouble,
    Bath,
    Square,
    MapPin,
    ArrowLeft,
    Phone,
    Mail,
    Calendar,
    CheckCircle2,
    Loader2,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import api from '@/api/axios';
import ImageModal from "@/components/ui/ImageModal";



const PropertyDetailPage = () => {
    const { id } = useParams();
    const [property, setProperty] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    const nextImage = React.useCallback(() => {
        if (property?.photos?.length > 0) {
            setCurrentImageIndex((prev) => (prev + 1) % property.photos.length);
        }
    }, [property?.photos?.length]);

    const prevImage = () => {
        if (property?.photos?.length > 0) {
            setCurrentImageIndex((prev) => (prev - 1 + property.photos.length) % property.photos.length);
        }
    };

    React.useEffect(() => {
        if (isModalOpen) return; // Stop automatic navigation when modal is open

        const interval = setInterval(() => {
            nextImage();
        }, 5000); // Shift every 5 seconds
        return () => clearInterval(interval);
    }, [nextImage, isModalOpen]);

    React.useEffect(() => {
        const fetchProperty = async () => {
            try {
                const response = await api.get(`/properties/${id}`);
                setProperty(response.data.data);
            } catch (err) {
                console.error("Failed to fetch property details", err);
                setError("Failed to load property details.");
            } finally {
                setLoading(false);
            }
        };

        fetchProperty();
        window.scrollTo(0, 0);
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center">
                    <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
                    <p className="text-slate-500 font-medium">Loading property details...</p>
                </div>
            </div>
        );
    }

    if (error || !property) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center max-w-md px-6">
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Property Not Found</h2>
                    <p className="text-slate-500 mb-6">The property you are looking for does not exist or has been removed.</p>
                    <Link to="/properties">
                        <Button>Back to Properties</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(price);
    };

    return (
        <div className="min-h-screen bg-white pb-20">
            {/* Header / Nav */}
            <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100">
                <div className="container mx-auto px-4 h-16 flex items-center">
                    <Link to="/properties">
                        <Button variant="ghost" className="gap-2 text-slate-600 hover:text-slate-900">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Properties
                        </Button>
                    </Link>
                </div>
            </header>

            <main className="container mx-auto px-4 pt-24">
                {/* Hero Section Carousel */}
                <div className="relative h-[60vh] min-h-[400px] mb-12 rounded-3xl overflow-hidden group shadow-2xl">
                    <AnimatePresence mode="wait">
                        <motion.img
                            key={currentImageIndex}
                            src={property.photos[currentImageIndex] || "https://via.placeholder.com/800x600?text=No+Image"}
                            alt={`${property.title} - ${currentImageIndex + 1}`}
                            initial={{ opacity: 0, scale: 1.1 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.8 }}
                            className="w-full h-full object-cover cursor-zoom-in"
                            onClick={() => setIsModalOpen(true)}
                        />
                    </AnimatePresence>

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                    {/* Navigation Arrows */}
                    {property.photos?.length > 1 && (
                        <>
                            <button
                                onClick={(e) => { e.preventDefault(); prevImage(); }}
                                className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white/40 active:scale-95 z-10"
                            >
                                <ChevronLeft className="h-6 w-6" />
                            </button>
                            <button
                                onClick={(e) => { e.preventDefault(); nextImage(); }}
                                className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white/40 active:scale-95 z-10"
                            >
                                <ChevronRight className="h-6 w-6" />
                            </button>
                        </>
                    )}

                    {/* Image Counter Indicators */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                        {property.photos?.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentImageIndex(idx)}
                                className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentImageIndex ? 'w-8 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'}`}
                            />
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Title & Location */}
                        <div>
                            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                                <div>
                                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">{property.title}</h1>
                                    <div className="flex items-center text-slate-500">
                                        <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                                        <span className="text-lg">{property.location}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-3xl font-bold text-slate-900">{formatPrice(property.price)}</p>
                                    <p className="text-slate-500">{property.type === 'rent' ? '/month' : ''}</p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <Badge className={property.status === 'rented' ? "bg-blue-600" : "bg-slate-900"}>
                                    {property.status === 'rented' ? 'For Rent' : 'For Sale'}
                                </Badge>
                                <Badge variant="secondary" className="bg-slate-100 text-slate-700">
                                    {property.propertyType}
                                </Badge>
                            </div>
                        </div>

                        {/* Specs Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-white rounded-xl shadow-sm">
                                    <BedDouble className="h-6 w-6 text-slate-700" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">Bedrooms</p>
                                    <p className="font-semibold text-slate-900">{property.bedrooms}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-white rounded-xl shadow-sm">
                                    <Bath className="h-6 w-6 text-slate-700" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">Bathrooms</p>
                                    <p className="font-semibold text-slate-900">{property.bathrooms}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-white rounded-xl shadow-sm">
                                    <Square className="h-6 w-6 text-slate-700" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">Area</p>
                                    <p className="font-semibold text-slate-900">{property.area} sqft</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-white rounded-xl shadow-sm">
                                    <Calendar className="h-6 w-6 text-slate-700" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500">Listed</p>
                                    <p className="font-semibold text-slate-900">{new Date(property.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 mb-4">About the Property</h2>
                            <p className="text-slate-600 leading-relaxed text-lg">
                                {property.description}
                            </p>
                        </div>

                        {/* Features */}
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 mb-4">Features & Amenities</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {property.features && property.features.map((feature, i) => (
                                    <div key={i} className="flex items-center gap-3 text-slate-600">
                                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                                        <span>{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Mortgage Calculator */}
                        <div className="mt-12">
                            <MortgageCalculator propertyPrice={property.price} />
                        </div>
                    </div>

                    {/* Agent Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 bg-white border border-slate-100 p-6 rounded-3xl shadow-lg shadow-slate-200/50">
                            <h3 className="text-lg font-bold text-slate-900 mb-6">Contact Agent</h3>

                            <div className="flex items-center gap-4 mb-6">
                                <img
                                    src={property.agent?.avatar || "https://via.placeholder.com/150"}
                                    alt={property.agent?.fullName || "Agent"}
                                    className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
                                />
                                <div>
                                    <p className="font-bold text-slate-900">{property.agent?.fullName || "Agent"}</p>
                                    <p className="text-sm text-slate-500">Licensed Broker</p>
                                </div>
                            </div>

                            <div className="space-y-3 mb-6">
                                {property.agent?.mobileNumber && (
                                    <Button variant="outline" className="w-full justify-start h-12 text-base">
                                        <Phone className="h-4 w-4 mr-3" />
                                        {property.agent.mobileNumber}
                                    </Button>
                                )}
                                {property.mobileNumber && (
                                    <Button variant="outline" className="w-full justify-start h-12 text-base">
                                        <Phone className="h-4 w-4 mr-3" />
                                        {property.mobileNumber}
                                    </Button>
                                )}
                                <Button variant="outline" className="w-full justify-start h-12 text-base">
                                    <Mail className="h-4 w-4 mr-3" />
                                    {property.agent?.email || "Email Agent"}
                                </Button>
                            </div>

                            <form className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Your Name"
                                    className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                                />
                                <input
                                    type="email"
                                    placeholder="Your Email"
                                    className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                                />
                                <textarea
                                    placeholder="I'm interested in this property..."
                                    className="w-full h-32 p-4 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all resize-none"
                                ></textarea>
                                <Button className="w-full h-12 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 shadow-lg shadow-slate-900/20">
                                    Send Message
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>

            <ImageModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                images={property.photos}
                currentIndex={currentImageIndex}
                onNext={nextImage}
                onPrev={prevImage}
            />
        </div>
    );
};

export default PropertyDetailPage;
