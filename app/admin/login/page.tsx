"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function AdminLoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Username atau password salah")
      } else {
        router.push("/admin")
      }
    } catch (error) {
      setError("Terjadi kesalahan")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-4 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-500/30 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      
      <Card className="w-full max-w-md relative z-10 border-0 shadow-2xl backdrop-blur-sm bg-white/95">
        <CardHeader className="text-center space-y-2 pb-8">
          <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center mb-4 shadow-xl">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Admin Login
          </CardTitle>
          <CardDescription className="text-base">
            Login untuk mengakses dashboard admin Workshop PCC
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <Alert variant="destructive" className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-semibold text-gray-700">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-11 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                placeholder="Masukkan username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                placeholder="Masukkan password"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 mt-6"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading...
                </span>
              ) : (
                "Login ke Dashboard"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
