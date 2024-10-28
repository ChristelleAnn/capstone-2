import React, { useEffect, useState } from 'react';
import { FaBars, FaUserCircle, FaBell } from 'react-icons/fa';
import { auth, db } from '../firebaseConfig'; // Import your Firebase config
import { signOut } from 'firebase/auth';
import { doc, getDoc, collection, query, where, onSnapshot, updateDoc, deleteDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom'; // For navigation to Notifications page
import Snackbar from '@mui/material/Snackbar'; // Snackbar for notifications

interface NavbarProps {
    onToggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [userData, setUserData] = useState<{ username: string; imageUrl: string } | null>(null);
    const [notifications, setNotifications] = useState<{ id: string; message: string; status: string }[]>([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false); // Snackbar state
    const [snackbarMessage, setSnackbarMessage] = useState(''); // Snackbar message

    useEffect(() => {
        // Fetch user data
        const fetchUserData = async () => {
            const user = auth.currentUser; // Get the current user
            if (user) {
                const userDocRef = doc(db, 'users', user.uid); // Reference to the user's document
                const userDocSnap = await getDoc(userDocRef);

                if (userDocSnap.exists()) {
                    const data = userDocSnap.data();
                    setUserData({
                        username: data.username,
                        imageUrl: data.imageUrl, // Make sure imageUrl is available in your Firestore
                    });
                } else {
                    console.log('No such user document!');
                }
            }
        };

        // Fetch notifications (requests stored in 'form_requests' collection)
        const fetchNotifications = async () => {
            const user = auth.currentUser;
            if (user) {
                const requestQuery = query(
                    collection(db, 'form_requests'),
                    where('status', '==', 'pending') // Get only pending requests
                );

                onSnapshot(requestQuery, (querySnapshot) => {
                    const requestsData = querySnapshot.docs.map((doc) => ({
                        id: doc.id,
                        message: `Request from ${doc.data().firstName} ${doc.data().lastName} for ${doc.data().depedForm}`,
                        status: doc.data().status,
                    }));
                    setNotifications(requestsData);
                });
            }
        };

        fetchUserData();
        fetchNotifications();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth); // Sign out from Firebase
        } catch (error) {
            console.error('Logout error: ', error);
        }
    };

    const handleRequestAction = async (id: string, action: 'accept' | 'decline') => {
        try {
            const requestDocRef = doc(db, 'form_requests', id);
            if (action === 'accept') {
                await updateDoc(requestDocRef, { status: 'accepted' });
                setSnackbarMessage('Request accepted');
            } else if (action === 'decline') {
                await deleteDoc(requestDocRef);
                setSnackbarMessage('Request declined');
            }
            setSnackbarOpen(true);
            setNotifications(notifications.filter((notification) => notification.id !== id));
        } catch (error) {
            console.error('Error updating request: ', error);
            setSnackbarMessage('Error processing request');
            setSnackbarOpen(true);
        }
    };

    return (
        <header className="bg-gray-900 text-white flex items-center justify-between p-4 shadow-md z-50 relative">
            <button onClick={onToggleSidebar} className="text-white focus:outline-none">
                <FaBars className="text-2xl" />
            </button>
            <h1 className="text-xl font-bold md:text-2xl">Valentina B. Boncan National High School</h1>

            <div className="relative flex items-center space-x-4">
                {/* Notification Bell */}
                <div className="relative">
                    <button
                        onClick={() => setNotificationsOpen(!notificationsOpen)}
                        className="relative text-white focus:outline-none"
                    >
                        <FaBell className="text-2xl" />
                        {notifications.length > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs px-1">
                                {notifications.length}
                            </span>
                        )}
                    </button>

                    {notificationsOpen && (
                        <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg z-50">
                            <div className="py-2 px-4 border-b border-gray-200">
                                <h3 className="text-sm font-semibold text-gray-800">Notifications</h3>
                            </div>
                            <ul className="py-2 max-h-64 overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <li className="px-4 py-2 text-gray-700">No new notifications</li>
                                ) : (
                                    notifications.map((notification) => (
                                        <li
                                            key={notification.id}
                                            className="px-4 py-2 text-sm text-gray-800 border-b border-gray-200"
                                        >
                                            <div>{notification.message}</div>
                                            <div className="mt-2 space-x-2">
                                                <button
                                                    className="bg-green-500 text-white px-2 py-1 rounded text-xs"
                                                    onClick={() => handleRequestAction(notification.id, 'accept')}
                                                >
                                                    Accept
                                                </button>
                                                <button
                                                    className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                                                    onClick={() => handleRequestAction(notification.id, 'decline')}
                                                >
                                                    Decline
                                                </button>
                                            </div>
                                        </li>
                                    ))
                                )}
                            </ul>
                            <div className="p-2 text-center">
                                <Link to="/notifications" className="text-blue-500 text-sm underline">
                                    View All Requests
                                </Link>
                            </div>
                        </div>
                    )}
                </div>

                {/* User Avatar */}
                <div className="relative">
                    <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="flex items-center focus:outline-none"
                    >
                        {userData ? (
                            <img
                                src={userData.imageUrl}
                                alt="User Avatar"
                                className="w-8 h-8 rounded-full mr-2"
                            />
                        ) : (
                            <FaUserCircle className="text-2xl" />
                        )}
                        <span>{userData ? userData.username : 'User'}</span>
                    </button>
                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50">
                            <ul className="py-2">
                                <li>
                                    <button
                                        onClick={handleLogout}
                                        className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left focus:outline-none"
                                    >
                                        Logout
                                    </button>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            {/* Snackbar for Action Feedback */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage}
            />
        </header>
    );
};

export default Navbar;
