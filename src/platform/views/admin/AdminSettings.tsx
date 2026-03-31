import React, { useState } from 'react';
import { User, Lock, Save, Shield, LogOut } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

const AdminSettings: React.FC = () => {
    const { user } = useAuth();
    const [name, setName] = useState(user?.name || '');
    const [email] = useState(user?.email || ''); // Email usually shouldn't be changed easily

    // Password State
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ full_name: name })
                .eq('id', user?.id);

            if (error) throw error;
            alert('Perfil atualizado com sucesso!');
        } catch (error: any) {
            alert('Erro ao atualizar: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert('As senhas não coincidem.');
            return;
        }
        if (password.length < 6) {
            alert('A senha deve ter pelo menos 6 caracteres.');
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase.auth.updateUser({
                password: password
            });

            if (error) throw error;
            alert('Senha alterada com sucesso!');
            setPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            alert('Erro ao alterar senha: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn px-4 md:px-0 pb-12">
            <div>
                <h2 className="text-2xl md:text-3xl font-normal text-slate-800 dark:text-white transition-colors">Configurações</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm md:text-base transition-colors">Gerencie seus dados e segurança.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Profile Section */}
                <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-[24px] border border-slate-100 dark:border-slate-700 shadow-sm h-fit transition-all">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-xl transition-colors">
                            <User size={24} />
                        </div>
                        <h3 className="text-lg md:text-xl font-bold text-slate-800 dark:text-white transition-colors">Meu Perfil</h3>
                    </div>

                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                        <Input
                            label="Nome Completo"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <Input
                            label="E-mail"
                            value={email}
                            disabled
                            className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-500 cursor-not-allowed border-slate-200 dark:border-slate-700 transition-colors"
                        />
                        <div className="pt-2">
                            <Button type="submit" disabled={loading} className="w-full">
                                {loading ? 'Salvando...' : 'Salvar Alterações'}
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Security Section */}
                <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-[24px] border border-slate-100 dark:border-slate-700 shadow-sm h-fit transition-all">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl transition-colors">
                            <Shield size={24} />
                        </div>
                        <h3 className="text-lg md:text-xl font-bold text-slate-800 dark:text-white transition-colors">Segurança</h3>
                    </div>

                    <form onSubmit={handleUpdatePassword} className="space-y-4">
                        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-900/30 rounded-xl mb-4 transition-colors">
                            <p className="text-[10px] md:text-xs text-yellow-800 dark:text-yellow-200 flex items-center gap-2 transition-colors">
                                <Lock size={14} />
                                A nova senha deve ter no mínimo 6 caracteres.
                            </p>
                        </div>

                        <Input
                            label="Nova Senha"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="******"
                        />
                        <Input
                            label="Confirmar Nova Senha"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="******"
                        />
                        <div className="pt-2">
                            <Button type="submit" disabled={loading || !password} variant="outline" className="w-full text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-100 dark:border-red-900/30 transition-colors">
                                {loading ? 'Alterando...' : 'Alterar Senha'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Logout Section (Mobile only or at the bottom) */}
            <div className="md:hidden pt-4">
                <Button
                    variant="outline"
                    className="w-full border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center justify-center gap-2 transition-colors"
                    onClick={() => {
                        if (confirm('Deseja realmente sair?')) {
                            import('../../lib/supabase').then(({ supabase }) => supabase.auth.signOut());
                        }
                    }}
                >
                    <LogOut size={18} />
                    Sair da Conta
                </Button>
            </div>
        </div>
    );
};

export default AdminSettings;
