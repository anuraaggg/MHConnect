import { Card, CardContent } from "@/components/ui/card"

export default function About() {
  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">About Mental Health Connect</h1>

        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
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

        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Our Vision</h2>
            <p className="mb-4">
              We envision a world where mental health is prioritized, stigma is eliminated, and everyone has access to
              the support they need.
            </p>
            <p>
              Through our platform, we aim to create a community where individuals can share experiences, learn from
              professionals, and find resources to support their mental health journey.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Our Team</h2>
            <p className="mb-4">
              Our team is made up of passionate individuals dedicated to improving mental health support and resources.
            </p>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="text-lg font-medium mb-1">Dr. Sarah Johnson</h3>
                <p className="text-muted-foreground mb-2">Clinical Psychologist, Co-Founder</p>
                <p className="text-sm">
                  Dr. Johnson has over 15 years of experience in clinical psychology and is passionate about making
                  mental health resources accessible to all.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-1">Michael Chen</h3>
                <p className="text-muted-foreground mb-2">Technology Director, Co-Founder</p>
                <p className="text-sm">
                  Michael brings his expertise in technology to create a platform that connects individuals with the
                  mental health resources they need.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-1">Emily Rodriguez</h3>
                <p className="text-muted-foreground mb-2">Community Manager</p>
                <p className="text-sm">
                  Emily ensures that our community remains a safe, supportive space for all members to share and learn.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-1">Dr. James Wilson</h3>
                <p className="text-muted-foreground mb-2">Mental Health Researcher</p>
                <p className="text-sm">
                  Dr. Wilson contributes the latest research and evidence-based practices to our educational resources.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p className="mb-4">
              We'd love to hear from you! If you have any questions, suggestions, or feedback, please don't hesitate to
              reach out.
            </p>
            <p className="mb-2">
              <span className="font-medium">Email:</span> contact@mentalhealthconnect.com
            </p>
            <p>
              <span className="font-medium">Address:</span> 123 Wellness Street, Mindful City, MC 12345
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

