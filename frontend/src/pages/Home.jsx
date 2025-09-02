import { Link, useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    // later we will grab values and redirect to /jobs?search=...&location=...
    navigate("/jobs");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-20">
        <div className="container mx-auto text-center px-6">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Find Your Dream Job with HireSphere
          </h1>
        </div>
      </section>

      {/* Quick Search */}
      <section className="py-12 bg-white shadow-sm">
        <div className="container mx-auto px-6">
          <form
            onSubmit={handleSearch}
            className="flex flex-col md:flex-row gap-4 md:gap-2 justify-center"
          >
            <input
              type="text"
              placeholder="Job title or keyword"
              className="border rounded-lg px-4 py-2 w-full md:w-1/3"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Search
            </button>
          </form>
        </div>
      </section>
      {/* Featured Jobs (placeholder for now) */}
      <section className="py-16 container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-10">
          Featured Jobs
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {/* Static placeholders, will replace with API data */}
          <div className="border rounded-lg p-6 shadow bg-white">
            <h3 className="text-xl font-semibold">Frontend Developer</h3>
            <p className="text-gray-600">ABC Tech • Bangalore</p>
          </div>
          <div className="border rounded-lg p-6 shadow bg-white">
            <h3 className="text-xl font-semibold">Backend Engineer</h3>
            <p className="text-gray-600">XYZ Corp • Remote</p>
          </div>
          <div className="border rounded-lg p-6 shadow bg-white">
            <h3 className="text-xl font-semibold">Data Scientist</h3>
            <p className="text-gray-600">123 Analytics • Hyderabad</p>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-6 grid gap-8 md:grid-cols-3">
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <h3 className="text-xl font-bold mb-2">For Candidates</h3>
            <p className="text-gray-600">
              Apply to jobs, track applications, and practice interviews.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <h3 className="text-xl font-bold mb-2">For Recruiters</h3>
            <p className="text-gray-600">
              Post jobs, view applicants, and shortlist top talent.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <h3 className="text-xl font-bold mb-2">AI Features</h3>
            <p className="text-gray-600">
              Resume scoring and smart interview simulations with AI.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
