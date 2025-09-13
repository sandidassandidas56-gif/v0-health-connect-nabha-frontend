"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"
import {
  Users,
  Activity,
  TrendingUp,
  TrendingDown,
  MapPin,
  FileText,
  Download,
  AlertTriangle,
  CheckCircle,
  Stethoscope,
  Shield,
} from "lucide-react"

export default function AdminDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("monthly")
  const [selectedRegion, setSelectedRegion] = useState("all")

  // Mock data for analytics
  const overallStats = [
    { label: "Total Patients", value: "5,248", change: "+12%", trend: "up", icon: Users },
    { label: "Active Doctors", value: "52", change: "+3%", trend: "up", icon: Stethoscope },
    { label: "ASHA Workers", value: "28", change: "+2%", trend: "up", icon: Shield },
    { label: "Consultations", value: "1,856", change: "+18%", trend: "up", icon: Activity },
  ]

  const diseasePrevalence = [
    { name: "Hypertension", cases: 1250, percentage: 35, trend: "up", color: "#ef4444" },
    { name: "Diabetes", cases: 980, percentage: 28, trend: "stable", color: "#3b82f6" },
    { name: "Respiratory Issues", cases: 720, percentage: 20, trend: "down", color: "#10b981" },
    { name: "Cardiovascular", cases: 450, percentage: 12, trend: "up", color: "#f59e0b" },
    { name: "Others", cases: 180, percentage: 5, trend: "stable", color: "#8b5cf6" },
  ]

  const monthlyTrends = [
    { month: "Aug", patients: 4200, consultations: 1200, asha_activities: 85 },
    { month: "Sep", patients: 4450, consultations: 1350, asha_activities: 92 },
    { month: "Oct", patients: 4680, consultations: 1480, asha_activities: 98 },
    { month: "Nov", patients: 4920, consultations: 1620, asha_activities: 105 },
    { month: "Dec", patients: 5100, consultations: 1750, asha_activities: 112 },
    { month: "Jan", patients: 5248, consultations: 1856, asha_activities: 118 },
  ]

  const villagePerformance = [
    { village: "Nabha Central", population: 2500, coverage: 85, satisfaction: 92, asha_score: 88 },
    { village: "Rajpura", population: 1800, coverage: 78, satisfaction: 89, asha_score: 85 },
    { village: "Samana", population: 2200, coverage: 82, satisfaction: 91, asha_score: 87 },
    { village: "Ghagga", population: 1500, coverage: 90, satisfaction: 94, asha_score: 92 },
    { village: "Bhadson", population: 1200, coverage: 75, satisfaction: 86, asha_score: 83 },
  ]

  const outreachPrograms = [
    {
      program: "Maternal Health Campaign",
      target: 500,
      achieved: 420,
      completion: 84,
      status: "active",
      villages: 4,
    },
    {
      program: "Child Immunization Drive",
      target: 800,
      achieved: 720,
      completion: 90,
      status: "active",
      villages: 5,
    },
    {
      program: "Diabetes Awareness",
      target: 300,
      achieved: 285,
      completion: 95,
      status: "completed",
      villages: 3,
    },
    {
      program: "Hypertension Screening",
      target: 600,
      achieved: 480,
      completion: 80,
      status: "active",
      villages: 4,
    },
  ]

  const systemAlerts = [
    {
      id: 1,
      type: "critical",
      message: "High diabetes cases reported in Rajpura village",
      time: "2 hours ago",
      action_required: true,
    },
    {
      id: 2,
      type: "warning",
      message: "ASHA worker attendance below 80% in Bhadson",
      time: "4 hours ago",
      action_required: true,
    },
    {
      id: 3,
      type: "info",
      message: "Monthly report generation completed",
      time: "1 day ago",
      action_required: false,
    },
    {
      id: 4,
      type: "success",
      message: "Immunization target achieved in Ghagga",
      time: "2 days ago",
      action_required: false,
    },
  ]

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

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "critical":
        return <AlertTriangle className="h-5 w-5 text-red-600" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      default:
        return <Activity className="h-5 w-5 text-blue-600" />
    }
  }

  const getAlertColor = (type: string) => {
    switch (type) {
      case "critical":
        return "bg-red-50 border-red-200"
      case "warning":
        return "bg-yellow-50 border-yellow-200"
      case "success":
        return "bg-green-50 border-green-200"
      default:
        return "bg-blue-50 border-blue-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "paused":
        return "bg-yellow-100 text-yellow-800"
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
              <h1 className="text-2xl font-bold">Admin Analytics Dashboard</h1>
              <p className="opacity-90">HealthConnect Nabha - System Overview</p>
            </div>
            <div className="flex items-center space-x-4">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-32 bg-primary-foreground/20 border-primary-foreground/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="secondary" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="programs">Programs</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {overallStats.map((stat, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                        <div className="flex items-center space-x-1 mt-1">
                          {getTrendIcon(stat.trend)}
                          <span className={`text-sm ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                            {stat.change}
                          </span>
                        </div>
                      </div>
                      <div className="bg-primary/10 text-primary p-3 rounded-lg">
                        <stat.icon className="h-6 w-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Disease Prevalence and Trends */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Disease Prevalence</CardTitle>
                  <CardDescription>Most common health conditions across all villages</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {diseasePrevalence.map((disease, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: disease.color }} />
                            <span className="font-medium">{disease.name}</span>
                            {getTrendIcon(disease.trend)}
                          </div>
                          <div className="text-right">
                            <span className="font-bold">{disease.cases}</span>
                            <span className="text-sm text-muted-foreground ml-1">({disease.percentage}%)</span>
                          </div>
                        </div>
                        <Progress value={disease.percentage} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Alerts</CardTitle>
                  <CardDescription>Recent alerts and notifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {systemAlerts.slice(0, 4).map((alert) => (
                      <div key={alert.id} className={`p-3 rounded-lg border ${getAlertColor(alert.type)}`}>
                        <div className="flex items-start space-x-3">
                          {getAlertIcon(alert.type)}
                          <div className="flex-1">
                            <p className="font-medium text-sm">{alert.message}</p>
                            <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                          </div>
                          {alert.action_required && (
                            <Button size="sm" variant="outline">
                              Action
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Monthly Trends Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Growth Trends</CardTitle>
                <CardDescription>Patient registration and consultation trends over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="patients" stackId="1" stroke="#3b82f6" fill="#dbeafe" />
                    <Area type="monotone" dataKey="consultations" stackId="2" stroke="#10b981" fill="#d1fae5" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Disease Distribution</CardTitle>
                  <CardDescription>Breakdown of health conditions</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={diseasePrevalence}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="cases"
                      >
                        {diseasePrevalence.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Monthly Activity Comparison</CardTitle>
                  <CardDescription>Consultations vs ASHA activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlyTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="consultations" fill="#3b82f6" name="Consultations" />
                      <Bar dataKey="asha_activities" fill="#10b981" name="ASHA Activities" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Patient Growth Trend</CardTitle>
                <CardDescription>6-month patient registration and engagement trends</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="patients" stroke="#3b82f6" strokeWidth={3} name="Total Patients" />
                    <Line
                      type="monotone"
                      dataKey="consultations"
                      stroke="#10b981"
                      strokeWidth={3}
                      name="Consultations"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="programs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Outreach Programs</CardTitle>
                <CardDescription>Track progress of health outreach initiatives</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {outreachPrograms.map((program, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">{program.program}</h3>
                          <p className="text-sm text-muted-foreground">
                            {program.achieved}/{program.target} participants • {program.villages} villages
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(program.status)}>{program.status}</Badge>
                          <p className="text-sm font-medium mt-1">{program.completion}% complete</p>
                        </div>
                      </div>
                      <Progress value={program.completion} className="h-3" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Program Success Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">87%</div>
                    <p className="text-sm text-muted-foreground">Average completion rate</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Active Programs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">3</div>
                    <p className="text-sm text-muted-foreground">Currently running</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Total Beneficiaries</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">1,905</div>
                    <p className="text-sm text-muted-foreground">People reached</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Village Performance Metrics</CardTitle>
                <CardDescription>Healthcare coverage and satisfaction across villages</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {villagePerformance.map((village, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <MapPin className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <h3 className="font-semibold">{village.village}</h3>
                            <p className="text-sm text-muted-foreground">Population: {village.population}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">{village.coverage}%</div>
                          <p className="text-sm text-muted-foreground">Coverage</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Healthcare Coverage</p>
                          <Progress value={village.coverage} className="h-2" />
                          <p className="text-xs text-muted-foreground mt-1">{village.coverage}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Patient Satisfaction</p>
                          <Progress value={village.satisfaction} className="h-2" />
                          <p className="text-xs text-muted-foreground mt-1">{village.satisfaction}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">ASHA Performance</p>
                          <Progress value={village.asha_score} className="h-2" />
                          <p className="text-xs text-muted-foreground mt-1">{village.asha_score}%</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Comparison</CardTitle>
                  <CardDescription>Village-wise performance metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={villagePerformance}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="village" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="coverage" fill="#3b82f6" name="Coverage %" />
                      <Bar dataKey="satisfaction" fill="#10b981" name="Satisfaction %" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Key Performance Indicators</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span>Average Coverage</span>
                      <span className="font-bold text-green-600">83%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span>Patient Satisfaction</span>
                      <span className="font-bold text-blue-600">90%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span>ASHA Performance</span>
                      <span className="font-bold text-purple-600">87%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span>System Uptime</span>
                      <span className="font-bold text-green-600">99.2%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Generate Reports</CardTitle>
                <CardDescription>Create comprehensive reports for stakeholders</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Report Type</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select report type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="comprehensive">Comprehensive Health Report</SelectItem>
                        <SelectItem value="disease-trends">Disease Trends Analysis</SelectItem>
                        <SelectItem value="program-success">Program Success Report</SelectItem>
                        <SelectItem value="village-performance">Village Performance Report</SelectItem>
                        <SelectItem value="financial">Financial Summary</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Time Period</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="last-month">Last Month</SelectItem>
                        <SelectItem value="last-quarter">Last Quarter</SelectItem>
                        <SelectItem value="last-year">Last Year</SelectItem>
                        <SelectItem value="custom">Custom Range</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Format</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF Report</SelectItem>
                        <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                        <SelectItem value="csv">CSV Data</SelectItem>
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
                <CardDescription>Previously generated reports and analytics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-6 w-6 text-muted-foreground" />
                      <div>
                        <h3 className="font-semibold">Q4 2023 Comprehensive Health Report</h3>
                        <p className="text-sm text-muted-foreground">Generated on January 5, 2024</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-green-100 text-green-800">Completed</Badge>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-6 w-6 text-muted-foreground" />
                      <div>
                        <h3 className="font-semibold">December 2023 Disease Trends Analysis</h3>
                        <p className="text-sm text-muted-foreground">Generated on January 3, 2024</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-green-100 text-green-800">Completed</Badge>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-6 w-6 text-muted-foreground" />
                      <div>
                        <h3 className="font-semibold">Village Performance Report - December 2023</h3>
                        <p className="text-sm text-muted-foreground">Generated on January 1, 2024</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-green-100 text-green-800">Completed</Badge>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
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
