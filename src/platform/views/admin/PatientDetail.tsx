import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
 ArrowLeft,
 User,
 Calendar,
 MapPin,
 Phone,
 FileText,
 Upload,
 Trash2,
 Download,
 File,
 Plus,
 CheckCircle2,
 Circle,
 Target,
 X,
 ExternalLink,
 ShieldCheck,
 Receipt,
 FileCheck
} from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, query, where, getDocs, doc, getDoc, updateDoc, deleteDoc, addDoc, orderBy } from 'firebase/firestore';
import { uploadDocument, deleteDocument, Document } from '../../lib/documents';
import PatientEvolutions from '../../components/admin/PatientEvolutions';
import Button from '../../components/ui/Button';
import Avatar from '../../components/ui/Avatar';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useToast } from '../../context/ToastContext';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const PatientDetail: React.FC = () => {
 const { id } = useParams<{ id: string }>();
 const navigate = useNavigate();
 const [patient, setPatient] = useState<any>(null);
 const [anamnesis, setAnamnesis] = useState<any>(null);
 const [documents, setDocuments] = useState<Document[]>([]);
 const [objectives, setObjectives] = useState<any[]>([]);
 const [newObjective, setNewObjective] = useState('');
 const [loading, setLoading] = useState(true);
 const [uploading, setUploading] = useState(false);
 const [addingObjective, setAddingObjective] = useState(false);
 const [showAnamnesisModal, setShowAnamnesisModal] = useState(false);
 const { showToast } = useToast();

 // Generation State
 const [showDischargeModal, setShowDischargeModal] = useState(false);
 const [showFinancialReportModal, setShowFinancialReportModal] = useState(false);
 const [isGenerating, setIsGenerating] = useState(false);

 // Discharge Form
 const [dischargeForm, setDischargeForm] = useState({
 professionalName: '',
 professionalReg: '',
 evolution: '',
 methodology: '',
 currentStatus: '',
 recommendations: ''
 });

 // Financial Form
 const [financialForm, setFinancialForm] = useState({
 professionalName: '',
 professionalCpf: '',
 professionalAddress: ''
 });

 // Upload Refs
 const fileInputRef = useRef<HTMLInputElement>(null);
 const contractInputRef = useRef<HTMLInputElement>(null);

 const handleContractUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
  if (!event.target.files || event.target.files.length === 0 || !id) return;
  setUploading(true);

  const file = event.target.files[0];
  try {
  await uploadDocument(file, id, file.name || 'Contrato de Prestação de Serviços', 'contract_template', 'admin');
  showToast('Contrato enviado para o paciente com sucesso!');
  fetchData(); // Refresh list
  } catch (error: any) {
  showToast('Erro no upload do contrato: ' + error.message, 'error');
  } finally {
  setUploading(false);
  if (contractInputRef.current) contractInputRef.current.value = '';
  }
 };

 useEffect(() => {
 if (!id) return;
 fetchData();
 fetchObjectives();
 }, [id]);

 const fetchData = async () => {
 try {
 if (!id) return;
 // Fetch Profile
 const profileRef = doc(db, 'profiles', id);
 const profileSnap = await getDoc(profileRef);
 if (profileSnap.exists()) {
 setPatient({ id: profileSnap.id, ...profileSnap.data() });
 }

 // Fetch Anamnesis
 const anamnesisRef = doc(db, 'anamnesis', id);
 const anamnesisSnap = await getDoc(anamnesisRef);
 if (anamnesisSnap.exists()) {
 setAnamnesis({ id: anamnesisSnap.id, ...anamnesisSnap.data() });
 }

 // Fetch Documents
 const docsQuery = query(
 collection(db, 'documents'),
 where('patient_id', '==', id)
 );
 const docsSnap = await getDocs(docsQuery);
 const docsData = docsSnap.docs.map(docSnap => ({
 id: docSnap.id,
 ...docSnap.data()
 })) as Document[];
 docsData.sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));
 setDocuments(docsData);

 } catch (error) {
 console.error('Error fetching details:', error);
 } finally {
 setLoading(false);
 }
 };

 const fetchObjectives = async () => {
 if (!id) return;
 try {
 const q = query(
 collection(db, 'patient_objectives'),
 where('patient_id', '==', id)
 );
 const querySnapshot = await getDocs(q);
 const objsData = querySnapshot.docs.map(docSnap => ({
 id: docSnap.id,
 ...docSnap.data()
 }));
 objsData.sort((a: any, b: any) => (a.created_at || '').localeCompare(b.created_at || ''));
 setObjectives(objsData);
 } catch (error) {
 console.error('Error fetching objectives:', error);
 }
 };

 const handleAddObjective = async (e: React.FormEvent) => {
 e.preventDefault();
 if (!newObjective.trim() || !id) return;

 setAddingObjective(true);
 try {
 await addDoc(collection(db, 'patient_objectives'), {
 patient_id: id,
 description: newObjective.trim(),
 is_completed: false,
 created_at: new Date().toISOString()
 });

 setNewObjective('');
 fetchObjectives();
 showToast('Objetivo adicionado!');
 } catch (error: any) {
 showToast('Erro ao adicionar objetivo: ' + error.message, 'error');
 } finally {
 setAddingObjective(false);
 }
 };

 const handleToggleObjective = async (objId: string, currentStatus: boolean) => {
 try {
 const objRef = doc(db, 'patient_objectives', objId);
 await updateDoc(objRef, { is_completed: !currentStatus });

 fetchObjectives();
 showToast('Status atualizado.');
 } catch (error: any) {
 showToast('Erro: ' + error.message, 'error');
 }
 };

 const handleDeleteObjective = async (objId: string) => {
 if (!confirm('Excluir este objetivo?')) return;
 try {
 await deleteDoc(doc(db, 'patient_objectives', objId));
 fetchObjectives();
 showToast('Objetivo removido.');
 } catch (error: any) {
 showToast('Erro ao excluir: ' + error.message, 'error');
 }
 };

 const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
 if (!event.target.files || event.target.files.length === 0 || !id) return;
 setUploading(true);

 const file = event.target.files[0];
 try {
 await uploadDocument(file, id, file.name, 'report');
 showToast('Arquivo enviado com sucesso!');
 fetchData(); // Refresh list
 } catch (error: any) {
 showToast('Erro no upload: ' + error.message, 'error');
 } finally {
 setUploading(false);
 if (fileInputRef.current) fileInputRef.current.value = '';
 }
 };

 const handleDeleteDoc = async (docId: string, url: string) => {
 if (!confirm('Deseja excluir este arquivo?')) return;
 try {
 await deleteDocument(docId, url);
 setDocuments(prev => prev.filter(d => d.id !== docId));
 showToast('Arquivo excluído.');
 } catch (error: any) {
 showToast('Erro ao excluir: ' + error.message, 'error');
 }
 };

 // Document Generation Logic
 const generateDischargeReport = async () => {
 if (!id || !patient) return;
 setIsGenerating(true);
 try {
 const currentDate = format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });

 const htmlContent = `
 <div style="font-family: Arial, sans-serif; padding: 40px; color: #333; line-height: 1.6; max-width: 800px; background: white;">
 <div style="text-align: center; border-bottom: 2px solid #6750A4; padding-bottom: 20px; margin-bottom: 30px;">
 <h2 style="color: #6750A4; font-size: 24px; margin-bottom: 5px;">RELATÓRIO DE ALTA PSICOPEDAGÓGICA</h2>
 <p style="margin: 0; color: #555;">Psicopedagogia por Amor - Gestão de Atendimentos</p>
 </div>

 <div style="background: #f9f9f9; padding: 20px; border-radius: 10px; margin-bottom: 30px; border-left: 4px solid #6750A4;">
 <strong>Paciente:</strong> ${patient.full_name}<br>
 <strong>Data de Emissão:</strong> ${currentDate}
 </div>

 <div style="margin-bottom: 25px;">
 <span style="font-weight: bold; color: #6750A4; text-transform: uppercase; font-size: 14px; margin-bottom: 10px; display: block;">Queixa Inicial</span>
 <div style="text-align: justify; color: #444;">${anamnesis?.step_data?.mainReason || 'Não informada'}</div>
 </div>

 <div style="margin-bottom: 25px;">
 <span style="font-weight: bold; color: #6750A4; text-transform: uppercase; font-size: 14px; margin-bottom: 10px; display: block;">Evolução do Caso</span>
 <div style="text-align: justify; color: #444;">${dischargeForm.evolution}</div>
 </div>

 <div style="margin-bottom: 25px;">
 <span style="font-weight: bold; color: #6750A4; text-transform: uppercase; font-size: 14px; margin-bottom: 10px; display: block;">Metodologia Utilizada</span>
 <div style="text-align: justify; color: #444;">${dischargeForm.methodology}</div>
 </div>

 <div style="margin-bottom: 25px;">
 <span style="font-weight: bold; color: #6750A4; text-transform: uppercase; font-size: 14px; margin-bottom: 10px; display: block;">Estado Atual</span>
 <div style="text-align: justify; color: #444;">${dischargeForm.currentStatus}</div>
 </div>

 <div style="margin-bottom: 25px;">
 <span style="font-weight: bold; color: #6750A4; text-transform: uppercase; font-size: 14px; margin-bottom: 10px; display: block;">Recomendações Finais</span>
 <div style="text-align: justify; color: #444;">${dischargeForm.recommendations}</div>
 </div>

 <div style="margin-bottom: 25px; margin-top: 40px;">
 <span style="font-weight: bold; color: #6750A4; text-transform: uppercase; font-size: 14px; margin-bottom: 10px; display: block;">Conclusão</span>
 <div style="text-align: justify; padding: 15px; background: #f3f0ff; border-radius: 8px;">Pelo exposto, declaro a <strong>Alta Psicopedagógica</strong> do paciente, por ter atingido os objetivos terapêuticos propostos para esta etapa do desenvolvimento.</div>
 </div>

 <div style="margin-top: 60px; text-align: center; border-top: 1px solid #eee; padding-top: 20px;">
 <div style="margin-top: 40px; display: inline-block; border-top: 1px solid #333; padding-top: 10px; min-width: 300px;">
 <strong>${dischargeForm.professionalName}</strong><br>
 ${dischargeForm.professionalReg}
 </div>
 <p style="font-size: 10px; color: #999; margin-top: 20px;">Documento gerado e autenticado digitalmente (PDF)</p>
 </div>
 </div>
 `;

 const element = document.createElement('div');
 element.innerHTML = htmlContent;
 element.style.position = 'absolute';
 element.style.left = '-9999px';
 element.style.width = '800px';
 document.body.appendChild(element);

 const canvas = await html2canvas(element, { scale: 2, useCORS: true });
 document.body.removeChild(element);

 const imgData = canvas.toDataURL('image/png');
 const pdf = new jsPDF('p', 'mm', 'a4');
 const pdfWidth = pdf.internal.pageSize.getWidth();
 const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
 
 pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
 const pdfBlob = pdf.output('blob');
 const file = new window.File([pdfBlob], `Relatorio_Alta_${patient.full_name.replace(/ /g, '_')}.pdf`, { type: 'application/pdf' });

 await uploadDocument(file, id, 'Relatório de Alta Oficial', 'report');

 showToast('Relatório gerado em PDF com sucesso!');
 setShowDischargeModal(false);
 fetchData();
 } catch (error: any) {
 showToast('Erro ao gerar PDF: ' + error.message, 'error');
 } finally {
 setIsGenerating(false);
 }
 };

 const generateFinancialReport = async () => {
 if (!id || !patient) return;
 setIsGenerating(true);
 try {
 const invoicesQuery = query(
 collection(db, 'invoices'),
 where('patient_id', '==', id),
 where('status', '==', 'paid')
 );
 const appointmentsQuery = query(
 collection(db, 'appointments'),
 where('patient_id', '==', id),
 where('status', '==', 'completed')
 );

 const [invoicesSnap, appointmentsSnap] = await Promise.all([
 getDocs(invoicesQuery),
 getDocs(appointmentsQuery)
 ]);

 const paidInvoices = invoicesSnap.docs.map(docSnap => docSnap.data()) || [];
 paidInvoices.sort((a: any, b: any) => (a.due_date || '').localeCompare(b.due_date || ''));
 const currentDate = format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });

 const htmlContent = `
 <div style="font-family: Arial, sans-serif; padding: 40px; color: #333; line-height: 1.6; max-width: 800px; background: white;">
 <div style="text-align: center; border-bottom: 2px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px;">
 <h2 style="color: #2563eb; font-size: 24px; margin: 0 0 5px 0;">DECLARAÇÃO DE QUITAÇÃO FINANCEIRA</h2>
 <p style="margin: 0; font-weight: bold; color: #444;">${financialForm.professionalName} | ${financialForm.professionalCpf}</p>
 <p style="margin: 0; font-size: 12px; color: #666;">${financialForm.professionalAddress}</p>
 </div>

 <p style="text-align: justify; margin-bottom: 25px;">Declaramos para os devidos fins de comprovação de serviços psicopedagógicos, que o(a) Sr(a). <strong>${patient.full_name}</strong> (ou responsável legal) efetuou os pagamentos referentes ao acompanhamento realizado.</p>

 <table style="width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 14px;">
 <thead>
 <tr style="background-color: #f8fafc;">
 <th style="border: 1px solid #e2e8f0; padding: 12px; text-align: left; font-weight: bold; color: #334155;">Mês/Ano</th>
 <th style="border: 1px solid #e2e8f0; padding: 12px; text-align: left; font-weight: bold; color: #334155;">Descrição do Serviço</th>
 <th style="border: 1px solid #e2e8f0; padding: 12px; text-align: left; font-weight: bold; color: #334155;">Status</th>
 <th style="border: 1px solid #e2e8f0; padding: 12px; text-align: right; font-weight: bold; color: #334155;">Valor Pago</th>
 </tr>
 </thead>
 <tbody>
 ${paidInvoices.map(inv => `
 <tr>
 <td style="border: 1px solid #e2e8f0; padding: 12px; color: #475569;">${format(parseISO(inv.due_date), 'MM/yyyy')}</td>
 <td style="border: 1px solid #e2e8f0; padding: 12px; color: #475569;">${inv.description}</td>
 <td style="border: 1px solid #e2e8f0; padding: 12px; color: #16a34a; font-weight: bold;">Quitado</td>
 <td style="border: 1px solid #e2e8f0; padding: 12px; text-align: right; color: #475569;">R$ ${Number(inv.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
 </tr>
 `).join('')}
 </tbody>
 </table>

 <div style="margin-top: 40px; font-style: italic; text-align: justify; padding: 20px; background: #f8fafc; border-left: 4px solid #2563eb; border-radius: 4px; color: #475569;">
 "Declaramos que não existem débitos pendentes referentes ao período e serviços acima mencionados até a presente data de ${currentDate}."
 </div>

 <div style="margin-top: 60px; text-align: center; font-size: 12px;">
 <div style="margin-top: 40px; padding-top: 10px; border-top: 1px solid #333; display: inline-block; min-width: 300px; font-size: 14px;">
 <strong>${financialForm.professionalName}</strong><br>
 CPF: ${financialForm.professionalCpf}
 </div>
 <p style="color: #999; margin-top: 20px;">Documento gerado e autenticado digitalmente (PDF)</p>
 </div>
 </div>
 `;

 const element = document.createElement('div');
 element.innerHTML = htmlContent;
 element.style.position = 'absolute';
 element.style.left = '-9999px';
 element.style.width = '800px';
 document.body.appendChild(element);

 const canvas = await html2canvas(element, { scale: 2, useCORS: true });
 document.body.removeChild(element);

 const imgData = canvas.toDataURL('image/png');
 const pdf = new jsPDF('p', 'mm', 'a4');
 const pdfWidth = pdf.internal.pageSize.getWidth();
 const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
 
 pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
 const pdfBlob = pdf.output('blob');
 const file = new window.File([pdfBlob], `Declaracao_Quitacao_${patient.full_name.replace(/ /g, '_')}.pdf`, { type: 'application/pdf' });

 await uploadDocument(file, id, 'Declaração de Quitação Financeira (PDF)', 'report');

 showToast('Declaração Financeira PDF gerada com sucesso!');
 setShowFinancialReportModal(false);
 fetchData();
 } catch (error: any) {
 showToast('Erro ao gerar declaração PDF: ' + error.message, 'error');
 } finally {
 setIsGenerating(false);
 }
 me};

 if (loading) {
 return <div className="p-8 text-center text-on-surface-variant">Carregando detalhes...</div>;
 }

 if (!patient) {
 return <div className="p-8 text-center text-red-500">Paciente não encontrado.</div>;
 }

 const answers = anamnesis?.step_data || {};
 const completedCount = objectives.filter(o => o.is_completed).length;
 const progressPercent = objectives.length > 0 ? Math.round((completedCount / objectives.length) * 100) : 0;

 return (
 <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn pb-12">
 {/* Header */}
 <div className="flex items-center gap-4 mb-6 px-4 md:px-0">
 <button onClick={() => navigate('/area-cliente/admin/patients')} className="p-2 hover:bg-surface-variant dark:hover:bg-slate-800 rounded-full transition-colors">
 <ArrowLeft size={24} className="text-slate-600 " />
 </button>
 <div className="flex items-center gap-3">
 <Avatar name={patient.full_name} size="md" className="md:hidden" />
 <div>
 <h1 className="text-xl md:text-2xl font-bold text-on-surface transition-colors">{patient.full_name || 'Paciente sem nome'}</h1>
 <p className="text-on-surface-variant text-sm hidden md:block transition-colors">{patient.email}</p>
 </div>
 </div>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-4 md:px-0">
 {/* Profile Card & Objectives column */}
 <div className="lg:col-span-2 space-y-6">
 {/* Profile Summary */}
 <div className="bg-slate-800 p-6 rounded-[24px] border border-slate-700 shadow-sm transition-colors">
 <div className="flex flex-col md:flex-row gap-6">
 <Avatar name={patient.full_name} size="xl" />
 <div className="space-y-4 flex-1">
 <div>
 <h3 className="font-bold text-white">Dados do Cadastro</h3>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 text-sm text-outline">
 <span className="flex items-center gap-2 bg-slate-900 p-2 rounded-xl border border-slate-700 transition-colors"><User size={16} className="text-primary-400" /> {answers.childName || 'Não inf.'}</span>
 <span className="flex items-center gap-2 bg-slate-900 p-2 rounded-xl border border-slate-700 transition-colors"><Calendar size={16} className="text-primary-400" /> {answers.childAge || 'Não inf.'} anos</span>
 <span className="flex items-center gap-2 bg-slate-900 p-2 rounded-xl border border-slate-700 transition-colors"><MapPin size={16} className="text-primary-400" /> {answers.school || 'Não inf.'}</span>
 <span className="flex items-center gap-2 bg-slate-900 p-2 rounded-xl border border-slate-700 transition-colors"><Phone size={16} className="text-primary-400" /> {answers.responsibleName || '-'}</span>
 </div>
 </div>
 </div>
 </div>
 </div>

 {/* Diário de Bordo (Evolução Clínica) */}
 <div className="bg-slate-800 p-6 md:p-8 rounded-[24px] border border-slate-700 shadow-sm transition-colors">
 <PatientEvolutions patientId={id!} />
 </div>

 {/* Objectives / Progress Management */}
 <div className="bg-slate-800 p-6 md:p-8 rounded-[24px] border border-slate-700 shadow-sm space-y-6 transition-colors">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-3">
 <div className="p-2 bg-primary-900/40 text-primary-400 rounded-xl transition-colors">
 <Target size={24} />
 </div>
 <h2 className="text-xl font-bold text-white transition-colors">Objetivos Terapêuticos</h2>
 </div>
 <div className="text-right">
 <p className="text-2xl font-bold text-primary-400 transition-colors">{progressPercent}%</p>
 <p className="text-[10px] text-on-surface-variant font-bold uppercase transition-colors">Progresso Geral</p>
 </div>
 </div>

 {/* Progress Bar */}
 <div className="w-full bg-surface-variant h-2 rounded-full overflow-hidden transition-colors">
 <div
 className="bg-primary h-full transition-all duration-700"
 style={{ width: `${progressPercent}%` }}
 />
 </div>

 {/* Add Objective Form */}
 <form onSubmit={handleAddObjective} className="flex gap-2">
 <div className="flex-1">
 <Input
 placeholder="Novo objetivo (ex: Melhorar leitura)"
 value={newObjective}
 onChange={(e) => setNewObjective(e.target.value)}
 className="!py-2.5"
 />
 </div>
 <Button
 type="submit"
 disabled={addingObjective || !newObjective.trim()}
 className="!py-2.5 px-4"
 >
 <Plus size={20} />
 </Button>
 </form>

 {/* Objectives List */}
 <div className="space-y-2">
 {objectives.length === 0 ? (
 <p className="text-center py-6 text-outline dark:text-on-surface-variant text-sm italic">Nenhum objetivo traçado ainda.</p>
 ) : (
 objectives.map(obj => (
 <div
 key={obj.id}
 className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${obj.is_completed ? 'bg-green-50/50 dark:bg-green-900/20 border-green-100 dark:border-green-800/30' : 'bg-background border-outline-variant '}`}
 >
 <div className="flex items-center gap-3 flex-1 min-w-0">
 <button
 onClick={() => handleToggleObjective(obj.id, obj.is_completed)}
 className={`transition-colors ${obj.is_completed ? 'text-green-600 dark:text-green-400' : 'text-slate-300 dark:text-slate-600 hover:text-primary dark:hover:text-primary-400'}`}
 >
 {obj.is_completed ? <CheckCircle2 size={22} /> : <Circle size={22} />}
 </button>
 <span className={`text-sm font-medium truncate ${obj.is_completed ? 'text-green-800 dark:text-green-300 line-through opacity-70' : 'text-slate-700 '}`}>
 {obj.description}
 </span>
 </div>
 <button
 onClick={() => handleDeleteObjective(obj.id)}
 className="p-1.5 text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 transition-colors"
 >
 <Trash2 size={16} />
 </button>
 </div>
 ))
 )}
 </div>
 </div>
 </div>

 {/* Documents Side Column */}
 <div className="space-y-6">
    {/* Official Actions */}
    <div className="bg-surface p-6 rounded-[24px] border border-outline-variant shadow-sm space-y-4 transition-colors">
      <h3 className="font-bold text-on-surface flex items-center gap-2">
        <div className="p-2 bg-primary/10 text-primary rounded-xl">
          <ShieldCheck size={18} />
        </div>
        Documentos Oficiais
      </h3>
      <div className="space-y-3">
         {/* Contrato para Assinatura (Enviado pelo Admin) */}
         {(() => {
           const templateDocs = documents.filter(d => d.type === 'contract_template' || (d.uploaded_by === 'admin' && d.title.toLowerCase().includes('contrato')));
           const latestTemplate = templateDocs.length > 0 ? templateDocs[0] : null;

           return (
             <div className="p-3.5 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800/40 space-y-2">
               <div className="flex items-center justify-between">
                 <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-800 dark:text-blue-300">
                   <FileText size={14} /> Contrato para o Paciente
                 </span>
                 <span className="text-[10px] text-blue-700 dark:text-blue-400 font-medium">
                   {latestTemplate ? new Date(latestTemplate.created_at).toLocaleDateString('pt-BR') : 'Não enviado'}
                 </span>
               </div>
               {latestTemplate ? (
                 <p className="text-xs text-slate-700 dark:text-slate-200 font-medium truncate">{latestTemplate.title}</p>
               ) : (
                 <p className="text-xs text-slate-500 italic">Nenhum contrato anexado para este paciente.</p>
               )}
               <input
                 type="file"
                 ref={contractInputRef}
                 className="hidden"
                 onChange={handleContractUpload}
                 accept=".pdf,.doc,.docx,.jpg,.png"
               />
               <button
                 onClick={() => contractInputRef.current?.click()}
                 disabled={uploading}
                 className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors w-full justify-center shadow-2xs cursor-pointer"
               >
                 <Upload size={14} /> {latestTemplate ? 'Substituir Contrato Enviado' : 'Enviar Contrato para Paciente'}
               </button>
             </div>
           );
         })()}

         {/* Status do Contrato Assinado Recebido */}
         {(() => {
           const signedContracts = documents.filter(d => d.type === 'signed_contract' || (d.uploaded_by === 'patient' && d.title.toLowerCase().includes('contrato')));
           const latestContract = signedContracts.length > 0 ? signedContracts[0] : null;

           if (latestContract) {
             return (
               <div className="p-3.5 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800/40 space-y-2">
                 <div className="flex items-center justify-between">
                   <span className="inline-flex items-center gap-1 text-xs font-bold text-green-800 dark:text-green-300">
                     <CheckCircle2 size={14} /> Contrato Assinado Recebido
                   </span>
                   <span className="text-[10px] text-green-700 dark:text-green-400 font-medium">
                     {new Date(latestContract.created_at).toLocaleDateString('pt-BR')}
                   </span>
                 </div>
                 <p className="text-xs text-slate-700 dark:text-slate-200 font-medium truncate">{latestContract.title}</p>
                 <a
                   href={latestContract.url}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-bold transition-colors w-full justify-center shadow-2xs"
                 >
                   <Download size={14} /> Baixar Contrato Assinado
                 </a>
               </div>
             );
           } else {
             return (
               <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800/40 flex items-center justify-between text-xs text-amber-800 dark:text-amber-300 font-medium">
                 <span className="flex items-center gap-1.5">
                   <ShieldCheck size={14} /> Assinatura do Paciente
                 </span>
                 <span className="text-[10px] text-amber-700 dark:text-amber-400 font-bold uppercase">Devolução Pendente</span>
               </div>
             );
           }
         })()}

        <button
          onClick={() => setShowDischargeModal(true)}
          className="w-full flex items-center justify-between p-3 bg-surface-variant/40 hover:bg-surface-variant text-on-surface rounded-xl transition-colors text-sm font-medium border border-outline-variant/40"
        >
          <div className="flex items-center gap-2">
            <FileCheck size={18} className="text-primary" />
            Relatório de Alta
          </div>
          <Plus size={16} className="text-on-surface-variant" />
        </button>
        <button
          onClick={() => setShowFinancialReportModal(true)}
          className="w-full flex items-center justify-between p-3 bg-surface-variant/40 hover:bg-surface-variant text-on-surface rounded-xl transition-colors text-sm font-medium border border-outline-variant/40"
        >
          <div className="flex items-center gap-2">
            <Receipt size={18} className="text-primary" />
            Quitação Financeira
          </div>
          <Plus size={16} className="text-on-surface-variant" />
        </button>
      </div>
    </div>

    {/* Documents */}
    <div className="bg-surface p-6 rounded-[24px] border border-outline-variant shadow-sm space-y-4 transition-colors">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-on-surface flex items-center gap-2 transition-colors">
          <div className="p-2 bg-primary/10 text-primary rounded-xl">
            <File size={18} />
          </div>
          Documentos Anexados
        </h3>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileUpload}
          accept=".pdf,.doc,.docx,.jpg,.png"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="p-2 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-colors"
          title="Fazer upload de documento"
        >
          <Upload size={18} />
        </button>
      </div>

      <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1 custom-scrollbar">
        {documents.length === 0 ? (
          <p className="text-center py-4 text-xs text-on-surface-variant">Nenhum arquivo anexado.</p>
        ) : (
          documents.map(doc => (
            <div key={doc.id} className="group flex items-center justify-between p-3 bg-surface-variant/30 rounded-xl border border-outline-variant/40 transition-colors">
              <div className="flex items-center gap-2 overflow-hidden">
                <FileText size={16} className="text-primary flex-shrink-0" />
                <p className="text-xs font-medium text-on-surface truncate">{doc.title}</p>
              </div>
              <div className="flex items-center gap-1">
                <a href={doc.url} target="_blank" rel="noopener noreferrer" className="p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors">
                  <Download size={14} />
                </a>
                <button onClick={() => handleDeleteDoc(doc.id, doc.url)} className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>

    {/* Compact Anamnesis Access */}
    <div className="bg-surface p-6 rounded-[24px] border border-outline-variant shadow-sm group hover:border-primary/50 transition-colors cursor-pointer" onClick={() => setShowAnamnesisModal(true)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 text-primary rounded-2xl group-hover:scale-105 transition-transform">
            <FileText size={24} />
          </div>
          <div>
            <h3 className="font-bold text-on-surface text-sm transition-colors">Pré-Anamnese</h3>
            <p className="text-[10px] text-on-surface-variant font-bold uppercase transition-colors">{anamnesis ? 'Completa' : 'Pendente'}</p>
          </div>
        </div>
        <div className="p-2 bg-surface-variant text-on-surface-variant rounded-xl group-hover:bg-primary/10 group-hover:text-primary transition-colors">
          <ExternalLink size={20} />
        </div>
      </div>
      {anamnesis && (
        <div className="mt-4 pt-4 border-t border-outline-variant transition-colors">
          <p className="text-xs text-on-surface-variant line-clamp-2 italic">
            "{answers.mainReason || 'Sem queixa principal informada.'}"
          </p>
        </div>
      )}
    </div>
  </div>
  </div>

  {/* Discharge Modal */}
  {showDischargeModal && (
  <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
  <div className="bg-surface w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden flex flex-col animate-scaleUp max-h-[90vh] border border-transparent transition-colors">
  <div className="p-6 border-b border-outline-variant flex items-center justify-between transition-colors">
  <h2 className="text-xl font-bold text-on-surface transition-colors">Gerar Relatório de Alta</h2>
  <button onClick={() => setShowDischargeModal(false)} className=""><X size={20} /></button>
  </div>
  <div className="p-6 overflow-y-auto space-y-4 custom-scrollbar">
  <Input label="Seu Nome Profissional" value={dischargeForm.professionalName} onChange={e => setDischargeForm({ ...dischargeForm, professionalName: e.target.value })} placeholder="Ex: Dra. Raiane Ferreira" />
  <Input label="Registro Profissional (CRP/CBO)" value={dischargeForm.professionalReg} onChange={e => setDischargeForm({ ...dischargeForm, professionalReg: e.target.value })} placeholder="Ex: CBO 2394-25" />
  <Textarea label="Evolução do Caso" value={dischargeForm.evolution} onChange={e => setDischargeForm({ ...dischargeForm, evolution: e.target.value })} placeholder="Descreva os marcos alcançados..." />
  <Textarea label="Metodologia Utilizada" value={dischargeForm.methodology} onChange={e => setDischargeForm({ ...dischargeForm, methodology: e.target.value })} placeholder="Ex: Intervenções baseadas em jogos..." />
  <Textarea label="Estado Atual" value={dischargeForm.currentStatus} onChange={e => setDischargeForm({ ...dischargeForm, currentStatus: e.target.value })} placeholder="Como o paciente está hoje?" />
  <Textarea label="Recomendações Finais" value={dischargeForm.recommendations} onChange={e => setDischargeForm({ ...dischargeForm, recommendations: e.target.value })} placeholder="Orientações para a família e escola..." />
  </div>
  <div className="p-6 bg-background bg-surface-variant/40 border-t border-outline-variant flex justify-end gap-3 transition-colors">
  <Button variant="outline" onClick={() => setShowDischargeModal(false)}>Cancelar</Button>
  <Button onClick={generateDischargeReport} isLoading={isGenerating}>Gerar e Disponibilizar</Button>
  </div>
  </div>
  </div>
  )}

  {/* Financial Report Modal */}
  {showFinancialReportModal && (
  <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
  <div className="bg-surface w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden flex flex-col animate-scaleUp border border-transparent transition-colors">
  <div className="p-6 border-b border-outline-variant flex items-center justify-between transition-colors">
  <h2 className="text-xl font-bold text-on-surface transition-colors">Declaração de Quitação</h2>
  <button onClick={() => setShowFinancialReportModal(false)} className=""><X size={20} /></button>
  </div>
  <div className="p-6 space-y-4">
  <Input label="Seu Nome/Clínica" value={financialForm.professionalName} onChange={e => setFinancialForm({ ...financialForm, professionalName: e.target.value })} />
  <Input label="Seu CPF/CNPJ" value={financialForm.professionalCpf} onChange={e => setFinancialForm({ ...financialForm, professionalCpf: e.target.value })} />
  <Input label="Endereço Profissional" value={financialForm.professionalAddress} onChange={e => setFinancialForm({ ...financialForm, professionalAddress: e.target.value })} />
  <div className="p-4 bg-blue-50 rounded-2xl text-xs text-blue-700 leading-relaxed">
  <p>Este documento trará automaticamente uma tabela com todos os pagamentos marcados como <strong>Pagos</strong> para este paciente no sistema.</p>
  </div>
  </div>
  <div className="p-6 bg-background bg-surface-variant/40 border-t border-outline-variant flex justify-end gap-3 transition-colors">
  <Button variant="outline" onClick={() => setShowFinancialReportModal(false)}>Cancelar</Button>
  <Button onClick={generateFinancialReport} isLoading={isGenerating}>Gerar Quitação</Button>
  </div>
  </div>
  </div>
  )}

  {/* Anamnesis Full Modal */}
  {showAnamnesisModal && (
  <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
  <div className="bg-surface w-full max-w-4xl max-h-[90vh] rounded-[32px] shadow-2xl overflow-hidden flex flex-col animate-scaleUp border border-transparent transition-colors">
  {/* Modal Header */}
  <div className="p-6 md:p-8 flex items-center justify-between border-b border-slate-700 transition-colors">
  <div className="flex items-center gap-4">
  <div className="p-3 bg-purple-900/30 text-purple-400 rounded-2xl transition-colors">
  <FileText size={24} />
  </div>
  <div>
  <h2 className="text-xl md:text-2xl font-bold text-white transition-colors">Resultado da Pré-Anamnese</h2>
  <p className="text-sm text-outline">Respondido por {answers.responsibleName || 'Responsável'}</p>
  </div>
  </div>
  <button
  onClick={() => setShowAnamnesisModal(false)}
  className="p-2 hover:bg-slate-700 rounded-full transition-colors"
  >
  <X size={24} className="text-on-surface-variant" />
  </button>
  </div>

  {/* Modal Content */}
  <div className="p-6 md:p-8 overflow-y-auto space-y-10 custom-scrollbar bg-surface transition-colors">
  {!anamnesis ? (
  <div className="text-center py-12">
  <p className="text-on-surface-variant italic">Este paciente ainda não enviou a anamnese.</p>
  </div>
  ) : (
  <>
  {/* Section 1 */}
  <section>
  <div className="flex items-center gap-2 mb-6 text-purple-600">
  <div className="w-1 h-4 bg-purple-600 rounded-full"></div>
  <h3 className="text-sm font-bold uppercase tracking-wider">Identificação & Família</h3>
  </div>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
  <DetailItem label="Criança/Paciente" value={answers.childName} />
  <DetailItem label="Idade" value={answers.childAge ? `${answers.childAge} anos` : null} />
  <DetailItem label="Estrutura Familiar" value={answers.familyStructure} fullWidth />
  <DetailItem label="Vínculo do Responsável" value={answers.responsibleBond} />
  <DetailItem label="Escola / Série" value={answers.school} />
  </div>
  </section>

  <hr className="border-slate-700" />

  {/* Section 2 */}
  <section>
  <div className="flex items-center gap-2 mb-6 text-purple-600">
  <div className="w-1 h-4 bg-purple-600 rounded-full"></div>
  <h3 className="text-sm font-bold uppercase tracking-wider">Motivo & Histórico</h3>
  </div>
  <div className="space-y-6">
  <DetailItem label="Principal Queixa" value={answers.mainReason} fullWidth highlight />
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
  <DetailItem label="Aparecimento dos sintomas" value={answers.sinceWhen} />
  <DetailItem label="Eventos Recentes Impactantes" value={answers.recentEvents} />
  </div>
  </div>
  </section>

  <hr className="border-slate-700" />

  {/* Section 3 */}
  <section>
  <div className="flex items-center gap-2 mb-6 text-purple-600">
  <div className="w-1 h-4 bg-purple-600 rounded-full"></div>
  <h3 className="text-sm font-bold uppercase tracking-wider">Saúde e Rotina</h3>
  </div>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
  <DetailItem label="Diagnósticos Prévios" value={answers.diagnosis} />
  <DetailItem label="Medicações em uso" value={answers.medication} />
  <DetailItem label="Sono e Alimentação" value={answers.sleepAndFood} fullWidth />
  <DetailItem label="Outros tratamentos/terapias" value={answers.otherTreatments} fullWidth />
  </div>
  </section>

  <hr className="border-slate-700" />

  {/* Section 4 */}
  <section>
  <div className="flex items-center gap-2 mb-6 text-purple-600">
  <div className="w-1 h-4 bg-purple-600 rounded-full"></div>
  <h3 className="text-sm font-bold uppercase tracking-wider">Vida Escolar</h3>
  </div>
  <div className="space-y-6">
  <DetailItem label="Feedback da Escola" value={answers.schoolFeedback} fullWidth />
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
  <DetailItem label="Preferências Escolares" value={answers.preferences} />
  <DetailItem label="Relação com Lição de Casa" value={answers.homework} />
  <DetailItem label="Autonomia nos estudos" value={answers.autonomy} />
  </div>
  </div>
  </section>

  <hr className="border-slate-700" />

  {/* Section 5 */}
  <section>
  <div className="flex items-center gap-2 mb-6 text-purple-600">
  <div className="w-1 h-4 bg-purple-600 rounded-full"></div>
  <h3 className="text-sm font-bold uppercase tracking-wider">Comportamento e Social</h3>
  </div>
  <div className="space-y-6">
  <DetailItem label="Reação a Frustrações" value={answers.frustration} fullWidth />
  <DetailItem label="Relação com Colegas/Irmãos" value={answers.socialization} fullWidth />
  <DetailItem label="Principais Interesses/Hobbies" value={answers.interactions} fullWidth />
  <DetailItem label="Observações Adicionais" value={answers.extraObservations} fullWidth highlight />
  </div>
  </section>
  </>
  )}
  </div>

  {/* Modal Footer */}
  <div className="p-6 bg-slate-900/40 border-t border-slate-700 flex justify-end transition-colors">
  <Button onClick={() => setShowAnamnesisModal(false)} className="px-8">
  Fechar Visualização
  </Button>
  </div>
  </div>
  </div>
  )}
  </div>
  );
};

// Helper Component for consistent display
const DetailItem = ({ label, value, fullWidth, highlight }: any) => {
  if (!value) return null;
  return (
  <div className={`${fullWidth ? 'col-span-full' : ''} ${highlight ? 'bg-primary-container p-5 rounded-2xl border border-primary-100 dark:border-primary-800/30' : ''} transition-colors`}>
  <p className="text-[10px] font-bold text-outline dark:text-on-surface-variant uppercase mb-2 tracking-widest transition-colors">{label}</p>
  <p className="text-on-surface whitespace-pre-wrap leading-relaxed text-sm transition-colors">{value || '—'}</p>
  </div>
  );
};

export default PatientDetail;
