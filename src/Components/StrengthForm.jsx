


import { useState } from 'react';
export default function StrengthForm() {
    const formOrder = ["Finger strength grade", "Pulling strength grade", "Overall strength grade"]
    const [fingerStrength, setFingerStrength] = useState(0);
    const [hangTime, setHangTime] = useState(0);
    const [edgeSize, setEdgeSize] = useState(0);
    const [pullingStrength, setPullingStrength] = useState(0);
    const [reps, setReps] = useState(0);
    const [bodyweight, setBodyweight] = useState(0);
    const [overHangGrade, setOverHangGrade] = useState(0);
    const [verticalGrade, setVerticalGrade] = useState(0);
    const [slabGrade, setSlabGrade] = useState(0);
    const [results, setResults] = useState([]);
    const [weaknesses, setWeaknesses] = useState([]);
    const [message, setMessage] = useState("");

    const handleFSChange = (e) => {
        setFingerStrength((s) => e.target.value);
    }
    const handleHTChange = (e) => {
        setHangTime(e.target.value);
    }
    const handleESChange = (e) => {
        setEdgeSize(e.target.value);
    }
    const handlePSChange = (e) => {
        setPullingStrength((s) => e.target.value);
    }
    const handleBWChange = (e) => {
        setBodyweight((s) => e.target.value);
    }
    const handleOHChange = (e) => {
        setOverHangGrade(e.target.value);
    }
    const handleVTChange = (e) => {
        setVerticalGrade(e.target.value);
    }
    const handleSBChange = (e) => {
        setSlabGrade(e.target.value);
    }
    const handleRepsChange = (e) => {
        setReps(e.target.value);
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Finger Strength:', fingerStrength);
        console.log('Pulling Strength:', pullingStrength);

        const formData = {
            fingerStrength: parseInt(fingerStrength),
            pullingStrength: parseInt(pullingStrength),
            bodyweight: parseInt(bodyweight),
            overHangGrade: parseInt(overHangGrade),
            verticalGrade: parseInt(verticalGrade),
            slabGrade: parseInt(slabGrade),
            hangTime: parseInt(hangTime),
            edgeSize: parseInt(edgeSize),
            reps: parseInt(reps)
        }

        try {
            const res = await fetch("http://localhost:8080/calculator", {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(formData)
            })
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || "Server error");
            }
            if (bodyweight < 70) {
                setMessage("");
                throw new Error("Bodyweight must be greater than 70 lbs");
            }
            if (hangTime < 5 || hangTime > 30) {
                setMessage("");
                throw new Error("Hang time must be between 5-30 seconds");

            }
            if (edgeSize < 6 || edgeSize > 25) {
                setMessage("");
                throw new Error("Edge size must be between 6 mm and 25 mm");
            }
            if (reps < 1 || reps > 15) {
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
            const res2 = await fetch("http://localhost:8080/api/weakness", {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(dataToAnalyze)
            });

            const weaknesses = await res2.json();
            setWeaknesses(weaknesses);
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

        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="bodyweight">Bodyweight: </label>
                <input
                    type="text"
                    id="bodyweight"
                    value={bodyweight}
                    onChange={handleBWChange}
                />
            </div>

            <div>
                <label htmlFor="fingerStrength">Max weight hang:</label>
                <input
                    type="text"
                    id="fingerStrength"
                    value={fingerStrength}
                    onChange={handleFSChange}
                />


            </div>
            <div>
                <label htmlFor="hangtime">Hang time:</label>
                <input
                    type="text"
                    id="hangtime"
                    value={hangTime}
                    onChange={handleHTChange}
                />
            </div>
            <div>
                <label htmlFor="edgesize">Edge size:</label>
                <input
                    type="text"
                    id="edgesize"
                    value={edgeSize}
                    onChange={handleESChange}
                />
            </div>
            <div>
                <label htmlFor="pullingStrength">Max weight pulled:</label>
                <input
                    type="text"
                    id="pullingStrength"
                    value={pullingStrength}
                    onChange={handlePSChange}
                />
            </div>
            <div>
                <label htmlFor="reps">Number of pull-ups:</label>
                <input
                    type="text"
                    id="reps"
                    value={reps}
                    onChange={handleRepsChange}
                />
            </div>

            <div>
                <label htmlFor="overhang">Max overhang grade climbed:</label>
                <input
                    type="text"
                    id="overhang"
                    value={overHangGrade}
                    onChange={handleOHChange}
                />
            </div>
            <div>
                <label htmlFor="vertical">Max vertical grade climbed:</label>
                <input
                    type="text"
                    id="vertical"
                    value={verticalGrade}
                    onChange={handleVTChange}
                />
            </div>
            <div>
                <label htmlFor='slab'>Max vertical grade climbed:</label>
                <input
                    type="text"
                    id="slab"
                    value={slabGrade}
                    onChange={handleSBChange}
                />
            </div>
            <div>
                <p>{message}</p>
                <p>Results: </p>
                {results.map((item, idx) => <li>{formOrder[idx]}: {item}</li>)}
                <p>Potential weaknesses: </p>
                {weaknesses.map((item) => <li>{item}</li>)}
            </div>
            <button type="submit">Submit</button>


        </form>
    )

}