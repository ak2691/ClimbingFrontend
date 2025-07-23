import { useState } from "react";
import { Mountain } from 'lucide-react';
import { AuthFetch } from "./AuthFetch";
export default function LoginForm() {
    const [form, setForm] = useState({ username: "", password: "" })
    const [message, setMessage] = useState("");




    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = {
            username: form.username,
            password: form.password


        }
        try {
            const res = await AuthFetch("http://localhost:8080/api/login", {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(formData),
                credentials: 'include'

            });

            if (res.ok) {
                const jwtResponse = await res.json();


                localStorage.setItem('jwtToken', jwtResponse.token);

                window.location.href = "/profile";
                setMessage("Login successful!");
            }
            else if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message);
            }
        } catch (e) {
            setMessage("Login failed: " + e.message);
        }


    }
    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }
    return (
        <div className="min-h-screen flex">
            {/* Left side - Login Form */}
            <div className="flex-1 bg-white flex items-center justify-center px-8">
                <div className="max-w-md w-full space-y-8">
                    {/* Logo */}
                    <div className="flex items-center mb-8">
                        <Mountain className="h-10 w-10 text-yellow-600 mr-3" />
                        <span className="text-2xl font-bold text-yellow-600">Allan</span>
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
                        </div>

                        {message && (
                            <p className="mt-4 text-red-600 text-sm">Error: {message}</p>
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
                            Whether you're a beginner learning the fundamentals or an advanced climber pushing your limits, Allan adapts to your progress and ensures every training session counts.
                        </p>

                        <div className="mt-8">
                            <p className="text-yellow-100 text-base italic">
                                "The difference between a good climber and a great climber isn't just talent—it's the right training at the right time."
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>







    )
}