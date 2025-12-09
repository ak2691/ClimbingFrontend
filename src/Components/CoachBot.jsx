import { useState, useEffect } from "react";
import { AuthFetch, useAuth } from "./AuthContext";

export default function CoachBot() {
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [newRoutineName, setNewRoutineName] = useState('new_routine');
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const { apiUrl } = useAuth();

    useEffect(() => {
        const checkAuth = async () => {


            await AuthFetch(`${apiUrl}/api/validate`);



        };

        checkAuth();
    }, []);
    const handleSubmit = async () => {
        if (!prompt.trim()) return;
        const jwtToken = localStorage.getItem('accessToken');
        setIsLoading(true);
        try {
            const res = await AuthFetch(`${apiUrl}/api/gpt/chat`, {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ message: prompt, jwtToken: jwtToken }),
                credentials: 'include'
            });
            if (!res.ok) {
                const err = await res.text();
                throw new Error(err);
            }
            const result = await res.json();
            setResponse(result);

        } catch (e) {
            setResponse(e.message);
        } finally {
            setIsLoading(false);
        }
    }
    const saveRoutine = async () => {
        const jwtToken = localStorage.getItem('jwtToken');
        const savedroutine = { exerciseIds: response.map((exercise) => exercise.exercise_id), userId: null, routine_name: newRoutineName };
        try {
            const userId = await AuthFetch(`${apiUrl}/api/userid`, {
                method: 'POST',
                headers: { 'content-type': 'text/plain' },
                body: jwtToken,
                credentials: 'include'
            });
            if (!userId.ok) {
                const err = await userId.json();
                throw new Error(err.message);
            }
            const id = await userId.json();
            savedroutine.userId = parseInt(id);
            const res = await AuthFetch(`{apiUrl}/api/saveroutine`, {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(savedroutine),
                credentials: 'include'
            })
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message);
            }


            setMessage("Saved successfully!");
            setShowEditPopup(false);
        } catch (e) {
            setShowEditPopup(false);
            setError(e.message);
        }

    }
    const handleCancel = () => {
        setShowEditPopup(false);
    }

    return (
        <div className="min-h-screen bg-yellow-50 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl">
                {/* Chat Interface - Centered */}
                <div className="bg-white rounded-lg shadow-lg p-6 border border-yellow-200 mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">Exercise Generator</h1>
                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}

                            placeholder="Tell me your weaknesses! (or any fitness prompt)"
                            className="flex-1 px-4 py-3 border border-yellow-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                            disabled={isLoading}
                        />
                        <button
                            onClick={handleSubmit}
                            disabled={isLoading || !prompt.trim()}
                            className="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Generating..." : "Submit"}
                        </button>
                    </div>
                </div>

                {/* Exercise Results - Scrollable Grid */}
                {response && (
                    <div className="bg-white rounded-lg shadow-lg border border-yellow-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-800">Generated Routine</h2>
                            <button
                                onClick={() => setShowEditPopup(true)}
                                className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                title="Save routine"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                                    />
                                </svg>
                            </button>
                        </div>
                        <div className="max-h-96 overflow-y-auto pr-2 pt-4">
                            <div className="grid grid-cols-1 gap-6 pb-4">
                                {Array.isArray(response) ? (
                                    response.map((exercise, idx) => (
                                        <div
                                            key={idx}
                                            className="group relative bg-white rounded-2xl p-6 shadow-lg border border-yellow-200 
                                       hover:shadow-2xl hover:-translate-y-2 hover:border-yellow-400 
                                       transition-all duration-300 ease-out cursor-pointer
                                       before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br 
                                       before:from-yellow-400/10 before:to-amber-500/10 before:opacity-0 
                                       hover:before:opacity-100 before:transition-opacity before:duration-300"
                                        >
                                            {/* Golden accent bar */}
                                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 rounded-t-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>



                                            {/* Content */}
                                            <div className="relative z-10">
                                                <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-yellow-700 transition-colors duration-200">
                                                    {exercise.name || `Exercise ${idx + 1}`}
                                                </h3>

                                                <p className="text-gray-600 text-sm leading-relaxed group-hover:text-gray-700 transition-colors duration-200">
                                                    {exercise.description || 'No description available'}
                                                </p>

                                                {/* Decorative element */}
                                                <div className="mt-4 flex items-center space-x-2">
                                                    <div className="flex space-x-1">
                                                        {[...Array(3)].map((_, i) => (
                                                            <div
                                                                key={i}
                                                                className="w-2 h-2 rounded-full bg-yellow-300 opacity-60 group-hover:opacity-100 group-hover:bg-yellow-500 transition-all duration-200"
                                                                style={{ transitionDelay: `${i * 50}ms` }}
                                                            ></div>
                                                        ))}
                                                    </div>
                                                    <div className="flex-1 h-px bg-gradient-to-r from-yellow-300 to-transparent opacity-30 group-hover:opacity-60 transition-opacity duration-200"></div>
                                                </div>
                                            </div>

                                            {/* Subtle glow effect */}
                                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-yellow-400/0 via-amber-500/0 to-yellow-600/0 group-hover:from-yellow-400/5 group-hover:via-amber-500/5 group-hover:to-yellow-600/5 transition-all duration-300"></div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-full bg-red-50 border border-red-200 rounded-lg p-4">
                                        <p className="text-red-700">
                                            Error: Unable to display exercises.
                                        </p>
                                        <div className="mt-2">


                                            {response}

                                        </div>
                                    </div>
                                )}
                            </div>

                        </div>

                        {/* Exercise count indicator */}
                        <div className="mt-4 pt-4 border-t border-yellow-200">
                            <p className="text-sm text-gray-600 text-center">
                                {Array.isArray(response)
                                    ? `Showing ${response.length} exercise${response.length !== 1 ? 's' : ''}`
                                    : null
                                }
                            </p>
                        </div>
                        {message && (<p className="text-green-600 text-center mt-4">{message}</p>)}
                        {error && (<p className="text-red-600 text-center mt-4">Did not save successfully due to error: {error}</p>)}
                    </div>

                )}
                {showEditPopup && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40">
                        <div className="bg-white rounded-lg p-6 w-96 max-w-md mx-4 relative">


                            <h4 className="text-lg font-semibold text-gray-800 mb-4 pr-8">Edit Routine Name</h4>

                            <input
                                type="text"
                                value={newRoutineName}
                                onChange={(e) => setNewRoutineName(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                placeholder="Enter routine name"
                                autoFocus
                            />

                            <div className="flex gap-3 mt-4">
                                <button
                                    onClick={saveRoutine}
                                    className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded-md font-medium transition-colors"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {/* Loading state */}
                {isLoading && (
                    <div className="bg-white rounded-lg shadow-lg border border-yellow-200 p-8">
                        <div className="text-center">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mb-4"></div>
                            <p className="text-gray-600">Generating exercises...</p>
                        </div>
                    </div>
                )}

                {/* Empty state */}
                {!response && !isLoading && (
                    <div className="bg-white rounded-lg shadow-lg border border-yellow-200 p-8">
                        <div className="text-center text-gray-500">
                            <p className="text-lg mb-2">Ready to generate exercises!</p>
                            <p className="text-sm">Enter a prompt above to get started.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}