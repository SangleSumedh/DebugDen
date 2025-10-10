export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
      <p className="mt-2 text-gray-600">Sorry, we couldn’t find that page.</p>
      <a href="/" className="mt-4 rounded bg-black px-4 py-2 text-white">
        Go Home
      </a>
    </div>
  );
}
