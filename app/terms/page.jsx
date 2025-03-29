import { Card, CardContent } from "@/components/ui/card"

export default function Terms() {
  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>

        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
            <p className="mb-4">
              Welcome to Mental Health Connect. These Terms of Service govern your use of our website and platform.
            </p>
            <p>
              By accessing or using our service, you agree to be bound by these Terms. If you disagree with any part of
              the terms, you may not access the service.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold mb-4">User Accounts</h2>
            <p className="mb-4">
              When you create an account with us, you must provide information that is accurate, complete, and current
              at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate
              termination of your account on our service.
            </p>
            <p className="mb-4">
              You are responsible for safeguarding the password that you use to access the service and for any
              activities or actions under your password.
            </p>
            <p>
              You agree not to disclose your password to any third party. You must notify us immediately upon becoming
              aware of any breach of security or unauthorized use of your account.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Content</h2>
            <p className="mb-4">
              Our service allows you to post, link, store, share and otherwise make available certain information, text,
              graphics, videos, or other material. You are responsible for the content that you post on or through the
              service.
            </p>
            <p className="mb-4">By posting content on or through the service, you represent and warrant that:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>
                The content is yours and/or you have the right to use it and the right to grant us the rights and
                license as provided in these Terms.
              </li>
              <li>
                The posting of your content on or through the service does not violate the privacy rights, publicity
                rights, copyrights, contract rights or any other rights of any person.
              </li>
            </ul>
            <p>
              We reserve the right to remove content that violates these Terms or that we find objectionable for any
              reason.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p className="mb-4">If you have any questions about these Terms, please contact us at:</p>
            <p className="mb-2">
              <span className="font-medium">Email:</span> terms@mentalhealthconnect.com
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

