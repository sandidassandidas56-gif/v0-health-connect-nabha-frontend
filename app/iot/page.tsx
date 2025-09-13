"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"
import {
  Activity,
  Heart,
  Thermometer,
  Droplets,
  Zap,
  Wifi,
  WifiOff,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
} from "lucide-react"

export default function IoTPage() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isLiveMode, setIsLiveMode] = useState(true)

  // Mock real-time data
  const [vitalsData, setVitalsData] = useState({
    bloodPressure: { systolic: 120, diastolic: 80, status: "normal", trend: "stable" },
    heartRate: { value: 72, status: "normal", trend: "up" },
    bloodSugar: { value: 95, status: "normal", trend: "down" },
    oxygenLevel: { value: 98, status: "normal", trend: "stable" },
    temperature: { value: 98.6, status: "normal", trend: "stable" },
  })

  // Mock historical data for charts
  const heartRateData = [
    { time: "00:00", value: 68 },
    { time: "04:00", value: 65 },
    { time: "08:00", value: 72 },
    { time: "12:00", value: 78 },
    { time: "16:00", value: 75 },
    { time: "20:00", value: 70 },
  ]

  const bloodPressureData = [
    { time: "00:00", systolic: 118, diastolic: 78 },
    { time: "04:00", systolic: 115, diastolic: 75 },
    { time: "08:00", systolic: 122, diastolic: 82 },
    { time: "12:00", systolic: 125, diastolic: 85 },
    { time: "16:00", systolic: 120, diastolic: 80 },
    { time: "20:00", systolic: 118, diastolic: 78 },
  ]

  const bloodSugarData = [
    { time: "06:00", value: 92 },
    { time: "09:00", value: 110 },
    { time: "12:00", value: 95 },
    { time: "15:00", value: 88 },
    { time: "18:00", value: 105 },
    { time: "21:00", value: 95 },
  ]

  const connectedDevices = [
    {
      id: 1,
      name: "Blood Pressure Monitor",
      model: "Omron HEM-7120",
      status: "connected",
      lastReading: "2 minutes ago",
      battery: 85,
      icon: Activity,
    },
    {
      id: 2,
      name: "Heart Rate Monitor",
      model: "Polar H10",
      status: "connected",
      lastReading: "1 minute ago",
      battery: 92,
      icon: Heart,
    },
    {
      id: 3,
      name: "Blood Glucose Meter",
      model: "Accu-Chek Guide",
      status: "connected",
      lastReading: "15 minutes ago",
      battery: 67,
      icon: Droplets,
    },
    {
      id: 4,
      name: "Pulse Oximeter",
      model: "Nonin 3230",
      status: "connected",
      lastReading: "30 seconds ago",
      battery: 78,
      icon: Zap,
    },
    {
      id: 5,
      name: "Digital Thermometer",
      model: "Braun ThermoScan",
      status: "disconnected",
      lastReading: "2 hours ago",
      battery: 45,
      icon: Thermometer,
    },
  ]

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
      if (isLiveMode) {
        // Simulate small variations in vitals
        setVitalsData((prev) => ({
          ...prev,
          heartRate: {
            ...prev.heartRate,
            value: Math.max(60, Math.min(100, prev.heartRate.value + (Math.random() - 0.5) * 4)),
          },
          oxygenLevel: {
            ...prev.oxygenLevel,
            value: Math.max(95, Math.min(100, prev.oxygenLevel.value + (Math.random() - 0.5) * 2)),
          },
        }))
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [isLiveMode])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal":
        return "text-green-600 bg-green-100"
      case "warning":
        return "text-yellow-600 bg-yellow-100"
      case "critical":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return <div className="h-4 w-4" />
    }
  }

  const getDeviceStatusIcon = (status: string) => {
    return status === "connected" ? (
      <Wifi className="h-4 w-4 text-green-600" />
    ) : (
      <WifiOff className="h-4 w-4 text-red-600" />
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">IoT Health Monitoring</h1>
            <p className="text-muted-foreground">Real-time health data from connected devices</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Last Updated</p>
              <p className="font-medium">{currentTime.toLocaleTimeString()}</p>
            </div>
            <Button
              variant={isLiveMode ? "default" : "outline"}
              onClick={() => setIsLiveMode(!isLiveMode)}
              className="flex items-center space-x-2"
            >
              <div className={`w-2 h-2 rounded-full ${isLiveMode ? "bg-green-500 animate-pulse" : "bg-gray-400"}`} />
              <span>{isLiveMode ? "Live" : "Paused"}</span>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="devices">Devices</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Live Vitals Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="relative overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Blood Pressure</CardTitle>
                    <div className="bg-red-100 text-red-600 p-2 rounded-lg">
                      <Activity className="h-5 w-5" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-bold">
                        {vitalsData.bloodPressure.systolic}/{vitalsData.bloodPressure.diastolic}
                      </p>
                      <p className="text-sm text-muted-foreground">mmHg</p>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(vitalsData.bloodPressure.status)}>
                        {vitalsData.bloodPressure.status}
                      </Badge>
                      {getTrendIcon(vitalsData.bloodPressure.trend)}
                    </div>
                  </div>
                </CardContent>
                {isLiveMode && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-red-300 animate-pulse" />
                )}
              </Card>

              <Card className="relative overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Heart Rate</CardTitle>
                    <div className="bg-pink-100 text-pink-600 p-2 rounded-lg">
                      <Heart className="h-5 w-5" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-bold">{Math.round(vitalsData.heartRate.value)}</p>
                      <p className="text-sm text-muted-foreground">bpm</p>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(vitalsData.heartRate.status)}>
                        {vitalsData.heartRate.status}
                      </Badge>
                      {getTrendIcon(vitalsData.heartRate.trend)}
                    </div>
                  </div>
                </CardContent>
                {isLiveMode && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 to-pink-300 animate-pulse" />
                )}
              </Card>

              <Card className="relative overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Blood Sugar</CardTitle>
                    <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                      <Droplets className="h-5 w-5" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-bold">{vitalsData.bloodSugar.value}</p>
                      <p className="text-sm text-muted-foreground">mg/dL</p>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(vitalsData.bloodSugar.status)}>
                        {vitalsData.bloodSugar.status}
                      </Badge>
                      {getTrendIcon(vitalsData.bloodSugar.trend)}
                    </div>
                  </div>
                </CardContent>
                {isLiveMode && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-300 animate-pulse" />
                )}
              </Card>

              <Card className="relative overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Oxygen Level</CardTitle>
                    <div className="bg-green-100 text-green-600 p-2 rounded-lg">
                      <Zap className="h-5 w-5" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-bold">{Math.round(vitalsData.oxygenLevel.value)}</p>
                      <p className="text-sm text-muted-foreground">%</p>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(vitalsData.oxygenLevel.status)}>
                        {vitalsData.oxygenLevel.status}
                      </Badge>
                      {getTrendIcon(vitalsData.oxygenLevel.trend)}
                    </div>
                  </div>
                </CardContent>
                {isLiveMode && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-green-300 animate-pulse" />
                )}
              </Card>

              <Card className="relative overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Temperature</CardTitle>
                    <div className="bg-orange-100 text-orange-600 p-2 rounded-lg">
                      <Thermometer className="h-5 w-5" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-bold">{vitalsData.temperature.value}</p>
                      <p className="text-sm text-muted-foreground">°F</p>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(vitalsData.temperature.status)}>
                        {vitalsData.temperature.status}
                      </Badge>
                      {getTrendIcon(vitalsData.temperature.trend)}
                    </div>
                  </div>
                </CardContent>
                {isLiveMode && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-orange-300 animate-pulse" />
                )}
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Device Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Connected Devices</span>
                      <span className="font-bold text-green-600">4/5</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Data Quality</span>
                      <span className="font-bold text-green-600">Excellent</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Last Sync</span>
                      <span className="font-bold">30s ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Heart Rate Trend (24h)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={heartRateData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Blood Pressure Trend (24h)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={bloodPressureData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="systolic" stroke="#3b82f6" strokeWidth={2} />
                      <Line type="monotone" dataKey="diastolic" stroke="#10b981" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Heart Rate Trends</CardTitle>
                  <CardDescription>24-hour heart rate monitoring</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={heartRateData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="value" stroke="#ef4444" fill="#fecaca" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Blood Sugar Levels</CardTitle>
                  <CardDescription>Daily glucose monitoring</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={bloodSugarData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="devices" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Connected Devices</CardTitle>
                <CardDescription>Manage your IoT health monitoring devices</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {connectedDevices.map((device) => (
                    <div key={device.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="bg-primary/10 text-primary p-3 rounded-lg">
                            <device.icon className="h-6 w-6" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{device.name}</h3>
                            <p className="text-sm text-muted-foreground">{device.model}</p>
                            <p className="text-xs text-muted-foreground">Last reading: {device.lastReading}</p>
                          </div>
                        </div>
                        <div className="text-right space-y-2">
                          <div className="flex items-center space-x-2">
                            {getDeviceStatusIcon(device.status)}
                            <Badge
                              className={
                                device.status === "connected"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }
                            >
                              {device.status}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-muted-foreground">Battery:</span>
                            <Progress value={device.battery} className="w-20" />
                            <span className="text-sm font-medium">{device.battery}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Health Alerts</CardTitle>
                <CardDescription>Recent alerts and notifications from your devices</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-green-800">All Vitals Normal</h3>
                      <p className="text-sm text-green-600">All your health metrics are within normal ranges</p>
                      <p className="text-xs text-green-500">2 minutes ago</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <AlertTriangle className="h-6 w-6 text-yellow-600" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-yellow-800">Device Battery Low</h3>
                      <p className="text-sm text-yellow-600">Digital Thermometer battery is at 45%</p>
                      <p className="text-xs text-yellow-500">1 hour ago</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-blue-600" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-blue-800">Medication Reminder</h3>
                      <p className="text-sm text-blue-600">Time to take your evening medication</p>
                      <p className="text-xs text-blue-500">3 hours ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  )
}
