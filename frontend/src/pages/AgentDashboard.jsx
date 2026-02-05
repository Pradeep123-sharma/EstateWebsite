import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Home, Users, Eye, TrendingUp, Plus, Building2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import api from '@/api/axios';
import { toast } from 'sonner';
import AgentPropertyList from '@/components/AgentPropertyList';
import AgentInteriorList from '@/components/AgentInteriorList';

// Mock Data for Charts
const viewData = [
    { name: 'Mon', views: 400 },
    { name: 'Tue', views: 300 },
    { name: 'Wed', views: 550 },
    { name: 'Thu', views: 450 },
    { name: 'Fri', views: 650 },
    { name: 'Sat', views: 800 },
    { name: 'Sun', views: 900 },
];

const AgentDashboard = () => {
    const { user, loading: authLoading } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');
    const [properties, setProperties] = useState([]);
    const [interiors, setInteriors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch data
    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const [propsRes, intsRes] = await Promise.all([
                    api.get('/properties/agent-properties'),
                    api.get('/interiors/agent-interiors')
                ]);
                setProperties(propsRes.data.data);
                setInteriors(intsRes.data.data);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
                toast.error("Failed to load dashboard data");
            } finally {
                setIsLoading(false);
            }
        };

        if (user && user.role === 'agent') {
            fetchData();
        }
    }, [user]);

    const handleDeleteProperty = async (id) => {
        if (!window.confirm("Are you sure you want to delete this property?")) return;
        try {
            await api.delete(`/properties/${id}`);
            setProperties(properties.filter(p => p._id !== id));
            toast.success("Property deleted successfully");
        } catch (error) {
            console.error("Delete error:", error);
            toast.error("Failed to delete property");
        }
    };

    const handleDeleteInterior = async (id) => {
        if (!window.confirm("Are you sure you want to delete this design?")) return;
        try {
            await api.delete(`/interiors/${id}`);
            setInteriors(interiors.filter(i => i._id !== id));
            toast.success("Interior design deleted successfully");
        } catch (error) {
            console.error("Delete error:", error);
            toast.error("Failed to delete interior design");
        }
    };

    // Protect route: Redirect if not agent, but wait for auth to load
    if (authLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (!user || user.role !== 'agent') {
        return <Navigate to="/" replace />;
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-slate-500">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    const StatCard = ({ title, value, icon: Icon, trend }) => (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <p className="text-slate-500 text-sm font-medium">{title}</p>
                    <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
                </div>
                <div className="p-3 bg-blue-50 rounded-xl">
                    <Icon className="w-5 h-5 text-blue-600" />
                </div>
            </div>
            {trend && (
                <div className="flex items-center text-sm">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-green-600 font-medium">{trend}</span>
                    <span className="text-slate-400 ml-1">vs last month</span>
                </div>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Agent Dashboard</h1>
                        <p className="text-slate-500 mt-1">Welcome back, {user.fullName}</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 bg-white p-1 rounded-xl w-fit border border-slate-200">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'overview' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('properties')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'properties' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                        My Properties
                    </button>
                    <button
                        onClick={() => setActiveTab('interiors')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'interiors' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                        My Interiors
                    </button>
                </div>

                {activeTab === 'overview' && (
                    <>
                        <div className="flex gap-3 justify-end mb-4">
                            <Link to="/add-property">
                                <Button className="gap-2 shadow-lg shadow-blue-900/20">
                                    <Plus className="w-4 h-4" /> Add Property
                                </Button>
                            </Link>
                            <Link to="/add-interior">
                                <Button className="gap-2 shadow-lg shadow-blue-900/20">
                                    <Plus className="w-4 h-4" /> Add Interior
                                </Button>
                            </Link>
                        </div>
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <StatCard
                                title="Total Properties"
                                value={properties.length}
                                icon={Building2}
                                trend="+2"
                            />
                            <StatCard
                                title="Total Views"
                                value="14.2k"
                                icon={Eye}
                                trend="+12%"
                            />
                            <StatCard
                                title="Total Designs"
                                value={interiors.length}
                                icon={Users}
                                trend="+5"
                            />
                        </div>

                        {/* Analytics Chart */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                            <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                                <h3 className="text-lg font-bold text-slate-900 mb-6">Property Views Overview</h3>
                                <div className="h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={viewData}>
                                            <defs>
                                                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
                                                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                            <Tooltip
                                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                                cursor={{ stroke: '#e2e8f0', strokeWidth: 2 }}
                                            />
                                            <Area type="monotone" dataKey="views" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Quick Stats or Highlights */}
                            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-center items-center text-center">
                                <div className="p-4 bg-blue-50 rounded-full mb-4">
                                    <Building2 className="w-8 h-8 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900">Manage Properties</h3>
                                <p className="text-slate-500 mt-2 mb-6">View, edit, or delete your property listings.</p>
                                <Button onClick={() => setActiveTab('properties')} variant="outline" className="w-full">
                                    Go to Properties
                                </Button>
                            </div>
                        </div>
                    </>
                )}

                {activeTab === 'properties' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-slate-900">My Properties</h2>
                            <Link to="/add-property">
                                <Button className="gap-2">
                                    <Plus className="w-4 h-4" /> Add New
                                </Button>
                            </Link>
                        </div>
                        <AgentPropertyList properties={properties} onDelete={handleDeleteProperty} />
                    </div>
                )}

                {activeTab === 'interiors' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-slate-900">My Interiors</h2>
                            <Link to="/add-interior">
                                <Button className="gap-2">
                                    <Plus className="w-4 h-4" /> Add New
                                </Button>
                            </Link>
                        </div>
                        <AgentInteriorList interiors={interiors} onDelete={handleDeleteInterior} />
                    </div>
                )}            </div>
        </div>
    );
};

export default AgentDashboard;
