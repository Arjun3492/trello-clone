import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../provider/authProvider';
const Login = () => {
    const { login } = useAuth();
    const router = useNavigate();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    }

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();

            setLoading(true);
            const userLoggedIn = await login(formData);
            userLoggedIn && router('/tasks', { replace: true });
        } catch (error) {
            console.error('Error during login:', error.response ? error.response.data : error.message);
            alert(error.response ? error.response.data.msg : error.message);
        } finally {
            setLoading(false);
        }

    }

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="w-full max-w-md">
                <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <h2 className="text-center text-2xl font-bold mb-6">Login</h2>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="email"
                            type="text"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                            id="password"
                            type="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="button"
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? "Loading..." : "Login"}
                        </button>
                    </div>
                    <p className="text-center text-sm mt-4">
                        Don't have an account? <Link to="/signup" className="text-blue-500">Signup</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
