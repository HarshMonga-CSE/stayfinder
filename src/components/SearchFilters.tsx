import React, { useState } from 'react';
import { Search, SlidersHorizontal, MapPin, Calendar, Users } from 'lucide-react';

interface SearchFiltersProps {
  onSearch: (filters: SearchFilters) => void;
}

interface SearchFilters {
  location: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  minPrice: number;
  maxPrice: number;
  propertyType: string;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ onSearch }) => {
  const [filters, setFilters] = useState<SearchFilters>({
    location: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    minPrice: 0,
    maxPrice: 1000,
    propertyType: 'all'
  });
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleInputChange = (field: keyof SearchFilters, value: string | number) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = () => {
    onSearch(filters);
  };

  return (
    <div className="bg-white rounded-2xl shadow-card p-6 mb-8">
      {/* Basic Search */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div className="relative">
          <label className="block text-sm font-medium text-secondary-700 mb-1">
            Where
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search destinations"
              value={filters.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-secondary-700 mb-1">
            Check-in
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 h-5 w-5" />
            <input
              type="date"
              value={filters.checkIn}
              onChange={(e) => handleInputChange('checkIn', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-secondary-700 mb-1">
            Check-out
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 h-5 w-5" />
            <input
              type="date"
              value={filters.checkOut}
              onChange={(e) => handleInputChange('checkOut', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-secondary-700 mb-1">
            Guests
          </label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 h-5 w-5" />
            <select
              value={filters.guests}
              onChange={(e) => handleInputChange('guests', parseInt(e.target.value))}
              className="w-full pl-10 pr-4 py-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'guest' : 'guests'}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 pt-4 border-t border-secondary-200">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Property Type
            </label>
            <select
              value={filters.propertyType}
              onChange={(e) => handleInputChange('propertyType', e.target.value)}
              className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="villa">Villa</option>
              <option value="studio">Studio</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Min Price ($)
            </label>
            <input
              type="number"
              value={filters.minPrice}
              onChange={(e) => handleInputChange('minPrice', parseInt(e.target.value))}
              className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              Max Price ($)
            </label>
            <input
              type="number"
              value={filters.maxPrice}
              onChange={(e) => handleInputChange('maxPrice', parseInt(e.target.value))}
              className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center space-x-2 text-secondary-600 hover:text-primary-600 transition-colors"
        >
          <SlidersHorizontal className="h-5 w-5" />
          <span className="font-medium">
            {showAdvanced ? 'Hide' : 'Show'} Advanced Filters
          </span>
        </button>

        <button
          onClick={handleSearch}
          className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          <Search className="h-5 w-5" />
          <span>Search</span>
        </button>
      </div>
    </div>
  );
};

export default SearchFilters;