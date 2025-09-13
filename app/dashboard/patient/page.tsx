"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, Upload, Calendar, FileText, Video, MessageCircle, Activity, User, CheckCircle } from "lucide-react"

export default function PatientDashboard() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [consultationType, setConsultationType] = useState("")
  const [selectedDoctor, setSelectedDoctor] = useState("")

  // Mock data
  const upcomingAppointments = [
    {
      id: 1,
      doctor: "Dr. Priya Sharma",
      specialty: "General Medicine",
      date: "2024-01-15",
      time: "10:00 AM",
      type: "Video Call",
      status: "confirmed",
    },
    {
      id: 2,
      doctor: "Dr. Rajesh Kumar",
      specialty: "Cardiology",
      date: "2024-01-18",
      time: "2:30 PM",
      type: "Chat",
      status: "pending",
    },
  ]

  const recentReports = [
    {
      id: 1,
      name: "Blood Test Report",
      date: "2024-01-10",
      type: "Lab Report",
      status: "reviewed",
    },
    {
      id: 2,
      name: "X-Ray Chest",
      date: "2024-01-08",
      type: "Imaging",
      status: "pending",
    },
  ]

  const healthMetrics = [
    { label: "Blood Pressure", value: "120/80", status: "normal", icon: Activity },
    { label: "Heart Rate", value: "72 bpm", status: "normal", icon: Heart },
    { label: "Blood Sugar", value: "95 mg/dL", status: "normal", icon: Activity },
    { label: "Oxygen Level", value: "98%", status: "normal", icon: Activity },
  ]

  const availableDoctors = [
    { id: 1, name: "Dr. Priya Sharma", specialty: "General Medicine", available: true },
    { id: 2, name: "Dr. Rajesh Kumar", specialty: "Cardiology", available: true },
    { id: 3, name: "Dr. Anita Patel", specialty: "Pediatrics", available: false },
    { id: 4, name: "Dr. Suresh Singh", specialty: "Orthopedics", available: true },
  ]

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "reviewed":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Patient Dashboard</h1>
              <p className="opacity-90">Welcome back, John Doe</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="secondary" size="sm">
                <MessageCircle className="h-4 w-4 mr-2" />
                Emergency Chat
              </Button>
              <div className="bg-primary-foreground/20 p-2 rounded-lg">
                <User className="h-6 w-6" />
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
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="consultation">Book Consultation</TabsTrigger>
            <TabsTrigger value="health">Health Data</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Health Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {healthMetrics.map((metric, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{metric.label}</p>
                        <p className="text-2xl font-bold">{metric.value}</p>
                      </div>
                      <div className="bg-primary/10 text-primary p-2 rounded-lg">
                        <metric.icon className="h-5 w-5" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="bg-primary/10 text-primary p-3 rounded-lg w-fit">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <CardTitle>Book Appointment</CardTitle>
                  <CardDescription>Schedule a consultation with our doctors</CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="bg-secondary/10 text-secondary p-3 rounded-lg w-fit">
                    <Upload className="h-6 w-6" />
                  </div>
                  <CardTitle>Upload Reports</CardTitle>
                  <CardDescription>Share your medical reports with doctors</CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="bg-primary/10 text-primary p-3 rounded-lg w-fit">
                    <Video className="h-6 w-6" />
                  </div>
                  <CardTitle>Video Call</CardTitle>
                  <CardDescription>Start an instant video consultation</CardDescription>
                </CardHeader>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Appointments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingAppointments.slice(0, 3).map((appointment) => (
                      <div key={appointment.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div>
                          <p className="font-medium">{appointment.doctor}</p>
                          <p className="text-sm text-muted-foreground">{appointment.specialty}</p>
                          <p className="text-sm text-muted-foreground">
                            {appointment.date} at {appointment.time}
                          </p>
                        </div>
                        <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentReports.map((report) => (
                      <div key={report.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{report.name}</p>
                            <p className="text-sm text-muted-foreground">{report.date}</p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(report.status)}>{report.status}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="appointments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Appointments</CardTitle>
                <CardDescription>View and manage your scheduled appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingAppointments.map((appointment) => (
                    <div key={appointment.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="bg-primary/10 text-primary p-2 rounded-lg">
                            {appointment.type === "Video Call" ? (
                              <Video className="h-5 w-5" />
                            ) : (
                              <MessageCircle className="h-5 w-5" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold">{appointment.doctor}</h3>
                            <p className="text-muted-foreground">{appointment.specialty}</p>
                            <p className="text-sm text-muted-foreground">
                              {appointment.date} at {appointment.time} • {appointment.type}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
                          {appointment.status === "confirmed" && (
                            <Button size="sm">{appointment.type === "Video Call" ? "Join Call" : "Start Chat"}</Button>
                          )}
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
                <CardTitle>Upload Medical Reports</CardTitle>
                <CardDescription>Share your medical documents with healthcare providers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="report-file">Select File</Label>
                  <Input id="report-file" type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileUpload} />
                  {selectedFile && <p className="text-sm text-muted-foreground">Selected: {selectedFile.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="report-type">Report Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blood-test">Blood Test</SelectItem>
                      <SelectItem value="xray">X-Ray</SelectItem>
                      <SelectItem value="mri">MRI Scan</SelectItem>
                      <SelectItem value="ct-scan">CT Scan</SelectItem>
                      <SelectItem value="ecg">ECG</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="report-notes">Additional Notes</Label>
                  <Textarea id="report-notes" placeholder="Any additional information about this report..." />
                </div>

                <Button className="w-full" disabled={!selectedFile}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Report
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>My Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentReports.map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-6 w-6 text-muted-foreground" />
                        <div>
                          <h3 className="font-medium">{report.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {report.type} • Uploaded on {report.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(report.status)}>{report.status}</Badge>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="consultation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Book New Consultation</CardTitle>
                <CardDescription>Schedule an appointment with our healthcare professionals</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="consultation-type">Consultation Type</Label>
                  <Select onValueChange={setConsultationType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select consultation type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="video">Video Call</SelectItem>
                      <SelectItem value="chat">Chat Consultation</SelectItem>
                      <SelectItem value="phone">Phone Call</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="doctor-select">Select Doctor</Label>
                  <Select onValueChange={setSelectedDoctor}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableDoctors.map((doctor) => (
                        <SelectItem key={doctor.id} value={doctor.id.toString()} disabled={!doctor.available}>
                          <div className="flex items-center justify-between w-full">
                            <span>{doctor.name}</span>
                            <span className="text-sm text-muted-foreground ml-2">{doctor.specialty}</span>
                            {doctor.available && <div className="w-2 h-2 bg-green-500 rounded-full ml-2" />}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="appointment-date">Preferred Date</Label>
                  <Input id="appointment-date" type="date" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="appointment-time">Preferred Time</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time slot" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="09:00">9:00 AM</SelectItem>
                      <SelectItem value="10:00">10:00 AM</SelectItem>
                      <SelectItem value="11:00">11:00 AM</SelectItem>
                      <SelectItem value="14:00">2:00 PM</SelectItem>
                      <SelectItem value="15:00">3:00 PM</SelectItem>
                      <SelectItem value="16:00">4:00 PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="symptoms">Symptoms/Reason for Visit</Label>
                  <Textarea id="symptoms" placeholder="Describe your symptoms or reason for consultation..." />
                </div>

                <Button className="w-full" disabled={!consultationType || !selectedDoctor}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Book Appointment
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="health" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Current Vitals</CardTitle>
                  <CardDescription>Latest readings from your connected devices</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {healthMetrics.map((metric, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="bg-primary/10 text-primary p-2 rounded-lg">
                            <metric.icon className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium">{metric.label}</p>
                            <p className="text-sm text-muted-foreground">Last updated: 2 hours ago</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{metric.value}</p>
                          <div className="flex items-center space-x-1">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm text-green-600">Normal</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Health Trends</CardTitle>
                  <CardDescription>Track your health metrics over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center py-8 text-muted-foreground">
                      <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Health trend charts will be displayed here</p>
                      <p className="text-sm">Connect IoT devices to see your data</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Connected Devices</CardTitle>
                <CardDescription>Manage your IoT health monitoring devices</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="bg-green-100 text-green-600 p-2 rounded-lg">
                        <Activity className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">Blood Pressure Monitor</p>
                        <p className="text-sm text-muted-foreground">Connected</p>
                      </div>
                    </div>
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                        <Heart className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">Heart Rate Monitor</p>
                        <p className="text-sm text-muted-foreground">Connected</p>
                      </div>
                    </div>
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
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
