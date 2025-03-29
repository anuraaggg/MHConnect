"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MessageSquare, ThumbsUp, Flag } from "lucide-react"

export default function Community() {
  const { user } = useAuth()
  const [posts, setPosts] = useState([])
  const [newPost, setNewPost] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Mock data for demonstration
  useEffect(() => {
    setPosts([
      {
        id: 1,
        author: {
          id: 101,
          name: "Jane Doe",
          userType: "casual",
        },
        content: "Has anyone tried mindfulness meditation? I'm looking for tips to get started.",
        createdAt: "2023-05-15T10:30:00Z",
        likes: 12,
        comments: [
          {
            id: 201,
            author: {
              id: 102,
              name: "Dr. Smith",
              userType: "professional",
            },
            content:
              "Mindfulness meditation can be very beneficial. Start with just 5 minutes a day and gradually increase. There are many great apps that can guide you through the process.",
            createdAt: "2023-05-15T11:15:00Z",
          },
          {
            id: 202,
            author: {
              id: 103,
              name: "Alex Johnson",
              userType: "casual",
            },
            content: "I've been doing it for a few months now. The key is consistency!",
            createdAt: "2023-05-15T12:00:00Z",
          },
        ],
      },
      {
        id: 2,
        author: {
          id: 104,
          name: "Michael Brown",
          userType: "casual",
        },
        content: "I've been feeling overwhelmed with work lately. Any suggestions for managing stress?",
        createdAt: "2023-05-16T09:45:00Z",
        likes: 8,
        comments: [
          {
            id: 203,
            author: {
              id: 105,
              name: "Dr. Williams",
              userType: "professional",
            },
            content:
              "Regular exercise, adequate sleep, and setting boundaries at work can help manage stress. Consider scheduling short breaks throughout your day to reset.",
            createdAt: "2023-05-16T10:30:00Z",
          },
        ],
      },
    ])
  }, [])

  // Update the handleSubmitPost function to properly handle the API call
  const handleSubmitPost = async (e) => {
    e.preventDefault()
    setError("")

    if (!newPost.trim()) {
      setError("Post cannot be empty")
      return
    }

    setIsLoading(true)

    try {
      // Call the content moderation API
      const moderationRes = await fetch("/api/content-moderation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: newPost }),
      })

      const moderation = await moderationRes.json()

      if (moderation.isOffensive) {
        setError("Your post contains content that may be offensive. Please revise and try again.")
        setIsLoading(false)
        return
      }

      // Call the posts API to create a new post
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: newPost }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to create post")
      }

      // Add the new post to the state
      const newPostObj = {
        id: Date.now(),
        author: {
          id: user?.id || 999,
          name: user?.name || "Anonymous",
          userType: user?.userType || "casual",
        },
        content: newPost,
        createdAt: new Date().toISOString(),
        likes: 0,
        comments: [],
      }

      setPosts([newPostObj, ...posts])
      setNewPost("")
    } catch (err) {
      setError(err.message || "Failed to create post. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Add a function to handle comments
  const [newComment, setNewComment] = useState("")
  const [commentingOnPost, setCommentingOnPost] = useState(null)

  const handleCommentSubmit = async (postId) => {
    if (!newComment.trim()) {
      return
    }

    try {
      // In a real app, this would call an API endpoint
      // For now, we'll just update the state
      const updatedPosts = posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [
              ...post.comments,
              {
                id: Date.now(),
                author: {
                  id: user?.id || 999,
                  name: user?.name || "Anonymous",
                  userType: user?.userType || "casual",
                },
                content: newComment,
                createdAt: new Date().toISOString(),
              },
            ],
          }
        }
        return post
      })

      setPosts(updatedPosts)
      setNewComment("")
      setCommentingOnPost(null)
    } catch (error) {
      console.error("Error adding comment:", error)
    }
  }

  // Mock function to check for offensive content
  const checkForOffensiveContent = async (content) => {
    // In a real app, this would call an API like Perspective API
    // For demo purposes, we'll just check for some basic offensive words
    const offensiveWords = ["hate", "stupid", "idiot"]
    return offensiveWords.some((word) => content.toLowerCase().includes(word))
  }

  const handleComment = async (postId, comment) => {
    // Implementation for adding comments would go here
    // Would include similar offensive content check
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Community Forum</h1>
        <p className="text-muted-foreground">A safe space to discuss mental health topics and share experiences.</p>
      </div>

      <Tabs defaultValue="all" className="mb-8">
        <TabsList>
          <TabsTrigger value="all">All Posts</TabsTrigger>
          <TabsTrigger value="questions">Questions</TabsTrigger>
          <TabsTrigger value="experiences">Experiences</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          {user ? (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Create a Post</CardTitle>
                <CardDescription>Share your thoughts, questions, or experiences with the community.</CardDescription>
              </CardHeader>
              <CardContent>
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
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
          ) : (
            <Card className="mb-6">
              <CardContent className="pt-6">
                <p className="text-center">
                  Please{" "}
                  <a href="/auth/signin" className="text-primary hover:underline">
                    sign in
                  </a>{" "}
                  to create a post.
                </p>
              </CardContent>
            </Card>
          )}

          <div className="space-y-6">
            {posts.map((post) => (
              <Card key={post.id}>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src="/placeholder.svg" alt={post.author.name} />
                      <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{post.author.name}</span>
                        {post.author.userType === "professional" && (
                          <span className="bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-full">
                            Professional
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{new Date(post.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-line">{post.content}</p>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-4">
                  <div className="flex gap-4">
                    <Button variant="ghost" size="sm" className="flex items-center gap-1">
                      <ThumbsUp className="h-4 w-4" />
                      <span>{post.likes}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>{post.comments.length}</span>
                    </Button>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Flag className="h-4 w-4 mr-1" />
                    Report
                  </Button>
                </CardFooter>
                {post.comments.length > 0 && (
                  <div className="border-t px-6 py-4">
                    <h4 className="font-medium mb-4">Comments</h4>
                    <div className="space-y-4">
                      {post.comments.map((comment) => (
                        <div key={comment.id} className="flex gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="/placeholder.svg" alt={comment.author.name} />
                            <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm">{comment.author.name}</span>
                              {comment.author.userType === "professional" && (
                                <span className="bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-full">
                                  Professional
                                </span>
                              )}
                            </div>
                            <p className="text-sm mt-1">{comment.content}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(comment.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    {user && (
                      <div className="mt-4 flex gap-2">
                        <Input
                          placeholder="Add a comment..."
                          className="flex-1"
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                        />
                        <Button size="sm" onClick={() => handleCommentSubmit(post.id)}>
                          Comment
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="questions">
          <p className="text-center text-muted-foreground py-8">Filter for questions will be implemented here.</p>
        </TabsContent>
        <TabsContent value="experiences">
          <p className="text-center text-muted-foreground py-8">Filter for experiences will be implemented here.</p>
        </TabsContent>
        <TabsContent value="resources">
          <p className="text-center text-muted-foreground py-8">Filter for resources will be implemented here.</p>
        </TabsContent>
      </Tabs>
    </div>
  )
}

