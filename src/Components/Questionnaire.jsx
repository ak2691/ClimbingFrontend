
import { useState } from "react";
import { AuthFetch } from "./AuthFetch";
import ContinueButton from "../DesignComponents/ContinueButton"
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
    const [finalResults, setFinalResults] = useState({});
    const [showRoutine, setShowRoutine] = useState(false);
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
            const res = await fetch("http://localhost:8080/api/generatequestions", {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(selectedStyles),
                credentials: 'include'
            })
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
            console.log(response["underclings"].answer_choices);

            setMessage("successful");
            setShowSurvey(true);
        } catch (e) {
            setMessage("Submission failed due to server error");
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
            const userId = await fetch("http://localhost:8080/api/userid", {
                method: 'POST',
                headers: { 'content-type': 'text/plain' },
                body: jwtToken,
                credentials: 'include'
            });
            if (!userId.ok) {
                const error = await userId.json();
                throw new Error(error.message);
            }
            console.log(userId);
            data.userId = await userId.json();
            const res = await fetch("http://localhost:8080/api/generateroutine", {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(data),
                credentials: 'include'
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message);
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
                    ) : (finalResults.displayExercises.map((exercise) => <li>{exercise.name} - {exercise.description}</li>))



                )

                }




            </div>
        </>
    );

}