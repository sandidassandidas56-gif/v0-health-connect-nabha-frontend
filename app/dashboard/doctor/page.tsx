"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Stethoscope, Calendar, FileText, Video, MessageCircle, User, Pill, Eye, Send } from "lucide-react"

export default function DoctorDashboard() {
  const [selectedPatient, setSelectedPatient] = useState<any>(null)
  const [prescriptionData, setPrescriptionData] = useState({
    medication: "",
    dosage: "",
    frequency: "",
    duration: "",
    instructions: "",
  })

  // Mock data
  const todayAppointments = [
    {
      id: 1,
      patient: "John Doe",
      age: 45,
      time: "10:00 AM",
      type: "Video Call",
      status: "upcoming",
      symptoms: "Chest pain, shortness of breath",
      priority: "high",
    },
    {
      id: 2,
      patient: "Sarah Smith",
      age: 32,
      time: "11:30 AM",
      type: "Chat",
      status: "in-progress",
      symptoms: "Fever, headache",
      priority: "medium",
    },
    {
      id: 3,
      patient: "Raj Patel",
      age: 28,
      time: "2:00 PM",
      type: "Video Call",
      status: "upcoming",
      symptoms: "Regular checkup",
      priority: "low",
    },
  ]

  const patientHistory = [
    {
      id: 1,
      name: "John Doe",
      age: 45,
      lastVisit: "2024-01-10",
      condition: "Hypertension",
      reports: ["Blood Test", "ECG"],
      vitals: { bp: "140/90", hr: "78", temp: "98.6°F", spo2: "97%" },
    },
    {
      id: 2,
      name: "Sarah Smith",
      age: 32,
      lastVisit: "2024-01-08",
      condition: "Migraine",
      reports: ["MRI Scan"],
      vitals: { bp: "120/80", hr: "72", temp: "99.2°F", spo2: "98%" },
    },
  ]

  const pendingReports = [
    {
      id: 1,
      patient: "John Doe",
      reportType: "Blood Test",
      uploadDate: "2024-01-12",
      status: "pending",
    },
    {
      id: 2,
      patient: "Sarah Smith",
      reportType: "X-Ray",
      uploadDate: "2024-01-11",
      status: "pending",
    },
  ]

  const dashboardStats = [
    { label: "Today's Appointments", value: "8", icon: Calendar, color: "text-blue-600" },
    { label: "Pending Reports", value: "12", icon: FileText, color: "text-orange-600" },
    { label: "Active Patients", value: "156", icon: User, color: "text-green-600" },
    { label: "Consultations This Week", value: "42", icon: Stethoscope, color: "text-purple-600" },
  ]

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
      case "upcoming":
        return "bg-blue-100 text-blue-800"
      case "in-progress":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handlePrescriptionSubmit = () => {
    // Handle prescription submission
    console.log("Prescription submitted:", prescriptionData)
    setPrescriptionData({
      medication: "",
      dosage: "",
      frequency: "",
      duration: "",
      instructions: "",
    })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Doctor Dashboard</h1>
              <p className="opacity-90">Dr. Priya Sharma - General Medicine</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="secondary" size="sm">
                <MessageCircle className="h-4 w-4 mr-2" />
                Emergency Alerts
              </Button>
              <div className="bg-primary-foreground/20 p-2 rounded-lg">
                <Stethoscope className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="patients">Patients</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Dashboard Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {dashboardStats.map((stat, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                      </div>
                      <div className={`p-2 rounded-lg bg-muted ${stat.color}`}>
                        <stat.icon className="h-5 w-5" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Today's Schedule */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Today's Appointments</CardTitle>
                  <CardDescription>Your scheduled consultations for today</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {todayAppointments.slice(0, 3).map((appointment) => (
                      <div key={appointment.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <div className="bg-primary/10 text-primary p-2 rounded-lg">
                              {appointment.type === "Video Call" ? (
                                <Video className="h-4 w-4" />
                              ) : (
                                <MessageCircle className="h-4 w-4" />
                              )}
                            </div>
                            <div>
                              <h3 className="font-semibold">{appointment.patient}</h3>
                              <p className="text-sm text-muted-foreground">Age: {appointment.age}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{appointment.time}</p>
                            <Badge className={getPriorityColor(appointment.priority)}>{appointment.priority}</Badge>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{appointment.symptoms}</p>
                        <div className="flex items-center justify-between">
                          <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
                          {appointment.status === "upcoming" && (
                            <Button size="sm">{appointment.type === "Video Call" ? "Start Call" : "Start Chat"}</Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pending Reports</CardTitle>
                  <CardDescription>Patient reports awaiting your review</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pendingReports.map((report) => (
                      <div key={report.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{report.patient}</p>
                            <p className="text-sm text-muted-foreground">
                              {report.reportType} • {report.uploadDate}
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          Review
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="bg-primary/10 text-primary p-3 rounded-lg w-fit">
                    <Video className="h-6 w-6" />
                  </div>
                  <CardTitle>Start Consultation</CardTitle>
                  <CardDescription>Begin a video or chat consultation</CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="bg-secondary/10 text-secondary p-3 rounded-lg w-fit">
                    <Pill className="h-6 w-6" />
                  </div>
                  <CardTitle>Write Prescription</CardTitle>
                  <CardDescription>Create digital prescriptions for patients</CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="bg-primary/10 text-primary p-3 rounded-lg w-fit">
                    <FileText className="h-6 w-6" />
                  </div>
                  <CardTitle>Review Reports</CardTitle>
                  <CardDescription>Analyze patient medical reports</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="appointments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>All Appointments</CardTitle>
                <CardDescription>Manage your consultation schedule</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {todayAppointments.map((appointment) => (
                    <div key={appointment.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="bg-primary/10 text-primary p-3 rounded-lg">
                            {appointment.type === "Video Call" ? (
                              <Video className="h-5 w-5" />
                            ) : (
                              <MessageCircle className="h-5 w-5" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{appointment.patient}</h3>
                            <p className="text-muted-foreground">
                              Age: {appointment.age} • {appointment.type}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">{appointment.symptoms}</p>
                          </div>
                        </div>
                        <div className="text-right space-y-2">
                          <p className="font-medium text-lg">{appointment.time}</p>
                          <div className="flex items-center space-x-2">
                            <Badge className={getPriorityColor(appointment.priority)}>{appointment.priority}</Badge>
                            <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              View History
                            </Button>
                            {appointment.status === "upcoming" && (
                              <Button size="sm">
                                {appointment.type === "Video Call" ? "Start Call" : "Start Chat"}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="patients" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Patient Records</CardTitle>
                <CardDescription>View and manage patient information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Input placeholder="Search patients..." className="max-w-sm" />
                    <Select>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Filter by condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Conditions</SelectItem>
                        <SelectItem value="hypertension">Hypertension</SelectItem>
                        <SelectItem value="diabetes">Diabetes</SelectItem>
                        <SelectItem value="migraine">Migraine</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {patientHistory.map((patient) => (
                    <div key={patient.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="bg-primary/10 text-primary p-3 rounded-lg">
                            <User className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{patient.name}</h3>
                            <p className="text-muted-foreground">
                              Age: {patient.age} • Last visit: {patient.lastVisit}
                            </p>
                            <p className="text-sm font-medium text-primary">{patient.condition}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                            <div>BP: {patient.vitals.bp}</div>
                            <div>HR: {patient.vitals.hr}</div>
                            <div>Temp: {patient.vitals.temp}</div>
                            <div>SpO2: {patient.vitals.spo2}</div>
                          </div>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" onClick={() => setSelectedPatient(patient)}>
                                View Details
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>{patient.name} - Patient Details</DialogTitle>
                                <DialogDescription>Complete patient information and history</DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-semibold mb-2">Basic Information</h4>
                                    <p>Age: {patient.age}</p>
                                    <p>Condition: {patient.condition}</p>
                                    <p>Last Visit: {patient.lastVisit}</p>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold mb-2">Current Vitals</h4>
                                    <p>Blood Pressure: {patient.vitals.bp}</p>
                                    <p>Heart Rate: {patient.vitals.hr}</p>
                                    <p>Temperature: {patient.vitals.temp}</p>
                                    <p>Oxygen Saturation: {patient.vitals.spo2}</p>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-semibold mb-2">Recent Reports</h4>
                                  <div className="flex space-x-2">
                                    {patient.reports.map((report, index) => (
                                      <Badge key={index} variant="outline">
                                        {report}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Medical Reports Review</CardTitle>
                <CardDescription>Review and analyze patient medical reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingReports.map((report) => (
                    <div key={report.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="bg-orange-100 text-orange-600 p-3 rounded-lg">
                            <FileText className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{report.patient}</h3>
                            <p className="text-muted-foreground">{report.reportType}</p>
                            <p className="text-sm text-muted-foreground">Uploaded: {report.uploadDate}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-orange-100 text-orange-800">{report.status}</Badge>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View Report
                          </Button>
                          <Button size="sm">Mark Reviewed</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="prescriptions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Digital Prescription</CardTitle>
                <CardDescription>Create and manage patient prescriptions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="patient-select">Select Patient</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose patient" />
                      </SelectTrigger>
                      <SelectContent>
                        {patientHistory.map((patient) => (
                          <SelectItem key={patient.id} value={patient.id.toString()}>
                            {patient.name} - {patient.condition}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="medication">Medication Name</Label>
                    <Input
                      id="medication"
                      placeholder="Enter medication name"
                      value={prescriptionData.medication}
                      onChange={(e) => setPrescriptionData({ ...prescriptionData, medication: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dosage">Dosage</Label>
                    <Input
                      id="dosage"
                      placeholder="e.g., 500mg"
                      value={prescriptionData.dosage}
                      onChange={(e) => setPrescriptionData({ ...prescriptionData, dosage: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="frequency">Frequency</Label>
                    <Select onValueChange={(value) => setPrescriptionData({ ...prescriptionData, frequency: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="once-daily">Once daily</SelectItem>
                        <SelectItem value="twice-daily">Twice daily</SelectItem>
                        <SelectItem value="thrice-daily">Thrice daily</SelectItem>
                        <SelectItem value="as-needed">As needed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration</Label>
                    <Input
                      id="duration"
                      placeholder="e.g., 7 days"
                      value={prescriptionData.duration}
                      onChange={(e) => setPrescriptionData({ ...prescriptionData, duration: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instructions">Special Instructions</Label>
                  <Textarea
                    id="instructions"
                    placeholder="Additional instructions for the patient..."
                    value={prescriptionData.instructions}
                    onChange={(e) => setPrescriptionData({ ...prescriptionData, instructions: e.target.value })}
                  />
                </div>

                <Button onClick={handlePrescriptionSubmit} className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Send Prescription
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Prescriptions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">John Doe</h3>
                        <p className="text-muted-foreground">Lisinopril 10mg - Once daily for 30 days</p>
                        <p className="text-sm text-muted-foreground">Prescribed on 2024-01-12</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Sent</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
