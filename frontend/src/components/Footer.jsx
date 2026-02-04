import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {

    const scrollToSection = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        setMobileMenuOpen(false);
    };

    return (
        <>
            <footer className="bg-slate-900 text-white py-10 px-8 font-inter">
                <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-slate-400 text-sm" data-testid="footer-copyright">© 2025 LRD Groups. All Rights Reserved.</p>
                    <div className="flex items-center gap-8">
                        <Link to="/" className="text-slate-400 text-sm hover:text-white transition-colors no-underline">Home</Link>
                        <button onClick={() => scrollToSection("properties")} className="text-slate-400 text-sm hover:text-white transition-colors bg-transparent border-none cursor-pointer" data-testid="footer-properties">Properties</button>
                        <button onClick={() => scrollToSection("contact")} className="text-slate-400 text-sm hover:text-white transition-colors bg-transparent border-none cursor-pointer" data-testid="footer-contact">Contact</button>
                    </div>
                </div>
            </footer>
        </>
    )
}

export default Footer
