

import { useState } from 'react';
import { AuthFetch, useAuth } from './AuthContext';
import { Mountain, TrendingUp, Activity } from 'lucide-react';
export default function StrengthForm() {
    const formOrder = ["Finger strength grade", "Pulling strength grade", "Overall strength grade"]
    const [results, setResults] = useState([]);
    const [overHangAnalysis, setOverHangAnalysis] = useState("");
    const [verticalAnalysis, setVerticalAnalysis] = useState("");
    const [slabAnalysis, setSlabAnalysis] = useState("");
    const [message, setMessage] = useState("");
    const [form, setform] = useState({
        fingerStrength: "", pullingStrength: "", bodyweight: "", overhang: "", vertical: "",
        slab: "", hangtime: "7", reps: "2", edgesize: "20"
    });
    const [analysisTwo, setAnalysisTwo] = useState([]);
    const { apiUrl } = useAuth();
    const handleChange = (e) => {
        setform((prev) => { return { ...prev, [e.target.name]: e.target.value } })
    };
    const handleSliderChange = (name, value) => {
        setform(prev => ({
            ...prev,
            [name]: value
        }));
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
            const res = await AuthFetch(`${apiUrl}/api/calculator`, {
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
            const requiredFields = ['bodyweight', 'fingerStrength', 'pullingStrength', 'overhang', 'vertical', 'slab'];
            const isValid = requiredFields.every(field => form[field] !== '');
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
            const res2 = await AuthFetch(`${apiUrl}/api/analyzefirst`, {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(dataToAnalyze),
                credentials: 'include'
            });

            const weaknesses = await res2.json();


            const res3 = await AuthFetch(`${apiUrl}/api/analyzesecond`, {
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
    const chartData = [
        {
            name: 'Overhang',
            expected: results.length > 0 ? parseInt(results[0]) : 0,
            actual: form.overhang ? parseInt(form.overhang) : 0,
        },
        {
            name: 'Vertical',
            expected: results.length > 0 ? parseInt(results[1]) : 0,
            actual: form.vertical ? parseInt(form.vertical) : 0,
        },
        {
            name: 'Slab',
            expected: results.length > 0 ? parseInt(results[2]) : 0,
            actual: form.slab ? parseInt(form.slab) : 0,
        }
    ];
    const CustomBarChart = ({ data }) => {
        const maxGrade = 17;
        const chartHeight = 240;
        const barWidth = 40;
        const groupWidth = 120;
        const marginLeft = 60;
        const marginBottom = 40;

        return (
            <div className="relative bg-white border border-yellow-200 rounded-lg p-4">
                <svg width="100%" height={chartHeight + marginBottom + 20} className="overflow-visible">
                    {/* Y-axis grid lines and labels */}
                    {Array.from({ length: 18 }, (_, i) => i).map(grade => (
                        <g key={grade}>
                            <line
                                x1={marginLeft}
                                y1={chartHeight - (grade * chartHeight / maxGrade) + 20}
                                x2={marginLeft + data.length * groupWidth}
                                y2={chartHeight - (grade * chartHeight / maxGrade) + 20}
                                stroke="#fef3c7"
                                strokeWidth="1"
                            />
                            <text
                                x={marginLeft - 10}
                                y={chartHeight - (grade * chartHeight / maxGrade) + 25}
                                textAnchor="end"
                                fontSize="12"
                                fill="#6b7280"
                            >
                                V{grade}
                            </text>
                        </g>
                    ))}

                    {/* Bars */}
                    {data.map((item, index) => {
                        const xBase = marginLeft + index * groupWidth + 20;
                        const expectedHeight = (item.expected / maxGrade) * chartHeight;
                        const actualHeight = (item.actual / maxGrade) * chartHeight;

                        return (
                            <g key={item.name}>
                                {/* Expected bar */}
                                <rect
                                    x={xBase}
                                    y={chartHeight - expectedHeight + 20}
                                    width={barWidth}
                                    height={expectedHeight}
                                    fill="#fbbf24"
                                    rx="2"
                                />
                                {/* Expected value label */}
                                <text
                                    x={xBase + barWidth / 2}
                                    y={chartHeight - expectedHeight + 15}
                                    textAnchor="middle"
                                    fontSize="10"
                                    fill="#92400e"
                                    fontWeight="bold"
                                >
                                    V{item.expected}
                                </text>

                                {/* Actual bar */}
                                <rect
                                    x={xBase + barWidth + 5}
                                    y={chartHeight - actualHeight + 20}
                                    width={barWidth}
                                    height={actualHeight}
                                    fill="#f59e0b"
                                    rx="2"
                                />
                                {/* Actual value label */}
                                <text
                                    x={xBase + barWidth + 5 + barWidth / 2}
                                    y={chartHeight - actualHeight + 15}
                                    textAnchor="middle"
                                    fontSize="10"
                                    fill="#92400e"
                                    fontWeight="bold"
                                >
                                    V{item.actual}
                                </text>

                                {/* X-axis labels */}
                                <text
                                    x={xBase + barWidth + 2.5}
                                    y={chartHeight + 35}
                                    textAnchor="middle"
                                    fontSize="14"
                                    fill="#374151"
                                    fontWeight="medium"
                                >
                                    {item.name}
                                </text>
                            </g>
                        );
                    })}

                    {/* Y-axis label */}
                    <text
                        x="15"
                        y={chartHeight / 2 + 20}
                        textAnchor="middle"
                        fontSize="12"
                        fill="#6b7280"
                        transform={`rotate(-90, 15, ${chartHeight / 2 + 20})`}
                    >
                        V-Grade
                    </text>
                </svg>

                {/* Legend */}
                <div className="flex justify-center mt-4 space-x-6">
                    <div className="flex items-center">
                        <div className="w-4 h-4 bg-yellow-400 rounded mr-2"></div>
                        <span className="text-sm text-gray-600">Expected Grade</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-4 h-4 bg-yellow-600 rounded mr-2"></div>
                        <span className="text-sm text-gray-600">Actual Grade</span>
                    </div>
                </div>
            </div>
        );
    };

    const SliderInput = ({ label, name, value, min, max, unit }) => (
        <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}: {value}{unit}
            </label>
            <input
                type="range"
                min={min}
                max={max}
                value={value}
                onChange={(e) => handleSliderChange(name, parseInt(e.target.value))}
                className="w-full h-2 bg-yellow-100 rounded-lg appearance-none cursor-pointer slider"
                style={{
                    background: `linear-gradient(to right, #fbbf24 0%, #fbbf24 ${((value - min) / (max - min)) * 100}%, #fef3c7 ${((value - min) / (max - min)) * 100}%, #fef3c7 100%)`
                }}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{min}{unit}</span>
                <span>{max}{unit}</span>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center mb-4">
                        <Mountain className="h-10 w-10 text-yellow-600 mr-3" />
                        <h1 className="text-3xl font-bold text-gray-800">Climbing Strength Calculator</h1>
                    </div>
                    <p className="text-gray-600">Analyze your climbing performance and get personalized training recommendations</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Calculator Form - Left Side */}
                    <div className="bg-white rounded-xl shadow-lg border-2 border-yellow-200 p-6">
                        <div className="flex items-center mb-6">
                            <Activity className="h-6 w-6 text-yellow-600 mr-2" />
                            <h2 className="text-xl font-semibold text-gray-800">Input Your Stats</h2>
                        </div>

                        <div className="space-y-6">
                            {/* Regular inputs */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Bodyweight (lbs)
                                </label>
                                <input
                                    type="number"
                                    name="bodyweight"
                                    value={form.bodyweight}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border-2 border-yellow-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                                    placeholder="Enter your bodyweight"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Max Weight Hang (lbs)
                                </label>
                                <input
                                    type="number"
                                    name="fingerStrength"
                                    value={form.fingerStrength}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border-2 border-yellow-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                                    placeholder="Maximum added weight"
                                />
                            </div>

                            {/* Slider inputs */}
                            <SliderInput
                                label="Hang Time"
                                name="hangtime"
                                value={form.hangtime}
                                min={5}
                                max={30}
                                unit=" sec"
                            />

                            <SliderInput
                                label="Edge Size"
                                name="edgesize"
                                value={form.edgesize}
                                min={6}
                                max={25}
                                unit=" mm"
                            />

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Max Weight Pulled (lbs)
                                </label>
                                <input
                                    type="number"
                                    name="pullingStrength"
                                    value={form.pullingStrength}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border-2 border-yellow-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                                    placeholder="Maximum pull-up weight"
                                />
                            </div>

                            <SliderInput
                                label="Number of Pull-ups"
                                name="reps"
                                value={form.reps}
                                min={1}
                                max={15}
                                unit=""
                            />

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Max Overhang VGrade
                                    </label>
                                    <input
                                        type="text"
                                        name="overhang"
                                        value={form.overhang}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border-2 border-yellow-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                                        placeholder="e.g., 6"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Max Vertical VGrade
                                    </label>
                                    <input
                                        type="text"
                                        name="vertical"
                                        value={form.vertical}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border-2 border-yellow-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                                        placeholder="e.g., 4"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Max Slab VGrade
                                    </label>
                                    <input
                                        type="text"
                                        name="slab"
                                        value={form.slab}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border-2 border-yellow-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                                        placeholder="e.g., 2"
                                    />
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={handleSubmit}
                                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 transform hover:scale-105"
                            >
                                Calculate Performance
                            </button>
                        </div>

                        {message && (
                            <div className={`mt-4 p-3 rounded-lg ${message.includes('successfully')
                                ? 'bg-green-100 text-green-700 border border-green-200'
                                : 'bg-red-100 text-red-700 border border-red-200'
                                }`}>
                                {message}
                            </div>
                        )}
                    </div>

                    {/* Results - Right Side */}
                    <div className="bg-white rounded-xl shadow-lg border-2 border-yellow-200 p-6">
                        <div className="flex items-center mb-6">
                            <TrendingUp className="h-6 w-6 text-yellow-600 mr-2" />
                            <h2 className="text-xl font-semibold text-gray-800">Results & Analysis</h2>
                        </div>

                        {results.length > 0 && (
                            <div className="mb-8">
                                <h3 className="text-lg font-medium text-gray-800 mb-4">Performance Comparison</h3>
                                <CustomBarChart data={chartData} />
                            </div>
                        )}

                        {results.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-lg font-medium text-gray-800 mb-3">Expected Grades</h3>
                                <div className="grid grid-cols-1 gap-3">
                                    {results.map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                                            <span className="font-medium text-gray-700">{formOrder[idx]}</span>
                                            <span className="text-yellow-700 font-bold">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {(overHangAnalysis || verticalAnalysis || slabAnalysis) && (
                            <div className="mb-6">
                                <h3 className="text-lg font-medium text-gray-800 mb-3">Analysis</h3>
                                <div className="space-y-3">
                                    {overHangAnalysis && (
                                        <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                                            <span className="font-medium text-orange-700">Overhang:</span>
                                            <p className="text-orange-600 mt-1">{overHangAnalysis}</p>
                                        </div>
                                    )}
                                    {verticalAnalysis && (
                                        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                                            <span className="font-medium text-blue-700">Vertical:</span>
                                            <p className="text-blue-600 mt-1">{verticalAnalysis}</p>
                                        </div>
                                    )}
                                    {slabAnalysis && (
                                        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                                            <span className="font-medium text-green-700">Slab:</span>
                                            <p className="text-green-600 mt-1">{slabAnalysis}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {analysisTwo.length > 0 && (
                            <div>
                                <h3 className="text-lg font-medium text-gray-800 mb-3">In-depth Analysis</h3>
                                {analysisTwo.map((item, idx) => (
                                    <div key={idx} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                        <h4 className="font-semibold text-gray-800 mb-2">{item.title}</h4>
                                        <p className="text-gray-600 mb-3">{item.mentality}</p>
                                        <div>
                                            <span className="font-medium text-gray-700">Recommended Routines:</span>
                                            <ul className="mt-2 space-y-1">
                                                {item.routines.map((routine, routineIdx) => (
                                                    <li key={routineIdx} className="flex items-center text-gray-600">
                                                        <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                                                        {routine.name}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

}