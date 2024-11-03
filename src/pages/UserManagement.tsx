import React, { useEffect, useState } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { getAuth, onAuthStateChanged, updatePassword, updateEmail, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
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
  const [searchQuery, setSearchQuery] = useState<string>(''); 
  const [activeRoleFilter, setActiveRoleFilter] = useState<string | null>(null);

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [fullname, setFullname] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); 
  const [role, setRole] = useState('Admin');
  const [status, setStatus] = useState('Active');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [reauthPassword, setReauthPassword] = useState('');

  const [userCounts, setUserCounts] = useState({ Admin: 0, Adviser: 0, Faculty: 0 });

  const fetchUsers = async () => {
    const usersCollection = collection(db, 'users');
    const usersSnapshot = await getDocs(usersCollection);
    const usersList: User[] = usersSnapshot.docs.map((doc) => ({
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
    setPassword(''); 
    setRole(user.role);
    setStatus(user.status);
    setImageFile(null);
    setReauthPassword('');
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    const userDocRef = doc(db, 'users', editingUser.id);
    const auth = getAuth();
    const currentUser = auth.currentUser;
    let newImageUrl = editingUser.imageUrl;

    try {
      // Upload a new image if one is selected
      if (imageFile) {
        const storageRef = ref(storage, `userImages/${editingUser.id}`);
        await uploadBytes(storageRef, imageFile);
        newImageUrl = await getDownloadURL(storageRef);
      }

      // Update user details in Firestore
      await updateDoc(userDocRef, {
        fullname,
        username,
        email,
        role,
        status,
        imageUrl: newImageUrl,
      });

      // Reauthenticate if email has changed
      if (currentUser && email !== editingUser.email) {
        if (!reauthPassword) {
          alert("Please enter your password to confirm email change.");
          return;
        }

        const credential = EmailAuthProvider.credential(currentUser.email!, reauthPassword);
        await reauthenticateWithCredential(currentUser, credential);
        await updateEmail(currentUser, email);
      }

      // Update password if a new password is provided
      if (password && currentUser) {
        await updatePassword(currentUser, password);
      }

      // Reset the form state
      setEditingUser(null);
      setFullname('');
      setUsername('');
      setEmail('');
      setPassword('');
      setRole('Admin');
      setStatus('Active');
      setImageFile(null);
      setReauthPassword('');
      fetchUsers();

    } catch (error) {
      console.error("Error updating user:", error);
      alert("An error occurred while saving. Please reauthenticate if necessary and try again.");
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setFullname('');
    setUsername('');
    setEmail('');
    setPassword(''); 
    setRole('Admin');
    setStatus('Active');
    setImageFile(null);
    setReauthPassword('');
  };

  const filteredUsers = users.filter((user) => {
    const matchesQuery = user.fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = activeRoleFilter ? user.role === activeRoleFilter : true;
    return matchesQuery && matchesRole;
  });

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-center">User Management</h2>

      {/* Responsive Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        <button 
          onClick={() => setActiveRoleFilter(activeRoleFilter === 'Admin' ? null : 'Admin')} 
          className="p-4 border rounded shadow bg-white flex items-center focus:outline-none transform hover:scale-105 transition-transform"
        >
          <FaUserShield className="text-4xl text-blue-500 mr-4" />
          <div>
            <h3 className="font-bold text-lg">Admin(s)</h3>
            <p className="text-gray-600">{userCounts.Admin}</p>
          </div>
        </button>
        <button 
          onClick={() => setActiveRoleFilter(activeRoleFilter === 'Adviser' ? null : 'Adviser')} 
          className="p-4 border rounded shadow bg-white flex items-center focus:outline-none transform hover:scale-105 transition-transform"
        >
          <FaUserGraduate className="text-4xl text-green-500 mr-4" />
          <div>
            <h3 className="font-bold text-lg">Adviser(s)</h3>
            <p className="text-gray-600">{userCounts.Adviser}</p>
          </div>
        </button>
        <button 
          onClick={() => setActiveRoleFilter(activeRoleFilter === 'Faculty' ? null : 'Faculty')} 
          className="p-4 border rounded shadow bg-white flex items-center focus:outline-none transform hover:scale-105 transition-transform"
        >
          <FaUserTie className="text-4xl text-yellow-500 mr-4" />
          <div>
            <h3 className="font-bold text-lg">Faculty(ies)</h3>
            <p className="text-gray-600">{userCounts.Faculty}</p>
          </div>
        </button>
      </div>

      {/* Flex container for Add User button and Search Bar */}
      <div className="flex justify-between items-center mt-4">
        {currentUserRole === 'Admin' ? (
          <Link to="/add-user" className="bg-green-500 text-white p-2 rounded">
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
          className="p-2 border border-gray-300 rounded w-3/4 ml-4"
        />
      </div>

      {/* Users Table */}
      <table className="min-w-full border border-gray-300 mt-4">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 p-2">Fullname</th>
            <th className="border border-gray-300 p-2">Username</th>
            <th className="border border-gray-300 p-2">Email</th>
            <th className="border border-gray-300 p-2">Role</th>
            <th className="border border-gray-300 p-2">Status</th>
            <th className="border border-gray-300 p-2">Image</th>
            {currentUserRole === 'Admin' && <th className="border border-gray-300 p-2">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td className="border border-gray-300 p-2">{user.fullname}</td>
              <td className="border border-gray-300 p-2">{user.username}</td>
              <td className="border border-gray-300 p-2">{user.email}</td>
              <td className="border border-gray-300 p-2">{user.role}</td>
              <td className="border border-gray-300 p-2">{user.status}</td>
              <td className="border border-gray-300 p-2">
                <img src={user.imageUrl} alt="Profile" className="h-10 w-10 rounded-full" />
              </td>
              {currentUserRole === 'Admin' && (
                <td className="border border-gray-300 p-2">
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() => handleEditUser(user)}
                  >
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
        <form onSubmit={handleSaveEdit} className="mt-4 p-4 border border-gray-300">
          <h3 className="text-xl font-bold">Edit User</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Fullname"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              className="p-2 border border-gray-300"
              required
            />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="p-2 border border-gray-300"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-2 border border-gray-300"
              required
            />
            <input
              type="password"
              placeholder="Password (leave blank to keep current)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-2 border border-gray-300"
            />
            
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="p-2 border border-gray-300"
              required
            >
              <option value="Admin">Admin</option>
              <option value="Adviser">Adviser</option>
              <option value="Faculty">Faculty</option>
            </select>
            <input
              type="password"
              placeholder="old password"
              value={reauthPassword}
              onChange={(e) => setReauthPassword(e.target.value)}
              className="p-2 border border-gray-300"
            />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="p-2 border border-gray-300"
              required
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="p-2 border border-gray-300"
            />
          </div>
          <div className="mt-4 flex justify-between">
            <button type="submit" className="bg-blue-500 text-white p-2 rounded">
              Save
            </button>
            <button type="button" onClick={handleCancelEdit} className="bg-gray-500 text-white p-2 rounded">
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default UserManagement;