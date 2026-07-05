import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/sections/hero";
import { AboutSection } from "@/components/sections/about-section";
import { CalendarSection } from "@/components/sections/calendar-section";
import { VolunteerSection } from "@/components/sections/volunteer-section";
import { DonationsSection } from "@/components/sections/donations-section";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <AboutSection />
        <CalendarSection />
        <VolunteerSection />
        <DonationsSection />
      </main>
      <Footer />
    </>
  );
}
