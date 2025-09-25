import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Star, MapPin, Clock, Video, MessageCircle } from "lucide-react"
import doctors from "@/data/doctors"

export default function DoctorsPage() {
  // TODO: Replace with real backend data for doctors
  return (
    <>
      <Navigation />
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Our Expert Doctors</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            Connect with qualified healthcare professionals across Nabha and surrounding areas. Get expert medical
            consultation from the comfort of your home.
          </p>
        </div>

        {/* Doctors Grid - local mock data */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {doctors.map((d) => (
            <Card key={d.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex items-center gap-4">
                <img src={d.image} alt={d.name} className="w-16 h-16 rounded-full object-cover" />
                <div>
                  <CardTitle className="text-sm">{d.name}</CardTitle>
                  <CardDescription className="text-xs">{d.specialization}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Experienced and trusted practitioner in {d.specialization}.</p>
                <div className="mt-4 flex gap-2">
                  <Button size="sm" asChild>
                    <Link href={`/doctors`}>View Profile</Link>
                  </Button>
                  <Button size="sm" variant="outline" asChild>
                    <Link href="/auth">Book</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <h2 className="text-3xl font-bold text-foreground mb-4">Need Immediate Medical Attention?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Our doctors are available 24/7 for emergency consultations. Get connected with a healthcare professional
            right away.
          </p>
          <Button size="lg" asChild>
            <Link href="/auth">Book Emergency Consultation</Link>
          </Button>
        </div>
      </div>
      <Footer />
    </>
  );
}
