import React, { useEffect, useState } from 'react'

const Profile = ({ auth }) => {
  const [profile, setProfile] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadUserProfile = (profile, error) => {
      setProfile(profile)
      setError(error)
    }

    auth.getProfile(loadUserProfile)
  }, [auth])

  if (!profile) return <span>Loading...</span>

  if (error) {
    console.warn(`Profile error: ${error}`)
    return <span>Unable to Load Profile</span>
  }

  return (
    <section>
      <h1>Profile</h1>

      <p>{profile.nickname}</p>

      <img src={profile.picture} alt={`profile for ${profile.nickname}`} />

      <pre>{JSON.stringify(profile, null, 2)}</pre>
    </section>
  )
}

export default Profile
