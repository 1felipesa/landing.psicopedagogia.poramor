import { supabase } from '../lib/supabase';

export type Document = {
    id: string;
    patient_id: string;
    title: string;
    url: string;
    type: 'report' | 'activity' | 'other';
    created_at: string;
    size_bytes?: number;
};

export const uploadDocument = async (file: File, patientId: string, title: string, type: 'report' | 'activity' | 'other') => {
    // 1. Upload to Storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${patientId}/${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError, data } = await supabase.storage
        .from('patient-documents')
        .upload(filePath, file);

    if (uploadError) throw uploadError;

    // 2. Get Public URL
    const { data: { publicUrl } } = supabase.storage
        .from('patient-documents')
        .getPublicUrl(filePath);

    // 3. Save Metadata to Table
    const { error: dbError } = await supabase
        .from('documents')
        .insert({
            patient_id: patientId,
            title: title,
            url: publicUrl,
            type: type,
            size_bytes: file.size
        });

    if (dbError) throw dbError;

    return publicUrl;
};

export const deleteDocument = async (id: string, url: string) => {
    // Extract path from URL for storage deletion
    // e.g., https://.../storage/v1/object/public/patient-documents/USER_ID/FILE.pdf
    const path = url.split('patient-documents/')[1];

    if (path) {
        await supabase.storage.from('patient-documents').remove([path]);
    }

    const { error } = await supabase.from('documents').delete().eq('id', id);
    if (error) throw error;
};
