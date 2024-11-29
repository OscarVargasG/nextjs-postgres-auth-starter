import { motion } from "framer-motion";

interface DonationProgressProps {
  goal: number; // The goal amount
  current: number; // The current donation amount
}

export default function DonationProgress({
  goal,
  current,
}: DonationProgressProps) {
  // Calculate the percentage of progress
  const percentage = goal > 0 ? Math.min((current / goal) * 100, 100) : 0;

  return (
    <motion.div
      className="mt-8 bg-white shadow-xl rounded-lg overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Progreso hacia la meta
        </h2>
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-200">
                Meta: ${goal.toLocaleString()}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold inline-block text-indigo-600">
                Actual: ${current.toLocaleString()} ({percentage.toFixed(1)}%)
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-200">
            <div
              style={{ width: `${percentage}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
            ></div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
