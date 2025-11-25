import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Flame, Trophy, Award, MapPin, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { getUserIdentity, setUserIdentity } from "@/lib/user-identity";

export default function ProfilePage() {
  const [user, setUser] = useState({
    username: "Corper",
    state: "Unknown",
    platoon: "0",
    totalHypePoints: 0,
    rank: 0,
    submissionsCount: 0,
    challengesCompleted: 0,
  });

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    username: "",
    state: "",
    platoon: "",
  });

  useEffect(() => {
    const identity = getUserIdentity();
    if (identity) {
      setUser(prev => ({
        ...prev,
        username: identity.username,
        state: identity.state,
        platoon: identity.platoon,
      }));
      setEditForm({
        username: identity.username,
        state: identity.state,
        platoon: identity.platoon,
      });
    }
  }, []);

  const handleSaveProfile = () => {
    if (editForm.username.trim() && editForm.state.trim() && editForm.platoon.trim()) {
      setUserIdentity({
        userId: getUserIdentity()?.userId || "default-user",
        username: editForm.username,
        state: editForm.state,
        platoon: editForm.platoon,
      });
      setUser(prev => ({
        ...prev,
        username: editForm.username,
        state: editForm.state,
        platoon: editForm.platoon,
      }));
      setIsEditOpen(false);
    }
  };

  const initials = user.username
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      {/* Header */}
      <section className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border-b border-border">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <div className="flex flex-col items-center text-center">
            <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-primary mb-4">
              <AvatarFallback className="bg-primary text-primary-foreground font-bold font-poppins text-4xl">
                {initials}
              </AvatarFallback>
            </Avatar>
            <h1 className="text-3xl md:text-4xl font-bold font-poppins mb-2" data-testid="text-username">
              {user.username}
            </h1>
            <div className="flex items-center gap-3 flex-wrap justify-center mb-4">
              <Badge variant="secondary" className="text-base">
                <MapPin className="w-4 h-4 mr-1" />
                {user.state}
              </Badge>
              <Badge variant="secondary" className="text-base">
                <Users className="w-4 h-4 mr-1" />
                Platoon {user.platoon}
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-3xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="text-center">
            <CardContent className="pt-6 pb-6">
              <Flame className="w-8 h-8 text-chart-5 mx-auto mb-2" />
              <div className="text-3xl font-bold font-poppins mb-1" data-testid="text-hype-points">
                {user.totalHypePoints}
              </div>
              <div className="text-sm text-muted-foreground font-inter">
                Hype Points
              </div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6 pb-6">
              <Trophy className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-3xl font-bold font-poppins mb-1" data-testid="text-rank">
                #{user.rank}
              </div>
              <div className="text-sm text-muted-foreground font-inter">
                Rank
              </div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6 pb-6">
              <Award className="w-8 h-8 text-chart-2 mx-auto mb-2" />
              <div className="text-3xl font-bold font-poppins mb-1" data-testid="text-challenges">
                {user.challengesCompleted}
              </div>
              <div className="text-sm text-muted-foreground font-inter">
                Challenges
              </div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6 pb-6">
              <div className="text-3xl mx-auto mb-2">📸</div>
              <div className="text-3xl font-bold font-poppins mb-1" data-testid="text-submissions">
                {user.submissionsCount}
              </div>
              <div className="text-sm text-muted-foreground font-inter">
                Posts
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Achievements Section */}
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-semibold font-poppins">
              Achievements
            </h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-4xl mb-2">🏆</div>
                <div className="text-sm font-medium font-inter">First Post</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-4xl mb-2">🔥</div>
                <div className="text-sm font-medium font-inter">100 Hype Points</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-4xl mb-2">⭐</div>
                <div className="text-sm font-medium font-inter">5 Challenges</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="mt-8 space-y-3">
          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full font-semibold font-inter"
                data-testid="button-edit-profile"
              >
                Edit Profile
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit Your Profile</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-base">Username</Label>
                  <Input
                    id="username"
                    value={editForm.username}
                    onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                    placeholder="Enter your username"
                    className="text-base"
                    data-testid="input-edit-username"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state" className="text-base">State</Label>
                  <Input
                    id="state"
                    value={editForm.state}
                    onChange={(e) => setEditForm({ ...editForm, state: e.target.value })}
                    placeholder="Enter your state"
                    className="text-base"
                    data-testid="input-edit-state"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="platoon" className="text-base">Platoon</Label>
                  <Input
                    id="platoon"
                    value={editForm.platoon}
                    onChange={(e) => setEditForm({ ...editForm, platoon: e.target.value })}
                    placeholder="Enter your platoon number"
                    className="text-base"
                    data-testid="input-edit-platoon"
                  />
                </div>
                <Button
                  onClick={handleSaveProfile}
                  className="w-full font-semibold font-inter"
                  data-testid="button-save-profile"
                >
                  Save Changes
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button
            variant="ghost"
            className="w-full font-semibold font-inter"
            data-testid="button-settings"
          >
            Settings
          </Button>
        </div>
      </section>
    </div>
  );
}
