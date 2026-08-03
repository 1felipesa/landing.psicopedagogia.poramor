import React, { useEffect, useState } from 'react';
import {
 Calendar,
 MessageCircle,
 Clock,
 ChevronRight,
 CheckCircle2,
 Circle,
 FileText,
 AlertCircle,
 Wallet
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../lib/firebase';
import { collection, query, where, orderBy, limit, getDocs, doc, getDoc } from 'firebase/firestore';
import { format, parseISO, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const PatientDashboard: React.FC = () => {
 const { user } = useAuth();
 const navigate = useNavigate();
 const [anamnesisStatus, setAnamnesisStatus] = useState<'loading' | 'pending' | 'completed'>('loading');
 const [nextAppointment, setNextAppointment] = useState<any>(null);
 const [pastAppointments, setPastAppointments] = useState<any[]>([]);
 const [pendingInvoicesCount, setPendingInvoicesCount] = useState(0);
 const [objectives, setObjectives] = useState<any[]>([]);
 const [expandedSessions, setExpandedSessions] = useState<Set<string>>(new Set());

 const toggleSessionExpansion = (sessionId: string) => {
 const newExpanded = new Set(expandedSessions);
 if (newExpanded.has(sessionId)) {
 newExpanded.delete(sessionId);
 } else {
 newExpanded.add(sessionId);
 }
 setExpandedSessions(newExpanded);
 };

 const [hasSignedContract, setHasSignedContract] = useState(true);

 useEffect(() => {
   if (!user) return;

   const fetchData = async () => {
     try {
       // Check Anamnesis
       const anamnesisRef = doc(db, 'anamnesis', user.id);
       const anamnesisSnap = await getDoc(anamnesisRef);
       const anamnesis = anamnesisSnap.exists() ? anamnesisSnap.data() : null;
       setAnamnesisStatus(anamnesis?.status === 'completed' ? 'completed' : 'pending');

       // Check Signed Contract
       const contractQuery = query(
         collection(db, 'documents'),
         where('patient_id', '==', user.id),
         where('type', '==', 'signed_contract')
       );
       const contractSnap = await getDocs(contractQuery);
       setHasSignedContract(!contractSnap.empty);

       // Check Next Appointment
       const nextApptQuery = query(
         collection(db, 'appointments'),
         where('patient_id', '==', user.id),
         where('date', '>=', new Date().toISOString()),
         orderBy('date', 'asc'),
         limit(1)
       );
       const nextApptSnap = await getDocs(nextApptQuery);

       if (!nextApptSnap.empty) {
         const apptDoc = nextApptSnap.docs[0];
         const apptData = { id: apptDoc.id, ...apptDoc.data() } as any;

         // Fetch associated invoices
         const invoiceQuery = query(
           collection(db, 'invoices'),
           where('appointment_id', '==', apptDoc.id)
         );
         const invoiceSnap = await getDocs(invoiceQuery);
         const invoices = invoiceSnap.docs.map(d => d.data());

         const isPaid = invoices.length === 0 || invoices.some((inv: any) => inv.status === 'paid');
         setNextAppointment({ ...apptData, isPaid });
       } else {
         setNextAppointment(null);
       }

       // Fetch Past Appointments
       const pastQuery = query(
         collection(db, 'appointments'),
         where('patient_id', '==', user.id),
         where('status', '==', 'completed'),
         orderBy('date', 'desc'),
         limit(2)
       );
       const pastSnap = await getDocs(pastQuery);
       const pastData = pastSnap.docs.map(d => ({ id: d.id, ...d.data() }));
       setPastAppointments(pastData);

       // Fetch Pending Invoices
       const pendingInvoicesQuery = query(
         collection(db, 'invoices'),
         where('patient_id', '==', user.id),
         where('status', '==', 'pending')
       );
       const pendingSnap = await getDocs(pendingInvoicesQuery);
       setPendingInvoicesCount(pendingSnap.size);

       // Fetch Objectives
       const objectivesQuery = query(
         collection(db, 'patient_objectives'),
         where('patient_id', '==', user.id),
         orderBy('created_at', 'asc')
       );
       const objectivesSnap = await getDocs(objectivesQuery);
       const objectivesData = objectivesSnap.docs.map(d => ({ id: d.id, ...d.data() }));
       setObjectives(objectivesData);

     } catch (error) {
       console.error('Error fetching dashboard data:', error);
     }
   };

   fetchData();
 }, [user]);

 const completedObjectives = objectives.filter(o => o.is_completed).length;
 const progressPercent = objectives.length > 0 ? Math.round((completedObjectives / objectives.length) * 100) : 0;

 return (
 <div className="space-y-4 animate-fadeIn max-w-6xl mx-auto px-4 md:px-0 pb-12">
 {/* Contract Pending Banner */}
 {!hasSignedContract && (
   <div
     onClick={() => navigate('/area-cliente/patient/reports')}
     className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/30 p-4 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-amber-100/50 dark:hover:bg-amber-900/30 transition-colors group shadow-sm animate-slideDown"
   >
     <div className="flex items-center gap-3">
       <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
         <FileText size={20} />
       </div>
       <div>
         <p className="text-sm font-bold text-amber-900 dark:text-amber-200">Envio do Contrato Assinado Pendente</p>
         <p className="text-xs text-amber-700 dark:text-amber-400">Por favor, assine e faça o upload do seu contrato de prestação de serviços na plataforma.</p>
       </div>
     </div>
     <button className="flex items-center gap-1 text-xs font-bold text-amber-700 dark:text-amber-300 group-hover:translate-x-1 transition-transform flex-shrink-0">
       Enviar Agora
       <ChevronRight size={14} />
     </button>
   </div>
 )}

 {/* Payment Reminder Banner */}
 {pendingInvoicesCount > 0 && (
 <div
 onClick={() => navigate('/area-cliente/patient/financial')}
 className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 p-4 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-red-100/50 dark:hover:bg-red-900/30 transition-colors group shadow-sm animate-slideDown"
 >
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
 <Wallet size={20} />
 </div>
 <div>
 <p className="text-sm font-bold text-red-900 dark:text-red-200">Mensalidade Pendente</p>
 <p className="text-xs text-red-700 dark:text-red-400">Você possui {pendingInvoicesCount} {pendingInvoicesCount === 1 ? 'cobrança aguardando' : 'cobranças aguardando'} pagamento.</p>
 </div>
 </div>
 <button className="flex items-center gap-1 text-xs font-bold text-red-600 dark:text-red-400 group-hover:translate-x-1 transition-transform flex-shrink-0">
 Pagar Agora
 <ChevronRight size={14} />
 </button>
 </div>
 )}

 {/* Header */}
 <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
 <div>
 <h2 className="text-2xl md:text-3xl font-normal text-on-surface tracking-tight transition-colors">Olá, {user?.name.split(' ')[0] || 'Visitante'}</h2>
 <p className="text-on-surface-variant mt-1 text-sm md:text-base transition-colors">Acompanhe seu progresso.</p>
 </div>
 </div>

 {/* Main Grid */}
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
 {/* Left Column - 2 Cols */}
 <div className="lg:col-span-2 space-y-6">
 {/* Anamnesis Reminder Banner */}
 {anamnesisStatus === 'pending' && (
 <div className="bg-gradient-to-r from-purple-900 via-primary-900 to-indigo-900 text-white p-6 md:p-8 rounded-[28px] shadow-lg relative overflow-hidden group">
 <div className="absolute right-0 top-0 w-64 h-64 bg-surface/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700"></div>
 <div className="relative z-10 space-y-4">
 <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface/20 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md">
 <AlertCircle size={14} /> Ação Necessária
 </div>
 <h3 className="text-xl md:text-2xl font-bold tracking-tight">Preencha sua Pré-Anamnese</h3>
 <p className="text-purple-100 text-xs md:text-sm max-w-lg leading-relaxed">
 Para iniciarmos o acompanhamento psicopedagógico de forma personalizada, precisamos que você responda ao formulário de anamnese.
 </p>
 <button
 onClick={() => navigate('/area-cliente/patient/anamnesis')}
 className="inline-flex items-center gap-2 bg-surface text-primary hover:bg-purple-50 font-bold px-6 py-3 rounded-full text-sm shadow-md hover:shadow-xl active:scale-95 transition-all cursor-pointer"
 >
 Preencher Agora <ChevronRight size={16} />
 </button>
 </div>
 </div>
 )}

 {/* Next Appointment Card */}
 <div className="bg-surface rounded-[28px] border border-outline-variant p-6 md:p-8 shadow-sm space-y-6 transition-colors">
 <div className="flex items-center justify-between">
 <h3 className="text-lg md:text-xl font-bold text-on-surface tracking-tight flex items-center gap-2 transition-colors">
 <Calendar className="text-primary " size={22} /> Próxima Consulta
 </h3>
 {nextAppointment && (
 <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${nextAppointment.isPaid ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'}`}>
 {nextAppointment.isPaid ? 'Confirmado' : 'Aguardando Pagamento'}
 </span>
 )}
 </div>

 {nextAppointment ? (
 <div className="bg-background /50 rounded-2xl p-6 border border-outline transition-colors space-y-4">
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
 <div>
 <p className="text-2xl font-bold text-on-surface tracking-tight transition-colors">
 {format(parseISO(nextAppointment.date), "dd 'de' MMMM", { locale: ptBR })}
 </p>
 <p className="text-on-surface-variant font-medium text-sm mt-0.5 flex items-center gap-2 transition-colors">
 <Clock size={16} /> {format(parseISO(nextAppointment.date), "EEEE 'às' HH:mm", { locale: ptBR })}
 </p>
 </div>

 <div className="flex items-center gap-3">
 {nextAppointment.type === 'online' ? (
 <a
 href={nextAppointment.meet_url || '#'}
 target="_blank"
 rel="noopener noreferrer"
 className="w-full md:w-auto px-6 py-3 bg-primary hover:bg-primary-700 text-white font-bold rounded-full text-sm shadow-sm transition-all flex items-center justify-center gap-2"
 >
 Entrar na Sala Online
 </a>
 ) : (
 <div className="text-xs text-on-surface-variant bg-surface px-4 py-2 rounded-xl border border-outline transition-colors">
 Consulta Presencial no Consultório
 </div>
 )}
 </div>
 </div>
 </div>
 ) : (
 <div className="text-center py-10 bg-background /30 rounded-2xl border border-dashed border-outline transition-colors">
 <Clock className="mx-auto text-outline dark:text-on-surface-variant mb-2" size={32} />
 <p className="text-on-surface-variant text-sm font-medium transition-colors">Nenhuma consulta agendada no momento.</p>
 </div>
 )}
 </div>

 {/* Objectives Progress Card */}
 <div className="bg-surface rounded-[28px] border border-outline-variant p-6 md:p-8 shadow-sm space-y-6 transition-colors">
 <div className="flex items-center justify-between">
 <div>
 <h3 className="text-lg md:text-xl font-bold text-on-surface tracking-tight transition-colors">Objetivos Terapêuticos</h3>
 <p className="text-xs md:text-sm text-on-surface-variant mt-0.5 transition-colors">Acompanhe as metas estabelecidas para o tratamento.</p>
 </div>
 <div className="text-right">
 <span className="text-2xl font-bold text-primary transition-colors">{progressPercent}%</span>
 <p className="text-[10px] text-outline dark:text-on-surface-variant font-bold uppercase tracking-wider transition-colors">Concluído</p>
 </div>
 </div>

 {/* Progress Bar */}
 <div className="w-full bg-surface-variant h-3 rounded-full overflow-hidden transition-colors">
 <div
 className="bg-primary h-full transition-all duration-1000 rounded-full"
 style={{ width: `${progressPercent}%` }}
 />
 </div>

 {/* Checklist */}
 <div className="space-y-3 pt-2">
 {objectives.length === 0 ? (
 <p className="text-sm text-on-surface-variant italic text-center py-4 transition-colors">Nenhum objetivo cadastrado ainda.</p>
 ) : (
 objectives.map(obj => (
 <div
 key={obj.id}
 className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${obj.is_completed ? 'bg-green-50/50 dark:bg-green-900/20 border-green-200 dark:border-green-800/40 text-green-900 dark:text-green-200' : 'bg-background /50 border-outline text-slate-700 dark:text-slate-300'}`}
 >
 {obj.is_completed ? (
 <CheckCircle2 className="text-green-600 dark:text-green-400 shrink-0" size={20} />
 ) : (
 <Circle className="text-outline dark:text-on-surface-variant shrink-0" size={20} />
 )}
 <span className={`text-sm font-medium ${obj.is_completed ? 'line-through opacity-70' : ''}`}>
 {obj.description}
 </span>
 </div>
 ))
 )}
 </div>
 </div>
 </div>

 {/* Right Column - 1 Col */}
 <div className="space-y-6">
 {/* Recent Evolutions Preview */}
 <div className="bg-surface rounded-[28px] border border-outline-variant p-6 shadow-sm space-y-4 transition-colors">
 <div className="flex items-center justify-between">
 <h3 className="font-bold text-on-surface text-base md:text-lg transition-colors">Últimos Acompanhamentos</h3>
 <button
 onClick={() => navigate('/area-cliente/patient/library')}
 className="text-xs font-bold text-primary hover:underline transition-colors"
 >
 Ver Todos
 </button>
 </div>

 <div className="space-y-3">
 {pastAppointments.length === 0 ? (
 <p className="text-xs text-on-surface-variant italic text-center py-6 transition-colors">Nenhum histórico disponível ainda.</p>
 ) : (
 pastAppointments.map(session => (
 <div
 key={session.id}
 className="bg-background /50 p-4 rounded-2xl border border-outline space-y-2 cursor-pointer hover:border-primary-300 dark:hover:border-primary-800 transition-all"
 onClick={() => toggleSessionExpansion(session.id)}
 >
 <div className="flex items-center justify-between text-xs">
 <span className="font-bold text-on-surface transition-colors">
 {format(parseISO(session.date), "dd 'de' MMM, yyyy", { locale: ptBR })}
 </span>
 <span className="text-[10px] text-outline dark:text-on-surface-variant font-bold uppercase transition-colors">Concluída</span>
 </div>
 <p className={`text-xs text-slate-600 dark:text-slate-300 leading-relaxed transition-colors ${expandedSessions.has(session.id) ? '' : 'line-clamp-2'}`}>
 {session.notes || 'Sem resumo cadastrado.'}
 </p>
 </div>
 ))
 )}
 </div>
 </div>

 {/* Quick Contact Card */}
 <div className="bg-surface rounded-[28px] border border-outline-variant p-6 shadow-sm space-y-4 transition-colors">
 <h3 className="font-bold text-on-surface text-base md:text-lg transition-colors">Precisa de Ajuda?</h3>
 <p className="text-xs text-on-surface-variant leading-relaxed transition-colors">
 Entre em contato direto com a Dra. Raiane para dúvidas sobre consultas ou plano terapêutico.
 </p>
 <a
 href="https://wa.me/5500000000000"
 target="_blank"
 rel="noopener noreferrer"
 className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
 >
 <MessageCircle size={18} /> Conversar no WhatsApp
 </a>
 </div>
 </div>
 </div>
 </div>
 );
};

export default PatientDashboard;
