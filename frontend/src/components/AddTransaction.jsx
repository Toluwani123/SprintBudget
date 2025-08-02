import React, { useState, useEffect } from 'react'
import { X, DollarSign, Calendar, Tag, FileText, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import api from '../api'

function AddTransaction({ isOpen, onClose, onSubmit }) {
    const [formData, setFormData] = useState({
        description: '',
        amount: '',
        category: '',
        transaction_type: 'expense',
        date: new Date().toISOString().split('T')[0],
        merchant_name: '',
        is_recurring: false,
        is_essential: false
    })
    
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({})

    useEffect(() => {
        if (isOpen) {
            fetchCategories()
            // Reset form when modal opens
            setFormData({
                description: '',
                amount: '',
                category: '',
                transaction_type: 'expense',
                date: new Date().toISOString().split('T')[0],
                merchant_name: '',
                is_recurring: false,
                is_essential: false
            })
            setErrors({})
        }
    }, [isOpen])

    const fetchCategories = async () => {
        try {
            const response = await api.get('/transactions/categories/')
            setCategories(response.data)
        } catch (error) {
            console.error('Error fetching categories:', error)
        }
    }

    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }))
        }
    }

    const validateForm = () => {
        const newErrors = {}
        
        if (!formData.description.trim()) {
            newErrors.description = 'Description is required'
        }
        
        if (!formData.amount || parseFloat(formData.amount) <= 0) {
            newErrors.amount = 'Please enter a valid amount'
        }
        
        if (!formData.category) {
            newErrors.category = 'Please select a category'
        }
        
        if (!formData.date) {
            newErrors.date = 'Date is required'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (!validateForm()) return

        setLoading(true)
        
        try {
            const transactionData = {
                ...formData,
                amount: parseFloat(formData.amount)
            }
            
            await onSubmit(transactionData)
            onClose()
        } catch (error) {
            console.error('Error creating transaction:', error)
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />
            
            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Add Transaction</h2>
                            <p className="text-sm text-gray-500">Track your spending</p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="rounded-full w-8 h-8 p-0 hover:bg-gray-100"
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Transaction Type */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Transaction Type</Label>
                        <Select 
                            value={formData.transaction_type} 
                            onValueChange={(value) => handleChange('transaction_type', value)}
                        >
                            <SelectTrigger className="h-11">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="expense">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                        Expense
                                    </div>
                                </SelectItem>
                                <SelectItem value="income">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        Income
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Amount */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <DollarSign className="w-4 h-4" />
                            Amount *
                        </Label>
                        <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={formData.amount}
                            onChange={(e) => handleChange('amount', e.target.value)}
                            className={`h-11 text-lg ${errors.amount ? 'border-red-300 focus:border-red-500' : ''}`}
                        />
                        {errors.amount && <p className="text-sm text-red-600">{errors.amount}</p>}
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Description *
                        </Label>
                        <Textarea
                            placeholder="What was this transaction for?"
                            value={formData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            className={`min-h-[80px] resize-none ${errors.description ? 'border-red-300 focus:border-red-500' : ''}`}
                        />
                        {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <Tag className="w-4 h-4" />
                            Category *
                        </Label>
                        <Select 
                            value={formData.category} 
                            onValueChange={(value) => handleChange('category', value)}
                        >
                            <SelectTrigger className={`h-11 ${errors.category ? 'border-red-300 focus:border-red-500' : ''}`}>
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((category) => (
                                    <SelectItem key={category.id} value={category.id.toString()}>
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.category && <p className="text-sm text-red-600">{errors.category}</p>}
                    </div>

                    {/* Merchant Name */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <Building2 className="w-4 h-4" />
                            Merchant Name
                        </Label>
                        <Input
                            placeholder="Where did you spend?"
                            value={formData.merchant_name}
                            onChange={(e) => handleChange('merchant_name', e.target.value)}
                            className="h-11"
                        />
                    </div>

                    {/* Date */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Date *
                        </Label>
                        <Input
                            type="date"
                            value={formData.date}
                            onChange={(e) => handleChange('date', e.target.value)}
                            className={`h-11 ${errors.date ? 'border-red-300 focus:border-red-500' : ''}`}
                        />
                        {errors.date && <p className="text-sm text-red-600">{errors.date}</p>}
                    </div>

                    {/* Checkboxes */}
                    <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                            <input
                                type="checkbox"
                                id="recurring"
                                checked={formData.is_recurring}
                                onChange={(e) => handleChange('is_recurring', e.target.checked)}
                                className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                            />
                            <Label htmlFor="recurring" className="text-sm text-gray-700">
                                This is a recurring transaction
                            </Label>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                            <input
                                type="checkbox"
                                id="essential"
                                checked={formData.is_essential}
                                onChange={(e) => handleChange('is_essential', e.target.checked)}
                                className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                            />
                            <Label htmlFor="essential" className="text-sm text-gray-700">
                                This is an essential expense
                            </Label>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t border-gray-100">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="flex-1 h-11"
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1 h-11 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
                            disabled={loading}
                        >
                            {loading ? 'Adding...' : 'Add Transaction'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddTransaction