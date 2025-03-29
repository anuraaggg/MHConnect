import { Card, CardContent } from "@/components/ui/card"

export default function AboutUs() {
  return (
    <section className="py-12 bg-muted/50 rounded-xl" id="about">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">About Us</h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Our mission is to create a supportive community for mental health.
            </p>
          </div>
        </div>
        <div className="mx-auto mt-8 max-w-3xl">
          <Card>
            <CardContent className="p-6">
              <p className="mb-4">
                Mental Health Connect was founded with a simple but powerful mission: to bridge the gap between mental
                health professionals and individuals seeking support.
              </p>
              <p className="mb-4">
                We believe that everyone deserves access to quality mental health resources and support. Our platform
                provides a space for open discussions about mental health, access to verified professionals, and
                educational resources.
              </p>
              <p>
                Our team consists of mental health advocates, technology experts, and healthcare professionals who are
                passionate about making mental health support more accessible to all.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

