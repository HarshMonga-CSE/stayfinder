import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, MapPin } from 'lucide-react';

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  rating: number;
  reviews: number;
  images: string[];
  type: string;
}

interface PropertyCardProps {
  property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  return (
    <Link to={`/property/${property.id}`} className="group">
      <div className="bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <button className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white rounded-full transition-colors">
            <Heart className="h-4 w-4 text-secondary-600 hover:text-red-500" />
          </button>
          <div className="absolute bottom-3 left-3 bg-black/50 text-white px-2 py-1 rounded-md text-xs font-medium">
            {property.type}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-secondary-800 line-clamp-1 group-hover:text-primary-600 transition-colors">
              {property.title}
            </h3>
            <div className="flex items-center space-x-1 ml-2">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium text-secondary-700">
                {property.rating}
              </span>
            </div>
          </div>

          <div className="flex items-center text-secondary-600 mb-3">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="text-sm">{property.location}</span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-bold text-secondary-800">
                ${property.price}
              </span>
              <span className="text-sm text-secondary-600 ml-1">/ night</span>
            </div>
            <span className="text-sm text-secondary-500">
              {property.reviews} reviews
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;