export const FlightCard = ({ flight, onSelect }) => {

    return (
        <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
                {/* Airline */}
                <div className="flex items-center gap-3">
                    <p className="text-sm text-gray-600">{flight.flightNumber}</p>
                </div>

                {/* Departure */}
                <div className="text-center">
                    <p className="text-lg font-medium">{flight.departure}</p>
                </div>

                {/* Arrival */}
                <div className="text-center">
                    <p className="text-lg font-medium">{flight.destination}</p>
                </div>

                {/* DepartureDateTime */}
                <div className="text-center">
                    <p className="text-lg font-medium">{flight.departureDate} {flight.departureTime}</p>
                </div>

                {/* DestinationDateTim */}
                <div className="text-center">
                    <p className="text-lg font-medium">{flight.destinationDate} {flight.destinationTime}</p>
                </div>

                {/* Price & Action */}
                <div className="text-right">
                    <p className="text-xl font-bold text-blue-600">￥{flight.price}</p>
                    <button onClick={() => onSelect(flight)} 
                            className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm">
                        选择航班
                    </button>
                </div>
            </div>
        </div>
    );
}
    