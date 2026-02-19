export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white text-center p-4">
      <div className="container mx-auto px-4">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Uni Shop. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
