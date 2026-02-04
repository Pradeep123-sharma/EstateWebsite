import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";
import { WishlistButton } from "./WishlistButton";
import { useComparison } from "@/context/ComparisonContext";
import { Link } from "react-router-dom";
import { BedDouble, Bath, Square, MapPin, ArrowRight, ArrowLeftRight } from "lucide-react";
import { motion } from "framer-motion";

export function PropertyCard({ property }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Fallback if image array is empty or invalid
  const mainImage = property.photos && property.photos.length > 0
    ? property.photos[0]
    : "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";

  const { addToCompare, isInCompare, removeFromCompare } = useComparison();
  const isCompared = isInCompare(property._id);

  const handleCompare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isCompared) {
      removeFromCompare(property._id);
    } else {
      addToCompare(property);
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 group bg-white rounded-2xl overflow-hidden">
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
          <img
            src={mainImage}
            alt={property.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute top-4 left-4 flex gap-2">
            <Badge className={`rounded-lg px-2.5 py-1 ${property.status === 'rented' ? "bg-blue-600 text-white" : "bg-slate-900 text-white"}`}>
              {property.status === 'rented' ? 'Rented' : 'For Sale'}
            </Badge>
          </div>
          <div className="absolute top-4 right-4 flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCompare}
              className={`rounded-full shadow-sm backdrop-blur-sm transition-all ${isCompared ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-white/80 text-slate-500 hover:bg-white hover:text-blue-600'}`}
              title="Compare"
            >
              <ArrowLeftRight className="h-4 w-4" />
            </Button>
            <WishlistButton property={property} />
          </div>
        </div>

        {/* Content */}
        <CardContent className="p-5 flex flex-col gap-4">
          <div className="space-y-1">
            <h3 className="font-semibold text-lg text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
              {property.title}
            </h3>
            <div className="flex items-center text-slate-500 text-sm">
              <MapPin className="h-4 w-4 mr-1.5" />
              <span className="line-clamp-1">{property.location}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-xl font-bold text-slate-900">
              {formatPrice(property.price)}
            </p>
          </div>

          <div className="flex items-center justify-between py-4 border-t border-slate-100 mt-2">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <BedDouble className="h-4 w-4" />
              <span><span className="font-semibold text-slate-900">{property.bedrooms || 0}</span> Beds</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Bath className="h-4 w-4" />
              <span><span className="font-semibold text-slate-900">{property.bathrooms || 0}</span> Baths</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Square className="h-4 w-4" />
              <span><span className="font-semibold text-slate-900">{property.area || 0}</span> ft²</span>
            </div>
          </div>

          <Link to={`/properties/${property._id}`} className="w-full mt-auto">
            <Button className="w-full rounded-xl bg-slate-900 text-white hover:bg-blue-600 hover:text-white transition-colors h-11">
              View Details
            </Button>
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  );
}
