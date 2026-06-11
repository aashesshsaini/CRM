import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Modal from '../../components/common/Modal.jsx'
import Button from '../../components/common/Button.jsx'
import Select from '../../components/common/Select.jsx'
import Input from '../../components/common/Input.jsx'
import { assignLeads } from '../../services/leadService.js'
import { getAgents } from '../../services/agentService.js'
import { CATEGORY_OPTIONS } from '../../config/constants.js'

export default function AssignLeadsModal({ isOpen, onClose, onAssigned }) {
  const [agents, setAgents] = useState([])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { limit: 50 } })

  // useEffect(() => {
  //   if (isOpen) {
  //     getAgents()
  //       .then((data) => setAgents(data?.agents || data || []))
  //       .catch(() => {})
  //   }
  // }, [isOpen])

  useEffect(() => {
  getAgents()
    .then((d) => {
      const list = d?.data || [];
      setAgents(Array.isArray(list) ? list : []);
    })
    .catch(console.error);
}, []);

  const agentOptions = agents.map((a) => ({ value: a._id, label: `${a.name} (${a.role})` }))

  const onSubmit = async (values) => {
    try {
      const data = await assignLeads({
        agentId: values.agentId,
        limit: Number(values.limit),
        city: values.city || undefined,
        category: values.category || undefined,
      })
      toast.success(`Assigned ${data.assigned ?? 'some'} leads successfully`)
      reset()
      onAssigned?.()
      onClose()
    } catch (err) {
      toast.error(err.message || 'Assignment failed')
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Assign Leads to Agent"
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
          <Button loading={isSubmitting} onClick={handleSubmit(onSubmit)}>Assign Leads</Button>
        </>
      }
    >
      <div className="space-y-4">
        <Select
          label="Select Agent"
          options={agentOptions}
          placeholder="Choose an agent"
          required
          {...register('agentId', { required: 'Agent is required' })}
          error={errors.agentId?.message}
        />

        <Input
          label="City (optional)"
          placeholder="e.g. Muzaffarnagar"
          {...register('city')}
        />

        <Select
          label="Category (optional)"
          options={CATEGORY_OPTIONS}
          placeholder="All categories"
          {...register('category')}
        />

        <Input
          label="Lead Limit"
          type="number"
          required
          {...register('limit', {
            required: 'Limit is required',
            min: { value: 1, message: 'Minimum 1' },
            max: { value: 500, message: 'Maximum 500 at a time' },
          })}
          error={errors.limit?.message}
          helperText="Max leads to assign in this batch"
        />
      </div>
    </Modal>
  )
}
