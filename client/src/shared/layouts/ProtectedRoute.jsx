import React from 'react'

export default function ProtectedRoute() {
  const { data:  session, reload: reloadSession, loading: loadingSession } = useAuth();
  return (
    <div>
      
    </div>
  )
}
