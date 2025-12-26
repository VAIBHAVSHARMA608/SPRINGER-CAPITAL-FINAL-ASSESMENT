import LandingPage from "./components/landingpage";
import Dashboard from "./components/dashboard";

export default function Home() {
  return (
    <>
      <LandingPage />
      <section id="dashboard" className="bg-gray-50">
        <Dashboard />
      </section>
    </>
  );
}
