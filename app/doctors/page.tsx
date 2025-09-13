import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Star, MapPin, Clock, Video, MessageCircle } from "lucide-react"

export default function DoctorsPage() {
  const doctors = [
    {
      id: 1,
      name: "Dr. Priya Sharma",
      specialty: "General Medicine",
      experience: "12 years",
      rating: 4.8,
      reviews: 156,
      location: "Nabha Central",
      availability: "Available Now",
      languages: ["Hindi", "Punjabi", "English"],
      consultationFee: "₹300",
      image: "/female-doctor.png",
    },
    {
      id: 2,
      name: "Dr. Rajesh Kumar",
      specialty: "Cardiology",
      experience: "15 years",
      rating: 4.9,
      reviews: 203,
      location: "Rajpura",
      availability: "Available in 30 mins",
      languages: ["Hindi", "Punjabi"],
      consultationFee: "₹500",
      image: "/male-cardiologist.jpg",
    },
    {
      id: 3,
      name: "Dr. Anita Patel",
      specialty: "Pediatrics",
      experience: "8 years",
      rating: 4.7,
      reviews: 89,
      location: "Samana",
      availability: "Available Tomorrow",
      languages: ["Hindi", "English"],
      consultationFee: "₹350",
      image: "/female-pediatrician.png",
    },
    {
      id: 4,
      name: "Dr. Suresh Singh",
      specialty: "Orthopedics",
      experience: "20 years",
      rating: 4.6,
      reviews: 134,
      location: "Ghagga",
      availability: "Available Now",
      languages: ["Hindi", "Punjabi", "English"],
      consultationFee: "₹450",
      image: "/male-orthopedic-doctor.png",
    },
    {
      id: 5,
      name: "Dr. Meera Kaur",
      specialty: "Gynecology",
      experience: "10 years",
      rating: 4.8,
      reviews: 178,
      location: "Nabha Central",
      availability: "Available Now",
      languages: ["Hindi", "Punjabi", "English"],
      consultationFee: "₹400",
      image: "/female-gynecologist.png",
    },
    {
      id: 6,
      name: "Dr. Harpreet Gill",
      specialty: "Dermatology",
      experience: "7 years",
      rating: 4.5,
      reviews: 67,
      location: "Rajpura",
      availability: "Available in 1 hour",
      languages: ["Hindi", "Punjabi"],
      consultationFee: "₹350",
      image: "/male-dermatologist.jpg",
    },
  ]

  const getAvailabilityColor = (availability: string) => {
    if (availability.includes("Available Now")) return "bg-green-100 text-green-800"
    if (availability.includes("mins") || availability.includes("hour")) return "bg-yellow-100 text-yellow-800"
    return "bg-gray-100 text-gray-800"
  }

  return (
    <div className="min-h-screen bg-background">
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

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {doctors.map((doctor) => (
            <Card key={doctor.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4">
                  <img
                    src={doctor.image || "/placeholder.svg"}
                    alt={doctor.name}
                    className="w-24 h-24 rounded-full object-cover mx-auto"
                  />
                </div>
                <CardTitle className="text-xl">{doctor.name}</CardTitle>
                <CardDescription className="text-primary font-medium">{doctor.specialty}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Experience:</span>
                  <span className="font-medium">{doctor.experience}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{doctor.rating}</span>
                    <span className="text-sm text-muted-foreground">({doctor.reviews} reviews)</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{doctor.location}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <Badge className={getAvailabilityColor(doctor.availability)}>{doctor.availability}</Badge>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Languages:</p>
                  <div className="flex flex-wrap gap-1">
                    {doctor.languages.map((language, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {language}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-muted-foreground">Consultation Fee:</span>
                    <span className="font-bold text-lg text-primary">{doctor.consultationFee}</span>
                  </div>

                  <div className="flex space-x-2">
                    <Button size="sm" className="flex-1" asChild>
                      <Link href="/auth">
                        <Video className="h-4 w-4 mr-1" />
                        Video Call
                      </Link>
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent" asChild>
                      <Link href="/auth">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Chat
                      </Link>
                    </Button>
                  </div>
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
    </div>
  )
}
