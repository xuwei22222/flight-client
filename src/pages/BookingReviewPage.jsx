import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/AxiosApi';
import { useAuth } from '../context/AuthContext';
import { formatDateTime, formatDate } from '../utils/utils';
import { toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export const BookingReviewPage = () => {
    const { id } = useParams();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            openLoginModal({
                onLoginSuccess: () => {
                    toast.success('Login success!');
                }
            });
            return;
        }
        const fetchBookingDetail = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/bookings/${id}`);
                setBooking(response.data.bookingResponseDto);
            } catch (error) {
                toast.error(error.message || 'Failed to load booking details. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchBookingDetail();
        }
    }, [id]);



    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'confirmed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-500 mt-4">Loading booking details...</p>
                </div>
                <div>
                    <h2>{loading ? <Skeleton /> : user.name}</h2>
                    <p>{loading ? <Skeleton count={3} /> : user.bio}</p>
                    <Skeleton count={loading ? 5 : 0} />
                </div>
            </div>

        );
    }

    if (!booking) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="text-center py-8">
                    <p className="text-gray-500">Booking not found.</p>
                    <button
                        onClick={() => navigate('/my-bookings')}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Back to My Bookings
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Booking Confirmation</h1>
            </div>

            <div className="bg-white border rounded-lg shadow-sm mb-6">
                <div className="p-6 border-b">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">Booking Reference</h2>
                            <p className="text-2xl font-bold text-blue-600">{booking.reference}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Status</p>
                            <span className={`text-right inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                                {booking.status || 'Confirmed'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Flight Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <svg className={`w-6 h-6 ${booking.flightType == 'DEPARTURE' ? 'text-blue-600' : 'text-orange-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" transform={`${booking.flightType == "DEPARTURE" ? 'rotate(90)' : 'rotate(-90)'}`}>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Flight Number</p>
                                    <p className="font-semibold">{booking.flightResponseDto?.flightNumber}</p>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="text-left">
                                        <p className="text-sm text-gray-500">Departure</p>
                                        <p className="font-semibold text-lg">{booking.flightResponseDto?.departure}</p>
                                        <p className="text-sm text-gray-600">{formatDateTime(booking.flightResponseDto?.departureDate + "T" + booking.flightResponseDto?.departureTime + ":00")}</p>
                                    </div>
                                    <div className="flex-1 mx-4">
                                        <div className="border-t-2 border-dashed border-gray-300 relative">
                                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" transform="rotate(90)">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-500">Arrival</p>
                                        <p className="font-semibold text-lg">{booking.flightResponseDto?.destination}</p>
                                        <p className="text-sm text-gray-600">{formatDateTime(booking.flightResponseDto?.destinationDate + "T" + booking.flightResponseDto?.destinationTime + ":00")}</p>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className="space-y-4">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h4 className="font-semibold text-gray-800 mb-3">Booking Information</h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Booking Date:</span>
                                        <span className="font-medium">{formatDate(booking.bookingTime)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Flight Date:</span>
                                        <span className="font-medium">{formatDate(booking.flightResponseDto?.departureDate)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Flight Time:</span>
                                        <span className="font-medium">{booking.flightResponseDto?.departureTime}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-blue-50 rounded-lg p-4">
                                <h4 className="font-semibold text-gray-800 mb-3">Price Details</h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Base Price:</span>
                                        <span className="font-medium">${booking.flightResponseDto?.price}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Taxes & Fees:</span>
                                        <span className="font-medium">${booking.flightResponseDto?.taxes}</span>
                                    </div>
                                    <div className="border-t pt-2 mt-2">
                                        <div className="flex justify-between">
                                            <span className="font-semibold text-gray-800">Total Amount:</span>
                                            <span className="font-bold text-lg text-blue-600">${booking.totalPrice}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div className="flex gap-4 justify-end">
                <button
                    onClick={() => window.print()}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                    Print Confirmation
                </button>
                <button
                    onClick={() => navigate('/booking-list')}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                    Back to Bookings
                </button>
            </div>
        </div>
    );
}