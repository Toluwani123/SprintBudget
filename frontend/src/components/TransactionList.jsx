import React from 'react';

import {
  ShoppingCart,
  Car,
  Home,
  Coffee,
  CreditCard,
  TrendingUp,
} from 'lucide-react';

import {Badge} from '@/components/ui/badge';
import { Currency, ShortDate } from '../utils';

import { FaBookReader } from "react-icons/fa";

export const TransactionList = ({ transactions, title }) => {
  /* ---------- helpers ---------- */
  const getCategoryIcon = (category = '') => {
    switch (category.toLowerCase()) {
      case 'food & drink':
        return <Coffee className="w-5 h-5" />;
      case 'transportation':
        return <Car className="w-5 h-5" />;
      case 'education':
        return <FaBookReader className="w-5 h-5" />;
      case 'shopping':
        return <ShoppingCart className="w-5 h-5" />;
      case 'bills & utilities':
        return <Home className="w-5 h-5" />;
      case 'entertainment':
        return <TrendingUp className="w-5 h-5" />;
      default:
        return <CreditCard className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category = '') => {
    switch (category.toLowerCase()) {
      case 'food':
        return 'bg-orange-100 text-orange-600';
      case 'transport':
        return 'bg-blue-100 text-blue-600';
      case 'shopping':
        return 'bg-purple-100 text-purple-600';
      case 'utilities':
        return 'bg-green-100 text-green-600';
      case 'entertainment':
        return 'bg-pink-100 text-pink-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  /* ---------- render ---------- */
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 w-full h-full flex flex-col">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>

      {transactions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <CreditCard className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No transactions yet</p>
          <p className="text-sm">Import your transactions to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {/* left side */}
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${getCategoryColor(t.category_name)}`}>
                  {getCategoryIcon(t.category_name)}
                </div>

                <div>
                  <p className="font-medium text-gray-900">{t.description}</p>

                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span>{t.category_name}</span>
                    <span>•</span>
                    <span>{new Date(t.date).toLocaleDateString()}</span>

                    {t.is_ai_categorized && (
                      <>
                        <span>•</span>
                        <span className="px-2 py-1 bg-emerald-100 text-emerald-600 rounded text-xs">
                          AI Classified
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* right side */}
              <div className="text-right">
                <p className="font-semibold text-gray-900">
                  ${Math.abs(t.amount)}
                </p>
                <p className="text-sm text-gray-500">
                  {t.transaction_type === 'expense' ? 'Expense' : 'Income'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


