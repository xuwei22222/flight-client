import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ModalProvider } from './context/ModalContext';
import { BookingProvider } from './context/BookingContext';
import LoginModal from './components/LoginModal';
import HomePage from './pages/HomePage';
import SearchResultPage from './pages/SearchResultPage';
import FlightDetailPage from './pages/FlightDetailPage';
import MyBookingsPage from './pages/MyBookingsPage';
import RegisterPage from './pages/RegisterPage';
import BookingReviewPage from './pages/BookingReviewPage';
import LoginPage from './pages/LoginPage';
import Header from './components/Header';
import Footer from './components/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

const App = () => {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <BookingProvider>
            <ModalProvider>
              <Header />
              <main className="min-h-screen">
                <Routes>
                  <Route path='/' element={<HomePage />} />
                  <Route path='/register' element={<RegisterPage />} />
                  <Route path='/login' element={<LoginPage />} />
                  <Route path='/flight-list' element={<SearchResultPage />} />
                  <Route path='/flight-detail' element={<FlightDetailPage />} />
                  <Route path='/booking-list' element={<MyBookingsPage />} />
                  <Route path='/booking-review/:id' element={<BookingReviewPage />} />
                </Routes>
              </main>
              <Footer />
              <LoginModal />
              <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
              />
            </ModalProvider>
          </BookingProvider>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
};

export default App;
