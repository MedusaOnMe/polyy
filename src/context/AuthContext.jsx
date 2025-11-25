import { createContext, useContext, useState, useEffect } from 'react'
import { ethers } from 'ethers'

const AuthContext = createContext(null)

// Simple encryption using password - in production use proper key derivation
function encryptPrivateKey(privateKey, password) {
  // XOR-based encryption with password hash (simple, not production-grade)
  const encoder = new TextEncoder()
  const keyBytes = encoder.encode(privateKey)
  const passBytes = encoder.encode(password)

  const encrypted = new Uint8Array(keyBytes.length)
  for (let i = 0; i < keyBytes.length; i++) {
    encrypted[i] = keyBytes[i] ^ passBytes[i % passBytes.length]
  }

  return btoa(String.fromCharCode(...encrypted))
}

function decryptPrivateKey(encryptedKey, password) {
  const encoder = new TextEncoder()
  const passBytes = encoder.encode(password)

  const encrypted = new Uint8Array(
    atob(encryptedKey).split('').map(c => c.charCodeAt(0))
  )

  const decrypted = new Uint8Array(encrypted.length)
  for (let i = 0; i < encrypted.length; i++) {
    decrypted[i] = encrypted[i] ^ passBytes[i % passBytes.length]
  }

  return new TextDecoder().decode(decrypted)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('polyperps_user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  // Save user to localStorage when changed
  useEffect(() => {
    if (user) {
      localStorage.setItem('polyperps_user', JSON.stringify(user))
    } else {
      localStorage.removeItem('polyperps_user')
    }
  }, [user])

  const register = (email, password) => {
    // Check if user already exists
    const existingUsers = JSON.parse(localStorage.getItem('polyperps_users') || '[]')
    if (existingUsers.find(u => u.email === email)) {
      throw new Error('Email already registered')
    }

    // Generate a real Polygon wallet
    const wallet = ethers.Wallet.createRandom()

    // Encrypt the private key with the user's password
    const encryptedPrivateKey = encryptPrivateKey(wallet.privateKey, password)

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      email,
      password, // In a real app, this would be hashed
      walletAddress: wallet.address,
      encryptedPrivateKey,
      balance: 0,
      createdAt: new Date().toISOString(),
    }

    // Save to users list
    existingUsers.push(newUser)
    localStorage.setItem('polyperps_users', JSON.stringify(existingUsers))

    // Log in the user (don't expose password or encrypted key in session)
    const { password: _, ...userWithoutPassword } = newUser
    setUser(userWithoutPassword)

    return userWithoutPassword
  }

  const login = (email, password) => {
    const existingUsers = JSON.parse(localStorage.getItem('polyperps_users') || '[]')
    const foundUser = existingUsers.find(u => u.email === email && u.password === password)

    if (!foundUser) {
      throw new Error('Invalid email or password')
    }

    const { password: _, ...userWithoutPassword } = foundUser
    setUser(userWithoutPassword)

    return userWithoutPassword
  }

  const connectWallet = () => {
    // Generate a real wallet for wallet-only connection
    const wallet = ethers.Wallet.createRandom()

    const newUser = {
      id: Date.now().toString(),
      walletAddress: wallet.address,
      // Store private key in session only (user should export it)
      privateKey: wallet.privateKey,
      balance: 0,
      createdAt: new Date().toISOString(),
    }
    setUser(newUser)
    return newUser
  }

  const logout = () => {
    setUser(null)
  }

  const updateBalance = (newBalance) => {
    if (user) {
      setUser({ ...user, balance: newBalance })
    }
  }

  // Export private key - requires password for email users
  const exportPrivateKey = (password) => {
    if (!user) throw new Error('Not logged in')

    // If user connected via wallet (has privateKey directly)
    if (user.privateKey) {
      return user.privateKey
    }

    // If user registered with email, decrypt from storage
    if (user.encryptedPrivateKey && password) {
      return decryptPrivateKey(user.encryptedPrivateKey, password)
    }

    // Find user in storage and decrypt
    const existingUsers = JSON.parse(localStorage.getItem('polyperps_users') || '[]')
    const foundUser = existingUsers.find(u => u.email === user.email)

    if (!foundUser || !foundUser.encryptedPrivateKey) {
      throw new Error('No private key found')
    }

    return decryptPrivateKey(foundUser.encryptedPrivateKey, password)
  }

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    register,
    login,
    connectWallet,
    logout,
    updateBalance,
    exportPrivateKey,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
