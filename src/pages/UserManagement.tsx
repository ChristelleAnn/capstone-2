import React, { useEffect, useState } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { storage } from '../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { FaUserShield, FaUserGraduate, FaUserTie } from 'react-icons/fa';

interface User {
  id: string; 
  fullname: string;
  username: string;
  email: string;
  role: string;
  status: string;
  imageUrl: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>(''); // State for search query

  // Editing state
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [fullname, setFullname] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Admin');
  const [status, setStatus] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  // User counts
  const [userCounts, setUserCounts] = useState({ Admin: 0, Adviser: 0, Faculty: 0 });

  const fetchUsers = async () => {
    const usersCollection = collection(db, 'users');
    const usersSnapshot = await getDocs(usersCollection);
    const usersList: User[] = usersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as User[];
    setUsers(usersList);

    const counts = usersList.reduce((acc: any, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, { Admin: 0, Adviser: 0, Faculty: 0 });

    setUserCounts(counts);
  };

  const fetchUserRole = async (userId: string) => {
    const userDocRef = doc(db, 'users', userId);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      setCurrentUserRole(userData.role);
    }
  };

  useEffect(() => {
    fetchUsers();
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserRole(user.uid);
      } else {
        setCurrentUserRole(null);
      }
    });
  }, []);

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setFullname(user.fullname);
    setUsername(user.username);
    setEmail(user.email);
    setRole(user.role);
    setStatus(user.status);
    setImageFile(null);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      const userDocRef = doc(db, 'users', editingUser.id);
      let newImageUrl = editingUser.imageUrl;

      if (imageFile) {
        const storageRef = ref(storage, `userImages/${editingUser.id}`);
        await uploadBytes(storageRef, imageFile);
        newImageUrl = await getDownloadURL(storageRef);
      }

      await updateDoc(userDocRef, {
        fullname,
        username,
        email,
        role,
        status,
        imageUrl: newImageUrl,
      });
      setEditingUser(null);
      setFullname('');
      setUsername('');
      setEmail('');
      setRole('Admin');
      setStatus('Active');
      setImageFile(null);
      fetchUsers();
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setFullname('');
    setUsername('');
    setEmail('');
    setRole('Admin');
    setStatus('Active');
    setImageFile(null);
  };

  // Filtered users based on search query
  const filteredUsers = users.filter(user => 
    user.fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-full bg-white p-8 ">
      <h2 className="text-2xl font-bold text-gray">User Management</h2>
  
      {/* Responsive Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg flex items-center">
          <FaUserShield className="text-4xl text-blue-500 mr-4" />
          <div>
            <h3 className="font-bold text-lg text-white">Admin(s)</h3>
            <p className="text-gray-300">{userCounts.Admin}</p>
          </div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg flex items-center">
          <FaUserGraduate className="text-4xl text-green-500 mr-4" />
          <div>
            <h3 className="font-bold text-lg text-white">Adviser(s)</h3>
            <p className="text-gray-300">{userCounts.Adviser}</p>
          </div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg flex items-center">
          <FaUserTie className="text-4xl text-yellow-500 mr-4" />
          <div>
            <h3 className="font-bold text-lg text-white">Faculty(ies)</h3>
            <p className="text-gray-300">{userCounts.Faculty}</p>
          </div>
        </div>
      </div>
  
      {/* Flex container for Add User button and Search Bar */}
      <div className="mt-4 flex justify-between ">
        {currentUserRole === 'Admin' ? (
          <Link to="/add-user" className="w-32 text-center bg-green-500 text-white p-2 rounded">
            Add User
          </Link>
        ) : (
          <p className="text-red-600">You do not have permission to add users.</p>
        )}
  
        <input
          type="text"
          placeholder="Search by name, username, or email"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border border-gray-300 rounded-md bg-gray-700 text-white rounded w-3/4 ml-4"
        />
      </div>
  
      {/* Users Table */}
      <table className="min-w-full bg-gray-800 text-white mt-4 ">
        <thead>
          <tr className="bg-gray-700 ">
            <th className=" p-3">Fullname</th>
            <th className=" p-2">Username</th>
            <th className=" p-2">Email</th>
            <th className=" p-2">Role</th>
            <th className=" p-2">Status</th>
            <th className=" p-2">Image</th>
            {currentUserRole === 'Admin' && <th className=" p-2">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(user => (
            <tr key={user.id} className="bg-gray-800">
              <td className=" p-3">{user.fullname}</td>
              <td className=" p-2">{user.username}</td>
              <td className=" p-2">{user.email}</td>
              <td className=" p-2">{user.role}</td>
              <td className=" p-2">{user.status}</td>
              <td className=" p-2">
                <img src={user.imageUrl} alt="Profile" className="h-10 w-10 rounded-full" />
              </td>
              {currentUserRole === 'Admin' && (
                <td className=" p-3">
                  <button 
                    className="text-blue-400 hover:underline" 
                    onClick={() => handleEditUser(user)}>
                    Edit
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
  
      {/* Edit User Form */}
      {editingUser && (
        <form onSubmit={handleSaveEdit} className="w-full mx-auto mt-4 p-4 border border-black bg-gray-800 rounded">
          <h3 className="text-xl font-bold text-white">Edit User</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="mb-4">
              <label className="block text-white" htmlFor="fullname">Fullname</label>
              <input
                type="text"
                id="fullname"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                className="p-2 border border-gray-300 rounded-md bg-gray-700 text-white rounded w-full"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-white" htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="p-2 border border-gray-300 rounded-md bg-gray-700 text-white rounded w-full"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-white" htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="p-2 border border-gray-300 rounded-md bg-gray-700 text-white rounded w-full"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-white" htmlFor="role">Role</label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="p-2 border border-gray-300 rounded-md bg-gray-700 text-white rounded w-full"
                required
              >
                <option value="Admin">Admin</option>
                <option value="Adviser">Adviser</option>
                <option value="Faculty">Faculty</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-white" htmlFor="status">Status</label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="p-2 border border-gray-300 rounded-md bg-gray-700 text-white rounded w-full"
                required
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-white" htmlFor="image">Image</label>
              <input
                type="file"
                id="image"
                onChange={(e) => e.target.files && setImageFile(e.target.files[0])}
                className="p-2 border border-gray-300 rounded-md bg-gray-700 text-white rounded w-full"
              />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button 
              type="button" 
              onClick={handleCancelEdit} 
              className="mr-2 p-2 bg-gray-700 text-white rounded">
              Cancel
            </button>
            <button type="submit" className="p-2 bg-green-500 text-white rounded">
              Save Changes
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default UserManagement;
