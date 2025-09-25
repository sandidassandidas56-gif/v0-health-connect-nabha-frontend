"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import dynamic from "next/dynamic"
// Dynamically import VideoCallModal to avoid SSR issues
const VideoCallModal = dynamic(() => import("@/components/VideoCallModal"), { ssr: false })
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, Upload, Calendar, FileText, Video, MessageCircle, Activity, User, CheckCircle, Phone, Users, FilePlus } from "lucide-react"
import io from "socket.io-client"
import MapPicker from '@/components/map-picker'

export default function PatientDashboard() {
  // State for real user info
  const [user, setUser] = useState<any>(null);

  const [address, setAddress] = useState<any>({ street: '', city: '', state: '', pincode: '', coords: { lat: 30.3573, lng: 76.0700 } })
  useEffect(() => {
    if (user && user.address) setAddress(user.address)
  }, [user])

  useEffect(() => {
    // Get token from localStorage (or cookies)
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      fetch("http://localhost:5001/api/auth/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(data => setUser(data.user || data))
        .catch(() => setUser(null));
    }
  }, []);
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [consultationType, setConsultationType] = useState("")
  const [selectedDoctor, setSelectedDoctor] = useState("")
  const [videoCallOpen, setVideoCallOpen] = useState(false)
  const [videoCallRoomId, setVideoCallRoomId] = useState<string>("")
  const socketRef = useRef<any>(null)
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null)
  const [inCall, setInCall] = useState(false)

  // Open video call modal with a room ID
  const startVideoCall = (roomId: string) => {
    setVideoCallRoomId(roomId)
    setVideoCallOpen(true)
  }
  const endVideoCall = () => {
    setVideoCallOpen(false)
    setVideoCallRoomId("")
  }

  useEffect(() => {
    socketRef.current = io("http://localhost:3001") // Update to your signaling server URL
    socketRef.current.on("offer", async (data: any) => {
      if (!peerConnectionRef.current) startPeerConnection()
      await peerConnectionRef.current?.setRemoteDescription(new RTCSessionDescription(data.offer))
      const answer = await peerConnectionRef.current?.createAnswer()
      await peerConnectionRef.current?.setLocalDescription(answer)
      socketRef.current.emit("answer", { answer, to: data.from })
    })
    socketRef.current.on("answer", async (data: any) => {
      await peerConnectionRef.current?.setRemoteDescription(new RTCSessionDescription(data.answer))
    })
    socketRef.current.on("ice-candidate", (data: any) => {
      peerConnectionRef.current?.addIceCandidate(new RTCIceCandidate(data.candidate))
    })
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, [])

  const startPeerConnection = async () => {
    // default: video + audio. If we need audio-only, caller will call startPeerConnectionWithOptions
    peerConnectionRef.current = new RTCPeerConnection()
    peerConnectionRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current.emit("ice-candidate", { candidate: event.candidate })
      }
    }
    peerConnectionRef.current.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0]
      }
    }
  const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream
    }
    stream.getTracks().forEach((track) => {
      peerConnectionRef.current?.addTrack(track, stream)
    })
  }

  // New helper to start a peer connection with options (audioOnly)
  const startPeerConnectionWithOptions = async (opts: { audioOnly?: boolean } = {}) => {
    peerConnectionRef.current = new RTCPeerConnection()
    peerConnectionRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current.emit("ice-candidate", { candidate: event.candidate })
      }
    }
    peerConnectionRef.current.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0]
      }
    }
    const stream = await navigator.mediaDevices.getUserMedia({ video: opts.audioOnly ? false : true, audio: true })
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream
    }
    stream.getTracks().forEach((track) => {
      peerConnectionRef.current?.addTrack(track, stream)
    })
  }

  const handleVCClick = async (doctorId: string) => {
    setInCall(true)
    // set modal and room id so UI shows
    setVideoCallRoomId(doctorId)
    setVideoCallOpen(true)
    await startPeerConnectionWithOptions({ audioOnly: false })
    const offer = await peerConnectionRef.current?.createOffer()
    await peerConnectionRef.current?.setLocalDescription(offer)
    socketRef.current.emit("offer", { offer, to: doctorId })
  }

  const handleAudioCall = async (doctorId: string) => {
    setInCall(true)
    setVideoCallRoomId(doctorId)
    setVideoCallOpen(true)
    await startPeerConnectionWithOptions({ audioOnly: true })
    const offer = await peerConnectionRef.current?.createOffer()
    await peerConnectionRef.current?.setLocalDescription(offer)
    socketRef.current.emit("offer", { offer, to: doctorId })
  }

  // Example: Notify doctor when patient clicks consult
  const handleConsult = (doctorId: string) => {
    // ...existing consult logic...
    if (socketRef.current) {
      socketRef.current.emit("patient-consult", { doctorId, patientId: "CURRENT_PATIENT_ID" })
    }
  }

  // Mock data

  // Mock vitals for demo (replace with backend data when available)
  const mockVitals = {
    bp: '128/82',
    heartRate: 78,
    bloodSugar: 110,
    temperature: 98.4,
  }

  // Mock upcoming appointments and reports for demo (stateful so buttons can modify)
  const [mockAppointments, setMockAppointments] = useState([
    { id: 'a1', date: '2025-10-02', time: '10:00', doctor: 'Dr. Priya Sharma', status: 'confirmed', type: 'Video' },
    { id: 'a2', date: '2025-10-10', time: '14:30', doctor: 'Dr. Rajesh Kumar', status: 'pending', type: 'In-person' },
    { id: 'a3', date: '2025-11-01', time: '09:00', doctor: 'Dr. Neha Verma', status: 'confirmed', type: 'Phone' },
  ])

  const [mockReports, setMockReports] = useState([
    { id: 'r1', title: 'Complete Blood Count', date: '2025-09-15', type: 'Lab', file: 'cbc_2025_09_15.pdf' },
    { id: 'r2', title: 'Chest X-Ray', date: '2025-08-20', type: 'Imaging', file: 'xray_2025_08_20.jpg' },
    { id: 'r3', title: 'ECG Report', date: '2025-07-12', type: 'Cardio', file: 'ecg_2025_07_12.pdf' },
  ])

  // Local state for booking form
  const [appointmentDateState, setAppointmentDateState] = useState('')
  const [appointmentTimeState, setAppointmentTimeState] = useState('')

  // Handlers for buttons
  const handleDownload = (report: any) => {
    // Simulate a download by creating a blob and clicking a link
    const content = `Report: ${report.title}\nType: ${report.type}\nDate: ${report.date}`
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = report.file || `${report.id}.txt`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  const handleUploadReport = () => {
    if (!selectedFile) {
      alert('Select a file first')
      return
    }
    const newReport = {
      id: `r${Date.now()}`,
      title: selectedFile.name,
      date: new Date().toISOString().slice(0, 10),
      type: 'Uploaded',
      file: selectedFile.name,
    }
    setMockReports(prev => [newReport, ...prev])
    setSelectedFile(null)
    alert('Report uploaded (demo)')
  }

  const handleSaveAddress = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const headers: any = { 'Content-Type': 'application/json' };
    if (token) headers.Authorization = `Bearer ${token}`;
    fetch('/api/patient/address', {
      method: 'PUT',
      headers,
      body: JSON.stringify({ address })
    }).then(async (res) => {
      if (res.ok) {
        const data = await res.json();
        setUser((prev: any) => ({ ...prev, address: data.address || address }))
        // success toast could be added
      } else {
        setUser((prev: any) => ({ ...prev, address }))
      }
    }).catch(() => setUser((prev: any) => ({ ...prev, address })))
  }

  const handleBookNow = () => {
    if (!consultationType || !selectedDoctor || !appointmentDateState) {
      alert('Select consultation type, doctor and date before booking')
      return
    }
    const newAppointment = {
      id: `a${Date.now()}`,
      date: appointmentDateState,
      time: appointmentTimeState || '09:00',
      doctor: selectedDoctor,
      status: 'pending',
      type: consultationType,
    }
    setMockAppointments(prev => [newAppointment, ...prev])
    alert('Appointment booked (demo)')
  }

  const handleCancelAppointment = (id: string) => {
    if (!confirm('Cancel this appointment?')) return
    setMockAppointments(prev => prev.filter(a => a.id !== id))
  }

  // TODO: Replace with real backend data for appointments, reports, health metrics, and available doctors

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
              <p className="opacity-90">Welcome back, {user?.address?.fullName || user?.name || "User"}</p>
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
            {/* Summary stats row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                      <div className="text-sm text-muted-foreground flex items-center gap-2"><Calendar className="h-4 w-4" />Appointments</div>
                    <div className="text-2xl font-bold">3</div>
                  </div>
                  <div className="bg-primary/10 text-primary p-3 rounded-lg">
                    <Calendar className="h-6 w-6" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground flex items-center gap-2"><Users className="h-4 w-4" />Patients</div>
                    <div className="text-2xl font-bold">3</div>
                  </div>
                  <div className="bg-secondary/10 text-secondary p-3 rounded-lg">
                    <Users className="h-6 w-6" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground flex items-center gap-2"><FileText className="h-4 w-4" />Reports</div>
                    <div className="text-2xl font-bold">2</div>
                  </div>
                  <div className="bg-accent/10 text-accent p-3 rounded-lg">
                    <FileText className="h-6 w-6" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground flex items-center gap-2"><FilePlus className="h-4 w-4" />Prescriptions</div>
                    <div className="text-2xl font-bold">3</div>
                  </div>
                  <div className="bg-yellow-100 text-yellow-800 p-3 rounded-lg">
                    <FilePlus className="h-6 w-6" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Address Card for Patient */}
            <div className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Address</CardTitle>
                  <CardDescription>Your saved address</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium">{address.street || address.formatted || 'No address set'}</div>
                      <div className="text-sm text-muted-foreground">{address.city ? `${address.city}, ${address.state} - ${address.pincode || ''}` : ''}</div>
                    </div>
                    <div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm">Edit</Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                          <DialogHeader>
                            <DialogTitle>Edit Address</DialogTitle>
                            <DialogDescription>Drag the marker to select location and update address fields</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <Input placeholder="Street" value={address.street || address.formatted || ''} onChange={(e) => setAddress({ ...address, street: e.target.value })} />
                            <div className="grid grid-cols-3 gap-2">
                              <Input placeholder="City" value={address.city || ''} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
                              <Input placeholder="State" value={address.state || ''} onChange={(e) => setAddress({ ...address, state: e.target.value })} />
                              <Input placeholder="Pincode" value={address.pincode || ''} onChange={(e) => setAddress({ ...address, pincode: e.target.value })} />
                            </div>
                            <MapPicker apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY} value={address.coords} onChange={(coords) => setAddress({ ...address, coords })} height={300} />
                            <div className="flex justify-end space-x-2">
                              <Button variant="outline">Cancel</Button>
                              <Button onClick={handleSaveAddress}>Save</Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            {/* Health Metrics */}
            {/* Health Metrics - Replace with backend data */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground">Blood Pressure</div>
                  <div className="text-xl font-bold">{mockVitals.bp}</div>
                  <div className="text-xs text-muted-foreground mt-2">Systolic / Diastolic</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground">Heart Rate</div>
                  <div className="text-xl font-bold">{mockVitals.heartRate} bpm</div>
                  <Progress value={Math.max(0, Math.min(100, Math.round((mockVitals.heartRate / 140) * 100)))} />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground">Blood Sugar</div>
                  <div className="text-xl font-bold">{mockVitals.bloodSugar} mg/dL</div>
                  <Progress value={Math.max(0, Math.min(100, Math.round((mockVitals.bloodSugar / 200) * 100)))} />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground">Temperature</div>
                  <div className="text-xl font-bold">{mockVitals.temperature} °F</div>
                  <Progress value={Math.max(0, Math.min(100, Math.round(((mockVitals.temperature - 95) / 10) * 100)))} />
                </CardContent>
              </Card>
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
                    {/* Upcoming Appointments - demo data */}
                    {mockAppointments.length === 0 ? (
                      <div>No upcoming appointments available.</div>
                    ) : (
                      <div className="space-y-2">
                        {mockAppointments.map(a => (
                          <div key={a.id} className="p-3 border rounded flex items-center justify-between">
                            <div>
                              <div className="font-medium">{a.doctor} • {a.type}</div>
                              <div className="text-sm text-muted-foreground">{a.date} • {a.time}</div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 rounded text-xs ${getStatusColor(a.status)}`}>{a.status}</span>
                              <Button size="sm" variant="ghost" onClick={() => handleVCClick(a.doctor)}>
                                <Video className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => handleAudioCall(a.doctor)}>
                                <Phone className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => handleCancelAppointment(a.id)}>Cancel</Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Recent Reports - demo data */}
                    {mockReports.length === 0 ? (
                      <div>No recent reports available.</div>
                    ) : (
                      <div className="space-y-2">
                        {mockReports.map(r => (
                          <div key={r.id} className="p-3 border rounded flex items-center justify-between">
                            <div>
                              <div className="font-medium">{r.title}</div>
                              <div className="text-sm text-muted-foreground">{r.type} • {r.date}</div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button variant="outline" size="sm" onClick={() => handleDownload(r)}>Download</Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
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
                  {/* My Appointments - demo data */}
                  {mockAppointments.length === 0 ? (
                    <div>No appointments available.</div>
                  ) : (
                    <div className="space-y-2">
                      {mockAppointments.map(a => (
                        <div key={a.id} className="p-3 border rounded flex items-center justify-between">
                          <div>
                            <div className="font-medium">{a.doctor} • {a.type}</div>
                            <div className="text-sm text-muted-foreground">{a.date} • {a.time}</div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded text-xs ${getStatusColor(a.status)}`}>{a.status}</span>
                            <Button size="sm" variant="ghost" onClick={() => handleCancelAppointment(a.id)}>Cancel</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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
                  <span onClick={handleUploadReport}>Upload Report</span>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>My Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* My Reports - demo data */}
                  {mockReports.length === 0 ? (
                    <div>No reports available.</div>
                  ) : (
                      <div className="space-y-2">
                      {mockReports.map(r => (
                        <div key={r.id} className="flex items-center justify-between p-3 border rounded">
                          <div>
                            <div className="font-medium">{r.title}</div>
                            <div className="text-sm text-muted-foreground">{r.type} • {r.date}</div>
                          </div>
                          <div>
                            <Button size="sm" variant="outline" onClick={() => handleDownload(r)}>Download</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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
                      {/* Select Doctor - Replace with backend data */}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="appointment-date">Preferred Date</Label>
                  <Input id="appointment-date" type="date" value={appointmentDateState} onChange={(e) => setAppointmentDateState(e.target.value)} />
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

                <Button className="w-full" onClick={handleBookNow}>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 border rounded">
                        <div className="text-sm text-muted-foreground">Latest Blood Pressure</div>
                        <div className="text-lg font-bold">{mockVitals.bp}</div>
                      </div>

                      <div className="p-4 border rounded">
                        <div className="text-sm text-muted-foreground">Latest Heart Rate</div>
                        <div className="text-lg font-bold">{mockVitals.heartRate} bpm</div>
                      </div>

                      <div className="p-4 border rounded">
                        <div className="text-sm text-muted-foreground">Latest Blood Sugar</div>
                        <div className="text-lg font-bold">{mockVitals.bloodSugar} mg/dL</div>
                      </div>

                      <div className="p-4 border rounded">
                        <div className="text-sm text-muted-foreground">Latest Temperature</div>
                        <div className="text-lg font-bold">{mockVitals.temperature} °F</div>
                      </div>
                    </div>
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
  );
}
