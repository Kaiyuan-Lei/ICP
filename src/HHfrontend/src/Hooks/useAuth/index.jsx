import React, { createContext, useState, useContext } from 'react'
import { AuthClient } from '@dfinity/auth-client'
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom'

const days = BigInt(1)
const hours = BigInt(24)
const nanoseconds = BigInt(3600000000000)
export const defaultOptions = {
  createOptions: {
    idleOptions: {
      // Set to true if you do not want idle functionality
      disableIdle: true,
    },
  },
  loginOptions: {
    identityProvider:
      process.env.DFX_NETWORK === 'ic'
        ? 'https://identity.ic0.app/#authorize'
        : `http://localhost:4943?canisterId=rdmx6-jaaaa-aaaaa-aaadq-cai#authorize`,
    // Maximum authorization expiration is 8 days
    maxTimeToLive: days * hours * nanoseconds,
  },
}

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const [authClient, setAuthClient] = useState(null)
  const [principalId, setPrincipalId] = useState('')
  const init = async () => {
    console.log('init========')
    const _authClient = await AuthClient.create(defaultOptions.createOptions)
    setAuthClient(_authClient)
    if (await _authClient.isAuthenticated()) {
      handleAuthenticated(_authClient)
    } else {
      if (location.pathname !== '/login') {
        navigate(
          `/login?redirect=${encodeURIComponent(
            location.pathname + location.search,
          )}`,
        )
      }
    }
  }
  const handleAuthenticated = (authClient) => {
    console.log('handleAuthenticated========')
    console.log(location)
    const identity = authClient.getIdentity()
    const _principalId = identity.getPrincipal().toText()
    setPrincipalId(_principalId)
    console.log(_principalId)
    if (_principalId && _principalId.length > 10) {
      if (location.pathname.startsWith('/login')) {
        if (location.search.includes('redirect')) {
          navigate(decodeURIComponent(searchParams.get('redirect')))
        }
      }
    } else {
      navigate('/login')
    }
  }

  const login = () => {
    if (!authClient) throw new Error('AuthClient not initialized')

    authClient.login({
      onSuccess: handleLoginSuccess,
    })
  }

  const logout = async () => {
    if (authClient) {
      await authClient.logout()
      handleAuthenticated(authClient)
    }
  }

  const handleLoginSuccess = () => {
    handleAuthenticated(authClient)
  }

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        init,
        principalId,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider')
  }
  return context
}
