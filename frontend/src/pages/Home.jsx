import React, {useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import { FaRegCalendarDays } from "react-icons/fa6";
import { MdOutlineImportExport } from "react-icons/md";
import { LuSeparatorVertical } from "react-icons/lu";
import { GiProgression } from "react-icons/gi";
import { MdOutlineCrisisAlert } from "react-icons/md";
import { FaFileMedicalAlt } from "react-icons/fa";


function Home() {
  return (
    <div className='flex flex-col min-h-screen'>
      <header className='border-b'>
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-emerald-500"
            >
              <path d="M12 6v12" />
              <path d="M6 12h12" />
              <circle cx="12" cy="12" r="10" />
            </svg>
            <span className="text-xl font-bold">SprintBudget Pro</span>
          </div>
          <nav className="flex items-center gap-4">
            <a href="/login" className="text-sm font-medium hover:underline">
              Login
            </a>
            
            <button className="rounded bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600">
              <a href="/register">Get Started</a>
            </button>
            
          </nav>
        </div>


      </header>
      <main>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:gap-16">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                    Weekly Budgeting, <span className="text-emerald-500">Simplified</span>
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                    SprintBudget Pro helps you take control of your finances with privacy-first weekly micro-budgeting.
                    Import transactions, get AI insights, and stay on track.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/signup">
                    <button className="px-8 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600 transition-colors">
                      Start for free
                    </button>
                  </Link>
                  <Link href="/demo">
                    <button className="px-8 py-2 bg-transparent border border-gray-300 rounded hover:bg-gray-100 transition-colors">
                      View demo
                    </button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-full max-w-[500px] aspect-square">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-lg transform rotate-3 opacity-20"></div>
                  <div className="absolute inset-0 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800">
                    <div className="p-6 h-full flex flex-col">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="font-semibold text-lg">Weekly Sprint</h3>
                        <div className="text-sm text-gray-500">May 13 - May 19</div>
                      </div>
                      <div className="flex-1 flex flex-col justify-center items-center gap-4">
                        <div className="w-48 h-48 relative">
                          <svg className="w-full h-full" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="10" />
                            <circle
                              cx="50"
                              cy="50"
                              r="45"
                              fill="none"
                              stroke="#10b981"
                              strokeWidth="10"
                              strokeDasharray="282.7"
                              strokeDashoffset="70.7"
                              transform="rotate(-90 50 50)"
                            />
                            <text
                              x="50"
                              y="50"
                              textAnchor="middle"
                              dominantBaseline="middle"
                              fontSize="16"
                              fontWeight="bold"
                              fill="currentColor"
                            >
                              75%
                            </text>
                          </svg>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold">$750 / $1,000</div>
                          <div className="text-sm text-gray-500">$250 remaining</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800">Key Features</div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Everything you need to manage your weekly budget
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  SprintBudget Pro combines powerful features with a simple interface to make weekly budgeting effortless.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <FaRegCalendarDays className="h-12 w-12 text-emerald-500" />
                <h3 className="text-xl font-bold">Weekly Sprints</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Break your budget into manageable weekly sprints for better control and flexibility.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <MdOutlineImportExport className="h-12 w-12 text-emerald-500" />
                <h3 className="text-xl font-bold">Easy Import</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Connect with Plaid or upload CSV files to automatically import your transactions.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <LuSeparatorVertical className="h-12 w-12 text-emerald-500" />

                <h3 className="text-xl font-bold">AI Classification</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Smart AI automatically categorizes your transactions for better insights.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <GiProgression className="h-12 w-12 text-emerald-500" />
                <h3 className="text-xl font-bold">Real-time Gauge</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  See your spending progress at a glance with our intuitive visual gauge.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <MdOutlineCrisisAlert className="h-12 w-12 text-emerald-500" />
                <h3 className="text-xl font-bold">Smart Alerts</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Get email and Slack notifications when you're approaching your budget limits.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <FaFileMedicalAlt className="h-12 w-12 text-emerald-500" />
                <h3 className="text-xl font-bold">Weekly Reports</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Receive detailed PDF and CSV reports every Friday to review your progress.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-emerald-500"
            >
              <path d="M12 6v12" />
              <path d="M6 12h12" />
              <circle cx="12" cy="12" r="10" />
            </svg>
            <span className="text-lg font-bold">SprintBudget Pro</span>
          </div>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            © 2025 SprintBudget Pro. All rights reserved.
          </p>
          <nav className="flex gap-4 text-sm">
            <Link href="#" className="text-gray-500 hover:underline dark:text-gray-400">
              Privacy
            </Link>
            <Link href="#" className="text-gray-500 hover:underline dark:text-gray-400">
              Terms
            </Link>
            <Link href="#" className="text-gray-500 hover:underline dark:text-gray-400">
              Contact
            </Link>
          </nav>
        </div>
      </footer>
      
    </div>
  )
}

export default Home