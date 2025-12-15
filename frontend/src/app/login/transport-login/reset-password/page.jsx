'use client'

import { useRouter } from 'next/navigation'
import ResetPassword from '@/components/ResetPassword'
import { authAPI } from '@/services/api'
import { showAlert } from '@/utils/notifications'

export default function TransportResetPassword() {
  const router = useRouter()

  const handleSubmit = async (formData) => {
    try {
      const response = await authAPI.resetPassword({
        email: formData.email,
        nic: formData.nic,
        newPassword: formData.newPassword,
        userType: 'transport',
      })

      if (response.success) {
        await showAlert('Password reset successfully! You can now login with your new password.', 'success')
        router.push('/login/transport-login')
      }
    } catch (error) {
      await showAlert(error.message || 'Failed to reset password. Please check your email and NIC.', 'error')
    }
  }

  return (
    <ResetPassword
      title="Reset Transport Provider Password"
      imageSrc="/images/login/login separatly/tp2.jpg"
      imageAlt="Transport Provider"
      userType="transport"
      onSubmit={handleSubmit}
    />
  )
}

