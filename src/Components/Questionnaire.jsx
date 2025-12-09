
import { useState } from "react";
import { AuthFetch, useAuth } from "./AuthContext";
import ContinueButton from "../DesignComponents/ContinueButton"
import { Save } from 'lucide-react';

export default function Questionnaire() {
    const [selectedStyles, setSelectedStyles] = useState({
        crimps: 0,
        slopers: 0,
        compressions: 0,
        gastons: 0,
        presses: 0,
        pinches: 0,
        pockets: 0,
        underclings: 0,
        dynos: 0,
        slabs: 0
    });
    const [showSurvey, setShowSurvey] = useState(false);
    const [questions, setQuestions] = useState({});
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [message, setMessage] = useState("");
    const [surveyMessage, setSurveyMessage] = useState("");
    const [saveMessage, setSaveMessage] = useState("");
    const [finalResults, setFinalResults] = useState({});
    const [showRoutine, setShowRoutine] = useState(false);
    const { apiUrl } = useAuth();
    const handleSave = async () => {
        const jwtToken = localStorage.getItem('jwtToken');

        try {
            const userId = await AuthFetch(`${apiUrl}/api/userid`, {
                method: 'POST',
                headers: { 'content-type': 'text/plain' },
                body: jwtToken,
                credentials: 'include'
            });
            if (!userId.ok) {
                const error = await userId.text();
                throw new Error(error);
            }


            const id = await userId.json();
            const saveData = { exerciseIds: finalResults.exerciseList, userId: parseInt(id) };
            const res = await AuthFetch(`${apiUrl}/api/saveroutine`, {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(saveData),
                credentials: 'include'
            })
            if (!res.ok) {
                const err = await res.text();
                throw new Error(err);
            }
            setSaveMessage("Saved successfully!");
        } catch (e) {
            setSaveMessage(e.message);
            console.log(e.message);
        }
    }
    const toggleStyle = (style) => {
        setSelectedStyles(prev => ({
            ...prev,
            [style]: prev[style] === 0 ? 1 : 0
        }));
    };
    const styles = [
        { key: 'crimps', label: 'Crimps' },
        { key: 'slopers', label: 'Slopers' },
        { key: 'compressions', label: 'Compressions' },
        { key: 'gastons', label: 'Gastons' },
        { key: 'presses', label: 'Presses' },
        { key: 'pinches', label: 'Pinches' },
        { key: 'pockets', label: 'Pockets' },
        { key: 'underclings', label: 'Underclings' },
        { key: 'dynos', label: 'Dynos' },
        { key: 'slabs', label: 'Slabs' }
    ];

    const submitStyles = async () => {
        try {
            const res = await AuthFetch(`${apiUrl}/api/generatequestions`, {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(selectedStyles),
                credentials: 'include'
            })
            if (!res.ok) {
                const err = await res.text();
                console.log("error was found");
                throw new Error(err);
            }
            const response = await res.json();
            setQuestions((prev) => ({
                ...prev, ...Object.keys(response).reduce((acc, key) => {
                    acc[key] = response[key].answer_choices;
                    return acc;
                }, {})
            }));
            //{id : 0}
            let obj = {};
            Object.keys(response).map((key) => {
                response[key].answer_choices.map((answer) => obj[answer["answer_id"]] = 0);
            });

            setSelectedAnswers((prev) => ({ ...prev, ...obj }));



            setShowSurvey(true);
        } catch (e) {
            setMessage(e.message);
        }
    }

    const handleContinue = () => {
        let empty = true;
        Object.keys(selectedStyles).map(key => {
            if (selectedStyles[key] === 1) {
                empty = false;
            }

        });
        if (empty) {
            setMessage("Must select at least one style");
        }
        else {
            submitStyles();

        }
    }
    const handleAnswerSelect = (style, id) => {

        setSelectedAnswers((prev) => ({
            ...prev, ...questions[style].reduce((acc, answer) => {
                if (answer.answer_id === id) {
                    acc[answer.answer_id] = 1;
                }
                else {
                    acc[answer.answer_id] = 0;
                }
                return acc;
            },
                {})

        }));
    }
    const handleSurveySubmit = async () => {
        const jwtToken = localStorage.getItem('jwtToken');
        const data = {
            responses: [...Object.keys(selectedAnswers).filter((key) => {
                if (selectedAnswers[key]) {
                    return parseInt(key);
                }
            })],
            userId: 0

        }
        try {

            const res = await AuthFetch(`${apiUrl}/api/generateroutine`, {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(data),
                credentials: 'include'
            });
            if (!res.ok) {
                const err = await res.text();
                throw new Error(err);
            }
            const routine = await res.json();
            setFinalResults((prev) => ({ ...routine }));
            setShowRoutine(true);
            console.log(routine);
        } catch (e) {
            setSurveyMessage(e.message);
        }
    }

    /*
     Object.keys(questions).map(style => (<div><h3>{style}</h3>
                        <ul>
                            {questions[style].map(ac => (
                                <li key={ac.answer_id}>{ac.answer}</li>
                            ))}
                        </ul>

                    </div>

                    ))


    */

    if (message) return <div>{message}</div>
    return (
        <>
            <div>
                {!showSurvey ? (
                    <div className="max-w-2xl mx-auto p-6" style={{ fontFamily: 'Inter, sans-serif' }}>
                        <h2 className="text-2xl font-bold mb-6 text-center text-yellow-800">
                            Select the climbing styles you feel weak in
                        </h2>

                        <div className="mb-8">

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {styles.map((style) => (
                                    <div
                                        key={style.key}
                                        onClick={() => toggleStyle(style.key)}
                                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 ${selectedStyles[style.key] === 1
                                            ? 'border-yellow-400 bg-gradient-to-br from-yellow-50 to-yellow-100 shadow-lg'
                                            : 'border-gray-200 bg-white hover:border-yellow-300'
                                            }`}
                                    >
                                        <div className="text-center">
                                            <div className={`text-lg font-medium ${selectedStyles[style.key] === 1 ? 'text-yellow-700' : 'text-gray-700'
                                                }`}>
                                                {style.label}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <ContinueButton onClick={handleContinue} />
                    </div>
                ) : (
                    !showRoutine ? (
                        <div className="grid grid-cols-1 gap-6 mb-8">
                            {Object.keys(questions).map(style => (
                                <div
                                    key={style}
                                    className="w-full max-w-3xl mx-auto bg-white border-2 border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
                                >
                                    {/* Style name at the top center */}
                                    <h2 className="text-xl font-semibold text-center text-yellow-700 mb-6 pb-3 border-b-2 border-yellow-100">
                                        What do you feel weak about {style}?
                                    </h2>

                                    {/* Answer choices below */}
                                    <div className="space-y-3">
                                        {questions[style].map(answer => (
                                            <div
                                                key={answer.answer_id}
                                                onClick={() => handleAnswerSelect(style, answer.answer_id)}
                                                className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-300 hover:shadow-sm ${selectedAnswers[answer.answer_id] === 1
                                                    ? 'border-yellow-400 bg-gradient-to-r from-yellow-50 to-yellow-100 shadow-sm'
                                                    : 'border-gray-200 bg-gray-50 hover:border-yellow-300 hover:bg-yellow-50'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className={`text-sm font-medium ${selectedAnswers[answer.answer_id] === 1 ? 'text-yellow-700' : 'text-gray-700'
                                                        }`}>
                                                        {answer.answer}
                                                    </span>
                                                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedAnswers[answer.answer_id] === 1
                                                        ? 'border-yellow-400 bg-yellow-400'
                                                        : 'border-gray-300'
                                                        }`}>
                                                        {selectedAnswers[answer.answer_id] === 1 && (
                                                            <div className="w-2 h-2 bg-white rounded-full"></div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            <div className="text-center">
                                <button
                                    onClick={handleSurveySubmit}
                                    className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg"
                                >
                                    Submit
                                </button>
                            </div>
                            {surveyMessage && (<p>{surveyMessage}</p>)}
                        </div>
                    ) : (<div className="max-w-2xl mx-auto p-6 bg-gradient-to-br from-white via-amber-50 to-yellow-100 rounded-xl shadow-lg border border-yellow-200 relative">

                        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent">
                            Here is a generated routine for your weaknesses
                        </h2>


                        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-inner border border-yellow-300/50">
                            <ul className="space-y-3">
                                {finalResults.displayExercises.map((exercise, index) => (
                                    <li key={index} className="flex flex-col p-3 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg border border-yellow-200 hover:shadow-md transition-shadow">
                                        <span className="font-semibold text-gray-800 text-lg">{exercise.name}</span>
                                        <span className="text-gray-600 text-sm mt-1">{exercise.description}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>


                        <button
                            onClick={handleSave}
                            className="absolute bottom-4 right-4 flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 font-medium"
                        >
                            <Save size={18} />
                            Save
                        </button>
                        {saveMessage && (<p>{saveMessage}</p>)}
                    </div>)



                )

                }




            </div>
        </>
    );

}