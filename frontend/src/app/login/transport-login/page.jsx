'use client'

import { useRouter } from 'next/navigation'
import SignIn from '@/components/SignIn'
import { authAPI } from '@/services/api'

export default function TransportLogin() {
  const router = useRouter()

  const handleSubmit = async (formData) => {
    try {
      const response = await authAPI.login({
        email: formData.email,
        password: formData.password,
        userType: 'transport',
      })

      if (response.success) {
        // JWT tokens are automatically stored by authAPI.login
        // Store user data for quick access (optional)
        localStorage.setItem('userData', JSON.stringify(response.data))
        localStorage.setItem('userType', 'transport')

        // Redirect to transport dashboard
        router.push('/transport-dashboard')
      }
    } catch (error) {
      alert(error.message || 'Invalid email or password. Please try again.')
    }
  }

  const handleSignUp = async (signUpData) => {
    try {
      const response = await authAPI.signup({
        email: signUpData.email,
        password: signUpData.password,
        userType: 'transport',
        fullName: signUpData.fullName,
        phone: signUpData.phone,
        nic: signUpData.nic,
        address: signUpData.address,
      })

      if (response.success) {
        alert('Registration successful! Please sign in with your credentials.')
        window.location.reload()
      }
    } catch (error) {
      alert(error.message || 'Registration failed. Please try again.')
    }
  }

  return (
    <SignIn
      title="Sign In as a Transport Provider"
      imageSrc="/images/login/login separatly/tp2.jpg"
      imageAlt="Transport provider with vehicle"
      showSignUp={true}
      userType="transport"
      onSubmit={handleSubmit}
      onSignUp={handleSignUp}
    />
  )
}

