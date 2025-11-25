import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

// Fixed camp end date - 21 days from November 23, 2025
const CAMP_END_DATE = new Date("2025-12-15T23:59:59");

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const now = new Date();
    const difference = CAMP_END_DATE.getTime() - now.getTime();

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-6 py-3" data-testid="countdown-timer">
      <Clock className="w-5 h-5 text-white" />
      <div className="flex items-center gap-2 font-poppins">
        <div className="text-center">
          <div className="text-3xl md:text-4xl font-bold text-white" data-testid="text-days">
            {timeLeft.days}
          </div>
          <div className="text-xs text-white/80 uppercase tracking-wide">Days</div>
        </div>
        <div className="text-2xl text-white/60">:</div>
        <div className="text-center">
          <div className="text-3xl md:text-4xl font-bold text-white" data-testid="text-hours">
            {String(timeLeft.hours).padStart(2, '0')}
          </div>
          <div className="text-xs text-white/80 uppercase tracking-wide">Hours</div>
        </div>
        <div className="text-2xl text-white/60">:</div>
        <div className="text-center">
          <div className="text-3xl md:text-4xl font-bold text-white" data-testid="text-minutes">
            {String(timeLeft.minutes).padStart(2, '0')}
          </div>
          <div className="text-xs text-white/80 uppercase tracking-wide">Mins</div>
        </div>
      </div>
    </div>
  );
}
