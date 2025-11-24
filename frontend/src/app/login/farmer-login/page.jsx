'use client'

import SignIn from '@/components/SignIn'

export default function FarmerLogin() {
  const handleSubmit = (formData) => {
    // TODO: Implement farmer login logic
    console.log('Farmer login:', formData)
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

