import { useState, useEffect } from "react";
import { Mountain } from 'lucide-react';

import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
export default function LoginForm() {
    const [form, setForm] = useState({ username: "", password: "" })
    const [message, setMessage] = useState("");

    const navigate = useNavigate();
    const { isAuthenticated, apiUrl } = useAuth();
    useEffect(() => {

        if (isAuthenticated) {
            navigate('/profile', { replace: true });
        }
    }, [isAuthenticated])
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = {
            username: form.username,
            password: form.password


        }
        try {
            const res = await fetch(`${apiUrl}/api/login`, {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(formData),
                credentials: 'include'

            });

            if (res.ok) {
                const jwtResponse = await res.json();


                localStorage.setItem('accessToken', jwtResponse.accessToken);

                window.location.href = '/profile'
                setMessage("Login successful!");
            }
            else if (!res.ok) {
                const err = await res.json();
                if (err.errorCode === "ACCOUNT_NOT_VERIFIED" && err.email) {
                    // Redirect to verification page with the email
                    window.location.href = `/verify?email=${encodeURIComponent(err.email)}`;
                    return;
                }
                throw new Error(err.message);
            }
        } catch (e) {
            setMessage("Login failed: " + e.message);
        }


    }
    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }
    const handleRegisterClick = () => {
        navigate('/register');
    }
    return (
        <div className="min-h-screen flex">
            {/* Left side - Login Form */}
            <div className="flex-1 bg-white flex items-center justify-center px-8">
                <div className="max-w-md w-full space-y-8">
                    {/* Logo */}
                    <div className="flex items-center mb-8">
                        <Mountain className="h-10 w-10 text-yellow-600 mr-3" />
                        <span className="text-2xl font-bold text-yellow-600">Alk</span>
                    </div>

                    {/* Login Form */}
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-8">Welcome Back</h2>

                        <div className="space-y-6">
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    name="username"
                                    id="username"
                                    onChange={handleChange}
                                    value={form.username}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    onChange={handleChange}
                                    value={form.password}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                                    required
                                />
                            </div>

                            <button
                                onClick={handleSubmit}
                                className="w-full bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-colors duration-200 font-medium"
                            >
                                Log In
                            </button>
                            <div className="text-center">
                                <p className="text-sm text-gray-600 mb-3">
                                    Don't have an account?
                                </p>
                                <button
                                    onClick={handleRegisterClick}
                                    className="w-full bg-white text-yellow-600 py-2 px-4 rounded-md border-2 border-yellow-600 hover:bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-colors duration-200 font-medium"
                                >
                                    Create Account
                                </button>
                            </div>
                        </div>

                        {message && (
                            <p className="mt-4 text-red-600 text-sm">{message}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Right side - Introduction */}
            <div className="flex-1 bg-yellow-600 flex items-center justify-center px-8">
                <div className="max-w-lg text-white">
                    <h1 className="text-5xl font-bold mb-8 leading-tight">
                        Elevate Your Climbing Game
                    </h1>

                    <div className="space-y-6 text-lg leading-relaxed">
                        <p>
                            Transform your climbing journey with personalized training routines designed specifically for your skill level and goals.
                        </p>

                        <p>
                            Our intelligent system analyzes your climbing profile and creates custom workout plans that target your weaknesses, build on your strengths, and push you toward your next breakthrough.
                        </p>

                        <p>
                            Whether you're a beginner learning the fundamentals or an advanced climber pushing your limits, Alk adapts to your progress and ensures every training session counts.
                        </p>


                    </div>
                </div>
            </div>
        </div>







    )
}