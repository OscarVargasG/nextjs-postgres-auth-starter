"use client";

import { useState, useEffect } from "react";
import {
  updateDonationStats,
  createUserDonation,
  getDonations,
  calculateCurrentDonations,
} from "@/lib/admin/donation";
import { getUsers } from "@/lib/admin/user";
import { User } from "@/types/common";

export default function DonationsTable() {
  const [goal, setGoal] = useState(0); // State for the global donation goal
  const [current, setCurrent] = useState(0); // State for the current donation amount
  const [users, setUsers] = useState<User[]>([]); // List of users
  const [selectedUser, setSelectedUser] = useState<User | null>(null); // Selected user for donation
  const [donationAmount, setDonationAmount] = useState(""); // Amount for the donation
  const [donations, setDonations] = useState<
    { user: { name: string; email: string }; amount: number }[]
  >([]); // List of registered donations

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch users
        const usersResponse = await getUsers();
        if (usersResponse) setUsers(usersResponse);

        // Fetch global donation goal
        const statsResponse = await updateDonationStats(goal); // Fetch the global goal
        if (statsResponse) setGoal(statsResponse.goal);

        // Fetch current donations
        const totalCurrent = await calculateCurrentDonations();
        setCurrent(totalCurrent);

        // Fetch registered donations
        const donationsResponse = await getDonations();
        if (donationsResponse) {
          setDonations(donationsResponse);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  // Update the global donation goal
  const handleUpdateGoal = async () => {
    try {
      const updatedStats = await updateDonationStats(goal);
      setGoal(updatedStats.goal);
      alert("Global donation goal updated successfully.");
    } catch (err) {
      console.error("Error updating the goal:", err);
    }
  };

  // Register a donation for a specific user
  const handleRegisterDonation = async () => {
    if (!selectedUser || !donationAmount) {
      alert("Please select a user and specify a donation amount.");
      return;
    }

    try {
      await createUserDonation(selectedUser.id, parseFloat(donationAmount));
      alert("Donation registered successfully.");

      // Update the local state
      setDonations((prev) => [
        ...prev,
        {
          user: {
            name: selectedUser.name,
            email: selectedUser.email,
          },
          amount: parseFloat(donationAmount),
        },
      ]);
      setCurrent((prev) => prev + parseFloat(donationAmount));
      setDonationAmount("");
    } catch (err) {
      console.error("Error registering the donation:", err);
    }
  };

  return (
    <div>
      {/* Global donation goal */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Global Donation Goal</h2>
        <div className="flex items-center gap-4 mt-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Goal
            </label>
            <input
              type="number"
              value={goal}
              onChange={(e) => setGoal(parseFloat(e.target.value))}
              className="border rounded p-2 w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Current Amount
            </label>
            <input
              type="number"
              value={current}
              disabled
              className="border rounded p-2 w-full bg-gray-100 cursor-not-allowed"
            />
          </div>
          <button
            onClick={handleUpdateGoal}
            className="bg-green-500 text-white px-4 py-2 rounded mt-6"
          >
            Update Goal
          </button>
        </div>
      </div>

      {/* Register donations */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Register Donation</h2>
        <div className="flex items-center gap-4 mt-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              User
            </label>
            <select
              value={selectedUser ? selectedUser.id : ""}
              onChange={(e) =>
                setSelectedUser(
                  users.find((user) => user.id === e.target.value) || null
                )
              }
              className="border rounded p-2 w-full"
            >
              <option value="">Select a user</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Amount
            </label>
            <input
              type="number"
              value={donationAmount}
              onChange={(e) => setDonationAmount(e.target.value)}
              className="border rounded p-2 w-full"
            />
          </div>
          <button
            onClick={handleRegisterDonation}
            className="bg-blue-500 text-white px-4 py-2 rounded mt-6"
          >
            Register Donation
          </button>
        </div>
      </div>

      {/* Table of registered donations */}
      <div>
        <h2 className="text-xl font-semibold">Registered Donations</h2>
        <table className="table-auto w-full border-collapse border border-gray-300 mt-4">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">User</th>
              <th className="border border-gray-300 px-4 py-2">Email</th>
              <th className="border border-gray-300 px-4 py-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {donations.map((donation, index) => (
              <tr key={index} className="bg-white hover:bg-gray-100">
                <td className="border border-gray-300 px-4 py-2">
                  {donation.user.name}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {donation.user.email}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {donation.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
