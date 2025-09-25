"use client"

import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, User, Stethoscope, Users } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import AddressAutocomplete from '@/components/address-autocomplete'

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    // Patient fields
    phone: "",
    age: "",
    gender: "",
    adhaar: "",
    // Doctor fields
    specialization: "",
    registrationNo: "",
    licenseNumber: "",
    // ASHA fields
    workerId: "",
    assignedVillage: "",
    // Common
    role: "",
    address: "",
  })
  const [errorMsg, setErrorMsg] = useState("")
  const [signupSuccess, setSignupSuccess] = useState(false)
  const [activeTab, setActiveTab] = useState("login")
  const [showExists, setShowExists] = useState(false)
  const [existsMessage, setExistsMessage] = useState("")

  // Demo patient credentials (seeded by backend/scripts/seed-mock-users.js)
  const demoPatient = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: 'Password123!',
    phone: '9998887777',
    age: '45',
    gender: 'male',
    adhaar: '111122223333',
    role: 'patient'
  }

  // read ?tab= from URL to allow linking directly to login/signup and keep in sync with browser history
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const readTabFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab');
      if (tab === 'login' || tab === 'signup') setActiveTab(tab);
    };
    // initialize from current URL
    readTabFromUrl();
    // update on back/forward navigation
    const onPop = () => readTabFromUrl();
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  const router = useRouter();

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleAddressChange = (addr: any) => {
    // store structured address object (formatted, components, lat/lng) so it can be sent to backend
    setFormData((prev) => ({ ...prev, address: addr }))
  }

  const handleSubmit = async (type: "login" | "signup") => {
  setIsLoading(true);
    setErrorMsg("");
  // When developing locally, point the frontend to the Express backend to avoid Next API routing
  const backendBase = (typeof window !== 'undefined' && window.location.hostname === 'localhost') ? 'http://localhost:5001' : '';
  const url = type === "login" ? `${backendBase}/api/auth/login` : `${backendBase}/api/auth/signup`;
    let body;
    if (type === "login") {
      body = { email: formData.email, password: formData.password };
    } else if (formData.role === "patient") {
      body = {
        name: formData.name || "",
        email: formData.email || "",
        password: formData.password || "",
        confirmPassword: formData.confirmPassword || "",
        phone: formData.phone || "",
        age: formData.age || "",
        gender: formData.gender || "",
        adhaar: formData.adhaar || "",
        role: "patient",
  address: formData.address ? formData.address : { fullName: formData.name || "" }
      };
    } else if (formData.role === "doctor") {
      body = {
        name: formData.name || "",
        email: formData.email || "",
        password: formData.password || "",
        confirmPassword: formData.confirmPassword || "",
        phone: formData.phone || "",
        specialization: formData.specialization || "",
        registrationNo: formData.registrationNo || "",
        licenseNumber: formData.licenseNumber || "",
        age: formData.age || "",
        role: "doctor",
  address: formData.address ? formData.address : { fullName: formData.name || "" }
      };
    } else if (formData.role === "asha") {
      body = {
        name: formData.name || "",
        email: formData.email || "",
        password: formData.password || "",
        confirmPassword: formData.confirmPassword || "",
        phone: formData.phone || "",
        adhaar: formData.adhaar || "",
        workerId: formData.workerId || "",
        assignedVillage: formData.assignedVillage || "",
        age: formData.age || "",
        role: "asha",
  address: formData.address ? formData.address : { fullName: formData.name || "" }
      };
    } else {
      // include address.fullName when sending raw formData
      body = { ...formData, address: { fullName: formData.name || "" } };
    }
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
  const data = await res.json();
  console.log('Signup response', res.status, data);
      if (type === "signup") {
        if (res.ok) {
          setSignupSuccess(true);
          // wait briefly so user sees success message, then redirect to login (use replace to avoid duplicate history)
          setTimeout(() => {
            try {
              router.replace('/auth?tab=login');
            } catch (e) {
              if (typeof window !== 'undefined') {
                window.location.href = '/auth?tab=login';
              } else {
                setActiveTab('login');
              }
            }
            // ensure UI tab is switched even if navigation doesn't trigger immediately
            setActiveTab('login');
          }, 1200);
        } else {
          const msg = data?.message || data?.error || '';
          // treat 409 or messages containing "exist" as account-already-exists
          if (res.status === 409 || /exist|already/i.test(msg)) {
            setExistsMessage(msg || 'Account already exists');
            setShowExists(true);
          } else {
            setErrorMsg(msg || 'Signup failed');
          }
        }
      } else if (type === "login" && data.token && data.user && data.user.role) {
        localStorage.setItem("token", data.token);
        try {
          router.push('/dashboard/' + data.user.role);
        } catch (e) {
          window.location.href = '/dashboard/' + data.user.role;
        }
      } else {
        setErrorMsg("Login/Signup failed");
      }
    } catch (err) {
      setErrorMsg("Network error");
    }
    setIsLoading(false);
  }

  // Direct demo login (doesn't rely on setState timing)
  const signInAsDemo = async () => {
    setIsLoading(true);
    setErrorMsg("");
    const backendBase = (typeof window !== 'undefined' && window.location.hostname === 'localhost') ? 'http://localhost:5001' : '';
    const url = `${backendBase}/api/auth/login`;
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: demoPatient.email, password: demoPatient.password })
      });
      const data = await res.json();
      if (data.token && data.user && data.user.role) {
        localStorage.setItem('token', data.token);
        try {
          router.push('/dashboard/' + data.user.role);
        } catch (e) {
          window.location.href = '/dashboard/' + data.user.role;
        }
      } else {
        setErrorMsg('Demo login failed');
      }
    } catch (err) {
      setErrorMsg('Network error');
    }
    setIsLoading(false);
  }

  const fillDemoLogin = () => {
    setFormData((prev) => ({ ...prev, email: demoPatient.email, password: demoPatient.password }));
    setActiveTab('login');
  }

  const prefillDemoSignup = () => {
    // Prefill signup form with demo patient data. Note: if the seeded user already exists, signup will fail — change email to create a new account.
    setFormData((prev) => ({
      ...prev,
      name: demoPatient.name,
      email: demoPatient.email,
      password: demoPatient.password,
      confirmPassword: demoPatient.password,
      phone: demoPatient.phone,
      age: demoPatient.age,
      gender: demoPatient.gender,
      adhaar: demoPatient.adhaar,
      role: 'patient'
    }));
    setActiveTab('signup');
  }

  const isSignupValid = () => {
    if (!formData.role || !formData.email || !formData.password || !formData.confirmPassword) return false;
    if (formData.password !== formData.confirmPassword) return false;
    if (!formData.name) return false;
    if (formData.role === "patient") {
      return formData.phone && formData.age && formData.gender && formData.adhaar;
    }
    if (formData.role === "doctor") {
      return formData.specialization && formData.licenseNumber && formData.phone && formData.age;
    }
    if (formData.role === "asha") {
      return formData.workerId && formData.assignedVillage && formData.phone;
    }
    return true;
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

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
                  {/* Role is not required on login; server determines role from account */}

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
                    disabled={isLoading || !formData.email || !formData.password}
                  >
                    {isLoading ? "Signing In..." : "Sign In"}
                  </Button>

                  <div className="flex items-center justify-between mt-2 space-x-2">
                    <Button variant="outline" size="sm" onClick={fillDemoLogin}>Fill Demo</Button>
                    <Button variant="ghost" size="sm" onClick={signInAsDemo}>{isLoading ? 'Signing In...' : 'Sign in as Demo'}</Button>
                  </div>

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
                  {signupSuccess && (
                    <div className="bg-green-100 text-green-800 p-3 rounded text-center mb-2">
                      Your account is created! Redirecting to login...
                    </div>
                  )}
                  {/* Account exists dialog */}
                  <Dialog open={showExists} onOpenChange={(open) => setShowExists(open)}>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Account Already Exists</DialogTitle>
                        <DialogDescription>{existsMessage || 'An account with this email already exists. Try logging in instead.'}</DialogDescription>
                      </DialogHeader>
                      <div className="mt-4 flex justify-end">
                        <Button onClick={() => { setShowExists(false); setActiveTab('login'); }}>Go to Login</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  {/* Role at the top */}
                  <Label>Role</Label>
                  <Select onValueChange={(v) => handleInputChange("role", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="patient">Patient</SelectItem>
                      <SelectItem value="doctor">Doctor</SelectItem>
                      <SelectItem value="asha">ASHA Worker</SelectItem>
                    </SelectContent>
                  </Select>


                  {/* Name field for all roles */}
                  <Label>Name</Label>
                  <Input
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />
                  {formData.role === "patient" && (
                    <>
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
                      <div className="mt-2">
                        <Label>Address</Label>
                        <AddressAutocomplete onChange={handleAddressChange} />
                        {formData.address && typeof formData.address === 'object' && (formData.address as any).pincode && (
                          <>
                            <Label className="mt-2">Pincode</Label>
                            <Input value={(formData.address as any).pincode} disabled />
                          </>
                        )}
                      </div>
                    </>
                  )}

                  {/* Doctor fields */}
                  {formData.role === "doctor" && (
                    <>
                      <Label>Specialization</Label>
                      <Input
                        placeholder="e.g. Cardiologist, Dermatologist"
                        value={formData.specialization}
                        onChange={(e) => handleInputChange("specialization", e.target.value)}
                      />


                      <Label>Registration Number</Label>
                      <Input
                        placeholder="Enter your medical registration number"
                        value={formData.licenseNumber}
                        onChange={(e) => handleInputChange("licenseNumber", e.target.value)}
                      />

                      <Label>Age</Label>
                      <Input
                        type="number"
                        placeholder="Enter your age"
                        value={formData.age}
                        onChange={(e) => handleInputChange("age", e.target.value)}
                      />

                      <Label>Gender</Label>
                      <Select value={formData.gender || ""} onValueChange={value => handleInputChange("gender", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>

                      <Label>Phone</Label>
                      <Input
                        type="tel"
                        placeholder="Enter your phone number"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                      />
                      <div className="mt-2">
                        <Label>Address</Label>
                        <AddressAutocomplete onChange={handleAddressChange} />
                        {formData.address && typeof formData.address === 'object' && (formData.address as any).pincode && (
                          <>
                            <Label className="mt-2">Pincode</Label>
                            <Input value={(formData.address as any).pincode} disabled />
                          </>
                        )}
                      </div>
                    </>
                  )}

                  {/* ASHA Worker fields */}
                  {formData.role === "asha" && (
                    <>
                      <Label>Worker ID</Label>
                      <Input
                        placeholder="Enter your ASHA Worker ID"
                        value={formData.workerId}
                        onChange={(e) => handleInputChange("workerId", e.target.value)}
                      />

                      <Label>Assigned Village</Label>
                      <Input
                        placeholder="Enter your assigned village"
                        value={formData.assignedVillage}
                        onChange={(e) => handleInputChange("assignedVillage", e.target.value)}
                      />

                      <Label>Phone</Label>
                      <Input
                        type="tel"
                        placeholder="Enter your phone number"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                      />
                      <div className="mt-2">
                        <Label>Address</Label>
                        <AddressAutocomplete onChange={handleAddressChange} />
                        {formData.address && typeof formData.address === 'object' && (formData.address as any).pincode && (
                          <>
                            <Label className="mt-2">Pincode</Label>
                            <Input value={(formData.address as any).pincode} disabled />
                          </>
                        )}
                      </div>
                    </>
                  )}

                  {/* Common fields */}
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

                  {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <div className="text-red-600 text-sm mt-2">Passwords do not match</div>
                  )}
                  <Button
                    className="w-full"
                    onClick={() => handleSubmit("signup")}
                    disabled={isLoading || !isSignupValid()}
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                  <div className="flex items-center justify-between mt-2">
                    <Button variant="outline" size="sm" onClick={prefillDemoSignup}>Prefill sample patient</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
}
