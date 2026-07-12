'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/client'
import { useRouter } from 'next/navigation'

export default function AdminPanel() {
  const [users, setUsers] = useState<any[]>([])
  const [subscriptions, setSubscriptions] = useState<any[]>([])
  const [settings, setSettings] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [showAddUser, setShowAddUser] = useState(false)
  const [showAddClinic, setShowAddClinic] = useState(false)
  const [editingUser, setEditingUser] = useState<any>(null)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    role: 'receptionist',
    clinic_id: ''
  })
  const [clinicFormData, setClinicFormData] = useState({
    name: '',
    subscription_plan: 'free',
    subscription_expires_at: '',
    is_active: true
  })
  const [notification, setNotification] = useState<{type: 'success' | 'error' | 'info', message: string} | null>(null)
  
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    checkAdminAndLoadData()
  }, [])

  // Auto-dismiss notifications after 5 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [notification])

  async function checkAdminAndLoadData() {
    setLoading(true)
    
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      router.push('/login')
      return
    }

    const { data: currentUser } = await supabase
      .from('users')
      .select('role')
      .eq('email', session.user.email)
      .single()

    if (currentUser?.role !== 'owner') {
      router.push('/protected/dashboard/reception')
      return
    }

    setIsAdmin(true)
    await loadData()
  }

  async function loadData() {
    setLoading(true)
    
    const { data: usersData } = await supabase
      .from('users')
      .select('*, clinics(name)')
      .order('created_at', { ascending: false })

    setUsers(usersData || [])

    const { data: settingsData } = await supabase
      .from('system_settings')
      .select('*')
      .single()

    setSettings(settingsData || {})

    const { data: subsData } = await supabase
      .from('clinics')
      .select('*')
      .order('created_at', { ascending: false })

    setSubscriptions(subsData || [])
    setLoading(false)
  }

  // CONFIRM USER FUNCTION - Updates both users table AND auth system
  async function handleConfirmUser(userId: string, email: string) {
    if (!confirm(`Confirm email for "${email}"? The user will be able to log in immediately.`)) return

    setLoading(true)
    try {
      // Step 1: Update users table
      const { error: userError } = await supabase
        .from('users')
        .update({ 
          confirmed_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (userError) throw userError

      // Step 2: Update auth system via API
      const response = await fetch('/api/admin/confirm-auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to confirm user in auth system')
      }

      setNotification({
        type: 'success',
        message: `✅ Email confirmed for ${email}! User can now log in.`
      })
      
      // Reload users to update the list
      await loadData()
    } catch (error: any) {
      console.error('Error confirming user:', error)
      setNotification({
        type: 'error',
        message: 'Error confirming user: ' + error.message
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleAddClinic(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: clinicData, error: clinicError } = await supabase
        .from('clinics')
        .insert({
          name: clinicFormData.name,
          subscription_plan: clinicFormData.subscription_plan,
          subscription_expires_at: clinicFormData.subscription_expires_at || null,
          is_active: clinicFormData.is_active
        })
        .select()
        .single()

      if (clinicError) throw clinicError

      const { error: settingsError } = await supabase
        .from('clinic_settings')
        .insert({
          clinic_id: clinicData.id,
          timezone: 'UTC',
          currency: 'USD',
          date_format: 'MM/DD/YYYY',
          time_format: '12h'
        })

      if (settingsError) throw settingsError

      setNotification({
        type: 'success',
        message: `✓ Clinic "${clinicFormData.name}" created successfully!`
      })
      setShowAddClinic(false)
      setClinicFormData({
        name: '',
        subscription_plan: 'free',
        subscription_expires_at: '',
        is_active: true
      })
      await loadData()
    } catch (error: any) {
      console.error('Error adding clinic:', error)
      setNotification({
        type: 'error',
        message: 'Error: ' + error.message
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleAddUser(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('email')
        .eq('email', formData.email)
        .single()

      if (existingUser) {
        throw new Error('User with this email already exists')
      }

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.first_name,
            last_name: formData.last_name,
            role: formData.role
          }
        }
      })

      if (authError) {
        if (authError.message.includes('User already registered')) {
          throw new Error('This email is already registered. Please use a different email.')
        }
        throw authError
      }

      if (authData.user) {
        // Create the user profile - confirmed_at is NULL (pending)
        const { error: userError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            email: formData.email,
            first_name: formData.first_name,
            last_name: formData.last_name,
            role: formData.role,
            clinic_id: formData.clinic_id || null,
            confirmed_at: null // User starts as unconfirmed
          })

        if (userError) {
          console.error('Error creating user profile:', userError)
          throw new Error('Failed to create user profile. Please try again.')
        }

        setNotification({
          type: 'info',
          message: `✓ User created! Please manually confirm their email in the admin panel before they can log in.`
        })

        setShowAddUser(false)
        setFormData({
          email: '',
          password: '',
          first_name: '',
          last_name: '',
          role: 'receptionist',
          clinic_id: ''
        })
        await loadData()
      }
    } catch (error: any) {
      console.error('Error adding user:', error)
      setNotification({
        type: 'error',
        message: error.message || 'Error creating user. Please try again.'
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleUpdateUser(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from('users')
        .update({
          first_name: editingUser.first_name,
          last_name: editingUser.last_name,
          role: editingUser.role,
          clinic_id: editingUser.clinic_id
        })
        .eq('id', editingUser.id)

      if (error) throw error

      setNotification({
        type: 'success',
        message: '✓ User updated successfully!'
      })
      setEditingUser(null)
      await loadData()
    } catch (error: any) {
      console.error('Error updating user:', error)
      setNotification({
        type: 'error',
        message: 'Error: ' + error.message
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleDeleteUser(userId: string, userEmail: string) {
    if (!confirm(`Are you sure you want to delete ${userEmail}? This action cannot be undone.`)) return

    setLoading(true)
    try {
      const { error: userError } = await supabase
        .from('users')
        .delete()
        .eq('id', userId)

      if (userError) throw userError

      setNotification({
        type: 'success',
        message: '✓ User deleted successfully!'
      })
      await loadData()
    } catch (error: any) {
      console.error('Error deleting user:', error)
      setNotification({
        type: 'error',
        message: 'Error: ' + error.message
      })
    } finally {
      setLoading(false)
    }
  }

  async function toggleClinicStatus(clinicId: string, currentStatus: boolean) {
    if (!confirm(`Toggle status for this clinic?`)) return
    
    try {
      const { error } = await supabase
        .from('clinics')
        .update({ is_active: !currentStatus })
        .eq('id', clinicId)
      
      if (error) throw error
      
      await loadData()
      setNotification({
        type: 'success',
        message: '✓ Clinic status updated successfully!'
      })
    } catch (error: any) {
      setNotification({
        type: 'error',
        message: 'Error updating clinic status: ' + error.message
      })
    }
  }

  async function deleteClinic(clinicId: string, clinicName: string) {
    if (!confirm(`Are you sure you want to delete "${clinicName}"? This will also delete all associated data. This action cannot be undone!`)) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from('clinics')
        .delete()
        .eq('id', clinicId)

      if (error) throw error

      setNotification({
        type: 'success',
        message: `✓ Clinic "${clinicName}" deleted successfully!`
      })
      await loadData()
    } catch (error: any) {
      console.error('Error deleting clinic:', error)
      setNotification({
        type: 'error',
        message: 'Error: ' + error.message
      })
    } finally {
      setLoading(false)
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch(role) {
      case 'owner': return 'bg-purple-100 text-purple-800'
      case 'doctor': return 'bg-blue-100 text-blue-800'
      case 'receptionist': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleIcon = (role: string) => {
    switch(role) {
      case 'owner': return '👑'
      case 'doctor': return '👨‍⚕️'
      case 'receptionist': return '💁'
      default: return '👤'
    }
  }

  const getPlanBadgeColor = (plan: string) => {
    switch(plan?.toLowerCase()) {
      case 'premium': return 'bg-purple-100 text-purple-800'
      case 'professional': return 'bg-blue-100 text-blue-800'
      case 'basic': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const totalUsers = users.length
  const activeClinics = subscriptions.filter((c: any) => c.is_active === true).length
  const expiringSoon = subscriptions.filter((c: any) => {
    if (!c.subscription_expires_at) return false
    const daysLeft = Math.ceil((new Date(c.subscription_expires_at).getTime() - new Date().getTime()) / (1000 * 3600 * 24))
    return daysLeft <= 7 && daysLeft > 0
  }).length

  if (loading && users.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-500">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Notification */}
        {notification && (
          <div className={`mb-4 p-4 rounded-lg ${
            notification.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' :
            notification.type === 'error' ? 'bg-red-50 border border-red-200 text-red-800' :
            'bg-blue-50 border border-blue-200 text-blue-800'
          }`}>
            <div className="flex items-center justify-between">
              <span>{notification.message}</span>
              <button
                onClick={() => setNotification(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
              <p className="text-gray-500">System Administration Dashboard</p>
            </div>
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => setShowAddClinic(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 shadow-sm"
              >
                <span>🏥</span>
                Add New Clinic
              </button>
              <button
                onClick={() => setShowAddUser(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 shadow-sm"
              >
                <span>➕</span>
                Add New User
              </button>
              <Link 
                href="/protected/admin/monitoring" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 shadow-sm"
              >
                <span>📊</span>
                System Monitoring
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Users</p>
                <p className="text-2xl font-bold">{totalUsers}</p>
              </div>
              <div className="text-2xl text-gray-400">👥</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Clinics</p>
                <p className="text-2xl font-bold">{subscriptions.length}</p>
              </div>
              <div className="text-2xl text-blue-500">🏥</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Clinics</p>
                <p className="text-2xl font-bold">{activeClinics}</p>
              </div>
              <div className="text-2xl text-green-500">✅</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Expiring Soon</p>
                <p className="text-2xl font-bold text-yellow-600">{expiringSoon}</p>
              </div>
              <div className="text-2xl">⚠️</div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
          <div className="px-4 py-3 border-b bg-gray-50 flex justify-between items-center">
            <h2 className="font-semibold text-gray-800">👥 User Management</h2>
            <button
              onClick={() => setShowAddUser(true)}
              className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
            >
              + Add User
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clinic</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-xl">{getRoleIcon(user.role)}</span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.first_name} {user.last_name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {user.clinics?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.confirmed_at ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {user.confirmed_at ? '✅ Confirmed' : '⏳ Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex gap-2">
                        {!user.confirmed_at && user.role !== 'owner' && (
                          <button
                            onClick={() => handleConfirmUser(user.id, user.email)}
                            className="text-green-600 hover:text-green-900 font-medium"
                            title="Confirm Email"
                          >
                            ✅ Confirm
                          </button>
                        )}
                        <button
                          onClick={() => setEditingUser(user)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit User"
                        >
                          ✏️ Edit
                        </button>
                        {user.role !== 'owner' && (
                          <button
                            onClick={() => handleDeleteUser(user.id, user.email)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete User"
                          >
                            🗑️ Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Clinics & Subscriptions Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden mt-6">
          <div className="px-4 py-3 border-b bg-gray-50 flex justify-between items-center">
            <h2 className="font-semibold text-gray-800">🏥 Clinics & Subscriptions</h2>
            <button
              onClick={() => setShowAddClinic(true)}
              className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700"
            >
              + Add Clinic
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Clinic Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plan</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expires</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {subscriptions.map((clinic: any) => {
                  const daysLeft = clinic.subscription_expires_at 
                    ? Math.ceil((new Date(clinic.subscription_expires_at).getTime() - new Date().getTime()) / (1000 * 3600 * 24))
                    : null
                  const isExpiring = daysLeft !== null && daysLeft <= 7 && daysLeft > 0
                  
                  return (
                    <tr key={clinic.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="font-medium text-sm">{clinic.name}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPlanBadgeColor(clinic.subscription_plan)}`}>
                          {clinic.subscription_plan || 'Free'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {clinic.subscription_expires_at 
                          ? new Date(clinic.subscription_expires_at).toLocaleDateString()
                          : 'Never'}
                        {daysLeft !== null && daysLeft > 0 && (
                          <span className={`text-xs ml-2 ${isExpiring ? 'text-yellow-600 font-medium' : 'text-gray-400'}`}>
                            ({daysLeft} days left)
                          </span>
                        )}
                        {daysLeft !== null && daysLeft <= 0 && clinic.subscription_expires_at && (
                          <span className="text-xs ml-2 text-red-600 font-medium">
                            (Expired)
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          clinic.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {clinic.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {new Date(clinic.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => toggleClinicStatus(clinic.id, clinic.is_active)}
                            className={`text-sm font-medium ${clinic.is_active ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'}`}
                          >
                            {clinic.is_active ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            onClick={() => deleteClinic(clinic.id, clinic.name)}
                            className="text-sm font-medium text-red-600 hover:text-red-800"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* System Settings Section */}
        <div className="bg-white rounded-lg shadow overflow-hidden mt-6">
          <div className="px-4 py-3 border-b bg-gray-50">
            <h2 className="font-semibold text-gray-800">⚙️ System Settings</h2>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">System Name</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={settings.system_name || 'Dental Clinic System'}
                  onChange={(e) => setSettings({...settings, system_name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Default Currency</label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={settings.currency || 'USD'}
                  onChange={(e) => setSettings({...settings, currency: e.target.value})}
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="LKR">LKR (Rs)</option>
                </select>
              </div>
              <button
                onClick={async () => {
                  const { error } = await supabase
                    .from('system_settings')
                    .upsert(settings)
                  if (error) {
                    setNotification({
                      type: 'error',
                      message: 'Error saving settings: ' + error.message
                    })
                  } else {
                    setNotification({
                      type: 'success',
                      message: 'Settings saved successfully!'
                    })
                  }
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Clinic Modal */}
      {showAddClinic && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">🏥 Add New Clinic</h2>
            <form onSubmit={handleAddClinic}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Clinic Name *</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border rounded-lg"
                    value={clinicFormData.name}
                    onChange={(e) => setClinicFormData({...clinicFormData, name: e.target.value})}
                    placeholder="e.g., Downtown Dental Clinic"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Subscription Plan</label>
                  <select
                    className="w-full px-3 py-2 border rounded-lg"
                    value={clinicFormData.subscription_plan}
                    onChange={(e) => setClinicFormData({...clinicFormData, subscription_plan: e.target.value})}
                  >
                    <option value="free">Free</option>
                    <option value="basic">Basic</option>
                    <option value="professional">Professional</option>
                    <option value="premium">Premium</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Subscription Expiry Date</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border rounded-lg"
                    value={clinicFormData.subscription_expires_at}
                    onChange={(e) => setClinicFormData({...clinicFormData, subscription_expires_at: e.target.value})}
                  />
                  <p className="text-xs text-gray-500 mt-1">Leave empty for unlimited or trial</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select
                    className="w-full px-3 py-2 border rounded-lg"
                    value={clinicFormData.is_active ? 'active' : 'inactive'}
                    onChange={(e) => setClinicFormData({...clinicFormData, is_active: e.target.value === 'active'})}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Clinic'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddClinic(false)}
                  className="flex-1 bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Add New User</h2>
            <form onSubmit={handleAddUser}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border rounded-lg"
                    value={formData.first_name}
                    onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border rounded-lg"
                    value={formData.last_name}
                    onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    className="w-full px-3 py-2 border rounded-lg"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Password *</label>
                  <input
                    type="password"
                    required
                    className="w-full px-3 py-2 border rounded-lg"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Role *</label>
                  <select
                    required
                    className="w-full px-3 py-2 border rounded-lg"
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                  >
                    <option value="receptionist">Receptionist</option>
                    <option value="doctor">Doctor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Clinic</label>
                  <select
                    className="w-full px-3 py-2 border rounded-lg"
                    value={formData.clinic_id}
                    onChange={(e) => setFormData({...formData, clinic_id: e.target.value})}
                  >
                    <option value="">Select Clinic</option>
                    {subscriptions.map(clinic => (
                      <option key={clinic.id} value={clinic.id}>
                        {clinic.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  {loading ? 'Creating...' : 'Create User'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddUser(false)}
                  className="flex-1 bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Edit User</h2>
            <form onSubmit={handleUpdateUser}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border rounded-lg"
                    value={editingUser.first_name}
                    onChange={(e) => setEditingUser({...editingUser, first_name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border rounded-lg"
                    value={editingUser.last_name}
                    onChange={(e) => setEditingUser({...editingUser, last_name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Role</label>
                  <select
                    className="w-full px-3 py-2 border rounded-lg"
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                  >
                    <option value="receptionist">Receptionist</option>
                    <option value="doctor">Doctor</option>
                    <option value="owner">Owner</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Clinic</label>
                  <select
                    className="w-full px-3 py-2 border rounded-lg"
                    value={editingUser.clinic_id || ''}
                    onChange={(e) => setEditingUser({...editingUser, clinic_id: e.target.value})}
                  >
                    <option value="">Select Clinic</option>
                    {subscriptions.map(clinic => (
                      <option key={clinic.id} value={clinic.id}>
                        {clinic.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  {loading ? 'Updating...' : 'Update User'}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="flex-1 bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}