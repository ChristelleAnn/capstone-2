import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseConfig'; // Ensure you have your Firebase config here
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import UserManagement from './pages/UserManagement';
import AddUserPage from './pages/AddUser'; // Import AddUserPage
import FormTemplates from './pages/FormTemplates';
import DataManagement from './pages/DataManagement';
import Login from './pages/Login';
import Signup from './pages/Signup';
import RequestForm from './pages/RequestForm'; // Import the new RequestForm page
import Notifications from './pages/Notifications'; // Import Notifications page
import Grades from './pages/DataManagementComponents/Grades'; // Ensure you import Grades component
import Enrollees from './pages/DataManagementComponents/Enrollees'; // Ensure you import Enrollees component
import Dropouts from './pages/DataManagementComponents/Dropouts'; // Ensure you import Dropouts component
import Transferee from './pages/DataManagementComponents/Transferee'; // Ensure you import Transferee component
import AboutUs from './pages/AboutUs';

import { AuthProvider } from './context/AuthContext';

const App: React.FC = () => {
    const [isCollapsed, setIsCollapsed] = useState(window.innerWidth < 768); // Collapse on small screens
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // Authentication state
    const [loading, setLoading] = useState(true); // Loading state

    // Function to toggle the sidebar
    const toggleSidebar = () => {
        setIsCollapsed(prevState => !prevState);
    };

    // Effect to handle window resizing
    useEffect(() => {
        const handleResize = () => {
            setIsCollapsed(window.innerWidth < 768); // Collapse if window is smaller than 768px
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Effect to check authentication state
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsAuthenticated(!!user);
            setLoading(false); // Stop loading when authentication state is determined
        });

        return () => unsubscribe();
    }, []);

    // Show loading spinner while authentication state is being determined
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <AuthProvider>
            <BrowserRouter>
                <div className="flex flex-col min-h-screen">
                    <div className="flex flex-1">
                        {isAuthenticated ? (
                            <>
                                <Sidebar isCollapsed={isCollapsed} />
                                <div className={`flex-1 flex flex-col transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
                                    <Navbar onToggleSidebar={toggleSidebar} />
                                    <div className="flex-1">
                                        <Routes>
                                            <Route path="/" element={<Home />} />
                                            <Route path="/user-management" element={<UserManagement />} />
                                            <Route path="/add-user" element={<AddUserPage />} />
                                            <Route path="/form-templates" element={<FormTemplates />} />
                                            <Route path="/data-management" element={<DataManagement />} />
                                            <Route path="/grades" element={<Grades />} /> {/* Add route for Grades */}
                                            <Route path="/enrollees" element={<Enrollees />} /> {/* Add route for Enrollees */}
                                            <Route path="/dropouts" element={<Dropouts />} /> {/* Add route for Dropouts */}
                                            <Route path="/transferee" element={<Transferee />} /> {/* Add route for Transferee */}
                                            <Route path="/request-form" element={<RequestForm />} />
                                            <Route path="/notifications" element={<Notifications />} /> {/* Add Notifications route */}
                                            <Route path="*" element={<Navigate to="/" />} /> {/* Redirect authenticated users to Home */}
                                        </Routes>
                                    </div>
                                    <Footer isCollapsed={isCollapsed} />
                                </div>
                            </>
                        ) : (
                            <div className="flex-1">
                                <Routes>
                                <Route path="/about" element={<AboutUs />} />
                                    <Route path="/login" element={<Login />} />
                                    <Route path="/signup" element={<Signup />} />
                                    <Route path="/request-form" element={<RequestForm />} /> {/* Make RequestForm accessible to everyone */}
                                    <Route path="*" element={<Navigate to="/login" />} /> {/* Redirect unauthenticated users to Login */}
                                </Routes>
                            </div>
                        )}
                    </div>
                </div>
            </BrowserRouter>
        </AuthProvider>
    );
};

export default App;
