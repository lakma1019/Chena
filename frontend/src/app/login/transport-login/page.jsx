'use client'

import { useRouter } from 'next/navigation'
import SignIn from '@/components/SignIn'

export default function TransportLogin() {
  const router = useRouter()

  const handleSubmit = (formData) => {
    // Temporary hardcoded credentials (will be replaced with backend authentication)
    const validEmail = 'kamal@transport.com'
    const validPassword = 'Kamal@123'

    if (formData.email === validEmail && formData.password === validPassword) {
      // Store login status in localStorage (temporary solution)
      localStorage.setItem('transportLoggedIn', 'true')
      localStorage.setItem('transportEmail', formData.email)

      // Redirect to transport dashboard
      router.push('/transport-dashboard')
    } else {
      alert('Invalid credentials! Please use:\nEmail: kamal@transport.com\nPassword: Kamal@123')
    }
  }

  const handleSignUp = (signUpData) => {
    // TODO: Implement transport provider sign up logic
    console.log('Transport sign up:', signUpData)
    alert('Sign up functionality will be implemented with backend integration')
  }

  return (
    <SignIn
      title="Sign In as a Transport Provider"
      imageSrc="/images/login/login separatly/tp2.jpg"
      imageAlt="Transport provider with vehicle"
      showSignUp={true}
      onSubmit={handleSubmit}
      onSignUp={handleSignUp}
    />
  )
}

