'use client'

import { useRouter } from 'next/navigation'
import SignIn from '@/components/SignIn'

export default function CustomerLogin() {
  const router = useRouter()

  const handleSubmit = (formData) => {
    // Temporary hardcoded credentials (will be replaced with backend authentication)
    const validEmail = 'rasini@gmail.com'
    const validPassword = 'Rasini@123'

    if (formData.email === validEmail && formData.password === validPassword) {
      // Store login status in localStorage (temporary solution)
      localStorage.setItem('customerLoggedIn', 'true')
      localStorage.setItem('customerEmail', formData.email)

      // Redirect to customer dashboard
      router.push('/customer-dashboard')
    } else {
      alert('Invalid credentials! Please use:\nEmail: rasini@gmail.com\nPassword: Rasini@123')
    }
  }

  const handleSignUp = (signUpData) => {
    // TODO: Implement customer sign up logic
    console.log('Customer sign up:', signUpData)
    alert('Sign up functionality will be implemented with backend integration')
  }

  return (
    <SignIn
      title="Sign In as a Customer"
      imageSrc="/images/login/login separatly/customer2.jpg"
      imageAlt="Customer shopping"
      showSignUp={true}
      onSubmit={handleSubmit}
      onSignUp={handleSignUp}
    />
  )
}

