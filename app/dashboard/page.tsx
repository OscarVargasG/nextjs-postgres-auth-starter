"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

import { useEffect, useState } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { AssignedQuiz, Player, UserSession } from "@/types/common";
import Leaderboard from "@/components/sections/leaderboard";
import UserProfile from "@/components/sections/userProfile";
import DonationProgress from "@/components/sections/donationProgress";
import { getUserByEmail } from "@/lib/users/profile";
import { getLeaderboard } from "@/lib/quizzes/leaderboard";
import { getDonationsStats } from "@/lib/admin/donation";
import { getQuizzesByEmail } from "@/lib/admin/quiz";
import Link from "next/link";
import LoadingSpinnerSection from "@/components/LoadingSpinnerSection";
import AssignedQuizzes from "@/components/sections/assignedQuizzes";
import { LogoutButton } from "@/components/buttons.component";

const defaultUserSession: UserSession = { email: "", name: "", image: "" };

export default function DashboardPage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/api/auth/signin");
    },
  });

  const [leaderboardData, setLeaderboardData] = useState<Player[]>([]);
  const [userSession, setUserSession] = useState(defaultUserSession);
  const [loadingContent, setLoadingContent] = useState(true);
  const [goal, setGoal] = useState(0); // Global donation goal
  const [current, setCurrent] = useState(0); // Current donation amount
  const [assignedQuizzes, setAssignedQuizzes] = useState<AssignedQuiz[]>([]); // User's assigned quizzes

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (status !== "loading" && session?.user?.email) {
          const currentEmail = session.user.email;

          // Fetch user data
          const response = await getUserByEmail(currentEmail);
          const userData = response.user;
          setUserSession(userData);

          // Fetch leaderboard data
          const leaderboard = await getLeaderboard();
          setLeaderboardData(leaderboard);

          // Fetch donation stats
          const donationStats = await getDonationsStats();
          if (donationStats) {
            setGoal(donationStats.goal);
            setCurrent(donationStats.current);
          }

          // Fetch assigned quizzes
          const userQuizzes = await getQuizzesByEmail(currentEmail);

          setAssignedQuizzes(userQuizzes);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoadingContent(false);
      }
    };

    fetchData();
  }, [status]);

  if (status === "loading" || loadingContent) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Row: Welcome and Logout Button */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            ¡Bienvenido, {userSession.name}!
          </h1>
          <LogoutButton />
        </div>
        {/* End Row */}

        {session?.user?.email === "admin@admin.com" && (
          <Link
            href="/dashboard/admin"
            className="mt-4 px-6 py-3 bg-yellow-500 text-white rounded-full font-semibold hover:bg-yellow-600 transition-colors"
          >
            Panel de Administración
          </Link>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          {userSession.name ? (
            <UserProfile
              userSession={userSession}
              setUserSession={setUserSession}
            />
          ) : (
            <LoadingSpinnerSection />
          )}

          <Leaderboard leaderboardData={leaderboardData} />
        </div>

        {/* Donation Progress */}
        <DonationProgress goal={goal} current={current} />

        {/* Assigned Quizzes */}
        <AssignedQuizzes quizzes={assignedQuizzes} />
      </div>
    </div>
  );
}
