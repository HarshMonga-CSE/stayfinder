import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Calendar, Users, MapPin, CreditCard } from 'lucide-react';

interface Booking {
  id: string;
  propertyTitle: string;
  propertyLocation: string;
  propertyImage: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: string;
  guestName: string;
}

const BookingConfirmation = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchBooking(id);
    }
  }, [id]);

  const fetchBooking = async (bookingId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/bookings/${bookingId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setBooking(data);
    } catch (error) {
      console.error('Failed to fetch booking:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-secondary-800 mb-2">Booking not found</h2>
          <p className="text-secondary-600">The booking you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-secondary-800 mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-secondary-600">
            Your reservation has been successfully confirmed. You'll receive a confirmation email shortly.
          </p>
        </div>

        {/* Booking Details Card */}
        <div className="bg-white rounded-2xl shadow-card overflow-hidden mb-8">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-secondary-800 mb-6">
              Booking Details
            </h2>

            {/* Property Info */}
            <div className="flex items-start space-x-4 mb-6 pb-6 border-b border-secondary-200">
              <img
                src={booking.propertyImage}
                alt={booking.propertyTitle}
                className="w-20 h-20 rounded-lg object-cover"
              />
              <div>
                <h3 className="font-semibold text-secondary-800 mb-1">
                  {booking.propertyTitle}
                </h3>
                <div className="flex items-center text-secondary-600 text-sm">
                  <MapPin className="h-4 w-4 mr-1" />
                  {booking.propertyLocation}
                </div>
              </div>
            </div>

            {/* Booking Info */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-secondary-600" />
                  <div>
                    <span className="font-medium text-secondary-800">Check-in</span>
                    <p className="text-secondary-600 text-sm">
                      {new Date(booking.checkIn).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-medium text-secondary-800">Check-out</span>
                  <p className="text-secondary-600 text-sm">
                    {new Date(booking.checkOut).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-secondary-600" />
                  <span className="font-medium text-secondary-800">
                    {booking.guests} {booking.guests === 1 ? 'Guest' : 'Guests'}
                  </span>
                </div>
                <span className="text-secondary-600">Booking ID: #{booking.id.slice(-8)}</span>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-secondary-200">
                <div className="flex items-center space-x-3">
                  <CreditCard className="h-5 w-5 text-secondary-600" />
                  <span className="font-medium text-secondary-800">Total Amount</span>
                </div>
                <span className="text-2xl font-bold text-secondary-800">
                  ${booking.totalPrice}
                </span>
              </div>

              <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                <h4 className="font-medium text-primary-800 mb-2">What's Next?</h4>
                <ul className="text-primary-700 text-sm space-y-1">
                  <li>• Check your email for the confirmation details</li>
                  <li>• Contact your host if you have any questions</li>
                  <li>• Review the property's check-in instructions</li>
                  <li>• Enjoy your stay!</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/"
            className="flex-1 bg-primary-600 hover:bg-primary-700 text-white text-center py-3 px-6 rounded-lg font-medium transition-colors"
          >
            Continue Browsing
          </Link>
          <button
            onClick={() => window.print()}
            className="flex-1 bg-white hover:bg-secondary-50 text-secondary-700 border border-secondary-300 py-3 px-6 rounded-lg font-medium transition-colors"
          >
            Print Confirmation
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;