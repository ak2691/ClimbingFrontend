import React, { useState } from 'react';
import { TrendingUp, Edit3, X, Check } from 'lucide-react';

export default function StatsComponent({ user, editProfile }) {
    // Sample user profile data
    const [userprofile, setUserprofile] = useState(user);

    // Edit state
    const [showEditValue, setShowEditValue] = useState(false);
    const [editingField, setEditingField] = useState(null);
    const [editValue, setEditValue] = useState('');
    const [editLabel, setEditLabel] = useState('');

    const handleEditClick = (field, currentValue, label) => {
        setEditingField(field);
        setEditValue(currentValue.toString());
        setEditLabel(label);
        setShowEditValue(true);
    };

    const handleSave = () => {
        const numericValue = parseInt(editValue);

        // Validation based on field type
        let isValid = false;
        if (editingField?.includes('Grade')) {
            isValid = !isNaN(numericValue) && numericValue >= 0 && numericValue <= 17;
        } else if (editingField === 'heightIn') {
            isValid = !isNaN(numericValue) && numericValue >= 42 && numericValue <= 84;
        } else if (editingField === 'weightLb') {
            isValid = !isNaN(numericValue) && numericValue >= 60;
        }

        if (isValid) {
            const formData = { ...userprofile, [editingField]: numericValue };
            setUserprofile(prev => ({
                ...prev,
                [editingField]: numericValue
            }));
            editProfile(formData);
            handleCancel();
        } else {

            alert('Please enter a valid value within the allowed range');
        }
    };

    const handleCancel = () => {
        setShowEditValue(false);
        setEditingField(null);
        setEditValue('');
        setEditLabel('');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSave();
        } else if (e.key === 'Escape') {
            handleCancel();
        }
    };

    return (
        <div className="relative">
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
                                <button
                                    onClick={() => handleEditClick('weightLb', userprofile.weightLb, 'Weight (lb) 60 min')}
                                    className="group hover:bg-amber-50 rounded px-2 py-1 transition-colors"
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        <span className="text-2xl font-bold text-gray-800">{userprofile.weightLb}</span>
                                        <Edit3 className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </button>
                                <div className="text-sm text-gray-600">Weight (lb)</div>
                            </div>
                            <div className="text-center">
                                <button
                                    onClick={() => handleEditClick('heightIn', userprofile.heightIn, 'Height (inches) 42-84')}
                                    className="group hover:bg-amber-50 rounded px-2 py-1 transition-colors"
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        <span className="text-2xl font-bold text-gray-800">{userprofile.heightIn}"</span>
                                        <Edit3 className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </button>
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
                                <button
                                    onClick={() => handleEditClick('verticalGrade', userprofile.verticalGrade, 'Vertical Grade 0-17')}
                                    className="group bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-semibold hover:bg-amber-200 transition-colors flex items-center gap-1"
                                >
                                    V{userprofile.verticalGrade}
                                    <Edit3 className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-700">Overhang</span>
                                <button
                                    onClick={() => handleEditClick('overhangGrade', userprofile.overhangGrade, 'Overhang Grade 0-17')}
                                    className="group bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-semibold hover:bg-amber-200 transition-colors flex items-center gap-1"
                                >
                                    V{userprofile.overhangGrade}
                                    <Edit3 className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-700">Slab</span>
                                <button
                                    onClick={() => handleEditClick('slabGrade', userprofile.slabGrade, 'Slab Grade 0-17')}
                                    className="group bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-semibold hover:bg-amber-200 transition-colors flex items-center gap-1"
                                >
                                    V{userprofile.slabGrade}
                                    <Edit3 className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Strength Grades */}
                    <div className="bg-gradient-to-r from-amber-50 to-white rounded-lg p-4 border border-amber-100">
                        <h3 className="font-semibold text-amber-800 mb-3">Strength</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-700">Finger Strength</span>
                                <button
                                    onClick={() => handleEditClick('fingerStrengthGrade', userprofile.fingerStrengthGrade, 'Finger Strength Grade')}
                                    className="group bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-semibold hover:bg-amber-200 transition-colors flex items-center gap-1"
                                >
                                    V{userprofile.fingerStrengthGrade}
                                    <Edit3 className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-700">Pulling Strength</span>
                                <button
                                    onClick={() => handleEditClick('pullingStrengthGrade', userprofile.pullingStrengthGrade, 'Pulling Strength Grade')}
                                    className="group bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-semibold hover:bg-amber-200 transition-colors flex items-center gap-1"
                                >
                                    V{userprofile.pullingStrengthGrade}
                                    <Edit3 className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Popup Modal */}
            {showEditValue && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-80 shadow-xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">Edit {editLabel}</h3>
                            <button
                                onClick={handleCancel}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                New Value
                            </label>
                            <input
                                type="number"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onKeyDown={handleKeyPress}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                placeholder="Enter numeric value"
                                autoFocus
                                min={editingField?.includes('Grade') ? '0' : editingField === 'heightIn' ? '42' : '60'}
                                max={editingField?.includes('Grade') ? '17' : editingField === 'heightIn' ? '84' : undefined}
                                step="1"
                            />
                        </div>

                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={handleCancel}
                                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors flex items-center gap-2"
                            >
                                <Check className="w-4 h-4" />
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

