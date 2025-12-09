import { useState } from "react";
import { Mountain } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
export default function RegisterForm() {
    const [form, setForm] = useState({ email: "", username: "", password: "" })
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const { apiUrl } = useAuth();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = {
            email: form.email,
            username: form.username,
            password: form.password
        };
        try {
            const res = await fetch(`${apiUrl}/api/register`, {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(formData),
                credentials: 'include'
            });

            if (res.ok) {
                const data = await res.text();
                // Redirect to verification page with email
                window.location.href = `/verify?email=${encodeURIComponent(data)}`;
            } else {
                const err = await res.json();
                throw new Error(err.message);
            }
        } catch (e) {
            setMessage("Register failed: " + e.message);
        }
    }

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleLoginClick = () => {
        navigate('/login');
    }

    return (
        <div className="min-h-screen flex">
            {/* Left side - Introduction */}
            <div className="flex-1 bg-yellow-600 flex items-center justify-center px-8">
                <div className="max-w-lg text-white">
                    <h1 className="text-5xl font-bold mb-8 leading-tight">
                        Start Your Climbing Journey
                    </h1>

                    <div className="space-y-6 text-lg leading-relaxed">


                        <p>
                            Create your profile today and discover training plans tailored to your current skill level, preferred climbing style, and ambitious goals.
                        </p>

                        <p>
                            From your first hold to your hardest send, Alk will be there to guide your progress every step of the way.
                        </p>


                    </div>
                </div>
            </div>

            {/* Right side - Register Form */}
            <div className="flex-1 bg-white flex items-center justify-center px-8">
                <div className="max-w-md w-full space-y-8">
                    {/* Logo */}
                    <div className="flex items-center mb-8">
                        <Mountain className="h-10 w-10 text-yellow-600 mr-3" />
                        <span className="text-2xl font-bold text-yellow-600">Alk</span>
                    </div>

                    {/* Register Form */}
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-8">Create Account</h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    onChange={handleChange}
                                    value={form.email}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                                    required
                                />
                            </div>

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
                                type="submit"
                                className="w-full bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-colors duration-200 font-medium"
                            >
                                Create Account
                            </button>

                            {/* Login Section */}
                            <div className="text-center">
                                <p className="text-sm text-gray-600 mb-3">
                                    Already have an account?
                                </p>
                                <button
                                    type="button"
                                    onClick={handleLoginClick}
                                    className="w-full bg-white text-yellow-600 py-2 px-4 rounded-md border-2 border-yellow-600 hover:bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-colors duration-200 font-medium"
                                >
                                    Sign In
                                </button>
                            </div>
                        </form>

                        {message && (
                            <p className="mt-4 text-red-600 text-sm">{message}</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}