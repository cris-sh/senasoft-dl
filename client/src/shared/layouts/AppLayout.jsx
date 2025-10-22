import { Outlet } from 'react-router-dom'

export default function AppLayout() {
  return (
    <div className='w-full max-h-100vh'>
      <Outlet/>
    </div>
  )
}
