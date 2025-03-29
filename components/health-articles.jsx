import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function HealthArticles() {
  const articles = [
    {
      id: 1,
      title: "Understanding Anxiety",
      description: "Learn about the different types of anxiety and coping strategies.",
      content:
        "Anxiety is a normal emotion that we all experience at times. However, when anxiety becomes overwhelming...",
    },
    {
      id: 2,
      title: "The Importance of Self-Care",
      description: "Discover why self-care is crucial for mental wellbeing.",
      content:
        "Self-care is any activity that we deliberately do to take care of our mental, emotional, and physical health...",
    },
    {
      id: 3,
      title: "Building Resilience",
      description: "Strategies to build mental resilience in challenging times.",
      content: "Resilience is the ability to adapt and bounce back when things don't go as planned...",
    },
  ]

  return (
    <section className="py-12" id="articles">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Mental Health Articles</h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Explore our collection of articles on mental health and wellbeing.
            </p>
          </div>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <Card key={article.id}>
              <CardHeader>
                <CardTitle>{article.title}</CardTitle>
                <CardDescription>{article.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-4">{article.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

