import React,{useState,useEffect} from 'react'
import styles from './Home.module.css'
import Navbar from '../components/nav/Navbar.jsx'
import { useNavigate } from 'react-router-dom'
import Reports from '../components/reports/Reports.jsx'
export default function Home() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))
    setUser(user)
    const token = localStorage.getItem('token')
    if(!token) {
      navigate('/login')
    }
  }, [])
  return (
    <>
    {/* <Navbar /> */}
    <Reports />
    </>
  )
}
