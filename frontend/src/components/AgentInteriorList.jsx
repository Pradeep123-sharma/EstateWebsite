import React from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Layers, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const AgentInteriorList = ({ interiors, onDelete }) => {
    if (!interiors || interiors.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-3xl border border-slate-100">
                <p className="text-slate-500 mb-4">You haven't shared any designs yet.</p>
                <Link to="/add-interior">
                    <Button>Share First Design</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {interiors.map((interior) => (
                <div key={interior._id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all group">
                    <div className="relative aspect-[4/3] overflow-hidden">
                        <img
                            src={interior.images?.[0] || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80'}
                            alt={interior.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-blue-600">
                            {interior.category}
                        </div>
                    </div>

                    <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                            <h3 className="font-bold text-slate-900 line-clamp-1">{interior.title}</h3>
                        </div>

                        <div className="flex items-center text-slate-500 text-sm mb-3">
                            <Layers className="w-3 h-3 mr-1" />
                            <span className="truncate line-clamp-2">{interior.description}</span>
                        </div>

                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center text-blue-600 font-bold">
                                <DollarSign className="w-4 h-4" />
                                {Number(interior.price).toLocaleString('en-IN')}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-50">
                            <Link to={`/edit-interior/${interior._id}`}>
                                <Button variant="outline" className="w-full h-9 text-xs gap-1 hover:text-blue-600 hover:border-blue-200">
                                    <Edit className="w-3 h-3" /> Edit
                                </Button>
                            </Link>
                            <Button
                                variant="outline"
                                className="w-full h-9 text-xs gap-1 text-red-600 hover:bg-red-50 hover:border-red-200"
                                onClick={() => onDelete(interior._id)}
                            >
                                <Trash2 className="w-3 h-3" /> Delete
                            </Button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AgentInteriorList;
