"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Search, MessageSquare, Bookmark } from "lucide-react"

export default function Professionals() {
  const { user } = useAuth()
  const [professionals, setProfessionals] = useState([])
  const [searchTerm, setSearchTerm] = useState("")

  // Mock data for demonstration
  useEffect(() => {
    setProfessionals([
      {
        id: 1,
        name: "Dr. Sarah Johnson",
        title: "Clinical Psychologist",
        specialties: ["Anxiety", "Depression", "Trauma"],
        institution: "University of California",
        degree: "Ph.D. in Clinical Psychology",
        bio: "Dr. Johnson specializes in cognitive-behavioral therapy with over 10 years of experience helping individuals overcome anxiety and depression.",
        posts: 24,
        followers: 156,
      },
      {
        id: 2,
        name: "Dr. Michael Chen",
        title: "Psychiatrist",
        specialties: ["Mood Disorders", "ADHD", "Medication Management"],
        institution: "Harvard Medical School",
        degree: "M.D., Psychiatry",
        bio: "Board-certified psychiatrist with expertise in medication management for various mental health conditions.",
        posts: 18,
        followers: 203,
      },
      {
        id: 3,
        name: "Dr. Emily Rodriguez",
        title: "Therapist",
        specialties: ["Family Therapy", "Relationship Issues", "Grief"],
        institution: "Columbia University",
        degree: "Ph.D. in Clinical Psychology",
        bio: "Specializing in family dynamics and relationship counseling with a compassionate, solution-focused approach.",
        posts: 32,
        followers: 178,
      },
    ])
  }, [])

  const filteredProfessionals = professionals.filter(
    (professional) =>
      professional.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professional.specialties.some((specialty) => specialty.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Healthcare Professionals</h1>
        <p className="text-muted-foreground">
          Connect with verified mental health professionals for guidance and resources.
        </p>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by name or specialty..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Tabs defaultValue="all" className="mb-8">
        <TabsList>
          <TabsTrigger value="all">All Professionals</TabsTrigger>
          <TabsTrigger value="psychologists">Psychologists</TabsTrigger>
          <TabsTrigger value="psychiatrists">Psychiatrists</TabsTrigger>
          <TabsTrigger value="therapists">Therapists</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          {filteredProfessionals.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No professionals found matching your search.</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredProfessionals.map((professional) => (
                <Card key={professional.id}>
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src="/placeholder.svg" alt={professional.name} />
                        <AvatarFallback>{professional.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle>{professional.name}</CardTitle>
                        <CardDescription>{professional.title}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4 flex flex-wrap gap-2">
                      {professional.specialties.map((specialty, index) => (
                        <Badge key={index} variant="secondary">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-semibold">Degree:</span> {professional.degree}
                      </div>
                      <div>
                        <span className="font-semibold">Institution:</span> {professional.institution}
                      </div>
                    </div>
                    <p className="mt-4 text-sm">{professional.bio}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-4">
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <MessageSquare className="mr-1 h-4 w-4" />
                        {professional.posts} posts
                      </div>
                      <div>{professional.followers} followers</div>
                    </div>
                    {user ? (
                      <Button size="sm">
                        <Bookmark className="mr-2 h-4 w-4" />
                        Follow
                      </Button>
                    ) : (
                      <Button size="sm" asChild>
                        <a href="/auth/signin">Sign in to follow</a>
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="psychologists">
          <p className="text-center text-muted-foreground py-8">Filter for psychologists will be implemented here.</p>
        </TabsContent>
        <TabsContent value="psychiatrists">
          <p className="text-center text-muted-foreground py-8">Filter for psychiatrists will be implemented here.</p>
        </TabsContent>
        <TabsContent value="therapists">
          <p className="text-center text-muted-foreground py-8">Filter for therapists will be implemented here.</p>
        </TabsContent>
      </Tabs>

      {!user && (
        <Card className="mt-8">
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <h3 className="mb-2 text-xl font-semibold">Want to interact with professionals?</h3>
            <p className="mb-4 text-muted-foreground">
              Sign in to follow professionals, view their posts, and access resources.
            </p>
            <div className="flex gap-4">
              <Button asChild>
                <a href="/auth/signin">Sign In</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/auth/signup">Create Account</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

