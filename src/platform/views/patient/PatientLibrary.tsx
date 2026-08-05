import React, { useEffect, useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import {
    CheckCircle2,
    Calendar,
    MapPin,
    Video,
    Search,
    BookOpen,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type Session = {
    id: string;
    date: string;
    type: string;
    notes: string;
    title: string;
};

const PatientLibrary: React.FC = () => {
    const { user } = useAuth();
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedSession, setExpandedSession] = useState<string | null>(null);

    useEffect(() => {
        if (!user) return;

        const fetchSessions = async () => {
            try {
                // 1. Fetch completed appointments
                const qAppts = query(
                    collection(db, 'appointments'),
                    where('patient_id', '==', user.id),
                    where('status', '==', 'completed')
                );
                // 2. Fetch public evolutions from Diário de Bordo
                const qEvo = query(
                    collection(db, 'patient_evolutions'),
                    where('patient_id', '==', user.id),
                    where('is_public', '==', true)
                );

                const [apptsSnap, evosSnap] = await Promise.all([
                    getDocs(qAppts),
                    getDocs(qEvo)
                ]);

                const apptsData = apptsSnap.docs.map(docSnap => ({
                    id: docSnap.id,
                    title: 'Sessão Concluída',
                    type: 'Presencial',
                    notes: docSnap.data().notes || '',
                    date: docSnap.data().date,
                    ...docSnap.data()
                })) as Session[];

                const evosData = evosSnap.docs.map(docSnap => ({
                    id: docSnap.id,
                    title: 'Evolução Psicopedagógica',
                    type: 'Diário de Bordo',
                    notes: docSnap.data().content || '',
                    date: docSnap.data().created_at,
                    ...docSnap.data()
                })) as Session[];

                const combined = [...apptsData, ...evosData];
                combined.sort((a, b) => (b.date || '').localeCompare(a.date || ''));

                setSessions(combined);
            } catch (error) {
                console.error('Error fetching sessions:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSessions();
    }, [user]);

 const filteredSessions = sessions.filter(session =>
 (session.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
 session.title?.toLowerCase().includes(searchTerm.toLowerCase()))
 );

 if (loading) {
 return (
 <div className="flex items-center justify-center h-[50vh]">
 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
 </div>
 );
 }

 return (
 <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto pb-12 px-4 md:px-0">
 {/* Header */}
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
 <div>
 <h2 className="text-3xl font-normal text-on-surface tracking-tight transition-colors">Biblioteca de Acompanhamento</h2>
 <p className="text-on-surface-variant mt-1 transition-colors">Histórico completo de todas as sessões e evoluções.</p>
 </div>

 <div className="relative">
 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-outline dark:text-on-surface-variant transition-colors" size={18} />
 <input
 type="text"
 placeholder="Buscar por resumo..."
 className="pl-11 pr-4 py-2.5 bg-surface border border-outline rounded-full text-sm outline-none focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-900/30 transition-all w-full md:w-64"
 value={searchTerm}
 onChange={(e) => setSearchTerm(e.target.value)}
 />
 </div>
 </div>

 {filteredSessions.length === 0 ? (
 <div className="bg-surface rounded-[28px] border border-outline-variant p-12 text-center shadow-sm transition-colors">
 <div className="bg-background /50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300 dark:text-slate-600 transition-colors">
 <BookOpen size={40} />
 </div>
 <h3 className="text-lg font-bold text-slate-700 mb-2 transition-colors">Ainda não há registros</h3>
 <p className="text-on-surface-variant max-w-sm mx-auto transition-colors">
 À medida que as sessões forem concluídas e o acompanhamento for registrado, os detalhes aparecerão nesta biblioteca.
 </p>
 </div>
 ) : (
 <div className="grid gap-4">
 {filteredSessions.map((session) => (
 <div
 key={session.id}
 className={`bg-surface rounded-[24px] border transition-all duration-300 shadow-sm hover:shadow-md ${expandedSession === session.id ? 'border-primary-200 dark:border-primary-800 ring-4 ring-primary-50/50 dark:ring-primary-900/20' : 'border-outline-variant '}`}
 >
 <div
 className="p-6 cursor-pointer"
 onClick={() => setExpandedSession(expandedSession === session.id ? null : session.id)}
 >
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
 <div className="flex items-center gap-4">
 <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${expandedSession === session.id ? 'bg-primary text-white' : 'bg-primary-50 dark:bg-primary-900/30 text-primary '}`}>
 <CheckCircle2 size={24} />
 </div>
 <div>
 <h3 className="font-bold text-on-surface text-lg transition-colors">
 {format(parseISO(session.date), "dd 'de' MMMM, yyyy", { locale: ptBR })}
 </h3>
 <div className="flex items-center gap-3 mt-1 transition-colors">
 <div className="flex items-center gap-1.5 text-xs text-on-surface-variant font-medium transition-colors">
 <Calendar size={14} />
 {format(parseISO(session.date), "EEEE", { locale: ptBR })}
 </div>
 <div className="flex items-center gap-1.5 text-xs text-on-surface-variant font-medium transition-colors">
 {session.type === 'online' ? <Video size={14} /> : <MapPin size={14} />}
 <span className="capitalize">{session.type || 'Presencial'}</span>
 </div>
 </div>
 </div>
 </div>

 <div className="flex items-center gap-4 self-end md:self-center transition-colors">
 <button className={`p-2 rounded-full transition-colors ${expandedSession === session.id ? 'bg-primary-50 dark:bg-primary-900/30 text-primary ' : 'text-outline hover:bg-background dark:hover:bg-slate-700/50'}`}>
 {expandedSession === session.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
 </button>
 </div>
 </div>

 {/* Summary Preview / Content */}
 <div className={`mt-4 overflow-hidden transition-all duration-300 ${expandedSession === session.id ? 'max-h-[1000px] opacity-100' : 'max-h-12 opacity-80'}`}>
 <p className={`text-slate-600 dark:text-slate-300 leading-relaxed transition-colors ${expandedSession === session.id ? '' : 'line-clamp-2'}`}>
 {session.notes || 'Sem resumo detalhado para esta sessão.'}
 </p>

 {expandedSession === session.id && (
 <div className="mt-6 pt-6 border-t border-outline-variant flex items-center justify-between text-xs text-outline dark:text-on-surface-variant font-medium italic transition-colors">
 <span>Registro de evolução psicopedagógica</span>
 <BookOpen size={16} />
 </div>
 )}
 </div>
 </div>
 </div>
 ))}
 </div>
 )}
 </div>
 );
};

export default PatientLibrary;
