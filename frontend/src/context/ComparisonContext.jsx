import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'sonner';

const ComparisonContext = createContext();

export const useComparison = () => useContext(ComparisonContext);

export const ComparisonProvider = ({ children }) => {
    const [compareList, setCompareList] = useState([]);
    const MAX_COMPARE = 3;

    const addToCompare = (property) => {
        if (compareList.length >= MAX_COMPARE) {
            toast.error(`You can only compare up to ${MAX_COMPARE} properties`);
            return;
        }
        if (!isInCompare(property.id)) {
            setCompareList((prev) => [...prev, property]);
            toast.success("Added to comparison");
        }
    };

    const removeFromCompare = (propertyId) => {
        setCompareList((prev) => prev.filter((p) => p.id !== propertyId));
    };

    const clearCompare = () => {
        setCompareList([]);
    };

    const isInCompare = (propertyId) => {
        return compareList.some((p) => p.id === propertyId);
    };

    return (
        <ComparisonContext.Provider value={{ compareList, addToCompare, removeFromCompare, clearCompare, isInCompare }}>
            {children}
        </ComparisonContext.Provider>
    );
};
