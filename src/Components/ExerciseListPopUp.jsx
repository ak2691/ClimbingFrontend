import { useState, useMemo } from 'react';
import { useEffect } from 'react';
import { ChevronDown, ChevronUp, User, TrendingUp, List, Plus, X } from 'lucide-react';
import { AuthFetch, useAuth } from './AuthContext';
export default function ExerciseListPopUp({ handleAddExercise, selectedRoutine, handleCancelExercisePopUp }) {

    const [exercises, setExercises] = useState([]);
    const [error, setError] = useState('');
    const { apiUrl } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedExercise, setSelectedExercise] = useState(null);
    useEffect(() => {
        const fetchExercises = async () => {
            try {
                const res = await AuthFetch(`${apiUrl}/api/exercises`, {
                    method: 'GET',
                    headers: { "content-type": "application/json" },
                    credentials: 'include'
                });
                if (!res.ok) {
                    const err = await res.json();
                    throw new Error(err.message)
                }
                const fetched = await res.json();
                const currentExerciseIds = selectedRoutine.exerciseList.map(ex => ex.exercise_id);

                setExercises(fetched.filter(ex => !currentExerciseIds.includes(ex.exercise_id)));
            } catch (e) {
                setError("Error:" + e.message);
            }

        }
        fetchExercises();
    }, [])
    const getAvailableExercises = () => {
        const currentExerciseIds = selectedRoutine.exerciseList.map(ex => ex.exercise_id);
        return filteredExercises.filter(ex => !currentExerciseIds.includes(ex.exercise_id));
    }
    const openModal = (exercise) => {
        setSelectedExercise(exercise);
    };

    const closeModal = () => {
        setSelectedExercise(null);
    };
    const filteredExercises = useMemo(() => {


        if (!searchQuery || searchQuery.trim() === '') return exercises;

        const query = searchQuery.toLowerCase().trim();
        return exercises.filter(exercise =>
            exercise.name.toLowerCase().includes(query) ||
            exercise.description.toLowerCase().includes(query)
        );
    }, [searchQuery, exercises]);

    if (error) return <p>{error}</p>;
    return (

        <div>
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-96 overflow-y-auto">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-800">Add Exercise</h2>
                        <button
                            onClick={handleCancelExercisePopUp}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Search exercises..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div className="space-y-3">
                        {getAvailableExercises().length === 0 ? (
                            <p className="text-gray-500 text-center py-4">
                                No exercises to add
                            </p>
                        ) : (
                            getAvailableExercises().map(exercise => (
                                <div
                                    key={exercise.id}
                                    className="border rounded-lg p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                                    onClick={() => openModal(exercise)}
                                >
                                    <h3 className="font-medium text-gray-800">{exercise.name}</h3>
                                    <p className="text-gray-600 text-sm mt-1"><i>Click to view details</i></p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
            {selectedExercise && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-2xl border border-yellow-200 relative">
                        {/* Header */}
                        <div className="bg-yellow-50 border-b border-yellow-100 p-6 relative">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <h2 className="text-2xl font-bold text-gray-800">{selectedExercise.name}</h2>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <button
                                        onClick={() => {
                                            handleAddExercise(selectedExercise);
                                            closeModal();
                                        }}
                                        className="bg-green-100 hover:bg-green-200 text-green-800 font-semibold py-2 px-4 rounded-lg transition-colors duration-200 border border-green-200 hover:border-green-300"
                                    >
                                        Add Exercise
                                    </button>
                                    <button
                                        onClick={closeModal}
                                        className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200"
                                    >
                                        <X className="w-5 h-5 text-gray-600" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
                            <div className="prose max-w-none">
                                {/* This div will contain your React Quill content */}
                                <div
                                    className="text-gray-700 leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: selectedExercise.description }}
                                />
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="border-t border-gray-100 p-4 bg-gray-50">
                            <button
                                onClick={closeModal}
                                className="w-full bg-yellow-100 hover:bg-yellow-200 text-yellow-800 font-semibold py-3 px-6 rounded-xl transition-all duration-200 border border-yellow-200 hover:border-yellow-300"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>

    )
}