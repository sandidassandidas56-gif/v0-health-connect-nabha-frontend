"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, User, Stethoscope, Users } from "lucide-react"

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    age: "",
    gender: "",
    adhaar: "",
    role: "",
  })
  const [errorMsg, setErrorMsg] = useState("")

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (type: "login" | "signup") => {
    setIsLoading(true)
    setErrorMsg("")
    try {
      const url =
        type === "login"
          ? "http://localhost:5001/api/auth/login"
          : "http://localhost:5001/api/auth/signup"

      const body =
        type === "login"
          ? { email: formData.email, password: formData.password }
          : formData

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (data.token) {
        if (typeof window !== "undefined") {
          localStorage.setItem("token", data.token)
        }
        const redirectPaths = {
          patient: "/dashboard/patient",
          doctor: "/dashboard/doctor",
          asha: "/dashboard/asha",
        }
        if (
          formData.role === "patient" ||
          formData.role === "doctor" ||
          formData.role === "asha"
        ) {
          window.location.href = redirectPaths[formData.role]
        }
      } else {
        setErrorMsg(data.error || `${type} failed`)
      }
    } catch (err) {
      setErrorMsg("Network error")
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="bg-primary text-primary-foreground p-3 rounded-lg w-fit mx-auto mb-4">
              <Heart className="h-8 w-8" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Welcome to HealthConnect</h1>
            <p className="text-muted-foreground">Access your healthcare dashboard</p>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            {/* LOGIN */}
            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Login</CardTitle>
                  <CardDescription>Enter your credentials</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Role */}
                  <Label>Role</Label>
                  <Select onValueChange={(v) => handleInputChange("role", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="patient">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4" />
                          <span>Patient</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="doctor">
                        <div className="flex items-center space-x-2">
                          <Stethoscope className="h-4 w-4" />
                          <span>Doctor</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="asha">
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4" />
                          <span>ASHA Worker</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  <Label>Email</Label>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />

                  <Label>Password</Label>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                  />

                  <Button
                    className="w-full"
                    onClick={() => handleSubmit("login")}
                    disabled={isLoading || !formData.role || !formData.email || !formData.password}
                  >
                    {isLoading ? "Signing In..." : "Sign In"}
                  </Button>

                  {errorMsg && <div className="text-red-600 text-sm mt-2">{errorMsg}</div>}
                </CardContent>
              </Card>
            </TabsContent>

            {/* SIGNUP */}
            <TabsContent value="signup">
              <Card>
                <CardHeader>
                  <CardTitle>Create Account</CardTitle>
                  <CardDescription>Join HealthConnect</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Personal Data */}
                  <Label>Age</Label>
                  <Input
                    type="number"
                    placeholder="Enter your age"
                    value={formData.age}
                    onChange={(e) => handleInputChange("age", e.target.value)}
                  />

                  <Label>Gender</Label>
                  <Select onValueChange={(v) => handleInputChange("gender", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>

                  <Label>Adhaar</Label>
                  <Input
                    placeholder="Enter your Adhaar number"
                    value={formData.adhaar}
                    onChange={(e) => handleInputChange("adhaar", e.target.value)}
                  />

                  <Label>Phone</Label>
                  <Input
                    type="tel"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                  />

                  <Label>Email</Label>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />

                  <Label>Password</Label>
                  <Input
                    type="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                  />

                  <Label>Confirm Password</Label>
                  <Input
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  />

                  <Button
                    className="w-full"
                    onClick={() => handleSubmit("signup")}
                    disabled={isLoading || !formData.email || !formData.password}
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  )
}