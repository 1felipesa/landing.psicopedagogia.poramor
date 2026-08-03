import { db, storage } from './firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { collection, addDoc, doc, deleteDoc as firestoreDeleteDoc } from 'firebase/firestore';

export type Document = {
    id: string;
    patient_id: string;
    title: string;
    url: string;
    type: 'report' | 'activity' | 'signed_contract' | 'other';
    created_at: string;
    size_bytes?: number;
    storage_path?: string;
    uploaded_by?: 'patient' | 'admin';
};

export const uploadDocument = async (
    file: File,
    patientId: string,
    title: string,
    type: 'report' | 'activity' | 'signed_contract' | 'other',
    uploadedBy: 'patient' | 'admin' = 'admin'
) => {
    // 1. Upload to Storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
    const storagePath = `patient-documents/${patientId}/${fileName}`;
    const fileRef = ref(storage, storagePath);

    await uploadBytes(fileRef, file);

    // 2. Get Public Download URL
    const publicUrl = await getDownloadURL(fileRef);

    // 3. Save Metadata to Firestore
    await addDoc(collection(db, 'documents'), {
        patient_id: patientId,
        title: title,
        url: publicUrl,
        type: type,
        size_bytes: file.size,
        storage_path: storagePath,
        uploaded_by: uploadedBy,
        created_at: new Date().toISOString()
    });

    return publicUrl;
};

export const deleteDocument = async (id: string, url: string, storagePath?: string) => {
    // 1. Delete from Storage
    let path = storagePath;
    if (!path) {
        // Fallback: extract storage path from Firebase Storage URL
        const match = url.match(/\/o\/(.+)\?/);
        if (match && match[1]) {
            path = decodeURIComponent(match[1]);
        }
    }

    if (path) {
        try {
            const fileRef = ref(storage, path);
            await deleteObject(fileRef);
        } catch (storageError) {
            console.error("Error deleting file from storage, proceeding with DB delete:", storageError);
        }
    }

    // 2. Delete metadata from Firestore
    const docRef = doc(db, 'documents', id);
    await firestoreDeleteDoc(docRef);
};
