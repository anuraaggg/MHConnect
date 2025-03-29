"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, ThumbsUp, Flag } from "lucide-react";

export default function Community() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [commentInputs, setCommentInputs] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Fetch posts and comments when the component loads
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

  // Handle liking a post
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

      // Update the local state with the new like count
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
                  <AvatarImage src="/placeholder.svg" alt={post.authorName || "Unknown"} />
                  <AvatarFallback>{post.authorName?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <div>
                  <span className="font-semibold">{post.authorName || "Unknown"}</span>
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

            {/* Comments Section */}
            <CardContent className="border-t pt-4">
              {post.comments.map((comment, index) => (
                <div key={index} className="flex gap-4 mb-2">
                  <Avatar>
                    <AvatarFallback>{comment.authorName?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{comment.authorName}</p>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                </div>
              ))}

              {user && (
                <div className="mt-4">
                  <Input
                    placeholder="Write a comment..."
                    value={commentInputs[post._id] || ""}
                    onChange={(e) => setCommentInputs({ ...commentInputs, [post._id]: e.target.value })}
                  />
                  <Button
                    className="mt-2"
                    size="sm"
                    onClick={() => handleSubmitComment(post._id)}
                    disabled={!commentInputs[post._id]?.trim()}
                  >
                    Post Comment
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
