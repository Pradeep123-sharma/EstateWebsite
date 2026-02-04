import api from './axios';

export const propertyService = {
    // Get all properties
    getAllProperties: async () => {
        const response = await api.get('/properties');
        return response.data;
    },

    // Get property by ID
    getPropertyById: async (id) => {
        const response = await api.get(`/properties/${id}`);
        return response.data;
    },

    // Create new property (requires auth)
    createProperty: async (formData) => {
        const response = await api.post('/properties', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // Update property (requires auth)
    updateProperty: async (id, data) => {
        const response = await api.patch(`/properties/${id}`, data);
        return response.data;
    },

    // Delete property (requires auth)
    deleteProperty: async (id) => {
        const response = await api.delete(`/properties/${id}`);
        return response.data;
    },
};

export const wishlistService = {
    // Get user's wishlist (requires auth)
    getUserWishlist: async () => {
        const response = await api.get('/wishlist');
        return response.data;
    },

    // Add property to wishlist (requires auth)
    addToWishlist: async (propertyId) => {
        const response = await api.post('/wishlist', { propertyId });
        return response.data;
    },

    // Remove property from wishlist (requires auth)
    removeFromWishlist: async (propertyId) => {
        const response = await api.delete(`/wishlist/${propertyId}`);
        return response.data;
    },
};
