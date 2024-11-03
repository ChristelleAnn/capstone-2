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

      if (currentUser && email !== editingUser.email) {
        if (!reauthPassword) {
          alert("Please enter your password to confirm email change.");
          return;
        }

        const credential = EmailAuthProvider.credential(currentUser.email!, reauthPassword);
        await reauthenticateWithCredential(currentUser, credential);
        await updateEmail(currentUser, email);
      }

      if (password && currentUser) {
        await updatePassword(currentUser, password);
      }

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
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">User Management</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <button
          onClick={() => setActiveRoleFilter(activeRoleFilter === 'Admin' ? null : 'Admin')}
          className="p-4 border rounded-2xl shadow-lg bg-gradient-to-r from-blue-500 to-indigo-600 transform hover:scale-105 flex items-center transition-transform"
        >
          <FaUserShield className="text-4xl text-white mr-4" />
          <div>
            <h3 className="font-bold text-2xl text-white">Admin(s)</h3>
            <p className="text-white">{userCounts.Admin}</p>
          </div>
        </button>
        <button
          onClick={() => setActiveRoleFilter(activeRoleFilter === 'Adviser' ? null : 'Adviser')}
          className="p-4 border rounded-2xl shadow-lg bg-gradient-to-r from-green-400 to-teal-500 transform hover:bg-green-100 hover:scale-105 flex items-center transition-transform"
        >
          <FaUserGraduate className="text-4xl text-white mr-4" />
          <div>
            <h3 className="font-bold text-2xl text-white">Adviser(s)</h3>
            <p className="text-white">{userCounts.Adviser}</p>
          </div>
        </button>
        <button
          onClick={() => setActiveRoleFilter(activeRoleFilter === 'Faculty' ? null : 'Faculty')}
          className="p-4 border rounded-2xl shadow-lg bg-gradient-to-r from-yellow-400 to-orange-500 transform hover:bg-yellow-100 hover:scale-105 flex items-center transition-transform"
        >
          <FaUserTie className="text-4xl text-white mr-4" />
          <div>
            <h3 className="font-bold text-2xl text-white">Faculty(ies)</h3>
            <p className="text-white">{userCounts.Faculty}</p>
          </div>
        </button>
      </div>

      <div className="flex justify-between items-center mt-8">
        {currentUserRole === 'Admin' ? (
          <Link to="/add-user" className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700">
            Add User
          </Link>
        ) : (
          <p className="text-red-600 font-medium">You do not have permission to add users.</p>
        )}

        <input
          type="text"
          placeholder="Search by name, username, or email"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="py-2 px-4 border border-gray-300 rounded-lg w-3/4 sm:w-1/2"
        />
      </div>

      <table className="w-full mt-6 bg-white shadow-lg rounded-lg overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-4 text-left text-gray-600">Fullname</th>
            <th className="p-4 text-left text-gray-600">Username</th>
            <th className="p-4 text-left text-gray-600">Email</th>
            <th className="p-4 text-left text-gray-600">Role</th>
            <th className="p-4 text-left text-gray-600">Status</th>
            <th className="border border-gray-300 p-2">Image</th>
            <th className="p-4 text-left text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id} className="border-t hover:bg-gray-100 transition-colors">
              <td className="p-4">{user.fullname}</td>
              <td className="p-4">{user.username}</td>
              <td className="p-4">{user.email}</td>
              <td className="p-4">{user.role}</td>
              <td className="p-4">{user.status}</td>
              <td className="border border-gray-300 p-2">
                <img src={user.imageUrl} alt="Profile" className="h-10 w-10 rounded-full" />
              </td>
              {currentUserRole === 'Admin' && (
                <td className="border border-gray-300 p-2">
                <button
                  onClick={() => handleEditUser(user)}
                  className="bg-blue-500 text-white py-1 px-3 rounded-lg hover:bg-blue-600 mr-2"
                >
                  Edit
                </button>
              </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {editingUser && (
        <form onSubmit={handleSaveEdit} className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Edit User</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              className="py-2 px-4 border border-gray-300 rounded-lg"
              placeholder="Fullname"
              required
            />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="py-2 px-4 border border-gray-300 rounded-lg"
              placeholder="Username"
              required
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="py-2 px-4 border border-gray-300 rounded-lg"
              placeholder="Email"
              required
            />
            <input
              type="password"
              placeholder="Password (leave blank to keep current)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg"
            />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="py-2 px-4 border border-gray-300 rounded-lg"
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
              className="p-2 border border-gray-300 rounded-lg"
            />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="py-2 px-4 border border-gray-300 rounded-lg"
              required
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <input
              type="file"
              onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
              className="py-2 px-4 border border-gray-300 rounded-lg"
              accept="image/*"
            />
          </div>
          <div className="mt-4 flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleCancelEdit}
              className="py-2 px-4 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Save
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default UserManagement;
