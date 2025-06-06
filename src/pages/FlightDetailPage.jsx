import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, getToken } from '../services/AxiosApi';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import { formatCurrency, safeParseNumber } from '../utils/utils';
import { toast } from 'react-toastify';

export const FlightDetailPage = () => {
  const [departureFlight, setDepartureFlight] = useState(null);
  const [returnFlight, setReturnFlight] = useState(null);
  const { user } = useAuth();
  const { selectedFlights, hasReturn } = useBooking();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFlight = async () => {
      try {
        const departureResponse = await api.get(`/flights/${selectedFlights.departureFlight}`);
        setDepartureFlight(departureResponse.data.flightResponseDto);
        if (hasReturn) {
          const returnResponse = await api.get(`/flights/${selectedFlights.returnFlight}`);
          setReturnFlight(returnResponse.data.flightResponseDto);
        }
      } catch (error) {
        navigate('/');
      }
    };
    fetchFlight();
  }, []);

  const handleSubmit = async () => {
    if (!getToken()) {
      openLoginModal({
        onLoginSuccess: () => {
          toast.success('Login success!');
        }
      });
      return;
    }
    try {
      const now = new Date();
      const orderId = now.toLocaleString();
      const departureTotalPrice = (parseFloat(departureFlight.price) + parseFloat(departureFlight.taxes)).toFixed(2);
      await api.post('/bookings', {
        userId: JSON.parse(localStorage.getItem('user')).userId,
        flightId: departureFlight.id,
        reference: orderId,
        flightType: "DEPARTURE",
        totalPrice: departureTotalPrice
      });
      if (hasReturn) {
        const returnTotalPrice = (parseFloat(returnFlight.price) + parseFloat(returnFlight.taxes)).toFixed(2);
        await api.post('/bookings', {
          userId: JSON.parse(localStorage.getItem('user')).userId,
          flightId: returnFlight.id,
          reference: orderId,
          flightType: "RETURN",
          totalPrice: returnTotalPrice
        });

        toast.success('Update success!');

      }
    } catch (error) {
      toast.error(error.message || 'Flight detail failed. Please try agin later.');
    }
    navigate(`/booking-list`);
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className='grid grid-flow-col justify-items-end'>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to HomePage
        </button>
      </div>
      {departureFlight && (
        <>
          <h2 className="text-left text-2xl font-bold mb-4">Departure Flight： #{departureFlight.flightNumber}</h2>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Route Details</h3>
              <p>{departureFlight.departure} → {departureFlight.destination}</p>
              <p>Departure: {departureFlight.departureDate} {departureFlight.departureTime}</p>
              <p>Arrival: {departureFlight.destinationDate} {departureFlight.destinationTime}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Price Details</h3>
              <p>Base Fare: ¥{departureFlight.price}</p>
              <p>Taxes: ¥{departureFlight.taxes}</p>
              <p className="font-bold mt-2">
                Total: {formatCurrency(safeParseNumber(departureFlight?.price) + safeParseNumber(departureFlight?.taxes))}
              </p>
            </div>
          </div>
        </>
      )}
      {returnFlight && (
        <>
          <h2 className="text-left text-2xl font-bold mb-4">Return Flight： #{returnFlight.flightNumber}</h2>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Route Details</h3>
              <p>{returnFlight.departure} → {returnFlight.destination}</p>
              <p>Departure: {returnFlight.departureDate} {returnFlight.departureTime}</p>
              <p>Arrival: {returnFlight.destinationDate} {returnFlight.destinationTime}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Price Details</h3>
              <p>Base Fare: ¥{returnFlight.price}</p>
              <p>Taxes: ¥{returnFlight.taxes}</p>
              <p className="font-bold mt-2">
                Total: {formatCurrency(safeParseNumber(returnFlight?.price) + safeParseNumber(returnFlight?.taxes))}
              </p>
            </div>
          </div>

          <h2 className="text-left text-2xl font-bold mb-4">Fare summary</h2>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-left">Base Fare</p>
              <p className="text-left">{formatCurrency(safeParseNumber(departureFlight.price) + safeParseNumber(returnFlight.price))}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-left">Taxes</p>
              <p className="text-left">{formatCurrency(safeParseNumber(departureFlight.taxes) + safeParseNumber(returnFlight.taxes))}</p>
            </div>
          </div>
          <div className="grid gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-left font-bold mt-2">
                Total: {formatCurrency(safeParseNumber(departureFlight?.price) + safeParseNumber(departureFlight?.taxes) + safeParseNumber(returnFlight?.price) + safeParseNumber(returnFlight?.taxes))}
              </p>
            </div>
          </div>
        </>
      )}
      <button onClick={handleSubmit} className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
        Continue to payment
      </button>
    </div>
  );
}