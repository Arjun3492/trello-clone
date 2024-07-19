import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../axios';
import { useNavigate } from 'react-router-dom';
const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [loading, setLoading] = useState(false);
    const router = useNavigate();


    const handleSignup = async () => {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);
        if (avatar) {
            formData.append('avatar', avatar);
        }

        try {
            setLoading(true);
            const response = await axiosInstance.post('/auth/register', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.status !== 200) {
                alert(response.data.msg);
                return;
            }
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            router('/tasks', { replace: true });
        } catch (error) {
            console.error('Error during signup:', error.response ? error.response.data : error.msg);
            alert(error.response ? error.response.data.msg : error.message);

        } finally {
            setLoading(false);
        }
    };


    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (allowedTypes.includes(file.type)) {
            setAvatar(file);
        } else {
            alert('Only .jpeg, .jpg, and .png files are allowed');
        }
    };


    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="w-full max-w-md">
                <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <h2 className="text-center text-2xl font-bold mb-6">Signup</h2>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                            Name
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="name"
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="email"
                            type="text"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="avatar">
                            Avatar
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="avatar"
                            type="file"
                            accept=".jpeg, .jpg, .png"
                            onChange={handleAvatarChange}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="button"
                            onClick={handleSignup}
                            disabled={!name || !email || !password || loading}
                        >
                            {loading ? "Loading" : "Signup"}
                        </button>
                    </div>
                    <p className="text-center text-sm mt-4">
                        Already have an account? <Link to="/login" className="text-blue-500">Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
