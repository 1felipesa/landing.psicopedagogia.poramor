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
 CheckCircle2
} from 'lucide-react';
import {
 format,
 addDays,
 startOfWeek,
 addWeeks,
 subWeeks,
 isSameDay,
 parseISO,
 startOfDay
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { db } from '../../lib/firebase';
import { collection, query, where, getDocs, doc, getDoc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';
import { useToast } from '../../context/ToastContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Avatar from '../../components/ui/Avatar';

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
    patient?: {
        full_name: string;
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
    }, []);

    const fetchData = async () => {
        try {
            // Fetch Patients for the dropdown
            const patientsQuery = query(
                collection(db, 'profiles'),
                where('role', '==', 'patient')
            );
            const patientsSnap = await getDocs(patientsQuery);
            const profiles = patientsSnap.docs.map(docSnap => ({
                id: docSnap.id,
                full_name: docSnap.data().full_name,
                email: docSnap.data().email
            }));
            setPatients(profiles);

            // Fetch Appointments
            const apptsSnap = await getDocs(collection(db, 'appointments'));
            const rawAppts = apptsSnap.docs.map(docSnap => ({
                id: docSnap.id,
                ...docSnap.data()
            })) as any[];

            // Create patient map for lookup
            const patientsMap = new Map<string, any>();
            profiles.forEach(p => patientsMap.set(p.id, p));

            // Format with client-side join
            const formatted = rawAppts.map(a => {
                const patientProfile = patientsMap.get(a.patient_id);
                return {
                    ...a,
                    patient_name: patientProfile?.full_name || 'Paciente',
                    patient: patientProfile ? { full_name: patientProfile.full_name } : undefined
                };
            });

            // Sort appointments by date ascending
            formatted.sort((a, b) => a.date.localeCompare(b.date));
            setAppointments(formatted);
        } catch (error) {
            console.error('Error fetching schedule data:', error);
        } finally {
            setLoading(false);
        }
    };

 const handleOpenEdit = (appt: Appointment) => {
 setEditingAppointment(appt);
 setSelectedPatient(appt.patient_id);
 const d = parseISO(appt.date);
 setSelectedDate(format(d, 'yyyy-MM-dd'));
 setSelectedTime(format(d, 'HH:mm'));
 setAppointmentType(appt.type);
 setIsModalOpen(true);
 };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dateTime = new Date(`${selectedDate}T${selectedTime}`);
      const patient = patients.find(p => p.id === selectedPatient);
      const title = `Sessão com ${patient?.full_name?.split(' ')[0] || 'Paciente'}`;

      if (editingAppointment) {
        const apptRef = doc(db, 'appointments', editingAppointment.id);
        await updateDoc(apptRef, {
          patient_id: selectedPatient,
          title: title,
          date: dateTime.toISOString(),
          type: appointmentType,
          price: parseFloat(appointmentPrice)
        });
      } else {
        // 1. Create Appointment(s)
        const iterations = isRecurring ? parseInt(recurrenceCount) || 1 : 1;

        for (let i = 0; i < iterations; i++) {
          const currentDateTime = addWeeks(dateTime, i);

          const newApptRef = await addDoc(collection(db, 'appointments'), {
            patient_id: selectedPatient,
            title: title,
            date: currentDateTime.toISOString(),
            status: 'scheduled',
            type: appointmentType,
            price: parseFloat(appointmentPrice),
            created_at: new Date().toISOString()
          });

          // 2. Automatically generate invoice for each appointment
          await addDoc(collection(db, 'invoices'), {
            patient_id: selectedPatient,
            appointment_id: newApptRef.id,
            description: `Sessão dia ${format(currentDateTime, 'dd/MM')}`,
            amount: parseFloat(appointmentPrice),
            due_date: format(currentDateTime, 'yyyy-MM-dd'),
            status: 'pending',
            created_at: new Date().toISOString()
          });
        }
      }

      fetchData();
      closeAndReset();
      showToast('Agendamento salvo com sucesso!');
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
    setIsRecurring(false);
    setRecurrenceCount('4');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja cancelar?')) return;

    try {
      await deleteDoc(doc(db, 'appointments', id));
      fetchData();
      showToast('Agendamento cancelado.');
    } catch (error: any) {
      showToast('Erro ao cancelar: ' + error.message, 'error');
    }
  };

  const handleCompleteSession = async (appt: Appointment) => {
    const summary = prompt(`Resumo da sessão de ${appt.patient_name}:`, appt.notes || '');
    if (summary === null) return;

    try {
      // Update appointment status and notes
      const apptRef = doc(db, 'appointments', appt.id);
      await updateDoc(apptRef, {
        status: 'completed',
        notes: summary
      });

      fetchData();
      closeAndReset();
      showToast('Sessão concluída!');
    } catch (err: any) {
      showToast('Erro ao concluir sessão: ' + err.message, 'error');
    }
  };

  // Calendar Helper
  const startDate = startOfWeek(currentDate, { weekStartsOn: 0 }); // Sunday
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(startDate, i));

  const getAppointmentsForDay = (day: Date) => {
    return appointments.filter(a => isSameDay(parseISO(a.date), day));
  };

  // Drag & Drop Handlers
  const [draggedApptId, setDraggedApptId] = useState<string | null>(null);
  const [dragOverDay, setDragOverDay] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, apptId: string) => {
    setDraggedApptId(apptId);
    e.dataTransfer.setData('apptId', apptId);
    e.dataTransfer.effectAllowed = 'move';

    // Add a class for styling the original source
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

    // Create new date preserving the time
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
 <div className="space-y-6 animate-fadeIn h-[calc(100vh-140px)] flex flex-col px-4 md:px-0">
 {/* Header / Toolbar */}
 <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
 <div>
 <h2 className="text-2xl md:text-3xl font-normal text-on-surface transition-colors">Agenda</h2>
 <p className="text-on-surface-variant mt-1 text-sm md:text-base transition-colors">Organize seus atendimentos.</p>
 </div>

 <div className="flex flex-row items-center gap-2 md:gap-4 w-full lg:w-auto">
 <div className="flex items-center bg-surface rounded-full border border-outline p-1 shadow-sm flex-1 lg:flex-initial transition-colors">
 <button
 onClick={() => setCurrentDate(subWeeks(currentDate, 1))}
 className="p-1.5 md:p-2 hover:bg-surface-variant dark:hover:bg-slate-700 rounded-full text-slate-600 transition-colors"
 >
 <ChevronLeft size={18} />
 </button>
 <span className="flex-1 lg:min-w-[140px] text-center font-medium text-on-surface text-xs md:text-sm capitalize px-2">
 {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
 </span>
 <button
 onClick={() => setCurrentDate(addWeeks(currentDate, 1))}
 className="p-1.5 md:p-2 hover:bg-surface-variant dark:hover:bg-slate-700 rounded-full text-slate-600 transition-colors"
 >
 <ChevronRight size={18} />
 </button>
 </div>

 <Button
 onClick={() => setIsModalOpen(true)}
 leftIcon={<Plus size={20} />}
 className="flex-shrink-0 !py-2.5 !px-4 md:!py-3 md:!px-6"
 >
 <span className="hidden sm:inline">Novo Agendamento</span>
 <span className="sm:hidden">Novo</span>
 </Button>
 </div>
 </div>

 {/* Weekly Grid */}
 <div className="flex-1 bg-surface rounded-[24px] border border-outline-variant shadow-sm overflow-hidden flex flex-col transition-colors">
 {/* Days Header */}
 <div className="grid grid-cols-7 border-b border-outline-variant bg-background/30 bg-surface-variant/40">
 {weekDays.map((day, i) => (
 <div key={i} className={`py-3 md:p-4 text-center border-r border-outline-variant/50 /50 last:border-0 transition-colors ${isSameDay(day, new Date()) ? 'bg-primary-container ' : ''}`}>
 <p className="text-[10px] md:text-xs font-bold text-outline dark:text-on-surface-variant uppercase mb-1 transition-colors">
 <span className="md:hidden">{format(day, 'EEEEE', { locale: ptBR })}</span>
 <span className="hidden md:block">{format(day, 'EEE', { locale: ptBR })}</span>
 </p>
 <p className={`text-base md:text-xl font-medium transition-colors ${isSameDay(day, new Date()) ? 'text-primary ' : 'text-slate-700 dark:text-slate-300'}`}>
 {format(day, 'd')}
 </p>
 </div>
 ))}
 </div>

 {/* Slots Grid */}
 <div className="grid grid-cols-7 flex-1 divide-x divide-slate-50 dark:divide-slate-700/50 overflow-y-auto">
 {weekDays.map((day, i) => {
 const dayAppts = getAppointmentsForDay(day);
 const dayStr = format(day, 'yyyy-MM-dd');
 const isDraggingOver = dragOverDay === dayStr;

 return (
 <div
 key={i}
 className={`p-2 space-y-2 min-h-[400px] transition-colors ${isDraggingOver ? 'bg-primary-50/30 dark:bg-primary-900/10 ring-2 ring-inset ring-primary-200 dark:ring-primary-800' : ''}`}
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
 className="bg-primary-50 border border-primary-100 dark:border-primary-800/50 p-3 rounded-xl hover:shadow-md transition-all cursor-move group relative active:scale-95 active:shadow-inner"
 >
 {/* Status Line */}
 <div className="w-1 absolute left-1 top-3 bottom-3 bg-primary-400 rounded-full"></div>

 <div className="pl-3">
 <p className="text-xs font-bold text-primary-700 mb-1 flex items-center gap-1">
 <Clock size={12} />
 {format(parseISO(appt.date), 'HH:mm')}
 </p>
 <p className="font-medium text-on-surface dark:text-slate-100 text-sm line-clamp-1">
 {appt.patient_name}
 </p>
 <div className="flex items-center gap-2 mt-2">
 <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-surface text-primary border border-primary-100 dark:border-primary-800/50">
 {appt.type || 'Presencial'}
 </span>
 </div>
 </div>

 {/* Actions */}
 <button
 onClick={(e) => { e.stopPropagation(); handleDelete(appt.id); }}
 className="absolute top-2 right-2 p-1 text-primary-300 dark:text-primary hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded opacity-0 group-hover:opacity-100 transition-all shadow-sm"
 >
 <Trash2 size={14} />
 </button>
 </div>
 ))}
 </div>
 );
 })}
 </div>
 </div>

 {/* Modal */}
 {isModalOpen && (
 <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
 <div className="bg-surface rounded-[24px] shadow-2xl w-full max-w-md p-6 animate-scaleIn border border-transparent ">

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
 <option className="" value="">Selecione um paciente...</option>
 {patients.map(p => (
 <option key={p.id} className="" value={p.id}>{p.full_name}</option>
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
 <div className="p-4 bg-background /50 rounded-2xl border border-outline-variant space-y-3">
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
 <p className="text-[10px] text-on-surface-variant dark:text-on-surface-variant mt-1">
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
 <div className="flex gap-3">
 <Button
 variant="outline"
 className="flex-1"
 onClick={() => setIsModalOpen(false)}
 type="button"
 >
 Cancelar
 </Button>
 <Button className="flex-1" type="submit">
 {editingAppointment ? 'Salvar' : 'Confirmar'}
 </Button>
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
