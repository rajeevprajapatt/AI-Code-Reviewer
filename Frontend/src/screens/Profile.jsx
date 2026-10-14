import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Check, LoaderCircle, Mail, Save, UserRound } from 'lucide-react'
import axios from '../config/AxiosInstance'
import { UserContext } from '../context/userContext'
import Navbar from '../components/Navbar'
import { Button, Card, Input, Label } from '../components/UIcomponents'

const Profile = () => {
  const navigate = useNavigate()
  const { user, setUser } = useContext(UserContext)
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
      const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authResponse = await axios.get("/user/auth/me");
        if (!authResponse.data.user) {
          navigate("/login");
          return;
        }
        if (authResponse.data.user) {
          setIsLogin(true);
        } else {
          setIsLogin(false);
        }
      }
      catch (error) {
        if (error.code === "ERR_CANCELED") return;

        if (error.response?.status === 401) {
          navigate("/login");
          return;
        }

        console.error("Failed to load data:", error);
      }
    };
    checkAuth();

    let isMounted = true

    const loadProfile = async () => {
      try {
        const response = await axios.get('/user/profile')
        if (!isMounted) return

        const profile = response.data.user
        setName(profile.name || '')
        setEmail(profile.email || '')
        setUser(profile)
        // localStorage.setItem('user', JSON.stringify(profile))
      } catch (requestError) {
        if (isMounted) {
          setError(requestError.response?.data?.msg || 'Unable to load your profile. Please try again.')
        }
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    loadProfile()

    return () => {
      isMounted = false
    }
  }, [navigate, setUser])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    const trimmedName = name.trim()
    if (!trimmedName) {
      setError('Please enter your name.')
      return
    }

    setIsSaving(true)
    try {
      const response = await axios.patch('/user/profile', { name: trimmedName })
      const updatedUser = response.data.user

      setName(updatedUser.name)
      setEmail(updatedUser.email)
      setUser(updatedUser)
      // localStorage.setItem('user', JSON.stringify(updatedUser))
      setSuccess('Your profile has been updated.')
    } catch (requestError) {
      setError(requestError.response?.data?.msg || 'Unable to save your changes. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const initials = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('') || 'U'

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar isLogin={isLogin} setIsLogin={setIsLogin} />
      <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:py-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">Account</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Your profile</h1>
          <p className="mt-2 text-slate-500">Manage your personal details and account information.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <Card className="h-fit overflow-hidden">
            <div className="h-24 bg-linear-to-r from-blue-600 to-indigo-500" />
            <div className="px-6 pb-6">
              <div className="-mt-10 flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-white bg-blue-50 text-2xl font-bold text-blue-700 shadow-sm">
                {initials}
              </div>
              <h2 className="mt-4 wrap-break-word text-xl font-semibold text-slate-900">{name || 'Your name'}</h2>
              <p className="mt-1 break-all text-sm text-slate-500">{email || 'Email address'}</p>
              <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700">
                <Check className="h-3.5 w-3.5" />
                Active account
              </div>
            </div>
          </Card>

          <Card className="p-6 sm:p-8">
            <div className="mb-7 border-b border-slate-100 pb-5">
              <h2 className="text-lg font-semibold text-slate-900">Personal information</h2>
              <p className="mt-1 text-sm text-slate-500">Your email address is kept read-only.</p>
            </div>

            {error && (
              <div role="alert" className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}
            {success && (
              <div role="status" className="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="profile-name">Full name</Label>
                <div className="relative">
                  <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="profile-name"
                    autoComplete="name"
                    className="pl-10"
                    value={name}
                    onChange={(event) => {
                      setName(event.target.value)
                      setSuccess('')
                    }}
                    disabled={isLoading || isSaving}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="profile-email">Email address</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="profile-email"
                    type="email"
                    className="bg-slate-50 pl-10 text-slate-500"
                    value={email}
                    disabled
                    readOnly
                  />
                </div>
                <p className="text-xs text-slate-500">Email addresses cannot be changed from your profile.</p>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full sm:w-auto cursor-pointer"
                  onClick={() => {
                    setName(user?.name || '')
                    setError('')
                    setSuccess('')
                  }}
                  disabled={isLoading || isSaving}
                >
                  Reset
                </Button>
                <Button
                  type="submit"
                  className="w-full gap-2 bg-blue-600 text-white hover:bg-blue-700 sm:w-auto cursor-pointer"
                  disabled={isLoading || isSaving}
                >
                  {isSaving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  {isSaving ? 'Saving...' : 'Save changes'}
                </Button>
              </div>
            </form>

            {isLoading && (
              <div className="mt-4 flex items-center gap-2 text-sm text-slate-500" role="status">
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Loading profile...
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  )
}

export default Profile
