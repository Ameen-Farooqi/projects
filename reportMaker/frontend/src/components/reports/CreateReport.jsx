import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Navbar from '../nav/Navbar.jsx'
import CustomButton from '../buttons/CustomButton.jsx'
import { serverUrl } from '../../../config.mjs'
import { PROPERTY_TYPES, ASSIGNEE_ROLES } from '../../constants/reportForm.js'
import styles from './CreateReport.module.css'

function authHeaders() {
  const token = localStorage.getItem('token')
  return {
    Authorization: token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json',
  }
}

function readStoredUser() {
  try {
    const raw = localStorage.getItem('user')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export default function CreateReport() {
  const navigate = useNavigate()
  const [allowed, setAllowed] = useState(false)

  const [taskTitle, setTaskTitle] = useState('')
  const [adminInstructions, setAdminInstructions] = useState('')
  const [propertyType, setPropertyType] = useState('other')
  const [addressHint, setAddressHint] = useState('')
  const [assignedTo, setAssignedTo] = useState('')

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login', { replace: true })
      return
    }
    const user = readStoredUser()
    if (user?.role !== 'admin') {
      navigate('/reports', { replace: true })
      return
    }
    setAllowed(true)
  }, [navigate])

  const resetTemplate = () => {
    setTaskTitle('')
    setAdminInstructions('')
    setPropertyType('other')
    setAddressHint('')
    setAssignedTo('')
    setError('')
    setSuccess('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (submitting) return
    setError('')
    setSuccess('')
    if (!assignedTo) {
      setError('Choose who this task is assigned to.')
      return
    }
    setSubmitting(true)
    try {
      const res = await axios.post(
        `${serverUrl}/create`,
        {
          taskTitle: taskTitle.trim() || undefined,
          adminInstructions,
          assignedTo,
          propertyType,
          address: addressHint.trim() || undefined,
        },
        { headers: authHeaders() }
      )
      setSuccess(res.data.message ?? 'Task created. Assignee can complete it under Reports.')
      setTaskTitle('')
      setAdminInstructions('')
      setPropertyType('other')
      setAddressHint('')
      setAssignedTo('')
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login', { replace: true })
        return
      }
      if (err.response?.status === 403) {
        setError('Only admins can create report tasks.')
        return
      }
      setError(
        err.response?.data?.message ??
          err.response?.data?.error ??
          'Could not create task. Try again.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (!allowed) {
    return (
      <>
        <Navbar />
        <div className={styles.page}>
          <div className={styles.inner}>
            <p className={styles.subtitle}>Checking access…</p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className={styles.page}>
        <div className={styles.inner}>
          <div className={styles.card}>
            <header className={styles.header}>
              <h1 className={styles.title}>New report task</h1>
              <p className={styles.subtitle}>
                Create a task template: give it a title and instructions. The
                assignee completes the full report (property details, address,
                description, and image links) on the Reports page.
              </p>
            </header>

            {error && (
              <p className={styles.bannerError} role="alert">
                {error}
              </p>
            )}
            {success && (
              <p className={styles.bannerSuccess} role="status">
                {success}
              </p>
            )}

            <form className={styles.form} onSubmit={handleSubmit} noValidate>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="create-task-title">
                  Task title
                </label>
                <input
                  id="create-task-title"
                  className={styles.input}
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="e.g. Q2 HVAC inspection – Building A"
                />
              </div>

              <div className={styles.field}>
                <label
                  className={styles.label}
                  htmlFor="create-instructions"
                >
                  Instructions for assignee
                </label>
                <textarea
                  id="create-instructions"
                  className={styles.textarea}
                  value={adminInstructions}
                  onChange={(e) => setAdminInstructions(e.target.value)}
                  placeholder="What should they complete? Deadlines, checklist, site access notes…"
                  rows={5}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="create-assign">
                  Assign to (role)
                </label>
                <select
                  id="create-assign"
                  className={styles.select}
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                >
                  <option value="" disabled>
                    Select role…
                  </option>
                  {ASSIGNEE_ROLES.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <p className={styles.optionalBlockTitle}>Optional hints (assignee can change these)</p>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="create-property">
                  Expected property type
                </label>
                <select
                  id="create-property"
                  className={styles.select}
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                >
                  {PROPERTY_TYPES.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="create-address-hint">
                  Address hint
                </label>
                <input
                  id="create-address-hint"
                  className={styles.input}
                  value={addressHint}
                  onChange={(e) => setAddressHint(e.target.value)}
                  placeholder="Leave blank to let assignee confirm on site"
                  autoComplete="off"
                />
              </div>

              <div className={styles.footer}>
                <CustomButton
                  text={submitting ? 'Creating…' : 'Create task'}
                  style={styles.submit}
                />
                <button
                  type="button"
                  className={styles.secondary}
                  onClick={resetTemplate}
                >
                  Clear form
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
