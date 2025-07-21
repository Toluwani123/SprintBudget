import React, { useState, useEffect, use } from 'react'
import DashboardNav from '../components/DashboardNav'
import api from '../api'
import { LuDollarSign } from "react-icons/lu";
import { PiTrendDownDuotone } from "react-icons/pi";
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import { BsCalendar2WeekFill } from "react-icons/bs";
import { SpendingGauge } from '../components/SpendingGuage';
import { BudgetCard } from '../components/BudgetCard';
import { TransactionList } from '../components/TransactionList';

function Dashboard() {
    const [userData, setUserData] = useState(null);
    const [dashboardData, setDashboardData] = useState(null);
    const [transactionData, setTransactionData] = useState(null);

    const lastISO = dashboardData?.last_spend_date?.date;         // "YYYY-MM-DD"
    const todayISO = new Date().toISOString().slice(0, 10);       // also "YYYY-MM-DD"

    const isToday = lastISO === todayISO;
    const label = isToday
    ? "Today's Spending"
    : new Date(lastISO).toLocaleDateString()

    useEffect(() => {
        // Fetch any necessary data for the dashboard
        const fetchData = async () => {
            try {
                const response = await api.get('/accounts/profile/update/'); // Example endpoint
                setUserData(response.data);
                console.log('User data:', response.data);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            }
        };

        fetchData();
    }, []);
    const handleBudgetUpdate = async (newWeeklyLimit) => {
        try {
            const { data } = await api.put(
            '/accounts/profile/update/',
            { weekly_budget: newWeeklyLimit }
            );
            setUserData(data);                  // make sure data actually has weekly_budget!
            alert('Budget updated successfully!');
        } catch (err) {
            console.error(err);
            alert('Failed to update budget. Please try again.');
        }
    };


    useEffect(() => {
        // Fetch transactions or other data needed for the dashboard
        const fetchDashboardData = async () => {
            try {
                const response = await api.get('/sprints/dashboard/'); // Example endpoint
                setDashboardData(response.data);
                console.log('Dashboard:', response.data);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            }
        };

        fetchDashboardData();
    }, []);

    useEffect(() => {
        // Fetch transactions or other data needed for the dashboard
        const fetchTransactionData = async () => {
            try {
                const response = await api.get('/transactions/stats/'); // Example endpoint
                setTransactionData(response.data);
                console.log('Transaction Data:', response.data);
            } catch (error) {
                console.error('Error fetching transaction data:', error);
            }
        };

        fetchTransactionData();
    }, []);

  return (
    <div>
      <DashboardNav userData={userData} />
      <div className='space-y-8'>
        <div className='text-center mt-8'>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Sprint Dashboard</h2>
            <p className="text-gray-600">Track your spending in real-time with privacy-first budgeting</p>

        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
                <div>
                <p className="text-sm font-medium text-gray-500">Weekly Spent</p>
                <p className="text-2xl font-bold text-gray-900">${dashboardData?.current_sprint?.total_spent}</p>
                </div>
                {<LuDollarSign className="w-8 h-8 text-emerald-600" />}
            </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
                <div>
                <p className="text-sm font-medium text-gray-500">Remaining</p>
                <p className={`text-2xl font-bold ${dashboardData?.current_sprint?.remaining_budget  >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    ${dashboardData?.current_sprint?.remaining_budget}
                </p>
                </div>
                {dashboardData?.current_sprint?.remaining_budget >= 0 ? (
                <FaMoneyBillTrendUp className="w-8 h-8 text-emerald-600" />
                ) : (
                <PiTrendDownDuotone className="w-8 h-8 text-red-600" />
                )}
            </div>
            </div>


            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                    <div>
                    <p className="text-sm font-medium text-gray-500">{label}</p>
                    <p className="text-2xl font-bold text-gray-900">${dashboardData?.last_spend_date?.total}</p>
                    </div>
                    <BsCalendar2WeekFill className="w-8 h-8 text-blue-600" />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                    <div>
                    <p className="text-sm font-medium text-gray-500">Daily Average</p>
                    <p className="text-2xl font-bold text-gray-900">
                        ${
                            (() => {
                            const sprint   = dashboardData?.current_sprint ?? {};
                            const remain   = Number(sprint.remaining_budget ?? 0);
                            const daysLeft = Number(sprint.days_remaining  ?? 0);

                            // If no days left (≤ 0) just show the remaining budget,
                            // otherwise show the per-day allowance.
                            return (daysLeft > 0 ? remain / daysLeft : remain).toFixed(2);
                            })()
                        }
                    </p>
                    </div>
                    <PiTrendDownDuotone className="w-8 h-8 text-orange-600" />
                </div>
            </div>
            

        </div>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
            <div className='lg:col-span-2'>
                <SpendingGauge
                    budget={dashboardData?.current_sprint?.budget_amount ?? 0}
                    spent={dashboardData?.current_sprint?.total_spent ?? 0}
                    percentage={dashboardData?.current_sprint?.sprint_percentage ?? 0}
                />

            </div>

            <div>
                <BudgetCard budget={{ weeklyLimit: userData?.weekly_budget }} onUpdate={handleBudgetUpdate} />
            </div>
            <div    >
                <TransactionList
                    transactions={transactionData?.latest_transactions ?? []}
                    title="Recent Transactions"
                />
            </div>

        </div>
        

      </div>
    </div>
  )
}

export default Dashboard