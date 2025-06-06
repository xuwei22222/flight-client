import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/AxiosApi';

const Header = () => {
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [windowWidth]);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            const headerElement = document.getElementById('header');
            if (headerElement && !headerElement.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsDropdownOpen(false);
    };

    const handleRegister = () => {
        navigate('/login');
        setIsDropdownOpen(false);
    };

    return (
        <header id="header" className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6">
                <div className="flex justify-between h-10">
                    <div className="flex items-center">
                        <a href="/" className="flex-shrink-0 flex items-center">
                            <span className="text-xl font-bold text-blue-600">AirTravel</span>
                        </a>
                    </div>

                    <div className="flex items-center">
                        <div className="ml-3 relative">
                            <div>
                                <button
                                    type="button"
                                    className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    onClick={toggleDropdown}
                                >
                                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                                        <svg width="24" height="24" fill="none" stroke="currentColor">
                                            <circle cx="12" cy="8" r="5" strokeWidth="1.5" />
                                            <path d="M5 20V19C5 15.134 8.13401 12 12 12C15.866 12 19 15.134 19 19V20" strokeWidth="1.5" />
                                        </svg>
                                    </div>
                                </button>
                            </div>

                            {isDropdownOpen && (
                                <div className="origin-top-right absolute right-0 mt-2 w-38 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1 z-50">
                                    {localStorage.getItem('user') ? (
                                        <>
                                            <div className="px-4 py-2 text-sm text-gray-700">
                                                <div className="text-center font-medium">{ JSON.parse(localStorage.getItem('user')).firstName + " " + JSON.parse(localStorage.getItem('user')).lastName || 'User'}</div>
                                                <div className="text-xs text-gray-500">{JSON.parse(localStorage.getItem('user')).email}</div>
                                            </div>
                                            <div className="border-t border-gray-100"></div>
                                            <a href="/booking-list" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                My Bookings
                                            </a>
                                            <button
                                                className="w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                                onClick={handleLogout}
                                            >
                                                Logout
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-gray-100"
                                            onClick={handleRegister}
                                        >
                                            Login
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;