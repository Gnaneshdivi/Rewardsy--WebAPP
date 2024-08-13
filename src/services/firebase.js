import { db } from '../firebase';

export const addDocument = async (collection, data) => {
    try {
        const docRef = await db.collection(collection).add(data);
        return docRef.id;
    } catch (error) {
        console.error("Error adding document: ", error);
    }
};

export const getDocuments = async (collection) => {
    try {
        const snapshot = await db.collection(collection).get();
        const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return docs;
    } catch (error) {
        console.error("Error getting documents: ", error);
    }
};

export const updateDocument = async (collection, id, data) => {
    try {
        await db.collection(collection).doc(id).update(data);
    } catch (error) {
        console.error("Error updating document: ", error);
    }
};

export const deleteDocument = async (collection, id) => {
    try {
        await db.collection(collection).doc(id).delete();
    } catch (error) {
        console.error("Error deleting document: ", error);
    }
};
