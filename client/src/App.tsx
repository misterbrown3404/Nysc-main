import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import HomePage from "@/pages/home-page";
import ChallengesPage from "@/pages/challenges-page";
import LeaderboardPage from "@/pages/leaderboard-page";
import UploadPage from "@/pages/upload-page";
import ProfilePage from "@/pages/profile-page";
import BottomNav from "@/components/bottom-nav";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/challenges" component={ChallengesPage} />
        <Route path="/leaderboard" component={LeaderboardPage} />
        <Route path="/upload" component={UploadPage} />
        <Route path="/profile" component={ProfilePage} />
        <Route component={NotFound} />
      </Switch>
      <BottomNav />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
