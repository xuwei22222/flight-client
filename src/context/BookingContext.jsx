import { createContext, useContext, useState } from 'react';

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
    const [selectedFlights, setSelectedFlights] = useState({
        departureFlight: null,
        returnFlight: null
    });
    const [hasReturn, setHasReturn] = useState(false);
    const [passengerCount, setPassengerCount] = useState(1);
    const resetFlight = () => {
        setSelectedFlights({
            departureFlight: null,
            returnFlight: null
        });
    };

    return (
        <BookingContext.Provider value={{
            selectedFlights,
            setSelectedFlights,
            resetFlight,
            hasReturn,
            setHasReturn,
            passengerCount,
            setPassengerCount
        }}>
            {children}
        </BookingContext.Provider>
    );
};

export const useBooking = () => useContext(BookingContext);
