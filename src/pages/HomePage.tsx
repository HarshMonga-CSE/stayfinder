import React, { useState, useEffect } from 'react';
import PropertyCard from '../components/PropertyCard';
import SearchFilters from '../components/SearchFilters';
import { Sparkles, TrendingUp, Award } from 'lucide-react';

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

const HomePage = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/properties');
      const data = await response.json();
      setProperties(data);
      setFilteredProperties(data);
    } catch (error) {
      console.error('Failed to fetch properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (filters: any) => {
    let filtered = [...properties];

    if (filters.location) {
      filtered = filtered.filter(property =>
        property.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.propertyType && filters.propertyType !== 'all') {
      filtered = filtered.filter(property =>
        property.type.toLowerCase() === filters.propertyType.toLowerCase()
      );
    }

    if (filters.minPrice > 0) {
      filtered = filtered.filter(property => property.price >= filters.minPrice);
    }

    if (filters.maxPrice > 0) {
      filtered = filtered.filter(property => property.price <= filters.maxPrice);
    }

    setFilteredProperties(filtered);
  };

  const features = [
    {
      icon: <Sparkles className="h-8 w-8 text-primary-600" />,
      title: "Premium Properties",
      description: "Curated selection of high-quality accommodations"
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-primary-600" />,
      title: "Best Prices",
      description: "Competitive rates with no hidden fees"
    },
    {
      icon: <Award className="h-8 w-8 text-primary-600" />,
      title: "Trusted Hosts",
      description: "Verified property owners and excellent service"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Your Perfect Stay
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              Discover amazing places to stay around the world
            </p>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="container mx-auto px-4 -mt-10 relative z-10">
        <SearchFilters onSearch={handleSearch} />
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-secondary-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-secondary-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Properties Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-secondary-800">
              Featured Properties
            </h2>
            <span className="text-secondary-600">
              {filteredProperties.length} properties found
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-card animate-pulse">
                  <div className="aspect-[4/3] bg-secondary-200 rounded-t-2xl"></div>
                  <div className="p-4">
                    <div className="h-4 bg-secondary-200 rounded mb-2"></div>
                    <div className="h-3 bg-secondary-200 rounded mb-3 w-3/4"></div>
                    <div className="h-4 bg-secondary-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}

          {!loading && filteredProperties.length === 0 && (
            <div className="text-center py-12">
              <p className="text-secondary-600 text-lg">
                No properties found matching your criteria.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;