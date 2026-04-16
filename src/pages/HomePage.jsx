// src/pages/HomePage.jsx
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* HERO SECTION */}
      <section className="bg-red-600 text-white py-20 px-6 text-center shadow-lg">
        <h1 className="text-4xl md:text-5xl font-extrabold">
          Donate Blood, Save Lives ❤️
        </h1>
        <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto opacity-90">
          Join our community of donors and help save lives in your region.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <button
            className="bg-white text-red-600 font-bold px-6 py-3 rounded-xl shadow hover:bg-gray-100"
            onClick={() => navigate("/find-donor")}
          >
            🔍 Find Donor
          </button>

          <button
            className="bg-black/20 border border-white px-6 py-3 rounded-xl hover:bg-black/30"
            onClick={() => navigate("/request-blood")}
          >
            🩸 Request Blood
          </button>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-16 px-6">
        <h2 className="text-3xl font-bold text-center text-red-600">
          Why Choose Our Service?
        </h2>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <FeatureCard
            title="Find Nearby Donors"
            desc="Quickly locate eligible blood donors based on your location and required blood group."
            icon="📍"
          />

          <FeatureCard
            title="Fast Blood Request"
            desc="Submit a request and our admins will process it immediately for emergencies."
            icon="⏱️"
          />

          <FeatureCard
            title="Trusted Community"
            desc="Every donor is verified and manually approved by admin."
            icon="🔒"
          />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-white py-16 px-6 shadow-inner">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          How It Works
        </h2>

        <div className="mt-10 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <StepCard
            number="1"
            title="Search Donors"
            desc="Filter by blood group & location to find matching donors."
          />

          <StepCard
            number="2"
            title="Submit Blood Request"
            desc="Need blood urgently? Submit a request directly."
          />

          <StepCard
            number="3"
            title="Admin Connects You"
            desc="Admin will contact available donors instantly."
          />
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="py-16 px-6 bg-gray-100">
        <h2 className="text-3xl font-bold text-center text-red-600">
          Our Impact So Far
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10 max-w-5xl mx-auto">
          <StatCard number="1,250+" label="Registered Donors" />
          <StatCard number="850+" label="Successful Donations" />
          <StatCard number="320+" label="Blood Requests Served" />
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 text-center bg-red-600 text-white">
        <h2 className="text-4xl font-extrabold">Become a Life Saver Today!</h2>
        <p className="mt-3 text-lg opacity-90">
          Your small act of kindness can save someone's life.
        </p>

        <button
          className="mt-8 bg-white text-red-600 font-bold px-8 py-4 rounded-xl shadow-xl hover:bg-gray-100"
          onClick={() => navigate("/request-blood")}
        >
          🩸 Request Blood Now
        </button>
      </section>
    </div>
  );
}

/* Reusable Components */
function FeatureCard({ title, desc, icon }) {
  return (
    <div className="bg-white shadow-lg p-6 rounded-xl hover:shadow-xl transition text-center border">
      <div className="text-4xl">{icon}</div>
      <h3 className="text-xl font-bold mt-4">{title}</h3>
      <p className="text-gray-600 mt-2">{desc}</p>
    </div>
  );
}

function StepCard({ number, title, desc }) {
  return (
    <div className="bg-gray-50 p-6 rounded-xl shadow text-center border">
      <div className="text-4xl font-extrabold text-red-600">{number}</div>
      <h3 className="text-xl font-bold mt-4">{title}</h3>
      <p className="text-gray-600 mt-2">{desc}</p>
    </div>
  );
}

function StatCard({ number, label }) {
  return (
    <div className="bg-white shadow-lg p-8 rounded-xl text-center border">
      <h3 className="text-3xl font-bold text-red-600">{number}</h3>
      <p className="text-gray-700 mt-2 font-medium">{label}</p>
    </div>
  );
}