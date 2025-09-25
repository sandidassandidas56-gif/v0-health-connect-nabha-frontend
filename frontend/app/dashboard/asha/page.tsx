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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from "recharts"
import { Users, MapPin, FileText, Activity, Heart, Baby, UserCheck, AlertTriangle, Upload } from "lucide-react"
import MapPicker from '@/components/map-picker'


import { mockPrescriptions, mockPatients, mockASHAProfile } from '@/data/asha-mock'

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
  const [address, setAddress] = useState<any>(mockASHAProfile.address || { street: '', city: '', state: '', pincode: '', coords: { lat: 30.3573, lng: 76.0700 } })
  const [showDelivery, setShowDelivery] = useState<string | null>(null);
  const [deliveryStatus, setDeliveryStatus] = useState<{ [key: string]: boolean | null }>({});

  useEffect(() => {
    fetch("/api/prescriptions/asha") // API to get prescriptions for logged-in ASHA worker
      .then((res) => res.json())
      .then((data) => {
        if (!data || !data.prescriptions || data.prescriptions.length === 0) {
          // fallback to local mock data
          setPrescriptions(mockPrescriptions as Prescription[])
        } else {
          setPrescriptions(data.prescriptions)
        }
      })
      .catch(() => {
        // on error, use mock data so UI remains populated
        setPrescriptions(mockPrescriptions as Prescription[])
      })
  }, [])

  useEffect(() => {
    // Fetch ASHA profile with address and assigned prescriptions
    fetch("/api/asha/profile")
      .then(res => res.json())
      .then(data => {
        if (!data || !data.name) {
          setAshaProfile(mockASHAProfile as unknown as ASHAProfile)
        } else {
          setAshaProfile(data)
        }
      })
      .catch(() => setAshaProfile(mockASHAProfile as unknown as ASHAProfile));
  }, []);

  useEffect(() => {
    if (ashaProfile && ashaProfile.address) setAddress({ ...ashaProfile.address, coords: (ashaProfile as any).coords || { lat: 30.3573, lng: 76.0700 } })
  }, [ashaProfile])

  const handleSaveAddress = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const headers: any = { 'Content-Type': 'application/json' };
    if (token) headers.Authorization = `Bearer ${token}`;
    fetch('/api/asha/address', {
      method: 'PUT',
      headers,
      body: JSON.stringify({ address })
    }).then(async (res) => {
      if (res.ok) {
        const data = await res.json();
        setAshaProfile((prev: any) => ({ ...prev, address: data.address || address }))
      } else {
        setAshaProfile((prev: any) => ({ ...prev, address }))
      }
    }).catch(() => setAshaProfile((prev: any) => ({ ...prev, address })))
  }


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

  // Disease distribution data for charts (using mockPatients as fallback)
  const diseaseCounts = mockPatients.reduce((acc: any, p: any) => {
    acc[p.condition] = (acc[p.condition] || 0) + 1;
    return acc;
  }, {});
  const diseaseData = Object.keys(diseaseCounts).map((k) => ({ name: k, value: diseaseCounts[k] }));
  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f7f", "#6e9ef8", "#a28cf0"];

  // Monthly trends (last 6 months) generated deterministically from mock counts
  const months = (() => {
    const res: string[] = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      res.push(d.toLocaleString('default', { month: 'short', year: 'numeric' }));
    }
    return res;
  })();

  const distributeCounts = (total: number, slots: number) => {
    const base = Math.floor(total / slots);
    const rem = total % slots;
    return Array.from({ length: slots }).map((_, i) => base + (i < rem ? 1 : 0));
  };

  const prescriptionsPerMonth = distributeCounts(mockPrescriptions.length, months.length);
  const patientsPerMonth = distributeCounts(mockPatients.length, months.length);

  const monthlyData = months.map((m, idx) => ({
    month: m,
    prescriptions: prescriptionsPerMonth[idx],
    newPatients: patientsPerMonth[idx],
  }));

  const avgPrescriptionsPerMonth = Math.round(mockPrescriptions.length / months.length) || 0;
  const newPatientsThisMonth = patientsPerMonth[patientsPerMonth.length - 1] || 0;

  // Build stacked disease data per month
  const diseaseNames = Array.from(new Set(mockPatients.map(p => p.condition)));
  const diseaseTotals: { [key: string]: number } = {};
  diseaseNames.forEach((d) => {
    diseaseTotals[d] = mockPatients.filter(p => p.condition === d).length;
  });

  // For each disease, distribute its total across months (simple deterministic split)
  const diseaseMonthlyMap: { [disease: string]: number[] } = {};
  diseaseNames.forEach((d) => {
    diseaseMonthlyMap[d] = distributeCounts(diseaseTotals[d] || 0, months.length);
  });

  // Compose data suitable for a stacked BarChart
  const diseaseMonthlyData = months.map((m, idx) => {
    const obj: any = { month: m };
    diseaseNames.forEach((d) => {
      obj[d] = diseaseMonthlyMap[d][idx] || 0;
    });
    return obj;
  });

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
            {/* Using mock data banner when backend is empty */}
            <div className="p-3 rounded-md bg-popover text-popover-foreground border border-border">Using demo data to populate the dashboard.</div>

            {/* Dashboard Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground">Total Patients</div>
                    <div className="text-2xl font-bold">{mockPatients.length}</div>
                  </div>
                  <div className="bg-primary/10 text-primary p-3 rounded-lg">
                    <Users className="h-6 w-6" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground">Assigned Prescriptions</div>
                    <div className="text-2xl font-bold">{mockPrescriptions.length}</div>
                  </div>
                  <div className="bg-secondary/10 text-secondary p-3 rounded-lg">
                    <FileText className="h-6 w-6" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground">Villages Covered</div>
                    <div className="text-2xl font-bold">{Array.from(new Set(mockPatients.map(p => p.village))).length}</div>
                  </div>
                  <div className="bg-accent/10 text-accent p-3 rounded-lg">
                    <MapPin className="h-6 w-6" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground">Open Follow-ups</div>
                    <div className="text-2xl font-bold">{Math.max(1, Math.floor(mockPatients.length / 2))}</div>
                  </div>
                  <div className="bg-yellow-100 text-yellow-800 p-3 rounded-lg">
                    <UserCheck className="h-6 w-6" />
                  </div>
                </CardContent>
              </Card>
              </div>

              {/* Address Card for ASHA */}
              <div className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Address</CardTitle>
                    <CardDescription>Assigned ASHA worker address</CardDescription>
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

            {/* Village Coverage */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Village Coverage</CardTitle>
                  <CardDescription>Patients per village</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(() => {
                      const total = mockPatients.length || 1;
                      return Array.from(new Set(mockPatients.map(p => p.village))).map(v => {
                        const count = mockPatients.filter(p => p.village === v).length;
                        const percent = Math.round((count / total) * 100);
                        return (
                          <div key={v}>
                            <div className="flex items-center justify-between mb-2">
                              <div className="text-sm font-medium">{v}</div>
                              <div className="text-sm text-muted-foreground">{count} • {percent}%</div>
                            </div>
                            <Progress value={percent} />
                          </div>
                        )
                      })
                    })()}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Health Metrics</CardTitle>
                  <CardDescription>Simple vitals overview</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(() => {
                      const avgSystolic = Math.round(mockPatients.reduce((s, p) => s + parseInt(p.vitals.bp.split('/')[0]), 0) / mockPatients.length);
                      const avgTemp = (mockPatients.reduce((s, p) => s + parseFloat(p.vitals.temperature), 0) / mockPatients.length);
                      const avgHeart = Math.round(mockPatients.reduce((s, p) => s + (p.vitals.heartRate || 0), 0) / mockPatients.length);
                      const avgSugar = Math.round(mockPatients.reduce((s, p) => s + (p.vitals.bloodSugar || 0), 0) / mockPatients.length);
                      // For display, map systolic range [100..160] to 0..100
                      const bpPercent = Math.max(0, Math.min(100, Math.round(((avgSystolic - 100) / 60) * 100)));
                      // Map temperature closeness to 98.6F -> 100% within +/-2.5F
                      const tempDiff = Math.abs(avgTemp - 98.6);
                      const tempPercent = Math.max(0, Math.min(100, Math.round((1 - (tempDiff / 2.5)) * 100)));

                      return (
                        <>
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <div className="text-sm font-medium">Average Systolic BP</div>
                              <div className="text-sm text-muted-foreground">{avgSystolic} mmHg</div>
                            </div>
                            <Progress value={bpPercent} />
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <div className="text-sm font-medium">Average Temperature</div>
                              <div className="text-sm text-muted-foreground">{avgTemp.toFixed(1)} °F</div>
                            </div>
                            <Progress value={tempPercent} />
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <div className="text-sm font-medium">Average Heart Rate</div>
                              <div className="text-sm text-muted-foreground">{avgHeart} bpm</div>
                            </div>
                            <Progress value={Math.max(0, Math.min(100, Math.round((avgHeart / 140) * 100)))} />
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <div className="text-sm font-medium">Average Blood Sugar</div>
                              <div className="text-sm text-muted-foreground">{avgSugar} mg/dL</div>
                            </div>
                            <Progress value={Math.max(0, Math.min(100, Math.round((avgSugar / 200) * 100)))} />
                          </div>
                        </>
                      )
                    })()}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activities and Disease Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {mockPrescriptions.slice(0,3).map(p => (
                      <div key={p._id} className="flex items-center justify-between">
                        <div>{p.patient} - {p.location}</div>
                        <div className="text-sm text-muted-foreground">{p.medicines.length} meds</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Disease Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-6">
                    <div style={{ width: 200, height: 160 }}>
                      <ResponsiveContainer width="100%" height={160}>
                        <PieChart>
                          <Pie data={diseaseData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} label>
                            {diseaseData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="space-y-2">
                      {diseaseData.map((d, i) => (
                        <div key={d.name} className="flex items-center space-x-3">
                          <span className="w-3 h-3 rounded-sm" style={{ background: COLORS[i % COLORS.length] }} />
                          <div>
                            <div className="text-sm font-medium">{d.name}</div>
                            <div className="text-xs text-muted-foreground">{d.value} patients</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Trends</CardTitle>
                <CardDescription>Last 6 months overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                  <div className="col-span-2">
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="prescriptions" stroke="#3b82f6" strokeWidth={2} />
                        <Line type="monotone" dataKey="newPatients" stroke="#10b981" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                    <div className="mt-6">
                      <h4 className="text-sm font-medium mb-2">Diagnosed Diseases — Monthly (stacked)</h4>
                      <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={diseaseMonthlyData} layout="vertical" barCategoryGap="20%" barGap={4}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" type="category" />
                          <YAxis type="number" />
                          <Tooltip />
                          <Legend />
                          {diseaseNames.map((d, i) => (
                            <Bar key={d} dataKey={d} stackId="a" fill={COLORS[i % COLORS.length]} />
                          ))}
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-card rounded">
                      <div className="text-sm text-muted-foreground">Avg Prescriptions / month</div>
                      <div className="text-2xl font-bold">{avgPrescriptionsPerMonth}</div>
                    </div>

                    <div className="p-4 bg-card rounded">
                      <div className="text-sm text-muted-foreground">New patients this month</div>
                      <div className="text-2xl font-bold">{newPatientsThisMonth}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
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
                  {/* Use mock patients when none are fetched */}
                  {mockPatients.length === 0 ? (
                    <div className="border rounded-lg p-4 text-center text-muted-foreground">No patients available.</div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {mockPatients.map((p) => (
                        <div key={p.id} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold">{p.name}</h3>
                              <p className="text-sm text-muted-foreground">{p.village} • {p.age} yrs</p>
                            </div>
                            <div className="text-right">
                              <div className="text-sm">{p.condition}</div>
                              <div className="text-xs text-muted-foreground">Phone: {p.phone}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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
