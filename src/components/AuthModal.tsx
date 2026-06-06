import { useState, FormEvent } from 'react';
import { User } from '../types';
import { Mail, Lock, User as UserIcon, Shield, ChevronRight, LogOut } from 'lucide-react';
import { motion } from 'motion/react';

interface AuthProps {
  onLogin: (user: User) => void;
  onLogout: () => void;
  currentUser: User | null;
}

export default function AuthModal({ onLogin, onLogout, currentUser }: AuthProps) {
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(true);

  // Load accounts from localStorage
  const getAccounts = (): Record<string, { user: User; passwordHash: string }> => {
    try {
      const data = localStorage.getItem('ingles_master_accounts');
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  };

  const saveAccount = (user: User, pass: string) => {
    const accs = getAccounts();
    accs[user.email.toLowerCase()] = { user, passwordHash: pass };
    localStorage.setItem('ingles_master_accounts', JSON.stringify(accs));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !password || (!isLogin && !name)) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (password.length < 4) {
      setError('A senha deve ter pelo menos 4 caracteres.');
      return;
    }

    const emailKey = email.toLowerCase().trim();
    const accounts = getAccounts();

    if (isLogin) {
      // Handle Login
      const acc = accounts[emailKey];
      if (acc && acc.passwordHash === password) {
        onLogin(acc.user);
        setSuccess(`Bem-vindo de volta, ${acc.user.name}!`);
      } else {
        setError('E-mail ou senha incorretos.');
      }
    } else {
      // Handle SignUp
      if (accounts[emailKey]) {
        setError('Este e-mail já está cadastrado.');
        return;
      }

      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        email: emailKey,
        name: name.trim(),
        createdAt: new Date().toISOString(),
      };

      saveAccount(newUser, password);
      onLogin(newUser);
      setSuccess('Conta criada com sucesso! Progresso pronto para salvar.');
    }
  };

  const handleGuestLogin = () => {
    const guestUser: User = {
      id: 'convidado',
      email: 'convidado@inglesmaster.com',
      name: 'Estudante Convidado',
      createdAt: new Date().toISOString(),
    };
    onLogin(guestUser);
  };

  if (currentUser) {
    return (
      <div id="auth-panel" className="bg-white rounded-2xl border border-blue-100 p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg">
            {currentUser.name[0]?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-slate-800 text-sm md:text-base">{currentUser.name}</h3>
            <p className="text-xs text-slate-400 font-mono leading-none mt-1">{currentUser.email}</p>
          </div>
          <button
            onClick={onLogout}
            id="btn-logout"
            className="p-2 border border-slate-100 hover:border-red-100 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-xl transition-all cursor-pointer"
            title="Sair da Conta"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
        {currentUser.id === 'convidado' && (
          <div className="mt-4 p-3 bg-amber-50/60 rounded-xl border border-amber-100/50 flex gap-2 items-start">
            <Shield className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-[11px] text-amber-700 leading-relaxed">
              Modo de prática temporária. Para salvar todo o seu progresso da plataforma de forma definitiva,{' '}
              <button
                onClick={() => {
                  onLogout();
                  setShowForm(true);
                  setIsLogin(false);
                }}
                className="font-semibold text-blue-600 hover:underline cursor-pointer"
              >
                ative sua conta de acesso com e-mail
              </button>
              .
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div id="auth-unauthenticated" className="bg-white rounded-2xl border border-blue-50 p-6 md:p-8 shadow-sm">
      {!showForm ? (
        <div className="text-center py-4">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">Comece a Treinar Agora ou Salve seu Progresso</h2>
          <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">
            Seus acertos, erros e fluência detalhados salvos na nuvem local. Treine livremente ou inscreva-se em segundos!
          </p>

          <div className="mt-6 flex flex-col gap-3 max-w-xs mx-auto">
            <button
              onClick={() => {
                setShowForm(true);
                setIsLogin(false);
              }}
              id="btn-go-signup"
              className="py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-xl shadow-md shadow-blue-100 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              Criar Conta de Membro
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setShowForm(true);
                setIsLogin(true);
              }}
              id="btn-go-login"
              className="py-3 px-4 bg-slate-50 hover:bg-slate-100 text-slate-600 font-medium text-sm rounded-xl cursor-pointer transition-all"
            >
              Já tenho cadastro (Entrar)
            </button>

            <div className="flex items-center gap-2 w-full my-1">
              <span className="h-[1px] bg-slate-100 flex-1"></span>
              <span className="text-[10px] text-slate-300 font-mono tracking-widest leading-none">OU</span>
              <span className="h-[1px] bg-slate-100 flex-1"></span>
            </div>

            <button
              onClick={handleGuestLogin}
              id="btn-go-guest"
              className="py-2 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-500 font-medium text-xs rounded-xl cursor-pointer transition-all"
            >
              Acessar Prática de Forma Direta
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-lg text-slate-800">
                {isLogin ? 'Entrar na Conta de Membro' : 'Crie sua Conta de Membro'}
              </h3>
              <p className="text-xs text-slate-500">
                {isLogin ? 'Acesse seus exercícios arquivados' : 'Treine e salve seus exercícios de escuta, fala e escrita'}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl border border-red-100">
                {error}
              </div>
            )}
            {success && (
              <div className="p-3 bg-green-50 text-green-700 text-xs rounded-xl border border-green-100">
                {success}
              </div>
            )}

            {!isLogin && (
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Seu Nome</label>
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    required
                    placeholder="Ex: João Silva"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl text-sm transition-all focus:outline-none placeholder-slate-400"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="email"
                  required
                  placeholder="Ex: seuemail@provedor.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl text-sm transition-all focus:outline-none placeholder-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="password"
                  required
                  placeholder="Seus caracteres de acesso"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl text-sm transition-all focus:outline-none placeholder-slate-400"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                id="btn-auth-submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-all cursor-pointer shadow-sm flex items-center justify-center"
              >
                {isLogin ? 'Entrar' : 'Registrar e Começar'}
              </button>
            </div>
          </form>

          <div className="mt-4 flex justify-between items-center text-xs text-slate-500">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setSuccess('');
              }}
              className="text-blue-600 font-semibold hover:underline cursor-pointer"
            >
              {isLogin ? 'Não tem conta? Crie uma!' : 'Já é cadastrado? Entre aqui.'}
            </button>
            <button
              onClick={() => {
                setShowForm(false);
                setError('');
                setSuccess('');
              }}
              className="text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              Voltar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
