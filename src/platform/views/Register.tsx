import React, { useState } from 'react';
import { Heart, User, Lock, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const Register: React.FC = () => {
    const { signUp } = useAuth();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password.length < 6) {
            alert('A senha deve ter pelo menos 6 caracteres.');
            return;
        }

        if (password !== confirmPassword) {
            alert('As senhas não coincidem.');
            return;
        }

        setIsLoading(true);
        try {
            await signUp(email, password, name);
            // If success, Supabase might auto-login, or wait for email confirmation.
            // For now, let's assume auto-login or redirect.
            navigate('/area-cliente');
        } catch (error) {
            console.error(error); // Alert already handled in context
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-surface flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-[28px] shadow-md3-2 overflow-hidden border border-surface-variant/50">
                <div className="p-8 pt-10">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Crie sua Conta</h1>
                        <p className="text-slate-500 mt-2 font-medium">Junte-se à nossa comunidade</p>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-4">
                        <Input
                            label="Nome Completo"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            icon={User}
                            placeholder="Nome e Sobrenome"
                            required
                        />

                        <Input
                            label="E-mail"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            icon={Mail}
                            placeholder="seu@email.com"
                            required
                        />

                        <Input
                            label="Senha"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            icon={Lock}
                            isPassword
                            placeholder="******"
                            required
                        />

                        <Input
                            label="Confirmar Senha"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            icon={Lock}
                            isPassword
                            placeholder="******"
                            required
                        />

                        <Button
                            type="submit"
                            className="w-full mt-6"
                            size="lg"
                            isLoading={isLoading}
                        >
                            Cadastrar
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-slate-500">
                            Já tem uma conta?{' '}
                            <button
                                onClick={() => navigate('/area-cliente')}
                                className="font-bold text-primary-600 hover:text-primary-700 hover:underline"
                            >
                                Faça Login
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
