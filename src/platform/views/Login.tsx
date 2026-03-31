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
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-[28px] shadow-md3-2 overflow-hidden border border-surface-variant/50">

        <div className="p-8 pt-12">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 rounded-3xl text-primary-600 mb-6 shadow-sm">
              <Heart size={40} fill="currentColor" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Psicopedagogia por Amor</h1>
            <p className="text-slate-500 mt-2 font-medium">Plataforma de gestão em Psicopedagogia</p>
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

            <div className="flex justify-end -mt-4">
              <button
                type="button"
                onClick={() => navigate('/area-cliente/forgot-password')}
                className="text-xs font-bold text-slate-500 hover:text-primary-600 transition-colors"
              >
                Esqueci minha senha
              </button>
            </div>

            <Button
              type="submit"
              className="w-full mt-4"
              size="lg"
              isLoading={isLoading}
            >
              Entrar
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500">
              Ainda não tem cadastro?{' '}
              <button
                onClick={() => navigate('/area-cliente/register')}
                className="font-bold text-primary-600 hover:text-primary-700 hover:underline"
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