export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-bold text-green-600 mb-6">
              About Uni Store
            </h1>

            <div className="space-y-4 text-gray-700">
              <p className="leading-relaxed">
                Welcome to the{" "}
                <span className="font-semibold">UPM Bookstore</span>! We are
                dedicated to providing students and faculty with high-quality
                academic resources and books.
              </p>

              <p className="leading-relaxed">
                Our platform connects university students in a convenient
                marketplace where they can buy, sell, and discover textbooks at
                affordable prices. We aim to reduce costs and make education
                more accessible for everyone.
              </p>

              <div className="border-t border-gray-200 my-6"></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
