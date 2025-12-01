'use client'

import { useRouter } from 'next/navigation'
import SignIn from '@/components/SignIn'

export default function FarmerLogin() {
  const router = useRouter()

  const handleSubmit = (formData) => {
    // Temporary hardcoded credentials (will be replaced with backend authentication)
    const validEmail = 'sunil@gmail.com'
    const validPassword = 'sunil@123'

    if (formData.email === validEmail && formData.password === validPassword) {
      // Store login status in localStorage (temporary solution)
      localStorage.setItem('farmerLoggedIn', 'true')
      localStorage.setItem('farmerEmail', formData.email)

      // Redirect to farmer dashboard
      router.push('/farmer-dashboard')
    } else {
      alert('Invalid credentials! Please use:\nEmail: sunil@gmail.com\nPassword: sunil@123')
    }
  }

  return (
    <SignIn
      title="Sign In as a Farmer"
      imageSrc="/images/login/farmer1.png"
      imageAlt="Farmer with farming tools"
      showSignUp={true}
      onSubmit={handleSubmit}
    />
  )
}

