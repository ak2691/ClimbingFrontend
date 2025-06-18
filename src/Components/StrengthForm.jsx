


import { useState } from 'react';
export default function StrengthForm() {
    const [fingerStrength, setFingerStrength] = useState(0);
    const [pullingStrength, setPullingStrength] = useState(0);
    const [bodyweight, setBodyweight] = useState(0);
    const [message, setMessage] = useState("");

    const handleFSChange = (e) => {
        setFingerStrength((s) => e.target.value);
    }
    const handlePSChange = (e) => {
        setPullingStrength((s) => e.target.value);
    }
    const handleBWChange = (e) => {
        setBodyweight((s) => e.target.value);
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Finger Strength:', fingerStrength);
        console.log('Pulling Strength:', pullingStrength);

        const formData = {
            fingerStrength: parseInt(fingerStrength),
            pullingStrength: parseInt(pullingStrength),
            bodyweight: parseInt(bodyweight)
        }

        try {
            const res = await fetch("http://localhost:8080/calculator", {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(formData)
            })
            if (!res.ok) {
                const error = await res.text();
                throw new Error(error.message || "Server error");
            }
            const result = await res.text();

            setMessage("Data submitted successfully! " + result);



        } catch (e) {
            setMessage(`Submission failed: ${e.message}`)
        }


        setFingerStrength(0);
        setPullingStrength(0);
        setBodyweight(0);
    };
    return (

        <form onSubmit={handleSubmit}>
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
                <label htmlFor="pullingStrength">Max weight pulled:</label>
                <input
                    type="text"
                    id="pullingStrength"
                    value={pullingStrength}
                    onChange={handlePSChange}
                />
            </div>
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
                <p>{message}</p>
            </div>
            <button type="submit">Submit</button>


        </form>
    )

}