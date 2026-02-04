import React, { useState, useEffect } from 'react'
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input"
import { Textarea } from "../components/ui/TextArea";
import { Home, Palette, Mail, Phone, MapPin, ArrowRight, Send, Building2 } from "lucide-react";
import api from "../api/axios";
import { toast } from "sonner";
import Footer from '../components/Footer';
import WhatsappIcon from '../components/WhatsappIcon';
import { Link } from 'react-router-dom';
import Testimonials from '../components/Testimonials';

function HomePage() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [properties, setProperties] = useState([]);
    const [interiorDesigns, setInteriorDesigns] = useState([]);
    const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchProperties();
        fetchInteriorDesigns();
    }, []);

    const fetchProperties = async () => {
        try {
            const response = await api.get('/properties');
            setProperties(response.data.data);
        } catch (error) {
            console.error("Error fetching properties:", error);
        }
    };

    const fetchInteriorDesigns = async () => {
        try {
            const response = await api.get('/interiors');
            setInteriorDesigns(response.data.data);
        } catch (error) {
            console.error("Error fetching interior designs:", error);
        }
    };

    const scrollToSection = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        setMobileMenuOpen(false);
    };

    const handleContactSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/contact', contactForm);
            toast.success("Message sent successfully! We'll get back to you soon.");
            setContactForm({ name: "", email: "", message: "" });
        } catch (error) {
            toast.error("Failed to send message. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="font-playfair bg-slate-50 min-h-screen">
            {/* Hero Section */}
            <section id="home" className="relative h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200')] bg-cover bg-center bg-fixed">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/85 to-emerald-900/75"></div>
                <div className="relative z-10 text-center text-white px-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <h1 className="font-playfair text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 leading-tight" data-testid="hero-title">
                        Welcome to LRD Groups
                    </h1>
                    <p className="text-lg sm:text-xl lg:text-2xl mb-12 font-light opacity-95 max-w-2xl mx-auto" data-testid="hero-subtitle">
                        Your Trusted Partner for Property & Interior Design
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                        <Button onClick={() => scrollToSection("properties")} className="w-full sm:w-auto px-10 py-6 text-lg font-semibold rounded-full flex items-center justify-center gap-2.5 bg-transparent text-white border-2 border-white transition-all duration-300 hover:bg-white hover:text-cyan-600 hover:-translate-y-1 hover:shadow-xl group" data-testid="explore-properties-btn">
                            <Building2 className="w-5 h-5 transition-transform group-hover:scale-110" />
                            Explore Properties
                        </Button>
                        <Button onClick={() => scrollToSection("interior")} className="w-full sm:w-auto px-10 py-6 text-lg font-semibold rounded-full flex items-center justify-center gap-2.5 bg-transparent text-white border-2 border-white transition-all duration-300 hover:bg-white hover:text-cyan-600 hover:-translate-y-1 hover:shadow-xl group" data-testid="explore-interiors-btn">
                            <Palette className="w-5 h-5 transition-transform group-hover:scale-110" />
                            Explore Interiors
                        </Button>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section className="py-24 px-8 bg-slate-50">
                <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="relative group">
                        <div className="absolute -inset-4 bg-cyan-600/10 rounded-3xl blur-2xl transition-all group-hover:bg-cyan-600/20"></div>
                        <img
                            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800"
                            alt="About LRD Groups"
                            className="relative w-full h-[400px] sm:h-[500px] object-cover rounded-3xl shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]"
                        />
                    </div>
                    <div className="flex flex-col items-start">
                        <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-6" data-testid="about-title">About LRD Groups</h2>
                        <p className="text-lg leading-relaxed text-slate-600 mb-6" data-testid="about-description">
                            LRD Groups is managed by <strong className="text-slate-900">Deepak Jangid</strong> who handles all property projects with expertise and dedication,
                            while <strong className="text-slate-900">Khushi Jangid</strong> leads our interior designing division with creativity and passion.
                        </p>
                        <p className="text-lg leading-relaxed text-slate-600 mb-8">
                            Together, we make your dream home a reality. Our mission is to build spaces that reflect your lifestyle and aspirations.
                        </p>
                        <Button onClick={() => scrollToSection("properties")} className="px-8 py-4 bg-cyan-600 text-white rounded-full font-semibold flex items-center gap-2.5 transition-all duration-300 hover:bg-cyan-700 hover:translate-x-1 shadow-lg shadow-cyan-600/20" data-testid="know-more-btn">
                            Know More <ArrowRight className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </section>

            {/* Properties Section */}
            <section id="properties" className="py-24 px-8 bg-white">
                <div className="max-w-[1300px] mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                        <div>
                            <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4" data-testid="properties-title">Our Properties</h2>
                            <p className="text-lg text-slate-500" data-testid="properties-subtitle">Discover your perfect property with Deepak Jangid</p>
                        </div>
                        <Link to="/properties" className="group inline-flex items-center gap-2 px-6 py-3 border-2 border-cyan-600 text-cyan-600 rounded-full font-semibold transition-all hover:bg-cyan-600 hover:text-white">
                            View All Properties
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {properties.length === 0 ? (
                            <>
                                <div className="bg-white rounded-3xl overflow-hidden shadow-xl shadow-slate-200 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl group" data-testid="sample-property-1">
                                    <div className="relative overflow-hidden h-72">
                                        <img src="https://images.unsplash.com/photo-1679364297777-1db77b6199be?w=600" alt="Luxury Villa" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                        <div className="absolute top-4 left-4 bg-cyan-600 text-white px-4 py-1 rounded-full text-sm font-semibold">Featured</div>
                                    </div>
                                    <div className="p-8">
                                        <h3 className="font-playfair text-2xl font-bold text-slate-900 mb-3">Luxury Villa</h3>
                                        <div className="flex items-center gap-2 text-slate-500 text-sm mb-4">
                                            <MapPin className="w-4 h-4 text-cyan-600" /> Jaipur, Rajasthan
                                        </div>
                                        <div className="text-2xl font-bold text-cyan-600 mb-4">₹2.5 Cr</div>
                                        <p className="text-slate-600 leading-relaxed mb-6 line-clamp-2">Beautiful 4BHK villa with modern amenities and garden</p>
                                        <Button onClick={() => scrollToSection("contact")} className="w-full py-4 bg-cyan-600 text-white rounded-2xl font-semibold transition-all hover:bg-cyan-700" data-testid="book-visit-villa">
                                            Book Visit
                                        </Button>
                                    </div>
                                </div>

                                <div className="bg-white rounded-3xl overflow-hidden shadow-xl shadow-slate-200 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl group" data-testid="sample-property-2">
                                    <div className="relative overflow-hidden h-72">
                                        <img src="https://images.unsplash.com/photo-1622015663381-d2e05ae91b72?w=600" alt="Modern Apartment" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                    </div>
                                    <div className="p-8">
                                        <h3 className="font-playfair text-2xl font-bold text-slate-900 mb-3">Modern Apartment</h3>
                                        <div className="flex items-center gap-2 text-slate-500 text-sm mb-4">
                                            <MapPin className="w-4 h-4 text-cyan-600" /> Jodhpur, Rajasthan
                                        </div>
                                        <div className="text-2xl font-bold text-cyan-600 mb-4">₹85 Lakh</div>
                                        <p className="text-slate-600 leading-relaxed mb-6 line-clamp-2">Spacious 3BHK apartment with premium fixtures</p>
                                        <Button onClick={() => scrollToSection("contact")} className="w-full py-4 bg-cyan-600 text-white rounded-2xl font-semibold transition-all hover:bg-cyan-700" data-testid="book-visit-apartment">
                                            Book Visit
                                        </Button>
                                    </div>
                                </div>

                                <div className="bg-white rounded-3xl overflow-hidden shadow-xl shadow-slate-200 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl group" data-testid="sample-property-3">
                                    <div className="relative overflow-hidden h-72">
                                        <img src="https://images.unsplash.com/photo-1622015663319-e97e697503ee?w=600" alt="Premium House" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                    </div>
                                    <div className="p-8">
                                        <h3 className="font-playfair text-2xl font-bold text-slate-900 mb-3">Premium House</h3>
                                        <div className="flex items-center gap-2 text-slate-500 text-sm mb-4">
                                            <MapPin className="w-4 h-4 text-cyan-600" /> Udaipur, Rajasthan
                                        </div>
                                        <div className="text-2xl font-bold text-cyan-600 mb-4">₹1.8 Cr</div>
                                        <p className="text-slate-600 leading-relaxed mb-6 line-clamp-2">Elegant 5BHK house with scenic views and pool</p>
                                        <Button onClick={() => scrollToSection("contact")} className="w-full py-4 bg-cyan-600 text-white rounded-2xl font-semibold transition-all hover:bg-cyan-700" data-testid="book-visit-house">
                                            Book Visit
                                        </Button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            properties.map((property) => (
                                <div key={property.id} className="bg-white rounded-3xl overflow-hidden shadow-xl shadow-slate-200 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl group" data-testid={`property-${property.id}`}>
                                    <div className="relative overflow-hidden h-72">
                                        <img src={property.image_url} alt={property.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                    </div>
                                    <div className="p-8">
                                        <h3 className="font-playfair text-2xl font-bold text-slate-900 mb-3">{property.title}</h3>
                                        <div className="flex items-center gap-2 text-slate-500 text-sm mb-4">
                                            <MapPin className="w-4 h-4 text-cyan-600" /> {property.location}
                                        </div>
                                        <div className="text-2xl font-bold text-cyan-600 mb-4">{property.price}</div>
                                        <p className="text-slate-600 leading-relaxed mb-6 line-clamp-2">{property.description}</p>
                                        <Button onClick={() => scrollToSection("contact")} className="w-full py-4 bg-cyan-600 text-white rounded-2xl font-semibold transition-all hover:bg-cyan-700" data-testid={`book-visit-${property.id}`}>
                                            Book Visit
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </section>

            {/* Interior Design Section */}
            <section id="interior" className="py-24 px-8 bg-slate-50">
                <div className="max-w-[1300px] mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                        <div>
                            <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4" data-testid="interior-title">Interior Designs</h2>
                            <p className="text-lg text-slate-500" data-testid="interior-subtitle">Transform your space with Khushi Jangid's creative designs</p>
                        </div>
                        <Link to="/interiors" className="group inline-flex items-center gap-2 px-6 py-3 border-2 border-cyan-600 text-cyan-600 rounded-full font-semibold transition-all hover:bg-cyan-600 hover:text-white">
                            View All Interiors
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {interiorDesigns.length === 0 ? (
                            <>
                                <div className="relative rounded-3xl overflow-hidden h-[400px] cursor-pointer shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl group" data-testid="sample-interior-1">
                                    <img src="https://images.unsplash.com/photo-1667584523543-d1d9cc828a15?w=600" alt="Modern Living Room" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-8">
                                        <h3 className="font-playfair text-xl font-bold text-white mb-2">Modern Living Room</h3>
                                        <p className="text-white/80 text-sm mb-6">Contemporary design with elegant furniture</p>
                                        <Button onClick={() => scrollToSection("contact")} className="w-fit px-6 py-2.5 bg-white text-cyan-600 rounded-full font-bold transition-all hover:bg-cyan-600 hover:text-white hover:scale-105" data-testid="quote-living-room">
                                            Get Design Quote
                                        </Button>
                                    </div>
                                </div>

                                <div className="relative rounded-3xl overflow-hidden h-[400px] cursor-pointer shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl group" data-testid="sample-interior-2">
                                    <img src="https://images.pexels.com/photos/6603475/pexels-photo-6603475.jpeg?w=600" alt="Luxury Bedroom" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-8">
                                        <h3 className="font-playfair text-xl font-bold text-white mb-2">Luxury Bedroom</h3>
                                        <p className="text-white/80 text-sm mb-6">Comfortable and stylish bedroom design</p>
                                        <Button onClick={() => scrollToSection("contact")} className="w-fit px-6 py-2.5 bg-white text-cyan-600 rounded-full font-bold transition-all hover:bg-cyan-600 hover:text-white hover:scale-105" data-testid="quote-bedroom">
                                            Get Design Quote
                                        </Button>
                                    </div>
                                </div>

                                <div className="relative rounded-3xl overflow-hidden h-[400px] cursor-pointer shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl group" data-testid="sample-interior-3">
                                    <img src="https://images.pexels.com/photos/6489127/pexels-photo-6489127.jpeg?w=600" alt="Modern Kitchen" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-8">
                                        <h3 className="font-playfair text-xl font-bold text-white mb-2">Modern Kitchen</h3>
                                        <p className="text-white/80 text-sm mb-6">Functional and beautiful kitchen space</p>
                                        <Button onClick={() => scrollToSection("contact")} className="w-fit px-6 py-2.5 bg-white text-cyan-600 rounded-full font-bold transition-all hover:bg-cyan-600 hover:text-white hover:scale-105" data-testid="quote-kitchen">
                                            Get Design Quote
                                        </Button>
                                    </div>
                                </div>

                                <div className="relative rounded-3xl overflow-hidden h-[400px] cursor-pointer shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl group" data-testid="sample-interior-4">
                                    <img src="https://images.pexels.com/photos/8490204/pexels-photo-8490204.jpeg?w=600" alt="Office Space" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-8">
                                        <h3 className="font-playfair text-xl font-bold text-white mb-2">Office Space</h3>
                                        <p className="text-white/80 text-sm mb-6">Professional and productive workspace</p>
                                        <Button onClick={() => scrollToSection("contact")} className="w-fit px-6 py-2.5 bg-white text-cyan-600 rounded-full font-bold transition-all hover:bg-cyan-600 hover:text-white hover:scale-105" data-testid="quote-office">
                                            Get Design Quote
                                        </Button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            interiorDesigns.map((design) => (
                                <div key={design.id} className="relative rounded-3xl overflow-hidden h-[400px] cursor-pointer shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl group" data-testid={`interior-${design.id}`}>
                                    <img src={design.image_url} alt={design.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-8">
                                        <h3 className="font-playfair text-xl font-bold text-white mb-2">{design.title}</h3>
                                        <p className="text-white/80 text-sm mb-6">{design.description}</p>
                                        <Button onClick={() => scrollToSection("contact")} className="w-fit px-6 py-2.5 bg-white text-cyan-600 rounded-full font-bold transition-all hover:bg-cyan-600 hover:text-white hover:scale-105" data-testid={`quote-${design.id}`}>
                                            Get Design Quote
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <Testimonials />

            {/* Contact Section */}
            <section id="contact" className="py-24 px-8 bg-white">
                <div className="max-w-[1200px] mx-auto text-center mb-16">
                    <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4" data-testid="contact-title">Contact Us</h2>
                    <p className="text-lg text-slate-500">Have questions? We're here to help you</p>
                </div>

                <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    <div className="bg-slate-50 p-8 sm:p-12 rounded-[2.5rem] shadow-sm border border-slate-100">
                        <form onSubmit={handleContactSubmit} className="flex flex-col gap-6" data-testid="contact-form">
                            <Input
                                type="text"
                                placeholder="Your Name"
                                value={contactForm.name}
                                onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                                required
                                className="h-14 px-6 rounded-2xl border-slate-200 focus:border-cyan-600 focus:ring-4 focus:ring-cyan-600/10 transition-all font-inter"
                                data-testid="contact-name-input"
                            />
                            <Input
                                type="email"
                                placeholder="Your Email"
                                value={contactForm.email}
                                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                                required
                                className="h-14 px-6 rounded-2xl border-slate-200 focus:border-cyan-600 focus:ring-4 focus:ring-cyan-600/10 transition-all font-inter"
                                data-testid="contact-email-input"
                            />
                            <Textarea
                                placeholder="Your Message"
                                value={contactForm.message}
                                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                                required
                                rows={5}
                                className="p-6 rounded-2xl border-slate-200 focus:border-cyan-600 focus:ring-4 focus:ring-cyan-600/10 transition-all font-inter resize-none"
                                data-testid="contact-message-input"
                            />
                            <Button type="submit" disabled={loading} className="w-full py-6 bg-cyan-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2.5 transition-all hover:bg-cyan-700 hover:shadow-lg hover:shadow-cyan-600/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed font-inter" data-testid="contact-submit-btn">
                                {loading ? "Sending..." : "Send Message"} <Send className="w-5 h-5" />
                            </Button>
                        </form>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-12 lg:pt-8 font-inter">
                        <div className="flex gap-5 items-start group" data-testid="contact-phone">
                            <div className="w-14 h-14 bg-cyan-50 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-cyan-600 transition-colors">
                                <Phone className="w-6 h-6 text-cyan-600 group-hover:text-white transition-colors" />
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-slate-900 mb-1">Phone</h4>
                                <p className="text-slate-500 leading-relaxed">+91 9876543210</p>
                            </div>
                        </div>
                        <div className="flex gap-5 items-start group" data-testid="contact-email">
                            <div className="w-14 h-14 bg-cyan-50 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-cyan-600 transition-colors">
                                <Mail className="w-6 h-6 text-cyan-600 group-hover:text-white transition-colors" />
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-slate-900 mb-1">Email</h4>
                                <p className="text-slate-500 leading-relaxed">contact@lrdgroups.com</p>
                            </div>
                        </div>
                        <div className="flex gap-5 items-start group" data-testid="contact-address">
                            <div className="w-14 h-14 bg-cyan-50 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-cyan-600 transition-colors">
                                <MapPin className="w-6 h-6 text-cyan-600 group-hover:text-white transition-colors" />
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-slate-900 mb-1">Address</h4>
                                <p className="text-slate-500 leading-relaxed">Jaipur, Rajasthan, India</p>
                            </div>
                        </div>
                        <div className="flex gap-5 items-start group" data-testid="contact-hours">
                            <div className="w-14 h-14 bg-cyan-50 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-cyan-600 transition-colors">
                                <Home className="w-6 h-6 text-cyan-600 group-hover:text-white transition-colors" />
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-slate-900 mb-1">Working Hours</h4>
                                <p className="text-slate-500 leading-relaxed">Mon - Sat: 9 AM - 6 PM</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <Footer />

            {/* WhatsApp Floating Button */}
            <WhatsappIcon />
        </div>
    )
}

export default HomePage
