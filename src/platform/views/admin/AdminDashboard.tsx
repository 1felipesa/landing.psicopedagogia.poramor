import React, { useEffect, useState } from 'react';
import {
 Users,
 CalendarClock,
 TrendingUp,
 AlertCircle,
 Wallet
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../lib/firebase';
import { collection, query, where, getDocs, doc, getDoc, orderBy } from 'firebase/firestore';

import { format, startOfYear, endOfYear, parseISO, isSameDay, startOfMonth, endOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        activePatients: 0,
        anamnesisCount: 0,
        todayAppointmentsCount: 0,
        pendingFinancial: 0
    });
    const [clinicProgress, setClinicProgress] = useState({
        totalObjectives: 0,
        completedObjectives: 0,
        pendingAnamnesis: 0
    });
    const [chartData, setChartData] = useState<any[]>([]);
    const [todayAppointments, setTodayAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const today = new Date();
                const startYear = startOfYear(today).toISOString();
                const endYear = endOfYear(today).toISOString();
                const todayStr = today.toISOString().split('T')[0];

                const firstDayOfMonth = startOfMonth(today).toISOString();
                const lastDayOfMonth = endOfMonth(today).toISOString();

                // 1. Fetch Patients
                const patientsQuery = query(
                    collection(db, 'profiles'),
                    where('role', '==', 'patient')
                );
                
                // 2. Fetch Completed Anamnesis
                const anamnesisQuery = query(
                    collection(db, 'anamnesis'),
                    where('status', '==', 'completed')
                );

                // 3. Fetch Today's Appointments
                const endOfToday = new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                const appointmentsQuery = query(
                    collection(db, 'appointments'),
                    where('date', '>=', todayStr),
                    where('date', '<', endOfToday)
                );

                // 4. Fetch Chart Appointments
                const chartQuery = query(
                    collection(db, 'appointments'),
                    where('date', '>=', startYear),
                    where('date', '<=', endYear)
                );

                // 5. Fetch Pending Invoices
                const invoicesQuery = query(
                    collection(db, 'invoices'),
                    where('status', '==', 'pending'),
                    where('due_date', '>=', firstDayOfMonth),
                    where('due_date', '<=', lastDayOfMonth)
                );

                // Run queries in parallel
                const [patientsSnap, anamnesisSnap, appointmentsSnap, chartSnap, invoicesSnap, objectivesSnap] = await Promise.all([
                    getDocs(patientsQuery),
                    getDocs(anamnesisQuery),
                    getDocs(appointmentsQuery),
                    getDocs(chartQuery),
                    getDocs(invoicesQuery),
                    getDocs(collection(db, 'patient_objectives'))
                ]);

                // Process Objectives
                const objectives = objectivesSnap.docs.map(docSnap => docSnap.data());
                const completedObj = objectives.filter(o => o.is_completed).length;
                const totalObj = objectives.length;
                
                const activePatientsCount = patientsSnap.size;
                const completedAnamnesisCount = anamnesisSnap.size;
                const pendingAnamnesisCount = activePatientsCount - completedAnamnesisCount;

                setClinicProgress({
                    totalObjectives: totalObj,
                    completedObjectives: completedObj,
                    pendingAnamnesis: pendingAnamnesisCount > 0 ? pendingAnamnesisCount : 0
                });

                // Process Financial
                const pendingAmount = invoicesSnap.docs.reduce((acc, currDoc) => acc + Number(currDoc.data().amount || 0), 0);

                // Process Stats
                setStats({
                    activePatients: activePatientsCount,
                    anamnesisCount: completedAnamnesisCount,
                    todayAppointmentsCount: appointmentsSnap.size,
                    pendingFinancial: pendingAmount
                });

                // Map appointments with patient names (client-side join)
                const rawAppointments = appointmentsSnap.docs.map(docSnap => ({
                    id: docSnap.id,
                    ...docSnap.data()
                })) as any[];

                // Pre-fetch all patient profiles to make lookup fast
                const patientsMap = new Map<string, any>();
                patientsSnap.docs.forEach(docSnap => {
                    patientsMap.set(docSnap.id, docSnap.data());
                });

                const joinedAppointments = rawAppointments.map(appt => {
                    const patientProfile = patientsMap.get(appt.patient_id);
                    return {
                        ...appt,
                        patient: patientProfile ? { full_name: patientProfile.full_name } : { full_name: 'Desconhecido' }
                    };
                });

                // Sort today's appointments by date ascending
                joinedAppointments.sort((a, b) => a.date.localeCompare(b.date));
                setTodayAppointments(joinedAppointments);

                // Process Chart Data (Group by Month)
                const chartApptsData = chartSnap.docs.map(docSnap => docSnap.data());
                const months = Array.from({ length: 12 }, (_, i) => {
                    const d = new Date(new Date().getFullYear(), i, 1);
                    return {
                        name: format(d, 'MMM', { locale: ptBR }),
                        monthIndex: i,
                        sessions: 0
                    };
                });

                chartApptsData.forEach(appt => {
                    if (appt.date) {
                        const date = parseISO(appt.date);
                        const monthIndex = date.getMonth();
                        months[monthIndex].sessions += 1;
                    }
                });

                // Capitalize month names
                const formattedData = months.map(m => ({
                    ...m,
                    name: m.name.charAt(0).toUpperCase() + m.name.slice(1)
                }));

                setChartData(formattedData);

            } catch (error) {
                console.error('Error loading dashboard:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

 return (
 <div className="space-y-6 animate-fadeIn px-4 md:px-0">
 {/* Header */}
 <div>
 <h2 className="text-2xl md:text-3xl font-normal text-on-surface transition-colors">Olá, {user?.name.split(' ')[0] || 'Dra.'}</h2>
 <p className="text-on-surface-variant mt-1 text-sm md:text-base transition-colors">Resumo dos atendimentos.</p>
 </div>

 {/* Stats Grid */}
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
 {/* Stat Card 1 */}
 <div className="bg-surface p-4 md:p-5 rounded-[20px] shadow-sm border border-outline-variant hover:shadow-md3-1 transition-all flex md:flex-col items-center md:items-start gap-4 md:gap-0">
 <div className="p-3 bg-primary/10 text-primary rounded-2xl flex-shrink-0">
 <Users size={24} />
 </div>
 <div>
 <h3 className="text-2xl md:text-4xl font-normal text-on-surface md:mt-2 transition-colors">
 {loading ? '-' : stats.activePatients}
 </h3>
 <p className="text-on-surface-variant text-xs md:text-sm font-medium mt-1 transition-colors">Pacientes Cadastrados</p>
 </div>
 </div>

 {/* Stat Card 2 */}
 <div className="bg-surface p-4 md:p-5 rounded-[20px] shadow-sm border border-outline-variant hover:shadow-md3-1 transition-all flex md:flex-col items-center md:items-start gap-4 md:gap-0">
 <div className="p-3 bg-accent/15 text-accent rounded-2xl flex-shrink-0">
 <AlertCircle size={24} />
 </div>
 <div>
 <h3 className="text-2xl md:text-4xl font-normal text-on-surface md:mt-2 transition-colors">
 {loading ? '-' : stats.anamnesisCount}
 </h3>
 <p className="text-on-surface-variant text-xs md:text-sm font-medium mt-1 transition-colors">Anamneses Recebidas</p>
 </div>
 </div>

 {/* Stat Card 3 */}
 <div className="bg-surface p-4 md:p-5 rounded-[20px] shadow-sm border border-outline-variant hover:shadow-md3-1 transition-all flex md:flex-col items-center md:items-start gap-4 md:gap-0">
 <div className="p-3 bg-purple-500/10 dark:bg-purple-400/10 text-purple-600 dark:text-purple-300 rounded-2xl flex-shrink-0">
 <CalendarClock size={24} />
 </div>
 <div>
 <h3 className="text-2xl md:text-4xl font-normal text-on-surface md:mt-2 transition-colors">
 {loading ? '-' : stats.todayAppointmentsCount}
 </h3>
 <p className="text-on-surface-variant text-xs md:text-sm font-medium mt-1 transition-colors">Consultas Hoje</p>
 </div>
 </div>

 {/* Stat Card 4 */}
 <div className="bg-surface p-4 md:p-5 rounded-[20px] shadow-sm border border-outline-variant hover:shadow-md3-1 transition-all flex md:flex-col items-center md:items-start gap-4 md:gap-0">
 <div className="p-3 bg-blue-500/10 dark:bg-blue-400/10 text-blue-600 dark:text-blue-300 rounded-2xl flex-shrink-0">
 <Wallet size={24} />
 </div>
 <div>
 <h3 className="text-xl md:text-3xl font-bold text-on-surface md:mt-2 transition-colors">
 {loading ? '-' : `R$ ${stats.pendingFinancial.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}`}
 </h3>
 <p className="text-on-surface-variant text-xs md:text-sm font-medium mt-1 transition-colors">A Receber (Mês)</p>
 </div>
 </div>
 </div>

 {/* Main Content Grid */}
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
 {/* Chart Section */}
 <div className="lg:col-span-2 bg-surface p-4 md:p-6 rounded-[24px] border border-outline-variant shadow-sm transition-colors">
 <div className="flex items-center justify-between mb-6">
 <h3 className="font-medium text-lg md:text-xl text-on-surface transition-colors">Volume de Atendimentos</h3>
 <button className="text-xs md:text-sm bg-surface-variant/50 text-on-surface-variant px-3 md:px-4 py-1.5 md:py-2 rounded-full font-medium hover:bg-surface-variant transition-colors">
 {new Date().getFullYear()}
 </button>
 </div>
 <div className="h-[250px] md:h-[300px] w-full">
 {loading ? (
 <div className="h-full w-full flex items-center justify-center">
 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
 </div>
 ) : (
 <ResponsiveContainer width="100%" height="100%">
 <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={document.documentElement.classList.contains('dark') ? '#334155' : '#e7e0ec'} />
 <XAxis
 dataKey="name"
 axisLine={false}
 tickLine={false}
 tick={{ fill: '#8f9bb3', fontSize: 11 }}
 dy={10}
 />
 <YAxis
 axisLine={false}
 tickLine={false}
 tick={{ fill: '#8f9bb3', fontSize: 11 }}
 allowDecimals={false}
 />
 <Tooltip
 cursor={{ fill: 'transparent' }}
 contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.3)', background: '#1e293b', color: '#f8fafc' }}
 itemStyle={{ color: '#f8fafc' }}
 labelStyle={{ color: '#94a3b8' }}
 />
 <Bar dataKey="sessions" radius={[4, 4, 0, 0]} barSize={32}>
 {chartData.map((entry, index) => (
 <Cell key={`cell-${index}`} fill={index === new Date().getMonth() ? (document.documentElement.classList.contains('dark') ? '#a78bfa' : '#6750A4') : (document.documentElement.classList.contains('dark') ? '#475569' : '#64748b')} />
 ))}
 </Bar>
 </BarChart>
 </ResponsiveContainer>
 )}
 </div>
 </div>

 {/* Recent Activity / Next Appointments */}
 <div className="bg-surface p-6 rounded-[24px] border border-outline-variant shadow-sm flex flex-col h-full transition-colors">
 <h3 className="font-medium text-lg md:text-xl text-on-surface mb-6 flex items-center gap-2 transition-colors">
 <CalendarClock size={20} className="text-primary " />
 Agenda de Hoje
 </h3>

 <div className="flex-1 overflow-y-auto pr-2 space-y-3 max-h-[400px]">
 {todayAppointments.length > 0 ? (
 todayAppointments.map((appt) => (
 <div 
 key={appt.id} 
 className="flex items-center gap-3 md:gap-4 p-3 md:p-4 border border-outline-variant /60 rounded-2xl hover:bg-primary-50 dark:hover:bg-slate-700 hover:border-primary-100 dark:hover:border-slate-600 transition-all cursor-pointer group"
 onClick={() => navigate('/area-cliente/admin/schedule')}
 >
 <div className="min-w-[45px] md:min-w-[50px] text-center">
 <p className="text-xs md:text-sm font-bold text-on-surface transition-colors">{format(parseISO(appt.date), 'HH:mm')}</p>
 <span className="text-[9px] uppercase font-bold text-outline dark:text-on-surface-variant transition-colors">{appt.type === 'online' ? 'Video' : 'Presenc.'}</span>
 </div>
 <div className="w-px h-8 bg-slate-200 dark:bg-slate-600 transition-colors"></div>
 <div className="overflow-hidden">
 <p className="font-bold text-on-surface text-sm truncate transition-colors">{appt.patient?.full_name}</p>
 <p className="text-[11px] md:text-xs text-on-surface-variant truncate transition-colors">{appt.title}</p>
 </div>
 </div>
 ))
 ) : (
 <div className="h-full flex flex-col items-center justify-center text-outline dark:text-on-surface-variant space-y-4 min-h-[150px] transition-colors">
 <div className="p-4 bg-background /50 rounded-full transition-colors">
 <CalendarClock size={32} className="opacity-40" />
 </div>
 <p className="text-center text-sm font-medium">Nenhuma sessão para hoje.</p>
 </div>
 )}
 </div>

 <div className="mt-6 pt-4 border-t border-slate-50 /50 transition-colors">
 <button 
 onClick={() => navigate('/area-cliente/admin/schedule')}
 className="text-sm text-primary font-bold hover:bg-primary-50 dark:hover:bg-slate-700 px-6 py-3 rounded-full transition-colors w-full"
 >
 Ver Agenda Completa
 </button>
 </div>
 </div>
 </div>

 {/* Clinical Intelligence Section */}
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
 {/* Global Progress Chart */}
 <div className="lg:col-span-2 bg-surface p-6 rounded-[24px] border border-outline-variant shadow-sm flex flex-col md:flex-row items-center gap-8 transition-colors">
 <div className="flex-1 w-full">
 <h3 className="font-medium text-lg md:text-xl text-on-surface mb-2 transition-colors">Evolução Clínica Global</h3>
 <p className="text-sm text-on-surface-variant mb-6 transition-colors">Média de atingimento de todos os objetivos traçados na clínica.</p>
 
 <div className="space-y-4">
 <div>
 <div className="flex justify-between text-sm mb-1 font-bold">
 <span className="text-slate-700 dark:text-slate-300 transition-colors">Objetivos Concluídos</span>
 <span className="text-green-600 dark:text-green-500">{(clinicProgress?.completedObjectives) || 0}</span>
 </div>
 <div className="w-full bg-surface-variant h-2.5 rounded-full overflow-hidden">
 <div className="bg-green-500 h-full transition-all duration-1000" style={{ width: clinicProgress?.totalObjectives ? `${(clinicProgress.completedObjectives / clinicProgress.totalObjectives) * 100}%` : '0%' }} />
 </div>
 </div>
 <div>
 <div className="flex justify-between text-sm mb-1 font-bold">
 <span className="text-slate-700 dark:text-slate-300 transition-colors">Em Andamento</span>
 <span className="text-primary ">{(clinicProgress?.totalObjectives || 0) - (clinicProgress?.completedObjectives || 0)}</span>
 </div>
 <div className="w-full bg-surface-variant h-2.5 rounded-full overflow-hidden">
 <div className="bg-primary-500 h-full transition-all duration-1000" style={{ width: clinicProgress?.totalObjectives ? `${((clinicProgress.totalObjectives - clinicProgress.completedObjectives) / clinicProgress.totalObjectives) * 100}%` : '0%' }} />
 </div>
 </div>
 </div>
 </div>
 
 <div className="h-[180px] w-[180px] relative flex-shrink-0">
 {loading ? (
 <div className="h-full w-full flex items-center justify-center">
 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
 </div>
 ) : (
 <>
 <ResponsiveContainer width="100%" height="100%">
 <PieChart>
 <Pie
 data={[
 { name: 'Concluído', value: clinicProgress.completedObjectives, color: '#22c55e' },
 { name: 'Em andamento', value: clinicProgress.totalObjectives - clinicProgress.completedObjectives, color: '#6366f1' }
 ]}
 innerRadius={55}
 outerRadius={80}
 paddingAngle={5}
 dataKey="value"
 >
 { [0,1].map((entry, index) => (
 <Cell key={`cell-${index}`} fill={index === 0 ? '#22c55e' : '#6366f1'} />
 ))}
 </Pie>
 </PieChart>
 </ResponsiveContainer>
 <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
 <span className="text-2xl font-bold text-on-surface transition-colors">
 {clinicProgress?.totalObjectives > 0 ? Math.round((clinicProgress.completedObjectives / clinicProgress.totalObjectives) * 100) : 0}%
 </span>
 <span className="text-[10px] text-outline dark:text-on-surface-variant font-bold uppercase transition-colors">Sucesso</span>
 </div>
 </>
 )}
 </div>
 </div>

 {/* Engagement Alerts */}
 <div className="bg-gradient-to-br from-amber-50/80 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/10 p-6 rounded-[24px] border border-amber-200/60 dark:border-amber-900/30 shadow-sm flex flex-col justify-center transition-colors">
 <h3 className="font-bold text-amber-950 dark:text-amber-200 mb-2 transition-colors">Termômetro de Engajamento</h3>
 <p className="text-xs text-amber-900/80 dark:text-amber-300/75 mb-6 leading-relaxed transition-colors">Fique de olho em pacientes que precisam da sua atenção para avançar no tratamento.</p>
 
 <div className="bg-white/80 dark:bg-amber-900/20 border border-amber-200/40 dark:border-amber-800/30 p-4 rounded-2xl flex items-center gap-4 transition-colors">
 <div className="p-2.5 bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 rounded-full flex-shrink-0 transition-colors">
 <AlertCircle size={20} />
 </div>
 <div>
 <span className="block text-3xl font-black text-amber-900 dark:text-amber-200 leading-none transition-colors">{loading ? '-' : clinicProgress?.pendingAnamnesis}</span>
 <span className="text-[10px] font-bold text-amber-950/80 dark:text-amber-300/90 uppercase tracking-wider transition-colors">Anamneses Pendentes</span>
 </div>
 </div>
 </div>
 </div>
 </div>
 );
};

export default AdminDashboard;