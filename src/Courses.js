import React, { useEffect, useState } from 'react'

const Courses = ({ auth }) => {
  const [message, setMessage] = useState('')
  const [courses, setCourses] = useState([])

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch('/courses', {
          headers: {
            Authorization: `Bearer ${auth.getAccessToken()}`,
          },
        })

        if (response.ok) {
          const { courses } = await response.json()

          setCourses(courses)
          return
        }

        throw new Error('Network response was not ok.')
      } catch (error) {
        setMessage(error.message)
      }
    }

    const fetchAdmin = async () => {
      try {
        const response = await fetch('/admin', {
          headers: {
            Authorization: `Bearer ${auth.getAccessToken()}`,
          },
        })

        if (response.ok) {
          const body = await response.json()

          console.log(body)
          return
        }

        throw new Error('Network response was not ok.')
      } catch (error) {
        setMessage(error.message)
      }
    }

    fetchCourse()
    fetchAdmin()
  }, [auth])

  if (!courses) return <span>Loading...</span>

  if (message) return <p>Error Message: {message}</p>

  return (
    <ul>
      {courses.map((course) => (
        <li key={course.id}>{course.title}</li>
      ))}
    </ul>
  )
}

export default Courses
