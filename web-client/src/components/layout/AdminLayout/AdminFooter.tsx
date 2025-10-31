export default function AdminFooter() {
  return (
    <footer className="bg-white border-t px-6 py-4 mt-auto">
      <p className="text-center text-gray-600 text-sm">
        © {new Date().getFullYear()} E-commerce Admin Panel. All rights reserved.
      </p>
    </footer>
  );
}
