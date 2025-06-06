import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { api, getToken } from '../services/AxiosApi';
import FlightCard from '../components/FlightCard';
import { useAuth } from '../context/AuthContext';
import { useModal } from '../context/ModalContext';
import { useBooking } from '../context/BookingContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export const SearchResultPage = () => {
    const { state } = useLocation();
    const [flights, setFlights] = useState([]);
    const [flightType, setFlightType] = useState('');
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const { resetFlight, setSelectedFlights, hasReturn } = useBooking();
    const navigate = useNavigate();
    const { openLoginModal } = useModal();

    useEffect(() => {
        const fetchFlights = async () => {
            if (state.isReturn) {
                setFlightType("Return");
            } else {
                resetFlight();
                setFlightType("Outbound");
            }
            try {
                const response = await api.get('/flights', {
                    params: {
                        from: state.from,
                        to: state.to,
                        date: state.searchDate,
                        page: 0
                    }
                });
                setFlights(response.data.flightResponseDto);
            } finally {
                setLoading(false);
            }
        };
        fetchFlights();
    }, [state]);

    const handleSelectFlight = async (flight) => {
        if (!getToken()) {
            openLoginModal({
                onLoginSuccess: () => {
                    toast.success('Login success!', {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 3000
                    });
                }
            });
            return;
        }
        navigateToFlightDetail(flight.id);
    };

    const navigateToFlightDetail = (flightId) => {
        if (hasReturn) {
            if (state.isReturn) {
                setSelectedFlights(prev => ({ ...prev, returnFlight: flightId }));
                navigate(`/flight-detail`);
            } else {
                setSelectedFlights(prev => ({ ...prev, departureFlight: flightId }));
                const returnFrom = state.to;
                const returnTo = state.from;
                const returnDate = state.returnDate;
                navigate(location.pathname, {
                    state: {
                        from: returnFrom,
                        to: returnTo,
                        searchDate: returnDate,
                        returnDate: null,
                        isReturn: true
                    },
                    replace: true
                });
            }
        } else {
            setSelectedFlights(prev => ({ ...prev, departureFlight: flightId }));
            navigate(`/flight-detail`);
        }
    }
    const goBack = () => {
        navigate(-1);
    };
    return (
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-left text-2xl font-bold mb-6 text-gray-800">Select Your {flightType} Flight：{state.from} → {state.to}</h1>
            {loading ? (
                <div>
                    <h2>{loading ? <Skeleton /> : user.name}</h2>
                    <p>{loading ? <Skeleton count={3} /> : user.bio}</p>
                    <Skeleton count={loading ? 5 : 0} />
                </div>
            ) : flights.length === 0 ? (
                <p className="text-center text-gray-500">No available flights</p>
            ) : (
                <div className="space-y-0">
                    <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            {/* Airline */}
                            <div className="flex items-center gap-3">
                                <p className="text-lg font-medium">Airline</p>
                            </div>

                            {/* Departure */}
                            <div className="text-center">
                                <p className="text-lg font-medium">Departure</p>
                            </div>

                            {/* Arrival */}
                            <div className="text-center">
                                <p className="text-lg font-medium">Arrival</p>
                            </div>

                            {/* DepartureDateTime */}
                            <div className="text-center">
                                <p className="text-lg font-medium">DepartureDateTime</p>
                            </div>

                            {/* DestinationDateTim */}
                            <div className="text-center">
                                <p className="text-lg font-medium">DestinationDateTim</p>
                            </div>

                            {/* Price & Action */}
                            <div className="text-right">
                                <p className="text-lg font-medium">Price & Action</p>
                            </div>
                        </div>
                    </div>
                    {flights.map(flight => (
                        <FlightCard
                            key={flight.id}
                            flight={flight}
                            onSelect={handleSelectFlight}
                        />
                    ))}
                </div>
            )}
            <div>
                <button
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    onClick={goBack}
                >
                    <span>Go Back</span>
                </button>
            </div>
        </div>
    );
}
