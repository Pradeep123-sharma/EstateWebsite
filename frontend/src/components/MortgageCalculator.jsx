import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/Input";
import { Calculator, IndianRupee, Percent, Calendar } from "lucide-react";

export const MortgageCalculator = ({ propertyPrice }) => {
    const [loanAmount, setLoanAmount] = useState(propertyPrice * 0.8);
    const [downPayment, setDownPayment] = useState(propertyPrice * 0.2);
    const [interestRate, setInterestRate] = useState(8.5); // Updated to typical Indian interest rate
    const [loanTerm, setLoanTerm] = useState(20); // Updated to typical Indian loan term
    const [monthlyPayment, setMonthlyPayment] = useState(0);

    useEffect(() => {
        // Recalculate loan amount if down payment changes
        setLoanAmount(propertyPrice - downPayment);
    }, [downPayment, propertyPrice]);

    useEffect(() => {
        calculateMortgage();
    }, [loanAmount, interestRate, loanTerm]);

    const calculateMortgage = () => {
        const principal = loanAmount;
        const calculateInterest = interestRate / 100 / 12;
        const calculatePayments = loanTerm * 12;

        const x = Math.pow(1 + calculateInterest, calculatePayments);
        const monthly = (principal * x * calculateInterest) / (x - 1);

        if (isFinite(monthly)) {
            setMonthlyPayment(monthly.toFixed(0));
        } else {
            setMonthlyPayment(0);
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(value);
    };

    return (
        <Card className="border-slate-100 shadow-sm bg-white overflow-hidden">
            <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
                <CardTitle className="flex items-center gap-2 text-lg font-bold text-slate-800">
                    <Calculator className="w-5 h-5 text-blue-600" />
                    Mortgage Calculator
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 grid gap-6 md:grid-cols-2">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Total Price</label>
                        <div className="relative">
                            <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                type="number"
                                value={propertyPrice}
                                disabled
                                className="pl-9 bg-slate-50 border-slate-200"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Down Payment (20%)</label>
                        <div className="relative">
                            <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                type="number"
                                value={downPayment}
                                onChange={(e) => setDownPayment(Number(e.target.value))}
                                className="pl-9 border-slate-200 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Interest Rate</label>
                            <div className="relative">
                                <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    type="number"
                                    step="0.1"
                                    value={interestRate}
                                    onChange={(e) => setInterestRate(Number(e.target.value))}
                                    className="pl-9 border-slate-200 focus:border-blue-500"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Loan Term (Years)</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    type="number"
                                    value={loanTerm}
                                    onChange={(e) => setLoanTerm(Number(e.target.value))}
                                    className="pl-9 border-slate-200 focus:border-blue-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col justify-center items-center bg-blue-50 rounded-2xl p-6 border border-blue-100 text-center">
                    <p className="text-slate-500 font-medium mb-1">Estimated Monthly Payment</p>
                    <h3 className="text-4xl font-bold text-blue-700 mb-2">
                        {formatCurrency(monthlyPayment)}
                    </h3>
                    <p className="text-sm text-slate-400 max-w-[200px]">
                        *Excludes taxes and insurance. Rates are estimates only.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};
