import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, MapPin, Users, Bed, Bath, Wifi, Car, Coffee, Tv, Heart, Share } from 'lucide-react';
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
  description: string;
  amenities: string[];
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  hostId: string;
  hostName: string;
  hostImage: string;
  hostSince: string;
}

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [property, setProperty] = useState<Property | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchProperty(id);
    }
  }, [id]);

  const fetchProperty = async (propertyId: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/properties/${propertyId}`);
      const data = await response.json();
      setProperty(data);
    } catch (error) {
      console.error('Failed to fetch property:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!checkIn || !checkOut) {
      alert('Please select check-in and check-out dates');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          propertyId: id,
          checkIn,
          checkOut,
          guests,
          totalPrice: calculateTotal()
        })
      });

      const data = await response.json();

      if (response.ok) {
        navigate(`/booking-confirmation/${data.id}`);
      } else {
        alert(data.message || 'Booking failed');
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert('Booking failed. Please try again.');
    }
  };

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const timeDiff = end.getTime() - start.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  const calculateTotal = () => {
    const nights = calculateNights();
    if (!property || nights <= 0) return 0;
    return nights * property.price;
  };

  const getAmenityIcon = (amenity: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      'WiFi': <Wifi className="h-5 w-5" />,
      'Parking': <Car className="h-5 w-5" />,
      'Kitchen': <Coffee className="h-5 w-5" />,
      'TV': <Tv className="h-5 w-5" />
    };
    return icons[amenity] || <div className="h-5 w-5 bg-secondary-300 rounded"></div>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-card p-8 animate-pulse">
            <div className="h-8 bg-secondary-200 rounded mb-4"></div>
            <div className="aspect-[16/9] bg-secondary-200 rounded-xl mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-4 bg-secondary-200 rounded"></div>
                <div className="h-4 bg-secondary-200 rounded w-3/4"></div>
                <div className="h-4 bg-secondary-200 rounded w-1/2"></div>
              </div>
              <div className="h-64 bg-secondary-200 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-secondary-800 mb-2">Property not found</h2>
          <p className="text-secondary-600">The property you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-secondary-200">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-secondary-800 mb-2">
                  {property.title}
                </h1>
                <div className="flex items-center space-x-4 text-secondary-600">
                  <div className="flex items-center space-x-1">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="font-medium">{property.rating}</span>
                    <span>({property.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-5 w-5" />
                    <span>{property.location}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 hover:bg-secondary-100 rounded-full transition-colors">
                  <Share className="h-5 w-5 text-secondary-600" />
                </button>
                <button className="p-2 hover:bg-secondary-100 rounded-full transition-colors">
                  <Heart className="h-5 w-5 text-secondary-600 hover:text-red-500" />
                </button>
              </div>
            </div>
          </div>

          {/* Image Gallery */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-8">
              <div className="lg:col-span-3">
                <img
                  src={property.images[selectedImage]}
                  alt={property.title}
                  className="w-full aspect-[4/3] object-cover rounded-xl"
                />
              </div>
              <div className="lg:col-span-2 grid grid-cols-2 gap-4">
                {property.images.slice(1, 5).map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${property.title} ${index + 1}`}
                    onClick={() => setSelectedImage(index + 1)}
                    className="w-full aspect-square object-cover rounded-xl cursor-pointer hover:opacity-80 transition-opacity"
                  />
                ))}
              </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Property Info */}
              <div className="lg:col-span-2">
                {/* Property Details */}
                <div className="mb-8">
                  <div className="flex items-center space-x-6 mb-6">
                    <div className="flex items-center space-x-2">
                      <Users className="h-5 w-5 text-secondary-600" />
                      <span>{property.maxGuests} guests</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Bed className="h-5 w-5 text-secondary-600" />
                      <span>{property.bedrooms} bedrooms</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Bath className="h-5 w-5 text-secondary-600" />
                      <span>{property.bathrooms} bathrooms</span>
                    </div>
                  </div>

                  <div className="prose max-w-none">
                    <p className="text-secondary-700 leading-relaxed">
                      {property.description}
                    </p>
                  </div>
                </div>

                {/* Amenities */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-secondary-800 mb-4">
                    What this place offers
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {property.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        {getAmenityIcon(amenity)}
                        <span className="text-secondary-700">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Host Info */}
                <div className="border-t border-secondary-200 pt-8">
                  <div className="flex items-center space-x-4">
                    <img
                      src={property.hostImage}
                      alt={property.hostName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-semibold text-secondary-800">
                        Hosted by {property.hostName}
                      </h4>
                      <p className="text-secondary-600 text-sm">
                        Host since {property.hostSince}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking Card */}
              <div className="lg:col-span-1">
                <div className="bg-white border border-secondary-200 rounded-2xl p-6 sticky top-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <span className="text-2xl font-bold text-secondary-800">
                        ${property.price}
                      </span>
                      <span className="text-secondary-600 ml-1">/ night</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="font-medium text-secondary-700">
                        {property.rating}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-1">
                          Check-in
                        </label>
                        <input
                          type="date"
                          value={checkIn}
                          onChange={(e) => setCheckIn(e.target.value)}
                          className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-1">
                          Check-out
                        </label>
                        <input
                          type="date"
                          value={checkOut}
                          onChange={(e) => setCheckOut(e.target.value)}
                          className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-1">
                        Guests
                      </label>
                      <select
                        value={guests}
                        onChange={(e) => setGuests(parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        {Array.from({ length: property.maxGuests }, (_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1} {i + 1 === 1 ? 'guest' : 'guests'}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {checkIn && checkOut && (
                    <div className="space-y-2 mb-6 p-4 bg-secondary-50 rounded-lg">
                      <div className="flex justify-between text-secondary-700">
                        <span>${property.price} × {calculateNights()} nights</span>
                        <span>${property.price * calculateNights()}</span>
                      </div>
                      <div className="flex justify-between font-semibold text-secondary-800 border-t border-secondary-200 pt-2">
                        <span>Total</span>
                        <span>${calculateTotal()}</span>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleBooking}
                    disabled={!checkIn || !checkOut}
                    className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-secondary-300 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-colors"
                  >
                    {user ? 'Book Now' : 'Login to Book'}
                  </button>

                  <p className="text-xs text-secondary-500 text-center mt-4">
                    You won't be charged yet
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;