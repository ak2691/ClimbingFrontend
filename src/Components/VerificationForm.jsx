import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Mountain, Mail, Shield } from 'lucide-react';
import { useAuth } from "./AuthContext";
export default function VerificationForm() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const email = searchParams.get('email');
    const [verificationCode, setVerificationCode] = useState("");
    const [message, setMessage] = useState("");
    const { apiUrl } = useAuth();
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch(`${apiUrl}/api/verifyuser`, {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({
                    email: email,
                    verificationCode: verificationCode
                }),
                credentials: 'include'
            });

            if (res.ok) {
                // Redirect to login or dashboard
                window.location.href = "/login";
            } else {
                const err = await res.text();
                throw new Error(err);
            }
        } catch (e) {
            setMessage("Verification failed: " + e.message);
        }
    };

    const handleBackToLogin = () => {
        navigate('/login');
    };

    const handleResendCode = async () => {
        // You might want to implement a resend functionality in your backend
        setMessage("Resend functionality coming soon!");
    };

    return (
        <div className="min-h-screen flex">
            {/* Left side - Verification Form */}
            <div className="flex-1 bg-white flex items-center justify-center px-8">
                <div className="max-w-md w-full space-y-8">
                    {/* Logo */}
                    <div className="flex items-center mb-8">
                        <Mountain className="h-10 w-10 text-yellow-600 mr-3" />
                        <span className="text-2xl font-bold text-yellow-600">Allan</span>
                    </div>

                    {/* Verification Form */}
                    <div>
                        <div className="text-center mb-8">
                            <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                                <Mail className="h-8 w-8 text-yellow-600" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">Check Your Email</h2>
                            <p className="text-gray-600">
                                We sent a verification code to
                            </p>
                            <p className="font-semibold text-gray-900 mt-1">
                                {email}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                                    Verification Code
                                </label>
                                <input
                                    type="text"
                                    name="code"
                                    id="code"
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value)}
                                    maxLength={6}
                                    placeholder="Enter 6-digit code"
                                    className="w-full px-3 py-3 text-center text-2xl font-mono tracking-widest border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                                    required
                                />
                                <p className="text-sm text-gray-500 mt-2 text-center">
                                    Code expires in 15 minutes
                                </p>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-colors duration-200 font-medium"
                            >
                                Verify Account
                            </button>

                            {/* Additional Actions */}
                            <div className="space-y-3">
                                <button
                                    type="button"
                                    onClick={handleResendCode}
                                    className="w-full bg-white text-yellow-600 py-2 px-4 rounded-md border-2 border-yellow-600 hover:bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-colors duration-200 font-medium"
                                >
                                    Resend Code
                                </button>

                                <div className="text-center">
                                    <button
                                        type="button"
                                        onClick={handleBackToLogin}
                                        className="text-sm text-gray-600 hover:text-yellow-600 transition-colors duration-200"
                                    >
                                        Back to Login
                                    </button>
                                </div>
                            </div>
                        </form>

                        {message && (
                            <div className={`mt-4 p-3 rounded-md ${message.includes('failed')
                                ? 'bg-red-50 text-red-600 border border-red-200'
                                : 'bg-yellow-50 text-yellow-600 border border-yellow-200'
                                }`}>
                                <p className="text-sm">{message}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Right side - Information */}
            <div className="flex-1 bg-yellow-600 flex items-center justify-center px-8">
                <div className="max-w-lg text-white">
                    <div className="text-center mb-8">
                        <div className="mx-auto w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-6">
                            <Shield className="h-10 w-10 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold mb-4">
                            Secure Your Account
                        </h1>
                    </div>

                    <div className="space-y-6 text-lg leading-relaxed">
                        <p>
                            Email verification helps us ensure that your account is protected.
                        </p>


                        <div className="bg-white bg-opacity-10 rounded-lg p-6 mt-8">
                            <h3 className="text-xl font-semibold mb-3">What's Next?</h3>
                            <ul className="space-y-2 text-base">
                                <li className="flex items-center">
                                    <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                                    Complete your climbing profile
                                </li>
                                <li className="flex items-center">
                                    <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                                    Start tracking your progress
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}