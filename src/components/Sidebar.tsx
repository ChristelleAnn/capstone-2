import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaUserCog, FaClipboardList, FaDatabase } from 'react-icons/fa';

interface SidebarProps {
    isCollapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed }) => {
    const location = useLocation();

    const menuItems = [
        { path: '/', label: 'Home', icon: <FaHome className="text-blue-400" /> },
        { path: '/user-management', label: 'User Management', icon: <FaUserCog className="text-green-400" /> },
        { path: '/form-templates', label: 'Form Templates', icon: <FaClipboardList className="text-yellow-400" /> },
        { path: '/data-management', label: 'Data Management', icon: <FaDatabase className="text-red-400" /> },
    ];

    return (
        <aside className={`bg-gray-800 text-white h-screen shadow-lg transition-all duration-300 fixed top-0 left-0 z-50 ${isCollapsed ? 'w-16' : 'w-64'}`}>
            <div className="p-4 border-b border-gray-700 flex flex-col items-center">
                <a href="https://ibb.co/qBFMV75" target="_blank" rel="noopener noreferrer">
                    <img
                        src="https://i.ibb.co/qBFMV75/school-logo.png" // Replace with your actual image URL
                        alt="School Logo"
                        className={`transition-all duration-300 ${isCollapsed ? 'h-10 w-10' : 'h-20 w-auto'}`}
                        style={{
                            objectFit: 'contain',
                        }}
                    />
                </a>
                {!isCollapsed && <h2 className="text-xl font-bold mt-2 text-center">Admin Dashboard</h2>}
            </div>

            <nav className="mt-6">
                <ul className="space-y-4">
                    {menuItems.map((item) => (
                        <li
                            key={item.path}
                            className={`rounded-lg transition-all duration-300 ${location.pathname === item.path ? 'bg-gray-700' : 'hover:bg-gray-600'}`}
                        >
                            <Link
                                to={item.path}
                                className={`flex items-center p-4 text-gray-300 transition duration-200 hover:text-white ${isCollapsed ? 'justify-center' : 'justify-start'}`}
                            >
                                {item.icon}
                                {!isCollapsed && <span className="ml-3">{item.label}</span>}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;
