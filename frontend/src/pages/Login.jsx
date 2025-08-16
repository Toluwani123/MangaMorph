import React from 'react'
import Form from '../components/Form'

function Login() {
  return (
    <div>
      <Form route="/accounts/login/" method="login" />
    </div>
  )
}

export default Login