'use client'

import { useRouter } from 'next/navigation'
import SignIn from '@/components/SignIn'
import { authAPI } from '@/services/api'

export default function FarmerLogin() {
  const router = useRouter()

  const handleSubmit = async (formData) => {
    try {
      const response = await authAPI.login({
        email: formData.email,
        password: formData.password,
        userType: 'farmer',
      })

      if (response.success) {
        // JWT tokens are automatically stored by authAPI.login
        // Store user data for quick access (optional)
        localStorage.setItem('userData', JSON.stringify(response.data))
        localStorage.setItem('userType', 'farmer')

        // Redirect to farmer dashboard
        router.push('/farmer-dashboard')
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
        userType: 'farmer',
        fullName: signUpData.fullName,
        phone: signUpData.phone,
        nic: signUpData.nic,
        address: signUpData.address,
      })

      if (response.success) {
        alert('Registration successful! Please sign in with your credentials.')
        // Switch to sign in tab or redirect
        window.location.reload()
      }
    } catch (error) {
      alert(error.message || 'Registration failed. Please try again.')
    }
  }

  return (
    <SignIn
      title="Sign In as a Farmer"
      imageSrc="/images/login/farmer1.png"
      imageAlt="Farmer with farming tools"
      showSignUp={true}
      userType="farmer"
      onSubmit={handleSubmit}
      onSignUp={handleSignUp}
    />
  )
}

