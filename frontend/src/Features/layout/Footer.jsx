export default function Footer() {
  return (
    <footer className="bg-gray-700 text-white py-4 text-center">
      <div className="container mx-auto px-4">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Uni Store. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
