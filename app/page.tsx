import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">
          Book Reader
        </h1>
        <p className="text-center text-lg mb-8">
          AI-Powered Voice Reading with Eleven Labs
        </p>

        <div className="flex justify-center gap-4 mb-12">
          <Link
            href="/login"
            className="px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Sign Up
          </Link>
        </div>

        <div className="grid text-center lg:grid-cols-3 lg:text-left gap-4">
          <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100">
            <h2 className="mb-3 text-2xl font-semibold">
              Upload Books
            </h2>
            <p className="m-0 max-w-[30ch] text-sm opacity-50">
              Upload PDF books to your personal library
            </p>
          </div>

          <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100">
            <h2 className="mb-3 text-2xl font-semibold">
              Clone Voice
            </h2>
            <p className="m-0 max-w-[30ch] text-sm opacity-50">
              Create custom voices with Eleven Labs AI
            </p>
          </div>

          <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100">
            <h2 className="mb-3 text-2xl font-semibold">
              Listen
            </h2>
            <p className="m-0 max-w-[30ch] text-sm opacity-50">
              Enjoy your books read aloud in your chosen voice
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
