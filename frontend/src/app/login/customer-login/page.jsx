'use client'

import { useRouter } from 'next/navigation'
import SignIn from '@/components/SignIn'
import { authAPI } from '@/services/api'
import { showAlert } from '@/utils/notifications'

export default function CustomerLogin() {
  const router = useRouter()

  const handleSubmit = async (formData) => {
    try {
      const response = await authAPI.login({
        email: formData.email,
        password: formData.password,
        userType: 'customer',
      })

      if (response.success) {
        // JWT tokens are automatically stored by authAPI.login
        // Store user data for quick access (optional)
        localStorage.setItem('userData', JSON.stringify(response.data))
        localStorage.setItem('userType', 'customer')

        // Redirect to customer dashboard
        router.push('/customer-dashboard')
      }
    } catch (error) {
      await showAlert(error.message || 'Invalid email or password. Please try again.', 'error')
    }
  }

  const handleSignUp = async (signUpData) => {
    try {
      const response = await authAPI.signup({
        email: signUpData.email,
        password: signUpData.password,
        userType: 'customer',
        fullName: signUpData.fullName,
        phone: signUpData.phone,
        nic: signUpData.nic,
        address: signUpData.address,
      })

      if (response.success) {
        await showAlert('Registration successful! Please sign in with your credentials.', 'success')
        window.location.reload()
      }
    } catch (error) {
      await showAlert(error.message || 'Registration failed. Please try again.', 'error')
    }
  }

  return (
    <SignIn
      title="Sign In as a Customer"
      imageSrc="/images/login/login separatly/customer2.jpg"
      imageAlt="Customer shopping"
      showSignUp={true}
      userType="customer"
      onSubmit={handleSubmit}
      onSignUp={handleSignUp}
    />
  )
}

