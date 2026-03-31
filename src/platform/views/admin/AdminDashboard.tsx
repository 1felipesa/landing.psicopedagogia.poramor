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
import { supabase } from '../../lib/supabase';

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

        // Parallel requests
        const [patientsRes, anamnesisRes, appointmentsRes, chartApptsRes, financialRes, objectivesRes] = await Promise.all([
          supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'patient'),
          supabase.from('anamnesis').select('id', { count: 'exact', head: true }).eq('status', 'completed'),
          supabase.from('appointments')
            .select(`*, patient:profiles(full_name)`)
            .gte('date', todayStr)
            .lt('date', new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0])
            .order('date', { ascending: true }),
          supabase.from('appointments')
            .select('date')
            .gte('date', startYear)
            .lte('date', endYear),
          supabase.from('invoices')
            .select('amount')
            .eq('status', 'pending')
            .gte('due_date', firstDayOfMonth)
            .lte('due_date', lastDayOfMonth),
          supabase.from('patient_objectives').select('is_completed')
        ]);

        // Process Clinical AI
        const objectives = objectivesRes.data || [];
        const completedObj = objectives.filter(o => o.is_completed).length;
        const totalObj = objectives.length;
        
        const pendingAnamnesisCount = (patientsRes.count || 0) - (anamnesisRes.count || 0);

        setClinicProgress({
            totalObjectives: totalObj,
            completedObjectives: completedObj,
            pendingAnamnesis: pendingAnamnesisCount > 0 ? pendingAnamnesisCount : 0
        });

        // Process Financial
        const pendingAmount = financialRes.data?.reduce((acc, curr) => acc + Number(curr.amount), 0) || 0;

        // Process Stats
        setStats({
          activePatients: patientsRes.count || 0,
          anamnesisCount: anamnesisRes.count || 0,
          todayAppointmentsCount: appointmentsRes.data?.length || 0,
          pendingFinancial: pendingAmount
        });

        if (appointmentsRes.data) {
          setTodayAppointments(appointmentsRes.data);
        }

        // Process Chart Data (Group by Month)
        if (chartApptsRes.data) {
          const months = Array.from({ length: 12 }, (_, i) => {
            const d = new Date(new Date().getFullYear(), i, 1);
            return {
              name: format(d, 'MMM', { locale: ptBR }),
              monthIndex: i,
              sessions: 0
            };
          });

          chartApptsRes.data.forEach(appt => {
            const date = parseISO(appt.date);
            const monthIndex = date.getMonth();
            months[monthIndex].sessions += 1;
          });

          // Capitalize month names
          const formattedData = months.map(m => ({
            ...m,
            name: m.name.charAt(0).toUpperCase() + m.name.slice(1)
          }));

          setChartData(formattedData);
        }

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
        <h2 className="text-2xl md:text-3xl font-normal text-slate-800 dark:text-white transition-colors">Olá, {user?.name.split(' ')[0] || 'Dra.'}</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm md:text-base transition-colors">Resumo dos atendimentos.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat Card 1 */}
        <div className="bg-white dark:bg-slate-800 p-4 md:p-5 rounded-[20px] shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md3-1 transition-all flex md:flex-col items-center md:items-start gap-4 md:gap-0">
          <div className="p-3 bg-primary-100 text-primary-700 rounded-2xl flex-shrink-0">
            <Users size={24} />
          </div>
          <div>
            <h3 className="text-2xl md:text-4xl font-normal text-slate-800 dark:text-white md:mt-2 transition-colors">
              {loading ? '-' : stats.activePatients}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm font-medium mt-1 transition-colors">Pacientes Cadastrados</p>
          </div>
        </div>

        {/* Stat Card 2 */}
        <div className="bg-white dark:bg-slate-800 p-4 md:p-5 rounded-[20px] shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md3-1 transition-all flex md:flex-col items-center md:items-start gap-4 md:gap-0">
          <div className="p-3 bg-secondary-100 text-secondary-900 rounded-2xl flex-shrink-0">
            <AlertCircle size={24} />
          </div>
          <div>
            <h3 className="text-2xl md:text-4xl font-normal text-slate-800 dark:text-white md:mt-2 transition-colors">
              {loading ? '-' : stats.anamnesisCount}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm font-medium mt-1 transition-colors">Anamneses Recebidas</p>
          </div>
        </div>

        {/* Stat Card 3 */}
        <div className="bg-white dark:bg-slate-800 p-4 md:p-5 rounded-[20px] shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md3-1 transition-all flex md:flex-col items-center md:items-start gap-4 md:gap-0">
          <div className="p-3 bg-purple-50 text-purple-700 rounded-2xl flex-shrink-0">
            <CalendarClock size={24} />
          </div>
          <div>
            <h3 className="text-2xl md:text-4xl font-normal text-slate-800 dark:text-white md:mt-2 transition-colors">
              {loading ? '-' : stats.todayAppointmentsCount}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm font-medium mt-1 transition-colors">Consultas Hoje</p>
          </div>
        </div>

        {/* Stat Card 4 */}
        <div className="bg-white dark:bg-slate-800 p-4 md:p-5 rounded-[20px] shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md3-1 transition-all flex md:flex-col items-center md:items-start gap-4 md:gap-0">
          <div className="p-3 bg-blue-50 text-blue-700 rounded-2xl flex-shrink-0">
            <Wallet size={24} />
          </div>
          <div>
            <h3 className="text-xl md:text-3xl font-bold text-slate-800 dark:text-white md:mt-2 transition-colors">
              {loading ? '-' : `R$ ${stats.pendingFinancial.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}`}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm font-medium mt-1 transition-colors">A Receber (Mês)</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-4 md:p-6 rounded-[24px] border border-slate-100 dark:border-slate-700 shadow-sm transition-colors">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-medium text-lg md:text-xl text-slate-800 dark:text-white transition-colors">Volume de Atendimentos</h3>
            <button className="text-xs md:text-sm bg-surface-variant dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-3 md:px-4 py-1.5 md:py-2 rounded-full font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
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
        <div className="bg-white dark:bg-slate-800 p-6 rounded-[24px] border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col h-full transition-colors">
          <h3 className="font-medium text-lg md:text-xl text-slate-800 dark:text-white mb-6 flex items-center gap-2 transition-colors">
            <CalendarClock size={20} className="text-primary-600 dark:text-primary-400" />
            Agenda de Hoje
          </h3>

          <div className="flex-1 overflow-y-auto pr-2 space-y-3 max-h-[400px]">
            {todayAppointments.length > 0 ? (
              todayAppointments.map((appt) => (
                <div 
                  key={appt.id} 
                  className="flex items-center gap-3 md:gap-4 p-3 md:p-4 border border-slate-100 dark:border-slate-700/60 rounded-2xl hover:bg-primary-50 dark:hover:bg-slate-700 hover:border-primary-100 dark:hover:border-slate-600 transition-all cursor-pointer group"
                  onClick={() => navigate('/area-cliente/admin/schedule')}
                >
                  <div className="min-w-[45px] md:min-w-[50px] text-center">
                    <p className="text-xs md:text-sm font-bold text-slate-800 dark:text-slate-200 transition-colors">{format(parseISO(appt.date), 'HH:mm')}</p>
                    <span className="text-[9px] uppercase font-bold text-slate-400 dark:text-slate-500 transition-colors">{appt.type === 'online' ? 'Video' : 'Presenc.'}</span>
                  </div>
                  <div className="w-px h-8 bg-slate-200 dark:bg-slate-600 transition-colors"></div>
                  <div className="overflow-hidden">
                    <p className="font-bold text-slate-800 dark:text-slate-200 text-sm truncate transition-colors">{appt.patient?.full_name}</p>
                    <p className="text-[11px] md:text-xs text-slate-500 dark:text-slate-400 truncate transition-colors">{appt.title}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 space-y-4 min-h-[150px] transition-colors">
                <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-full transition-colors">
                  <CalendarClock size={32} className="opacity-40" />
                </div>
                <p className="text-center text-sm font-medium">Nenhuma sessão para hoje.</p>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-50 dark:border-slate-700/50 transition-colors">
            <button 
              onClick={() => navigate('/area-cliente/admin/schedule')}
              className="text-sm text-primary-600 dark:text-primary-400 font-bold hover:bg-primary-50 dark:hover:bg-slate-700 px-6 py-3 rounded-full transition-colors w-full"
            >
              Ver Agenda Completa
            </button>
          </div>
        </div>
      </div>

      {/* Clinical Intelligence Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Global Progress Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-[24px] border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col md:flex-row items-center gap-8 transition-colors">
            <div className="flex-1 w-full">
                <h3 className="font-medium text-lg md:text-xl text-slate-800 dark:text-white mb-2 transition-colors">Evolução Clínica Global</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 transition-colors">Média de atingimento de todos os objetivos traçados na clínica.</p>
                
                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between text-sm mb-1 font-bold">
                            <span className="text-slate-700 dark:text-slate-300 transition-colors">Objetivos Concluídos</span>
                            <span className="text-green-600 dark:text-green-500">{(clinicProgress?.completedObjectives) || 0}</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                            <div className="bg-green-500 h-full transition-all duration-1000" style={{ width: clinicProgress?.totalObjectives ? `${(clinicProgress.completedObjectives / clinicProgress.totalObjectives) * 100}%` : '0%' }} />
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-sm mb-1 font-bold">
                            <span className="text-slate-700 dark:text-slate-300 transition-colors">Em Andamento</span>
                            <span className="text-primary-600 dark:text-primary-400">{(clinicProgress?.totalObjectives || 0) - (clinicProgress?.completedObjectives || 0)}</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
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
                            <span className="text-2xl font-bold text-slate-800 dark:text-white transition-colors">
                                {clinicProgress?.totalObjectives > 0 ? Math.round((clinicProgress.completedObjectives / clinicProgress.totalObjectives) * 100) : 0}%
                            </span>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase transition-colors">Sucesso</span>
                        </div>
                    </>
                )}
            </div>
        </div>

        {/* Engagement Alerts */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 p-6 rounded-[24px] border border-amber-100/50 dark:border-amber-700/30 shadow-sm flex flex-col justify-center transition-colors">
            <h3 className="font-bold text-amber-900 dark:text-amber-200 mb-2 transition-colors">Termômetro de Engajamento</h3>
            <p className="text-xs text-amber-700/80 dark:text-amber-200/60 mb-6 leading-relaxed transition-colors">Fique de olho em pacientes que precisam da sua atenção para avançar no tratamento.</p>
            
            <div className="bg-white/60 dark:bg-slate-900/40 p-4 rounded-2xl flex items-center gap-4 transition-colors">
                <div className="p-3 bg-amber-100 dark:bg-amber-800 text-amber-600 dark:text-amber-200 rounded-full flex-shrink-0 transition-colors">
                    <AlertCircle size={20} />
                </div>
                <div>
                    <span className="block text-2xl font-black text-amber-600 dark:text-amber-400 leading-none transition-colors">{loading ? '-' : clinicProgress?.pendingAnamnesis}</span>
                    <span className="text-[11px] font-bold text-amber-800 dark:text-amber-500 uppercase tracking-wide transition-colors">Anamneses Pendentes</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;