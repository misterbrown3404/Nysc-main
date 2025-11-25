import {
  type User,
  type InsertUser,
  type Challenge,
  type InsertChallenge,
  type Submission,
  type InsertSubmission,
  type Hype,
  type InsertHype,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserHypePoints(userId: string, points: number): Promise<void>;
  getAllUsers(): Promise<User[]>;

  // Challenges
  getAllChallenges(): Promise<Challenge[]>;
  getChallenge(id: string): Promise<Challenge | undefined>;
  createChallenge(challenge: InsertChallenge): Promise<Challenge>;
  incrementChallengeParticipants(challengeId: string): Promise<void>;

  // Submissions
  getAllSubmissions(): Promise<Submission[]>;
  getSubmission(id: string): Promise<Submission | undefined>;
  getSubmissionsByChallenge(challengeId: string): Promise<Submission[]>;
  createSubmission(submission: InsertSubmission): Promise<Submission>;
  incrementSubmissionHype(submissionId: string): Promise<void>;

  // Hypes
  createHype(hype: InsertHype): Promise<Hype>;
  hasUserHyped(submissionId: string, userId: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private challenges: Map<string, Challenge>;
  private submissions: Map<string, Submission>;
  private hypes: Map<string, Hype>;
  // Composite key for efficient hype lookups: "submissionId:userId"
  private hypeIndex: Set<string>;

  constructor() {
    this.users = new Map();
    this.challenges = new Map();
    this.submissions = new Map();
    this.hypes = new Map();
    this.hypeIndex = new Set();

    // Seed initial challenges
    this.seedChallenges();
  }

  private seedChallenges() {
    const initialChallenges: InsertChallenge[] = [
      {
        title: "Best Parade March",
        description: "Show us your sharpest parade march! Precision, style, and energy - let's see who has the best formation.",
        emoji: "🎖️",
      },
      {
        title: "Platoon Chant Battle",
        description: "Record your platoon's most creative chant! The louder and more coordinated, the better. Rep your platoon!",
        emoji: "📣",
      },
      {
        title: "Funniest Camp Moment",
        description: "Capture the comedy of camp life. From mess hall mishaps to parade bloopers - make us laugh!",
        emoji: "😂",
      },
      {
        title: "Man O' War Challenge",
        description: "Show off your physical training skills! Push-ups, obstacle course, or any MOW activity that showcases your strength.",
        emoji: "💪",
      },
      {
        title: "Best Camp Fit",
        description: "Style meets service! Show us how you rock the white shorts and shirt. Fashion on the parade ground!",
        emoji: "👕",
      },
      {
        title: "Early Morning Drill",
        description: "Capture the energy of 5 AM wake-up! Who's ready to conquer the day from the crack of dawn?",
        emoji: "🌅",
      },
      {
        title: "Mess Hall Chronicles",
        description: "Document the camp food experience. From rice and stew to indomie nights - what's on your plate?",
        emoji: "🍚",
      },
      {
        title: "State Pride",
        description: "Rep your state with pride! Show us what makes your state special during camp activities.",
        emoji: "🏁",
      },
      {
        title: "Camper's Creativity",
        description: "Arts, crafts, or any creative expression during camp. Show us your artistic side!",
        emoji: "🎨",
      },
      {
        title: "Friendship Goals",
        description: "Capture the bonds formed at camp. Tag your new friends and show us the camp family vibes!",
        emoji: "🤝",
      },
    ];

    initialChallenges.forEach((challenge) => {
      const id = randomUUID();
      this.challenges.set(id, {
        id,
        ...challenge,
        participantCount: Math.floor(Math.random() * 50),
        createdAt: new Date(),
      });
    });
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id, totalHypePoints: 0 };
    this.users.set(id, user);
    return user;
  }

  async updateUserHypePoints(userId: string, points: number): Promise<void> {
    const user = this.users.get(userId);
    if (user) {
      user.totalHypePoints += points;
      this.users.set(userId, user);
    }
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Challenges
  async getAllChallenges(): Promise<Challenge[]> {
    return Array.from(this.challenges.values()).sort(
      (a, b) => b.participantCount - a.participantCount
    );
  }

  async getChallenge(id: string): Promise<Challenge | undefined> {
    return this.challenges.get(id);
  }

  async createChallenge(insertChallenge: InsertChallenge): Promise<Challenge> {
    const id = randomUUID();
    const challenge: Challenge = {
      id,
      ...insertChallenge,
      participantCount: 0,
      createdAt: new Date(),
    };
    this.challenges.set(id, challenge);
    return challenge;
  }

  async incrementChallengeParticipants(challengeId: string): Promise<void> {
    const challenge = this.challenges.get(challengeId);
    if (challenge) {
      challenge.participantCount += 1;
      this.challenges.set(challengeId, challenge);
    }
  }

  // Submissions
  async getAllSubmissions(): Promise<Submission[]> {
    return Array.from(this.submissions.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async getSubmission(id: string): Promise<Submission | undefined> {
    return this.submissions.get(id);
  }

  async getSubmissionsByChallenge(
    challengeId: string
  ): Promise<Submission[]> {
    return Array.from(this.submissions.values()).filter(
      (submission) => submission.challengeId === challengeId
    );
  }

  async createSubmission(
    insertSubmission: InsertSubmission
  ): Promise<Submission> {
    const id = randomUUID();
    const submission: Submission = {
      id,
      ...insertSubmission,
      hypeCount: 0,
      createdAt: new Date(),
    };
    this.submissions.set(id, submission);
    return submission;
  }

  async incrementSubmissionHype(submissionId: string): Promise<void> {
    const submission = this.submissions.get(submissionId);
    if (submission) {
      submission.hypeCount += 1;
      this.submissions.set(submissionId, submission);
    }
  }

  // Hypes
  async createHype(insertHype: InsertHype): Promise<Hype> {
    const compositeKey = `${insertHype.submissionId}:${insertHype.userId}`;
    
    // Check if hype already exists using the index
    if (this.hypeIndex.has(compositeKey)) {
      throw new Error("User has already hyped this submission");
    }

    const id = randomUUID();
    const hype: Hype = {
      id,
      ...insertHype,
      createdAt: new Date(),
    };
    
    this.hypes.set(id, hype);
    this.hypeIndex.add(compositeKey);
    
    return hype;
  }

  async hasUserHyped(submissionId: string, userId: string): Promise<boolean> {
    const compositeKey = `${submissionId}:${userId}`;
    return this.hypeIndex.has(compositeKey);
  }
}

export const storage = new MemStorage();
