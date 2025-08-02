import React from 'react'
import { X, Calendar, DollarSign, TrendingUp, TrendingDown, Clock, Target, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Currency, ShortDate } from '../utils'

function SprintInfo({ isOpen, onClose, sprint }) {
    if (!isOpen || !sprint) return null

    const spentPercentage = sprint.budget_amount > 0 
        ? (sprint.total_spent / sprint.budget_amount) * 100 
        : 0

    const dailySpent = sprint.days_remaining > 0 
        ? (sprint.remaining_budget / sprint.days_remaining).toFixed(2)
        : '0.00'

    const getStatusColor = (percentage) => {
        if (percentage >= 100) return 'text-red-600'
        if (percentage >= 90) return 'text-orange-600'
        if (percentage >= 75) return 'text-yellow-600'
        return 'text-emerald-600'
    }

    const getProgressColor = (percentage) => {
        if (percentage >= 100) return 'bg-red-500'
        if (percentage >= 90) return 'bg-orange-500'
        if (percentage >= 75) return 'bg-yellow-500'
        return 'bg-emerald-500'
    }

    const getStatusBadge = () => {
        if (!sprint.is_active) {
            return <Badge variant="secondary">Completed</Badge>
        }
        if (spentPercentage >= 100) {
            return <Badge variant="destructive">Over Budget</Badge>
        }
        if (spentPercentage >= 90) {
            return <Badge variant="outline" className="border-orange-500 text-orange-600">Near Budget</Badge>
        }
        return <Badge variant="default" className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">Active</Badge>
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />
            
            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">{sprint.name}</h2>
                            <p className="text-sm text-gray-500">Sprint Details</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {getStatusBadge()}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClose}
                            className="rounded-full w-8 h-8 p-0 hover:bg-gray-100"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-8">
                    {/* Overview Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
                            <div className="flex items-center gap-3">
                                <Calendar className="w-5 h-5 text-blue-600" />
                                <div>
                                    <p className="text-sm font-medium text-blue-800">Duration</p>
                                    <p className="text-lg font-bold text-blue-900">
                                        <ShortDate date={sprint.start_date} /> - <ShortDate date={sprint.end_date} />
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
                            <div className="flex items-center gap-3">
                                <Clock className="w-5 h-5 text-purple-600" />
                                <div>
                                    <p className="text-sm font-medium text-purple-800">Days Remaining</p>
                                    <p className="text-lg font-bold text-purple-900">
                                        {sprint.days_remaining} days
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Budget Overview */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Target className="w-5 h-5 text-gray-600" />
                            <h3 className="text-lg font-semibold text-gray-900">Budget Overview</h3>
                        </div>
                        
                        <div className="bg-gray-50 rounded-xl p-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="text-center">
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <DollarSign className="w-4 h-4 text-gray-600" />
                                        <p className="text-sm font-medium text-gray-600">Budget Amount</p>
                                    </div>
                                    <p className="text-2xl font-bold text-gray-900">
                                        <Currency amount={sprint.budget_amount} />
                                    </p>
                                </div>

                                <div className="text-center">
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <TrendingUp className="w-4 h-4 text-red-600" />
                                        <p className="text-sm font-medium text-gray-600">Total Spent</p>
                                    </div>
                                    <p className={`text-2xl font-bold ${getStatusColor(spentPercentage)}`}>
                                        <Currency amount={sprint.total_spent} />
                                    </p>
                                </div>

                                <div className="text-center">
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <TrendingDown className={`w-4 h-4 ${sprint.remaining_budget >= 0 ? 'text-emerald-600' : 'text-red-600'}`} />
                                        <p className="text-sm font-medium text-gray-600">Remaining</p>
                                    </div>
                                    <p className={`text-2xl font-bold ${sprint.remaining_budget >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                        <Currency amount={sprint.remaining_budget} />
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Progress Section */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">Spending Progress</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-600">Budget Usage</span>
                                <span className={`text-sm font-bold ${getStatusColor(spentPercentage)}`}>
                                    {spentPercentage.toFixed(1)}%
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div
                                    className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(spentPercentage)}`}
                                    style={{ width: `${Math.min(spentPercentage, 100)}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Additional Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <h4 className="font-semibold text-gray-900">Financial Details</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Rollover Amount:</span>
                                    <span className="font-medium">
                                        <Currency amount={sprint.rollover_amount || 0} />
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Daily Average Available:</span>
                                    <span className="font-medium text-emerald-600">
                                        ${dailySpent}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Sprint Percentage:</span>
                                    <span className={`font-medium ${getStatusColor(sprint.sprint_percentage)}`}>
                                        {sprint.sprint_percentage?.toFixed(1)}%
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h4 className="font-semibold text-gray-900">Sprint Status</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Active:</span>
                                    <span className={`font-medium ${sprint.is_active ? 'text-emerald-600' : 'text-gray-500'}`}>
                                        {sprint.is_active ? 'Yes' : 'No'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Completed:</span>
                                    <span className={`font-medium ${sprint.is_completed ? 'text-blue-600' : 'text-gray-500'}`}>
                                        {sprint.is_completed ? 'Yes' : 'No'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Created:</span>
                                    <span className="font-medium">
                                        <ShortDate date={sprint.created_at} />
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Warning Section */}
                    {spentPercentage >= 90 && (
                        <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-4">
                            <div className="flex items-center gap-3">
                                <AlertCircle className="w-5 h-5 text-orange-600" />
                                <div>
                                    <h4 className="font-semibold text-orange-800">Budget Alert</h4>
                                    <p className="text-sm text-orange-700">
                                        {spentPercentage >= 100 
                                            ? 'You have exceeded your budget for this sprint.'
                                            : 'You are approaching your budget limit. Consider reducing spending.'
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
                    <div className="flex justify-between items-center">
                        <p className="text-xs text-gray-500">
                            Last updated: <ShortDate date={sprint.updated_at} />
                        </p>
                        <Button onClick={onClose} className="bg-emerald-600 hover:bg-emerald-700">
                            Close
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SprintInfo