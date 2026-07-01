import React, { useState, useEffect } from 'react';
import {
 Wallet,
 TrendingUp,
 TrendingDown,
 AlertCircle,
 Plus,
 Search,
 Filter,
 CheckCircle2,
 Clock,
 MoreHorizontal,
 ArrowUpRight,
 ArrowDownRight,
 Calendar,
 X,
 Trash2
} from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, query, where, orderBy, getDocs, doc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';
import { useToast } from '../../context/ToastContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Avatar from '../../components/ui/Avatar';

interface Invoice {
    id: string;
    patient_id: string;
    description: string;
    amount: number;
    due_date: string;
    status: 'pending' | 'paid' | 'overdue' | 'cancelled';
    payment_method: string | null;
    paid_at: string | null;
    created_at: string;
    patient?: {
        full_name: string;
    };
}

const AdminFinancial: React.FC = () => {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const { showToast } = useToast();

    // Stats
    const [stats, setStats] = useState({
        pendingMonth: 0,
        paidMonth: 0,
        overdue: 0
    });

    // Form State
    const [patients, setPatients] = useState<any[]>([]);
    const [selectedPatient, setSelectedPatient] = useState('');
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchData();
        fetchPatients();
    }, []);

    const fetchData = async () => {
        try {
            // Fetch all invoices
            const invoicesQuery = query(
                collection(db, 'invoices'),
                orderBy('due_date', 'desc')
            );
            const invoicesSnap = await getDocs(invoicesQuery);
            const rawInvoices = invoicesSnap.docs.map(docSnap => ({
                id: docSnap.id,
                ...docSnap.data()
            })) as any[];

            // Fetch all patients for client-side join
            const patientsQuery = query(
                collection(db, 'profiles'),
                where('role', '==', 'patient')
            );
            const patientsSnap = await getDocs(patientsQuery);
            const patientsMap = new Map<string, any>();
            patientsSnap.docs.forEach(docSnap => {
                patientsMap.set(docSnap.id, docSnap.data());
            });

            // Perform client-side join
            const joinedInvoices = rawInvoices.map(inv => {
                const patientProfile = patientsMap.get(inv.patient_id);
                return {
                    ...inv,
                    patient: patientProfile ? { full_name: patientProfile.full_name } : { full_name: 'Desconhecido' }
                };
            }) as Invoice[];

            setInvoices(joinedInvoices);
            calculateStats(joinedInvoices);
        } catch (err) {
            console.error('Error fetching invoices:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchPatients = async () => {
        try {
            const q = query(
                collection(db, 'profiles'),
                where('role', '==', 'patient')
            );
            const querySnapshot = await getDocs(q);
            const patientsData = querySnapshot.docs.map(docSnap => ({
                id: docSnap.id,
                full_name: docSnap.data().full_name
            }));
            setPatients(patientsData);
        } catch (err) {
            console.error('Error fetching patients:', err);
        }
    };

    const calculateStats = (data: Invoice[]) => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        let pending = 0;
        let paid = 0;
        let overdueCount = 0;

        data.forEach(inv => {
            const dDate = new Date(inv.due_date);
            const isThisMonth = dDate.getMonth() === currentMonth && dDate.getFullYear() === currentYear;

            if (inv.status === 'pending' && isThisMonth) {
                pending += Number(inv.amount);
            }
            if (inv.status === 'paid' && isThisMonth) {
                paid += Number(inv.amount);
            }
            if (inv.status === 'pending' && dDate < now) {
                overdueCount += Number(inv.amount);
            }
        });

        setStats({
            pendingMonth: pending,
            paidMonth: paid,
            overdue: overdueCount
        });
    };

    const handleCreateInvoice = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await addDoc(collection(db, 'invoices'), {
                patient_id: selectedPatient,
                description,
                amount: parseFloat(amount),
                due_date: dueDate,
                status: 'pending',
                created_at: new Date().toISOString()
            });

            setShowAddModal(false);
            resetForm();
            fetchData();
            showToast('Cobrança criada com sucesso!');
        } catch (err: any) {
            showToast('Erro ao criar cobrança: ' + err.message, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setSelectedPatient('');
        setDescription('');
        setAmount('');
        setDueDate('');
    };

    const markAsPaid = async (id: string) => {
        if (!confirm('Confirmar recebimento deste valor?')) return;

        try {
            const invoiceRef = doc(db, 'invoices', id);
            await updateDoc(invoiceRef, {
                status: 'paid',
                paid_at: new Date().toISOString(),
                payment_method: 'pix'
            });

            fetchData();
            showToast('Pagamento confirmado!');
        } catch (err: any) {
            showToast('Erro ao atualizar: ' + err.message, 'error');
        }
    };

    const handleDeleteInvoice = async (id: string) => {
        if (!confirm('Deseja excluir esta cobrança permanentemente?')) return;

        try {
            await deleteDoc(doc(db, 'invoices', id));
            fetchData();
            showToast('Cobrança excluída.');
        } catch (err: any) {
            showToast('Erro ao excluir: ' + err.message, 'error');
        }
    };

 const filteredInvoices = invoices.filter(inv =>
 inv.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
 inv.patient?.full_name.toLowerCase().includes(searchTerm.toLowerCase())
 );

 return (
 <div className="space-y-8 animate-fadeIn px-4 md:px-0">
 {/* Header */}
 <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
 <div>
 <h2 className="text-2xl md:text-3xl font-normal text-on-surface transition-colors">Financeiro</h2>
 <p className="text-on-surface-variant mt-1 text-sm md:text-base transition-colors">Gestão de faturamento e recebimentos.</p>
 </div>
 <Button onClick={() => setShowAddModal(true)} leftIcon={<Plus size={20} />} className="w-full md:w-auto">
 Nova Cobrança
 </Button>
 </div>

 {/* Stats Cards */}
 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
 <div className="bg-surface p-5 md:p-6 rounded-[24px] border border-outline-variant shadow-sm flex flex-row sm:flex-col items-center sm:items-start gap-4 sm:gap-0 transition-colors">
 <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex-shrink-0">
 <TrendingUp size={24} />
 </div>
 <div className="sm:mt-4">
 <p className="text-xs md:text-sm font-medium text-on-surface-variant ">A Receber (Mês)</p>
 <h3 className="text-xl md:text-2xl font-bold text-on-surface transition-colors">R$ {stats.pendingMonth.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
 </div>
 </div>

 <div className="bg-surface p-5 md:p-6 rounded-[24px] border border-outline-variant shadow-sm flex flex-row sm:flex-col items-center sm:items-start gap-4 sm:gap-0 transition-colors">
 <div className="p-3 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-2xl flex-shrink-0">
 <TrendingDown size={24} />
 </div>
 <div className="sm:mt-4">
 <p className="text-xs md:text-sm font-medium text-on-surface-variant ">Caixa (Mês)</p>
 <h3 className="text-xl md:text-2xl font-bold text-on-surface transition-colors">R$ {stats.paidMonth.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
 </div>
 </div>

 <div className="bg-surface p-5 md:p-6 rounded-[24px] border border-outline-variant shadow-sm flex flex-row sm:flex-col items-center sm:items-start gap-4 sm:gap-0 transition-colors">
 <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-2xl flex-shrink-0">
 <AlertCircle size={24} />
 </div>
 <div className="sm:mt-4">
 <p className="text-xs md:text-sm font-medium text-on-surface-variant ">Inadimplência</p>
 <h3 className="text-xl md:text-2xl font-bold text-on-surface transition-colors">R$ {stats.overdue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
 </div>
 </div>
 </div>

 {/* Main Content */}
 <div className="bg-surface rounded-[28px] border border-outline-variant shadow-sm overflow-hidden min-h-[400px] transition-colors">
 <div className="p-6 border-b border-outline-variant flex flex-col md:flex-row gap-4 items-center justify-between">
 <h3 className="font-bold text-on-surface ">Histórico de Cobranças</h3>
 <div className="relative w-full md:max-w-xs">
 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-outline dark:text-on-surface-variant" size={18} />
 <input
 type="text"
 placeholder="Buscar paciente ou descrição..."
 className="w-full pl-12 pr-4 py-2.5 rounded-full bg-background border-none focus:ring-2 focus:ring-primary-500 transition-all outline-none text-sm text-on-surface "
 value={searchTerm}
 onChange={e => setSearchTerm(e.target.value)}
 />
 </div>
 </div>

 <div className="overflow-x-auto">
 <table className="w-full text-left border-collapse">
 <thead>
 <tr className="bg-background bg-surface-variant/40 text-on-surface-variant text-[10px] md:text-xs font-bold uppercase tracking-wider">
 <th className="px-6 md:px-8 py-4">Vencimento</th>
 <th className="px-6 md:px-8 py-4">Paciente</th>
 <th className="px-6 md:px-8 py-4 hidden md:table-cell">Descrição</th>
 <th className="px-6 md:px-8 py-4 text-right">Valor</th>
 <th className="px-6 md:px-8 py-4">Status</th>
 <th className="px-6 md:px-8 py-4 text-right">Ações</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
 {loading ? (
 <tr><td colSpan={6} className="text-center py-20 text-outline dark:text-on-surface-variant">Carregando dados...</td></tr>
 ) : filteredInvoices.length === 0 ? (
 <tr><td colSpan={6} className="text-center py-20 text-outline dark:text-on-surface-variant">Nenhuma cobrança encontrada.</td></tr>
 ) : (
 filteredInvoices.map(inv => (
 <tr key={inv.id} className="hover:bg-background/50 dark:hover:bg-slate-700/50 transition-colors group">
 <td className="px-6 md:px-8 py-5">
 <div className="text-xs md:text-sm font-medium text-on-surface ">
 {format(new Date(inv.due_date), "dd/MM/yy")}
 </div>
 </td>
 <td className="px-6 md:px-8 py-5">
 <div className="flex items-center gap-2 md:gap-3">
 <Avatar name={inv.patient?.full_name || 'U'} size="sm" />
 <span className="text-xs md:text-sm font-bold text-on-surface truncate max-w-[100px] md:max-w-none">{inv.patient?.full_name}</span>
 </div>
 </td>
 <td className="px-6 md:px-8 py-5 hidden md:table-cell">
 <div className="text-sm text-slate-600 line-clamp-1">{inv.description}</div>
 </td>
 <td className="px-6 md:px-8 py-5 text-right font-bold text-slate-900 text-sm md:text-base transition-colors">
 R$ {Number(inv.amount).toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
 </td>
 <td className="px-6 md:px-8 py-5">
 {inv.status === 'paid' ? (
 <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 transition-colors">
 Pago
 </span>
 ) : inv.status === 'overdue' || (new Date(inv.due_date) < new Date() && inv.status === 'pending') ? (
 <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 transition-colors">
 Atrasado
 </span>
 ) : (
 <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 transition-colors">
 Pendente
 </span>
 )}
 </td>
 <td className="px-6 md:px-8 py-5 text-right flex items-center justify-end gap-2">
 {inv.status !== 'paid' && (
 <button
 onClick={() => markAsPaid(inv.id)}
 className="text-[10px] font-bold text-primary hover:text-primary-800 dark:hover:text-primary-300 bg-primary-50 dark:bg-primary-900/40 px-3 py-1.5 rounded-full transition-colors"
 >
 Confirmar
 </button>
 )}
 <button
 onClick={() => handleDeleteInvoice(inv.id)}
 className="p-2 text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
 title="Excluir cobrança"
 >
 <Trash2 size={16} />
 </button>
 </td>
 </tr>
 ))
 )}
 </tbody>
 </table>
 </div>
 </div>

 {/* Add Modal */}
 {showAddModal && (
 <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
 <div className="bg-surface rounded-[32px] shadow-2xl w-full max-w-md overflow-hidden animate-scaleIn border border-transparent ">
 <div className="p-8">
 <div className="flex items-center justify-between mb-8">
 <h3 className="text-2xl font-bold text-on-surface ">Nova Cobrança</h3>
 <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-surface-variant dark:hover:bg-slate-700 rounded-full transition-colors">
 <X size={20} className="text-outline dark:text-on-surface-variant" />
 </button>
 </div>

 <form onSubmit={handleCreateInvoice} className="space-y-5">
 <div>
 <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Paciente</label>
 <select
 className="w-full px-5 py-4 rounded-2xl bg-background border-none focus:ring-2 focus:ring-primary-500 outline-none text-on-surface font-medium"
 value={selectedPatient}
 onChange={e => setSelectedPatient(e.target.value)}
 required
 >
 <option className="" value="">Selecione o paciente...</option>
 {patients.map(p => (
 <option className="" key={p.id} value={p.id}>{p.full_name}</option>
 ))}
 </select>
 </div>

 <Input
 label="Descrição"
 placeholder="Ex: Sessão Quinzenal Janeiro"
 value={description}
 onChange={e => setDescription(e.target.value)}
 required
 />

 <div className="grid grid-cols-2 gap-4">
 <Input
 label="Valor (R$)"
 type="number"
 step="0.01"
 placeholder="0.00"
 value={amount}
 onChange={e => setAmount(e.target.value)}
 required
 />
 <Input
 label="Vencimento"
 type="date"
 value={dueDate}
 onChange={e => setDueDate(e.target.value)}
 required
 />
 </div>

 <div className="pt-4">
 <Button
 type="submit"
 className="w-full py-4 text-lg"
 isLoading={isSubmitting}
 >
 Gerar Cobrança
 </Button>
 </div>
 </form>
 </div>
 </div>
 </div>
 )}
 </div>
 );
};

export default AdminFinancial;
