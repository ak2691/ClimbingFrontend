import { useState } from 'react';
import { useEffect } from 'react';
import { ChevronDown, ChevronUp, User, TrendingUp, List } from 'lucide-react';
import { AuthFetch } from './AuthFetch';
export default function UserProfile() {
    const [username, setUsername] = useState("");
    const [userprofile, setUserprofile] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedRoutine, setSelectedRoutine] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [newRoutineName, setNewRoutineName] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [exerciseToDelete, setExerciseToDelete] = useState(null);
    const [showDeleteRoutineConfirm, setShowDeleteRoutineConfirm] = useState(false);
    useEffect(() => {
        const jwt = localStorage.getItem('jwtToken');
        const fetchUserProfile = async () => {
            try {
                setLoading(true);
                const res = await AuthFetch("http://localhost:8080/api/profile", {
                    method: 'POST',
                    headers: { 'content-type': 'text/plain' },
                    body: jwt,
                    credentials: 'include'
                });
                if (!res.ok) {
                    const err = await res.json();
                    throw new Error(err.message);
                }
                const profile = await res.json();
                setUserprofile(profile);

            } catch (e) {

                setError(e.message);
            } finally {
                setLoading(false);
            }
        }
        fetchUserProfile();
    }, [])
    const nameRoutine = async (e) => {
        e.preventDefault();
        if (newRoutineName.trim()) {

            setShowEditPopup(false);
        }
        const formData = { ...selectedRoutine, routine_name: newRoutineName };
        try {
            const res = await AuthFetch("http://localhost:8080/api/editroutine", {
                method: 'PUT',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(formData),
                credentials: 'include'
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message);
            }
            setSelectedRoutine({ ...selectedRoutine, routine_name: newRoutineName })
            setUserprofile({ ...userprofile, routines: userprofile.routines.map(routine => routine.routine_id === selectedRoutine.routine_id ? { ...routine, routine_name: newRoutineName } : routine) });


        } catch (e) {
            setError("Something went terribly wrong!!!" + e.message);
        }
    }
    const handleEditClick = () => {
        setNewRoutineName(selectedRoutine.routine_name);
        setShowEditPopup(true);
    };
    const handleCancel = () => {
        setShowEditPopup(false);
        setNewRoutineName('');
    };
    const handleRoutineSelect = (routine) => {
        setSelectedRoutine(selectedRoutine?.routine_id === routine.routine_id ? null : routine);
        setIsDropdownOpen(false);
    };
    const handleDeleteClick = (exercise_id, idx) => {
        setExerciseToDelete({ exercise_id, idx });
        setShowDeleteConfirm(true);
    };
    const cancelDelete = () => {
        setShowDeleteConfirm(false);
        setExerciseToDelete(null);
    };
    const handleDelete = async () => {

        const formData = { ...selectedRoutine, exerciseList: selectedRoutine.exerciseList.filter((exercise) => exercise.exercise_id !== exerciseToDelete.exercise_id) };
        try {
            const res = await AuthFetch("http://localhost:8080/api/editroutine", {
                method: 'PUT',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(formData),
                credentials: 'include'
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message);
            }
            setSelectedRoutine(formData)
            setUserprofile({ ...userprofile, routines: userprofile.routines.map(routine => routine.routine_id === selectedRoutine.routine_id ? formData : routine) });
            setShowDeleteConfirm(false);
            setExerciseToDelete(null);

        } catch (e) {
            setError("Something went terribly wrong!!!" + e.message);
        }
    }
    const handleDeleteRoutine = () => {
        setShowDeleteRoutineConfirm(true);
    };

    const confirmDeleteRoutine = async () => {

        try {
            const res = await AuthFetch("http://localhost:8080/api/deleteroutine", {
                method: 'DELETE',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(selectedRoutine),
                credentials: 'include'
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message);
            }

            setUserprofile({ ...userprofile, routines: userprofile.routines.filter(routine => routine.routine_id !== selectedRoutine.routine_id) });
            setSelectedRoutine(null);
            setShowDeleteRoutineConfirm(false);
            setShowEditPopup(false);

        } catch (e) {
            setError("Something went terribly wrong!!!" + e.message);
        }

    };

    const cancelDeleteRoutine = () => {
        setShowDeleteRoutineConfirm(false);
    };
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!userprofile) return <div>User not found</div>;
    return (
        <div className="min-h-screen bg-gradient-to-br from-white to-amber-50 p-6 font-inter">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full mb-4">
                        <User className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
                        Welcome back, {userprofile.username}!
                    </h1>
                </div>

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Stats Section - Left Side */}
                    <div className="bg-white rounded-xl shadow-lg border border-amber-100 p-6">
                        <div className="flex items-center mb-6">
                            <TrendingUp className="w-6 h-6 text-amber-600 mr-3" />
                            <h2 className="text-2xl font-semibold text-gray-800">Your Stats</h2>
                        </div>

                        <div className="space-y-4">
                            {/* Physical Stats */}
                            <div className="bg-gradient-to-r from-amber-50 to-white rounded-lg p-4 border border-amber-100">
                                <h3 className="font-semibold text-amber-800 mb-3">Physical</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-gray-800">{userprofile.weightLb}</div>
                                        <div className="text-sm text-gray-600">Weight (lb)</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-gray-800">{userprofile.heightIn}"</div>
                                        <div className="text-sm text-gray-600">Height</div>
                                    </div>
                                </div>
                            </div>

                            {/* Climbing Grades */}
                            <div className="bg-gradient-to-r from-amber-50 to-white rounded-lg p-4 border border-amber-100">
                                <h3 className="font-semibold text-amber-800 mb-3">Climbing Grades</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-700">Vertical</span>
                                        <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-semibold">
                                            V{userprofile.verticalGrade}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-700">Overhang</span>
                                        <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-semibold">
                                            V{userprofile.overhangGrade}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-700">Slab</span>
                                        <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-semibold">
                                            V{userprofile.slabGrade}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Strength Grades */}
                            <div className="bg-gradient-to-r from-amber-50 to-white rounded-lg p-4 border border-amber-100">
                                <h3 className="font-semibold text-amber-800 mb-3">Strength</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-700">Finger Strength</span>
                                        <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-semibold">
                                            V{userprofile.fingerStrengthGrade}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-700">Pulling Strength</span>
                                        <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-semibold">
                                            V{userprofile.pullingStrengthGrade}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Routines Section - Right Side */}
                    <div className="bg-white rounded-xl shadow-lg border border-amber-100 p-6">
                        <div className="flex items-center mb-6">
                            <List className="w-6 h-6 text-amber-600 mr-3" />
                            <h2 className="text-2xl font-semibold text-gray-800">Training Routines</h2>
                        </div>

                        {userprofile.routines.length > 0 ? (
                            <div className="space-y-4">
                                {/* Dropdown */}
                                <div className="relative">
                                    <button
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-between transition-all duration-200 shadow-md hover:shadow-lg"
                                    >
                                        <span>
                                            {selectedRoutine ? selectedRoutine.name : 'Select a routine'}
                                        </span>
                                        {isDropdownOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                    </button>

                                    {isDropdownOpen && (
                                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-amber-200 rounded-lg shadow-xl z-10">
                                            {userprofile.routines.map((routine) => (
                                                <button
                                                    key={routine.id}
                                                    onClick={() => handleRoutineSelect(routine)}
                                                    className="w-full text-left px-4 py-3 hover:bg-amber-50 transition-colors duration-150 border-b border-amber-100 last:border-b-0 first:rounded-t-lg last:rounded-b-lg"
                                                >
                                                    <div className="font-medium text-gray-800">{routine.routine_name}</div>
                                                    <div className="text-sm text-gray-600">{routine.exerciseList.length} exercises</div>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Selected Routine Details */}
                                {selectedRoutine && (
                                    <div className="bg-gradient-to-r from-amber-50 to-white rounded-lg p-6 border border-amber-200 mt-4">
                                        <h3 className="text-xl font-semibold text-amber-800 mb-4">
                                            {selectedRoutine.routine_name}
                                            <span>
                                                <button
                                                    onClick={handleEditClick}
                                                    className="ml-3 px-3 py-1 bg-amber-200 hover:bg-amber-300 text-amber-800 rounded-md text-sm font-medium transition-colors"
                                                >
                                                    Edit
                                                </button>
                                            </span>
                                        </h3>
                                        <div className="space-y-3">
                                            {selectedRoutine.exerciseList.map((exercise, idx) => (
                                                <div key={idx} className="bg-white rounded-lg p-4 border border-amber-100 shadow-sm relative">
                                                    <button
                                                        onClick={() => handleDeleteClick(exercise.exercise_id, idx)}
                                                        className="absolute top-3 right-3 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                                                        title="Delete exercise"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                            />
                                                        </svg>
                                                    </button>
                                                    <div className="font-medium text-gray-800 mb-1 pr-8">
                                                        {exercise.name} - {exercise.exercise_id}
                                                    </div>
                                                    <div className="text-sm text-gray-600 pr-8">
                                                        {exercise.description}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Delete Confirmation Modal */}
                                {showDeleteConfirm && (
                                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                                        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 border border-amber-200">
                                            <div className="flex items-center mb-4">
                                                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center mr-3">
                                                    <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
                                                        />
                                                    </svg>
                                                </div>
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    Confirm Deletion
                                                </h3>
                                            </div>

                                            <p className="text-gray-600 mb-6">
                                                Are you sure you want to delete this exercise? This action cannot be undone.
                                            </p>

                                            <div className="flex justify-end space-x-3">
                                                <button
                                                    onClick={cancelDelete}
                                                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md font-medium transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={handleDelete}
                                                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md font-medium transition-colors"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {showEditPopup && (
                                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40">
                                        <div className="bg-white rounded-lg p-6 w-96 max-w-md mx-4 relative">
                                            {/* Delete routine button in top right */}
                                            <button
                                                onClick={handleDeleteRoutine}
                                                className="absolute top-4 right-4 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                                                title="Delete routine"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                    />
                                                </svg>
                                            </button>

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
                                                    onClick={nameRoutine}
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

                                {/* Delete Routine Confirmation Modal */}
                                {showDeleteRoutineConfirm && (
                                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                                        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 border border-red-200">
                                            <div className="flex items-center mb-4">
                                                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                                                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
                                                        />
                                                    </svg>
                                                </div>
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    Delete Routine
                                                </h3>
                                            </div>

                                            <p className="text-gray-600 mb-2">
                                                Are you sure you want to delete <span className="font-semibold">"{newRoutineName}"</span>?
                                            </p>
                                            <p className="text-gray-600 mb-6">
                                                This will permanently delete the routine and all its exercises. This action cannot be undone.
                                            </p>

                                            <div className="flex justify-end space-x-3">
                                                <button
                                                    onClick={cancelDeleteRoutine}
                                                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md font-medium transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={confirmDeleteRoutine}
                                                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md font-medium transition-colors"
                                                >
                                                    Delete Routine
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {!selectedRoutine && (
                                    <div className="text-center py-8 text-gray-500">
                                        <List className="w-12 h-12 mx-auto mb-3 text-amber-300" />
                                        <p>Select a routine above to view exercises</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <List className="w-12 h-12 mx-auto mb-3 text-amber-300" />
                                <p>No routines available</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>


    )
}