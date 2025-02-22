import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
    const [grades, setGrades] = useState([]);
    const [courseOfAction, setCourseOfAction] = useState([]);
    const [performanceIndicators, setPerformanceIndicators] = useState({});
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleFileUpload = async () => {
        if (!file) {
            alert("Please select a file first!");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        setLoading(true);
        setError("");

        try {
            await axios.post('https://flask-code-voxm.onrender.com/api/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            await fetchAllData();
        } catch (error) {
            setError("Error uploading file. Please try again.");
            console.error("Error uploading file:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAllData = async () => {
        await Promise.all([fetchGrades(), fetchCourseOfAction(), fetchPerformanceIndicators()]);
    };

    const fetchGrades = async () => {
        try {
            const response = await axios.get('https://flask-code-voxm.onrender.com/api/grades');
            setGrades(response.data);
        } catch (error) {
            setError("Error fetching grades.");
            console.error("Error fetching grades:", error);
        }
    };

    const fetchCourseOfAction = async () => {
        try {
            const response = await axios.get('https://flask-code-voxm.onrender.com/api/course_of_action');
            setCourseOfAction(response.data);
        } catch (error) {
            setError("Error fetching course of action.");
            console.error("Error fetching course of action:", error);
        }
    };

    const fetchPerformanceIndicators = async () => {
        try {
            const response = await axios.get('https://flask-code-voxm.onrender.com/api/performance_indicators');
            setPerformanceIndicators(response.data);
        } catch (error) {
            setError("Error fetching performance indicators.");
            console.error("Error fetching performance indicators:", error);
        }
    };

    return (
        <div style={{ backgroundColor: '#000000', color: '#C297F1', minHeight: '100vh', padding: '20px 50px', fontFamily: 'DM Sans' }}>
             <h1 style={{ textAlign: 'center', background: 'linear-gradient(45deg, #C297F1, #8242E1)', WebkitBackgroundClip: 'text', color: 'transparent', fontFamily: 'DM Sans', fontWeight: 'black' }}>Student Performance Dashboard</h1>


            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
                <input type="file" accept=".xlsx" onChange={handleFileChange} style={{ color: '#eaeaea' }} />
                <button onClick={handleFileUpload} style={{ background: 'linear-gradient(100deg, #C297F1, #8242E1)', color: '#000', border: 'none', borderRadius : '5px', padding: '10px 20px', cursor: 'pointer' }}>Upload Excel File</button>
            </div>

            {loading && <p style={{ textAlign: 'center' }}>Loading data... ⏳</p>}
            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

            <div style={{ marginBottom: '20px' }}>
                <h2 style={{ background: 'linear-gradient(45deg, #C297F1, #8242E1)',color: '#000',padding: '5px 10px',maxWidth:'100px',borderBottom: '2px solid #C297F1', fontWeight : 'bold' }}>Grades</h2>
                {grades.length > 0 ? (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#000' }}>
                                <th style={{ padding: '10px', border: '0px solid #C297F1' }}>Student Name</th>
                                <th style={{ padding: '10px', border: '0px solid #C297F1' }}>Course</th>
                                <th style={{ padding: '10px', border: '0px solid #C297F1' }}>Current Grade</th>
                                <th style={{ padding: '10px', border: '0px solid #C297F1' }}>Target Grade</th>
                                <th style={{ padding: '10px', border: '0px solid #C297F1' }}>Course Weight</th>
                                <th style={{ padding: '10px', border: '0px solid #C297F1' }}>GPA</th>
                            </tr>
                        </thead>
                        <tbody>
                            {grades.map((grade, index) => (
                                <tr key={index} style={{ textAlign: 'center' }}>
                                    <td style={{ padding: '10px', border: '0px solid #C297F1' }}>{grade['Student Name']}</td>
                                    <td style={{ padding: '10px', border: '0px solid #C297F1' }}>{grade['Course']}</td>
                                    <td style={{ padding: '10px', border: '0px solid #C297F1' }}>{grade['Current Grade']}%</td>
                                    <td style={{ padding: '10px', border: '0px solid #C297F1' }}>{grade['Target Grade']}%</td>
                                    <td style={{ padding: '10px', border: '0px solid #C297F1' }}>{grade['Course Weight']}</td>
                                    <td style={{ padding: '10px', border: '0px solid #C297F1' }}>{grade['GPA'].toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No grades available. Please upload an Excel file.</p>
                )}
            </div>

            <div style={{ marginBottom: '20px' }}>
                <h2 style={{ background: 'linear-gradient(45deg, #C297F1, #8242E1)',color: '#000',padding: '5px 10px',maxWidth:'200px',borderBottom: '2px solid #C297F1', fontWeight : 'bold' }}>Course of Action</h2>
                {courseOfAction.length > 0 ? (
                    <ul>
                        {courseOfAction.map((action, index) => (
                            <li key={index} style={{ marginBottom: '10px' }}>
                                {action.includes('✅') ? <span style={{ color: 'lime' }}>{action}</span> : action}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No course of action available. Please upload an Excel file.</p>
                )}
            </div>

            <div>
                <h2 style={{ background: 'linear-gradient(45deg, #C297F1, #8242E1)',color: '#000',padding: '5px 10px',maxWidth:'300px',borderBottom: '2px solid #C297F1', fontWeight : 'bold' }}>Performance Indicators</h2>
                {performanceIndicators.average_current_grade !== undefined ? (
                    <div>
                        <p>📈 Average Current Grade: {performanceIndicators.average_current_grade}%</p>
                        <p>🎯 Average Target Grade: {performanceIndicators.average_target_grade}%</p>
                        <p>⚖️ Average Course Weight: {performanceIndicators.average_course_weight}</p>
                        <p>⭐ Average GPA: {performanceIndicators.average_gpa}</p>
                    </div>
                ) : (
                    <p>No performance indicators available. Please upload an Excel file.</p>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
