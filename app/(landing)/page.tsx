import { Footer } from "./_components/footer";
import { Heading } from "./_components/heading";
import { Heroes } from "./_components/heroes";
import { Features } from "./_components/features";
import { Showcase } from "./_components/showcase";

export default function LandingPage() {
  return (
    <div className="flex min-h-full flex-col bg-white dark:bg-neutral-900">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center px-4 pb-16 pt-14 sm:px-6 md:pb-20 md:pt-24">
        <Heading />
        <Heroes />
      </div>

      {/* Features Section */}
      <Features />

      {/* CTA Section */}
      <Showcase />

      {/* Footer */}
      <Footer />
    </div>
  );
}
