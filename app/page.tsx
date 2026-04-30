import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <main className="text-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          Welcome to Tour & Activities
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Discover amazing tours and experiences in Bangladesh
        </p>
        
        <div className="space-y-4">
          <Link
            href="/search"
            className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition transform hover:scale-105"
          >
            Explore Tours
          </Link>
          
          <div className="mt-12 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto px-4">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-2">🌍</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">32+ Tours</h3>
              <p className="text-gray-600">Explore diverse destinations and experiences</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-2">⭐</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Top Rated</h3>
              <p className="text-gray-600">Highly rated tours with excellent reviews</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-2">✨</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Easy Booking</h3>
              <p className="text-gray-600">Simple and secure booking process</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

