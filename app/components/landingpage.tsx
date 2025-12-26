import React from "react";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">
            Boost Your Sales with Smart Analytics
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Yearly Sales visualizer
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <a
              href="#dashboard"
              className="px-6 py-3 bg-indigo-600 text-white text-lg font-semibold rounded-md hover:bg-indigo-700 transition"
            >
                Reports
            </a>
            <a
              href="#features"
              className="px-6 py-3 border border-indigo-600 text-indigo-600 text-lg font-semibold rounded-md hover:bg-indigo-50 transition"
            >
              Know more
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            What You Get
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-2">Interactive Charts</h3>
              <p className="text-gray-600">
               Explore sales data with dynamic bar and line charts.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-2">Threshold Filters</h3>
              <p className="text-gray-600">
                Filter out sales data below your desired threshold.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-2">Yearly Trends</h3>
              <p className="text-gray-600">
              Compare across the sales data of multiple years.
              </p>
            </div>
          </div>
        </div>
      </section>

    
    </main>
  );
}
