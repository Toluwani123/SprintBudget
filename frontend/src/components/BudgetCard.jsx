import React, { useState } from 'react';
import { Edit3, Save, X, Target, Calendar, TrendingUp } from 'lucide-react';

export const BudgetCard = ({ budget, daysRemaining, health }) => {
  /* ---------- local state ---------- */
  
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState({
    weeklyLimit: budget?.weeklyLimit ?? 520,
    categories:  budget?.categories  ?? {},
  });

  /* ---------- handlers ---------- */
  const handleSave = () => {
    onUpdate(editValues.weeklyLimit);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValues({
      weeklyLimit: budget?.weeklyLimit ?? 500,
      categories:  budget?.categories  ?? {},
    });
    setIsEditing(false);
  };

  /* ---------- helpers ---------- */
  

  /* ---------- render ---------- */
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Budget Settings</h3>

        {!isEditing ? (
          <button
            
            className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
          >
            <Edit3 className="w-4 h-4" />
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              
              className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
            >
              <Save className="w-4 h-4" />
            </button>
            <button
              
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* main content */}
      <div className="space-y-4">
        {/* weekly limit */}
        <div className="flex items-center space-x-3">
          <Target className="w-5 h-5 text-emerald-600" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-700">Weekly Limit</p>

            
            <p className="text-lg font-semibold text-gray-900">
              ${Number(budget?.weeklyLimit ?? 500).toFixed(2)}
            </p>
           
          </div>
        </div>

        {/* days until rollover */}
        <div className="flex items-center space-x-3">
          <Calendar className="w-5 h-5 text-blue-600" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-700">Days Until Rollover</p>
            <p className="text-lg font-semibold text-gray-900">
              {daysRemaining} days
            </p>
          </div>
        </div>

        {/* budget health (stub) */}
        <div className="flex items-center space-x-3">
          <TrendingUp className="w-5 h-5 text-orange-600" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-700">Budget Health</p>
            <p className="text-lg font-semibold text-green-600">{health >= 75 ? 'Poor' : health >= 50 ? 'Moderate' : 'Healthy'}</p>
          </div>
        </div>
      </div>

      {/* weekly sprint info */}
      <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Weekly Sprint</h4>
        <p className="text-sm text-gray-600">
          Your budget resets every Sunday at midnight. Track your spending
          throughout the week and get alerts when you're approaching your limit.
        </p>
      </div>
    </div>
  );
};

