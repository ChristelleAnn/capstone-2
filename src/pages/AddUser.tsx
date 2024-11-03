import React, { useState } from 'react';
import { db, auth, storage } from '../firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';

const AddUserPage: React.FC = () => {
  const navigate = useNavigate();
  const [fullname, setFullname] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Admin'); // Default role set to Admin
  const [image, setImage] = useState<File | null>(null);

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid; // Get the newly created user ID (uid)

      // Initialize imageUrl
      let downloadURL = '';

      // Upload image to Firebase Storage
      if (image) {
        const storageRef = ref(storage, `users/${userId}/profile.jpg`);
        await uploadBytes(storageRef, image);
        downloadURL = await getDownloadURL(storageRef); // Get the download URL of the image
      }

      // Add user details to Firestore using the newly created user ID as the document ID
      await setDoc(doc(db, 'users', userId), {
        fullname,
        username,
        email,
        role,
        imageUrl: downloadURL, // Store the image URL in Firestore
        status: "Active"
      });

      // Clear form
      setFullname('');
      setUsername('');
      setEmail('');
      setPassword('');
      setRole('Admin'); // Reset role to default
      setImage(null);

      // Navigate back to user management page
      navigate('/user-management'); // Adjust this path as necessary
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  return (
    <div className=" bg-gradient-to-br from-blue-50 to-green-50 text-gray-700 min-h-screen p-8"> {/* Match the background color to UserManagement */}
      <h2 className="text-2xl font-bold text-gray-800">Add User</h2>
      <form onSubmit={handleAddUser} className="bg-white p-6 rounded-lg shadow-md mt-4"> {/* Use white background for form */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Fullname"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            className="p-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800" // Adjusted color
            required
          />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="p-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800" // Adjusted color
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800" // Adjusted color
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800" // Adjusted color
            required
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="p-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800" // Adjusted color
            required
          >
            <option value="Admin">Admin</option>
            <option value="Adviser">Adviser</option>
            <option value="Faculty">Faculty</option>
          </select>
          <input
            type="file"
            onChange={handleImageChange}
            className="p-2 border border-gray-300 rounded-md bg-gray-50 text-gray-800" // Adjusted color
            accept="image/*"
          />
        </div>
        <button type="submit" className="mt-4 w-40 text-center bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 flex justify-center"> {/* Match button color */}
          Add User
        </button>
      </form>
    </div>
  );
};

export default AddUserPage;
