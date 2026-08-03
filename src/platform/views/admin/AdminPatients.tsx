import React, { useState, useEffect } from 'react';
import {
 Search,
 Filter,
 Plus,
 Eye,
 Edit2,
 Trash2,
 X,
 UserPlus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../lib/firebase';
import { collection, query, where, getDocs, doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import Avatar from '../../components/ui/Avatar';

const AdminPatients: React.FC = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [patients, setPatients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showInviteModal, setShowInviteModal] = useState(false);

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            // Fetch profiles that are active patients
            const q = query(
                collection(db, 'profiles'),
                where('role', '==', 'patient')
            );
            const querySnapshot = await getDocs(q);
            const rawProfiles = querySnapshot.docs.map(docSnap => ({
                id: docSnap.id,
                ...docSnap.data()
            })) as any[];

            // Exclude inactive patients from active list
            const profiles = rawProfiles.filter(p => p.status !== 'inactive');

            // For each patient, check if they have anamnesis
            const patientsWithStatus = await Promise.all(profiles.map(async (p) => {
                const docRef = doc(db, 'anamnesis', p.id);
                const docSnap = await getDoc(docRef);
                const anamnesis = docSnap.exists() ? docSnap.data() : null;

                return {
                    ...p,
                    anamnesisStatus: anamnesis?.status || 'pending_anamnesis',
                    lastUpdate: anamnesis?.created_at || p.created_at
                };
            }));

            setPatients(patientsWithStatus);
        } catch (error) {
            console.error('Error fetching patients:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeletePatient = async (id: string, name: string) => {
        if (!window.confirm(`Deseja inativar o paciente "${name || 'Usuário'}"? O perfil será removido da lista ativa, mas todo o histórico clínico será mantido.`)) {
            return;
        }

        try {
            // Inactivate profile in Firestore (Soft Delete)
            await updateDoc(doc(db, 'profiles', id), {
                status: 'inactive',
                updated_at: new Date().toISOString()
            });

            // Update local state
            setPatients(prev => prev.filter(p => p.id !== id));
            alert('Paciente inativado com sucesso! Histórico preservado.');
        } catch (error) {
            console.error('Erro ao inativar paciente:', error);
            alert('Ocorreu um erro ao inativar o paciente. Verifique sua conexão.');
        }
    };

 const filteredPatients = patients.filter(patient =>
 (patient.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
 (patient.email || '').toLowerCase().includes(searchTerm.toLowerCase())
 );

 const getStatusBadge = (status: string) => {
 switch (status) {
 case 'completed':
 return <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 transition-colors">Anamnese Recebida</span>;
 case 'draft':
 return <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 transition-colors">Em Preenchimento</span>;
 default:
 return <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-800 dark:text-slate-300 transition-colors">Aguardando</span>;
 }
 };

 return (
 <div className="space-y-6 animate-fadeIn">
 {/* Header */}
 <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
 <div>
 <h2 className="text-3xl font-normal text-on-surface transition-colors">Meus Pacientes</h2>
 <p className="text-on-surface-variant mt-1 transition-colors">Gerencie as fichas e acompanhe o progresso.</p>
 </div>
 {/* Extended FAB */}
 <button
 onClick={() => setShowInviteModal(true)}
 className="flex items-center justify-center gap-2 bg-primary-100 dark:bg-primary-900/40 text-primary-900 dark:text-primary-300 px-6 py-4 rounded-[16px] font-medium shadow-sm transition-all active:scale-95"
 >
 <Plus size={24} />
 <span>Novo Paciente</span>
 </button>
 </div>

 {/* Invite Modal */}
 {showInviteModal && (
 <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
 <div className="bg-surface rounded-[24px] shadow-2xl w-full max-w-lg p-8 animate-scaleIn relative border border-transparent ">
 <button
 onClick={() => setShowInviteModal(false)}
 className="absolute top-4 right-4 p-2 text-outline hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-background dark:hover:bg-slate-700 transition-colors"
 >
 <X size={20} />
 </button>

 <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/40 text-primary rounded-full flex items-center justify-center mb-6 mx-auto">
 <UserPlus size={32} />
 </div>

 <h3 className="text-2xl font-bold text-on-surface text-center mb-2">Convidar Paciente</h3>
 <p className="text-on-surface-variant text-center mb-8">
 Envie o link de cadastro para o seu paciente. Ele poderá criar a própria conta e preencher a anamnese.
 </p>

 <div className="bg-background /50 border border-outline rounded-xl p-4 flex items-center gap-3 mb-6">
 <span className="text-slate-600 font-mono text-sm truncate flex-1 block">
 {window.location.origin}/register
 </span>
 <button
 onClick={() => {
 navigator.clipboard.writeText(`${window.location.origin}/register`);
 alert('Link copiado!');
 }}
 className="text-primary hover:text-primary-800 dark:hover:text-primary-300 font-bold text-sm"
 >
 Copiar
 </button>
 </div>

 <button
 onClick={() => setShowInviteModal(false)}
 className="w-full py-3 bg-primary hover:bg-primary-700 text-white font-bold rounded-xl transition-colors"
 >
 Entendi
 </button>
 </div>
 </div>
 )}

 {/* Filters */}
 <div className="flex flex-col md:flex-row gap-4 items-center justify-between transition-colors">
 <div className="relative w-full md:max-w-md">
 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant transition-colors" size={20} />
 <input
 type="text"
 placeholder="Buscar por nome ou email..."
 className="w-full pl-12 pr-4 py-3 rounded-full bg-surface-variant/40 border-none focus:ring-2 focus:ring-primary-600 focus:bg-surface dark:focus:bg-slate-700 transition-all outline-none text-slate-700 "
 value={searchTerm}
 onChange={(e) => setSearchTerm(e.target.value)}
 />
 </div>
 </div>

 {/* Table */}
 <div className="bg-surface rounded-[24px] border border-outline-variant shadow-sm overflow-hidden transition-colors">
 <div className="overflow-x-auto">
 <table className="w-full text-left border-collapse">
 <thead>
 <tr className="bg-surface-variant/30 bg-surface-variant/40 border-b border-outline-variant text-sm text-slate-600 font-medium">
 <th className="px-6 py-4 font-medium">Paciente</th>
 <th className="px-6 py-4 font-medium">Email</th>
 <th className="px-6 py-4 font-medium">Status da Anamnese</th>
 <th className="px-6 py-4 hidden lg:table-cell font-medium">Data Cadastro</th>
 <th className="px-6 py-4 text-right font-medium">Ações</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50 transition-colors">
 {loading ? (
 <tr><td colSpan={5} className="p-8 text-center text-on-surface-variant transition-colors">Carregando pacientes...</td></tr>
 ) : filteredPatients.length === 0 ? (
 <tr><td colSpan={5} className="p-8 text-center text-on-surface-variant transition-colors">Nenhum paciente encontrado.</td></tr>
 ) : (
 filteredPatients.map((patient) => (
 <tr key={patient.id} className="hover:bg-purple-50/50 dark:hover:bg-slate-700/40 border-b border-transparent /50 transition-colors group cursor-pointer" onClick={() => navigate(`/area-cliente/admin/patients/${patient.id}`)}>
 <td className="px-6 py-4">
 <div className="flex items-center gap-3">
 <Avatar name={patient.full_name || 'Usuário'} />
 <div>
 <p className="font-medium text-on-surface text-sm">{patient.full_name || 'Sem nome'}</p>
 </div>
 </div>
 </td>
 <td className="px-6 py-4 text-sm text-slate-600 ">
 {patient.email}
 </td>
 <td className="px-6 py-4 text-sm text-slate-600 ">
 {getStatusBadge(patient.anamnesisStatus)}
 </td>
 <td className="px-6 py-4 hidden lg:table-cell text-sm text-on-surface-variant dark:text-on-surface-variant">
 {new Date(patient.created_at).toLocaleDateString('pt-BR')}
 </td>
 <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
 <div className="flex justify-end gap-1">
 <button
 onClick={() => navigate(`/area-cliente/admin/patients/${patient.id}`)}
 className="p-2 text-on-surface-variant hover:text-primary dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-slate-700 rounded-full transition-colors"
 title="Ver Detalhes"
 >
 <Eye size={20} />
 </button>
 <button
 onClick={() => handleDeletePatient(patient.id, patient.full_name)}
 className="p-2 text-on-surface-variant hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
 title="Excluir Paciente"
 >
 <Trash2 size={20} />
 </button>
 </div>
 </td>
 </tr>
 ))
 )}
 </tbody>
 </table>
 </div>
 </div>
 </div>
 );
};

export default AdminPatients;
