"use client"

// Removed duplicate import of useState
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
import MapPicker from '@/components/map-picker'
import io from "socket.io-client";
import { useEffect, useRef, useState } from "react";
import {
  mockDoctorProfile,
  mockAppointments,
  mockPatients,
  mockReports,
  mockPrescriptions,
} from "@/data/doctor-mock";
import dynamic from "next/dynamic"
// Dynamically import VideoCallModal to avoid SSR issues
const VideoCallModal = dynamic(() => import("@/components/VideoCallModal"), { ssr: false })

export default function DoctorDashboard() {
  const [videoCallOpen, setVideoCallOpen] = useState(false);
  const [videoCallRoomId, setVideoCallRoomId] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("overview");
  // Open video call modal with a room ID
  const startVideoCall = (roomId: string) => {
    setVideoCallRoomId(roomId);
    setVideoCallOpen(true);
  };
  const endVideoCall = () => {
    setVideoCallOpen(false);
    setVideoCallRoomId("");
  };
  const [selectedPatient, setSelectedPatient] = useState<any>(null)
  const [prescriptionData, setPrescriptionData] = useState({
    medication: "",
    dosage: "",
    frequency: "",
    duration: "",
    instructions: "",
  })
  const socketRef = useRef<any>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const [inCall, setInCall] = useState(false);

  // Real backend data state
  const [doctorInfo, setDoctorInfo] = useState<any>(mockDoctorProfile);
  const [appointments, setAppointments] = useState<any[]>(mockAppointments);
  const [patients, setPatients] = useState<any[]>(mockPatients);
  const [reports, setReports] = useState<any[]>(mockReports);
  const [prescriptions, setPrescriptions] = useState<any[]>(mockPrescriptions);
  const [usingMock, setUsingMock] = useState<boolean>(false);

  // Fetch all dashboard data from backend
  useEffect(() => {
    // Example endpoints, update as needed
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const getHeaders = () => token ? { Authorization: `Bearer ${token}` } : undefined;
    // Attempt to fetch real data; fall back to mock data if requests fail
    const tryFetch = async (url: string, setter: (v: any) => void, fallback: any) => {
      try {
        const res = await fetch(url, getHeaders() ? { headers: getHeaders() } : undefined);
        if (res.ok) {
          const data = await res.json();
          if (data && (Array.isArray(data) ? data.length > 0 : Object.keys(data).length > 0)) {
            setter(data);
            return;
          }
        }
      } catch (e) {
        // ignore
      }
      setter(fallback);
      setUsingMock(true);
    };

    tryFetch("http://localhost:5001/api/doctor/profile", setDoctorInfo, mockDoctorProfile);
    tryFetch("http://localhost:5001/api/doctor/appointments", setAppointments, mockAppointments);
    tryFetch("http://localhost:5001/api/doctor/patients", setPatients, mockPatients);
    tryFetch("http://localhost:5001/api/doctor/reports", setReports, mockReports);
    tryFetch("http://localhost:5001/api/doctor/prescriptions", setPrescriptions, mockPrescriptions);
  }, []);

  const handlePrescriptionSubmit = async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";
    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
    const res = await fetch("http://localhost:5001/api/doctor/prescriptions", {
      method: "POST",
      headers,
      body: JSON.stringify({ ...prescriptionData, patientId: selectedPatient?.id })
    });
    if (res.ok) {
      setPrescriptionData({ medication: "", dosage: "", frequency: "", duration: "", instructions: "" });
      // Refresh prescriptions
      fetch("http://localhost:5001/api/doctor/prescriptions", { headers })
        .then(r => r.json())
        .then(data => setPrescriptions(data));
    }
  }

  useEffect(() => {
    socketRef.current = io("http://localhost:3001"); // Update to your signaling server URL
    socketRef.current.on("offer", async (data: any) => {
      setInCall(true);
      await startPeerConnection();
      await peerConnectionRef.current?.setRemoteDescription(new RTCSessionDescription(data.offer));
      const answer = await peerConnectionRef.current?.createAnswer();
      await peerConnectionRef.current?.setLocalDescription(answer);
      socketRef.current.emit("answer", { answer, to: data.from });
    });
    socketRef.current.on("answer", async (data: any) => {
      await peerConnectionRef.current?.setRemoteDescription(new RTCSessionDescription(data.answer));
    });
    socketRef.current.on("ice-candidate", (data: any) => {
      peerConnectionRef.current?.addIceCandidate(new RTCIceCandidate(data.candidate));
    });
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const startPeerConnection = async () => {
    peerConnectionRef.current = new RTCPeerConnection();
    peerConnectionRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current.emit("ice-candidate", { candidate: event.candidate });
      }
    };
    peerConnectionRef.current.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }
    stream.getTracks().forEach((track) => {
      peerConnectionRef.current?.addTrack(track, stream);
    });
  };

  // Use real doctor info from backend
  const user = doctorInfo || { name: "", email: "", role: "doctor", phone: "" };

  const [address, setAddress] = useState<any>(doctorInfo?.address || { street: '', city: '', state: '', pincode: '', coords: { lat: 30.3573, lng: 76.0700 } })
  useEffect(() => {
    setAddress(doctorInfo?.address || { street: '', city: '', state: '', pincode: '', coords: { lat: 30.3573, lng: 76.0700 } })
  }, [doctorInfo])

  const handleSaveAddress = () => {
    // Persist address to backend if available
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const headers: any = { "Content-Type": "application/json" };
    if (token) headers.Authorization = `Bearer ${token}`;
    fetch("http://localhost:5001/api/doctor/address", {
      method: "PUT",
      headers,
      body: JSON.stringify({ address })
    })
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          setDoctorInfo((prev: any) => ({ ...prev, address: data.address || address }))
          // nice UX later: toast
        } else {
          // fallback to local update
          setDoctorInfo((prev: any) => ({ ...prev, address }))
        }
      })
      .catch(() => {
        // on error, keep local update so UI remains responsive
        setDoctorInfo((prev: any) => ({ ...prev, address }))
      })
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex-1">
        {/* Header */}
        <div className="bg-primary text-primary-foreground p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Doctor Dashboard</h1>
                <p className="opacity-90">{user.name} {doctorInfo?.specialization ? `- ${doctorInfo.specialization}` : ""}</p>
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
          <Tabs value={activeTab} onValueChange={(v: string) => setActiveTab(v)} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="appointments">Appointments</TabsTrigger>
              <TabsTrigger value="patients">Patients</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
              <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {usingMock && (
                <div className="p-3 rounded-md bg-popover text-popover-foreground border border-border">
                  You're viewing demo data (mock). Real backend data will appear when available.
                </div>
              )}
              {/* Dashboard Stats - Real data */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Example: show total appointments, patients, reports, prescriptions */}
                <Card><CardContent className="p-4">Appointments: {appointments.length}</CardContent></Card>
                <Card><CardContent className="p-4">Patients: {patients.length}</CardContent></Card>
                <Card><CardContent className="p-4">Reports: {reports.length}</CardContent></Card>
                <Card><CardContent className="p-4">Prescriptions: {prescriptions.length}</CardContent></Card>
              </div>

              {/* Address Card */}
              <div className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Address</CardTitle>
                    <CardDescription>Clinic / Home address</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium">{address.street}</div>
                        <div className="text-sm text-muted-foreground">{address.city}, {address.state} - {address.pincode}</div>
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
                              <Input placeholder="Street" value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} />
                              <div className="grid grid-cols-3 gap-2">
                                <Input placeholder="City" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
                                <Input placeholder="State" value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} />
                                <Input placeholder="Pincode" value={address.pincode} onChange={(e) => setAddress({ ...address, pincode: e.target.value })} />
                              </div>
                              <MapPicker apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY} value={address.coords} onChange={(coords) => setAddress({ ...address, coords })} height={300} />
                              <div className="flex justify-end space-x-2">
                                <Button variant="outline" onClick={() => { /* close handled by Dialog */ }}>Cancel</Button>
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

              {/* Today's Schedule */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Today's Appointments</CardTitle>
                    <CardDescription>Your scheduled consultations for today</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Today's Appointments - Real data */}
                              {(() => {
                                const displayAppointments = (appointments && appointments.length > 0) ? appointments : mockAppointments;
                                const todays = displayAppointments.filter((a: any) => a.date === new Date().toISOString().slice(0,10));
                                if (todays.length === 0) return <div>No appointments available.</div>;
                                return todays.map((a: any) => (
                          <div key={a.id} className="border rounded-lg p-2 flex justify-between items-center">
                            <div>
                              <div className="font-semibold">{a.patientName}</div>
                              <div className="text-sm text-muted-foreground">{a.time}</div>
                            </div>
                            <Badge>{a.status}</Badge>
                          </div>
                                  ))
                              })()}
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
                      {/* Pending Reports - Real data */}
                      {(() => {
                        const displayReports = (reports && reports.length > 0) ? reports : mockReports;
                        const pending = displayReports.filter((r: any) => r.status === "pending");
                        if (pending.length === 0) return <div>No pending reports available.</div>;
                        return pending.map((r: any) => (
                          <div key={r.id} className="border rounded-lg p-2 flex justify-between items-center">
                            <div>
                              <div className="font-semibold">{r.patientName}</div>
                              <div className="text-sm text-muted-foreground">{r.type}</div>
                            </div>
                            <Badge>{r.status}</Badge>
                          </div>
                        ))
                      })()}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => startVideoCall(`room-${Date.now()}`)}>
                  <CardHeader>
                    <div className="bg-primary/10 text-primary p-3 rounded-lg w-fit">
                      <Video className="h-6 w-6" />
                    </div>
                    <CardTitle>Start Consultation</CardTitle>
                    <CardDescription>Begin a video or chat consultation</CardDescription>
                  </CardHeader>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab('prescriptions')}>
                  <CardHeader>
                    <div className="bg-secondary/10 text-secondary p-3 rounded-lg w-fit">
                      <Pill className="h-6 w-6" />
                    </div>
                    <CardTitle>Write Prescription</CardTitle>
                    <CardDescription>Create digital prescriptions for patients</CardDescription>
                  </CardHeader>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab('reports')}>
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
                    {/* All Appointments - Real data */}
                    {appointments.length === 0 ? (
                      <div>No appointments available.</div>
                    ) : (
                      appointments.map((a: any) => (
                        <div key={a.id} className="border rounded-lg p-2 flex justify-between items-center">
                          <div>
                            <div className="font-semibold">{a.patientName}</div>
                            <div className="text-sm text-muted-foreground">{a.date} {a.time}</div>
                          </div>
                          <Badge>{a.status}</Badge>
                        </div>
                      ))
                    )}
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

                    {/* Patient Records - Real data */}
                    {patients.length === 0 ? (
                      <div>No patient records available.</div>
                    ) : (
                      patients.map((p: any) => (
                        <div key={p.id} className="border rounded-lg p-2 flex justify-between items-center">
                          <div>
                            <div className="font-semibold">{p.name}</div>
                            <div className="text-sm text-muted-foreground">{p.condition}</div>
                          </div>
                          <Badge>{p.status}</Badge>
                        </div>
                      ))
                    )}
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
                    {/* Medical Reports Review - Real data */}
                    {reports.length === 0 ? (
                      <div>No reports available.</div>
                    ) : (
                      reports.map((r: any) => (
                        <div key={r.id} className="border rounded-lg p-2 flex justify-between items-center">
                          <div>
                            <div className="font-semibold">{r.patientName}</div>
                            <div className="text-sm text-muted-foreground">{r.type}</div>
                          </div>
                          <Badge>{r.status}</Badge>
                        </div>
                      ))
                    )}
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
                      <Select onValueChange={id => setSelectedPatient(patients.find(p => p.id === id))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose patient" />
                        </SelectTrigger>
                        <SelectContent>
                          {patients.map((p: any) => (
                            <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
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
                    {prescriptions.length === 0 ? (
                      <div>No prescriptions available.</div>
                    ) : (
                      prescriptions.map((pr: any) => (
                        <div key={pr.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold">{pr.patientName}</h3>
                              <p className="text-muted-foreground">{pr.medication} {pr.dosage} - {pr.frequency} for {pr.duration}</p>
                              <p className="text-sm text-muted-foreground">Prescribed on {pr.date}</p>
                            </div>
                            <Badge className="bg-green-100 text-green-800">Sent</Badge>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        {inCall && (
          <div>
            <video ref={localVideoRef} autoPlay playsInline muted style={{ width: 300 }} />
            <video ref={remoteVideoRef} autoPlay playsInline style={{ width: 300 }} />
          </div>
        )}
        {/* Video call modal (WebRTC) */}
        <VideoCallModal roomId={videoCallRoomId} open={videoCallOpen} onClose={endVideoCall} />
      </div>
    </div>
  );
}
