import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, Loader2, Phone } from "lucide-react";
import api from '@/api/axios';
import { Button } from "@/components/ui/Button";
import ImageModal from "@/components/ui/ImageModal";

// Mock Data (in real app, fetch by ID)


const InteriorDetailPage = () => {
    const { id } = useParams();
    const [project, setProject] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    const nextImage = () => {
        if (project?.images?.length > 0) {
            setCurrentImageIndex((prev) => (prev + 1) % project.images.length);
        }
    };

    const prevImage = () => {
        if (project?.images?.length > 0) {
            setCurrentImageIndex((prev) => (prev - 1 + project.images.length) % project.images.length);
        }
    };

    useEffect(() => {
        const fetchInterior = async () => {
            try {
                const response = await api.get(`/interiors/${id}`);
                setProject(response.data.data);
            } catch (err) {
                console.error("Failed to fetch interior details", err);
                setError("Failed to load interior details.");
            } finally {
                setLoading(false);
            }
        };

        fetchInterior();
        window.scrollTo(0, 0);
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <Loader2 className="h-10 w-10 animate-spin text-slate-900" />
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="text-center">
                    <p className="text-xl text-slate-900 mb-4">Interior project not found.</p>
                    <Link to="/interiors">
                        <Button>Back to Interiors</Button>
                    </Link>
                </div>
            </div>
        );
    }

    // Fallback data for UI elements not in backend model yet
    const displayProject = {
        ...project,
        designer: project.agent?.fullName || "Agent",
        style: project.category || "Modern",
        palette: ["#D3C6BC", "#F5F5F0", "#8C8C8C", "#2D2D2D"], // Mock palette
        features: ["Premium Finishes", "Custom Design", "Professional Execution"] // Mock features
    };

    return (
        <div className="min-h-screen bg-white text-slate-900 pb-20">
            {/* Nav */}
            <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link to="/interiors">
                        <Button variant="ghost" className="gap-2 text-slate-600 hover:text-slate-900">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Inspirations
                        </Button>
                    </Link>
                    <span className="text-sm font-semibold tracking-wide uppercase text-slate-400 hidden sm:block">Interior Detail</span>
                </div>
            </header>

            {/* Hero Image */}
            <div className="h-[60vh] md:h-[80vh] w-full relative mt-16 bg-slate-100">
                <img
                    src={displayProject.images?.[0] || "https://via.placeholder.com/1200x800?text=No+Image"}
                    alt={displayProject.title}
                    className="w-full h-full object-cover cursor-zoom-in"
                    onClick={() => {
                        setCurrentImageIndex(0);
                        setIsModalOpen(true);
                    }}
                />
            </div>

            <main className="container mx-auto px-4 -mt-20 relative z-10">
                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl max-w-5xl mx-auto border border-slate-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

                        {/* Left Column: Info */}
                        <div>
                            <p className="text-slate-400 text-sm font-bold tracking-wider uppercase mb-2">Project Name</p>
                            <h1 className="text-4xl md:text-5xl font-bold mb-8 text-slate-900 leading-tight">
                                {displayProject.title}
                            </h1>

                            <div className="space-y-6 mb-8">
                                <div>
                                    <p className="text-slate-400 text-xs font-semibold uppercase mb-1">Designer</p>
                                    <p className="text-xl font-medium text-slate-900">{displayProject.designer}</p>
                                </div>
                                <div>
                                    <p className="text-slate-400 text-xs font-semibold uppercase mb-1">Style</p>
                                    <p className="text-xl font-medium text-slate-900">{displayProject.style}</p>
                                </div>
                                <div>
                                    <p className="text-slate-400 text-xs font-semibold uppercase mb-1">Estimated Cost</p>
                                    <p className="text-xl font-medium text-slate-900">
                                        {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(displayProject.price || 0)}
                                    </p>
                                </div>
                            </div>

                            {/* Color Palette */}
                            <div className="mb-8">
                                <p className="text-slate-900 font-bold mb-4">Color Palette</p>
                                <div className="flex gap-4">
                                    {displayProject.palette.map((color, i) => (
                                        <div key={i} className="flex flex-col items-center gap-2">
                                            <div
                                                className="w-12 h-12 rounded-full shadow-inner border border-slate-100"
                                                style={{ backgroundColor: color }}
                                            />
                                            <span className="text-[10px] text-slate-400 uppercase">{color}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Description */}
                        <div className="flex flex-col justify-center">
                            <p className="text-slate-600 text-lg leading-relaxed mb-8">
                                {displayProject.description}
                            </p>

                            <h3 className="font-bold text-slate-900 mb-4">Key Elements</h3>
                            <div className="space-y-3">
                                {displayProject.features && displayProject.features.map((feature, i) => (
                                    <div key={i} className="flex items-center gap-3 text-slate-600">
                                        <CheckCircle2 className="h-5 w-5 text-slate-900" />
                                        <span>{feature}</span>
                                    </div>
                                ))}
                            </div>
                            {/* Contact Agent Button (Added since sidebar is gone) */}
                            {project.agent && (
                                <div className="mt-8 border-t border-slate-100 pt-6">
                                    <p className="text-sm text-slate-500 mb-2">Interested in this design?</p>
                                    <div className="flex flex-col gap-2">
                                        <p className="font-bold text-slate-900">{project.agent.fullName}</p>
                                        <div className="flex gap-2">
                                            {project.mobileNumber && (
                                                <Button variant="outline" size="sm" className="gap-2">
                                                    <Phone className="h-4 w-4" />
                                                    {project.mobileNumber}
                                                </Button>
                                            )}
                                            <Button variant="outline" size="sm" className="gap-2">
                                                Email Designer
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </main>

            <ImageModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                images={project.images}
                currentIndex={currentImageIndex}
                onNext={nextImage}
                onPrev={prevImage}
            />
        </div>
    );
};

export default InteriorDetailPage;
