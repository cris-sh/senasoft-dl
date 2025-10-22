import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'

export default function AppLayout() {
  return (
    <div className='w-full max-h-screen flex-col'>
      <Navbar/>
      <Outlet/>
    </div>
  )
}
