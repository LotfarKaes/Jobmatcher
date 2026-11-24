import { CtaSection } from "@/components/home/CtaSection";
import { DevApiNote } from "@/components/home/DevApiNote";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { HeroSection } from "@/components/home/HeroSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { JobMatchesSection } from "@/components/home/JobMatchesSection";
import { TeamSection } from "@/components/home/TeamSection";

export default function HomePage() {
  return (
    <main className="flex-1">
      <HeroSection />
      <JobMatchesSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TeamSection />
      <CtaSection />
      <DevApiNote />
    </main>
  );
}