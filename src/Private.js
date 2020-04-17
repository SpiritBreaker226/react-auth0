import React, { useEffect, useState } from 'react'

const Private = ({ auth }) => {
  const [message, setMessage] = useState('')

  useEffect(() => {
    const fetchPrivate = async () => {
      try {
        const response = await fetch('/private', {
          headers: {
            Authorization: `Bearer ${auth.getAccessToken()}`,
          },
        })

        if (response.ok) {
          const { message } = await response.json()

          setMessage(message)
          return
        }

        throw new Error('Network response was not ok.')
      } catch (error) {
        setMessage(error.message)
      }
    }

    fetchPrivate()
  }, [auth])

  if (!message) return <span>Loading...</span>

  return <p>{message}</p>
}

export default Private
