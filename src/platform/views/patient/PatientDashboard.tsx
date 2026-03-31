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
import { supabase } from '../../lib/supabase';
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

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        // Check Anamnesis
        const { data: anamnesis } = await supabase
          .from('anamnesis')
          .select('status')
          .eq('patient_id', user.id)
          .maybeSingle();

        setAnamnesisStatus(anamnesis?.status === 'completed' ? 'completed' : 'pending');

        // Check Next Appointment joined with invoices
        const { data: appointment } = await supabase
          .from('appointments')
          .select('*, invoices(status)')
          .eq('patient_id', user.id)
          .gte('date', new Date().toISOString())
          .order('date', { ascending: true })
          .limit(1)
          .maybeSingle();

        if (appointment) {
          // If the appointment has at least one unpaid invoice, we mark it as pending
          const isPaid = !appointment.invoices || appointment.invoices.length === 0 || appointment.invoices.some((inv: any) => inv.status === 'paid');
          setNextAppointment({ ...appointment, isPaid });
        }

        // Fetch Past Appointments
        const { data: past } = await supabase
          .from('appointments')
          .select('*')
          .eq('patient_id', user.id)
          .eq('status', 'completed')
          .order('date', { ascending: false })
          .limit(2);

        if (past) {
          setPastAppointments(past);
        }

        // Fetch Pending Invoices
        const { count } = await supabase
          .from('invoices')
          .select('*', { count: 'exact', head: true })
          .eq('patient_id', user.id)
          .eq('status', 'pending');

        setPendingInvoicesCount(count || 0);

        // Fetch Objectives
        const { data: objs } = await supabase
          .from('patient_objectives')
          .select('*')
          .eq('patient_id', user.id)
          .order('created_at', { ascending: true });

        if (objs) {
          setObjectives(objs);
        }

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
          <button className="flex items-center gap-1 text-xs font-bold text-red-600 dark:text-red-400 group-hover:translate-x-1 transition-transform">
            Pagar Agora
            <ChevronRight size={14} />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-normal text-slate-800 dark:text-white tracking-tight transition-colors">Olá, {user?.name.split(' ')[0] || 'Visitante'}</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm md:text-base transition-colors">Acompanhe seu progresso.</p>
        </div>
      </div>

      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Dynamic Main Card */}
        <div className="lg:col-span-3 relative overflow-hidden bg-white dark:bg-slate-800 rounded-[24px] border border-slate-100 dark:border-slate-700 shadow-sm transition-all hover:shadow-md3-1">
          {anamnesisStatus === 'loading' && (
            <div className="p-6 flex items-center justify-center min-h-[180px]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          )}

          {/* CASE 1: Has Scheduled Appointment (Priority Display) */}
          {nextAppointment && (
            <div className={`p-5 md:p-6 h-full flex flex-col justify-between relative overflow-hidden transition-colors ${nextAppointment.isPaid ? 'bg-primary-100 dark:bg-primary-900/30' : 'bg-slate-50 dark:bg-slate-900/40'}`}>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide backdrop-blur-sm ${nextAppointment.isPaid ? 'bg-white/60 dark:bg-slate-800/60 text-primary-800 dark:text-primary-300' : 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50'}`}>
                    {nextAppointment.isPaid ? (
                      <>
                        <span className="w-2 h-2 bg-primary-600 dark:bg-primary-400 rounded-full animate-pulse transition-colors"></span>
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
                  <h3 className="text-xl md:text-2xl font-medium text-slate-900 dark:text-white mb-1 transition-colors">{nextAppointment.title}</h3>
                  <p className="text-slate-700 dark:text-slate-300 font-medium mb-4 text-xs md:text-sm transition-colors">
                    {isToday(parseISO(nextAppointment.date)) ? 'É hoje!' : `Faltam ${Math.ceil((new Date(nextAppointment.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} dias`}
                  </p>

                  <div className={`flex flex-wrap items-center gap-4 md:gap-8 pt-4 border-t transition-colors ${nextAppointment.isPaid ? 'border-primary-200/60 dark:border-primary-800/40' : 'border-slate-200 dark:border-slate-700'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl transition-colors ${nextAppointment.isPaid ? 'bg-white dark:bg-slate-800 text-primary-700 dark:text-primary-400' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}`}>
                        <Calendar size={18} />
                      </div>
                      <div>
                        <p className="text-[9px] text-slate-500 dark:text-slate-500 font-bold uppercase transition-colors">Data</p>
                        <p className="text-xs md:text-sm font-medium text-slate-900 dark:text-slate-100 transition-colors capitalize">
                          {format(parseISO(nextAppointment.date), "EEEE, d 'de' MMMM", { locale: ptBR })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl transition-colors ${nextAppointment.isPaid ? 'bg-white dark:bg-slate-800 text-primary-700 dark:text-primary-400' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}`}>
                        <Clock size={18} />
                      </div>
                      <div>
                        <p className="text-[9px] text-slate-500 dark:text-slate-500 font-bold uppercase transition-colors">Horário</p>
                        <p className="text-xs md:text-sm font-medium text-slate-900 dark:text-slate-100 transition-colors">
                          {format(parseISO(nextAppointment.date), "HH:mm")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {!nextAppointment.isPaid && (
                  <div className="mt-6 p-4 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl transition-colors">
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
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
              <h3 className="text-xl md:text-2xl font-medium text-slate-900 dark:text-white mb-1 transition-colors">Anamnese Enviada!</h3>
              <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 mb-4 max-w-lg transition-colors">
                Obrigado pelas informações. Nossa equipe já recebeu e está em análise. Você será notificado do agendamento.
              </p>
              <div className="flex items-center gap-2 text-green-700 dark:text-green-500 font-bold bg-white/50 dark:bg-slate-900/40 px-3 py-2 rounded-xl w-fit text-xs transition-colors">
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
              <h3 className="text-xl md:text-2xl font-medium text-slate-900 dark:text-white mb-1 transition-colors">Preencher Pré-Anamnese</h3>
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

        {/* Quick Action Card - Primary Color */}
        <div className="bg-primary-600 dark:bg-primary-700 rounded-[24px] shadow-sm p-6 text-white flex flex-col justify-center relative overflow-hidden lg:col-span-1 transition-colors">
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-3">
              <MessageCircle size={20} className="text-white" />
            </div>
            <h3 className="text-lg font-normal mb-1">Precisa conversar?</h3>
            <p className="text-primary-100 dark:text-primary-200 text-[10px] mb-4 leading-relaxed transition-colors">Dúvidas rápidas pelo Whatsapp</p>

            <a
              href="https://wa.me/5516991864393"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 bg-primary-100 dark:bg-primary-200 text-primary-900 dark:text-primary-900 font-bold rounded-full hover:bg-white dark:hover:bg-slate-100 transition-colors text-xs flex items-center justify-center gap-2"
            >
              Abrir Whatsapp
            </a>
          </div>
        </div>
      </div>

      {/* Secondary Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Activity */}
        <div className="bg-white dark:bg-slate-800 rounded-[24px] border border-slate-100 dark:border-slate-700 p-5 md:p-6 shadow-sm transition-colors">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-lg text-slate-800 dark:text-white transition-colors">Últimas Sessões</h3>
            <button
              onClick={() => navigate('/area-cliente/patient/library')}
              className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 px-3 py-1 rounded-full hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors"
            >
              Ver todas
            </button>
          </div>

          <div className="space-y-3">
            {pastAppointments.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-sm italic">
                <p>Nenhuma sessão concluída ainda.</p>
              </div>
            ) : (
              pastAppointments.map(appt => {
                const isExpanded = expandedSessions.has(appt.id);
                const hasLongNotes = appt.notes && appt.notes.length > 120;

                return (
                  <div key={appt.id} className="flex gap-3 p-4 rounded-[16px] bg-slate-50 dark:bg-slate-900 border border-transparent hover:border-slate-100 dark:hover:border-slate-700 transition-all">
                    <div className="mt-0.5 text-primary-600 dark:text-primary-400 transition-colors">
                      <CheckCircle2 size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <h4 className="font-bold text-slate-800 dark:text-white text-sm transition-colors">
                          {format(parseISO(appt.date), "dd 'de' MMMM", { locale: ptBR })}
                        </h4>
                        <span className="text-[9px] font-bold uppercase bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 rounded text-slate-500 dark:text-slate-400 transition-colors">
                          {appt.type || 'Presencial'}
                        </span>
                      </div>
                      <div className="relative">
                        <p className={`text-xs text-slate-600 dark:text-slate-400 leading-relaxed transition-colors ${!isExpanded ? 'line-clamp-2' : ''}`}>
                          {appt.notes || 'Sem resumo disponível para esta sessão.'}
                        </p>
                        {hasLongNotes && (
                          <button
                            onClick={() => toggleSessionExpansion(appt.id)}
                            className="text-[10px] font-bold text-primary-600 dark:text-primary-400 mt-1 hover:underline focus:outline-none transition-colors"
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
        <div className="bg-white dark:bg-slate-800 rounded-[24px] border border-slate-100 dark:border-slate-700 p-5 md:p-6 shadow-sm flex flex-col transition-colors">
          <div className="w-full">
            <h3 className="font-medium text-lg text-slate-800 dark:text-white mb-6 font-normal tracking-tight transition-colors">Seu Progresso</h3>

            <div className="max-w-md mx-auto">
              <div className="flex mb-2 items-center justify-between">
                <span className={`text-[10px] font-bold py-1 px-2.5 uppercase rounded-full transition-colors ${progressPercent === 100 ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300' : 'bg-primary-100 dark:bg-primary-900/40 text-primary-900 dark:text-primary-300'}`}>
                  {progressPercent === 100 ? 'Concluído' : 'Em andamento'}
                </span>
                <span className="text-base font-bold text-primary-600 dark:text-primary-400 transition-colors">{progressPercent}%</span>
              </div>
              <div className="overflow-hidden h-2.5 mb-6 text-xs flex rounded-full bg-slate-100 dark:bg-slate-700 transition-colors">
                <div
                  style={{ width: `${progressPercent}%` }}
                  className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-1000 rounded-full ${progressPercent === 100 ? 'bg-green-500' : 'bg-primary-600 dark:bg-primary-500'}`}
                />
              </div>

              {/* Objectives List for Patient */}
              <div className="space-y-2 mt-4 max-h-[280px] overflow-y-auto pr-1 custom-scrollbar">
                {objectives.length > 0 ? (
                  objectives.map(obj => (
                    <div
                      key={obj.id}
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${obj.is_completed ? 'bg-green-50/30 dark:bg-green-900/10 border-green-100 dark:border-green-900/30 opacity-80' : 'bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-700'}`}
                    >
                      <div className={obj.is_completed ? 'text-green-600 dark:text-green-400' : 'text-slate-300 dark:text-slate-600'}>
                        {obj.is_completed ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                      </div>
                      <p className={`text-xs font-medium leading-tight transition-colors ${obj.is_completed ? 'text-slate-500 dark:text-slate-500 line-through' : 'text-slate-700 dark:text-slate-200'}`}>
                        {obj.description}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 dark:text-slate-500 text-center italic py-4 transition-colors">
                    Os objetivos terapêuticos serão listados aqui assim que definidos.
                  </p>
                )}
              </div>

              <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center mt-6 uppercase font-bold tracking-widest transition-colors">
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