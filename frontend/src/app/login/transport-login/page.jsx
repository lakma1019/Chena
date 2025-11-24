'use client'

import SignIn from '@/components/SignIn'

export default function TransportLogin() {
  const handleSubmit = (formData) => {
    // TODO: Implement transport provider login logic
    console.log('Transport login:', formData)
  }

  const handleSignUp = (signUpData) => {
    // TODO: Implement transport provider sign up logic
    console.log('Transport sign up:', signUpData)
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

