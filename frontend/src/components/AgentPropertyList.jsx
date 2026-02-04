import React from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash2, MapPin, DollarSign, Eye } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const AgentPropertyList = ({ properties, onDelete }) => {
    if (!properties || properties.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-3xl border border-slate-100">
                <p className="text-slate-500 mb-4">You haven't published any properties yet.</p>
                <Link to="/add-property">
                    <Button>Add First Property</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
                <div key={property._id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all group">
                    <div className="relative aspect-[4/3] overflow-hidden">
                        <img
                            src={property.photos?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80'}
                            alt={property.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-slate-900">
                            {property.status}
                        </div>
                    </div>

                    <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                            <h3 className="font-bold text-slate-900 line-clamp-1">{property.title}</h3>
                        </div>

                        <div className="flex items-center text-slate-500 text-sm mb-3">
                            <MapPin className="w-3 h-3 mr-1" />
                            <span className="truncate">{property.location}</span>
                        </div>

                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center text-blue-600 font-bold">
                                <DollarSign className="w-4 h-4" />
                                {Number(property.price).toLocaleString('en-IN')}
                            </div>
                            <div className="flex items-center text-slate-400 text-xs gap-1">
                                <Eye className="w-3 h-3" />
                                <span>{property.views || 0}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-50">
                            <Link to={`/edit-property/${property._id}`}>
                                <Button variant="outline" className="w-full h-9 text-xs gap-1 hover:text-blue-600 hover:border-blue-200">
                                    <Edit className="w-3 h-3" /> Edit
                                </Button>
                            </Link>
                            <Button
                                variant="outline"
                                className="w-full h-9 text-xs gap-1 text-red-600 hover:bg-red-50 hover:border-red-200"
                                onClick={() => onDelete(property._id)}
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

export default AgentPropertyList;
