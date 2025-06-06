import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../services/AxiosApi';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

export const LoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        try {
            const email = data.email; 
            const password = data.password
            const response = await api.post('/auth/login',{email, password});
            login(response.data.token, response.data.user);
            const target = location.state?.target || '/';
            toast.success('Login success.');
            navigate(target);
        } catch (error) {
            toast.error(error.message || 'Login failed. Please check your email and password.');
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 mt-12">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Login</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-left text-sm font-medium text-gray-700">Email</label>
                    <input {...register('email', { 
                        required: 'Email is required',
                        pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: 'Invalid email format'
                        }
                    })} 
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" 
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                </div>

                <div>
                    <label className="block text-left text-sm font-medium text-gray-700">Password</label>
                    <input {...register('password', { 
                        required: 'Password is required',
                        minLength: { value: 8, message: 'Password must be at least 8 characters' }
                    })} 
                        type="password"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" 
                    />
                    {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                </div>

                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">
                    Sign In
                </button>

                <p className="text-center text-gray-600">Don't have an account? <a href="/register" className="text-blue-600">Register now</a></p>
            </form>
        </div>
    );
}
    