import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Modal from '../../components/common/Modal.jsx'
import Button from '../../components/common/Button.jsx'
import Input from '../../components/common/Input.jsx'
import { changePassword } from '../../services/authService.js'

export default function ChangePasswordModal({ isOpen, onClose }) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm()

  const newPassword = watch('newPassword')

  const handleClose = () => {
    reset()
    onClose()
  }

  const onSubmit = async (values) => {
    try {
      await changePassword(values.currentPassword, values.newPassword)
      toast.success('Password changed successfully')
      handleClose()
    } catch (err) {
      toast.error(err.message || 'Failed to change password')
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Change Password"
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button loading={isSubmitting} onClick={handleSubmit(onSubmit)}>
            Update Password
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Input
          label="Current Password"
          type="password"
          placeholder="Enter current password"
          required
          autoComplete="current-password"
          {...register('currentPassword', { required: 'Current password is required' })}
          error={errors.currentPassword?.message}
        />
        <Input
          label="New Password"
          type="password"
          placeholder="Minimum 8 characters"
          required
          autoComplete="new-password"
          {...register('newPassword', {
            required: 'New password is required',
            minLength: { value: 8, message: 'Minimum 8 characters' },
          })}
          error={errors.newPassword?.message}
        />
        <Input
          label="Confirm New Password"
          type="password"
          placeholder="Re-enter new password"
          required
          autoComplete="new-password"
          {...register('confirmPassword', {
            required: 'Please confirm your new password',
            validate: (value) => value === newPassword || 'Passwords do not match',
          })}
          error={errors.confirmPassword?.message}
        />
      </div>
    </Modal>
  )
}
