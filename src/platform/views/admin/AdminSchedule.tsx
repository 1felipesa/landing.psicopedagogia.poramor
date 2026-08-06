import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Plus,
  Clock,
  User,
  Video,
  MapPin,
  Trash2,
  CheckCircle2,
  List,
  Filter,
  DollarSign,
  Link2,
  CheckCircle
} from 'lucide-react';
import {
  format,
  addDays,
  startOfWeek,
  addWeeks,
  subWeeks,
  isSameDay,
  parseISO,
  isToday
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { db } from '../../lib/firebase';
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';
import { useToast } from '../../context/ToastContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Avatar from '../../components/ui/Avatar';
import {
  DEFAULT_CLIENT_ID,
  initGoogleOAuth,
  getStoredAccessToken,
  listGoogleCalendars,
  createGoogleCalendarEvent,
  updateGoogleCalendarEvent,
  deleteGoogleCalendarEvent,
  UserCalendar
} from '../../lib/googleCalendar';

interface Appointment {
    id: string;
    patient_id: string;
    title: string;
    date: string;
    status: 'scheduled' | 'completed' | 'cancelled';
    type: 'online' | 'presencial';
    notes?: string;
    price?: number;
    patient_name?: string;
    gcal_event_id?: string;
    patient?: {
        full_name: string;
        email?: string;
    };
}

const AdminSchedule: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [patients, setPatients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
    const { showToast } = useToast();

    // Google Calendar Sync State
    const [googleToken, setGoogleToken] = useState<string | null>(() => getStoredAccessToken());
    const [googleCalendars, setGoogleCalendars] = useState<UserCalendar[]>([]);
    const [selectedCalendarId, setSelectedCalendarId] = useState<string>(() => 
        localStorage.getItem('selected_gcal_id') || 'primary'
    );
    const [isConnectingGcal, setIsConnectingGcal] = useState(false);

    // View & Filter States
    const [viewMode, setViewMode] = useState<'agenda' | 'week'>(() => 
        window.innerWidth < 768 ? 'agenda' : 'week'
    );
    const [filterType, setFilterType] = useState<'all' | 'presencial' | 'online'>('all');

    // Form State
    const [selectedPatient, setSelectedPatient] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [appointmentType, setAppointmentType] = useState<'online' | 'presencial'>('presencial');
    const [appointmentPrice, setAppointmentPrice] = useState('150.00'); // Default price
    const [isRecurring, setIsRecurring] = useState(false);
    const [recurrenceCount, setRecurrenceCount] = useState('4');

    useEffect(() => {
        fetchData();
        const token = getStoredAccessToken();
        if (token) {
            setGoogleToken(token);
            loadGoogleCalendars(token);
        } else {
            // Attempt silent token refresh seamlessly
            initGoogleOAuth(
                DEFAULT_CLIENT_ID,
                (newToken) => {
                    setGoogleToken(newToken);
                    loadGoogleCalendars(newToken);
                },
                () => {
                    // User not logged in or silent refresh unsupported
                },
                true // silent = true
            );
        }
    }, []);

    const loadGoogleCalendars = async (token: string) => {
        try {
            const cals = await listGoogleCalendars(token);
            setGoogleCalendars(cals);
            const saved = localStorage.getItem('selected_gcal_id');
            if (!saved) {
                const matched = cals.find(c => c.summary.toLowerCase().includes('psicopedagogia'));
                if (matched) {
                    setSelectedCalendarId(matched.id);
                    localStorage.setItem('selected_gcal_id', matched.id);
                }
            }
        } catch (err) {
            console.error('Error loading Google Calendars:', err);
        }
    };

    const handleConnectGoogle = () => {
        setIsConnectingGcal(true);
        initGoogleOAuth(
            DEFAULT_CLIENT_ID,
            (token) => {
                setGoogleToken(token);
                setIsConnectingGcal(false);
                showToast('Google Calendar conectado com sucesso!');
                loadGoogleCalendars(token);
            },
            (err) => {
                setIsConnectingGcal(false);
                showToast('Erro ao conectar com Google Calendar.', 'error');
            }
        );
    };

    const handleCalendarChange = (calId: string) => {
        setSelectedCalendarId(calId);
        localStorage.setItem('selected_gcal_id', calId);
        showToast('Agenda do Google selecionada para salvamento!');
    };

    const fetchData = async () => {
        try {
            const patientsQuery = query(
                collection(db, 'profiles'),
                where('role', '==', 'patient')
            );
            const patientsSnap = await getDocs(patientsQuery);
            const profiles = patientsSnap.docs
                .map(docSnap => ({
                    id: docSnap.id,
                    full_name: docSnap.data().full_name,
                    email: docSnap.data().email,
                    status: docSnap.data().status
                }))
                .filter(p => p.status !== 'inactive');
            setPatients(profiles);

            const apptsSnap = await getDocs(collection(db, 'appointments'));
            const rawAppts = apptsSnap.docs.map(docSnap => ({
                id: docSnap.id,
                ...docSnap.data()
            })) as any[];

            const patientsMap = new Map<string, any>();
            profiles.forEach(p => patientsMap.set(p.id, p));

            const formatted = rawAppts.map(a => {
                const patientProfile = patientsMap.get(a.patient_id);
                return {
                    ...a,
                    patient_name: patientProfile?.full_name || 'Paciente',
                    patient: patientProfile ? { full_name: patientProfile.full_name, email: patientProfile.email } : undefined
                };
            });

            formatted.sort((a, b) => a.date.localeCompare(b.date));
            setAppointments(formatted);
        } catch (error) {
            console.error('Error fetching schedule data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenEdit = async (appt: Appointment) => {
      setEditingAppointment(appt);
      setSelectedPatient(appt.patient_id);
      const d = parseISO(appt.date);
      setSelectedDate(format(d, 'yyyy-MM-dd'));
      setSelectedTime(format(d, 'HH:mm'));
      setAppointmentType(appt.type);

      let currentPrice = appt.price;
      if (currentPrice === undefined || currentPrice === null) {
        try {
          const invoiceQuery = query(
            collection(db, 'invoices'),
            where('appointment_id', '==', appt.id)
          );
          const invoiceSnap = await getDocs(invoiceQuery);
          if (!invoiceSnap.empty) {
            currentPrice = invoiceSnap.docs[0].data().amount;
          }
        } catch (err) {
          console.error('Error fetching invoice price:', err);
        }
      }

      setAppointmentPrice(currentPrice !== undefined && currentPrice !== null ? currentPrice.toString() : '150.00');
      setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        const dateTime = new Date(`${selectedDate}T${selectedTime}`);
        const patient = patients.find(p => p.id === selectedPatient);
        const title = `Sessão com ${patient?.full_name?.split(' ')[0] || 'Paciente'}`;
        const numericPrice = parseFloat(appointmentPrice) || 0;
        let gcalEventId = editingAppointment?.gcal_event_id;

        // Try syncing with Google Calendar if connected
        const token = getStoredAccessToken();
        if (token) {
          try {
            const startISO = dateTime.toISOString();
            const endISO = new Date(dateTime.getTime() + 50 * 60 * 1000).toISOString();
            const payload = {
              summary: title,
              description: `Atendimento Psicopedagógico com ${patient?.full_name || 'Paciente'}.\nModalidade: ${appointmentType.toUpperCase()}.\nValor: R$ ${numericPrice.toFixed(2)}`,
              startDateTime: startISO,
              endDateTime: endISO,
              patientEmail: patient?.email,
              location: appointmentType === 'presencial' ? 'Consultório de Psicopedagogia' : 'Atendimento Online'
            };

            if (editingAppointment && gcalEventId) {
              await updateGoogleCalendarEvent(token, gcalEventId, payload, selectedCalendarId);
            } else {
              const gRes = await createGoogleCalendarEvent(token, payload, selectedCalendarId);
              if (gRes?.id) gcalEventId = gRes.id;
            }
          } catch (gErr: any) {
            console.error('Google Calendar sync warning:', gErr);
          }
        }

        if (editingAppointment) {
          const apptRef = doc(db, 'appointments', editingAppointment.id);
          await updateDoc(apptRef, {
            patient_id: selectedPatient,
            title: title,
            date: dateTime.toISOString(),
            type: appointmentType,
            price: numericPrice,
            ...(gcalEventId ? { gcal_event_id: gcalEventId } : {})
          });

          try {
            const invoiceQuery = query(
              collection(db, 'invoices'),
              where('appointment_id', '==', editingAppointment.id)
            );
            const invoiceSnap = await getDocs(invoiceQuery);
            if (!invoiceSnap.empty) {
              const invDoc = invoiceSnap.docs[0];
              if (invDoc.data().status === 'pending') {
                await updateDoc(doc(db, 'invoices', invDoc.id), {
                  amount: numericPrice,
                  patient_id: selectedPatient,
                  due_date: format(dateTime, 'yyyy-MM-dd'),
                  description: `Sessão dia ${format(dateTime, 'dd/MM')}`
                });
              }
            }
          } catch (invErr) {
            console.error('Error syncing invoice on edit:', invErr);
          }
        } else {
          const iterations = isRecurring ? parseInt(recurrenceCount) || 1 : 1;

          for (let i = 0; i < iterations; i++) {
            const currentDateTime = addWeeks(dateTime, i);
            let currentGcalId = undefined;

            if (token && i === 0 && gcalEventId) {
              currentGcalId = gcalEventId;
            } else if (token) {
              try {
                const startISO = currentDateTime.toISOString();
                const endISO = new Date(currentDateTime.getTime() + 50 * 60 * 1000).toISOString();
                const gRes = await createGoogleCalendarEvent(token, {
                  summary: title,
                  description: `Atendimento Psicopedagógico com ${patient?.full_name || 'Paciente'}.\nModalidade: ${appointmentType.toUpperCase()}.\nValor: R$ ${numericPrice.toFixed(2)}`,
                  startDateTime: startISO,
                  endDateTime: endISO,
                  patientEmail: patient?.email
                }, selectedCalendarId);
                if (gRes?.id) currentGcalId = gRes.id;
              } catch (recGerr) {
                console.error('Recurrence gcal sync err:', recGerr);
              }
            }

            const newApptRef = await addDoc(collection(db, 'appointments'), {
              patient_id: selectedPatient,
              title: title,
              date: currentDateTime.toISOString(),
              status: 'scheduled',
              type: appointmentType,
              price: numericPrice,
              ...(currentGcalId ? { gcal_event_id: currentGcalId } : {}),
              created_at: new Date().toISOString()
            });

            await addDoc(collection(db, 'invoices'), {
              patient_id: selectedPatient,
              appointment_id: newApptRef.id,
              description: `Sessão dia ${format(currentDateTime, 'dd/MM')}`,
              amount: numericPrice,
              due_date: format(currentDateTime, 'yyyy-MM-dd'),
              status: 'pending',
              created_at: new Date().toISOString()
            });
          }
        }

        fetchData();
        closeAndReset();
        showToast(token ? 'Agendamento salvo e sincronizado com o Google Calendar!' : 'Agendamento salvo com sucesso!');
      } catch (err: any) {
        showToast('Erro ao salvar agendamento: ' + err.message, 'error');
      }
    };

    const closeAndReset = () => {
      setIsModalOpen(false);
      setEditingAppointment(null);
      setSelectedPatient('');
      setSelectedDate('');
      setSelectedTime('');
      setAppointmentType('presencial');
      setAppointmentPrice('150.00');
      setIsRecurring(false);
      setRecurrenceCount('4');
    };

    const handleDelete = async (id: string) => {
      if (!confirm('Tem certeza que deseja cancelar este agendamento?')) return;

      try {
        const apptToDelete = appointments.find(a => a.id === id);
        
        // Remove from Google Calendar if connected & gcal_event_id exists
        const token = getStoredAccessToken();
        if (token && apptToDelete?.gcal_event_id) {
          try {
            await deleteGoogleCalendarEvent(token, apptToDelete.gcal_event_id, selectedCalendarId);
          } catch (gErr) {
            console.error('Error deleting event from Google Calendar:', gErr);
          }
        }

        await deleteDoc(doc(db, 'appointments', id));

        try {
          const invoiceQuery = query(
            collection(db, 'invoices'),
            where('appointment_id', '==', id)
          );
          const invoiceSnap = await getDocs(invoiceQuery);
          for (const invDoc of invoiceSnap.docs) {
            if (invDoc.data().status === 'pending') {
              await deleteDoc(doc(db, 'invoices', invDoc.id));
            }
          }
        } catch (invErr) {
          console.error('Error removing associated invoice:', invErr);
        }

        fetchData();
        closeAndReset();
        showToast('Agendamento cancelado com sucesso.');
      } catch (error: any) {
        showToast('Erro ao cancelar: ' + error.message, 'error');
      }
    };

    const handleCompleteSession = async (appt: Appointment) => {
      const summary = prompt(`Resumo da sessão de ${appt.patient_name}:`, appt.notes || '');
      if (summary === null) return;

      try {
        const apptRef = doc(db, 'appointments', appt.id);
        await updateDoc(apptRef, {
          status: 'completed',
          notes: summary
        });

        fetchData();
        closeAndReset();
        showToast('Sessão concluída com sucesso!');
      } catch (err: any) {
        showToast('Erro ao concluir sessão: ' + err.message, 'error');
      }
    };

    const startDate = startOfWeek(currentDate, { weekStartsOn: 0 });
    const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(startDate, i));

    const getAppointmentsForDay = (day: Date) => {
      return appointments.filter(a => {
        const matchesDay = isSameDay(parseISO(a.date), day);
        if (!matchesDay) return false;
        if (filterType !== 'all' && a.type !== filterType) return false;
        return true;
      });
    };

    const [draggedApptId, setDraggedApptId] = useState<string | null>(null);
    const [dragOverDay, setDragOverDay] = useState<string | null>(null);

    const handleDragStart = (e: React.DragEvent, apptId: string) => {
      setDraggedApptId(apptId);
      e.dataTransfer.setData('apptId', apptId);
      e.dataTransfer.effectAllowed = 'move';
      const target = e.target as HTMLElement;
      setTimeout(() => target.classList.add('opacity-40'), 0);
    };

    const handleDragEnd = (e: React.DragEvent) => {
      const target = e.target as HTMLElement;
      target.classList.remove('opacity-40');
      setDraggedApptId(null);
      setDragOverDay(null);
    };

    const handleDragOver = (e: React.DragEvent, dayStr: string) => {
      e.preventDefault();
      setDragOverDay(dayStr);
    };

    const handleDrop = async (e: React.DragEvent, targetDay: Date) => {
      e.preventDefault();
      const apptId = e.dataTransfer.getData('apptId');
      setDragOverDay(null);

      if (!apptId) return;
      const appt = appointments.find(a => a.id === apptId);
      if (!appt) return;

      const oldDate = parseISO(appt.date);
      const newDate = new Date(targetDay);
      newDate.setHours(oldDate.getHours(), oldDate.getMinutes(), 0, 0);

      try {
        const apptRef = doc(db, 'appointments', apptId);
        await updateDoc(apptRef, { date: newDate.toISOString() });
        fetchData();
        showToast('Posição atualizada.');
      } catch (err: any) {
        showToast('Erro ao mover agendamento: ' + err.message, 'error');
      }
    };

  return (
    <div className="space-y-6 animate-fadeIn min-h-[calc(100vh-140px)] flex flex-col px-4 md:px-0 pb-12">
      {/* Header / Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-normal text-on-surface transition-colors">Agenda</h2>
          <p className="text-on-surface-variant mt-1 text-sm md:text-base transition-colors">Organize seus atendimentos psicopedagógicos.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 md:gap-3 w-full lg:w-auto">
          {/* Today Button */}
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-3.5 py-2 rounded-full border border-outline bg-surface text-on-surface text-xs font-bold hover:bg-surface-variant transition-all shadow-sm"
          >
            Hoje
          </button>

          {/* Week / Month Navigator */}
          <div className="flex items-center bg-surface rounded-full border border-outline p-1 shadow-sm flex-1 sm:flex-initial transition-colors">
            <button
              onClick={() => setCurrentDate(subWeeks(currentDate, 1))}
              className="p-1.5 md:p-2 hover:bg-surface-variant dark:hover:bg-slate-700 rounded-full text-slate-600 transition-colors"
              title="Semana Anterior"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="flex-1 sm:min-w-[130px] text-center font-medium text-on-surface text-xs md:text-sm capitalize px-2">
              {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
            </span>
            <button
              onClick={() => setCurrentDate(addWeeks(currentDate, 1))}
              className="p-1.5 md:p-2 hover:bg-surface-variant dark:hover:bg-slate-700 rounded-full text-slate-600 transition-colors"
              title="Próxima Semana"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* View Mode Toggle (Programação / Semanal) */}
          <div className="flex items-center bg-slate-900/40 p-1 rounded-full border border-slate-700/60 transition-colors">
            <button
              onClick={() => setViewMode('agenda')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${viewMode === 'agenda' ? 'bg-primary text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
              title="Visão Programação (Estilo Google Agenda)"
            >
              <List size={14} />
              <span className="inline">Agenda</span>
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${viewMode === 'week' ? 'bg-primary text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
              title="Visão Semanal em Grade"
            >
              <CalendarIcon size={14} />
              <span className="inline">Semana</span>
            </button>
          </div>

          {/* Google Calendar Sync Button & Selector */}
          {!googleToken ? (
            <button
              onClick={handleConnectGoogle}
              disabled={isConnectingGcal}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-blue-500/40 bg-blue-500/10 text-blue-400 text-xs font-bold hover:bg-blue-500/20 transition-all shadow-sm"
              title="Conectar com o Google Calendar"
            >
              <Link2 size={14} />
              <span>{isConnectingGcal ? 'Conectando...' : 'Conectar Google Calendar'}</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 text-xs font-bold">
                <CheckCircle size={14} /> Google Conectado
              </span>
              {googleCalendars.length > 0 && (
                <select
                  value={selectedCalendarId}
                  onChange={(e) => handleCalendarChange(e.target.value)}
                  className="px-2.5 py-1.5 rounded-xl text-xs font-medium bg-slate-900 border border-slate-700 text-slate-200 outline-none max-w-[200px] truncate"
                  title="Selecione qual agenda do Google salvar os eventos"
                >
                  {googleCalendars.map(cal => (
                    <option key={cal.id} value={cal.id}>
                      {cal.summary} {cal.primary ? '(Principal)' : ''}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          {/* Add Appointment Button */}
          <Button
            onClick={() => setIsModalOpen(true)}
            leftIcon={<Plus size={20} />}
            className="flex-shrink-0 !py-2.5 !px-4 md:!py-3 md:!px-6 shadow-md"
          >
            <span className="hidden sm:inline">Novo Agendamento</span>
            <span className="sm:hidden">Novo</span>
          </Button>
        </div>
      </div>

      {/* Filter Chips Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-on-surface-variant font-medium mr-1 flex items-center gap-1">
          <Filter size={14} /> Filtrar:
        </span>
        <button
          onClick={() => setFilterType('all')}
          className={`px-3 py-1.5 rounded-full border transition-all ${filterType === 'all' ? 'bg-primary-100 dark:bg-primary-900/40 border-primary text-primary font-bold' : 'border-outline-variant text-on-surface-variant hover:bg-surface-variant'}`}
        >
          Todos ({appointments.length})
        </button>
        <button
          onClick={() => setFilterType('presencial')}
          className={`px-3 py-1.5 rounded-full border transition-all ${filterType === 'presencial' ? 'bg-primary-100 dark:bg-primary-900/40 border-primary text-primary font-bold' : 'border-outline-variant text-on-surface-variant hover:bg-surface-variant'}`}
        >
          📍 Presencial
        </button>
        <button
          onClick={() => setFilterType('online')}
          className={`px-3 py-1.5 rounded-full border transition-all ${filterType === 'online' ? 'bg-primary-100 dark:bg-primary-900/40 border-primary text-primary font-bold' : 'border-outline-variant text-on-surface-variant hover:bg-surface-variant'}`}
        >
          🎥 Online
        </button>
      </div>

      {/* RENDER VIEW MODE 1: VISÃO PROGRAMAÇÃO (Estilo Google Agenda Mobile) */}
      {viewMode === 'agenda' && (
        <div className="bg-surface rounded-[28px] border border-outline-variant shadow-sm p-4 md:p-6 space-y-6 transition-colors">
          {/* Header indicator */}
          <div className="flex items-center justify-between pb-3 border-b border-outline-variant/60">
            <span className="text-xs font-bold uppercase tracking-wider text-outline dark:text-on-surface-variant">
              Programação da Semana ({format(weekDays[0], 'dd/MM')} a {format(weekDays[6], 'dd/MM')})
            </span>
            <span className="text-xs text-on-surface-variant">
              Toque em uma sessão para alterar
            </span>
          </div>

          <div className="space-y-6">
            {weekDays.map((day, idx) => {
              const dayAppts = getAppointmentsForDay(day);
              const isTodayDay = isToday(day);

              return (
                <div key={idx} className="flex flex-col sm:flex-row gap-3 sm:gap-6 border-b border-outline-variant/30 pb-6 last:border-0 last:pb-0">
                  {/* Left Column: Date Label (Estilo Google Agenda) */}
                  <div className="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-1 w-full sm:w-28 shrink-0">
                    <span className="text-xs font-bold uppercase text-outline dark:text-on-surface-variant">
                      {format(day, 'EEE', { locale: ptBR })}
                    </span>
                    <span className={`flex items-center justify-center w-9 h-9 rounded-full font-bold text-base transition-colors ${isTodayDay ? 'bg-primary text-white shadow-md ring-4 ring-primary-100 dark:ring-primary-900/40' : 'bg-surface-variant/60 text-on-surface'}`}>
                      {format(day, 'd')}
                    </span>
                    <span className="text-[11px] text-on-surface-variant sm:mt-1 capitalize">
                      {format(day, 'MMM', { locale: ptBR })}
                    </span>
                  </div>

                  {/* Right Column: Events List */}
                  <div className="flex-1 space-y-3">
                    {dayAppts.length === 0 ? (
                      <div 
                        onClick={() => {
                          setSelectedDate(format(day, 'yyyy-MM-dd'));
                          setIsModalOpen(true);
                        }}
                        className="p-3.5 rounded-2xl border border-dashed border-outline-variant/70 hover:border-primary/50 bg-background/20 hover:bg-primary-50/20 text-on-surface-variant text-xs flex items-center justify-between cursor-pointer transition-all group"
                      >
                        <span className="group-hover:text-primary transition-colors">Nenhum atendimento agendado</span>
                        <span className="text-primary font-bold flex items-center gap-1 opacity-80 group-hover:opacity-100">
                          <Plus size={14} /> Agendar
                        </span>
                      </div>
                    ) : (
                      dayAppts.map(appt => {
                        const apptTime = format(parseISO(appt.date), 'HH:mm');
                        const isCompleted = appt.status === 'completed';

                        return (
                          <div
                            key={appt.id}
                            onClick={() => handleOpenEdit(appt)}
                            className={`p-4 rounded-2xl border transition-all cursor-pointer group relative shadow-sm hover:shadow-md active:scale-[0.99] ${
                              isCompleted 
                                ? 'bg-slate-900/30 border-slate-700/60 opacity-80' 
                                : 'bg-surface hover:bg-primary-50/40 dark:hover:bg-primary-900/20 border-outline-variant hover:border-primary/50'
                            }`}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              {/* Left details */}
                              <div className="flex items-start gap-3.5">
                                <Avatar name={appt.patient_name || 'Paciente'} size="md" />
                                <div>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h4 className="font-bold text-on-surface text-base group-hover:text-primary transition-colors">
                                      {appt.patient_name}
                                    </h4>
                                    {isCompleted && (
                                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300">
                                        <CheckCircle2 size={12} /> Concluída
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-3 text-xs text-on-surface-variant mt-1">
                                    <span className="flex items-center gap-1 font-bold text-primary dark:text-primary-400">
                                      <Clock size={13} /> {apptTime}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      {appt.type === 'online' ? <Video size={13} className="text-purple-400" /> : <MapPin size={13} className="text-emerald-400" />}
                                      <span className="capitalize">{appt.type || 'Presencial'}</span>
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Right details: Price & Action hint */}
                              <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-outline-variant/40">
                                <span className="px-3 py-1 rounded-xl text-xs font-bold bg-slate-900 text-emerald-400 border border-slate-700/60">
                                  R$ {appt.price ? appt.price.toFixed(2).replace('.', ',') : '150,00'}
                                </span>
                                <span className="text-xs text-primary font-medium group-hover:underline">
                                  Alterar &rarr;
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* RENDER VIEW MODE 2: VISÃO SEMANAL EM GRADE (Desktop) */}
      {viewMode === 'week' && (
        <div className="flex-1 bg-surface rounded-[28px] border border-outline-variant shadow-sm overflow-hidden flex flex-col transition-colors">
          {/* Days Header */}
          <div className="grid grid-cols-7 border-b border-outline-variant bg-surface-variant/40">
            {weekDays.map((day, i) => (
              <div key={i} className={`py-3 p-2 md:p-4 text-center border-r border-outline-variant/50 last:border-0 transition-colors ${isSameDay(day, new Date()) ? 'bg-primary-container' : ''}`}>
                <p className="text-[10px] md:text-xs font-bold text-outline dark:text-on-surface-variant uppercase mb-1 transition-colors">
                  <span>{format(day, 'EEE', { locale: ptBR })}</span>
                </p>
                <p className={`text-base md:text-xl font-medium transition-colors ${isSameDay(day, new Date()) ? 'text-primary font-bold' : 'text-slate-700 dark:text-slate-300'}`}>
                  {format(day, 'd')}
                </p>
              </div>
            ))}
          </div>

          {/* Slots Grid */}
          <div className="grid grid-cols-7 flex-1 divide-x divide-slate-50 dark:divide-slate-700/50 overflow-y-auto min-h-[500px]">
            {weekDays.map((day, i) => {
              const dayAppts = getAppointmentsForDay(day);
              const dayStr = format(day, 'yyyy-MM-dd');
              const isDraggingOver = dragOverDay === dayStr;

              return (
                <div
                  key={i}
                  className={`p-2 space-y-2 min-h-[450px] transition-colors ${isDraggingOver ? 'bg-primary-50/30 dark:bg-primary-900/10 ring-2 ring-inset ring-primary-200 dark:ring-primary-800' : ''}`}
                  onDragOver={(e) => handleDragOver(e, dayStr)}
                  onDrop={(e) => handleDrop(e, day)}
                  onDragLeave={() => setDragOverDay(null)}
                >
                  {dayAppts.length === 0 && (
                    <div className="h-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity group">
                      <button
                        className="w-8 h-8 rounded-full bg-surface-variant text-outline dark:text-on-surface-variant flex items-center justify-center hover:bg-primary-100 dark:hover:bg-primary-900/40 hover:text-primary dark:hover:text-primary-400 transition-colors"
                        onClick={() => {
                          setSelectedDate(format(day, 'yyyy-MM-dd'));
                          setIsModalOpen(true);
                        }}
                        title="Agendar neste dia"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  )}
                  {dayAppts.map(appt => (
                    <div
                      key={appt.id}
                      draggable={true}
                      onDragStart={(e) => handleDragStart(e, appt.id)}
                      onDragEnd={handleDragEnd}
                      onClick={() => handleOpenEdit(appt)}
                      className="bg-primary-50 dark:bg-slate-800 border border-primary-100 dark:border-slate-700 p-3 rounded-xl hover:shadow-md transition-all cursor-pointer group relative active:scale-95"
                    >
                      {/* Status Line */}
                      <div className="w-1 absolute left-1 top-3 bottom-3 bg-primary rounded-full"></div>

                      <div className="pl-3">
                        <p className="text-xs font-bold text-primary dark:text-primary-400 mb-1 flex items-center gap-1">
                          <Clock size={12} />
                          {format(parseISO(appt.date), 'HH:mm')}
                        </p>
                        <p className="font-medium text-on-surface dark:text-slate-100 text-sm line-clamp-1">
                          {appt.patient_name}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-surface text-primary border border-primary-100 dark:border-slate-700">
                            {appt.type || 'Presencial'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal Reagendar / Novo Agendamento */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface rounded-[24px] shadow-2xl w-full max-w-md p-6 animate-scaleIn border border-transparent">
            <h3 className="text-xl font-bold text-on-surface mb-6">
              {editingAppointment ? 'Remarcar Sessão' : 'Novo Agendamento'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Paciente</label>
                <select
                  className="w-full px-4 py-3 rounded-xl border border-outline focus:border-primary-500 focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-900/30 outline-none bg-surface text-on-surface dark:text-slate-100 transition-all"
                  value={selectedPatient}
                  onChange={e => setSelectedPatient(e.target.value)}
                  required
                >
                  <option value="">Selecione um paciente...</option>
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.full_name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Data"
                  type="date"
                  required
                  value={selectedDate}
                  onChange={e => setSelectedDate(e.target.value)}
                />
                <Input
                  label="Horário"
                  type="time"
                  required
                  value={selectedTime}
                  onChange={e => setSelectedTime(e.target.value)}
                />
              </div>

              <Input
                label="Valor da Sessão (R$)"
                type="number"
                step="0.01"
                required
                value={appointmentPrice}
                onChange={e => setAppointmentPrice(e.target.value)}
              />

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Modalidade</label>
                <div className="flex gap-4">
                  <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${appointmentType === 'presencial' ? 'bg-primary-50 dark:bg-primary-900/30 border-primary-500 text-primary-700 dark:text-primary-300' : 'border-outline text-slate-600 hover:bg-background dark:hover:bg-slate-700/50'}`}>
                    <input
                      type="radio"
                      name="type"
                      className="sr-only"
                      checked={appointmentType === 'presencial'}
                      onChange={() => setAppointmentType('presencial')}
                    />
                    <MapPin size={18} />
                    <span className="font-medium text-sm">Presencial</span>
                  </label>
                  <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${appointmentType === 'online' ? 'bg-primary-50 dark:bg-primary-900/30 border-primary-500 text-primary-700 dark:text-primary-300' : 'border-outline text-slate-600 hover:bg-background dark:hover:bg-slate-700/50'}`}>
                    <input
                      type="radio"
                      name="type"
                      className="sr-only"
                      checked={appointmentType === 'online'}
                      onChange={() => setAppointmentType('online')}
                    />
                    <Video size={18} />
                    <span className="font-medium text-sm">Online</span>
                  </label>
                </div>
              </div>

              {!editingAppointment && (
                <div className="p-4 bg-background/50 rounded-2xl border border-outline-variant space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={isRecurring}
                        onChange={e => setIsRecurring(e.target.checked)}
                      />
                      <div className="w-10 h-6 bg-slate-200 rounded-full peer peer-checked:bg-primary transition-colors after:content-[''] after:absolute after:top-1 after:left-1 after:bg-surface after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4"></div>
                    </div>
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Repetir Semanalmente</span>
                  </label>

                  {isRecurring && (
                    <div className="animate-slideDown">
                      <Input
                        label="Quantidade de semanas"
                        type="number"
                        min="2"
                        max="12"
                        value={recurrenceCount}
                        onChange={e => setRecurrenceCount(e.target.value)}
                      />
                      <p className="text-[10px] text-on-surface-variant mt-1">
                        Isso criará {recurrenceCount} sessões e {recurrenceCount} faturas automaticamente.
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex flex-col gap-3 mt-8 pt-4 border-t border-outline-variant">
                {editingAppointment && editingAppointment.status !== 'completed' && (
                  <button
                    type="button"
                    onClick={() => handleCompleteSession(editingAppointment)}
                    className="w-full py-3 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 font-bold rounded-xl hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors flex items-center justify-center gap-2 mb-2"
                  >
                    <CheckCircle2 size={18} />
                    Concluir Sessão
                  </button>
                )}

                <div className="flex items-center justify-between gap-3">
                  {editingAppointment ? (
                    <button
                      type="button"
                      onClick={() => handleDelete(editingAppointment.id)}
                      className="px-4 py-2.5 rounded-xl border border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 text-xs font-bold transition-colors flex items-center gap-1.5"
                    >
                      <Trash2 size={16} />
                      Cancelar Sessão
                    </button>
                  ) : <div></div>}

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setIsModalOpen(false)}
                      type="button"
                    >
                      Fechar
                    </Button>
                    <Button type="submit">
                      {editingAppointment ? 'Salvar' : 'Confirmar'}
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSchedule;
