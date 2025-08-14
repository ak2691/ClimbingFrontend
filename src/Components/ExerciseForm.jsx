import { useState, useEffect, useMemo, useRef } from "react";
import { useQuill } from 'react-quilljs';
import { AuthFetch } from "./AuthFetch";
import 'quill/dist/quill.snow.css';
export default function ExerciseForm() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
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



                const range = quill.getSelection();
                quill.insertEmbed(range.index, 'image', imageUrl);
            }
        };
    };


    useEffect(() => {
        if (quill) {
            quill.getModule('toolbar').addHandler('image', imageHandler);
        }
    }, [quill]);
    useEffect(() => {
        if (quill) {
            quill.on('text-change', (delta, oldDelta, source) => {
                setDescription(quill.root.innerHTML);
            })
        }
    }, [quill])
    const uploadImage = async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const res = await AuthFetch('http://localhost:8080/api/images/upload', {
            method: 'POST',
            body: formData,
            credentials: 'include'
        });
        const imageUrl = await res.text();
        return imageUrl;
    }

    const handleSave = async () => {
        const exerciseData = {
            name,
            description
        };
        try {
            const response = await AuthFetch('http://localhost:8080/api/exercise-requests/request', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(exerciseData),
                credentials: 'include'
            });
            if (!response.ok) {
                const res = await response.json();
                throw new Error(res.message);
            }
            if (response.ok) {
                const savedExercise = await response.json();
                console.log('Exercise saved:', savedExercise);
                setName('');
                setDescription('');
                setMessage("Successfully requested!");

            }
        } catch (e) {
            console.log(e);
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
                        value={name}
                        onChange={(e) => setName(e.target.value)}
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
