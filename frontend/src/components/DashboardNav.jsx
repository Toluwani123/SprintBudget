import React, {useState, useEffect} from 'react'
import { FcBarChart } from "react-icons/fc";
import { IoMdCodeDownload } from "react-icons/io";
import { MdOutlineSettingsInputComponent } from "react-icons/md";
import { FaFileSignature } from "react-icons/fa";
import { FaUserCog } from "react-icons/fa";
import { CiLogout } from "react-icons/ci";
import { AiOutlineTransaction } from "react-icons/ai";
import { GiSprint } from "react-icons/gi";

function DashboardNav({ userData }) {

    const navItems = [
        { name: 'Dashboard', icon: <FcBarChart />, link: '/dashboard' },

        { name: 'Transactions', icon: <AiOutlineTransaction />, link: '/transactions' },
        { name: 'Sprints', icon: <GiSprint />, link: '/sprints' },
        { name: 'Settings', icon: <MdOutlineSettingsInputComponent />, link: '/settings' },
    ];
  return (
    <nav className='bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50'>
        <div className='container mx-auto px-4'>
            <div className='flex items-center justify-between h-16'>
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-lg flex items-center justify-center">
                        <FcBarChart className="w-5 h-5 text-white" />
                    </div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                        SprintBudget Pro
                    </h1>
                </div>

                <div className='flex items-center space-x-6'>
                    <div className='flex items-center space-x-4'>
                        {navItems.map((item) => (
                            <button
                                key={item.name}
                                onClick={() => window.location.href = item.link}
                                className="flex items-center text-gray-700 hover:text-emerald-600 transition-colors"
                            >
                                <span className="mr-2">{item.icon}</span>
                                <span className="hidden md:inline">{item.name}</span>
                            </button>
                        ))}

                    </div>
                    <div className="flex items-center space-x-3 border-l border-gray-200 pl-6">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-full flex items-center justify-center">
                                <FaUserCog className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-sm font-medium text-gray-700">{userData?.first_name}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-full flex items-center justify-center">
                                <CiLogout className="w-4 h-4 text-white" />
                            </div>
                        </div>

                    </div>

                </div>
                


            </div>

        </div>


    </nav>
  )
}

export default DashboardNav