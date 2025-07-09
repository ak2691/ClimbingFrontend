

import { useState } from 'react';
import { AuthFetch } from './AuthFetch';
export default function StrengthForm() {
    const formOrder = ["Finger strength grade", "Pulling strength grade", "Overall strength grade"]
    const [results, setResults] = useState([]);
    const [overHangAnalysis, setOverHangAnalysis] = useState("");
    const [verticalAnalysis, setVerticalAnalysis] = useState("");
    const [slabAnalysis, setSlabAnalysis] = useState("");
    const [message, setMessage] = useState("");
    const [form, setform] = useState({
        fingerStrength: "", pullingStrength: "", bodyweight: "", overhang: "", vertical: "",
        slab: "", hangtime: "", reps: ""
    });
    const [analysisTwo, setAnalysisTwo] = useState([]);

    const handleChange = (e) => {
        setform((prev) => { return { ...prev, [e.target.name]: e.target.value } })
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Finger Strength:', form.fingerStrength);
        console.log('Pulling Strength:', form.pullingStrength);

        const formData = {
            fingerStrength: parseInt(form.fingerStrength),
            pullingStrength: parseInt(form.pullingStrength),
            bodyweight: parseInt(form.bodyweight),
            overHangGrade: parseInt(form.overhang),
            verticalGrade: parseInt(form.vertical),
            slabGrade: parseInt(form.slab),
            hangTime: parseInt(form.hangtime),
            edgeSize: parseInt(form.edgesize),
            reps: parseInt(form.reps)
        }

        try {
            const res = await AuthFetch("http://localhost:8080/calculator", {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(formData),
                credentials: 'include'
            })
            if (!res.ok) {
                if (res.status === 401) {
                    throw new Error("Login to use calculator");
                }
                const error = await res.json();
                throw new Error(error.message || "Server error");
            }
            let isValid = true;
            for (const key in form) {
                if (form[key].trim() === "") {
                    isValid = false;
                }
            }
            if (!isValid) {
                setMessage("");
                throw new Error("All fields must be filled");
            }
            if (form.bodyweight < 70) {
                setMessage("");
                throw new Error("Bodyweight must be greater than 70 lbs");
            }
            if (form.hangtime < 5 || form.hangtime > 30) {
                setMessage("");
                throw new Error("Hang time must be between 5-30 seconds");

            }
            if (form.edgesize < 6 || form.edgesize > 25) {
                setMessage("");
                throw new Error("Edge size must be between 6 mm and 25 mm");
            }
            if (form.reps < 1 || form.reps > 15) {
                setMessage("");
                throw new Error("Reps must be between 1 and 15");
            }

            const result = await res.json();
            const dataToAnalyze = {
                overHangGrade: parseInt(result[0]),
                verticalGrade: parseInt(result[1]),
                slabGrade: parseInt(result[2]),
                calculatedFingerStrengthGrade: parseInt(result[3]),
                calculatedPullingStrengthGrade: parseInt(result[4])

            };
            const res2 = await AuthFetch("http://localhost:8080/api/analyzefirst", {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(dataToAnalyze),
                credentials: 'include'
            });

            const weaknesses = await res2.json();


            const res3 = await AuthFetch("http://localhost:8080/api/analyzesecond", {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(dataToAnalyze),
                credentials: 'include'
            });
            const recommendations = await res3.json();
            setAnalysisTwo(recommendations);
            setOverHangAnalysis(weaknesses.overHangAnalysis);
            setVerticalAnalysis(weaknesses.verticalAnalysis);
            setSlabAnalysis(weaknesses.slabAnalysis);
            setMessage("Data submitted successfully!");
            setResults(result.slice(3, 6));



        } catch (e) {

            setMessage(`Submission failed: ${e.message}`)


        }


        // setFingerStrength(0);
        // setPullingStrength(0);
        // setBodyweight(0);
        // setOverHangGrade(0);
        // setVerticalGrade(0);
        // setSlabGrade(0);
        // setHangTime(0);
        // setEdgeSize(0);
        // setReps(0);
    };
    return (
        <div className="form">
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="bodyweight">Bodyweight: </label>
                    <input
                        type="text"
                        id="bodyweight"
                        name="bodyweight"
                        value={form.bodyweight}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label htmlFor="fingerStrength">Max weight hang:</label>
                    <input
                        type="text"
                        id="fingerStrength"
                        name="fingerStrength"
                        value={form.fingerStrength}
                        onChange={handleChange}
                    />


                </div>
                <div>
                    <label htmlFor="hangtime">Hang time:</label>
                    <input
                        type="text"
                        id="hangtime"
                        name="hangtime"
                        value={form.hangtime}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="edgesize">Edge size:</label>
                    <input
                        type="text"
                        id="edgesize"
                        name="edgesize"
                        value={form.edgeSize}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="pullingStrength">Max weight pulled:</label>
                    <input
                        type="text"
                        id="pullingStrength"
                        name="pullingStrength"
                        value={form.pullingStrength}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="reps">Number of pull-ups:</label>
                    <input
                        type="text"
                        id="reps"
                        name="reps"
                        value={form.reps}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label htmlFor="overhang">Max overhang grade climbed:</label>
                    <input
                        type="text"
                        id="overhang"
                        name="overhang"
                        value={form.overhang}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="vertical">Max vertical grade climbed:</label>
                    <input
                        type="text"
                        id="vertical"
                        name="vertical"
                        value={form.vertical}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor='slab'>Max slab grade climbed:</label>
                    <input
                        type="text"
                        id="slab"
                        name="slab"
                        value={form.slab}
                        onChange={handleChange}
                    />
                </div>

                <button type="submit">Submit</button>


            </form>

            <div>
                <p>{message}</p>
                {results.length != 0 && <p>Expected grades: </p>}
                {results.map((item, idx) => <li>{formOrder[idx]}: {item}</li>)}
                {(overHangAnalysis || verticalAnalysis || slabAnalysis) && <p>Analysis: </p>}
                {(overHangAnalysis || verticalAnalysis || slabAnalysis) && (
                    <div>

                        <p>Overhang: {overHangAnalysis}</p>
                        <p>Vertical: {verticalAnalysis}</p>
                        <p>Slab: {slabAnalysis}</p>

                    </div>
                )}
            </div>
            <div>
                {analysisTwo.length != 0 && <p>In-depth analysis:</p>}
                {(analysisTwo) && analysisTwo.map((item) =>
                    <>
                        <p>{item.title}</p>
                        <p>{item.mentality}</p>
                        <p>{item.routines.map((i) => <li>{i.name}</li>)}</p>
                    </>



                )}
            </div>
        </div>

    )

}