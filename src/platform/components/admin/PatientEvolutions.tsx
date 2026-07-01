import React, { useState, useEffect } from 'react';
import { 
    BookOpen, 
    Plus, 
    Eye, 
    EyeOff, 
    Calendar,
    Save, 
    Trash2,
    Clock
} from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc, addDoc, orderBy } from 'firebase/firestore';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Button from '../ui/Button';
import Textarea from '../ui/Textarea';
import { useToast } from '../../context/ToastContext';

interface Evolution {
    id: string;
    content: string;
    is_public: boolean;
    created_at: string;
    appointment_id?: string;
}

interface PatientEvolutionsProps {
    patientId: string;
}

const PatientEvolutions: React.FC<PatientEvolutionsProps> = ({ patientId }) => {
    const [evolutions, setEvolutions] = useState<Evolution[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [newContent, setNewContent] = useState('');
    const [isPublic, setIsPublic] = useState(false);
    const [saving, setSaving] = useState(false);
    const { showToast } = useToast();

    useEffect(() => {
        fetchEvolutions();
    }, [patientId]);

    const fetchEvolutions = async () => {
        try {
            const q = query(
                collection(db, 'patient_evolutions'),
                where('patient_id', '==', patientId),
                orderBy('created_at', 'desc')
            );
            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map(docSnap => ({
                id: docSnap.id,
                ...docSnap.data()
            })) as Evolution[];
            setEvolutions(data);
        } catch (error: any) {
            console.error('Error fetching evolutions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!newContent.trim()) return;
        setSaving(true);
        try {
            await addDoc(collection(db, 'patient_evolutions'), {
                patient_id: patientId,
                content: newContent.trim(),
                is_public: isPublic,
                created_at: new Date().toISOString()
            });
            
            showToast('Evolução registrada com sucesso!');
            setNewContent('');
            setIsPublic(false);
            setIsAdding(false);
            fetchEvolutions();
        } catch (error: any) {
            showToast('Erro ao salvar: ' + error.message, 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Deseja excluir esta evolução?')) return;
        try {
            await deleteDoc(doc(db, 'patient_evolutions', id));
            showToast('Evolução removida.');
            fetchEvolutions();
        } catch (error: any) {
            showToast('Erro ao excluir: ' + error.message, 'error');
        }
    };

    const togglePublic = async (id: string, currentStatus: boolean) => {
        try {
            const evoRef = doc(db, 'patient_evolutions', id);
            await updateDoc(evoRef, { is_public: !currentStatus });
            fetchEvolutions();
        } catch (error: any) {
            showToast('Erro ao atualizar privacidade: ' + error.message, 'error');
        }
    };

    if (loading) return <div className="p-4 text-center">Carregando evolução...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl transition-colors">
                        <BookOpen size={24} />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white transition-colors">Diário de Bordo</h2>
                </div>
                {!isAdding && (
                    <Button onClick={() => setIsAdding(true)} className="!py-2 flex items-center gap-2">
                        <Plus size={18} /> Nova Sessão
                    </Button>
                )}
            </div>

            {isAdding && (
                <div className="bg-slate-900/40 border border-slate-700 p-6 rounded-[24px] space-y-4 animate-fadeIn transition-colors">
                    <Textarea 
                        placeholder="Descreva o que aconteceu na sessão, comportamentos observados e evoluções..."
                        value={newContent}
                        onChange={(e) => setNewContent(e.target.value)}
                        className="min-h-[150px] dark:bg-slate-800 border-slate-700"
                    />
                    <div className="flex items-center justify-between">
                        <button 
                            onClick={() => setIsPublic(!isPublic)}
                            className={`flex items-center gap-2 text-sm font-bold transition-colors ${isPublic ? 'text-green-600 dark:text-green-400' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400'}`}
                        >
                            {isPublic ? <Eye size={18} /> : <EyeOff size={18} />}
                            {isPublic ? 'Público (Paciente vê)' : 'Privado (Só Raiane vê)'}
                        </button>
                        <div className="flex gap-3">
                            <Button variant="outline" onClick={() => setIsAdding(false)} disabled={saving}>Cancelar</Button>
                            <Button onClick={handleSave} isLoading={saving} disabled={!newContent.trim()}>Salvar Registro</Button>
                        </div>
                    </div>
                </div>
            )}

            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-700 before:to-transparent transition-colors">
                {evolutions.length === 0 ? (
                    <div className="text-center py-12 bg-slate-800/20 rounded-[24px] border border-dashed border-slate-700 ml-4 transition-colors">
                        <p className="text-slate-500 italic transition-colors">Nenhuma sessão registrada ainda.</p>
                    </div>
                ) : (
                    evolutions.map((evo) => (
                        <div key={evo.id} className="relative pl-12 group">
                            {/* Dot on timeline */}
                            <div className="absolute left-0 top-1 w-10 h-10 bg-slate-900 border-2 border-slate-700 rounded-full flex items-center justify-center group-hover:border-purple-400 transition-all z-10">
                                <Calendar size={16} className="text-slate-500 group-hover:text-purple-400 transition-colors" />
                            </div>

                            <div className="bg-slate-800 p-5 rounded-[24px] border border-slate-700 shadow-sm hover:shadow-md transition-all">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2 text-slate-500 transition-colors">
                                        <Clock size={14} />
                                        <span className="text-xs font-bold uppercase tracking-wider transition-colors">
                                            {format(parseISO(evo.created_at), "dd 'de' MMM, yyyy 'às' HH:mm", { locale: ptBR })}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button 
                                            onClick={() => togglePublic(evo.id, evo.is_public)}
                                            className={`p-2 rounded-lg hover:bg-slate-900 transition-colors ${evo.is_public ? 'text-green-400' : 'text-slate-600 hover:text-slate-400'}`}
                                            title={evo.is_public ? 'Público' : 'Privado'}
                                        >
                                            {evo.is_public ? <Eye size={18} /> : <EyeOff size={18} />}
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(evo.id)}
                                            className="p-2 text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                                <div className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed text-sm transition-colors">
                                    {evo.content}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default PatientEvolutions;
