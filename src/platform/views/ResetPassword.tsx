import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const ResetPassword: React.FC = () => {
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password.length < 6) {
            alert('A nova senha deve ter pelo menos 6 caracteres.');
            return;
        }

        if (password !== confirmPassword) {
            alert('As senhas não coincidem.');
            return;
        }

        setIsLoading(true);
        setStatus(null);

        try {
            const { error } = await supabase.auth.updateUser({
                password: password
            });

            if (error) throw error;

            setStatus({ type: 'success', message: 'Sua senha foi redefinida com sucesso!' });
            setTimeout(() => {
                navigate('/area-cliente');
            }, 3000);
        } catch (error: any) {
            console.error(error);
            setStatus({ type: 'error', message: `Erro ao redefinir: ${error.message || 'Tente novamente.'}` });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-surface flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-[28px] shadow-md3-2 overflow-hidden border border-surface-variant/50">
                <div className="p-8 pt-10">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Redefinir Senha</h1>
                        <p className="text-slate-500 mt-2 font-medium">Digite sua nova senha de acesso</p>
                    </div>

                    {status && (
                        <div className={`mb-6 p-4 rounded-2xl text-sm font-medium ${status.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                            }`}>
                            {status.message}
                        </div>
                    )}

                    <form onSubmit={handleReset} className="space-y-4">
                        <Input
                            label="Nova Senha"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            icon={Lock}
                            isPassword
                            placeholder="Mínimo 6 caracteres"
                            required
                        />

                        <Input
                            label="Confirmar Nova Senha"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            icon={Lock}
                            isPassword
                            placeholder="Confirme sua nova senha"
                            required
                        />

                        <Button
                            type="submit"
                            className="w-full mt-6"
                            size="lg"
                            isLoading={isLoading}
                        >
                            Salvar Nova Senha
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <button
                            onClick={() => navigate('/area-cliente')}
                            className="text-sm font-bold text-slate-500 hover:text-slate-700 hover:underline"
                        >
                            Voltar para o Login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
