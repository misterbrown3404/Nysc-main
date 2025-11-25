import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import CountdownTimer from "./countdown-timer";
import heroImage from "@assets/generated_images/nysc_corps_members_parade_formation.png";
import { Link } from "wouter";

const motivationalQuotes = [
  "Make your camp experience unforgettable!",
  "Service with energy, fun with purpose!",
  "21 days of memories, a lifetime of bonds!",
  "Your platoon, your vibe, your story!",
  "Camp life hits different with the right energy!",
];

export default function HeroSection() {
  const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

  return (
    <section className="relative h-[500px] md:h-[600px] w-full overflow-hidden">
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="NYSC Corps Members"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
      </div>

      {/* Content */}
      <div className="relative h-full max-w-7xl mx-auto px-4 flex flex-col items-center justify-center text-center">
        <div className="mb-6">
          <CountdownTimer />
        </div>

        <h1 className="text-5xl md:text-7xl font-bold font-poppins text-white mb-4 tracking-tight">
          NYSC Camp Cruise
        </h1>

        <p className="text-xl md:text-2xl font-medium font-inter text-white/90 mb-3 max-w-2xl">
          {randomQuote}
        </p>

        <p className="text-base md:text-lg font-inter text-white/80 mb-8 max-w-xl">
          Join corps members nationwide in epic challenges, share your moments, and climb the hype leaderboard!
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/upload">
            <Button
              size="lg"
              variant="default"
              className="text-lg px-8 py-6 font-semibold font-inter"
              data-testid="button-join-challenge"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Join Today's Challenge
            </Button>
          </Link>
          
          <Button
            size="lg"
            variant="outline"
            className="text-lg px-8 py-6 font-semibold font-inter bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20"
            data-testid="button-view-challenges"
            onClick={() => {
              const element = document.getElementById('trending-challenges');
              element?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            View All Challenges
          </Button>
        </div>
      </div>
    </section>
  );
}
