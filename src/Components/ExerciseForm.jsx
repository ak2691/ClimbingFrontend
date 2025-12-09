import { useState, useEffect, useMemo, useRef } from "react";
import { useQuill } from 'react-quilljs';
import { AuthFetch, useAuth } from "./AuthContext";
import 'quill/dist/quill.snow.css';
export default function ExerciseForm({ formData, setFormData }) {

    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const { apiUrl } = useAuth();
    const { quill, quillRef } = useQuill({
        theme: 'snow',
        modules: {
            toolbar: {
                container: [
                    ['bold', 'italic', 'underline'],
                    ['image'],
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }]
                ],
            }
        },
        placeholder: 'Start typing...'
    });
    const imageHandler = () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            const file = input.files[0];
            if (file) {
                const imageUrl = await uploadImage(file);

                if (imageUrl) {
                    const range = quill.getSelection();
                    quill.insertEmbed(range.index, 'image', imageUrl);
                }


            }
        };
    };


    useEffect(() => {
        if (quill) {
            quill.getModule('toolbar').addHandler('image', imageHandler);
            quill.clipboard.dangerouslyPasteHTML(formData.description);
        }

    }, [quill]);
    useEffect(() => {
        if (quill) {
            quill.on('text-change', (delta, oldDelta, source) => {
                setFormData((prev) => ({ ...prev, description: quill.root.innerHTML }));
            })
        }
    }, [quill])
    const uploadImage = async (file) => {
        try {
            const formData = new FormData();
            const jwtToken = localStorage.getItem('accessToken');
            formData.append('file', file);
            formData.append('token', jwtToken);

            const res = await AuthFetch(`${apiUrl}/api/images/upload`, {
                method: 'POST',
                body: formData,
                credentials: 'include'
            });
            if (!res.ok) {
                const err = await res.text();
                throw new Error(err);
            }
            const imageUrl = await res.text();
            return imageUrl;
        } catch (e) {
            setError(e.message);
            return null;
        }

    }

    const handleSave = async () => {
        const exerciseData = {
            name: formData.name,
            description: formData.description
        };
        try {
            const response = await AuthFetch(`${apiUrl}/api/exercise-requests/request`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(exerciseData),
                credentials: 'include'
            });


            if (!response.ok) {
                const res = await response.text();
                throw new Error(res);
            }


            if (response.ok) {
                const savedExercise = await response.json();

                setFormData((prev) => ({ ...prev, name: '', description: '' }));

                if (quillRef.current) {
                    quill.setText('');
                    quill.setContents([]);
                }
                setMessage("Successfully requested!");

            }
        } catch (e) {

            setError(e.message);
        }

        if (error) return <p>{error}</p>;
    }
    return (
        <div className="p-8 bg-gradient-to-br from-amber-50 to-yellow-50 min-h-screen font-serif">
            <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg border border-amber-200 p-8">
                {/* Header */}
                <h2 className="text-2xl font-bold text-amber-800 mb-6 text-center">
                    Request New Exercise
                </h2>

                {/* Exercise Name Input */}
                <div className="mb-6">
                    <label className="block text-amber-700 text-sm font-semibold mb-2">
                        Exercise Name
                    </label>
                    <input
                        type="text"
                        placeholder="Enter exercise name..."
                        value={formData.name}
                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-3 border-2 border-amber-200 rounded-lg 
                     focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-200
                     bg-white text-amber-900 placeholder-amber-400
                     transition-all duration-200 hover:border-amber-300"
                    />
                </div>

                {/* Description Editor */}
                <div className="mb-6">
                    <label className="block text-amber-700 text-sm font-semibold mb-2">
                        Exercise Description
                    </label>
                    <div className="border-2 border-amber-200 rounded-lg overflow-hidden
                        focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-200
                        transition-all duration-200">
                        <div ref={quillRef}



                            className="bg-white [&_.ql-editor]:min-h-[150px] [&_.ql-toolbar]:bg-amber-50 
                       [&_.ql-toolbar]:border-amber-200 [&_.ql-editor]:text-amber-900"

                        ></div>
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-center">
                    <button
                        onClick={handleSave}
                        className="px-8 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 
                     text-white font-semibold rounded-lg shadow-md
                     hover:from-amber-600 hover:to-yellow-600 hover:shadow-lg
                     focus:outline-none focus:ring-4 focus:ring-amber-300
                     transform transition-all duration-200 hover:scale-105
                     active:scale-95"
                    >
                        Request Exercise
                    </button>
                </div>
                {message && (<p>Exercise request sent!</p>)}
                {error && (<p>{error}</p>)}
            </div>
        </div>
    )

}
