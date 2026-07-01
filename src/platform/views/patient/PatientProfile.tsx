import React, { useState } from 'react';
import { User, Lock, Shield, LogOut } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { db, auth } from '../../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { updatePassword } from 'firebase/auth';
import { useAuth } from '../../context/AuthContext';

const PatientProfile: React.FC = () => {
    const { user, logout } = useAuth();
    const [name, setName] = useState(user?.name || '');
    const [email] = useState(user?.email || '');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setLoading(true);
        try {
            const profileRef = doc(db, 'profiles', user.id);
            await updateDoc(profileRef, { full_name: name });
            alert('Dados atualizados com sucesso!');
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
        if (!auth.currentUser) {
            alert('Usuário não autenticado.');
            return;
        }

        setLoading(true);
        try {
            await updatePassword(auth.currentUser, password);
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
 <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn px-4 md:px-0 pb-12">
 <div>
 <h2 className="text-2xl md:text-3xl font-normal text-on-surface transition-colors">Meu Perfil</h2>
 <p className="text-on-surface-variant mt-1 text-sm md:text-base transition-colors">Gerencie suas informações pessoais.</p>
 </div>

 <div className="bg-surface p-6 md:p-8 rounded-[24px] border border-outline-variant shadow-sm transition-colors">
 <div className="flex items-center gap-3 mb-6 transition-colors">
 <div className="p-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 rounded-xl transition-colors">
 <User size={24} />
 </div>
 <h3 className="text-lg md:text-xl font-bold text-on-surface transition-colors">Dados Pessoais</h3>
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
 className="bg-background bg-surface-variant/40 text-on-surface-variant cursor-not-allowed border-outline /50 transition-colors"
 />
 <div className="pt-2">
 <Button type="submit" disabled={loading} className="w-full">
 {loading ? 'Salvando...' : 'Salvar Alterações'}
 </Button>
 </div>
 </form>
 </div>

 <div className="bg-surface p-6 md:p-8 rounded-[24px] border border-outline-variant shadow-sm transition-colors">
 <div className="flex items-center gap-3 mb-6 transition-colors">
 <div className="p-2 bg-surface-variant text-slate-600 rounded-xl transition-colors">
 <Lock size={24} />
 </div>
 <h3 className="text-lg md:text-xl font-bold text-on-surface transition-colors">Alterar Senha</h3>
 </div>

 <form onSubmit={handleUpdatePassword} className="space-y-4">
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
 <Button type="submit" disabled={loading || !password} variant="outline" className="w-full">
 {loading ? 'Alterando...' : 'Atualizar Senha'}
 </Button>
 </div>
 </form>
 </div>

  {/* Logout Section for Mobile */}
  <div className="md:hidden pt-4">
  <Button
  variant="outline"
  className="w-full border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 flex items-center justify-center gap-2 transition-all"
  onClick={async () => {
  if (confirm('Deseja realmente sair?')) {
  await logout();
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

export default PatientProfile;
