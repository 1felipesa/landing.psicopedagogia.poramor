import React, { useEffect, useState, useRef } from 'react';
import { db } from '../../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { uploadDocument, Document } from '../../lib/documents';
import { useToast } from '../../context/ToastContext';
import {
    FileText,
    Download,
    File,
    Upload,
    CheckCircle2,
    Clock,
    FileCheck,
    HelpCircle,
    ExternalLink,
    Camera,
    PenTool,
    ChevronDown,
    ChevronUp,
    AlertCircle
} from 'lucide-react';
import Button from '../../components/ui/Button';

const PatientReports: React.FC = () => {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [documents, setDocuments] = useState<Document[]>([]);
    const [contractTemplates, setContractTemplates] = useState<Document[]>([]);
    const [signedContracts, setSignedContracts] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [showInstructions, setShowInstructions] = useState(false);
    const [showContractHistory, setShowContractHistory] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!user) return;
        fetchDocs();
    }, [user]);

    const fetchDocs = async () => {
        try {
            if (!user) return;
            const q = query(
                collection(db, 'documents'),
                where('patient_id', '==', user.id)
            );
            const querySnapshot = await getDocs(q);
            const docsData = querySnapshot.docs.map(docSnap => ({
                id: docSnap.id,
                ...docSnap.data()
            })) as Document[];

            // Sort in memory by created_at desc
            docsData.sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));

            // Categorize documents
            const templates = docsData.filter(d => d.type === 'contract_template' || (d.uploaded_by === 'admin' && (d.title.toLowerCase().includes('contrato') || d.title.toLowerCase().includes('prestacao') || d.title.toLowerCase().includes('prestação'))));
            const signed = docsData.filter(d => d.type === 'signed_contract' || (d.uploaded_by === 'patient' && (d.title.toLowerCase().includes('contrato') || d.title.toLowerCase().includes('assinado'))));
            
            const templateIds = new Set(templates.map(t => t.id));
            const signedIds = new Set(signed.map(s => s.id));

            const otherDocs = docsData.filter(d => !templateIds.has(d.id) && !signedIds.has(d.id));

            setContractTemplates(templates);
            setSignedContracts(signed);
            setDocuments(otherDocs);
        } catch (error) {
            console.error('Erro ao buscar documentos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleContractUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        // Validations: check both MIME type and file extension for maximum compatibility across browsers/OS
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'application/x-pdf'];
        const isExtValid = /\.(pdf|png|jpg|jpeg)$/i.test(file.name);
        const isTypeValid = allowedTypes.includes(file.type);

        if (!isTypeValid && !isExtValid) {
            showToast('Formato não suportado. Por favor, envie um arquivo PDF ou imagem (JPG/PNG).', 'error');
            return;
        }

        const maxSizeMB = 10;
        if (file.size > maxSizeMB * 1024 * 1024) {
            showToast(`O arquivo deve ter no máximo ${maxSizeMB}MB.`, 'error');
            return;
        }

        try {
            setUploading(true);
            const versionNumber = signedContracts.length + 1;
            const docTitle = `Contrato Assinado ${versionNumber > 1 ? `(Versão ${versionNumber})` : ''}`;

            await uploadDocument(file, user.id, docTitle, 'signed_contract', 'patient');
            showToast('Contrato assinado enviado com sucesso!', 'success');
            await fetchDocs();
        } catch (error: any) {
            console.error('Erro ao fazer upload do contrato:', error);
            showToast(`Erro ao enviar o contrato: ${error.message || 'Tente novamente.'}`, 'error');
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    const latestSignedContract = signedContracts.length > 0 ? signedContracts[0] : null;
    const latestContractTemplate = contractTemplates.length > 0 ? contractTemplates[0] : null;

    return (
        <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto px-4 md:px-0 pb-12">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-normal text-on-surface transition-colors">Relatórios e Documentos</h2>
                <p className="text-on-surface-variant mt-1 transition-colors">Acesse materiais, laudos, atividades e envie seu contrato assinado.</p>
            </div>

            {/* SEÇÃO 1: CONTRATO DE PRESTAÇÃO DE SERVIÇOS */}
            <div className="bg-surface rounded-[28px] border border-outline-variant p-6 md:p-8 shadow-sm space-y-6 transition-all">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-outline-variant/60 pb-6">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-primary/10 text-primary rounded-2xl flex-shrink-0 mt-1">
                            <FileCheck size={28} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="text-xl font-bold text-on-surface">Contrato de Prestação de Serviços</h3>
                                {latestSignedContract ? (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                                        <CheckCircle2 size={14} /> Contrato Assinado Devolvido
                                    </span>
                                ) : latestContractTemplate ? (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                                        <Clock size={14} /> Aguardando sua Assinatura
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300">
                                        <Clock size={14} /> Envio Pendente
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-on-surface-variant mt-1">
                                {latestSignedContract
                                    ? `Você enviou o contrato assinado em ${new Date(latestSignedContract.created_at).toLocaleDateString('pt-BR')}`
                                    : latestContractTemplate
                                    ? `A Dra. Raiane disponibilizou o contrato abaixo para você baixar, assinar e reenviar.`
                                    : 'Por favor, assine o documento e envie por aqui.'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 self-start md:self-center">
                        <button
                            onClick={() => setShowInstructions(!showInstructions)}
                            className="flex items-center gap-1.5 text-xs font-medium text-primary hover:underline px-3 py-2 rounded-xl bg-primary/5 transition-colors"
                        >
                            <HelpCircle size={16} />
                            {showInstructions ? 'Ocultar orientações' : 'Como assinar e enviar?'}
                        </button>
                    </div>
                </div>

                {/* PASSO 1: BAIXAR CONTRATO DISPONIBILIZADO PELA DRA. RAIANE */}
                {latestContractTemplate ? (
                    <div className="p-4 md:p-5 bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/40 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className="p-3 bg-blue-600 text-white rounded-xl flex-shrink-0">
                                <Download size={22} />
                            </div>
                            <div className="truncate">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 block">
                                    Passo 1: Baixar Contrato enviado para você
                                </span>
                                <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">{latestContractTemplate.title}</p>
                                <p className="text-xs text-slate-600 dark:text-slate-400">
                                    Enviado pela Dra. Raiane em {new Date(latestContractTemplate.created_at).toLocaleDateString('pt-BR')}
                                </p>
                            </div>
                        </div>
                        <a
                            href={latestContractTemplate.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 flex-shrink-0"
                        >
                            <Download size={16} /> Baixar Contrato para Assinar
                        </a>
                    </div>
                ) : (
                    <div className="p-4 bg-amber-50/60 dark:bg-amber-900/20 border border-amber-200/60 dark:border-amber-800/30 rounded-2xl flex items-center gap-3 text-xs text-amber-900 dark:text-amber-300">
                        <AlertCircle size={18} className="flex-shrink-0 text-amber-600" />
                        <span>
                            A Dra. Raiane irá disponibilizar o contrato de prestação de serviços nesta área para você baixar. Se você já possui a cópia impressa ou em arquivo PDF, pode assinar e enviar pelo formulário abaixo.
                        </span>
                    </div>
                )}

                {/* ORIENTAÇÕES PASSO A PASSO (Expansível / Didático) */}
                {showInstructions && (
                    <div className="p-5 bg-surface-variant/40 rounded-2xl border border-outline-variant/60 space-y-4 animate-slideDown text-sm">
                        <h4 className="font-bold text-on-surface flex items-center gap-2 text-base">
                            <HelpCircle size={18} className="text-primary" />
                            Como enviar seu contrato assinado?
                        </h4>
                        <p className="text-on-surface-variant">
                            Você pode escolher qualquer uma das duas opções abaixo para assinar seu documento com toda a comodidade:
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                            {/* Opção 1: Assinatura Física */}
                            <div className="p-4 bg-surface rounded-xl border border-outline-variant/40 space-y-2">
                                <div className="flex items-center gap-2 font-bold text-on-surface">
                                    <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-lg">
                                        <Camera size={18} />
                                    </div>
                                    Opção 1: Assinatura Física (Caneta)
                                </div>
                                <ol className="list-decimal list-inside text-xs text-on-surface-variant space-y-1.5 leading-relaxed pl-1">
                                    <li>Baixe o modelo do contrato e **imprima**.</li>
                                    <li>Preencha os dados e assine a **próprio punho**.</li>
                                    <li>Tire uma **foto bem iluminada** ou escaneie o documento.</li>
                                    <li>Envie a foto ou arquivo (JPG, PNG ou PDF) pelo botão abaixo.</li>
                                </ol>
                            </div>

                            {/* Opção 2: Assinatura Digital Gov.br */}
                            <div className="p-4 bg-surface rounded-xl border border-outline-variant/40 space-y-2">
                                <div className="flex items-center gap-2 font-bold text-on-surface">
                                    <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                                        <PenTool size={18} />
                                    </div>
                                    Opção 2: Digital (Gov.br ou PDF)
                                </div>
                                <ol className="list-decimal list-inside text-xs text-on-surface-variant space-y-1.5 leading-relaxed pl-1">
                                    <li>Abra o PDF do contrato no seu computador ou celular.</li>
                                    <li>Assine gratuitamente usando a **Assinatura Gov.br**.</li>
                                    <li>Salve o arquivo PDF assinado.</li>
                                    <li>Faça o upload do PDF assinado pelo botão abaixo.</li>
                                </ol>
                                <a
                                    href="https://www.gov.br/governodigital/pt-br/assinatura-eletronica"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-xs text-primary font-bold hover:underline pt-1"
                                >
                                    Acessar Assinador Gov.br gratuito <ExternalLink size={12} />
                                </a>
                            </div>
                        </div>
                    </div>
                )}

                {/* ÁREA DE AÇÃO DE UPLOAD */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-primary/5 dark:bg-primary/10 rounded-2xl border border-primary/20">
                    <div>
                        <p className="text-sm font-bold text-on-surface">
                            {latestSignedContract ? 'Enviar nova versão do Contrato Assinado' : 'Enviar Contrato Assinado'}
                        </p>
                        <p className="text-xs text-on-surface-variant mt-0.5">
                            Aceita arquivos em formato **PDF, JPG, JPEG ou PNG** (até 10MB).
                        </p>
                    </div>

                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleContractUpload}
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                    />

                    <Button
                        onClick={() => fileInputRef.current?.click()}
                        isLoading={uploading}
                        className="w-full sm:w-auto flex items-center justify-center gap-2"
                    >
                        <Upload size={18} />
                        {latestSignedContract ? 'Enviar Nova Versão' : 'Selecionar Arquivo'}
                    </Button>
                </div>

                {/* ÚLTIMO CONTRATO E HISTÓRICO DE VERSÕES */}
                {signedContracts.length > 0 && (
                    <div className="space-y-3 pt-2">
                        <div className="flex items-center justify-between">
                            <h4 className="text-sm font-bold text-on-surface">Contrato Assinado Atual</h4>
                            {signedContracts.length > 1 && (
                                <button
                                    onClick={() => setShowContractHistory(!showContractHistory)}
                                    className="text-xs font-medium text-primary flex items-center gap-1 hover:underline"
                                >
                                    {showContractHistory ? 'Ocultar versões anteriores' : `Ver histórico (${signedContracts.length} envios)`}
                                    {showContractHistory ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                </button>
                            )}
                        </div>

                        {/* Versão Atual */}
                        {latestSignedContract && (
                            <div className="flex items-center justify-between p-4 bg-surface rounded-2xl border border-green-200 dark:border-green-900/40 shadow-2xs">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="p-2.5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl flex-shrink-0">
                                        <FileCheck size={20} />
                                    </div>
                                    <div className="truncate">
                                        <p className="text-sm font-bold text-on-surface truncate">{latestSignedContract.title}</p>
                                        <p className="text-xs text-on-surface-variant">
                                            Enviado em {new Date(latestSignedContract.created_at).toLocaleDateString('pt-BR')}
                                        </p>
                                    </div>
                                </div>

                                <a
                                    href={latestSignedContract.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 px-4 py-2 bg-surface-variant hover:bg-primary/10 text-primary font-bold text-xs rounded-xl transition-colors flex-shrink-0"
                                >
                                    <Download size={14} /> Visualizar / Baixar
                                </a>
                            </div>
                        )}

                        {/* Histórico de Versões Anteriores */}
                        {showContractHistory && signedContracts.length > 1 && (
                            <div className="space-y-2 pt-2 border-t border-outline-variant/40 animate-slideDown">
                                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Histórico de envios anteriores:</p>
                                {signedContracts.slice(1).map((contract) => (
                                    <div key={contract.id} className="flex items-center justify-between p-3 bg-surface-variant/30 rounded-xl border border-outline-variant/30 text-xs">
                                        <div className="flex items-center gap-2 truncate">
                                            <FileText size={16} className="text-on-surface-variant flex-shrink-0" />
                                            <span className="font-medium text-on-surface truncate">{contract.title}</span>
                                            <span className="text-on-surface-variant text-[11px]">
                                                ({new Date(contract.created_at).toLocaleDateString('pt-BR')})
                                            </span>
                                        </div>
                                        <a
                                            href={contract.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary hover:underline font-bold flex items-center gap-1"
                                        >
                                            <Download size={12} /> Ver arquivo
                                        </a>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* SEÇÃO 2: RELATÓRIOS E MATERIAIS COMPARTILHADOS PELA PSICOPEDAGOGA */}
            <div className="space-y-4">
                <h3 className="text-xl font-bold text-on-surface">Materiais e Relatórios Compartilhados</h3>

                {documents.length === 0 ? (
                    <div className="bg-surface rounded-[24px] border border-outline-variant p-12 text-center shadow-sm transition-colors">
                        <div className="bg-surface-variant/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-on-surface-variant">
                            <FileText size={32} />
                        </div>
                        <h4 className="text-base font-bold text-on-surface mb-1">Nenhum relatório compartilhado ainda</h4>
                        <p className="text-xs text-on-surface-variant max-w-sm mx-auto">
                            Assim que a psicopedagoga compartilhar laudos, devolutivas ou atividades, os arquivos aparecerão nesta seção.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {documents.map((doc) => (
                            <div key={doc.id} className="bg-surface rounded-[24px] border border-outline-variant p-6 shadow-sm hover:shadow-md3-1 transition-all group relative">
                                <div className="absolute top-6 right-6 p-2 bg-surface-variant/50 rounded-xl text-on-surface-variant">
                                    <File size={20} />
                                </div>

                                <div className="mt-2 mb-4">
                                    <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold uppercase rounded-full mb-3">
                                        {doc.type === 'report' ? 'Relatório' : 'Atividade'}
                                    </span>
                                    <h4 className="font-bold text-base text-on-surface line-clamp-2 min-h-[48px]">
                                        {doc.title}
                                    </h4>
                                    <p className="text-xs text-on-surface-variant font-medium">
                                        Adicionado em {new Date(doc.created_at).toLocaleDateString('pt-BR')}
                                    </p>
                                </div>

                                <a
                                    href={doc.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full py-2.5 bg-surface-variant hover:bg-primary text-on-surface hover:text-white font-bold rounded-xl transition-all text-center flex items-center justify-center gap-2 text-xs"
                                >
                                    <Download size={16} />
                                    Baixar Arquivo
                                </a>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PatientReports;
