import Link from "next/link";

export default function BlogNotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center text-center">
      <h1 className="text-3xl font-bold">Blog Post Not Found</h1>
      <p className="mt-2 text-gray-600">
        The Question you’re looking for doesn’t exist or was removed.
      </p>
      <Link href="/blog" className="mt-4 rounded bg-blue-600 px-4 py-2 text-white">
        Back to /Questions
      </Link>
    </div>
  );
}
