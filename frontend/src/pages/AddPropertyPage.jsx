import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/TextArea";
import { Upload, MapPin, DollarSign, Home, Layout, Plus, X, Loader2 } from "lucide-react";
import api from '@/api/axios';
import { toast } from 'sonner';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/Form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/Select";

const propertySchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters"),
    description: z.string().min(20, "Description must be at least 20 characters"),
    price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: "Price must be a valid positive number",
    }),
    location: z.string().min(3, "Location is required"),
    propertyType: z.enum(["apartment", "house", "commercial", "land"], {
        required_error: "Please select a property type",
    }),
    bedrooms: z.string().optional(), // Not in model but good for UI, can be part of description or features
    bathrooms: z.string().optional(),
    area: z.string().optional(),
    mobileNumber: z.string().min(10, "Valid mobile number is required"),
    photos: z.any()
        .refine((files) => files instanceof FileList || Array.isArray(files), "Photos are required")
        .refine((files) => files.length > 0, "At least one photo is required")
});

const AddPropertyPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [previewImages, setPreviewImages] = useState([]);
    const [features, setFeatures] = useState([]);
    const [currentFeature, setCurrentFeature] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { id } = useParams();
    const isEditMode = !!id;

    const form = useForm({
        resolver: zodResolver(propertySchema),
        defaultValues: {
            title: '',
            description: '',
            price: '',
            location: '',
            propertyType: 'apartment',
            bedrooms: '',
            bathrooms: '',
            area: '',
            mobileNumber: ''
        }
    });

    // Fetch property details if in edit mode
    React.useEffect(() => {
        if (isEditMode) {
            const fetchProperty = async () => {
                try {
                    const response = await api.get(`/properties/${id}`);
                    const data = response.data.data;

                    // Reset form with fetched data
                    form.reset({
                        title: data.title,
                        description: data.description,
                        price: data.price.toString(),
                        location: data.location,
                        propertyType: data.propertyType,
                        bedrooms: data.bedrooms?.toString() || '',
                        bathrooms: data.bathrooms?.toString() || '',
                        area: data.area?.toString() || '',
                        mobileNumber: data.mobileNumber || ''
                    });

                    // Set features
                    if (data.features) {
                        setFeatures(data.features);
                    }

                    // Use existing photos as previews (simplified handling)
                    // Note: Real file objects are not reconstructed, so we just show them.
                    // If user adds new photos, they get appended. 
                    // To remove existing details, more backend logic is needed (not implemented yet).
                    if (data.photos && data.photos.length > 0) {
                        setPreviewImages(data.photos);
                    }

                } catch (error) {
                    console.error("Failed to fetch property", error);
                    toast.error("Failed to load property details");
                    navigate('/dashboard');
                }
            };
            fetchProperty();
        }
    }, [id, isEditMode, form, navigate]);

    // Redirect if not agent
    React.useEffect(() => {
        if (user && user.role !== 'agent') {
            toast.error("Access denied. Only agents can add properties.");
            navigate('/');
        }
    }, [user, navigate]);



    const handleFeatureAdd = (e) => {
        e.preventDefault();
        if (currentFeature.trim()) {
            setFeatures([...features, currentFeature]);
            setCurrentFeature("");
        }
    };

    const removeFeature = (index) => {
        setFeatures(features.filter((_, i) => i !== index));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            form.setValue('photos', e.target.files);

            // Create previews
            const newPreviews = files.map(file => URL.createObjectURL(file));
            setPreviewImages(prev => [...prev, ...newPreviews]);
        }
    };

    const removePreview = (index) => {
        setPreviewImages(prev => prev.filter((_, i) => i !== index));
        toast.info("Image removed from preview (re-upload to update actual selection)");
    };

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('title', data.title);
            formData.append('description', data.description);
            formData.append('price', data.price);
            formData.append('location', data.location);
            formData.append('mobileNumber', data.mobileNumber);
            formData.append('propertyType', data.propertyType);

            // Add features - Backend expects array of strings, but FormData sends strings.
            // We can append multiple 'features' keys or send JSON string if backend handles it.
            // Based on typical multer/express handling, appending mostly works for arrays, 
            // OR we might need to send them as individual fields. 
            // Let's assume backend handles array of same key, OR we can stringify if needed.
            // Actually property.model.js says features: [{type: String}], likely expecting simple array.
            // We will append each feature individually.
            features.forEach(feature => formData.append('features', feature));

            // Append specific fields
            if (data.bedrooms) formData.append('bedrooms', data.bedrooms);
            if (data.bathrooms) formData.append('bathrooms', data.bathrooms);
            if (data.area) formData.append('area', data.area);

            if (data.photos && data.photos.length > 0) {
                Array.from(data.photos).forEach((file) => {
                    formData.append('photos', file); // changed from 'images' to 'photos' based on route multer config ('photos', 10)
                });
            }

            let response;
            if (isEditMode) {
                response = await api.patch(`/properties/${id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                if (response.data.success) {
                    toast.success('Property updated successfully!');
                    navigate('/dashboard');
                }
            } else {
                response = await api.post('/properties', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                if (response.data.success) {
                    toast.success('Property listed successfully!');
                    navigate('/dashboard');
                }
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to list property');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 md:py-20">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="mb-10 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                        {isEditMode ? 'Edit Property' : 'List Your Property'}
                    </h1>
                    <p className="text-slate-500">
                        {isEditMode ? 'Update your property details.' : 'Share your property with thousands of potential buyers and renters.'}
                    </p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden"
                >
                    <div className="p-6 md:p-10">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">

                                {/* Basic Information */}
                                <section className="space-y-6">
                                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                        <Home className="h-5 w-5 text-blue-600" />
                                        Basic Information
                                    </h3>

                                    <FormField
                                        control={form.control}
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Property Title</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g. Luxury Villa with Ocean View" className="h-12 rounded-xl bg-slate-50 border-slate-200" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="mobileNumber"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Mobile Number</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g. 9876543210" className="h-12 rounded-xl bg-slate-50 border-slate-200" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormField
                                            control={form.control}
                                            name="price"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Price (₹)</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <DollarSign className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                                                            <Input type="number" placeholder="5000000" className="pl-10 h-12 rounded-xl bg-slate-50 border-slate-200" {...field} />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="propertyType"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Property Type</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-slate-200">
                                                                <SelectValue placeholder="Select Type" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="apartment">Apartment</SelectItem>
                                                            <SelectItem value="house">House</SelectItem>
                                                            <SelectItem value="commercial">Commercial</SelectItem>
                                                            <SelectItem value="land">Land</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Description</FormLabel>
                                                <FormControl>
                                                    <Textarea rows={4} placeholder="Describe the property..." className="rounded-xl bg-slate-50 border-slate-200 p-4" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </section>

                                <div className="h-[1px] bg-slate-100" />

                                {/* Location */}
                                <section className="space-y-6">
                                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                        <MapPin className="h-5 w-5 text-blue-600" />
                                        Location
                                    </h3>
                                    <div className="grid grid-cols-1 gap-6">
                                        <FormField
                                            control={form.control}
                                            name="location"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Location / Address</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Full address or City" className="h-12 rounded-xl bg-slate-50 border-slate-200" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </section>

                                <div className="h-[1px] bg-slate-100" />

                                {/* Details */}
                                <section className="space-y-6">
                                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                        <Layout className="h-5 w-5 text-blue-600" />
                                        Property Details
                                    </h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                        <FormField
                                            control={form.control}
                                            name="bedrooms"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Bedrooms</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" placeholder="3" className="h-12 rounded-xl bg-slate-50 border-slate-200" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="bathrooms"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Bathrooms</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" placeholder="2" className="h-12 rounded-xl bg-slate-50 border-slate-200" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="area"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Area (sq ft)</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" placeholder="1500" className="h-12 rounded-xl bg-slate-50 border-slate-200" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <FormLabel>Features</FormLabel>
                                        <div className="flex gap-2">
                                            <Input
                                                value={currentFeature}
                                                onChange={(e) => setCurrentFeature(e.target.value)}
                                                placeholder="Add a feature (e.g. Garden, Pool)"
                                                className="h-12 rounded-xl bg-slate-50 border-slate-200"
                                            />
                                            <Button onClick={handleFeatureAdd} type="button" className="h-12 px-6 rounded-xl bg-slate-900 text-white">
                                                <Plus className="h-5 w-5" />
                                            </Button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {features.map((feature, i) => (
                                                <span key={i} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                                                    {feature}
                                                    <X onClick={() => removeFeature(i)} className="h-3 w-3 cursor-pointer hover:text-blue-900" />
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </section>

                                <div className="h-[1px] bg-slate-100" />

                                {/* Image Upload */}
                                <section className="space-y-6">
                                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                        <Upload className="h-5 w-5 text-blue-600" />
                                        Photos
                                    </h3>

                                    <FormField
                                        control={form.control}
                                        name="photos"
                                        render={({ field: { value, onChange, ...field } }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <div className="space-y-4">
                                                        <div
                                                            onClick={() => document.getElementById('property-photos').click()}
                                                            className="aspect-video w-full border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50 cursor-pointer transition-colors bg-slate-50/50"
                                                        >
                                                            <input
                                                                {...field}
                                                                type="file"
                                                                id="property-photos"
                                                                className="hidden"
                                                                multiple
                                                                accept="image/*"
                                                                onChange={handleImageChange}
                                                            />
                                                            <Upload className="h-10 w-10 mb-2" />
                                                            <p className="font-medium text-slate-600">Upload High-Quality Photos</p>
                                                            <p className="text-sm">Supports multiple images</p>
                                                        </div>

                                                        {/* Preview Grid */}
                                                        {previewImages.length > 0 && (
                                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                                {previewImages.map((src, idx) => (
                                                                    <div key={idx} className="relative group rounded-xl overflow-hidden aspect-square border border-slate-200">
                                                                        <img src={src} alt="Preview" className="w-full h-full object-cover" />
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => removePreview(idx)}
                                                                            className="absolute top-1 right-1 bg-white/80 p-1 rounded-full text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity"
                                                                        >
                                                                            <X className="h-4 w-4" />
                                                                        </button>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </section>

                                {/* Submit */}
                                <div className="pt-6">
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full h-14 rounded-2xl bg-slate-900 text-white font-bold text-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                {isEditMode ? 'Updating Listing...' : 'Publishing Listing...'}
                                            </>
                                        ) : (
                                            isEditMode ? 'Update Listing' : 'Publish Listing'
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AddPropertyPage;
