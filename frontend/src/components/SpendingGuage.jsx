import React from 'react';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

export const SpendingGauge = ({ spent, budget, percentage }) => {
  /* ---------- helpers ---------- */
  const getStatusColor = () => {
    if (percentage <= 50) return 'text-emerald-600';
    if (percentage <= 80) return 'text-orange-600';
    return 'text-red-600';
  };

  const getStatusIcon = () => {
    if (percentage <= 50) return <CheckCircle className="w-6 h-6 text-emerald-600" />;
    if (percentage <= 80) return <AlertTriangle className="w-6 h-6 text-orange-600" />;
    return <XCircle className="w-6 h-6 text-red-600" />;
  };

  const getGaugeColor = () => {
    if (percentage <= 50) return 'stroke-emerald-600';
    if (percentage <= 80) return 'stroke-orange-600';
    return 'stroke-red-600';
  };

  /* ---------- svg maths ---------- */
  const circumference = 2 * Math.PI * 120;               // 2πr   (r = 120)
  const strokeDasharray = circumference;                 // full length
  const strokeDashoffset =
    circumference - (Math.min(percentage, 100) / 100) * circumference;

  /* ---------- render ---------- */
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      {/* header */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Weekly Spending Progress
        </h3>
        <div className="flex items-center justify-center space-x-2">
          {getStatusIcon()}
          <span className={`text-sm font-medium ${getStatusColor()}`}>
            {percentage <= 50 ? 'On Track' : percentage <= 80 ? 'Caution' : 'Over Budget'}
          </span>
        </div>
      </div>

      {/* radial gauge */}
      <div className="relative flex items-center justify-center">
        <svg className="w-80 h-80 transform -rotate-90" viewBox="0 0 256 256">
          {/* background circle */}
          <circle
            cx="128"
            cy="128"
            r="120"
            fill="none"
            stroke="#f3f4f6"
            strokeWidth="16"
          />
          {/* progress circle */}
          <circle
            cx="128"
            cy="128"
            r="120"
            fill="none"
            className={`${getGaugeColor()} transition-all duration-1000 ease-out`}
            strokeWidth="16"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>

        {/* center content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className={`text-4xl font-bold mb-2 ${getStatusColor()}`}>
              {Math.round(percentage)}%
            </div>
            <div className="text-gray-600 text-sm">
              ${spent} of ${budget}
            </div>
            <div className="text-gray-500 text-xs mt-1">
              ${(budget - spent)} remaining
            </div>
          </div>
        </div>
      </div>

      {/* linear bar for small screens */}
      <div className="mt-8 md:hidden">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>{Math.round(percentage)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-1000 ease-out ${
              percentage <= 50
                ? 'bg-emerald-600'
                : percentage <= 80
                ? 'bg-orange-600'
                : 'bg-red-600'
            }`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
};

