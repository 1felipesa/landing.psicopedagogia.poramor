import React, { useState } from 'react';
import { Heart, User, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Preencha todos os campos.");
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      // Redirect is handled by App.tsx based on user role/auth state
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden font-body">
      
      {/* Premium Ambiance Elements */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#5a2e8c]/10 rounded-full blur-[100px] -z-10"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-[#dfb2c8]/20 rounded-full blur-[120px] -z-10"></div>

      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-ambient overflow-hidden border border-white/50">

        <div className="p-8 pb-10 sm:p-12">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#5a2e8c] to-[#452070] rounded-[1.5rem] text-white mb-8 shadow-xl shadow-[#5a2e8c]/20 transform -rotate-3 hover:rotate-0 transition-transform">
              <Heart size={36} fill="currentColor" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight font-display">Acesso VIP</h1>
            <p className="text-slate-500 mt-2 font-medium text-sm">Seu espaço seguro de acompanhamento e evolução.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <Input
              label="E-mail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={User}
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

            <div className="flex justify-end -mt-3">
              <button
                type="button"
                onClick={() => navigate('/area-cliente/forgot-password')}
                className="text-xs font-bold text-slate-400 hover:text-[#5a2e8c] transition-colors"
              >
                Esqueci minha senha
              </button>
            </div>

            <Button
              type="submit"
              className="w-full mt-4 bg-[#5a2e8c] hover:bg-[#452070] text-white shadow-xl shadow-[#5a2e8c]/20 py-4 rounded-2xl transition-all"
              size="lg"
              isLoading={isLoading}
            >
              Acessar Portal
            </Button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500">
              Ainda não tem cadastro?{' '}
              <button
                onClick={() => navigate('/area-cliente/register')}
                className="font-bold text-[#5a2e8c] hover:text-[#452070] hover:underline transition-all"
              >
                Criar conta
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;