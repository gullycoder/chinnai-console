import React, { useReducer, createContext, useEffect, useContext } from "react";
import { db, storage } from "../firebase/firebase";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { query, addDoc, getDocs, collection, where, getDoc, doc, setDoc, updateDoc, writeBatch, arrayUnion, arrayRemove, serverTimestamp, deleteDoc } from "firebase/firestore";
import { UserContext } from "./UserContext";

const SupplyContext = createContext();

const contractorsReducer = (state, action) => {
    switch (action.type) {
        case "SET_CONTRACTORS":
            return action.payload;
    }
};

const technicalProfilesReducer = (state, action) => {
    switch (action.type) {
        case "SET_TECHNICAL_PROFILES":
            return action.payload;
    }
};

const SupplyProvider = ({ children }) => {
    const [contractors, contractorsDispatch] = useReducer(contractorsReducer, []);
    const [technicalProfiles, technicalProfilesDispatch] = useReducer(technicalProfilesReducer, []);
    const { uploadFileToStorage } = useContext(UserContext);

    const fetchContractors = async () => {
        try {
            const q = query(collection(db, "users"), where("userType", "==", "contractor"));
            const querySnapshot = await getDocs(q);
            if (querySnapshot.empty) {
                console.log("No contractors found");
            } else {
                const contractors = querySnapshot.docs.map(doc => doc.data());
                contractorsDispatch({ type: "SET_CONTRACTORS", payload: contractors });
            }
        } catch (error) {
            console.log(error);
        }
    };

    const createContractor = async (contractor) => {
        try {
            const q1 = query(collection(db, "users"), where("userId", "==", contractor.userId));
            const querySnapshot = await getDocs(q1);
            if (querySnapshot.empty) {
                await setDoc(doc(db, "users", contractor.userId), { ...contractor, createdAt: serverTimestamp() });
                await fetchContractors();
                console.log("Contractor created");
                return { error: false }
            } else {
                return { error: "Contractor already exists" }
            }
        } catch (error) {
            console.log(error);
            return { error: error.message }
        }
    };

    const updateContractor = async (contractor) => {
        try {
            await updateDoc(doc(db, "users", contractor.userId), { ...contractor, updatedAt: serverTimestamp() });
            await fetchContractors();
            console.log("Contractor updated");
            return { error: false }
        } catch (error) {
            console.log(error);
            return { error: error.message }
        }
    };

    const fetchTechnicalProfiles = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "technicalProfiles"));
            if (querySnapshot.empty) {
                console.log("No technical profiles found");
            } else {
                const technicalProfiles = querySnapshot.docs.map(doc => doc.data());
                technicalProfilesDispatch({ type: "SET_TECHNICAL_PROFILES", payload: technicalProfiles });
            }
        } catch (error) {
            console.log(error);
        }
    };

    const createOrUpdateTechnicalProfile = async (technicalProfile) => {
        let newTechnicalProfile = { ...technicalProfile };
        try {
            if (technicalProfile.runningSiteUrls) {
                const runningSiteUrls = technicalProfile.runningSiteUrls.map((url, index) => {
                    const fetchFirebaseUrl = async () => {
                        const firebaseUrl = await uploadFileToStorage(url, technicalProfile.profileId + "_" + "runningSite_" + index);
                        return firebaseUrl;
                    }
                    return fetchFirebaseUrl();
                });
                newTechnicalProfile = { ...technicalProfile, runningSiteUrls: await Promise.all(runningSiteUrls) };
            }
            if (technicalProfile.workOrderUrls) {
                const workOrderUrls = technicalProfile.workOrderUrls.map((url, index) => {
                    const fetchFirebaseUrl = async () => {
                        const firebaseUrl = await uploadFileToStorage(url, technicalProfile.profileId + "_" + "workOrder_" + index);
                        return firebaseUrl;
                    }
                    return fetchFirebaseUrl();
                });
                newTechnicalProfile = { ...newTechnicalProfile, workOrderUrls: await Promise.all(workOrderUrls) };
            }
            if (technicalProfile.runningBillUrls) {
                const runningBillUrls = technicalProfile.runningBillUrls.map((url, index) => {
                    const fetchFirebaseUrl = async () => {
                        const firebaseUrl = await uploadFileToStorage(url, technicalProfile.profileId + "_" + "runningBill_" + index);
                        return firebaseUrl;
                    }
                    return fetchFirebaseUrl();
                });
                newTechnicalProfile = { ...newTechnicalProfile, runningBillUrls: await Promise.all(runningBillUrls) };
            }

            await setDoc(doc(db, "technicalProfiles", technicalProfile.profileId), { ...newTechnicalProfile, updatedAt: serverTimestamp() }, { merge: true });
            await fetchTechnicalProfiles();
            console.log("Technical profile created/updated");
            return { error: false }
        } catch (error) {
            console.log(error);
            return { error: error.message }
        }
    };


    return (
        <SupplyContext.Provider value={{ contractors, technicalProfiles, fetchContractors, createContractor, updateContractor, fetchTechnicalProfiles, createOrUpdateTechnicalProfile }}>
            {children}
        </SupplyContext.Provider>
    );
};

export { SupplyContext, SupplyProvider };