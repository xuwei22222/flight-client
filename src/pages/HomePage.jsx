import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useBooking } from '../context/BookingContext';

export const HomePage = () => {
    const { setPassengerCount, setHasReturn } = useBooking();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [isRoundTrip, setIsRoundTrip] = useState(false);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    const onSubmit = (data) => {
        setPassengerCount(Number(data.passengers));
        setHasReturn(isRoundTrip);
        navigate('/flight-list', {
            state: {
                from: data.from,
                to: data.to,
                searchDate: startDate.toISOString().split('T')[0],
                returnDate: isRoundTrip ? endDate.toISOString().split('T')[0] : null,
                isReturn: false
            }
        });
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-[url(https://q2.itc.cn/images01/20240426/432b05eb5c384785bc538250ef5c656d.jpeg)] bg-cover bg-center h-96 mb-8">
                <div className="absolute inset-x-0 top-30 left-120 h-16">
                    <h1 className="text-3xl font-bold mb-8 text-gray-800">Search Flights</h1>
                </div>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Origin and Destination */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 text-left">Origin</label>
                        <input {...register('from', { required: 'Origin is required' })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                        {errors.from && <p className="text-red-500 text-sm text-left">{errors.from.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 text-left">Destination</label>
                        <input {...register('to', { required: 'Destination is required' })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                        {errors.to && <p className="text-red-500 text-sm text-left">{errors.to.message}</p>}
                    </div>
                </div>

                {/* Date Selection */}
                <div className="flex gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 text-left">Departure Date</label>
                        <DatePicker
                            selected={startDate}
                            onChange={date => setStartDate(date)}
                            minDate={new Date()}
                            dateFormat="yyyy-MM-dd"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                    {isRoundTrip && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 text-left">Return Date</label>
                            <DatePicker
                                selected={endDate}
                                onChange={date => setEndDate(date)}
                                minDate={startDate}
                                dateFormat="yyyy-MM-dd"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                    )}
                </div>

                {/* Passenger Count */}
                <div className="flex gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-900 text-left">Passengers</label>
                        <input {...register('passengers', {
                            required: 'Passenger count is required',
                            min: { value: 1, message: 'Minimum 1 passenger' },
                            max: { value: 9, message: 'Maximum 9 passengers' }
                        })}
                            type="number"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        {errors.passengers && <p className="text-red-500 text-sm text-left">{errors.passengers.message}</p>}
                    </div>
                    <div className="ml-5 mt-6">
                        <input
                            type="checkbox"
                            checked={isRoundTrip}
                            onChange={() => setIsRoundTrip(!isRoundTrip)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label className="text-sm text-gray-700">Round Trip</label>
                    </div>
                    <div className="ml-90 mt-2">
                        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">
                            Search Flights
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}