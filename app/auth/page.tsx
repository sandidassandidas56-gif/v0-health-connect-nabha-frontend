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
    licenseNumber: "",
    specialization: "",
    workerId: "",
    address: {
      fullName: "",
      fatherName: "",
      atpo: "",
      dist: "",
      state: "",
      pin: "",
      landmark: "",
    },
  })

  const handleInputChange = (field: string, value: string, nested = false) => {
    if (nested) {
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  }

  const [errorMsg, setErrorMsg] = useState("");
  const handleSubmit = async (type: "login" | "signup") => {
    setIsLoading(true);
    setErrorMsg("");
    if (type === "login") {
      try {
        const res = await fetch("/api/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: formData.email, password: formData.password })
        });
        const data = await res.json();
        if (data.success) {
          // Redirect based on role
          const redirectPaths = {
            patient: "/dashboard/patient",
            doctor: "/dashboard/doctor",
            asha: "/dashboard/asha",
          };
          if (formData.role && redirectPaths[formData.role as keyof typeof redirectPaths]) {
            window.location.href = redirectPaths[formData.role as keyof typeof redirectPaths];
          }
        } else {
          setErrorMsg(data.error || "Login failed");
        }
      } catch (err) {
        setErrorMsg("Network error");
      }
    } else {
      // Simulate signup (no backend yet)
      await new Promise((resolve) => setTimeout(resolve, 2000));
      // Redirect based on role
      const redirectPaths = {
        patient: "/dashboard/patient",
        doctor: "/dashboard/doctor",
        asha: "/dashboard/asha",
      };
      if (formData.role && redirectPaths[formData.role as keyof typeof redirectPaths]) {
        window.location.href = redirectPaths[formData.role as keyof typeof redirectPaths];
      }
    }
    setIsLoading(false);
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "patient":
        return <User className="h-4 w-4" />
      case "doctor":
        return <Stethoscope className="h-4 w-4" />
      case "asha":
        return <Users className="h-4 w-4" />
      default:
        return <Heart className="h-4 w-4" />
    }
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

            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Login to Your Account</CardTitle>
                  <CardDescription>Enter your credentials to access your dashboard</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-role">Role</Label>
                    <Select onValueChange={(value) => handleInputChange("role", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your role" />
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
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                    />
                  </div>

                  <Button
                    className="w-full"
                    onClick={() => handleSubmit("login")}
                    disabled={isLoading || !formData.role || !formData.email || !formData.password}
                  >
                    {isLoading ? "Signing In..." : "Sign In"}
                  </Button>
                  {errorMsg && (
                    <div className="text-red-600 text-sm mt-2">{errorMsg}</div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="signup">

              <Card>
                <CardHeader>
                  <CardTitle>Create New Account</CardTitle>
                  <CardDescription>Join HealthConnect Nabha today</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-role">Role</Label>
                    <Select onValueChange={(value) => handleInputChange("role", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your role" />
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
                  </div>

                  {/* Personal Data Section */}
                  <div className="mb-6 pb-4 border-b border-muted">
                    <h2 className="font-semibold mb-2">Personal Data</h2>
                    <div className="space-y-4">
                      <Label htmlFor="signup-age">Age</Label>
                      <Input
                        id="signup-age"
                        type="number"
                        min="0"
                        placeholder="Enter your age"
                        value={formData.age}
                        onChange={(e) => handleInputChange("age", e.target.value)}
                      />
                    </div>
                    <div className="space-y-4">
                      <Label htmlFor="signup-gender">Gender</Label>
                      <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-adhaar">Adhaar Number</Label>
                      <Input
                        id="signup-adhaar"
                        placeholder="Enter your Adhaar number"
                        value={formData.adhaar}
                        onChange={(e) => handleInputChange("adhaar", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-phone">Phone Number</Label>
                      <Input
                        id="signup-phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                      />
                    </div>
                  </div>
                  {/* Address Section */}
                  <div className="mb-6 pb-4 border-b border-muted">
                    <h2 className="font-semibold mb-2">Address</h2>
                    <div className="space-y-2">
                      <Label htmlFor="signup-fullName">Your Name</Label>
                      <Input
                        id="signup-fullName"
                        placeholder="Enter your name"
                        value={formData.address.fullName}
                        onChange={(e) => handleInputChange("fullName", e.target.value, true)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-fatherName">Father's Name</Label>
                      <Input
                        id="signup-fatherName"
                        placeholder="Enter your father's name"
                        value={formData.address.fatherName}
                        onChange={(e) => handleInputChange("fatherName", e.target.value, true)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-atpo">At/PO</Label>
                      <Input
                        id="signup-atpo"
                        placeholder="Enter your At/PO"
                        value={formData.address.atpo}
                        onChange={(e) => handleInputChange("atpo", e.target.value, true)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-dist">District</Label>
                      <Select value={formData.address.dist} onValueChange={(value) => handleInputChange("dist", value, true)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select district" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Nabha">Nabha</SelectItem>
                          <SelectItem value="Patiala">Patiala</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-state">State</Label>
                      <Select value={formData.address.state} onValueChange={(value) => handleInputChange("state", value, true)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Punjab">Punjab</SelectItem>
                          <SelectItem value="Haryana">Haryana</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-pin">PIN Code</Label>
                      <Input
                        id="signup-pin"
                        placeholder="Enter your PIN code"
                        value={formData.address.pin}
                        onChange={(e) => handleInputChange("pin", e.target.value, true)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-landmark">Landmark</Label>
                      <Input
                        id="signup-landmark"
                        placeholder="Enter landmark (optional)"
                        value={formData.address.landmark}
                        onChange={(e) => handleInputChange("landmark", e.target.value, true)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-phone">Phone Number</Label>
                    <Input
                      id="signup-phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                    />
                  </div>

                  {/* Role-specific fields */}
                  {formData.role === "doctor" && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="license-number">Medical License Number</Label>
                        <Input
                          id="license-number"
                          placeholder="Enter your license number"
                          value={formData.licenseNumber}
                          onChange={(e) => handleInputChange("licenseNumber", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="specialization">Specialization</Label>
                        <Input
                          id="specialization"
                          placeholder="Enter your specialization"
                          value={formData.specialization}
                          onChange={(e) => handleInputChange("specialization", e.target.value)}
                        />
                      </div>
                    </>
                  )}

                  {formData.role === "asha" && (
                    <div className="space-y-2">
                      <Label htmlFor="worker-id">ASHA Worker ID</Label>
                      <Input
                        id="worker-id"
                        placeholder="Enter your worker ID"
                        value={formData.workerId}
                        onChange={(e) => handleInputChange("workerId", e.target.value)}
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    />
                  </div>

                  <Button
                    className="w-full"
                    onClick={() => handleSubmit("signup")}
                    disabled={
                      isLoading || !formData.role || !formData.email || !formData.password || !formData.address.fullName
                    }
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="text-center mt-6 text-sm text-muted-foreground">
            <p>By continuing, you agree to our Terms of Service and Privacy Policy</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
