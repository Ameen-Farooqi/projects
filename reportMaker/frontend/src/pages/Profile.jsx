import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/nav/Navbar.jsx'
import { serverUrl } from '../../config.mjs'
import styles from './Profile.module.css'

function authHeaders() {
  const token = localStorage.getItem('token')
  return {
    Authorization: token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json',
  }
}

function readLocalUser() {
  try {
    const raw = localStorage.getItem('user')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function formatRole(role) {
  if (!role) return '—'
  if (role === 'sideengineer') return 'Side engineer'
  return role.charAt(0).toUpperCase() + role.slice(1)
}

function initialFromName(name) {
  if (!name || typeof name !== 'string') return '?'
  const p = name.trim().split(/\s+/)
  if (p.length >= 2) {
    return (p[0][0] + p[1][0]).toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
}

export default function Profile() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadProfile = useCallback(async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login', { replace: true })
      return
    }
    const cached = readLocalUser()
    if (cached) setUser(cached)

    const userId = cached?._id
    if (!userId) {
      setLoading(false)
      setError('No user id in session. Sign in again.')
      return
    }

    setLoading(true)
    setError('')
    try {
      const res = await axios.get(`${serverUrl}/getUser/${userId}`, {
        headers: authHeaders(),
      })
      const fresh = res.data.user
      setUser(fresh)
      localStorage.setItem('user', JSON.stringify(fresh))
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login', { replace: true })
        return
      }
      setError(
        err.response?.data?.message ??
          'Could not load profile. Showing cached details if any.'
      )
    } finally {
      setLoading(false)
    }
  }, [navigate])

  useEffect(() => {
    loadProfile()
  }, [loadProfile])

  if (!user && !loading) {
    return (
      <>
        <Navbar />
        <div className={styles.page}>
          <div className={styles.inner}>
            <div className={styles.headerBlock}>
              <h1 className={styles.title}>Profile</h1>
            </div>
            {error && (
              <p className={styles.bannerError} role="alert">
                {error}
              </p>
            )}
          </div>
        </div>
      </>
    )
  }

  const created = user?.createdAt
    ? new Date(user.createdAt).toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : '—'

  const updated = user?.updatedAt
    ? new Date(user.updatedAt).toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : '—'

  return (
    <>
      <Navbar />
      <div className={styles.page}>
        <div className={styles.inner}>
          <div className={styles.headerBlock}>
            <h1 className={styles.title}>Your profile</h1>
            <p className={styles.subtitle}>
              Account details from your workspace. This page refreshes from the
              server when you open it.
            </p>
          </div>

          {error && (
            <p className={styles.bannerError} role="alert">
              {error}
            </p>
          )}

          <div className={styles.card}>
            <div className={styles.hero}>
              <div className={styles.avatar} aria-hidden>
                {initialFromName(user?.name)}
              </div>
              <div className={styles.heroText}>
                <p className={styles.displayName}>{user?.name ?? '—'}</p>
                <p className={styles.emailPreview}>{user?.email ?? '—'}</p>
                <span className={styles.rolePill}>{formatRole(user?.role)}</span>
              </div>
            </div>

            <dl className={styles.list}>
              <div className={styles.row}>
                <dt className={styles.dt}>Full name</dt>
                <dd className={styles.dd}>{user?.name ?? '—'}</dd>
              </div>
              <div className={styles.row}>
                <dt className={styles.dt}>Email</dt>
                <dd className={styles.dd}>{user?.email ?? '—'}</dd>
              </div>
              <div className={styles.row}>
                <dt className={styles.dt}>Role</dt>
                <dd className={styles.dd}>{formatRole(user?.role)}</dd>
              </div>
              <div className={styles.row}>
                <dt className={styles.dt}>User ID</dt>
                <dd className={`${styles.dd} ${styles.mono}`}>
                  {user?._id ?? '—'}
                </dd>
              </div>
              <div className={styles.row}>
                <dt className={styles.dt}>Member since</dt>
                <dd className={styles.dd}>{created}</dd>
              </div>
              <div className={styles.row}>
                <dt className={styles.dt}>Last updated</dt>
                <dd className={styles.dd}>{updated}</dd>
              </div>
            </dl>

            <div className={styles.footer}>
              <p className={styles.refreshNote}>
                {loading && (
                  <>
                    <span className={styles.spinner} aria-hidden />
                    Syncing with server…
                  </>
                )}
                {!loading && 'Profile is up to date.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
