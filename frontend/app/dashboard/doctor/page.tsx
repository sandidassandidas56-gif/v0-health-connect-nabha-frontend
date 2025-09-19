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
import io from "socket.io-client";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic"
import Sidebar from "@/components/sidebar"
// Dynamically import VideoCallModal to avoid SSR issues
const VideoCallModal = dynamic(() => import("@/components/VideoCallModal"), { ssr: false })

export default function DoctorDashboard() {
  const [videoCallOpen, setVideoCallOpen] = useState(false);
  const [videoCallRoomId, setVideoCallRoomId] = useState<string>("");
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

  // Mock data

  // TODO: Replace with real backend data for appointments, patient history, reports, and dashboard stats

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

  // Mock user info (replace with real backend data)
  const user = {
    name: "Dr. Priya Sharma",
    email: "priya.sharma@example.com",
    role: "doctor",
    phone: "9876543210"
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className="hidden md:block">
        <Sidebar user={user} />
      </div>

      <div className="flex-1">
        {/* Header */}
        <div className="bg-primary text-primary-foreground p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Doctor Dashboard</h1>
                <p className="opacity-90">{user.name} - General Medicine</p>
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
              {/* Dashboard Stats - Replace with backend data */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card><CardContent className="p-4">No dashboard stats available.</CardContent></Card>
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
                      {/* Today's Appointments - Replace with backend data */}
                      <div>No appointments available.</div>
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
                      {/* Pending Reports - Replace with backend data */}
                      <div>No pending reports available.</div>
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
                    {/* All Appointments - Replace with backend data */}
                    <div>No appointments available.</div>
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

                    {/* Patient Records - Replace with backend data */}
                    <div>No patient records available.</div>
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
                    {/* Medical Reports Review - Replace with backend data */}
                    <div>No reports available.</div>
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
                          {/* Select Patient - Replace with backend data */}
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
        {inCall && (
          <div>
            <video ref={localVideoRef} autoPlay playsInline muted style={{ width: 300 }} />
            <video ref={remoteVideoRef} autoPlay playsInline style={{ width: 300 }} />
          </div>
        )}
      </div>
    </div>
  );
}
