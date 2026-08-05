import React, { useState, useEffect } from 'react';
import {
    Wallet,
    CheckCircle2,
    Clock,
    AlertCircle,
    Copy,
    QrCode,
    Calendar,
    ArrowRight
} from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Invoice {
    id: string;
    description: string;
    amount: number;
    due_date: string;
    status: 'pending' | 'paid' | 'overdue' | 'cancelled';
    paid_at: string | null;
}

const PatientFinancial: React.FC = () => {
    const { user } = useAuth();
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [showPixModal, setShowPixModal] = useState<Invoice | null>(null);
    const [copied, setCopied] = useState(false);

    // Chave PIX - Telefone da Raiane
    const pixKey = "16991864393";

    useEffect(() => {
        if (user) fetchData();
    }, [user]);

    const fetchData = async () => {
        try {
            if (!user) return;
            const q = query(
                collection(db, 'invoices'),
                where('patient_id', '==', user.id)
            );
            const querySnapshot = await getDocs(q);
            const invoicesData = querySnapshot.docs.map(docSnap => ({
                id: docSnap.id,
                ...docSnap.data()
            })) as Invoice[];

            invoicesData.sort((a, b) => (b.due_date || '').localeCompare(a.due_date || ''));

            setInvoices(invoicesData);
        } catch (err) {
            console.error('Error fetching invoices:', err);
        } finally {
            setLoading(false);
        }
    };

 const copyPixKey = () => {
 navigator.clipboard.writeText(pixKey);
 setCopied(true);
 setTimeout(() => setCopied(false), 2000);
 };

 return (
 <div className="max-w-4xl mx-auto space-y-6 md:space-y-8 animate-fadeIn px-4 md:px-0 pb-12">
 {/* Header */}
 <div>
 <h2 className="text-2xl md:text-3xl font-normal text-on-surface transition-colors">Financeiro</h2>
 <p className="text-on-surface-variant mt-1 text-sm md:text-base transition-colors">Acompanhe seus pagamentos e faturas.</p>
 </div>

 {/* Summary Cards */}
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div className="bg-primary-container text-on-primary-container rounded-[28px] p-6 md:p-8 relative overflow-hidden min-h-[160px] flex flex-col justify-center transition-colors">
  <div className="relative z-10">
  <p className="text-on-primary-container/85 text-[10px] md:text-sm font-medium uppercase tracking-wider mb-1 transition-colors">Pendente</p>
  <h3 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6 transition-colors">
  R$ {invoices
  .filter(inv => inv.status !== 'paid')
  .reduce((acc, curr) => acc + Number(curr.amount), 0)
  .toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
  </h3>
  
  <div className="flex flex-wrap gap-2">
  {invoices.filter(inv => inv.status !== 'paid').length > 0 && (
  <button
  onClick={() => setShowPixModal(invoices.find(inv => inv.status !== 'paid') || null)}
  className="bg-on-primary-container/10 hover:bg-on-primary-container/20 text-on-primary-container backdrop-blur-sm rounded-xl px-3.5 py-2 inline-flex items-center gap-2 transition-colors text-xs font-bold cursor-pointer"
  >
  <QrCode size={16} />
  <span>Pagar via PIX</span>
  </button>
  )}
  <button
  onClick={copyPixKey}
  className={`backdrop-blur-sm rounded-xl px-3.5 py-2 inline-flex items-center gap-2 transition-colors text-xs font-bold cursor-pointer ${
  copied 
  ? 'bg-green-600 dark:bg-green-700 text-white' 
  : 'bg-on-primary-container/10 hover:bg-on-primary-container/20 text-on-primary-container'
  }`}
  >
  {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
  <span>{copied ? 'Copiado!' : 'Copiar Chave PIX'}</span>
  </button>
  </div>
  </div>
  <Wallet size={100} className="absolute -right-4 -bottom-4 text-on-primary-container/5 rotate-12" />
  </div>

 <div className="bg-surface rounded-[28px] border border-outline-variant p-6 md:p-8 shadow-sm flex flex-col justify-center transition-all">
 <div className="flex items-center gap-4">
 <div className="p-3 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-2xl flex-shrink-0 transition-colors">
 <CheckCircle2 size={24} />
 </div>
 <div>
 <p className="text-[10px] md:text-sm font-bold text-outline dark:text-on-surface-variant uppercase tracking-widest leading-tight transition-colors">Total Pago</p>
 <p className="text-xl md:text-2xl font-bold text-on-surface transition-colors">
 R$ {invoices
 .filter(inv => inv.status === 'paid')
 .reduce((acc, curr) => acc + Number(curr.amount), 0)
 .toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
 </p>
 </div>
 </div>
 </div>
 </div>

 {/* Invoices List */}
 <div className="space-y-4">
 <h3 className="font-bold text-on-surface text-lg px-2 transition-colors">Suas Faturas</h3>

 {loading ? (
 <div className="text-center py-12 text-outline dark:text-on-surface-variant">Carregando faturas...</div>
 ) : invoices.length === 0 ? (
 <div className="bg-background /50 rounded-[24px] p-12 text-center transition-colors">
 <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300 dark:text-slate-600 transition-colors">
 <Wallet size={32} />
 </div>
 <p className="text-on-surface-variant text-sm transition-colors">Nenhuma fatura encontrada.</p>
 </div>
 ) : (
 <div className="grid gap-3">
 {invoices.map(inv => (
 <div key={inv.id} className="bg-surface rounded-[24px] p-5 md:p-6 border border-outline-variant hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
 <div className="flex items-center gap-4 w-full">
 <div className={`p-3 rounded-2xl flex-shrink-0 transition-colors ${inv.status === 'paid' ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'}`}>
 {inv.status === 'paid' ? <CheckCircle2 size={24} /> : <Clock size={24} />}
 </div>
 <div className="overflow-hidden">
 <h4 className="font-bold text-on-surface text-sm md:text-base truncate transition-colors">{inv.description}</h4>
 <div className="flex items-center gap-2 text-[11px] md:text-sm text-on-surface-variant transition-colors">
 <Calendar size={12} />
 <span>Vencimento: {format(new Date(inv.due_date), "dd/MM/yyyy")}</span>
 </div>
 </div>
 </div>

 <div className="flex items-center justify-between w-full sm:w-auto sm:gap-6 border-t sm:border-t-0 pt-3 sm:pt-0 mt-1 sm:mt-0 transition-colors">
  <div className="text-left sm:text-right">
  <p className="text-[10px] font-bold text-outline dark:text-on-surface-variant uppercase leading-none mb-1 transition-colors">Valor</p>
  <p className="text-lg md:text-xl font-bold text-on-surface leading-none transition-colors">R$ {Number(inv.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
  </div>

 {inv.status !== 'paid' ? (
 <button
 onClick={() => setShowPixModal(inv)}
 className="bg-primary text-white font-bold px-5 py-2.5 rounded-full hover:bg-primary-700 dark:hover:bg-primary transition-colors flex items-center gap-2 text-sm shadow-sm"
 >
 Pagar
 <ArrowRight size={16} />
 </button>
 ) : (
 <div className="px-3 py-1.5 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-[10px] font-bold uppercase transition-colors">
 Pago {format(new Date(inv.paid_at!), 'dd/MM')}
 </div>
 )}
 </div>
 </div>
 ))}
 </div>
 )}
 </div>

 {/* PIX Modal */}
 {showPixModal && (
 <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
 <div className="bg-surface rounded-[32px] shadow-2xl w-full max-w-sm overflow-hidden animate-scaleIn transition-colors">
 <div className="p-8 text-center">
 <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 text-primary rounded-full flex items-center justify-center mx-auto mb-6 transition-colors">
 <QrCode size={32} />
 </div>
 <h3 className="text-2xl font-bold text-on-surface mb-2 transition-colors">Pagamento via PIX</h3>
 <p className="text-on-surface-variant mb-8 transition-colors">Utilize a chave PIX abaixo para realizar o pagamento de <strong>R$ {Number(showPixModal.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>.</p>

 <div className="bg-background /60 border border-dashed border-slate-300 rounded-2xl p-4 mb-6 relative group transition-colors">
 <p className="text-sm font-mono text-slate-600 dark:text-slate-300 break-all transition-colors">{pixKey}</p>
 <button
 onClick={copyPixKey}
 className={`absolute -top-3 -right-3 p-2 rounded-full shadow-md transition-all flex items-center gap-2 ${
 copied 
 ? 'bg-green-600 text-white px-4' 
 : 'bg-surface text-primary hover:text-primary-700'
 }`}
 title="Copiar Chave"
 >
 {copied ? (
 <>
 <CheckCircle2 size={16} />
 <span className="text-[10px] font-bold uppercase">Copiado!</span>
 </>
 ) : (
 <Copy size={16} />
 )}
 </button>
 </div>

 <div className="space-y-3">
 <button
 onClick={() => setShowPixModal(null)}
 className="w-full py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary-700 dark:hover:bg-primary transition-colors shadow-lg shadow-primary-500/20"
 >
 Confirmar que paguei
 </button>
 <button
 onClick={() => setShowPixModal(null)}
 className="w-full py-4 text-on-surface-variant font-bold hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
 >
 Voltar
 </button>
 </div>
 <p className="text-[10px] text-outline dark:text-on-surface-variant mt-6 uppercase tracking-widest font-bold transition-colors">Após o pagamento, a Dra. Raiane confirmará o recebimento no sistema.</p>
 </div>
 </div>
 </div>
 )}
 </div>
 );
};

export default PatientFinancial;
