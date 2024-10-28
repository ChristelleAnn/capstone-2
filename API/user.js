import { db, auth, storage } from './firebaseConfig.js';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, getDoc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Firestore collection reference
const usersCollection = collection(db, 'users');

// Function to create a new user with Firebase Auth, Firestore, and optional image upload
export const createUser = async (userData) => {
  try {
    // Create user with Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
    const userId = userCredential.user.uid; // Get the user ID from Firebase Auth

    // Initialize imageUrl
    let downloadURL = '';

    // If an image is provided, upload it to Firebase Storage
    if (userData.image) {
      const storageRef = ref(storage, `users/${userId}/profile.jpg`);
      await uploadBytes(storageRef, userData.image);
      downloadURL = await getDownloadURL(storageRef); // Get the download URL of the uploaded image
    }

    // Add user details to Firestore using the userId from Firebase Auth as the document ID
    await setDoc(doc(db, 'users', userId), {
      fullname: userData.fullname,
      username: userData.username,
      email: userData.email,
      role: userData.role,
      imageUrl: downloadURL, // Store the image URL in Firestore if available
      status: 'Active'
    });

    console.log('User created with ID: ', userId);
    return userId; // Return the user ID
  } catch (error) {
    console.error('Error adding user: ', error);
    throw error;
  }
};

// Function to update a user by ID
export const updateUser = async (id, updatedData) => {
  try {
    const userDoc = doc(db, 'users', id);
    await updateDoc(userDoc, updatedData);
    console.log('User updated with ID: ', id);
  } catch (error) {
    console.error('Error updating user: ', error);
    throw error;
  }
};

// Function to patch (partially update) a user by ID
export const patchUser = async (id, partialData) => {
  try {
    const userDoc = doc(db, 'users', id);
    await updateDoc(userDoc, partialData);
    console.log('User partially updated with ID: ', id);
  } catch (error) {
    console.error('Error partially updating user: ', error);
    throw error;
  }
};

// Function to delete a user by ID
export const deleteUser = async (id) => {
  try {
    const userDoc = doc(db, 'users', id);
    await deleteDoc(userDoc);
    console.log('User deleted with ID: ', id);
  } catch (error) {
    console.error('Error deleting user: ', error);
    throw error;
  }
};

// Function to fetch all users
export const fetchUsers = async () => {
  try {
    const snapshot = await getDocs(usersCollection);
    const userRecords = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return userRecords;
  } catch (error) {
    console.error('Error fetching users: ', error);
    throw error;
  }
};

// Function to get a single user by ID
export const getUserById = async (id) => {
  try {
    const userDoc = doc(db, 'users', id);
    const docSnap = await getDoc(userDoc);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      console.log('No such document!');
      return null; // Document not found
    }
  } catch (error) {
    console.error('Error getting user: ', error);
    throw error;
  }
};
