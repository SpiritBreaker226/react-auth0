import React, { useEffect, useState } from 'react'

const Public = () => {
  const [message, setMessage] = useState('')

  useEffect(() => {
    const fetchPublic = async () => {
      try {
        const response = await fetch('/public')

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

    fetchPublic()
  }, [])

  if (!message) return <span>Loading...</span>

  return <p>{message}</p>
}

export default Public
