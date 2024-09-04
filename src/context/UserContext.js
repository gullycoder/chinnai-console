import React, { useReducer, createContext, useEffect } from "react";
import { db, storage } from "../firebase/firebase";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { query, addDoc, getDocs, collection, where, getDoc, doc, setDoc, updateDoc, writeBatch, arrayUnion, arrayRemove, serverTimestamp, deleteDoc } from "firebase/firestore";

const UserContext = createContext();

const usersReducer = (state, action) => {
    switch (action.type) {
        case "CREATE_USER":
            return [...state, action.payload];
        case "UPDATE_USER":
            return state.map(user => {
                if (user.id === action.payload.id) {
                    return action.payload;
                } else {
                    return user;
                }
            });
        case "DELETE_USER":
            return state.filter(user => user.id !== action.payload.id);
        case "SET_USERS":
            return action.payload;
    }
};
const currentUserReducer = (state, action) => {
    switch (action.type) {
        case "SET_CURRENT_USER":
            return action.payload;
    }
};
const rulesReducer = (state, action) => {
    switch (action.type) {
        case "GET_RULES":
            return action.payload;
        case "UPDATE_RULES":
            return { ...state, ...action.payload };
        default:
            return state;
    }
};


const UserProvider = ({ children }) => {
    const [currentUser, currentUserDispatch] = useReducer(currentUserReducer, {});
    const [users, usersDispatch] = useReducer(usersReducer, []);
    const [rules, rulesDispatch] = useReducer(rulesReducer, {});

    useEffect(() => {
        const fetchRules = async () => {
            const docRef = doc(db, "rules", "userRules");
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                rulesDispatch({ type: "GET_RULES", payload: docSnap.data() });
            } else {
                console.log("No rules found");
            }
        };
        fetchRules();
    }, []);

    const uploadFileToStorage = async (localFileUrl, storageDocId) => {
        try {
            const imagesRef = ref(storage, storageDocId);
            const img = await fetch(localFileUrl)
            const bytes = await img.blob()
            await uploadBytes(imagesRef, bytes);
            const url = await getDownloadURL(imagesRef);
            return url;
        }
        catch (error) {
            console.log("The Error part Run", error);
        }
    };

    const setCurrentUser = user => {
        currentUserDispatch({ type: "SET_CURRENT_USER", payload: user });
    };

    const resetCurrentUser = async () => {
        const updatedUser = users.filter(u => u.id === currentUser.id)[0];
        await AsyncStorage.setItem("userToken", JSON.stringify(updatedUser));
        currentUserDispatch({ type: "SET_CURRENT_USER", payload: updatedUser });
    };

    const updateCurrentUserPin = async (currentPin, newPin) => {
        if (currentPin === currentUser.pin) {
            try {
                const updatedUser = {
                    ...currentUser,
                    pin: newPin
                };
                const result = await updateUser(updatedUser);
                if (result.error) {
                    return result;
                } else {
                    await AsyncStorage.setItem("userToken", JSON.stringify(updatedUser));
                    currentUserDispatch({ type: "SET_CURRENT_USER", payload: updatedUser });
                    return { error: false };
                }
            } catch (error) {
                return { error: error.message };
            }
        } else {
            return { error: "Invalid current pin" };
        }
    };


    const fetchUsers = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "consoleUsers"));
            const users = querySnapshot.docs.map(doc => doc.data());
            usersDispatch({ type: "SET_USERS", payload: users });
        } catch (error) {
            console.log(error);
        }
    };

    const createUser = async (user) => {
        let newUser = {};
        try {
            const q1 = query(collection(db, "consoleUsers"), where("phone", "==", user.phone));
            const querySnap = await getDocs(q1);
            querySnap.forEach((doc) => {
                newUser = { ...doc.data() };
            });
            if (newUser.phone) {
                return {
                    error: "User already exists"
                };
            }
            newUser = {
                ...user,
                createdAt: serverTimestamp()
            };
            const docRef = await addDoc(collection(db, "consoleUsers"), newUser);
            await setDoc(doc(db, "consoleUsers", docRef.id), { id: docRef.id }, { merge: true });
            newUser.id = docRef.id;
            usersDispatch({
                type: "CREATE_USER",
                payload: newUser
            });
            return {
                user: newUser
            };
        } catch (error) {
            console.log(error);
            return {
                error: error.message
            };
        }

    };

    const updateUser = async (user) => {
        try {
            await setDoc(doc(db, "consoleUsers", user.id), user, { merge: true });
            usersDispatch({
                type: "UPDATE_USER",
                payload: user
            });
            return {
                user: user
            };
        } catch (error) {
            console.log(error);
            return {
                error: error.message
            };
        }
    }

    const updateRules = async (key, value) => {
        try {
            await setDoc(doc(db, "rules", "userRules"), { [key]: value }, { merge: true });
            rulesDispatch({
                type: "UPDATE_RULES",
                payload: { [key]: value }
            });
            return {
                error: false
            };
        } catch (error) {
            console.log(error);
            return {
                error: error.message
            };
        }
    }

    const deleteUser = async (user) => {
        try {
            await deleteDoc(doc(db, "consoleUsers", user.id));
            usersDispatch({
                type: "DELETE_USER",
                payload: user
            });
            return {
                user: user
            };
        } catch (error) {
            console.log(error);
            return {
                error: error.message
            };
        }
    };



    return (
        <UserContext.Provider value={{ currentUser, rules, users, setCurrentUser, resetCurrentUser, updateCurrentUserPin, fetchUsers, createUser, updateUser, deleteUser, updateRules, uploadFileToStorage }}>
            {children}
        </UserContext.Provider>
    );
};

export { UserContext, UserProvider };