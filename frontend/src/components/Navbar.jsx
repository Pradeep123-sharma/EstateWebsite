import React, { useState } from 'react'
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Building2, Menu, X, Heart, Home, User, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "./ui/Button";
import { useAuth } from "@/context/AuthContext";

function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false); // Added scrolled state
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();

    const scrollToSection = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        setMobileMenuOpen(false);
    };
    return (
        <>
            <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-xl z-[1000] shadow-[0_2px_20px_rgba(0,0,0,0.08)]">
                <div className="max-w-[1400px] mx-auto px-8 py-4.5 flex justify-between items-center">
                    <div className="flex items-center gap-[0.7rem] cursor-pointer" data-testid="logo" onClick={() => navigate('/')}>
                        <Building2 className="w-8 h-8 text-cyan-600" />
                        <span className="font-playfair text-2xl font-bold text-slate-900 leading-none">LRD Groups</span>
                    </div>

                    <div className="hidden md:flex items-center gap-10">
                        <button onClick={() => scrollToSection("home")} className="text-base font-medium text-slate-700 cursor-pointer relative py-2 transition-colors hover:text-cyan-600 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-cyan-600 after:transition-all after:duration-300 hover:after:w-full font-inter">
                            <Link to="/" className="no-underline text-inherit block">Home</Link>
                        </button>
                        <button className="text-base font-medium text-slate-700 cursor-pointer relative py-2 transition-colors hover:text-cyan-600 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-cyan-600 after:transition-all after:duration-300 hover:after:w-full font-inter">
                            <Link to="/properties" className="no-underline text-inherit block">Properties</Link>
                        </button>
                        <button onClick={() => scrollToSection("interior")} className="text-base font-medium text-slate-700 cursor-pointer relative py-2 transition-colors hover:text-cyan-600 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-cyan-600 after:transition-all after:duration-300 hover:after:w-full font-inter" data-testid="nav-interior">
                            <Link to="/interiors" className="no-underline text-inherit block">Interior</Link>
                        </button>
                        <button onClick={() => scrollToSection("contact")} className="text-base font-medium text-slate-700 cursor-pointer relative py-2 transition-colors hover:text-cyan-600 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-cyan-600 after:transition-all after:duration-300 hover:after:w-full font-inter" data-testid="nav-contact">Contact</button>
                        <button className="text-base font-medium text-slate-700 cursor-pointer relative py-2 transition-colors hover:text-cyan-600 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-cyan-600 after:transition-all after:duration-300 hover:after:w-full font-inter">
                            <Link to="/wishlist" className="flex items-center gap-1 no-underline text-inherit block">
                                <Heart className="w-4 h-4" />
                                <span>Wishlist</span>
                            </Link>
                        </button>
                        {user?.role === 'agent' && (
                            <button className="text-base font-medium text-slate-700 cursor-pointer relative py-2 transition-colors hover:text-cyan-600 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-cyan-600 after:transition-all after:duration-300 hover:after:w-full font-inter">
                                <Link to="/dashboard" className="text-blue-600 no-underline block">Dashboard</Link>
                            </button>
                        )}
                        {user ? (
                            <Button onClick={() => { logout(); navigate('/'); }} className="h-9 px-4 rounded-full font-inter">
                                <LogOut className="w-4 h-4 mr-2" /> Logout
                            </Button>
                        ) : (
                            <button className="text-base font-medium text-slate-700 cursor-pointer relative py-2 transition-colors hover:text-cyan-600 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-cyan-600 after:transition-all after:duration-300 hover:after:w-full font-inter">
                                <Link to="/auth" className="no-underline text-inherit block">Login / Signup</Link>
                            </button>
                        )}
                    </div>

                    <button className="md:hidden bg-transparent border-none cursor-pointer text-slate-700 p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} data-testid="mobile-menu-toggle">
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {mobileMenuOpen && (
                    <div className="flex flex-col gap-4 px-8 pt-4 pb-8 bg-white border-t border-slate-200 md:hidden animate-in fade-in slide-in-from-top-4 duration-300 font-inter" data-testid="mobile-menu">
                        <Link to="/" className="text-base font-medium text-slate-700 p-2 rounded-lg hover:bg-slate-100 hover:text-cyan-600 transition-colors no-underline">Home</Link>
                        <Link to="/properties" className="text-base font-medium text-slate-700 p-2 rounded-lg hover:bg-slate-100 hover:text-cyan-600 transition-colors no-underline">Properties</Link>
                        <button onClick={() => scrollToSection("interior")} className="text-left text-base font-medium text-slate-700 p-2 rounded-lg hover:bg-slate-100 hover:text-cyan-600 transition-colors bg-transparent border-none outline-none" data-testid="mobile-nav-interior">Interior</button>
                        <button onClick={() => scrollToSection("contact")} className="text-left text-base font-medium text-slate-700 p-2 rounded-lg hover:bg-slate-100 hover:text-cyan-600 transition-colors bg-transparent border-none outline-none" data-testid="mobile-nav-contact">Contact</button>
                        <Link to="/wishlist" className="text-base font-medium text-slate-700 p-2 rounded-lg hover:bg-slate-100 hover:text-cyan-600 transition-colors no-underline">Wishlist</Link>

                        {user?.role === 'agent' && (
                            <Link to="/dashboard" className="flex items-center gap-1 text-blue-600 font-medium p-2 rounded-lg hover:bg-slate-100 transition-colors no-underline">
                                <LayoutDashboard className="w-4 h-4" /> Dashboard
                            </Link>
                        )}

                        {user ? (
                            <div className="flex flex-col gap-4 mt-2">
                                <span className="text-sm font-medium text-slate-600 px-2 leading-none">Hi, {user.fullName?.split(' ')[0] || 'User'}</span>
                                <Button variant="outline" size="sm" onClick={() => { logout(); navigate('/'); }} className="h-10 px-4 w-full rounded-full flex items-center justify-center">
                                    <LogOut className="w-4 h-4 mr-2" /> Logout
                                </Button>
                            </div>
                        ) : (
                            <Link to="/auth" className="text-base font-medium text-slate-700 p-2 rounded-lg hover:bg-slate-100 hover:text-cyan-600 transition-colors no-underline">Login / Signup</Link>
                        )}
                    </div>
                )}
            </nav>
        </>
    )
}

export default Navbar
