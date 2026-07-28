'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/client'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function HomePage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isMounted, setIsMounted] = useState(false)
  const [warning, setWarning] = useState('')
  
  const [showResetModal, setShowResetModal] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetLoading, setResetLoading] = useState(false)
  const [resetError, setResetError] = useState('')
  const [resetSuccess, setResetSuccess] = useState('')
  
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    setIsMounted(true)
    
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        const { data: userData } = await supabase
          .from('users')
          .select('role')
          .eq('email', session.user.email)
          .maybeSingle()
        
        if (userData?.role === 'owner' || userData?.role === 'admin') {
          router.push('/protected/admin')
        } else if (userData?.role === 'doctor') {
          router.push('/protected/dashboard/doctor')
        } else {
          router.push('/protected/dashboard/reception')
        }
      }
    }
    
    checkSession()
  }, [router, supabase])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setWarning('')

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    await new Promise(resolve => setTimeout(resolve, 1500))

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('email, role, clinic_id, first_name, last_name')
      .eq('email', email)
      .maybeSingle()

    if (userError || !userData) {
      setError('User account not found. Please contact administrator.')
      await supabase.auth.signOut()
      setLoading(false)
      return
    }

    if (!userData.clinic_id) {
      setError('Account not configured. Please contact administrator.')
      await supabase.auth.signOut()
      setLoading(false)
      return
    }

    const { data: clinicData, error: clinicError } = await supabase
      .from('clinics')
      .select('id, name, is_active, is_trial, trial_end_date')
      .eq('id', userData.clinic_id)
      .maybeSingle()

    const isOwnerOrAdmin = userData.role === 'owner' || userData.role === 'admin'
    const isClinicActive = clinicData ? clinicData.is_active === true : false

    if (!isClinicActive && !isOwnerOrAdmin) {
      setError('Your clinic account has been deactivated. Please contact your administrator.')
      await supabase.auth.signOut()
      setLoading(false)
      return
    }

    if (!isClinicActive && isOwnerOrAdmin) {
      setWarning('⚠️ This clinic is currently deactivated. You can access the system but other users cannot.')
    }

    if (clinicData && clinicData.is_trial === true && clinicData.trial_end_date && !isOwnerOrAdmin) {
      const trialEnd = new Date(clinicData.trial_end_date)
      const today = new Date()
      const daysLeft = Math.ceil((trialEnd.getTime() - today.getTime()) / (1000 * 3600 * 24))
      
      if (daysLeft <= 0) {
        setError('Your free trial has expired. Please contact the clinic administrator to upgrade.')
        await supabase.auth.signOut()
        setLoading(false)
        return
      }
      
      if (daysLeft <= 3 && daysLeft > 0) {
        setWarning(`⚠️ Your free trial ends in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}. Please contact the clinic administrator to upgrade.`)
      }
    }

    if (userData.role === 'doctor') {
      router.push('/protected/dashboard/doctor')
    } else if (userData.role === 'owner' || userData.role === 'admin') {
      router.push('/protected/admin')
    } else if (userData.role === 'receptionist') {
      router.push('/protected/dashboard/reception')
    } else {
      router.push('/dashboard')
    }
    
    setLoading(false)
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault()
    setResetLoading(true)
    setResetError('')
    setResetSuccess('')

    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: `${window.location.origin}/update-password`,
    })

    if (error) {
      setResetError(error.message)
    } else {
      setResetSuccess('Password reset instructions sent to your email!')
      setTimeout(() => {
        setShowResetModal(false)
        setResetEmail('')
        setResetSuccess('')
      }, 3000)
    }
    setResetLoading(false)
  }

  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-4xl">🦷</span>
            </div>
            <div className="animate-pulse">
              <h1 className="text-2xl font-bold text-gray-800">Welcome Back</h1>
              <p className="text-gray-500 mt-2">Loading...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 md:p-10 border border-gray-100">
        <div className="text-center mb-8">
          <div className="relative">
            <div className="w-24 h-24 mx-auto mb-4 relative">
              <Image
  src="/logo.png"
  alt="Finest Dental Care"
  width={96}
  height={96}
  className="object-contain rounded-2xl shadow-lg"
  priority
/>
            </div>
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-2xl opacity-20 blur-lg -z-10"></div>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-800">
            Smile Sync
          </h1>
          <p className="text-sm text-gray-500 mt-1">Dental Clinic Management System</p>
          <div className="mt-4 h-0.5 w-12 bg-gradient-to-r from-blue-400 to-indigo-400 mx-auto rounded-full"></div>
          <p className="text-gray-600 mt-4 text-sm font-medium">Sign in to your account</p>
        </div>

        {warning && (
          <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-xl animate-shake">
            <div className="flex items-start gap-3">
              <span className="text-xl">⚠️</span>
              <div>
                <p className="text-sm font-medium text-amber-800">{warning}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-gray-700">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400 text-lg">📧</span>
              </div>
              <input
                type="email"
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 hover:bg-white"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-semibold text-gray-700">
                Password
              </label>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400 text-lg">🔒</span>
              </div>
              <input
                type="password"
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 hover:bg-white"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="text-right mt-1">
              <button
                type="button"
                onClick={() => setShowResetModal(true)}
                className="text-xs text-blue-600 hover:text-blue-700 hover:underline transition font-medium"
              >
                Forgot Password?
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 animate-shake">
              <div className="flex items-start gap-3">
                <span className="text-xl">❌</span>
                <div>
                  <p className="text-sm font-medium text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>

          <div className="text-center pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400">
              Secure login • Protected by SSL encryption
            </p>
          </div>
        </form>
      </div>

      {showResetModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-fadeIn">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-4xl">🔐</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Reset Password</h2>
              <p className="text-gray-500 mt-2 text-sm">
                Enter your email address and we'll send you instructions to reset your password.
              </p>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400">📧</span>
                  </div>
                  <input
                    type="email"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="Enter your email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                  />
                </div>
              </div>

              {resetError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                  <div className="flex items-start gap-2">
                    <span>❌</span>
                    <p className="text-sm text-red-800">{resetError}</p>
                  </div>
                </div>
              )}

              {resetSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-3 animate-fadeIn">
                  <div className="flex items-start gap-2">
                    <span>✅</span>
                    <p className="text-sm text-green-800">{resetSuccess}</p>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button 
                  type="submit" 
                  disabled={resetLoading} 
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition font-medium shadow-lg shadow-blue-500/25 disabled:opacity-50"
                >
                  {resetLoading ? 'Sending...' : 'Send Instructions'}
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    setShowResetModal(false)
                    setResetError('')
                    setResetSuccess('')
                    setResetEmail('')
                  }} 
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl transition font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}