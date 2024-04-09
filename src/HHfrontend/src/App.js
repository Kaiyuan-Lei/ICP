import React, { useEffect, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Layout from '@/components/Layout'
import Home from '@/pages/Home'
import List from '@/pages/List'
import Login from '@/pages/Login'
import Pay from '@/pages/Pay'

import { useAuth } from './Hooks/useAuth'

function App() {
  const { init } = useAuth()

  useEffect(() => {
    init()
  }, [])

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout>
            <Home />
          </Layout>
        }
      />
      <Route
        path="/list"
        element={
          <Layout>
            <List />
          </Layout>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/pay" element={<Pay />} />
      <Route
        path="*"
        element={
          <Layout>
            <Home />
          </Layout>
        }
      />
    </Routes>
  )
}
export default App
