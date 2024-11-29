"use client";

import {
  getQuizzes,
  getUsersByQuiz,
  updateQuiz,
  updateUserQuizLink,
  updateUserScore,
} from "@/lib/admin/quiz";
import { useState, useEffect } from "react";
import { Quiz, QuizUser } from "@/types/common";

export default function QuizzesTable() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [quizUsers, setQuizUsers] = useState<QuizUser[]>([]);

  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [isEditingQuiz, setIsEditingQuiz] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [showUsers, setShowUsers] = useState(false);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await getQuizzes();
        if (response) setQuizzes(response); // No type error here since the structure matches
      } catch (err) {
        console.error("Error fetching quizzes:", err);
      }
    };

    fetchQuizzes();
  }, []);

  const handleSaveQuiz = async () => {
    try {
      if (selectedQuiz) {
        await updateQuiz(selectedQuiz.id, { title, description });
        alert("Quiz updated successfully.");
        setIsEditingQuiz(false);
        setSelectedQuiz(null);
        setTitle("");
        setDescription("");
      }
    } catch (err) {
      console.error("Error updating quiz:", err);
    }
  };

  const handleAssignScore = async (userId: string, score: number) => {
    try {
      await updateUserScore(userId, selectedQuiz!.id, score);
      alert("Score updated successfully.");
      const updatedUsers = quizUsers.map((user) =>
        user.id === userId ? { ...user, score } : user
      );
      setQuizUsers(updatedUsers);
    } catch (err) {
      console.error("Error assigning score:", err);
    }
  };

  const handleUpdateLink = async (userId: string, link: string) => {
    try {
      await updateUserQuizLink(userId, selectedQuiz!.id, link);
      alert("Link updated successfully.");
      const updatedUsers = quizUsers.map((user) =>
        user.id === userId ? { ...user, link } : user
      );
      setQuizUsers(updatedUsers);
    } catch (err) {
      console.error("Error updating link:", err);
    }
  };
  const handleViewUsers = async (quiz: Quiz) => {
    try {
      const users = await getUsersByQuiz(quiz.id);
      setSelectedQuiz(quiz);
      setQuizUsers(users); // No type error since users now match QuizUser[]
      setShowUsers(true);
    } catch (err) {
      console.error("Error fetching users for quiz:", err);
    }
  };

  return (
    <div>
      {/* Quiz Table */}
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2">Title</th>
            <th className="border border-gray-300 px-4 py-2">Description</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {quizzes.map((quiz) => (
            <tr key={quiz.id} className="bg-white hover:bg-gray-100">
              <td className="border border-gray-300 px-4 py-2">{quiz.title}</td>
              <td className="border border-gray-300 px-4 py-2">
                {quiz.description}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <button
                  onClick={() => {
                    setSelectedQuiz(quiz);
                    setTitle(quiz.title);
                    setDescription(quiz.description);
                    setIsEditingQuiz(true);
                  }}
                  className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleViewUsers(quiz)}
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                >
                  View Users
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Quiz */}
      {isEditingQuiz && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold">Edit Quiz</h3>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border rounded p-2 w-full mb-2"
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border rounded p-2 w-full mb-2"
          />
          <button
            onClick={handleSaveQuiz}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Save Changes
          </button>
        </div>
      )}

      {/* Assigned Users Table */}
      {showUsers && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold">Assigned Users</h3>
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">Name</th>
                <th className="border border-gray-300 px-4 py-2">Score</th>
                <th className="border border-gray-300 px-4 py-2">Link</th>
                <th className="border border-gray-300 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {quizUsers.map((user) => (
                <tr key={user.id} className="bg-white hover:bg-gray-100">
                  <td className="border border-gray-300 px-4 py-2">
                    {user.user.name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <input
                      type="number"
                      value={user.score}
                      onChange={(e) =>
                        handleAssignScore(user.userId, parseInt(e.target.value))
                      }
                      className="border rounded p-1 w-16"
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <input
                      type="text"
                      value={user.link || ""}
                      onChange={(e) =>
                        handleUpdateLink(user.userId, e.target.value)
                      }
                      className="border rounded p-2 w-full"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
