import React, { useState, useEffect } from 'react';
import { 
    BookOpen, 
    Plus, 
    Eye, 
    EyeOff, 
    Calendar,
    Save, 
    Trash2,
    Clock,
    Edit2,
    X,
    Check
} from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';
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

    // Edit state
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editContent, setEditContent] = useState('');
    const [updating, setUpdating] = useState(false);

    const { showToast } = useToast();

    useEffect(() => {
        fetchEvolutions();
    }, [patientId]);

    const fetchEvolutions = async () => {
        try {
            const q = query(
                collection(db, 'patient_evolutions'),
                where('patient_id', '==', patientId)
            );
            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map(docSnap => ({
                id: docSnap.id,
                ...docSnap.data()
            })) as Evolution[];

            // Sort in memory by created_at desc (avoids Firestore composite index error)
            data.sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));
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

    const handleStartEdit = (evo: Evolution) => {
        setEditingId(evo.id);
        setEditContent(evo.content);
    };

    const handleUpdate = async (id: string) => {
        if (!editContent.trim()) return;
        setUpdating(true);
        try {
            const evoRef = doc(db, 'patient_evolutions', id);
            await updateDoc(evoRef, { content: editContent.trim() });
            showToast('Registro atualizado com sucesso!');
            setEditingId(null);
            fetchEvolutions();
        } catch (error: any) {
            showToast('Erro ao atualizar: ' + error.message, 'error');
        } finally {
            setUpdating(false);
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
            showToast(currentStatus ? 'Registro alterado para Privado' : 'Registro alterado para Público (Paciente vê)');
            fetchEvolutions();
        } catch (error: any) {
            showToast('Erro ao atualizar privacidade: ' + error.message, 'error');
        }
    };

    if (loading) return <div className="p-4 text-center text-slate-400">Carregando evolução...</div>;

    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl transition-colors shrink-0">
                        <BookOpen size={20} className="sm:w-6 sm:h-6" />
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold text-on-surface transition-colors">Diário de Bordo</h2>
                </div>
                {!isAdding && (
                    <Button onClick={() => setIsAdding(true)} className="!py-2 flex items-center justify-center gap-2 w-full xs:w-auto text-xs sm:text-sm">
                        <Plus size={16} /> Nova Sessão
                    </Button>
                )}
            </div>

            {isAdding && (
                <div className="bg-surface-variant/30 dark:bg-slate-900/40 border border-outline-variant dark:border-slate-700 p-4 sm:p-6 rounded-[20px] sm:rounded-[24px] space-y-4 animate-fadeIn transition-colors">
                    <Textarea 
                        placeholder="Descreva o que aconteceu na sessão, comportamentos observados e evoluções..."
                        value={newContent}
                        onChange={(e) => setNewContent(e.target.value)}
                        className="min-h-[120px] sm:min-h-[150px] text-xs sm:text-sm"
                    />
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                        <button 
                            onClick={() => setIsPublic(!isPublic)}
                            className={`flex items-center justify-center sm:justify-start gap-2 text-xs sm:text-sm font-bold transition-colors p-2 sm:p-0 rounded-xl sm:rounded-none ${isPublic ? 'text-green-600 dark:text-green-400' : 'text-on-surface-variant hover:text-on-surface'}`}
                        >
                            {isPublic ? <Eye size={16} /> : <EyeOff size={16} />}
                            {isPublic ? 'Público (Paciente vê)' : 'Privado (Só Raiane vê)'}
                        </button>
                        <div className="flex gap-2 justify-end">
                            <Button variant="outline" onClick={() => setIsAdding(false)} disabled={saving} className="text-xs sm:text-sm flex-1 sm:flex-initial">Cancelar</Button>
                            <Button onClick={handleSave} isLoading={saving} disabled={!newContent.trim()} className="text-xs sm:text-sm flex-1 sm:flex-initial">Salvar Registro</Button>
                        </div>
                    </div>
                </div>
            )}

            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-4 sm:before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-outline-variant dark:before:via-slate-700 before:to-transparent transition-colors">
                {evolutions.length === 0 ? (
                    <div className="text-center py-8 sm:py-12 bg-surface-variant/20 rounded-[20px] sm:rounded-[24px] border border-dashed border-outline-variant ml-2 sm:ml-4 transition-colors">
                        <p className="text-on-surface-variant text-xs sm:text-sm italic transition-colors">Nenhuma sessão registrada ainda.</p>
                    </div>
                ) : (
                    evolutions.map((evo) => (
                        <div key={evo.id} className="relative pl-10 sm:pl-12 group">
                            {/* Dot on timeline */}
                            <div className="absolute left-0 top-1 w-8 h-8 sm:w-10 sm:h-10 bg-surface border-2 border-outline-variant dark:border-slate-700 rounded-full flex items-center justify-center group-hover:border-purple-500 transition-all z-10 shadow-2xs">
                                <Calendar size={14} className="text-on-surface-variant group-hover:text-purple-500 transition-colors sm:w-4 sm:h-4" />
                            </div>

                            <div className="bg-surface-variant/20 dark:bg-slate-800/80 p-3.5 sm:p-5 rounded-[20px] sm:rounded-[24px] border border-outline-variant dark:border-slate-700/80 shadow-2xs hover:shadow-sm transition-all">
                                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-on-surface-variant transition-colors min-w-0">
                                        <Clock size={13} className="shrink-0" />
                                        <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-colors">
                                            {format(parseISO(evo.created_at), "dd 'de' MMM, yyyy 'às' HH:mm", { locale: ptBR })}
                                        </span>
                                        <span className={`text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${evo.is_public ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800/50' : 'bg-surface-variant text-on-surface-variant border border-outline-variant'}`}>
                                            {evo.is_public ? 'Público' : 'Privado'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-0.5 bg-surface border border-outline-variant/60 p-1 rounded-xl shrink-0 ml-auto shadow-2xs">
                                        <button 
                                            onClick={() => togglePublic(evo.id, evo.is_public)}
                                            className={`p-1.5 rounded-lg hover:bg-surface-variant transition-colors ${evo.is_public ? 'text-green-600 dark:text-green-400' : 'text-on-surface-variant hover:text-on-surface'}`}
                                            title={evo.is_public ? 'Alterar para Privado' : 'Alterar para Público'}
                                        >
                                            {evo.is_public ? <Eye size={16} /> : <EyeOff size={16} />}
                                        </button>
                                        <button 
                                            onClick={() => handleStartEdit(evo)}
                                            className="p-1.5 text-on-surface-variant hover:text-purple-600 dark:hover:text-purple-400 hover:bg-surface-variant rounded-lg transition-colors"
                                            title="Editar Registro"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(evo.id)}
                                            className="p-1.5 text-on-surface-variant hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                            title="Excluir Registro"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                {editingId === evo.id ? (
                                    <div className="space-y-3 pt-2">
                                        <Textarea
                                            value={editContent}
                                            onChange={(e) => setEditContent(e.target.value)}
                                            className="min-h-[100px] text-xs sm:text-sm"
                                        />
                                        <div className="flex justify-end gap-2">
                                            <Button size="sm" variant="outline" onClick={() => setEditingId(null)} disabled={updating} className="text-xs">
                                                <X size={14} className="mr-1" /> Cancelar
                                            </Button>
                                            <Button size="sm" onClick={() => handleUpdate(evo.id)} isLoading={updating} disabled={!editContent.trim()} className="text-xs">
                                                <Check size={14} className="mr-1" /> Salvar Edição
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-on-surface whitespace-pre-wrap leading-relaxed text-xs sm:text-sm transition-colors">
                                        {evo.content}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default PatientEvolutions;
