// src/components/PerformanceAnalyzer.js
import React, { useState } from 'react';
import axios from 'axios';

const PerformanceAnalyzer = () => {
    const [grades, setGrades] = useState([]);
    const [targetGrades, setTargetGrades] = useState([]);
    const [studyHours, setStudyHours] = useState(0);
    const [courseWeights, setCourseWeights] = useState([]);
    const [results, setResults] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await axios.post('http://localhost:5000/analyze', {
            grades,
            target_grades: targetGrades,
            study_hours: studyHours,
            course_weights: courseWeights
        });
        setResults(response.data);
    };

    return (
        <div>
            <h1>Performance Analyzer</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Current Grades (comma-separated):</label>
                    <input
                        type="text"
                        onChange={(e) => setGrades(e.target.value.split(',').map(Number))}
                    />
                </div>
                <div>
                    <label>Target Grades (comma-separated):</label>
                    <input
                        type="text"
                        onChange={(e) => setTargetGrades(e.target.value.split(',').map(Number))}
                    />
                </div>
                <div>
                    <label>Study Hours Available:</label>
                    <input
                        type="number"
                        onChange={(e) => setStudyHours(Number(e.target.value))}
                    />
                </div>
                <div>
                    <label>Course Weights (comma-separated):</label>
                    <input
                        type="text"
                        onChange={(e) => setCourseWeights(e.target.value.split(',').map(Number))}
                    />
                </div>
                <button type="submit">Analyze</button>
            </form>
            {results && (
                <div>
                    <h2>Results</h2>
                    <p>Deficits: {results.deficits.join(', ')}</p>
                    <p>Effort Estimation: {results.effort_estimation.join(', ')}</p>
                    <p>Weighted GPA: {results.weighted_gpa}</p>
                    <p>Predicted Grades: {results.predicted_grades.join(', ')}</p>
                    <p>Study Distribution: {results.study_distribution.join(', ')}</p>
                </div>
            )}
        </div>
    );
};

export default PerformanceAnalyzer;