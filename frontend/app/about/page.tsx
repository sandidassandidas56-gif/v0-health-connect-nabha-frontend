import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Users, Award, Globe } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">About HealthConnect Nabha</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            We are dedicated to bridging the healthcare gap in rural communities through innovative telemedicine
            solutions, making quality healthcare accessible to everyone in Nabha and surrounding areas.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <Card>
            <CardHeader>
              <div className="bg-primary/10 text-primary p-3 rounded-lg w-fit">
                <Heart className="h-6 w-6" />
              </div>
              <CardTitle>Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                To provide accessible, affordable, and quality healthcare services to rural communities through
                cutting-edge telemedicine technology, ensuring no one is left behind in receiving proper medical care.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="bg-secondary/10 text-secondary p-3 rounded-lg w-fit">
                <Globe className="h-6 w-6" />
              </div>
              <CardTitle>Our Vision</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                To become the leading telemedicine platform in rural India, creating a connected healthcare ecosystem
                that empowers communities and transforms lives through technology.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Key Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">Why Choose HealthConnect Nabha?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="bg-primary/10 text-primary p-3 rounded-lg w-fit">
                  <Users className="h-6 w-6" />
                </div>
                <CardTitle>Expert Healthcare Team</CardTitle>
                <CardDescription>Qualified doctors and specialists available 24/7 for consultations</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="bg-secondary/10 text-secondary p-3 rounded-lg w-fit">
                  <Award className="h-6 w-6" />
                </div>
                <CardTitle>Advanced Technology</CardTitle>
                <CardDescription>IoT-enabled health monitoring and real-time data analysis</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="bg-primary/10 text-primary p-3 rounded-lg w-fit">
                  <Heart className="h-6 w-6" />
                </div>
                <CardTitle>Community Focus</CardTitle>
                <CardDescription>Designed specifically for rural healthcare needs and challenges</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-muted rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-foreground text-center mb-8">Our Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">5000+</div>
              <div className="text-muted-foreground">Patients Served</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-secondary mb-2">50+</div>
              <div className="text-muted-foreground">Healthcare Providers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">25+</div>
              <div className="text-muted-foreground">Villages Covered</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-secondary mb-2">24/7</div>
              <div className="text-muted-foreground">Support Available</div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
