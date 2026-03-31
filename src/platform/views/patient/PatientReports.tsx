import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { FileText, Download, File, Loader } from 'lucide-react';

type Document = {
    id: string;
    title: string;
    url: string;
    created_at: string;
    type: string;
};

const PatientReports: React.FC = () => {
    const { user } = useAuth();
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const fetchDocs = async () => {
            try {
                const { data } = await supabase
                    .from('documents')
                    .select('*')
                    .eq('patient_id', user.id)
                    .order('created_at', { ascending: false });

                if (data) setDocuments(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchDocs();
    }, [user]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-normal text-slate-800 dark:text-white transition-colors">Relatórios e Documentos</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1 transition-colors">Acesse materiais, laudos e atividades compartilhadas.</p>
            </div>

            {documents.length === 0 ? (
                <div className="bg-white dark:bg-slate-800 rounded-[24px] border border-slate-100 dark:border-slate-700 p-12 text-center shadow-sm transition-colors">
                    <div className="bg-slate-50 dark:bg-slate-900/50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300 dark:text-slate-600 transition-colors">
                        <FileText size={40} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-700 dark:text-white mb-2 transition-colors">Nenhum documento encontrado</h3>
                    <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto transition-colors">
                        Assim que a psicopedagoga compartilhar laudos ou atividades, eles aparecerão aqui.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {documents.map((doc) => (
                        <div key={doc.id} className="bg-white dark:bg-slate-800 rounded-[24px] border border-slate-100 dark:border-slate-700 p-6 shadow-sm hover:shadow-md3-1 transition-all group relative">
                            <div className="absolute top-6 right-6 p-2 bg-slate-50 dark:bg-slate-900/50 rounded-xl text-slate-400 dark:text-slate-500 transition-colors">
                                <File size={20} />
                            </div>

                            <div className="mt-2 mb-4">
                                <span className="inline-block px-3 py-1 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-xs font-bold uppercase rounded-full mb-3 transition-colors">
                                    {doc.type === 'report' ? 'Relatório' : 'Atividade'}
                                </span>
                                <h3 className="font-bold text-lg text-slate-800 dark:text-white line-clamp-2 min-h-[56px] transition-colors">
                                    {doc.title}
                                </h3>
                                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium transition-colors">
                                    Adicionado em {new Date(doc.created_at).toLocaleDateString()}
                                </p>
                            </div>

                            <a
                                href={doc.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full py-3 bg-slate-50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-primary-600 dark:hover:bg-primary-600 hover:text-white transition-all text-center flex items-center justify-center gap-2"
                            >
                                <Download size={18} />
                                Baixar Arquivo
                            </a>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PatientReports;
