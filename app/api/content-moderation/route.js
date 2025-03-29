import { NextResponse } from "next/server"

// This is a simplified content moderation API
// In a production environment, you would use a service like
// Perspective API, Azure Content Moderator, or similar

export async function POST(request) {
  try {
    const { text } = await request.json()

    if (!text) {
      return NextResponse.json({ message: "Text content is required" }, { status: 400 })
    }

    // Simple offensive words check
    // In a real app, this would be much more sophisticated
    const offensiveWords = [
      "hate",
      "stupid",
      "idiot",
      "dumb",
      "moron",
      "kill",
      "die",
      "attack",
      "violent",
      "suicide",
      // Add more offensive words as needed
    ]

    const textLower = text.toLowerCase()
    const containsOffensive = offensiveWords.some((word) => textLower.includes(word))

    // Check for potential self-harm content
    const selfHarmPhrases = ["want to die", "kill myself", "end my life", "suicide", "hurt myself", "self harm"]

    const containsSelfHarm = selfHarmPhrases.some((phrase) => textLower.includes(phrase))

    // If self-harm content is detected, we could add special handling here
    // such as providing resources or alerting moderators

    return NextResponse.json({
      isOffensive: containsOffensive,
      containsSelfHarm,
      score: containsOffensive ? 0.8 : 0.1, // Mock toxicity score
      categories: {
        toxicity: containsOffensive ? 0.8 : 0.1,
        identity_attack: 0.1,
        insult: containsOffensive ? 0.7 : 0.1,
        threat: 0.1,
        self_harm: containsSelfHarm ? 0.9 : 0.1,
      },
    })
  } catch (error) {
    console.error("Content moderation error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

