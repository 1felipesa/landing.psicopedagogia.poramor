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
 const [hasTemplateContract, setHasTemplateContract] = useState(false);

 useEffect(() => {
   if (!user) return;

   const fetchData = async () => {
     try {
       // Check Anamnesis
       const anamnesisRef = doc(db, 'anamnesis', user.id);
       const anamnesisSnap = await getDoc(anamnesisRef);
       const anamnesis = anamnesisSnap.exists() ? anamnesisSnap.data() : null;
       setAnamnesisStatus(anamnesis?.status === 'completed' ? 'completed' : 'pending');

       // Check Contract Documents
       const docsQuery = query(
         collection(db, 'documents'),
         where('patient_id', '==', user.id)
       );
       const docsSnap = await getDocs(docsQuery);
       const userDocs = docsSnap.docs.map(d => d.data());

       const hasSigned = userDocs.some((d: any) => d.type === 'signed_contract' || (d.uploaded_by === 'patient' && (d.title || '').toLowerCase().includes('contrato')));
       const hasTemplate = userDocs.some((d: any) => d.type === 'contract_template' || (d.uploaded_by === 'admin' && (d.title || '').toLowerCase().includes('contrato')));

       setHasSignedContract(hasSigned);
       setHasTemplateContract(hasTemplate);

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
     className={`border p-4 rounded-2xl flex items-center justify-between cursor-pointer transition-colors group shadow-sm animate-slideDown ${hasTemplateContract ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-900/30 hover:bg-blue-100/50 dark:hover:bg-blue-900/30' : 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-900/30 hover:bg-amber-100/50 dark:hover:bg-amber-900/30'}`}
   >
     <div className="flex items-center gap-3">
       <div className={`w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform ${hasTemplateContract ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400' : 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400'}`}>
         <FileText size={20} />
       </div>
       <div>
         <p className={`text-sm font-bold ${hasTemplateContract ? 'text-blue-900 dark:text-blue-200' : 'text-amber-900 dark:text-amber-200'}`}>
           {hasTemplateContract ? 'Contrato Disponível para Assinatura' : 'Envio do Contrato Assinado Pendente'}
         </p>
         <p className={`text-xs ${hasTemplateContract ? 'text-blue-700 dark:text-blue-300' : 'text-amber-700 dark:text-amber-400'}`}>
           {hasTemplateContract ? 'A Dra. Raiane enviou seu contrato de prestação de serviços. Clique para baixar, assinar e reenviar.' : 'Por favor, assine e faça o upload do seu contrato de prestação de serviços na plataforma.'}
         </p>
       </div>
     </div>
     <button className={`flex items-center gap-1 text-xs font-bold group-hover:translate-x-1 transition-transform flex-shrink-0 ${hasTemplateContract ? 'text-blue-700 dark:text-blue-300' : 'text-amber-700 dark:text-amber-300'}`}>
       {hasTemplateContract ? 'Acessar Contrato' : 'Enviar Agora'}
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

 {/* Hero Section */}
 <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
 {/* Dynamic Main Card */}
 <div className="lg:col-span-3 relative overflow-hidden bg-surface rounded-[24px] border border-outline-variant shadow-sm transition-all hover:shadow-md3-1">
 {anamnesisStatus === 'loading' && (
 <div className="p-6 flex items-center justify-center min-h-[180px]">
 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
 </div>
 )}

 {/* CASE 1: Has Scheduled Appointment (Priority Display) */}
 {nextAppointment && (
 <div className={`p-5 md:p-6 h-full flex flex-col justify-between relative overflow-hidden transition-colors ${nextAppointment.isPaid ? 'bg-primary-100 dark:bg-primary-900/30' : 'bg-background bg-surface-variant/40'}`}>
 <div className="relative z-10">
 <div className="flex items-center justify-between mb-3">
 <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide backdrop-blur-sm ${nextAppointment.isPaid ? 'bg-surface/60 /60 text-primary-800 dark:text-primary-300' : 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50'}`}>
 {nextAppointment.isPaid ? (
 <>
 <span className="w-2 h-2 bg-primary dark:bg-primary-400 rounded-full animate-pulse transition-colors"></span>
 Próxima Sessão
 </>
 ) : (
 <>
 <AlertCircle size={12} className="text-amber-600 dark:text-amber-400" />
 Aguardando Pagamento
 </>
 )}
 </div>
 {!nextAppointment.isPaid && (
 <button
 onClick={() => navigate('/area-cliente/patient/financial')}
 className="text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-200/50 dark:bg-amber-900/50 px-2 py-1 rounded-lg hover:bg-amber-200 dark:hover:bg-amber-900 transition-colors"
 >
 Pagar e Confirmar
 </button>
 )}
 </div>

 <div className={!nextAppointment.isPaid ? 'opacity-60 grayscale-[0.5]' : ''}>
 <h3 className="text-xl md:text-2xl font-medium text-on-surface mb-1 transition-colors">{nextAppointment.title}</h3>
 <p className="text-slate-700 dark:text-slate-300 font-medium mb-4 text-xs md:text-sm transition-colors">
 {isToday(parseISO(nextAppointment.date)) ? 'É hoje!' : `Faltam ${Math.ceil((new Date(nextAppointment.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} dias`}
 </p>

 <div className={`flex flex-wrap items-center gap-4 md:gap-8 pt-4 border-t transition-colors ${nextAppointment.isPaid ? 'border-primary-200/60 dark:border-primary-800/40' : 'border-outline '}`}>
 <div className="flex items-center gap-3">
 <div className={`p-2 rounded-xl transition-colors ${nextAppointment.isPaid ? 'bg-surface text-primary-700 ' : 'bg-slate-200 text-on-surface-variant '}`}>
 <Calendar size={18} />
 </div>
 <div>
 <p className="text-[9px] text-on-surface-variant dark:text-on-surface-variant font-bold uppercase transition-colors">Data</p>
 <p className="text-xs md:text-sm font-medium text-slate-900 dark:text-slate-100 transition-colors capitalize">
 {format(parseISO(nextAppointment.date), "EEEE, d 'de' MMMM", { locale: ptBR })}
 </p>
 </div>
 </div>

 <div className="flex items-center gap-3">
 <div className={`p-2 rounded-xl transition-colors ${nextAppointment.isPaid ? 'bg-surface text-primary-700 ' : 'bg-slate-200 text-on-surface-variant '}`}>
 <Clock size={18} />
 </div>
 <div>
 <p className="text-[9px] text-on-surface-variant dark:text-on-surface-variant font-bold uppercase transition-colors">Horário</p>
 <p className="text-xs md:text-sm font-medium text-slate-900 dark:text-slate-100 transition-colors">
 {format(parseISO(nextAppointment.date), "HH:mm")}
 </p>
 </div>
 </div>
 </div>
 </div>

 {!nextAppointment.isPaid && (
 <div className="mt-6 p-4 bg-surface/50 /50 border border-outline rounded-2xl transition-colors">
 <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
 Esta sessão foi pré-agendada. Para confirmar sua vaga e liberar os detalhes do atendimento, por favor realize o pagamento na aba financeiro.
 </p>
 </div>
 )}
 </div>
 </div>
 )}

 {/* CASE 2: No Appointment but Anamnesis Completed */}
 {!nextAppointment && anamnesisStatus === 'completed' && (
 <div className="p-6 bg-green-50 dark:bg-green-900/10 h-full flex flex-col justify-center min-h-[180px] transition-colors">
 <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 rounded-full text-[10px] font-bold uppercase tracking-wide mb-3 w-fit transition-colors">
 <CheckCircle2 size={12} />
 Recebido
 </div>
 <h3 className="text-xl md:text-2xl font-medium text-slate-900 dark:text-green-100 mb-1 transition-colors">Anamnese Enviada!</h3>
 <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 mb-4 max-w-lg transition-colors">
 Obrigado pelas informações. Nossa equipe já recebeu e está em análise. Você será notificado do agendamento.
 </p>
 <div className="flex items-center gap-2 text-green-700 dark:text-green-500 font-bold bg-surface/50 bg-surface-variant/40 px-3 py-2 rounded-xl w-fit text-xs transition-colors">
 <Clock size={16} />
 <span>Aguardando agendamento...</span>
 </div>
 </div>
 )}

 {/* CASE 3: Anamnesis Pending */}
 {!nextAppointment && anamnesisStatus === 'pending' && (
 <div className="p-6 bg-amber-50 dark:bg-amber-900/10 h-full flex flex-col justify-center min-h-[180px] transition-colors">
 <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 rounded-full text-[10px] font-bold uppercase tracking-wide mb-3 w-fit transition-colors">
 <span className="w-2 h-2 bg-amber-600 dark:bg-amber-400 rounded-full animate-pulse"></span>
 Ação Necessária
 </div>
 <h3 className="text-xl md:text-2xl font-medium text-slate-900 dark:text-amber-100 mb-1 transition-colors">Preencher Pré-Anamnese</h3>
 <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 mb-4 max-w-lg transition-colors">Para iniciarmos o atendimento, precisamos conhecer um pouco mais sobre o histórico.</p>
 <button
 onClick={() => navigate('/area-cliente/patient/anamnesis')}
 className="w-fit px-5 py-2.5 bg-amber-600 dark:bg-amber-700 text-white font-bold rounded-full hover:bg-amber-700 dark:hover:bg-amber-600 transition-colors text-xs flex items-center gap-2 shadow-sm"
 >
 Começar Agora
 <ChevronRight size={14} />
 </button>
 </div>
 )}
 </div>

 {/* Quick Action Card - WhatsApp Green Color */}
 <div className="bg-gradient-to-br from-[#128C7E] to-[#075E54] rounded-[24px] shadow-sm p-6 text-white flex flex-col justify-center relative overflow-hidden lg:col-span-1 transition-colors">
 <div className="relative z-10 flex flex-col items-center text-center">
 <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-3">
 <MessageCircle size={20} className="text-white" />
 </div>
 <h3 className="text-lg font-normal mb-1">Precisa conversar?</h3>
 <p className="text-emerald-100 text-[10px] mb-4 leading-relaxed transition-colors">Dúvidas rápidas pelo Whatsapp</p>

 <a
 href="https://wa.me/5516991864393"
 target="_blank"
 rel="noopener noreferrer"
 className="w-full py-2.5 bg-white text-[#075E54] font-bold rounded-full hover:bg-white/90 transition-colors text-xs flex items-center justify-center gap-2 shadow-sm"
 >
 Abrir Whatsapp
 </a>
 </div>
 </div>
 </div>

 {/* Secondary Section */}
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
 {/* Recent Activity */}
 <div className="bg-surface rounded-[24px] border border-outline-variant p-5 md:p-6 shadow-sm transition-colors">
 <div className="flex items-center justify-between mb-4">
 <h3 className="font-medium text-lg text-on-surface transition-colors">Últimas Sessões</h3>
 <button
 onClick={() => navigate('/area-cliente/patient/library')}
 className="text-xs font-bold text-primary hover:text-primary-700 dark:hover:text-primary-300 px-3 py-1 rounded-full hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors"
 >
 Ver todas
 </button>
 </div>

 <div className="space-y-3">
 {pastAppointments.length === 0 ? (
 <div className="text-center py-6 text-outline text-sm italic">
 <p>Nenhuma sessão concluída ainda.</p>
 </div>
 ) : (
 pastAppointments.map(appt => {
 const isExpanded = expandedSessions.has(appt.id);
 const hasLongNotes = appt.notes && appt.notes.length > 120;

 return (
 <div key={appt.id} className="flex gap-3 p-4 rounded-[16px] bg-background border border-transparent hover:border-outline-variant dark:hover:border-slate-700 transition-all">
 <div className="mt-0.5 text-primary transition-colors">
 <CheckCircle2 size={20} />
 </div>
 <div className="flex-1 min-w-0">
 <div className="flex items-center justify-between mb-0.5">
 <h4 className="font-bold text-on-surface text-sm transition-colors">
 {format(parseISO(appt.date), "dd 'de' MMMM", { locale: ptBR })}
 </h4>
 <span className="text-[9px] font-bold uppercase bg-surface border border-outline px-1.5 py-0.5 rounded text-on-surface-variant transition-colors">
 {appt.type || 'Presencial'}
 </span>
 </div>
 <div className="relative">
 <p className={`text-xs text-slate-600 leading-relaxed transition-colors ${!isExpanded ? 'line-clamp-2' : ''}`}>
 {appt.notes || 'Sem resumo disponível para esta sessão.'}
 </p>
 {hasLongNotes && (
 <button
 onClick={() => toggleSessionExpansion(appt.id)}
 className="text-[10px] font-bold text-primary mt-1 hover:underline focus:outline-none transition-colors"
 >
 {isExpanded ? 'Ver menos' : '... ver mais'}
 </button>
 )}
 </div>
 </div>
 </div>
 );
 })
 )}
 </div>
 </div>

 {/* Progress Overview */}
 <div className="bg-surface rounded-[24px] border border-outline-variant p-5 md:p-6 shadow-sm flex flex-col transition-colors">
 <div className="w-full">
 <h3 className="font-medium text-lg text-on-surface mb-6 font-normal tracking-tight transition-colors">Seu Progresso</h3>

 <div className="max-w-md mx-auto">
 <div className="flex mb-2 items-center justify-between">
 <span className={`text-[10px] font-bold py-1 px-2.5 uppercase rounded-full transition-colors ${progressPercent === 100 ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300' : 'bg-primary-100 dark:bg-primary-900/40 text-primary-900 dark:text-primary-300'}`}>
 {progressPercent === 100 ? 'Concluído' : 'Em andamento'}
 </span>
 <span className="text-base font-bold text-primary transition-colors">{progressPercent}%</span>
 </div>
 <div className="overflow-hidden h-2.5 mb-6 text-xs flex rounded-full bg-surface-variant transition-colors">
 <div
 style={{ width: `${progressPercent}%` }}
 className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-1000 rounded-full ${progressPercent === 100 ? 'bg-green-500' : 'bg-primary '}`}
 />
 </div>

 {/* Objectives List for Patient */}
 <div className="space-y-2 mt-4 max-h-[280px] overflow-y-auto pr-1 custom-scrollbar">
 {objectives.length > 0 ? (
 objectives.map(obj => (
 <div
 key={obj.id}
 className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${obj.is_completed ? 'bg-green-50/30 dark:bg-green-900/10 border-green-100 dark:border-green-900/30 opacity-80' : 'bg-background border-outline-variant '}`}
 >
 <div className={obj.is_completed ? 'text-green-600 dark:text-green-400' : 'text-slate-300 dark:text-slate-600'}>
 {obj.is_completed ? <CheckCircle2 size={18} /> : <Circle size={18} />}
 </div>
 <p className={`text-xs font-medium leading-tight transition-colors ${obj.is_completed ? 'text-on-surface-variant dark:text-on-surface-variant line-through' : 'text-slate-700 '}`}>
 {obj.description}
 </p>
 </div>
 ))
 ) : (
 <p className="text-xs text-outline dark:text-on-surface-variant text-center italic py-4 transition-colors">
 Os objetivos terapêuticos serão listados aqui assim que definidos.
 </p>
 )}
 </div>

 <p className="text-[10px] text-outline dark:text-on-surface-variant text-center mt-6 uppercase font-bold tracking-widest transition-colors">
 Metas do Semestre
 </p>
 </div>
 </div>
 </div>
 </div>
 </div>
 );
};

export default PatientDashboard;
