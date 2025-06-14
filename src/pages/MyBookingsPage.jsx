import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/AxiosApi';
import { useAuth } from '../context/AuthContext';
import { formatDateTime } from '../utils/utils';
import { useModal } from '../context/ModalContext';
import { toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export const MyBookingsPage = () => {
    const [upcomingBookings, setUpcomingBookings] = useState([]);
    const [pastBookings, setPastBookings] = useState([]);
    const [load, setLoad] = useState(true);
    const { user, loading } = useAuth();
    const { openLoginModal } = useModal();
    const navigate = useNavigate();

    useEffect(() => {
        if (loading) return;

        if (!user) {
            openLoginModal({
                onLoginSuccess: () => {
                    toast.success('Login success!');
                }
            });
            return;
        }
        const fetchBookings = async () => {
            try {
                setLoad(true);
                const upcomingResponse = await api.get('/bookings', {
                    params: { status: 'UPCOMING', page: 0, size: 10 }
                });
                setUpcomingBookings(upcomingResponse.data.bookingResponseDto || []);

                const pastResponse = await api.get('/bookings', {
                    params: { status: 'PAST', page: 0, size: 10 }
                });
                setPastBookings(pastResponse.data.bookingResponseDto || []);
            } catch (error) {
                toast.error(error.message || 'Failed to load booking details. Please try again.');
            } finally {
                setLoad(false);
            }
        };

        fetchBookings();
    }, [user]);

    const handleViewDetail = (bookingId) => {
        navigate(`/booking-review/${bookingId}`);
    };

    if (load) {
        return (
            <div>
                <h2>{load ? <Skeleton /> : user.name}</h2>
                <p>{load ? <Skeleton count={3} /> : user.bio}</p>
                <Skeleton count={load ? 5 : 0} />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">My Bookings</h1>

            <div className="mb-8">
                <h2 className="text-left text-2xl font-semibold mb-4 text-gray-700">Upcoming</h2>
                {upcomingBookings.length === 0 ? (
                    <div className="bg-gray-50 rounded-lg p-6 text-center">
                        <p className="text-gray-500">No upcoming bookings found.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {upcomingBookings.map(booking => (
                            <div key={booking.bookingId} className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-4 mb-3">
                                            <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                                                <svg className={`w-8 h-8 ${booking.flightType == "DEPARTURE" ? 'text-blue-600' : 'text-orange-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" transform={`${booking.flightType == "DEPARTURE" ? 'rotate(90)' : 'rotate(-90)'}`}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-left text-lg font-semibold text-gray-800">Booking Reference: {booking.reference}</p>
                                                <p className="text-left text-gray-600">{booking.flightResponseDto?.departure} to {booking.flightResponseDto?.destination}</p>
                                                <p className="text-left text-sm text-gray-500">
                                                    <span className="font-semibold">Departure:</span> {formatDateTime(booking.flightResponseDto?.departureDate + "T" + booking.flightResponseDto?.departureTime + ":00")}
                                                    <span className="font-semibold text-lg"> ⇒ </span>
                                                    <span className="font-semibold">Arrival:</span> {formatDateTime(booking.flightResponseDto?.destinationDate + "T" + booking.flightResponseDto?.destinationTime + ":00")}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                            <span><span className="font-semibold">Flight:</span> {booking.flightResponseDto?.flightNumber}</span>
                                            <span>•</span>
                                            <span><span className="font-semibold">Total:</span> ${booking.totalPrice}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleViewDetail(booking.bookingId)}
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                        Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div>
                <h2 className="text-left text-2xl font-semibold mb-4 text-gray-700">Past</h2>
                {pastBookings.length === 0 ? (
                    <div className="bg-gray-50 rounded-lg p-6 text-center">
                        <p className="text-gray-500">No past bookings found.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {pastBookings.map(booking => (
                            <div key={booking.bookingId} className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow opacity-75">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-4 mb-3">
                                            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-left text-lg font-semibold text-gray-600">Booking Reference: {booking.reference}</p>
                                                <p className="text-left text-gray-500">{booking.flightResponseDto?.departure} to {booking.flightResponseDto?.destination}</p>
                                                <p className="text-left text-sm text-gray-400">
                                                    <span className="font-semibold">Departure:</span> {formatDateTime(booking.flightResponseDto?.departureDate + "T" + booking.flightResponseDto?.departureTime + ":00")}
                                                    <span className="font-semibold text-lg"> ⇒ </span>
                                                    <span className="font-semibold">Arrival:</span> {formatDateTime(booking.flightResponseDto?.destinationDate + "T" + booking.flightResponseDto?.destinationTime + ":00")}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-gray-400">
                                            <span><span className="font-semibold">Flight:</span> {booking.flightResponseDto?.flightNumber}</span>
                                            <span>•</span>
                                            <span><span className="font-semibold">Total:</span> ${booking.totalPrice}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleViewDetail(booking.bookingId)}
                                        className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                        Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <button
                onClick={() => navigate('/')}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
                Back to Homepage
            </button>
        </div>
    );
}