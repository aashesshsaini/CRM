import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Modal from '../../components/common/Modal.jsx'
import Button from '../../components/common/Button.jsx'
import Input from '../../components/common/Input.jsx'
import Select from '../../components/common/Select.jsx'
import { createAgent } from '../../services/agentService.js'
import { AGENT_ROLES } from '../../config/constants.js'
import { validators } from '../../utils/validators.js'

const ROLE_OPTIONS = Object.values(AGENT_ROLES).map((r) => ({ value: r, label: r }))

export default function CreateAgentModal({ isOpen, onClose, onCreated }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { role: AGENT_ROLES.CALLER } })

  const onSubmit = async (values) => {
    try {
      await createAgent(values)
      toast.success(`Agent "${values.name}" created`)
      reset()
      onCreated?.()
      onClose()
    } catch (err) {
      toast.error(err.message || 'Failed to create agent')
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Agent"
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
          <Button loading={isSubmitting} onClick={handleSubmit(onSubmit)}>Create Agent</Button>
        </>
      }
    >
      <div className="space-y-4">
        <Input
          label="Full Name"
          placeholder="e.g. Shalini Sharma"
          required
          {...register('name', validators.name)}
          error={errors.name?.message}
        />
        <Input
          label="Phone Number"
          placeholder="10-digit mobile number"
          maxLength={10}
          required
          {...register('phone', validators.phone)}
          error={errors.phone?.message}
        />
        <Select
          label="Role"
          options={ROLE_OPTIONS}
          required
          {...register('role', { required: 'Role is required' })}
          error={errors.role?.message}
        />
      </div>
    </Modal>
  )
}
