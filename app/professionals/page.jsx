"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, PlusCircle } from "lucide-react";

export default function Professionals() {
  const { user } = useAuth();
  const router = useRouter();
  const [professionals, setProfessionals] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchProfessionals() {
      try {
        const response = await fetch("/api/professionals");
        if (!response.ok) throw new Error("Failed to fetch professionals");
        const data = await response.json();
        setProfessionals(data);
      } catch (error) {
        console.error("Error fetching professionals:", error);
      }
    }
    fetchProfessionals();
  }, []);

  const filteredProfessionals = professionals.filter(
    (professional) =>
      professional.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professional.specialties.some((specialty) =>
        specialty.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  return (
    <div className="container py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Healthcare Professionals</h1>
          <p className="text-muted-foreground">
            Connect with verified mental health professionals for guidance and resources.
          </p>
        </div>

        {user?.userType === "professional" && (
          <Button onClick={() => router.push("/create-post")}>
            <PlusCircle className="mr-2 h-5 w-5" />
            Create Post
          </Button>
        )}
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

      {filteredProfessionals.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">No professionals found.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProfessionals.map((professional) => (
            <Card key={professional._id}>
              <CardHeader>
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="/placeholder.svg" alt={professional.name} />
                    <AvatarFallback>{professional.name?.charAt(0) || "?"}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{professional.name}</CardTitle>
                    <CardDescription>{professional.title}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex flex-wrap gap-2">
                  {professional.specialties.map((specialty, index) => (
                    <Badge key={index} variant="secondary">
                      {specialty}
                    </Badge>
                  ))}
                </div>
                <div>
                  <span className="font-semibold">Degree:</span> {professional.degree}
                </div>
                <div>
                  <span className="font-semibold">Institution:</span> {professional.institution}
                </div>
                <p className="text-muted-foreground">{professional.bio}</p>

                {/* Post Content - Styled the same way as other text */}
                {professional.content && (
                  <div>
                    <h3 className="font-semibold">Latest Post:</h3>
                    <p className="text-muted-foreground">{professional.content}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
