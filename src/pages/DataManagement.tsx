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
        <div className="min-h-full bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center p-8">
            <div className="max-w-lg w-full">
                <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Data Management</h2>
                <div className="grid place-items-center gap-6"> {/* Changed from space-y-6 to gap-6 for grid */}
                    {dataCategories.map((category) => (
                        <button
                            key={category}
                            onClick={() => handleNavigation(category)}  // Add the onClick handler
                            className="h-16 w-80 text-lg font-medium bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-md transition-all duration-300 transform hover:scale-105 shadow-md"
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
