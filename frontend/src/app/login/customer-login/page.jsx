'use client'

import SignIn from '@/components/SignIn'

export default function CustomerLogin() {
  const handleSubmit = (formData) => {
    // TODO: Implement customer login logic
    console.log('Customer login:', formData)
  }

  const handleSignUp = (signUpData) => {
    // TODO: Implement customer sign up logic
    console.log('Customer sign up:', signUpData)
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

