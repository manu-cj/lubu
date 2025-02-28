"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import {
  FaHome,
  FaUtensils,
  FaBus,
  FaHeartbeat,
  FaSmile,
  FaRedo,
  FaShieldAlt,
  FaBook,
  FaMoneyBillWave,
  FaPiggyBank,
  FaPaw,
  FaGift,
  FaQuestionCircle,
  FaPlane,
} from "react-icons/fa";

type Expense = {
  id: number;
  description: string;
  amount: number;
  date: string;
  category_id: number;
};

const AllExpenses: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [limit] = useState<number>(10);
  const [offset, setOffset] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const loadedIds = useRef(new Set<number>());

  const categoryIcons: Record<number, JSX.Element> = {
    1: <FaHome className="text-indigo-500 text-2xl md:text-3xl" />,
    2: <FaUtensils className="text-green-500 text-2xl md:text-3xl" />,
    3: <FaBus className="text-blue-500 text-2xl md:text-3xl" />,
    4: <FaHeartbeat className="text-red-500 text-2xl md:text-3xl" />,
    5: <FaSmile className="text-yellow-500 text-2xl md:text-3xl" />,
    6: <FaRedo className="text-orange-500 text-2xl md:text-3xl" />,
    7: <FaShieldAlt className="text-teal-500 text-2xl md:text-3xl" />,
    8: <FaBook className="text-blue-400 text-2xl md:text-3xl" />,
    9: <FaMoneyBillWave className="text-green-400 text-2xl md:text-3xl" />,
    10: <FaPiggyBank className="text-pink-500 text-2xl md:text-3xl" />,
    11: <FaPaw className="text-brown-500 text-2xl md:text-3xl" />,
    12: <FaGift className="text-purple-500 text-2xl md:text-3xl" />,
    13: <FaQuestionCircle className="text-gray-500 text-2xl md:text-3xl" />,
    14: <FaPlane className="text-cyan-500 text-2xl md:text-3xl" />,
  };

  const getIconByCategory = (categoryId: number) =>
    categoryIcons[categoryId] || (
      <FaQuestionCircle className="text-gray-500 text-2xl md:text-3xl" />
    );

  const fetchExpenses = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get("/api/expenses-by-page", {
        params: { limit, offset },
        withCredentials: true,
      });

      if (response.status === 200) {
        const fetchedExpenses = response.data.expense;
        const newExpenses = fetchedExpenses.filter(
          (expense: Expense) => !loadedIds.current.has(expense.id)
        );

        if (newExpenses.length === 0) {
          setHasMore(false);
        } else {
          setExpenses((prev) => [...prev, ...newExpenses]);
          newExpenses.forEach((expense: Expense) =>
            loadedIds.current.add(expense.id)
          );
          setOffset((prev) => prev + newExpenses.length);
        }
      } else {
        setError("Erreur lors de la récupération des données");
      }
    } catch (err) {
      setError("Erreur de connexion : " + err);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, limit, offset]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const target = e.target as HTMLDivElement;
      if (
        !loading &&
        hasMore &&
        target.scrollTop + target.clientHeight >= target.scrollHeight - 50
      ) {
        fetchExpenses();
      }
    },
    [loading, hasMore, fetchExpenses]
  );

  return (
    <>
      {error && (
        <p className="text-red-600 text-center mb-4 border border-red-500 rounded p-2 bg-red-100">
          {error}
        </p>
      )}

      <div
        className="w-full max-w-full sm:max-w-md h-[500px] overflow-y-scroll bg-white rounded-lg shadow-lg p-4 border border-gray-200 mx-auto"
        onScroll={handleScroll}
      >
        <ul className="space-y-2">
          {expenses.map((expense, index) => (
            <li
              key={`${expense.id}-${index}`}
              className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 p-3 rounded-lg shadow-sm border border-gray-200 transition-all duration-200"
            >
              <div className="flex items-center space-x-4">
                {getIconByCategory(expense.category_id)}
                <div className="flex-grow max-w-[65%]">
                  <p className="text-sm font-bold text-gray-800">
                    {expense.description}
                  </p>

                  <p className="text-xs text-gray-500">
                    {new Date(expense.date).toLocaleDateString("fr-FR")}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <p className="text-lg font-semibold text-orange-600">
                  {expense.amount.toFixed(2)} €
                </p>
              </div>
            </li>
          ))}
        </ul>
        {!hasMore && (
          <p className="text-center text-gray-500 mt-4">
            Toutes les données ont été chargées.
          </p>
        )}
        {loading && (
          <p className="text-center text-gray-500 mt-4">Chargement...</p>
        )}
      </div>
    </>
  );
};

export default AllExpenses;
