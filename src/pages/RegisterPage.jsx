import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/AxiosApi';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

export const RegisterPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        try {
            const response = await api.post('/auth/register', data);
            login(response.data.token, response.data.user);
            toast.success('Registration success.')
            navigate('/');
        } catch (error) {
            toast.error(error.message || 'Registration failed. Please check your information.');
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 mt-12">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Register</h1>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-left text-sm font-medium text-gray-700">First Name</label>
                        <input {...register('firstName', { required: 'First name is required' })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                        {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
                    </div>
                    <div>
                        <label className="block text-left text-sm font-medium text-gray-700">Last Name</label>
                        <input {...register('lastName', { required: 'Last name is required' })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                        {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
                    </div>
                </div>
                <div>
                    <label className="block text-left text-sm font-medium text-gray-700">Country/Region</label>
                    <input {...register('country', { required: 'Country is required' })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                    {errors.country && <p className="text-red-500 text-sm">{errors.country.message}</p>}
                </div>

                <div>
                    <label className="block text-left text-sm font-medium text-gray-700">Phone (Optional)</label>
                    <input {...register('phone')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                </div>

                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">
                    Register
                </button>
            </form>
        </div>
    );
}
