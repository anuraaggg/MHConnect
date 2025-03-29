"use client";

import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function CreatePost() {
  const { user } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [specialties, setSpecialties] = useState("");
  const [institution, setInstitution] = useState("");
  const [degree, setDegree] = useState("");
  const [bio, setBio] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!user) {
      setError("You must be logged in to create a post.");
      setLoading(false);
      return;
    }

    const postData = {
      name,
      title,
      specialties: specialties.split(",").map((s) => s.trim()), // Convert to array
      institution,
      degree,
      bio,
      content,
    };

    try {
      const response = await fetch("/api/professionals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error("Failed to create professional post");
      }

      router.push("/professionals"); // Redirect to Professionals page
    } catch (err) {
      setError("Failed to create professional post");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Create a Professional Post</h1>
      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <Input placeholder="Title (e.g., Clinical Psychologist)" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <Input placeholder="Specialties (comma-separated)" value={specialties} onChange={(e) => setSpecialties(e.target.value)} required />
        <Input placeholder="Institution" value={institution} onChange={(e) => setInstitution(e.target.value)} required />
        <Input placeholder="Degree" value={degree} onChange={(e) => setDegree(e.target.value)} required />
        <Textarea placeholder="Bio" value={bio} onChange={(e) => setBio(e.target.value)} required />
        <Textarea placeholder="Post Content" value={content} onChange={(e) => setContent(e.target.value)} required />

        <Button type="submit" disabled={loading}>{loading ? "Creating..." : "Submit Post"}</Button>
      </form>
    </div>
  );
}
