import { motion } from "framer-motion";
import { AssignedQuiz } from "@/types/common";

interface AssignedQuizzesProps {
  quizzes: AssignedQuiz[]; // Define a custom interface for the quizzes prop
}

export default function AssignedQuizzes({ quizzes }: AssignedQuizzesProps) {
  return (
    <motion.div
      className="mt-8 bg-white shadow-xl rounded-lg overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Assigned Quizzes
        </h2>
        <div className="overflow-auto">
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Title
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Description
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Link
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Score
                </th>
              </tr>
            </thead>
            <tbody>
              {quizzes.map((quiz) => (
                <tr key={quiz.id} className="hover:bg-gray-100">
                  <td className="border border-gray-300 px-4 py-2">
                    {quiz.title}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {quiz.description}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {quiz.url ? (
                      <a
                        href={quiz.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-500 underline"
                      >
                        Open Quiz
                      </a>
                    ) : (
                      "Not Available"
                    )}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {quiz.score}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
