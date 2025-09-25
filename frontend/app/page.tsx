import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Heart, Users, Activity, Shield, Clock, MapPin } from "lucide-react"
import DoctorsList from "./_components/doctors-list"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
              Telemedicine Access for Rural Healthcare in Nabha
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto text-pretty">
              Connecting rural communities with quality healthcare through innovative telemedicine solutions. Access
              doctors, upload reports, and monitor your health from anywhere.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/auth">Book Consultation</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Comprehensive Healthcare Solutions</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our platform provides end-to-end healthcare services designed specifically for rural communities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="bg-primary/10 text-primary p-3 rounded-lg w-fit">
                  <Heart className="h-6 w-6" />
                </div>
                <CardTitle>Patient Care</CardTitle>
                <CardDescription>
                  Upload medical reports, book consultations, and access your health records anytime
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="bg-secondary/10 text-secondary p-3 rounded-lg w-fit">
                  <Users className="h-6 w-6" />
                </div>
                <CardTitle>Expert Doctors</CardTitle>
                <CardDescription>
                  Connect with qualified healthcare professionals through video consultations and chat
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="bg-primary/10 text-primary p-3 rounded-lg w-fit">
                  <Activity className="h-6 w-6" />
                </div>
                <CardTitle>IoT Health Monitoring</CardTitle>
                <CardDescription>
                  Real-time monitoring of vitals including BP, sugar levels, ECG, and oxygen saturation
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="bg-secondary/10 text-secondary p-3 rounded-lg w-fit">
                  <Shield className="h-6 w-6" />
                </div>
                <CardTitle>ASHA Worker Support</CardTitle>
                <CardDescription>
                  Tools for community health workers to upload field data and track village health statistics
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="bg-primary/10 text-primary p-3 rounded-lg w-fit">
                  <Clock className="h-6 w-6" />
                </div>
                <CardTitle>24/7 Availability</CardTitle>
                <CardDescription>Round-the-clock access to healthcare services and emergency support</CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="bg-secondary/10 text-secondary p-3 rounded-lg w-fit">
                  <MapPin className="h-6 w-6" />
                </div>
                <CardTitle>Rural Focus</CardTitle>
                <CardDescription>
                  Specifically designed for rural healthcare needs with mobile-first approach
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Doctors slot - dynamic list fetched from backend */}
      <section className="py-12 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <DoctorsList />
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Access Quality Healthcare?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of patients who trust HealthConnect Nabha for their healthcare needs
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/auth">Get Started Today</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  )
}
