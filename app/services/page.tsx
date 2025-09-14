"use client"
import React, { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Video, MessageCircle, Upload, Activity, FileText, Users, Shield, Clock } from "lucide-react"

export default function ServicesPage() {
  const services = [
    {
      icon: Video,
      title: "Video Consultations",
      description: "Face-to-face consultations with qualified doctors from the comfort of your home",
      features: ["HD Video Quality", "Screen Sharing", "Recording Available", "Multi-language Support"],
    },
    {
      icon: MessageCircle,
      title: "Chat Support",
      description: "Real-time messaging with healthcare professionals for quick queries",
      features: ["Instant Messaging", "File Sharing", "Voice Messages", "24/7 Availability"],
    },
    {
      icon: Upload,
      title: "Medical Records",
      description: "Secure upload and management of your medical reports and documents",
      features: ["Secure Storage", "Easy Access", "Report Analysis", "History Tracking"],
    },
    {
      icon: Activity,
      title: "IoT Health Monitoring",
      description: "Real-time monitoring of vital signs through connected devices",
      features: ["Blood Pressure", "Blood Sugar", "ECG Monitoring", "Oxygen Levels"],
    },
    {
      icon: FileText,
      title: "Digital Prescriptions",
      description: "Receive and manage digital prescriptions from your doctors",
      features: ["E-Prescriptions", "Medication Reminders", "Pharmacy Integration", "Refill Alerts"],
    },
    {
      icon: Users,
      title: "ASHA Worker Support",
      description: "Tools and resources for community health workers",
      features: ["Field Data Collection", "Patient Tracking", "Health Surveys", "Training Resources"],
    },
  ]

  // File upload state and logic
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState("");

  async function handleUpload() {
    if (!selectedFile) return;
    setUploading(true);
    setUploadError("");
    setUploadSuccess(false);
    const formData = new FormData();
    formData.append("file", selectedFile);
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setUploadSuccess(true);
      } else {
        setUploadError(data.message || "Upload failed");
      }
    } catch (err) {
      setUploadError("Network error");
    }
    setUploading(false);
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Our Services</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            Comprehensive telemedicine services designed to meet the healthcare needs of rural communities
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="bg-primary/10 text-primary p-3 rounded-lg w-fit">
                  <service.icon className="h-6 w-6" />
                </div>
                <CardTitle>{service.title}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
                {/* Medical Records Upload UI */}
                {service.title === "Medical Records" && (
                  <div className="mt-6">
                    <label className="block text-sm font-medium mb-2">Upload Medical Report</label>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={e => {
                        if (e.target.files && e.target.files[0]) {
                          setSelectedFile(e.target.files[0]);
                          setUploadSuccess(false);
                          setUploadError("");
                        }
                      }}
                      className="block w-full text-sm text-muted-foreground mb-2"
                    />
                    <Button
                      size="sm"
                      disabled={!selectedFile || uploading}
                      onClick={handleUpload}
                      className="mr-2"
                    >
                      {uploading ? "Uploading..." : "Upload"}
                    </Button>
                    {uploadSuccess && (
                      <span className="text-green-600 text-sm ml-2">Report uploaded!</span>
                    )}
                    {uploadError && (
                      <span className="text-red-600 text-sm ml-2">{uploadError}</span>
                    )}
                    {selectedFile && !uploading && (
                      <div className="text-xs text-muted-foreground mt-2">Selected: {selectedFile.name}</div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Features */}
        <div className="bg-muted rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-foreground text-center mb-8">Additional Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary/10 text-primary p-3 rounded-lg w-fit mx-auto mb-4">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Secure & Private</h3>
              <p className="text-muted-foreground text-sm">
                End-to-end encryption ensures your medical data remains private and secure
              </p>
            </div>
            <div className="text-center">
              <div className="bg-secondary/10 text-secondary p-3 rounded-lg w-fit mx-auto mb-4">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">24/7 Support</h3>
              <p className="text-muted-foreground text-sm">
                Round-the-clock technical and medical support for all users
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 text-primary p-3 rounded-lg w-fit mx-auto mb-4">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Multi-User Platform</h3>
              <p className="text-muted-foreground text-sm">
                Separate dashboards for patients, doctors, ASHA workers, and administrators
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Get Started?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of patients who trust HealthConnect Nabha for their healthcare needs
          </p>
          <Button size="lg" asChild>
            <Link href="/auth">Book Your Consultation</Link>
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  )
}
