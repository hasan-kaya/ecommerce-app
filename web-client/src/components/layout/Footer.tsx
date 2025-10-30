export default function Footer() {
  return (
    <footer className="border-t mt-auto">
      <div className="container mx-auto px-4 py-6">
        <p className="text-center text-gray-600">
          © {new Date().getFullYear()} E-commerce Platform. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
