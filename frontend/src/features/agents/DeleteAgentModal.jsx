import { useState } from 'react'
import toast from 'react-hot-toast'
import Modal from '../../components/common/Modal.jsx'
import Button from '../../components/common/Button.jsx'
import { deleteAgent } from '../../services/agentService.js'

export default function DeleteAgentModal({ isOpen, onClose, agent, onDeleted }) {
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!agent?._id || deleting) return

    setDeleting(true)
    try {
      const res = await deleteAgent(agent._id)
      const unassigned = res?.unassignedLeads ?? 0
      const detail = unassigned > 0 ? ` ${unassigned} lead(s) unassigned.` : ''
      toast.success(`${res?.message || 'Agent deleted.'}${detail}`)
      onDeleted?.()
      onClose()
    } catch (err) {
      toast.error(err.message || 'Failed to delete agent')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Agent"
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={deleting}>Cancel</Button>
          <Button variant="danger" loading={deleting} onClick={handleDelete}>Delete Agent</Button>
        </>
      }
    >
      <div className="space-y-3">
        <p className="text-sm text-gray-600">
          Are you sure you want to delete{' '}
          <span className="font-semibold text-gray-900">{agent?.name}</span>?
        </p>
        <p className="text-sm text-gray-500">
          This action cannot be undone. Any leads assigned to this agent will be unassigned.
        </p>
      </div>
    </Modal>
  )
}
