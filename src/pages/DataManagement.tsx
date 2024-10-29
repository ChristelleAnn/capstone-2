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
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-8">
            <div className="max-w-lg w-full">
                <h2 className="text-4xl font-bold text-white mb-8 text-center">Data Management</h2>
                <div className="grid place-items-center gap-6">
                    {dataCategories.map((category) => (
                        <button
                            key={category}
                            onClick={() => handleNavigation(category)}  // Add the onClick handler
                            className="h-16 w-full text-lg font-medium bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-500 hover:to-purple-600 text-white rounded-md transition-all duration-300 transform hover:scale-105 shadow-lg"
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
