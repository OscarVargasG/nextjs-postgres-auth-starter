"use client";

import {
  getQuizzes,
  getUsersByQuiz,
  updateQuiz,
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
  const [url, setUrl] = useState("");
  const [showUsers, setShowUsers] = useState(false);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await getQuizzes();
        if (response) setQuizzes(response);
      } catch (err) {
        console.error("Error fetching quizzes:", err);
      }
    };

    fetchQuizzes();
  }, []);

  const handleSaveQuiz = async () => {
    try {
      if (selectedQuiz) {
        await updateQuiz(selectedQuiz.id, { title, description, url });
        alert("Quiz updated successfully.");
        setIsEditingQuiz(false);
        setSelectedQuiz(null);
        setTitle("");
        setDescription("");
        setUrl("");
        // Actualizar la lista de quizzes
        const response = await getQuizzes();
        if (response) setQuizzes(response);
      }
    } catch (err) {
      console.error("Error updating quiz:", err);
    }
  };

  const handleAssignScore = async (userId: string, score: number) => {
    try {
      if (selectedQuiz) {
        await updateUserScore(userId, selectedQuiz.id, score);
        alert("Score updated successfully.");
        const updatedUsers = quizUsers.map((user) =>
          user.userId === userId ? { ...user, score } : user
        );
        setQuizUsers(updatedUsers);
      }
    } catch (err) {
      console.error("Error assigning score:", err);
    }
  };

  const handleViewUsers = async (quiz: Quiz) => {
    try {
      const users = await getUsersByQuiz(quiz.id);
      setSelectedQuiz(quiz);
      setQuizUsers(users);
      setShowUsers(true);
    } catch (err) {
      console.error("Error fetching users for quiz:", err);
    }
  };

  return (
    <div>
      {/* Tabla de Quizzes */}
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2">Title</th>
            <th className="border border-gray-300 px-4 py-2">Description</th>
            <th className="border border-gray-300 px-4 py-2">URL</th>
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
                <a
                  href={quiz.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-500 underline"
                >
                  Open Quiz
                </a>
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <button
                  onClick={() => {
                    setSelectedQuiz(quiz);
                    setTitle(quiz.title);
                    setDescription(quiz.description);
                    setUrl(quiz.url);
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

      {/* Editar Quiz */}
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
          <input
            type="text"
            placeholder="URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
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

      {/* Tabla de Usuarios Asignados */}
      {showUsers && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold">Assigned Users</h3>
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">Name</th>
                <th className="border border-gray-300 px-4 py-2">Score</th>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
