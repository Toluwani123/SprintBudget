import React, {useState, useEffect} from 'react'
import {api} from '../api'
import { FaFileDownload } from "react-icons/fa";
import { IoMdAddCircleOutline } from "react-icons/io";
import { LuScanSearch } from "react-icons/lu";
import { FaFilter } from "react-icons/fa";
import { FcCheckmark } from "react-icons/fc";
import { ShortDate, Currency } from '../utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {Select, SelectTrigger, SelectValue, SelectContent, SelectItem} from '@/components/ui/select';
import {Table, TableHeader, TableBody, TableRow, TableCell, TableHead} from '@/components/ui/table';
import {Badge} from '@/components/ui/badge';
import DashboardNav from '@/components/DashboardNav';



function Transactions() {

    const [transactions, setTransactions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    const filteredTransactions = transactions.filter(transaction => {
        const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === '' || transaction.category_name === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const getCategoryColor = (category) => {
        switch (category) {
            case 'Food & Drink':
                return 'bg-red-500';
            case 'Transportation':
                return 'bg-blue-500';
            case 'Bills & Utilities':
                return 'bg-green-500';
            case 'Entertainment':
                return 'bg-yellow-500';
            case 'Shopping':
                return 'bg-purple-500';
            case 'Health':
                return 'bg-pink-500';
            case "Education":
                return 'bg-teal-500';
            case "Travel":
                return 'bg-indigo-500';
            case "Groceries":
                return 'bg-orange-500';
            case 'Other':
                return 'bg-gray-500';
            default:
                return 'bg-gray-500';
        }

    };

    const fetchTransactions = async () => {
        try {
            const response = await api.get('/transactions/');
            setTransactions(response.data);
            console.log('Transactions:', response.data);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await api.get('transactions/categories/');
            setCategories(response.data);
            console.log('Categories:', response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    useEffect(() => {
        fetchTransactions();
        fetchCategories();
    }, []);

    return (
        <div className='container py-8 mx-auto px-4'>
            <DashboardNav />
            <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
                <div>
                    <h1 className='text-3xl font-bold tracking-tight'>
                        Transactions

                    </h1>
                    <p className='text-muted-foreground'>
                        Here you can view and manage your transactions.
                    </p>
                </div>
                <div className='flex items-center gap-2'>
                    <Button variant="outline" size="sm" className="h-9 bg-transparent">
                        <FaFileDownload className='mr-2 h-4 w-4' />
                        Export Transactions

                    </Button>
                    <Button size="sm" className="h-9">
                        <IoMdAddCircleOutline className='mr-2 h-4 w-4' />
                        Add Transactions
                    </Button>
                </div>

            </div>

            <div className='mt-6 flex flex-col gap-4 md:flex-row'>
                <div className='relative flex-1'>
                    <LuScanSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type='text'
                        placeholder='Search transactions...'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className='pl-8'
                    />
                </div>
                <div className='flex items-center gap-2'>
                    <FaFilter className='h-4 w-4 text-muted-foreground' />
                    <Select onValueChange={setSelectedCategory} value={selectedCategory}>
                        <SelectTrigger className='w-[180px]'>
                            <SelectValue placeholder='Category' />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map((category) => (
                                <SelectItem key={category.id} value={category.name}>
                                    <div className={`flex items-center gap-2 ${getCategoryColor(category.name)} text-white px-2 py-1 rounded`}>
                                        {category.name}
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

            </div>

            <div className='mt-6 rounded-md border'>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead className='text-right'>Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredTransactions.length > 0 ? (
                            filteredTransactions.map((transaction) => (
                                <TableRow key={transaction.id}>
                                    <TableCell className='font-medium p-4'><ShortDate date={new Date(transaction.date)} /></TableCell>
                                    <TableCell className='p-4'>{transaction.description}</TableCell>
                                    <TableCell className='p-4'><Badge variant= "outline" className={getCategoryColor(transaction.category_name)}>{transaction.category_name}</Badge></TableCell>
                                    <TableCell className='text-right p-4'><Currency amount={transaction.amount} /></TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className='text-center'>No transactions found</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

        </div>
    )
}

export default Transactions