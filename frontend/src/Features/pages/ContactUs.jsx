import { Mail } from "lucide-react";

export default function ContactUs() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-1 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Contact Us
            </h1>

            <p className="text-gray-600 mb-6 leading-relaxed">
              If you have any questions, feedback, or inquiries, please feel
              free to reach out to us. We value your input and are here to
              assist you.
            </p>

            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <Mail className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Email us at:</p>
                <a
                  href="mailto:zcbmq14@gmail.com"
                  className="text-blue-600 hover:underline font-medium"
                >
                  zcbmq14@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
