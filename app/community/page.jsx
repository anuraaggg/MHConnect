"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare } from "lucide-react";

// Function to anonymize names (removes numbers)
const anonymizeName = (name) => {
  if (!name) return "Anonymous";
  
  // Remove numbers
  let cleanedName = name.replace(/[0-9]/g, "");

  // Shift characters forward (basic encoding)
  let encodedName = cleanedName
    .split("")
    .map((char) => String.fromCharCode(char.charCodeAt(0) + 2)) // Shift by 2 places
    .join("");

  // Reverse the name for extra obfuscation
  return encodedName.split("").reverse().join("");
};


export default function Community() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [commentInputs, setCommentInputs] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Fetch posts when the component loads
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

  // Handle submitting a new post
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

  // Handle submitting a comment on a post
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
      if (!response.ok) throw new Error(data.message);

      setPosts(posts.map((post) => (post._id === postId ? { ...post, comments: [...post.comments, data.comment] } : post)));
      setCommentInputs({ ...commentInputs, [postId]: "" });
    } catch (error) {
      console.error("Error adding comment:", error);
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
                  <AvatarImage src="/placeholder.svg" alt={post.authorName || "Unknown"} />
                  <AvatarFallback>{anonymizeName(post.authorName)?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <div>
                  <span className="font-semibold">{anonymizeName(post.authorName) || "Anonymous"}</span>
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
              <Button variant="ghost" size="sm" className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                <span>{post.comments?.length || 0}</span>
              </Button>
            </CardFooter>

            <CardContent className="border-t pt-4">
              {post.comments.map((comment, index) => (
                <div key={index} className="flex gap-4 mb-2">
                  <Avatar>
                    <AvatarFallback>{anonymizeName(comment.authorName)?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{anonymizeName(comment.authorName)}</p>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                </div>
              ))}

              {/* Comment input */}
              {user && (
                <div className="mt-4 flex gap-4">
                  <Avatar>
                    <AvatarFallback>{anonymizeName(user?.name)?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Input
                      type="text"
                      placeholder="Write a comment..."
                      value={commentInputs[post._id] || ""}
                      onChange={(e) => setCommentInputs({ ...commentInputs, [post._id]: e.target.value })}
                    />
                    <Button
                      onClick={() => handleSubmitComment(post._id)}
                      className="mt-2"
                      disabled={!commentInputs[post._id]?.trim()}
                    >
                      Comment
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
