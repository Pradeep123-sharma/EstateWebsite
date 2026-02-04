import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, ArrowRight, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import api from '@/api/axios';

const InteriorsPage = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedRoom, setSelectedRoom] = useState("All");

    useEffect(() => {
        const fetchInteriors = async () => {
            try {
                setLoading(true);
                const response = await api.get('/interiors');
                if (response.data.success) {
                    setProjects(response.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch interiors:", error);
                // toast.error("Failed to load interiors");
            } finally {
                setLoading(false);
            }
        };

        fetchInteriors();
    }, []);

    const filteredProjects = useMemo(() => {
        return projects.filter(project => {
            const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesRoom = selectedRoom === "All" || project.category === selectedRoom;

            return matchesSearch && matchesRoom;
        });
    }, [projects, searchTerm, selectedRoom]);

    return (
        <div className="min-h-screen bg-white text-slate-900 pb-20">
            <main className="container mx-auto px-4 py-12 md:py-20">
                {/* Header */}
                <div className="text-center mb-16 space-y-4">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900"
                    >
                        Interior Inspirations
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-slate-500"
                    >
                        Discover curated designs for every space.
                    </motion.p>
                </div>

                {/* Filter Bar - Pill Shape */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex justify-center mb-16 sticky top-4 z-30"
                >
                    <div className="bg-white/90 backdrop-blur-xl border border-slate-200/60 rounded-full shadow-lg shadow-slate-200/40 p-1.5 flex flex-col items-center sm:flex-row gap-2 transition-all hover:shadow-xl hover:border-slate-300/50">
                        {/* Search */}
                        <div className="flex items-center pl-4 sm:pl-6 h-12 w-full sm:w-auto min-w-[200px] lg:min-w-[300px]">
                            <Search className="h-4 w-4 text-slate-400 shrink-0" />
                            <Input
                                type="text"
                                placeholder="Search for inspiration..."
                                className="border-none shadow-none focus-visible:ring-0 bg-transparent h-full text-base px-3 placeholder:text-slate-400 w-full text-slate-700"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="h-[1px] w-full sm:w-[1px] sm:h-8 bg-slate-200 mx-1 hidden sm:block" />

                        {/* Room Type Dropdown */}
                        <div className="relative h-12 flex items-center group">
                            <select
                                value={selectedRoom}
                                onChange={(e) => setSelectedRoom(e.target.value)}
                                className="appearance-none bg-transparent hover:bg-slate-50 pl-4 pr-10 h-10 rounded-full font-medium text-sm text-slate-700 focus:outline-none cursor-pointer border border-transparent hover:border-slate-200 transition-all"
                            >
                                <option value="All">Room Type</option>
                                <option value="Living Room">Living Room</option>
                                <option value="Kitchen">Kitchen</option>
                                <option value="Bedroom">Bedroom</option>
                                <option value="Bathroom">Bathroom</option>
                                <option value="Office">Office</option>
                                <option value="Dining">Dining</option>
                            </select>
                            <ChevronDown className="absolute right-3 h-3 w-3 text-slate-400 pointer-events-none" />
                        </div>
                    </div>
                </motion.div>

                {/* Loading State */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="h-10 w-10 animate-spin text-slate-900" />
                    </div>
                ) : (
                    <>
                        {/* Masonry Grid */}
                        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <AnimatePresence>
                                {filteredProjects.map((project) => (
                                    <motion.div
                                        layout
                                        key={project._id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        whileHover={{ y: -5 }}
                                        transition={{ duration: 0.3 }}
                                        className="group cursor-pointer"
                                    >
                                        <Link to={`/interiors/${project._id}`}>
                                            <div className="relative overflow-hidden rounded-2xl aspect-[3/4] md:aspect-[4/5] bg-slate-100 shadow-sm">
                                                <img
                                                    src={project.images?.[0] || "https://via.placeholder.com/800x1000?text=No+Image"}
                                                    alt={project.title}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                />

                                                {/* Overlay Content */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                                    <Badge variant="secondary" className="self-start mb-2 bg-white/20 text-white backdrop-blur-md border-none">
                                                        {project.category}
                                                    </Badge>
                                                    <h3 className="text-xl font-bold text-white mb-1">{project.title}</h3>
                                                    <div className="flex items-center text-white/80 text-sm font-medium">
                                                        <span>View Design</span>
                                                        <ArrowRight className="ml-2 h-4 w-4" />
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Mobile/Default info below image (optional, visible if no hover or mobile) */}
                                            <div className="mt-4 flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                                                        {project.title}
                                                    </h3>
                                                    <p className="text-sm text-slate-500">{project.category}</p>
                                                </div>
                                                <span className="text-xs font-medium px-2 py-1 bg-slate-100 rounded-full text-slate-600">
                                                    {project.category}
                                                </span>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>

                        {filteredProjects.length === 0 && (
                            <div className="text-center py-20 text-slate-500">
                                No designs found. Try adjusting your filters.
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
};

export default InteriorsPage;
