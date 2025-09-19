"use client"

import { useState, useEffect } from "react"
type Medicine = {
  name: string;
  dosage: string;
  instructions: string;
};

type Prescription = {
  _id: string;
  patient: string;
  medicines: Medicine[];
  location?: string;
};

// Add address type
type Address = {
  street: string;
  city: string;
  state: string;
  pincode: string;
};

type ASHAProfile = {
  name: string;
  address: Address;
  assignedPrescriptions: Prescription[];
};

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Users, MapPin, FileText, Activity, Heart, Baby, UserCheck, AlertTriangle, Upload } from "lucide-react"


export default function ASHADashboard() {
  const [selectedVillage, setSelectedVillage] = useState("")
  const [newPatientData, setNewPatientData] = useState({
    name: "",
    age: "",
    gender: "",
    village: "",
    phone: "",
    condition: "",
    vitals: {
      bp: "",
      temperature: "",
      weight: "",
      height: "",
    },
  })
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [ashaProfile, setAshaProfile] = useState<ASHAProfile | null>(null);
  const [showDelivery, setShowDelivery] = useState<string | null>(null);
  const [deliveryStatus, setDeliveryStatus] = useState<{ [key: string]: boolean | null }>({});

  useEffect(() => {
    fetch("/api/prescriptions/asha") // API to get prescriptions for logged-in ASHA worker
      .then((res) => res.json())
      .then((data) => setPrescriptions(data.prescriptions))
  }, [])

  useEffect(() => {
    // Fetch ASHA profile with address and assigned prescriptions
    fetch("/api/asha/profile")
      .then(res => res.json())
      .then(data => setAshaProfile(data));
  }, []);


  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "follow-up":
        return "bg-yellow-100 text-yellow-800"
      case "monitoring":
        return "bg-blue-100 text-blue-800"
      case "stable":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handlePatientSubmit = () => {
    console.log("New patient data:", newPatientData)
    // Reset form
    setNewPatientData({
      name: "",
      age: "",
      gender: "",
      village: "",
      phone: "",
      condition: "",
      vitals: { bp: "", temperature: "", weight: "", height: "" },
    })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">ASHA Worker Dashboard</h1>
              <p className="opacity-90">Sunita Devi - Community Health Worker</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="secondary" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Sync Data
              </Button>
              <div className="bg-primary-foreground/20 p-2 rounded-lg">
                <Users className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="patients">Patients</TabsTrigger>
            <TabsTrigger value="field-data">Field Data</TabsTrigger>
            <TabsTrigger value="surveys">Surveys</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Dashboard Stats - Placeholder */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card><CardContent className="p-4">No stats available.</CardContent></Card>
            </div>

            {/* Village Coverage - Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card><CardContent>No village stats available.</CardContent></Card>
              <Card><CardContent>No health metrics available.</CardContent></Card>
            </div>

            {/* Recent Activities and Disease Distribution - Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card><CardContent>No recent activities available.</CardContent></Card>
              <Card><CardContent>No disease data available.</CardContent></Card>
            </div>

            {/* Monthly Trends - Placeholder */}
            <Card><CardContent>No monthly trends available.</CardContent></Card>
          </TabsContent>

          <TabsContent value="patients" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Patient Management</h2>
                <p className="text-muted-foreground">Track and manage patients in your assigned villages</p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Users className="h-4 w-4 mr-2" />
                    Add New Patient
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Patient</DialogTitle>
                    <DialogDescription>Register a new patient in the system</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="patient-name">Full Name</Label>
                        <Input
                          id="patient-name"
                          value={newPatientData.name}
                          onChange={(e) => setNewPatientData({ ...newPatientData, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="patient-age">Age</Label>
                        <Input
                          id="patient-age"
                          type="number"
                          value={newPatientData.age}
                          onChange={(e) => setNewPatientData({ ...newPatientData, age: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="patient-gender">Gender</Label>
                        <Select onValueChange={(value) => setNewPatientData({ ...newPatientData, gender: value })}>
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
                        <Label htmlFor="patient-village">Village</Label>
                        <Select onValueChange={(value) => setNewPatientData({ ...newPatientData, village: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select village" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="nabha-central">Nabha Central</SelectItem>
                            <SelectItem value="rajpura">Rajpura</SelectItem>
                            <SelectItem value="samana">Samana</SelectItem>
                            <SelectItem value="ghagga">Ghagga</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="patient-phone">Phone Number</Label>
                      <Input
                        id="patient-phone"
                        value={newPatientData.phone}
                        onChange={(e) => setNewPatientData({ ...newPatientData, phone: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="patient-condition">Health Condition</Label>
                      <Textarea
                        id="patient-condition"
                        value={newPatientData.condition}
                        onChange={(e) => setNewPatientData({ ...newPatientData, condition: e.target.value })}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="patient-bp">Blood Pressure</Label>
                        <Input
                          id="patient-bp"
                          placeholder="120/80"
                          value={newPatientData.vitals.bp}
                          onChange={(e) =>
                            setNewPatientData({
                              ...newPatientData,
                              vitals: { ...newPatientData.vitals, bp: e.target.value },
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="patient-temp">Temperature (°F)</Label>
                        <Input
                          id="patient-temp"
                          placeholder="98.6"
                          value={newPatientData.vitals.temperature}
                          onChange={(e) =>
                            setNewPatientData({
                              ...newPatientData,
                              vitals: { ...newPatientData.vitals, temperature: e.target.value },
                            })
                          }
                        />
                      </div>
                    </div>

                    <Button onClick={handlePatientSubmit} className="w-full">
                      Register Patient
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* No patient data available */}
                  <div className="border rounded-lg p-4 text-center text-muted-foreground">No patients available.</div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="field-data" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Field Data Collection</CardTitle>
                <CardDescription>Record patient vitals and health data during field visits</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="field-patient">Select Patient</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose patient" />
                      </SelectTrigger>
                      <SelectContent>
                        {/* No patient options available */}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="visit-date">Visit Date</Label>
                    <Input id="visit-date" type="date" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="field-bp">Blood Pressure</Label>
                    <Input id="field-bp" placeholder="120/80 mmHg" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="field-temp">Temperature</Label>
                    <Input id="field-temp" placeholder="98.6°F" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="field-weight">Weight</Label>
                    <Input id="field-weight" placeholder="65 kg" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="field-height">Height</Label>
                    <Input id="field-height" placeholder="165 cm" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="field-symptoms">Symptoms/Observations</Label>
                  <Textarea id="field-symptoms" placeholder="Record patient symptoms and observations..." />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="field-treatment">Treatment Given</Label>
                  <Textarea id="field-treatment" placeholder="Describe treatment or advice provided..." />
                </div>

                <div className="space-y-2">
                  <Label>Follow-up Required</Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="follow-up" />
                    <Label htmlFor="follow-up">Schedule follow-up visit</Label>
                  </div>
                </div>

                <Button className="w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  Save Field Data
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="surveys" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Health Surveys & Awareness</CardTitle>
                <CardDescription>Conduct health surveys and awareness programs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Maternal Health Survey</CardTitle>
                      <CardDescription>Survey for pregnant and lactating mothers</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span>Participants Target</span>
                          <span className="font-bold">50</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Completed</span>
                          <span className="font-bold text-green-600">35</span>
                        </div>
                        <Progress value={70} />
                        <Button size="sm" className="w-full">
                          Continue Survey
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Child Immunization</CardTitle>
                      <CardDescription>Track vaccination status of children</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span>Children Target</span>
                          <span className="font-bold">80</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Vaccinated</span>
                          <span className="font-bold text-green-600">64</span>
                        </div>
                        <Progress value={80} />
                        <Button size="sm" className="w-full">
                          Update Records
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Awareness Activities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 border rounded-lg">
                        <Baby className="h-8 w-8 mx-auto mb-2 text-pink-600" />
                        <h3 className="font-semibold">Maternal Care</h3>
                        <p className="text-sm text-muted-foreground">15 sessions conducted</p>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <Heart className="h-8 w-8 mx-auto mb-2 text-red-600" />
                        <h3 className="font-semibold">Heart Health</h3>
                        <p className="text-sm text-muted-foreground">12 sessions conducted</p>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <Activity className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                        <h3 className="font-semibold">Hygiene & Sanitation</h3>
                        <p className="text-sm text-muted-foreground">18 sessions conducted</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Generate Reports</CardTitle>
                <CardDescription>Create monthly and quarterly reports for health authorities</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="report-type">Report Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select report type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly Activity Report</SelectItem>
                        <SelectItem value="quarterly">Quarterly Health Report</SelectItem>
                        <SelectItem value="maternal">Maternal Health Report</SelectItem>
                        <SelectItem value="immunization">Immunization Report</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="report-period">Period</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="jan-2024">January 2024</SelectItem>
                        <SelectItem value="dec-2023">December 2023</SelectItem>
                        <SelectItem value="q4-2023">Q4 2023</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-6 w-6 text-muted-foreground" />
                      <div>
                        <h3 className="font-semibold">December 2023 Monthly Report</h3>
                        <p className="text-sm text-muted-foreground">Generated on 2024-01-05</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-green-100 text-green-800">Submitted</Badge>
                      <Button variant="outline" size="sm">
                        Download
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-6 w-6 text-muted-foreground" />
                      <div>
                        <h3 className="font-semibold">Q4 2023 Immunization Report</h3>
                        <p className="text-sm text-muted-foreground">Generated on 2024-01-03</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-green-100 text-green-800">Submitted</Badge>
                      <Button variant="outline" size="sm">
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Assigned Prescriptions (from backend) */}
        <h2 className="text-xl font-bold mt-8 mb-4">Assigned Prescriptions</h2>
        {prescriptions.length === 0 ? (
          <p>No prescriptions assigned.</p>
        ) : (
          prescriptions.map((p: Prescription) => (
            <Card key={p._id} className="mb-4">
              <CardHeader>
                <CardTitle>Patient: {p.patient}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul>
                  {p.medicines.map((m: Medicine, i: number) => (
                    <li key={i}>
                      {m.name} - {m.dosage} ({m.instructions})
                    </li>
                  ))}
                </ul>
                {p.location && <div className="text-muted-foreground">Location: {p.location}</div>}
              </CardContent>
            </Card>
          ))
        )}

        {/* ASHA Profile (from backend) */}
        {ashaProfile && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-2">ASHA Profile</h2>
            <div className="mb-2">Name: {ashaProfile.name}</div>
            <div className="mb-2">Address: {ashaProfile.address.street}, {ashaProfile.address.city}, {ashaProfile.address.state} - {ashaProfile.address.pincode}</div>
          </div>
        )}
      </div>
    </div>
  )
}
