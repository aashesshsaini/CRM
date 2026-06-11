import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Modal from '../../components/common/Modal.jsx'
import Button from '../../components/common/Button.jsx'
import Select from '../../components/common/Select.jsx'
import Input from '../../components/common/Input.jsx'
import Badge from '../../components/common/Badge.jsx'
import { updateLeadStatus } from '../../services/leadService.js'
import { LEAD_STATUS, LEAD_STATUS_LABELS } from '../../config/constants.js'

const STATUS_OPTIONS = Object.entries(LEAD_STATUS_LABELS).map(([value, label]) => ({
  value,
  label,
}))

export default function UpdateLeadStatusModal({ isOpen, onClose, lead, onUpdated }) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm()

  const selectedStatus = watch('status')

  useEffect(() => {
    if (lead && isOpen) {
      reset({
        status: lead.status,
        remarks: lead.remarks || '',
        followUpDate: lead.followUpDate ? lead.followUpDate.split('T')[0] : '',
        dealAmount: lead.dealAmount || '',
      })
    }
  }, [lead, isOpen, reset])

  const onSubmit = async (values) => {
    try {
      const payload = {
        status: values.status,
        remarks: values.remarks || undefined,
        followUpDate: values.followUpDate || undefined,
      }
      if (values.status === LEAD_STATUS.CONVERTED && values.dealAmount) {
        payload.dealAmount = Number(values.dealAmount)
      }
      await updateLeadStatus(lead._id, payload)
      toast.success('Lead status updated')
      onUpdated?.()
      onClose()
    } catch (err) {
      toast.error(err.message || 'Update failed')
    }
  }

  if (!lead) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Update Lead Status"
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
          <Button loading={isSubmitting} onClick={handleSubmit(onSubmit)}>Save Changes</Button>
        </>
      }
    >
      <div className="space-y-4">
        {/* Lead info summary */}
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{lead.name}</p>
            <p className="text-xs text-gray-500">{lead.phone} · {lead.city}</p>
          </div>
          <Badge status={lead.status} className="ml-auto shrink-0" />
        </div>

        <Select
          label="New Status"
          options={STATUS_OPTIONS}
          placeholder="Select status"
          required
          {...register('status', { required: 'Status is required' })}
          error={errors.status?.message}
        />

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Remarks</label>
          <textarea
            rows={3}
            placeholder="Add notes or remarks..."
            {...register('remarks')}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-colors resize-none"
          />
        </div>

        <Input
          label="Follow-up Date"
          type="date"
          {...register('followUpDate')}
        />

        {selectedStatus === LEAD_STATUS.CONVERTED && (
          <Input
            label="Deal Amount (₹)"
            type="number"
            placeholder="e.g. 5005"
            required
            {...register('dealAmount', {
              required: 'Deal amount is required for converted leads',
              min: { value: 1, message: 'Must be greater than 0' },
            })}
            error={errors.dealAmount?.message}
          />
        )}
      </div>
    </Modal>
  )
}
