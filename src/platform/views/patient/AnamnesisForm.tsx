import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
 ArrowLeft,
 ArrowRight,
 User,
 Cloud,
 Baby,
 Stethoscope,
 School,
 BrainCircuit,
 HeartHandshake,
 CheckCircle
} from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Textarea from '../../components/ui/Textarea';
import { db } from '../../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';

const AnamnesisForm: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<any>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hasCompleted, setHasCompleted] = useState(false);
    const [loadingCheck, setLoadingCheck] = useState(true);

    useEffect(() => {
        if (!user) return;

        const checkAnamnesis = async () => {
            try {
                const docRef = doc(db, 'anamnesis', user.id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists() && docSnap.data().status === 'completed') {
                    setHasCompleted(true);
                    // Load existing answers to form state if needed (or just prevent re-fill)
                    if (docSnap.data().step_data) {
                        setFormData(docSnap.data().step_data);
                    }
                }
            } catch (error) {
                // No anamnesis found is fine
            } finally {
                setLoadingCheck(false);
            }
        };

        checkAnamnesis();
    }, [user]);

    const totalSteps = 4;
    const progress = (step / totalSteps) * 100;

    // Helper to update form data
    const handleChange = (field: string, value: string) => {
        setFormData((prev: any) => ({ ...prev, [field]: value }));
    };

    const handleFinish = async () => {
        if (!user) return;
        setIsSubmitting(true);

        try {
            await setDoc(doc(db, 'anamnesis', user.id), {
                patient_id: user.id,
                step_data: formData,
                status: 'completed',
                updated_at: new Date().toISOString()
            });

            alert('Anamnese enviada com sucesso! Obrigado.');
            navigate('/area-cliente/patient');

        } catch (err: any) {
            alert('Erro ao enviar: ' + err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

 if (loadingCheck) {
 return <div className="p-8 text-center text-on-surface-variant">Carregando...</div>;
 }

 if (hasCompleted) {
 return (
 <div className="max-w-xl mx-auto mt-12 p-8 bg-surface rounded-[24px] border border-outline-variant shadow-lg text-center transition-all">
 <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6 transition-colors">
 <CheckCircle size={32} />
 </div>
 <h2 className="text-2xl font-bold text-on-surface mb-2 transition-colors">Anamnese Já Enviada!</h2>
 <p className="text-slate-600 mb-8 transition-colors">
 Já recebemos suas respostas. Nossa equipe está analisando tudo com muito carinho.
 Em breve entraremos em contato para agendar a primeira sessão.
 </p>
 <Button onClick={() => navigate('/area-cliente/patient')} variant="primary">
 Voltar para o Início
 </Button>
 </div>
 );
 }

 // Step Icons helper
 const getStepIcon = (stepNumber: number) => {
 switch (stepNumber) {
 case 1: return <Baby size={24} />;
 case 2: return <Stethoscope size={24} />;
 case 3: return <School size={24} />;
 case 4: return <BrainCircuit size={24} />;
 default: return <User size={24} />;
 }
 };

 const getStepTitle = (stepNumber: number) => {
 switch (stepNumber) {
 case 1: return "Identificação Básica";
 case 2: return "O Chamado & Saúde";
 case 3: return "Vida Escolar";
 case 4: return "Comportamento";
 default: return "";
 }
 };

 return (
 <div className="max-w-4xl mx-auto animate-fadeIn pb-12">
 {/* Header with Back Button */}
 <div className="mb-8 px-4 md:px-0">
 <button
 onClick={() => navigate('/area-cliente/patient')}
 className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-medium mb-4 px-4 py-2 rounded-full hover:bg-surface-variant dark:hover:bg-slate-800 w-fit"
 >
 <ArrowLeft size={20} />
 Voltar
 </button>
 <h1 className="text-3xl md:text-4xl font-normal text-on-surface transition-colors">Pré-Anamnese</h1>
 <div className="mt-5 p-5 bg-gradient-to-r from-primary-50/50 to-primary-100/30 dark:from-primary-950/20 dark:to-primary-900/10 rounded-2xl border-l-4 border-l-primary border-y border-r border-primary-100/30 dark:border-primary-800/20 flex gap-3 text-on-surface transition-all duration-300">
 <HeartHandshake className="flex-shrink-0 mt-1 text-primary" size={24} />
 <div>
 <p className="text-base font-bold text-primary dark:text-primary-300 leading-none mb-1">Olá! Seja muito bem-vindo(a).</p>
 <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
 Para que nossa primeira conversa seja o mais proveitosa possível, preparei este pequeno mapa para conhecer melhor seu pequeno explorador. Preencha com calma e no seu tempo.
 </p>
 </div>
 </div>
 </div>

 {/* Progress Bar */}
 <div className="bg-surface px-8 py-6 mx-4 md:mx-0 rounded-[24px] border border-outline-variant shadow-sm mb-8 transition-colors">
 <div className="flex justify-between items-center mb-4">
 <div className="flex items-center gap-2">
 <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 transition-colors">
 {getStepIcon(step)}
 </span>
 <span className="text-sm font-bold text-on-surface transition-colors">Passo {step}: {getStepTitle(step)}</span>
 </div>
 <span className="text-xs font-medium text-outline dark:text-on-surface-variant transition-colors">{step} de {totalSteps}</span>
 </div>
 <div className="h-2 w-full bg-surface-variant rounded-full overflow-hidden transition-colors">
 <div
 className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
 style={{ width: `${progress}%` }}
 ></div>
 </div>
 </div>

 {/* Form Card */}
 <form className="bg-surface p-6 md:p-8 mx-4 md:mx-0 rounded-[28px] border border-outline-variant shadow-md3-1 relative overflow-hidden transition-colors" onSubmit={(e) => e.preventDefault()}>

 {/* Step 1: Identificação (Bloco 1) */}
 {step === 1 && (
 <div className="space-y-8 animate-fadeIn">
 <div>
 <h2 className="text-xl font-medium text-on-surface transition-colors mb-1">Identificação e Dados Básicos</h2>
 <p className="text-sm text-on-surface-variant transition-colors">Vamos começar conhecendo quem é o herói dessa jornada.</p>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <div className="md:col-span-2">
 <Input
 label="1.1 Nome completo da criança"
 icon={User}
 placeholder=" "
 value={formData.childName || ''}
 onChange={(e) => handleChange('childName', e.target.value)}
 />
 </div>
 <div>
 <Input
 label="Idade / Data de Nascimento"
 type="text"
 placeholder="Ex: 8 anos (12/05/2015)"
 value={formData.childAge || ''}
 onChange={(e) => handleChange('childAge', e.target.value)}
 />
 </div>
 <div className="md:col-span-2">
 <Input
 label="1.2 Série Escolar e Escola"
 placeholder="Ex: 3º ano - Escola Viver"
 value={formData.school || ''}
 onChange={(e) => handleChange('school', e.target.value)}
 />
 </div>

 <div className="md:col-span-2 border-t border-outline-variant /50 my-2 transition-colors"></div>

 <div>
 <Input
 label="1.3 Nome do Responsável"
 placeholder="Quem está preenchendo?"
 value={formData.responsibleName || ''}
 onChange={(e) => handleChange('responsibleName', e.target.value)}
 />
 </div>
 <div>
 <Input
 label="Vínculo com a criança"
 placeholder="Mãe, Pai, Avó..."
 value={formData.responsibleBond || ''}
 onChange={(e) => handleChange('responsibleBond', e.target.value)}
 />
 </div>

 <div className="md:col-span-2">
 <Textarea
 label="1.4 Com quem a criança reside? (Estrutura Familiar)"
 placeholder="Ex: Mora comigo (mãe), com o pai e um irmão mais novo..."
 value={formData.familyStructure || ''}
 onChange={(e) => handleChange('familyStructure', e.target.value)}
 />
 </div>
 </div>
 </div>
 )}

 {/* Step 2: Motivo e Saúde (Bloco 2 e 3) */}
 {step === 2 && (
 <div className="space-y-8 animate-fadeIn">
 {/* Bloco 2 */}
 <div className="space-y-6">
 <div>
 <h2 className="text-xl font-medium text-on-surface transition-colors mb-1">O "Chamado"</h2>
 <p className="text-sm text-on-surface-variant transition-colors">Qual o motivo que trouxe vocês até aqui?</p>
 </div>

 <Textarea
 label="2.1 Principal motivo da busca pelo atendimento"
 placeholder="Descreva o que mais preocupa hoje..."
 className="min-h-[100px]"
 value={formData.mainReason || ''}
 onChange={(e) => handleChange('mainReason', e.target.value)}
 />

 <Input
 label="2.2 Desde quando percebe essa dificuldade?"
 placeholder="Ex: Desde o ano passado, desde bebê..."
 value={formData.sinceWhen || ''}
 onChange={(e) => handleChange('sinceWhen', e.target.value)}
 />

 <Textarea
 label="2.3 Houve algum evento marcante recentemente?"
 placeholder="Mudança de escola, luto, separação, nascimento de irmão..."
 value={formData.recentEvents || ''}
 onChange={(e) => handleChange('recentEvents', e.target.value)}
 />
 </div>

 <div className="border-t border-outline-variant transition-colors"></div>

 {/* Bloco 3 */}
 <div className="space-y-6">
 <div>
 <h2 className="text-xl font-medium text-on-surface transition-colors mb-1">Histórico de Saúde</h2>
 <p className="text-sm text-on-surface-variant transition-colors">O corpo e biologia do herói.</p>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <div className="md:col-span-2">
 <Input
 label="3.1 Possui algum diagnóstico? Qual?"
 placeholder="Não ou sim (especifique)"
 value={formData.diagnosis || ''}
 onChange={(e) => handleChange('diagnosis', e.target.value)}
 />
 </div>
 <div className="md:col-span-2">
 <Input
 label="3.2 Faz uso de medicação contínua?"
 placeholder="Se sim, qual e dosagem"
 value={formData.medication || ''}
 onChange={(e) => handleChange('medication', e.target.value)}
 />
 </div>
 </div>

 <Textarea
 label="3.3 Outros acompanhamentos realizados (Fono, Psi, etc)"
 placeholder="Já passou ou passa por outros profissionais?"
 value={formData.otherTreatments || ''}
 onChange={(e) => handleChange('otherTreatments', e.target.value)}
 />

 <Textarea
 label="3.4 Como é a qualidade do sono e alimentação?"
 placeholder="Dorme bem? Tem seletividade alimentar?"
 value={formData.sleepAndFood || ''}
 onChange={(e) => handleChange('sleepAndFood', e.target.value)}
 />
 </div>
 </div>
 )}

 {/* Step 3: Vida Escolar (Bloco 4) */}
 {step === 3 && (
 <div className="space-y-8 animate-fadeIn">
 <div>
 <h2 className="text-xl font-medium text-on-surface transition-colors mb-1">A Jornada Escolar</h2>
 <p className="text-sm text-on-surface-variant transition-colors">Como é o ambiente de aprendizagem.</p>
 </div>

 <div className="space-y-6">
 <Textarea
 label="4.1 Como a escola descreve o desempenho dele(a)?"
 placeholder="Feedback dos professores, notas, recados na agenda..."
 value={formData.schoolFeedback || ''}
 onChange={(e) => handleChange('schoolFeedback', e.target.value)}
 />

 <Textarea
 label="4.2 Matérias preferidas e as que mais evita"
 placeholder="O que ele ama e o que ele detesta estudar?"
 value={formData.preferences || ''}
 onChange={(e) => handleChange('preferences', e.target.value)}
 />

 <div>
 <label className="block text-sm font-medium text-on-surface transition-colors mb-3 px-1">4.3 Como é o momento da lição de casa?</label>
 <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
 {['Tranquilo', 'Gera Conflitos', 'Exige muita ajuda'].map(opt => (
 <label key={opt} className="cursor-pointer relative">
 <input
 type="radio"
 name="homework"
 className="peer sr-only"
 checked={formData.homework === opt}
 onChange={() => handleChange('homework', opt)}
 />
 <div className="p-3.5 rounded-2xl border border-outline/30 text-on-surface-variant hover:bg-surface-variant/50 peer-checked:bg-primary-container peer-checked:text-on-primary-container peer-checked:border-primary transition-all text-xs font-bold text-center">
 {opt}
 </div>
 </label>
 ))}
 </div>
 </div>

 <div>
 <label className="block text-sm font-medium text-on-surface transition-colors mb-3 px-1">4.4 Possui autonomia para organizar o material?</label>
 <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
 {['Total autonomia', 'Precisa de ajuda', 'Não organiza'].map(opt => (
 <label key={opt} className="cursor-pointer relative">
 <input
 type="radio"
 name="autonomy"
 className="peer sr-only"
 checked={formData.autonomy === opt}
 onChange={() => handleChange('autonomy', opt)}
 />
 <div className="p-3.5 rounded-2xl border border-outline/30 text-on-surface-variant hover:bg-surface-variant/50 peer-checked:bg-primary-container peer-checked:text-on-primary-container peer-checked:border-primary transition-all text-xs font-bold text-center">
 {opt}
 </div>
 </label>
 ))}
 </div>
 </div>
 </div>
 </div>
 )}

 {/* Step 4: Comportamento (Bloco 5) */}
 {step === 4 && (
 <div className="space-y-8 animate-fadeIn">
 <div>
 <h2 className="text-xl font-medium text-on-surface transition-colors mb-1">Comportamento e Socialização</h2>
 <p className="text-sm text-on-surface-variant transition-colors">O mundo emocional e social.</p>
 </div>

 <div className="space-y-6">
 <Textarea
 label="5.1 Como lida com frustrações?"
 placeholder="Quando as coisas não saem como planejado..."
 value={formData.frustration || ''}
 onChange={(e) => handleChange('frustration', e.target.value)}
 />

 <Textarea
 label="5.2 Como é o relacionamento com colegas?"
 placeholder="Faz amigos fácil? É mais tímido? Briga muito?"
 value={formData.socialization || ''}
 onChange={(e) => handleChange('socialization', e.target.value)}
 />

 <Textarea
 label="5.3 Quais são os principais interesses/paixões?"
 placeholder="Ex: Dinossauros, Minecraft, Futebol, Desenho..."
 value={formData.interactions || ''}
 onChange={(e) => handleChange('interactions', e.target.value)}
 />

 <div className="pt-4 border-t border-outline-variant transition-colors">
 <Textarea
 label="Há algo importante que não perguntei?"
 placeholder="Espaço livre para você contar o que achar relevante..."
 className="min-h-[140px]"
 value={formData.extraObservations || ''}
 onChange={(e) => handleChange('extraObservations', e.target.value)}
 />
 </div>
 </div>
 </div>
 )}

 {/* Footer Actions */}
 <div className="mt-10 pt-6 border-t border-outline-variant flex flex-col-reverse sm:flex-row items-center justify-between gap-4 transition-colors">
 <div className="flex items-center gap-2 text-on-surface-variant text-sm transition-colors">
 <Cloud size={16} />
 <span>Salvo automaticamente</span>
 </div>
 <div className="flex gap-4 w-full sm:w-auto">
 {step > 1 && (
 <Button
 onClick={() => setStep(s => s - 1)}
 variant="outline"
 className="w-full sm:w-auto"
 type="button"
 >
 Anterior
 </Button>
 )}
 <Button
 onClick={() => step < totalSteps ? setStep(s => s + 1) : handleFinish()}
 variant="primary"
 className="w-full sm:w-auto px-8"
 type="button"
 isLoading={isSubmitting}
 rightIcon={step < totalSteps ? <ArrowRight size={20} /> : undefined}
 >
 {step === totalSteps ? 'Enviar Anamnese' : 'Próximo'}
 </Button>
 </div>
 </div>
 </form>
 </div>
 );
};

export default AnamnesisForm;