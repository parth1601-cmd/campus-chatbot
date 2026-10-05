import React, { useState } from 'react';
import { Lock, ArrowRight, ShieldCheck, AlertCircle, Loader2, KeyRound } from 'lucide-react';
import { RoleMode } from '../types';
import { ASSETS } from '../data/zanzeeData';
import { KJCLogo } from './KJCLogo';

interface AuthScreenProps {
  onAuthenticated: (role: RoleMode) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthenticated }) => {
  const [email, setEmail] = useState('ppimplapure@kjit.edu.in');
  const [password, setPassword] = useState('••••••••••••');
  const [rememberMe, setRememberMe] = useState(true);
  const [portalMode, setPortalMode] = useState<'student' | 'admin'>('student');
  const [selectedRole, setSelectedRole] = useState<RoleMode>('student');
  const [authState, setAuthState] = useState<
    'idle' | 'loading' | 'invalid_password' | 'account_locked' | 'sso_redirect' | 'forgot_sent' | 'register_mode'
  >('idle');

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setAuthState('invalid_password');
      return;
    }
    setAuthState('loading');
    setTimeout(() => {
      onAuthenticated(selectedRole);
    }, 650);
  };

  const handleSSO = () => {
    setAuthState('sso_redirect');
    setTimeout(() => {
      onAuthenticated(selectedRole);
    }, 900);
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#1C1917] flex flex-col justify-between">
      {/* Editorial Broadsheet Masthead */}
      <header className="border-b border-stone-300 bg-white px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <KJCLogo variant="horizontal" size="sm" />
          <div className="text-xs font-mono text-stone-600 tabular-nums text-right">
            <div>THE KRISTU CHRONICLE · VOL. CXIV</div>
            <div className="text-[10px] text-stone-500">UNIVERSITY IDENTITY GATEWAY</div>
          </div>
        </div>
      </header>

      {/* Main Two-Column Broadsheet Authentication Layout */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
        {/* Left Column: Editorial Lead Feature */}
        <div className="lg:col-span-7 space-y-6 border-b lg:border-b-0 lg:border-r border-stone-300 pb-8 lg:pb-0 lg:pr-10">
          <div className="text-xs font-mono uppercase tracking-widest text-[#1E3A8A] font-bold">
            THE KRISTU CHRONICLE · ENTERPRISE AI EDITION
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-stone-900 leading-tight">
            Your entire university, powered by verified intelligence.
          </h1>
          <p className="text-base text-stone-700 leading-relaxed max-w-2xl">
            <span className="float-left font-serif text-5xl font-bold text-stone-900 mr-3 mt-1 leading-none">
              W
            </span>
            elcome to Kristu Jayanti Institute of Technology’s unified student portal, learning management system, Socratic AI tutor, and administrative dispatch. Grounded directly in the University Registrar, Course LMS, Financial Aid Bursar, and Central Library Archives.
          </p>

          <div className="relative overflow-hidden border border-stone-300 bg-stone-100">
            <img
              src={ASSETS.campusQuad}
              alt="Kristu Jayanti Institute of Technology Campus in Autumn Morning Light"
              referrerPolicy="no-referrer"
              className="w-full h-48 sm:h-64 object-cover"
            />
            <div className="p-3 bg-white border-t border-stone-200 text-xs font-serif italic text-stone-600">
              Fig. 1 — Morning light across the Kristu Jayanti Institute of Technology Campus and Turing Hall. All academic services synchronized via CampusAI RAG Index.
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-2 border-t border-stone-300 text-xs text-stone-600">
            <div>
              <div className="font-mono font-semibold text-stone-900 text-sm tabular-nums">100% Grounded</div>
              <div>Official KJIT Syllabi & Handbook</div>
            </div>
            <div>
              <div className="font-mono font-semibold text-stone-900 text-sm tabular-nums">Socratic Tutor</div>
              <div>CS 201 · MATH 210 · BIO 101 · ENG 105</div>
            </div>
            <div>
              <div className="font-mono font-semibold text-stone-900 text-sm tabular-nums">FERPA & WCAG AA</div>
              <div>Institutional Privacy Verified</div>
            </div>
          </div>
        </div>

        {/* Right Column: Login & Realistic State Simulator */}
        <div className="lg:col-span-5 bg-white border border-stone-300 p-5 sm:p-8 space-y-6 min-w-0">
          <div className="border-b border-stone-200 pb-4">
            <div className="text-xs font-mono text-stone-500">KRISTU JAYANTI CENTRAL AUTHENTICATION</div>
            <h2 className="font-serif text-3xl font-semibold text-stone-900 mt-1">
              {authState === 'register_mode' ? 'Create university account' : 'Welcome back'}
            </h2>
            <p className="text-sm text-stone-600 mt-1">
              Sign in with your Kristu Jayanti Institute of Technology credentials or institutional SSO.
            </p>
          </div>

          {/* Portal Gateway Selector: Student Portal vs Admin Login */}
          <div>
            <label className="block text-xs font-mono text-stone-600 mb-2">
              SELECT PORTAL GATEWAY
            </label>
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-stone-100 border border-stone-200">
              <button
                type="button"
                onClick={() => {
                  setPortalMode('student');
                  setSelectedRole('student');
                  setEmail('ppimplapure@kjit.edu.in');
                }}
                className={`py-2 px-3 text-xs font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                  portalMode === 'student'
                    ? 'bg-[#1E3A8A] text-white shadow-sm'
                    : 'text-stone-700 hover:text-stone-900 bg-white'
                }`}
              >
                Student Portal
              </button>
              <button
                type="button"
                onClick={() => {
                  setPortalMode('admin');
                  setSelectedRole('admin');
                  setEmail('provost.office@kjit.edu.in');
                }}
                className={`py-2 px-3 text-xs font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                  portalMode === 'admin'
                    ? 'bg-[#141210] text-white shadow-sm'
                    : 'text-stone-700 hover:text-stone-900 bg-white'
                }`}
              >
                Admin Login
              </button>
            </div>

            {/* When Admin Login is selected, provide the Faculty Edition option right here! */}
            {portalMode === 'admin' && (
              <div className="mt-2.5 p-3 bg-[#FAF8F5] border border-stone-300 space-y-2 animate-fadeIn">
                <div className="text-[10px] font-mono text-stone-600 font-bold uppercase tracking-wider flex items-center justify-between">
                  <span>Admin Edition:</span>
                  <span className="text-[#1E3A8A] font-semibold">
                    {selectedRole === 'faculty' ? 'Faculty Edition Active' : 'Executive Console Active'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRole('admin');
                      setEmail('provost.office@kjit.edu.in');
                    }}
                    className={`py-1.5 px-2 text-[11px] font-mono font-bold uppercase transition-colors cursor-pointer border ${
                      selectedRole === 'admin'
                        ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]'
                        : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
                    }`}
                  >
                    Executive Admin
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRole('faculty');
                      setEmail('sjohnson@kjit.edu.in');
                    }}
                    className={`py-1.5 px-2 text-[11px] font-mono font-bold uppercase transition-colors cursor-pointer border ${
                      selectedRole === 'faculty'
                        ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]'
                        : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
                    }`}
                  >
                    👨‍🏫 Faculty Edition
                  </button>
                </div>
                <div className="text-[10px] text-stone-500 italic">
                  {selectedRole === 'faculty'
                    ? 'Entering Faculty Edition & Teacher Study Console with faculty governance credentials.'
                    : 'Entering Executive Governance, Observability & Chronicle Administration.'}
                </div>
              </div>
            )}
          </div>

          {/* Interactive Authentication State Banners */}
          {authState === 'invalid_password' && (
            <div className="p-3 bg-red-50 border border-red-300 text-xs text-red-900 flex items-start gap-2.5" role="alert">
              <AlertCircle className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold">Incorrect password</div>
                <div>The password entered does not match Kristu Jayanti Directory record #26MCAD30 (Parth Pimplapure, MCA · Division D). 2 attempts remaining before temporary lock.</div>
              </div>
            </div>
          )}

          {authState === 'account_locked' && (
            <div className="p-3 bg-amber-50 border border-amber-300 text-xs text-amber-950 flex items-start gap-2.5" role="alert">
              <Lock className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold">Account temporarily locked</div>
                <div>Multiple failed sign-in attempts detected. Please verify via Kristu Jayanti Okta MFA or contact the IT Help Desk (Ext. 4357).</div>
              </div>
            </div>
          )}

          {authState === 'sso_redirect' && (
            <div className="p-3 bg-blue-50 border border-blue-200 text-xs text-[#1E3A8A] flex items-center gap-2.5" role="status">
              <Loader2 className="w-4 h-4 animate-spin shrink-0" />
              <div>
                <div className="font-semibold">Redirecting to Kristu Jayanti Institute of Technology SAML 2.0 SSO...</div>
                <div>Verifying institutional certificate & hardware token...</div>
              </div>
            </div>
          )}

          {authState === 'forgot_sent' && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 text-xs text-emerald-900 flex items-start gap-2.5" role="status">
              <KeyRound className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold">Password reset dispatch sent</div>
                <div>Check {email} for a one-time Kristu Jayanti Identity verification link.</div>
              </div>
            </div>
          )}

          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label htmlFor="auth-email" className="block text-xs font-medium text-stone-800 mb-1">
                University email
              </label>
              <input
                id="auth-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-[#FBF9F5] border border-stone-300 focus:border-[#1E3A8A] focus:outline-none"
                placeholder="ppimplapure@kjit.edu.in"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="auth-password" className="block text-xs font-medium text-stone-800">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setAuthState('forgot_sent')}
                  className="text-xs text-[#1E3A8A] hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <input
                id="auth-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-[#FBF9F5] border border-stone-300 focus:border-[#1E3A8A] focus:outline-none"
                required
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <label className="flex items-center gap-2 text-stone-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="accent-[#1E3A8A]"
                />
                <span>Remember me for 30 days</span>
              </label>
              <button
                type="button"
                onClick={() =>
                  setAuthState(authState === 'register_mode' ? 'idle' : 'register_mode')
                }
                className="text-[#1E3A8A] hover:underline font-medium"
              >
                {authState === 'register_mode' ? 'Back to sign in' : 'Create account'}
              </button>
            </div>

            <button
              type="submit"
              disabled={authState === 'loading' || authState === 'sso_redirect'}
              className="w-full py-2.5 px-4 bg-[#1E3A8A] hover:bg-blue-950 text-white text-sm font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-60"
            >
              {authState === 'loading' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating with Kristu Jayanti Directory...</span>
                </>
              ) : (
                <>
                  <span>{authState === 'register_mode' ? 'Create University Account' : 'Sign in'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-stone-200"></div>
            <span className="flex-shrink mx-3 text-xs text-stone-500 font-mono">OR INSTITUTIONAL FEDERATION</span>
            <div className="flex-grow border-t border-stone-200"></div>
          </div>

          <button
            type="button"
            onClick={handleSSO}
            className="w-full py-2.5 px-4 bg-[#FBF9F5] hover:bg-stone-100 text-stone-900 border border-stone-300 text-sm font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-[#1E3A8A]" />
            <span>Continue with University SSO</span>
          </button>

          {/* Realistic Auth State Simulator Controls */}
          <div className="pt-4 border-t border-stone-200">
            <div className="text-xs font-mono text-stone-500 mb-2">
              TEST AUTHENTICATION STATES:
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setAuthState('invalid_password')}
                className="px-2.5 py-1 text-xs border border-stone-300 text-stone-700 hover:bg-stone-100 whitespace-nowrap"
              >
                Simulate Incorrect Password
              </button>
              <button
                type="button"
                onClick={() => setAuthState('account_locked')}
                className="px-2.5 py-1 text-xs border border-stone-300 text-stone-700 hover:bg-stone-100 whitespace-nowrap"
              >
                Simulate Account Locked
              </button>
              <button
                type="button"
                onClick={handleSSO}
                className="px-2.5 py-1 text-xs border border-stone-300 text-stone-700 hover:bg-stone-100 whitespace-nowrap"
              >
                Simulate SSO Redirect
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-stone-300 bg-white px-6 py-4 text-xs text-stone-600">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>© 2026 Kristu Jayanti Institute of Technology. All rights reserved.</div>
          <div>Protected by SAML 2.0 · FERPA Compliant · WCAG 2.2 AA Accessible</div>
        </div>
      </footer>
    </div>
  );
};
