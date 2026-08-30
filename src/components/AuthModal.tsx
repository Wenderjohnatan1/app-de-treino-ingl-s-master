import { useState, FormEvent } from 'react';
import { User } from '../types';
import { Mail, Lock, User as UserIcon, Shield, ChevronRight, LogOut, Loader2, CloudCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { 
  signInWithGoogle, 
  loginWithEmail, 
  registerWithEmail, 
  logOutUser 
} from '../firebase';

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
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Google Sign-In Handler
  const handleGoogleSignIn = async () => {
    setError('');
    setSuccess('');
    setGoogleLoading(true);

    try {
      const user = await signInWithGoogle();
      onLogin(user);
      setSuccess(`Conectado com sucesso com a conta Google (${user.name})!`);
    } catch (err: any) {
      console.error('Google sign-in error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError('O login do Google foi cancelado antes de concluir.');
      } else if (err.code === 'auth/cancelled-popup-request') {
        // user clicked again, ignore
      } else {
        setError(err.message || 'Não foi possível conectar com o Google. Tente novamente.');
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  // Email/Password Submit Handler
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !password || (!isLogin && !name)) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        // Firebase Login
        const user = await loginWithEmail(email.trim(), password);
        onLogin(user);
        setSuccess(`Bem-vindo de volta, ${user.name}!`);
      } else {
        // Firebase Register
        const user = await registerWithEmail(name.trim(), email.trim(), password);
        onLogin(user);
        setSuccess('Conta criada com sucesso no Firebase! Seu progresso está seguro na nuvem.');
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('E-mail ou senha incorretos.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('Este e-mail já está cadastrado. Alterne para Entrar.');
      } else if (err.code === 'auth/weak-password') {
        setError('A senha é muito fraca. Utilize pelo menos 6 caracteres.');
      } else if (err.code === 'auth/invalid-email') {
        setError('E-mail inválido. Verifique o formato digitado.');
      } else {
        setError(err.message || 'Erro ao autenticar. Verifique sua conexão.');
      }
    } finally {
      setLoading(false);
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

  const handleSignOut = async () => {
    try {
      await logOutUser();
    } catch (e) {
      console.warn('Sign out error:', e);
    }
    onLogout();
  };

  if (currentUser) {
    return (
      <div id="auth-panel" className="bg-white rounded-2xl border border-blue-100 p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-extrabold text-base shadow-xs">
            {currentUser.name[0]?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="font-extrabold text-slate-800 text-sm truncate">{currentUser.name}</h3>
              {currentUser.id !== 'convidado' && (
                <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.5 rounded border border-emerald-200/60 shrink-0">
                  Nuvem Ativa
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 font-mono leading-none mt-1 truncate">{currentUser.email}</p>
          </div>
          <button
            onClick={handleSignOut}
            id="btn-logout"
            className="p-2 border border-slate-100 hover:border-red-100 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-xl transition-all cursor-pointer shrink-0"
            title="Sair da Conta"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
        
        {currentUser.id === 'convidado' ? (
          <div className="mt-3.5 p-3 bg-amber-50/70 rounded-xl border border-amber-200/60 flex gap-2 items-start">
            <Shield className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-[11px] text-amber-800 leading-relaxed">
              <span>Modo Convidado. Salve seu progresso e repetição espaçada na nuvem com </span>
              <button
                onClick={() => {
                  handleSignOut();
                  setShowForm(true);
                  setIsLogin(false);
                }}
                className="font-bold text-blue-700 hover:underline cursor-pointer"
              >
                Google ou E-mail
              </button>
              .
            </div>
          </div>
        ) : (
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1 text-emerald-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Sincronizado no Firebase
            </span>
            <span className="text-slate-400">Banco de Dados Ativo</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div id="auth-unauthenticated" className="bg-white rounded-3xl border border-blue-50 p-6 md:p-8 shadow-sm">
      {!showForm ? (
        <div className="text-center py-2">
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3.5 shadow-2xs">
            <Shield className="w-7 h-7" />
          </div>
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-800 tracking-tight">Comece a Treinar ou Salve seu Progresso</h2>
          <p className="text-xs text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">
            Seus acertos, erros e memorização espaçada salvos com segurança em nuvem pelo Firebase.
          </p>

          <div className="mt-6 flex flex-col gap-3 max-w-xs mx-auto">
            {/* Google Direct Sign-In Button */}
            <button
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              id="btn-google-login-landing"
              className="w-full py-3 px-4 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-center gap-3 cursor-pointer transition-all hover:border-slate-300 disabled:opacity-60"
            >
              {googleLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              )}
              <span>Entrar com o Google</span>
            </button>

            <button
              onClick={() => {
                setShowForm(true);
                setIsLogin(false);
              }}
              id="btn-go-signup"
              className="py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-2xl shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              Criar Conta com E-mail
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setShowForm(true);
                setIsLogin(true);
              }}
              id="btn-go-login"
              className="py-2.5 px-4 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl cursor-pointer transition-all"
            >
              Já tenho conta (Entrar)
            </button>

            <div className="flex items-center gap-2 w-full my-1">
              <span className="h-[1px] bg-slate-100 flex-1"></span>
              <span className="text-[10px] text-slate-300 font-mono tracking-widest leading-none">OU</span>
              <span className="h-[1px] bg-slate-100 flex-1"></span>
            </div>

            <button
              onClick={handleGuestLogin}
              id="btn-go-guest"
              className="py-2.5 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-500 font-semibold text-xs rounded-xl cursor-pointer transition-all"
            >
              Testar como Convidado
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="mb-6">
            <h3 className="font-extrabold text-lg text-slate-800 tracking-tight">
              {isLogin ? 'Entrar na Conta' : 'Criar Conta de Membro'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {isLogin ? 'Acesse seu histórico e revisões na nuvem' : 'Cadastre-se para sincronizar seu progresso no Firebase'}
            </p>
          </div>

          {/* Google Quick Button at top of form */}
          <div className="mb-4">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading || loading}
              id="btn-google-login-form"
              className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 shadow-2xs flex items-center justify-center gap-2.5 cursor-pointer transition-all hover:border-slate-300 disabled:opacity-60"
            >
              {googleLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              )}
              <span>Continuar com o Google</span>
            </button>

            <div className="flex items-center gap-2 w-full my-4">
              <span className="h-[1px] bg-slate-100 flex-1"></span>
              <span className="text-[10px] text-slate-300 font-mono tracking-widest leading-none">OU COM E-MAIL</span>
              <span className="h-[1px] bg-slate-100 flex-1"></span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl border border-red-100 leading-relaxed font-medium">
                {error}
              </div>
            )}
            {success && (
              <div className="p-3 bg-emerald-50 text-emerald-700 text-xs rounded-xl border border-emerald-100 leading-relaxed font-medium">
                {success}
              </div>
            )}

            {!isLogin && (
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Seu Nome</label>
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    required
                    placeholder="Ex: João Silva"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl text-xs sm:text-sm transition-all focus:outline-none placeholder-slate-400"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="email"
                  required
                  placeholder="Ex: seuemail@provedor.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl text-xs sm:text-sm transition-all focus:outline-none placeholder-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Senha (Mínimo 6 caracteres)</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="Sua senha secreta"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl text-xs sm:text-sm transition-all focus:outline-none placeholder-slate-400"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading || googleLoading}
                id="btn-auth-submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all cursor-pointer shadow-sm flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                <span>{isLogin ? 'Entrar' : 'Cadastrar e Salvar na Nuvem'}</span>
              </button>
            </div>
          </form>

          <div className="mt-4 flex justify-between items-center text-xs text-slate-500 pt-2 border-t border-slate-100">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setSuccess('');
              }}
              className="text-blue-600 font-bold hover:underline cursor-pointer"
            >
              {isLogin ? 'Não tem conta? Crie uma!' : 'Já tem conta? Entrar'}
            </button>
            <button
              onClick={handleGuestLogin}
              className="text-slate-400 hover:text-slate-600 font-medium cursor-pointer"
            >
              Entrar como convidado
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
