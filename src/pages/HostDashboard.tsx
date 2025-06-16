import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, DollarSign, Users, Star } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  rating: number;
  reviews: number;
  images: string[];
  type: string;
  status: 'active' | 'inactive';
}

interface Booking {
  id: string;
  propertyTitle: string;
  guestName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
}

interface NewProperty {
  title: string;
  location: string;
  price: number;
  type: string;
  description: string;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  amenities: string[];
  images: string[];
}

const HostDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'properties' | 'bookings' | 'add-property'>('properties');
  const [properties, setProperties] = useState<Property[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProperty, setNewProperty] = useState<NewProperty>({
    title: '',
    location: '',
    price: 0,
    type: 'apartment',
    description: '',
    bedrooms: 1,
    bathrooms: 1,
    maxGuests: 2,
    amenities: [],
    images: []
  });

  useEffect(() => {
    if (user?.isHost) {
      fetchHostData();
    }
  }, [user]);

  const fetchHostData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch properties
      const propertiesResponse = await fetch('http://localhost:3001/api/host/properties', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const propertiesData = await propertiesResponse.json();
      setProperties(propertiesData);

      // Fetch bookings
      const bookingsResponse = await fetch('http://localhost:3001/api/host/bookings', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const bookingsData = await bookingsResponse.json();
      setBookings(bookingsData);
    } catch (error) {
      console.error('Failed to fetch host data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof NewProperty, value: any) => {
    setNewProperty(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAmenityToggle = (amenity: string) => {
    setNewProperty(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleAddProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/host/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newProperty)
      });

      if (response.ok) {
        setShowAddForm(false);
        setNewProperty({
          title: '',
          location: '',
          price: 0,
          type: 'apartment',
          description: '',
          bedrooms: 1,
          bathrooms: 1,
          maxGuests: 2,
          amenities: [],
          images: []
        });
        fetchHostData();
      }
    } catch (error) {
      console.error('Failed to add property:', error);
    }
  };

  const handleDeleteProperty = async (propertyId: string) => {
    if (!confirm('Are you sure you want to delete this property?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/host/properties/${propertyId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        fetchHostData();
      }
    } catch (error) {
      console.error('Failed to delete property:', error);
    }
  };

  const availableAmenities = ['WiFi', 'Parking', 'Kitchen', 'TV', 'Air Conditioning', 'Heating', 'Washer', 'Dryer'];
  const sampleImages = [
    'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1428348/pexels-photo-1428348.jpeg?auto=compress&cs=tinysrgb&w=800'
  ];

  if (!user?.isHost) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-secondary-800 mb-2">Access Denied</h2>
          <p className="text-secondary-600">You need to be a registered host to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-800 mb-2">Host Dashboard</h1>
          <p className="text-secondary-600">Manage your properties and bookings</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary-600 text-sm font-medium">Total Properties</p>
                <p className="text-2xl font-bold text-secondary-800">{properties.length}</p>
              </div>
              <div className="p-3 bg-primary-100 rounded-full">
                <Eye className="h-6 w-6 text-primary-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary-600 text-sm font-medium">Total Bookings</p>
                <p className="text-2xl font-bold text-secondary-800">{bookings.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary-600 text-sm font-medium">Total Revenue</p>
                <p className="text-2xl font-bold text-secondary-800">
                  ${bookings.reduce((sum, booking) => sum + booking.totalPrice, 0)}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          <div className="border-b border-secondary-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('properties')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'properties'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-secondary-500 hover:text-secondary-700'
                }`}
              >
                Properties
              </button>
              <button
                onClick={() => setActiveTab('bookings')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'bookings'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-secondary-500 hover:text-secondary-700'
                }`}
              >
                Bookings
              </button>
              <button
                onClick={() => setActiveTab('add-property')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'add-property'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-secondary-500 hover:text-secondary-700'
                }`}
              >
                Add Property
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Properties Tab */}
            {activeTab === 'properties' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-secondary-800">Your Properties</h2>
                  <button
                    onClick={() => setActiveTab('add-property')}
                    className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    <Plus className="h-5 w-5" />
                    <span>Add Property</span>
                  </button>
                </div>

                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, index) => (
                      <div key={index} className="bg-secondary-100 rounded-xl p-4 animate-pulse">
                        <div className="aspect-[4/3] bg-secondary-200 rounded-lg mb-4"></div>
                        <div className="h-4 bg-secondary-200 rounded mb-2"></div>
                        <div className="h-3 bg-secondary-200 rounded w-3/4"></div>
                      </div>
                    ))}
                  </div>
                ) : properties.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-secondary-600 mb-4">You haven't added any properties yet.</p>
                    <button
                      onClick={() => setActiveTab('add-property')}
                      className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      Add Your First Property
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {properties.map((property) => (
                      <div key={property.id} className="bg-white border border-secondary-200 rounded-xl overflow-hidden">
                        <img
                          src={property.images[0]}
                          alt={property.title}
                          className="w-full aspect-[4/3] object-cover"
                        />
                        <div className="p-4">
                          <h3 className="font-semibold text-secondary-800 mb-1">{property.title}</h3>
                          <p className="text-secondary-600 text-sm mb-2">{property.location}</p>
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-lg font-bold text-secondary-800">
                              ${property.price}/night
                            </span>
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span className="text-sm">{property.rating}</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                property.status === 'active'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-secondary-100 text-secondary-800'
                              }`}
                            >
                              {property.status}
                            </span>
                            <div className="flex items-center space-x-2">
                              <button className="p-2 text-secondary-600 hover:text-primary-600">
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteProperty(property.id)}
                                className="p-2 text-secondary-600 hover:text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div>
                <h2 className="text-xl font-semibold text-secondary-800 mb-6">Recent Bookings</h2>
                
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, index) => (
                      <div key={index} className="bg-secondary-100 rounded-xl p-4 animate-pulse">
                        <div className="h-4 bg-secondary-200 rounded mb-2"></div>
                        <div className="h-3 bg-secondary-200 rounded w-3/4"></div>
                      </div>
                    ))}
                  </div>
                ) : bookings.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-secondary-600">No bookings yet.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-secondary-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                            Property
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                            Guest
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                            Dates
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                            Guests
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                            Total
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-secondary-200">
                        {bookings.map((booking) => (
                          <tr key={booking.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-secondary-800">
                                {booking.propertyTitle}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-secondary-800">{booking.guestName}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-secondary-800">
                                {booking.checkIn} - {booking.checkOut}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-secondary-800">{booking.guests}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-secondary-800">
                                ${booking.totalPrice}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  booking.status === 'confirmed'
                                    ? 'bg-green-100 text-green-800'
                                    : booking.status === 'pending'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {booking.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Add Property Tab */}
            {activeTab === 'add-property' && (
              <div>
                <h2 className="text-xl font-semibold text-secondary-800 mb-6">Add New Property</h2>
                
                <form onSubmit={handleAddProperty} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-1">
                        Property Title
                      </label>
                      <input
                        type="text"
                        required
                        value={newProperty.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Cozy Downtown Apartment"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        required
                        value={newProperty.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="New York, NY"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-1">
                        Price per Night ($)
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={newProperty.price}
                        onChange={(e) => handleInputChange('price', parseInt(e.target.value))}
                        className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-1">
                        Property Type
                      </label>
                      <select
                        value={newProperty.type}
                        onChange={(e) => handleInputChange('type', e.target.value)}
                        className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="apartment">Apartment</option>
                        <option value="house">House</option>
                        <option value="villa">Villa</option>
                        <option value="studio">Studio</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-1">
                        Bedrooms
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={newProperty.bedrooms}
                        onChange={(e) => handleInputChange('bedrooms', parseInt(e.target.value))}
                        className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-1">
                        Bathrooms
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={newProperty.bathrooms}
                        onChange={(e) => handleInputChange('bathrooms', parseInt(e.target.value))}
                        className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-1">
                        Max Guests
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={newProperty.maxGuests}
                        onChange={(e) => handleInputChange('maxGuests', parseInt(e.target.value))}
                        className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Description
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={newProperty.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Describe your property..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-3">
                      Amenities
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {availableAmenities.map((amenity) => (
                        <label key={amenity} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={newProperty.amenities.includes(amenity)}
                            onChange={() => handleAmenityToggle(amenity)}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                          />
                          <span className="ml-2 text-sm text-secondary-700">{amenity}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => setActiveTab('properties')}
                      className="px-6 py-3 border border-secondary-300 text-secondary-700 rounded-lg hover:bg-secondary-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
                    >
                      Add Property
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostDashboard;