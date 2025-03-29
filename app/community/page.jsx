"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, ThumbsUp, Flag } from "lucide-react";

// Function to obfuscate a name while keeping it recognizable
const encodeName = (name) => {
  if (!name) return "Anonymous";

  // Convert name to Base64, remove numbers, and keep first 6 letters
  const encoded = btoa(name) // Base64 encode
    .replace(/[0-9+/=]/g, "") // Remove numbers and special characters
    .slice(0, 6) // Keep first 6 letters

  return encoded || "Anon"; // Fallback in case of empty result
};


export default function Community() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [commentInputs, setCommentInputs] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/posts");
        const data = await res.json();
        setPosts(Array.isArray(data.posts) ? data.posts : []);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setPosts([]);
      }
    };
    fetchPosts();
  }, []);

  const handleSubmitPost = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newPost,
          authorId: user?.id,
          authorName: user?.name,
          userType: user?.userType,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setPosts([data.post, ...posts]);
      setNewPost("");
    } catch (err) {
      console.error("Failed to create post:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitComment = async (postId) => {
    const comment = commentInputs[postId]?.trim();
    if (!comment) return;

    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: comment, authorName: user?.name }),
      });

      const data = await response.json();
      if (!response.ok) {
        const errorMessage = data.message || "An error occurred while adding your comment.";
        throw new Error(errorMessage);
      }

      setPosts(posts.map((post) => (post._id === postId ? { ...post, comments: [...post.comments, data.comment] } : post)));
      setCommentInputs({ ...commentInputs, [postId]: "" });
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleLikePost = async (postId) => {
    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: "PATCH",
      });

      if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error(errorMessage.message || "Error liking the post");
      }

      const data = await response.json();
      const updatedPost = data.post;

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === updatedPost._id
            ? { ...post, likes: updatedPost.likes }
            : post
        )
      );
    } catch (error) {
      console.error("Failed to like post:", error);
    }
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-4">Community Forum</h1>
      <p className="text-muted-foreground mb-6">A safe space to discuss mental health topics and share experiences.</p>

      {user && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Create a Post</CardTitle>
            <CardDescription>Share your thoughts, questions, or experiences.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitPost}>
              <Textarea
                placeholder="What's on your mind?"
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="mb-4"
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Posting..." : "Post"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-6">
        {posts.map((post) => (
          <Card key={post._id}>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src="/placeholder.svg" alt={encodeName(post.authorName) || "Unknown"} />
                  <AvatarFallback>{encodeName(post.authorName).charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <div>
                  <span className="font-semibold">{encodeName(post.authorName)}</span>
                  {post.userType === "professional" && (
                    <span className="bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-full">Professional</span>
                  )}
                  <p className="text-xs text-muted-foreground">{new Date(post.createdAt).toLocaleString()}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line">{post.content}</p>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <div className="flex gap-4">
                <Button variant="ghost" size="sm" className="flex items-center gap-1" onClick={() => handleLikePost(post._id)}>
                  <ThumbsUp className="h-4 w-4" />
                  <span>{post.likes || 0}</span>
                </Button>
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  <span>{post.comments?.length || 0}</span>
                </Button>
              </div>
              <Button variant="ghost" size="sm">
                <Flag className="h-4 w-4 mr-1" />
                Report
              </Button>
            </CardFooter>

            <CardContent className="border-t pt-4">
              {post.comments.map((comment, index) => (
                <div key={index} className="flex gap-4 mb-2">
                  <Avatar>
                    <AvatarFallback>{encodeName(comment.authorName).charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{encodeName(comment.authorName)}</p>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
