import React from 'react'
import { Button } from 'antd'
import { useAuth } from '@/Hooks/useAuth'

const Login = () => {
  const { login } = useAuth()

  return (
    <div className="h-full w-full flex flex-col justify-center items-center">
      <h1 className="text-6xl font-bold pb-10">Welcome to Playtoken Palace</h1>
      <Button
        className=" h-16 w-80 !bg-[radial-gradient(67.52%_167.71%_at_50.38%_-41.67%,#EA2B7B_0%,#3B00B9_100%)] "
        type="primary"
        size="large"
        onClick={login}
      >
        Login / Create Account
      </Button>
    </div>
  )
}

export default Login
