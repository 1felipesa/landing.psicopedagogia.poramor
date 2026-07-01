import React, { useState } from 'react';
import { Mail, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../lib/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const ForgotPassword: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const handleResetRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setStatus(null);

        try {
            // Firebase password reset
            await sendPasswordResetEmail(auth, email);

            setStatus({
                type: 'success',
                message: 'E-mail enviado! Verifique sua caixa de entrada para redefinir sua senha.'
            });
        } catch (error: any) {
            console.error(error);
            let msg = 'Ocorreu um erro ao processar sua solicitação. Por favor, tente novamente.';
            if (error.code === 'auth/user-not-found') {
                msg = 'E-mail não cadastrado.';
            } else if (error.code === 'auth/invalid-email') {
                msg = 'E-mail inválido.';
            }
            setStatus({
                type: 'error',
                message: `Erro ao enviar e-mail: ${msg}`
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-surface flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-surface rounded-[28px] shadow-md3-2 overflow-hidden border border-surface-variant/50">
                <div className="p-8 pt-10">
                    <button
                        onClick={() => navigate('/area-cliente')}
                        className="flex items-center gap-2 text-sm text-on-surface-variant hover:text-primary transition-colors mb-8 font-medium"
                    >
                        <ArrowLeft size={16} />
                        Voltar para o Login
                    </button>

                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-on-surface tracking-tight">Recuperar Senha</h1>
                        <p className="text-on-surface-variant mt-2 font-medium">Enviaremos um link de acesso para o seu e-mail</p>
                    </div>

                    {status && (
                        <div className={`mb-6 p-4 rounded-2xl text-sm font-medium ${
                            status.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                        }`}>
                            {status.message}
                        </div>
                    )}

                    <form onSubmit={handleResetRequest} className="space-y-6">
                        <Input
                            label="E-mail de cadastro"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            icon={Mail}
                            placeholder="seu@email.com"
                            required
                        />

                        <Button
                            type="submit"
                            className="w-full mt-2"
                            size="lg"
                            isLoading={isLoading}
                        >
                            Enviar Link de Recuperação
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
