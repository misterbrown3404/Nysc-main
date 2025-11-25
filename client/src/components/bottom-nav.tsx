import { Home, Trophy, PlusCircle, Flame, User } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function BottomNav() {
  const [location] = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/challenges", icon: Trophy, label: "Challenges" },
    { path: "/upload", icon: PlusCircle, label: "Upload", isElevated: true },
    { path: "/leaderboard", icon: Flame, label: "Leaderboard" },
    { path: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-card-border lg:hidden z-50">
      <div className="flex items-end justify-around px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path;

          if (item.isElevated) {
            return (
              <Link
                key={item.path}
                href={item.path}
                className="-mt-6"
                data-testid={`nav-${item.label.toLowerCase()}`}
              >
                <div className="flex flex-col items-center">
                  <div className="bg-primary text-primary-foreground rounded-full p-4 shadow-lg hover-elevate active-elevate-2">
                    <Icon className="w-7 h-7" strokeWidth={2.5} />
                  </div>
                  <span className="text-xs font-medium font-inter mt-1">
                    {item.label}
                  </span>
                </div>
              </Link>
            );
          }

          return (
            <Link
              key={item.path}
              href={item.path}
              data-testid={`nav-${item.label.toLowerCase()}`}
            >
              <div
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon
                  className="w-6 h-6"
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span className="text-xs font-medium font-inter">
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
