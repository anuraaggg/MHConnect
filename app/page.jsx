"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import HealthArticles from "@/components/health-articles";
import AboutUs from "@/components/about-us";

export default function Home() {
  const [user, setUser] = useState(false); // Change from null → false (prevents flickering)

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data); // Set user data when available
        } else {
          setUser(null); // Explicitly mark user as not logged in
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null);
      }
    }
    fetchUser();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-background/80 rounded-xl">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                Mental Health Connect
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                A platform connecting mental health professionals and individuals seeking support.
              </p>
            </div>

            {/* Prevent flickering by checking if user is explicitly null */}
            {user === null && (
              <div className="space-x-4">
                <Link href="/auth/signin">
                  <Button>Sign In</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button variant="outline">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Community Support</CardTitle>
                <CardDescription>Connect with others in a supportive environment</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Join discussions, share experiences, and find support from others who understand what you're going through.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Professional Network</CardTitle>
                <CardDescription>Connect with verified healthcare professionals</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Access a network of verified mental health professionals for guidance and resources.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Educational Resources</CardTitle>
                <CardDescription>Learn about mental health and wellbeing</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Access articles, guides, and resources to help you understand and manage mental health.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <HealthArticles />
      <AboutUs />
    </div>
  );
}
