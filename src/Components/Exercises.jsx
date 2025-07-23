import { useState, useMemo } from "react";
import { useEffect } from "react";
import { AuthFetch } from "./AuthFetch";
export default function Exercises() {
    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const exercisesPerPage = 10;
    useEffect(() => {
        const fetchExercises = async () => {
            setLoading(true);
            try {
                const res = await AuthFetch("http://localhost:8080/api/exercises", {
                    method: 'GET',
                    headers: { 'content-type': 'application/json' },
                    credentials: 'include'
                });
                if (!res.ok) {
                    const err = await res.json();
                    throw new Error(err.message);
                }
                const data = await res.json();
                setExercises(data);

            } catch (e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }


        }
        fetchExercises();


    }, [])
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentPage]);
    const filteredExercises = useMemo(() => {
        if (!searchQuery || searchQuery.trim() === '') return exercises;

        const query = searchQuery.toLowerCase().trim();
        return exercises.filter(exercise =>
            exercise.name.toLowerCase().includes(query) ||
            exercise.description.toLowerCase().includes(query)
        );
    }, [searchQuery, exercises]);

    const totalPages = Math.max(1, Math.ceil(filteredExercises.length / exercisesPerPage));
    const startIndex = (currentPage - 1) * exercisesPerPage;
    const currentExercises = filteredExercises.slice(startIndex, startIndex + exercisesPerPage);

    const visiblePages = useMemo(() => {
        let startPage, endPage;

        if (totalPages <= 3) {
            startPage = 1;
            endPage = totalPages;
        } else {
            if (currentPage <= 2) {
                startPage = 1;
                endPage = 3;
            } else if (currentPage >= totalPages - 1) {
                startPage = totalPages - 2;
                endPage = totalPages;
            } else {
                startPage = currentPage - 1;
                endPage = currentPage + 1;
            }
        }

        return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
    }, [currentPage, totalPages]);
    const goToPage = (page) => {
        setCurrentPage(page);
        // Smooth scroll to top when changing pages

    };

    const nextPage = () => {
        if (currentPage < totalPages) goToPage(currentPage + 1);
    };

    const prevPage = () => {
        if (currentPage > 1) goToPage(currentPage - 1);
    };
    const clearSearch = () => {
        setSearchQuery('');
    };
    if (loading) return <div>loading...</div>
    if (error) return <div>Error: {error}</div>

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-amber-50 to-yellow-100 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-600 via-amber-500 to-yellow-700 bg-clip-text text-transparent mb-4">
                        Movement Catalogue
                    </h1>
                    <div className="w-32 h-1 bg-gradient-to-r from-yellow-400 to-amber-600 mx-auto rounded-full"></div>
                    <p className="text-gray-600 mt-6 text-lg max-w-2xl mx-auto">
                        Discover a comprehensive collection of fundamental exercises designed to strengthen, condition, and enhance your physical performance.
                    </p>
                </div>

                {/* Search Bar */}
                <div className="max-w-2xl mx-auto mb-8">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search exercises by name or description..."
                            className="w-full pl-12 pr-12 py-4 text-gray-700 bg-white border-2 border-yellow-200 rounded-2xl 
                       focus:border-yellow-400 focus:ring-4 focus:ring-yellow-200 focus:outline-none
                       transition-all duration-200 shadow-lg placeholder-gray-400 text-lg"
                        />
                        {searchQuery && (
                            <button
                                onClick={clearSearch}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-yellow-600 hover:text-yellow-800 transition-colors duration-200"
                            >
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>

                {/* Search Results Info */}
                <div className="text-center mb-8">
                    {searchQuery ? (
                        <div className="text-yellow-600 font-medium">
                            {filteredExercises.length === 0 ? (
                                <span className="text-gray-500">No exercises found for "{searchQuery}"</span>
                            ) : (
                                <>
                                    Found {filteredExercises.length} exercise{filteredExercises.length !== 1 ? 's' : ''}
                                    {filteredExercises.length > exercisesPerPage && (
                                        <> • Page {currentPage} of {totalPages}</>
                                    )}
                                    <button
                                        onClick={clearSearch}
                                        className="ml-3 text-sm bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full hover:bg-yellow-200 transition-colors duration-200"
                                    >
                                        Clear search
                                    </button>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="text-yellow-600 font-medium">
                            Page {currentPage} of {totalPages} • {exercises.length} total exercises
                        </div>
                    )}
                </div>

                {/* No Results Message */}
                {filteredExercises.length === 0 && searchQuery && (
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-bold text-gray-600 mb-2">No exercises found</h3>
                        <p className="text-gray-500 mb-6">Try searching for different keywords or check your spelling</p>
                        <button
                            onClick={clearSearch}
                            className="bg-gradient-to-r from-yellow-400 to-amber-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200"
                        >
                            Show all exercises
                        </button>
                    </div>
                )}

                {/* Exercise Grid */}
                {filteredExercises.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[600px]">
                        {currentExercises.map((exercise, idx) => {
                            // Calculate original index for numbering
                            const originalIndex = exercises.findIndex(ex => ex.name === exercise.name);

                            return (
                                <div
                                    key={originalIndex}
                                    className="group relative bg-white rounded-2xl p-6 shadow-lg border border-yellow-200 
                           hover:shadow-2xl hover:-translate-y-2 hover:border-yellow-400 
                           transition-all duration-300 ease-out cursor-pointer
                           before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br 
                           before:from-yellow-400/10 before:to-amber-500/10 before:opacity-0 
                           hover:before:opacity-100 before:transition-opacity before:duration-300"
                                >
                                    {/* Golden accent bar */}
                                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 rounded-t-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>

                                    {/* Exercise number badge - shows original index */}
                                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-full flex items-center justify-center shadow-lg">
                                        <span className="text-white font-bold text-sm">{originalIndex + 1}</span>
                                    </div>

                                    {/* Content */}
                                    <div className="relative z-10">
                                        <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-yellow-700 transition-colors duration-200">
                                            {exercise.name}
                                        </h3>

                                        <p className="text-gray-600 text-sm leading-relaxed group-hover:text-gray-700 transition-colors duration-200">
                                            {exercise.description}
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
                            );
                        })}
                    </div>
                )}

                {/* Pagination Controls - only show if there are results and multiple pages */}
                {filteredExercises.length > 0 && totalPages > 1 && (
                    <div className="flex justify-center items-center mt-12 space-x-4">
                        {/* Previous Button */}
                        <button
                            onClick={prevPage}
                            disabled={currentPage === 1}
                            className="px-4 py-2 rounded-xl bg-white border border-yellow-300 text-yellow-700 font-medium
                       hover:bg-yellow-50 hover:border-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed
                       disabled:hover:bg-white disabled:hover:border-yellow-300 transition-all duration-200
                       shadow-sm hover:shadow-md"
                        >
                            ← Previous
                        </button>

                        {/* Page Numbers */}
                        <div className="flex space-x-2">
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => goToPage(i + 1)}
                                    className={`w-10 h-10 rounded-xl font-bold transition-all duration-200 shadow-sm hover:shadow-md
                    ${currentPage === i + 1
                                            ? 'bg-gradient-to-br from-yellow-400 to-amber-600 text-white shadow-lg'
                                            : 'bg-white border border-yellow-300 text-yellow-700 hover:bg-yellow-50 hover:border-yellow-400'
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>

                        {/* Next Button */}
                        <button
                            onClick={nextPage}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 rounded-xl bg-white border border-yellow-300 text-yellow-700 font-medium
                       hover:bg-yellow-50 hover:border-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed
                       disabled:hover:bg-white disabled:hover:border-yellow-300 transition-all duration-200
                       shadow-sm hover:shadow-md"
                        >
                            Next →
                        </button>
                    </div>
                )}

                {/* Footer */}
                <div className="text-center mt-16">
                    <div className="w-16 h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent mx-auto mb-4"></div>
                    <p className="text-gray-500 text-sm">
                        Build strength • Enhance performance • Transform your body
                    </p>
                </div>
            </div>
        </div>
    )
}