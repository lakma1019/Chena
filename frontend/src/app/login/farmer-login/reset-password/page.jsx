'use client'

import { useRouter } from 'next/navigation'
import ResetPassword from '@/components/ResetPassword'
import { authAPI } from '@/services/api'

export default function FarmerResetPassword() {
  const router = useRouter()

  const handleSubmit = async (formData) => {
    try {
      const response = await authAPI.resetPassword({
        email: formData.email,
        nic: formData.nic,
        newPassword: formData.newPassword,
        userType: 'farmer',
      })

      if (response.success) {
        alert('Password reset successfully! You can now login with your new password.')
        router.push('/login/farmer-login')
      }
    } catch (error) {
      alert(error.message || 'Failed to reset password. Please check your email and NIC.')
    }
  }

  return (
    <ResetPassword
      title="Reset Farmer Password"
      imageSrc="/images/login/farmer1.png"
      imageAlt="Farmer"
      userType="farmer"
      onSubmit={handleSubmit}
    />
  )
}

