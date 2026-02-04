import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LoginForm from '@/components/LoginForm';
import SignupForm from '@/components/SignupForm';
import { Building2 } from "lucide-react";
import { Link } from 'react-router-dom';

const AuthPage = () => {
    const [activeTab, setActiveTab] = useState("login");

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute -top-1/4 -left-1/4 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        rotate: [0, -90, 0],
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute -bottom-1/4 -right-1/4 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"
                />
            </div>

            {/* Left Side: Form Section */}
            <div className="w-full lg:w-[50%] xl:w-[45%] flex flex-col justify-center px-8 sm:px-16 md:px-20 lg:px-24 py-12 relative z-10 transition-all duration-300 overflow-y-auto">
                <div className="max-w-lg w-full ml-auto">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 mb-12 group w-fit">
                        <motion.div
                            whileHover={{ scale: 1.05, rotate: 5 }}
                            className="p-3 bg-gradient-to-br from-slate-900 to-slate-700 rounded-2xl group-hover:from-blue-600 group-hover:to-blue-500 transition-all duration-300 shadow-xl shadow-slate-900/20"
                        >
                            <Building2 className="h-7 w-7 text-white" />
                        </motion.div>
                        <span className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">LRD Groups</span>
                    </Link>

                    {/* Header Text */}
                    <div className="mb-10">
                        <motion.h1
                            key={activeTab}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent tracking-tight mb-4 leading-tight"
                        >
                            {activeTab === 'login' ? 'Welcome Back' : 'Get Started'}
                        </motion.h1>
                        <motion.p
                            key={`${activeTab}-desc`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-slate-600 text-lg font-medium"
                        >
                            {activeTab === 'login' ? 'Login to access your account.' : 'Create an account to get started.'}
                        </motion.p>
                    </div>

                    {/* Tabs */}
                    <div className="flex p-1.5 bg-white/80 backdrop-blur-sm rounded-2xl mb-8 w-full border border-slate-200/60 shadow-lg shadow-slate-200/50">
                        <button
                            onClick={() => setActiveTab("login")}
                            className={`flex-1 px-8 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === "login"
                                ? "bg-gradient-to-r from-slate-900 to-slate-700 text-white shadow-lg shadow-slate-900/30"
                                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                                }`}
                        >
                            Login
                        </button>
                        <button
                            onClick={() => setActiveTab("signup")}
                            className={`flex-1 px-8 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === "signup"
                                ? "bg-gradient-to-r from-slate-900 to-slate-700 text-white shadow-lg shadow-slate-900/30"
                                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                                }`}
                        >
                            Sign Up
                        </button>
                    </div>

                    {/* Form Container with Animation */}
                    <div className="relative">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, x: activeTab === "login" ? -20 : 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: activeTab === "login" ? 20 : -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                {activeTab === "login" ? (
                                    <LoginForm />
                                ) : (
                                    <SignupForm />
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Footer */}
                    <div className="mt-10 text-center text-sm text-slate-500 font-medium">
                        <p>&copy; {new Date().getFullYear()} LRD Groups. All rights reserved.</p>
                    </div>
                </div>
            </div>

            {/* Right Side: Image Section */}
            <div className="hidden lg:block lg:w-[50%] xl:w-[55%] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 z-10" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-20" />

                <motion.img
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.4 }}
                    transition={{ duration: 1.2 }}
                    src="https://images.unsplash.com/photo-1600596542815-2a429f08f6c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"
                    alt="Luxury Home"
                    className="w-full h-full object-cover"
                />

                {/* Content Overlay */}
                <div className="absolute inset-0 z-30 flex flex-col justify-center px-16 ml-2">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                    >
                        <p className="text-sm font-bold tracking-[0.3em] uppercase mb-6 text-blue-400">Premium Living</p>
                        <h2 className="text-5xl font-bold leading-tight mb-6 text-white max-w-xl">
                            Discover homes that reflect your style and success.
                        </h2>
                        <p className="text-lg text-slate-300 max-w-lg leading-relaxed">
                            Join thousands of satisfied clients who found their dream properties with LRD Groups.
                        </p>

                        {/* Decorative Stats */}
                        <div className="grid grid-cols-3 gap-8 mt-12 max-w-lg">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-white mb-1">500+</div>
                                <div className="text-sm text-slate-400 font-medium">Properties</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-white mb-1">1000+</div>
                                <div className="text-sm text-slate-400 font-medium">Happy Clients</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-white mb-1">50+</div>
                                <div className="text-sm text-slate-400 font-medium">Agents</div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;