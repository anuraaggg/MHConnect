import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between md:py-12">
        <div className="flex flex-col gap-2">
          <Link href="/" className="text-xl font-bold">
            MHConnect
          </Link>
          <p className="text-sm text-muted-foreground">
            Connecting mental health professionals and individuals seeking support.
          </p>
        </div>
        <div className="flex flex-col gap-2 md:flex-row md:gap-4">
          <Link href="/about" className="text-sm hover:underline">
            About
          </Link>
          <Link href="/privacy" className="text-sm hover:underline">
            Privacy
          </Link>
          <Link href="/terms" className="text-sm hover:underline">
            Terms
          </Link>
          <Link href="/contact" className="text-sm hover:underline">
            Contact
          </Link>
        </div>
        <div className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Mental Health Connect. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

