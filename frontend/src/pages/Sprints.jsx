import React, {useState, useEffect} from 'react'

import DashboardNav from '../components/DashboardNav'
import {api} from '../api'
import { Button } from '@/components/ui/button'
import {Card, CardHeader, CardTitle, CardContent} from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {Currency, ShortDate} from '../utils'
import { FaPlus } from "react-icons/fa6";
import { LuCalendar } from "react-icons/lu";
import { FaArrowRightLong } from "react-icons/fa6";


function Sprints() {

    const [sprints, setSprints] = useState([]);
    const [currentSprint, setCurrentSprint] = useState(null);
    const [sprintAlerts, setSprintAlerts] = useState([]);

    const fetchSprints = async () => {
        try {
            const response = await api.get('/sprints/');
            setSprints(response.data);
            console.log('Sprints:', response.data);
        } catch (error) {
            console.error('Error fetching sprints:', error);
        }
    };
    const fetchCurrentSprint = async () => {
        try {
            const response = await api.get('/sprints/current/');
            setCurrentSprint(response.data);
            console.log('Current Sprint:', response.data);
        } catch (error) {
            console.error('Error fetching current sprint:', error);
        }
    };

    const fetchSprintAlerts = async () => {
        try {
            const response = await api.get('/sprints/alerts/');
            setSprintAlerts(response.data);
            console.log('Sprint Alerts:', response.data);
        } catch (error) {
            console.error('Error fetching sprint alerts:', error);
        }
    };

    useEffect(() => {
        fetchSprints();
        fetchCurrentSprint();
        fetchSprintAlerts();
    }, []);

    const DateRange = ({ start, end }) => (
        <>
            <ShortDate date={start} /> – <ShortDate date={end} />
        </>
    );

    const getStatusBadge = (isActive, id) => {
        if (isActive === false) return getSprintStatus('completed');

        // isActive === true
        if (sprintAlerts.length) {
            const alert = sprintAlerts.find(a => a.sprint_id === id);
            if (alert) return getSprintStatus(alert.status);
        }
        // no alerts → active
        return getSprintStatus('active');
    };


    const getSprintStatus = (status) => {
        switch (status) {
            case 'active':
                return <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300">
                            Active
                        </span>;
            case 'completed':
                return <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                            Completed
                        </span>;
            case '75_percent':
                return <span className="text-yellow-500">75% Spent</span>;
            case '90_percent':
                return <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900 dark:text-amber-300">
                            Near Budget
                        </span>;
            case '100_percent':
                return <span className="text-blue-500">100% Spent</span>;
            case 'over_budget':
                return <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-300">
                            Over Budget
                        </span>;
            default:
                return <span className="text-yellow-500">Unknown</span>;
        }
    };

  return (
    <div className='container py-8 mx-auto px-4'>
        <DashboardNav />
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Weekly Sprints</h1>
                <p className="text-muted-foreground">Manage your weekly budget sprints</p>
            </div>
            <div className="flex items-center gap-2">
                <Button size="sm" className="h-9">
                    <FaPlus className="mr-2 h-4 w-4" />
                    New Sprint
                </Button>
            </div>

        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Sprint</CardTitle>
                <LuCalendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{currentSprint ? <DateRange start={currentSprint.start_date} end={currentSprint.end_date} /> : 'Loading...'}</div>
                <p className="text-xs text-muted-foreground">{currentSprint ? `${currentSprint.days_remaining} days remaining` : 'Loading...'}</p>
            </CardContent>
            </Card>
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Budget</CardTitle>
                <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
                >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">${currentSprint ? currentSprint.budget_amount : 'Loading...'}</div>
                <p className="text-xs text-muted-foreground">Same as previous sprint</p>
            </CardContent>
            </Card>
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Spent</CardTitle>
                <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
                >
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <path d="M2 10h20" />
                </svg>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">${currentSprint ? currentSprint.total_spent : 'Loading...'}</div>
                <p className="text-xs text-muted-foreground">{currentSprint ? currentSprint.sprint_percentage : 'Loading...'}% of budget used</p>
            </CardContent>
            </Card>
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Remaining</CardTitle>
                <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
                >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">${currentSprint ? currentSprint.remaining_budget : 'Loading...'}</div>
                <p className="text-xs text-muted-foreground">${currentSprint ? (currentSprint.remaining_budget / currentSprint.days_remaining).toFixed(2) : 'Loading...'} per day left</p>
            </CardContent>
            </Card>
        </div>
        <div className="mt-6 rounded-md border">
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Date Range</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Spent</TableHead>
                <TableHead>Remaining</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {sprints.map((sprint) => (
                    <TableRow key={sprint.id}>
                        <TableCell className="font-medium"><DateRange start={new Date(sprint.start_date)} end={new Date(sprint.end_date)} /></TableCell>
                        <TableCell><Currency amount={sprint.budget_amount} /></TableCell>
                        <TableCell><Currency amount={sprint.total_spent} /></TableCell>
                        <TableCell><Currency amount={sprint.remaining_budget} /></TableCell>
                        <TableCell>{getStatusBadge(sprint.is_active, sprint.id)}</TableCell>
                        <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                            <a href={`/dashboard/sprints/${sprint.id}`}>
                            View
                            <FaArrowRightLong className="ml-1 h-4 w-4" />
                            </a>
                        </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
            </Table>
        </div>


    </div>
  )
}

export default Sprints