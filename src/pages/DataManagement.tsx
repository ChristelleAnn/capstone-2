import React from 'react';
import { useNavigate } from 'react-router-dom';

const DataManagement: React.FC = () => {
    const dataCategories = ["Grades", "Enrollees", "Dropouts", "Transferee"];
    const navigate = useNavigate();  // Initialize useNavigate

    const handleNavigation = (category: string) => {
        // Define the routes for each category
        const routes: { [key: string]: string } = {
            "Grades": "/grades",
            "Enrollees": "/enrollees",
            "Dropouts": "/dropouts",
            "Transferee": "/transferee"
        };
        navigate(routes[category]); // Navigate to the corresponding route
    };

    return (
        <div className="flex-1 p-5 bg-gradient-to-br from-blue-50 to-green-50 text-gray-700 min-h-screen flex items-center justify-center">
            <div className="max-w-lg w-full bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Data Management</h2>
                <div className="grid gap-4">
                    {dataCategories.map((category) => (
                        <button
                            key={category}
                            onClick={() => handleNavigation(category)}  // Add the onClick handler
                            className="h-16 w-full text-lg font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white rounded-md transition-all duration-300 transform hover:scale-105 shadow-md"
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DataManagement;
