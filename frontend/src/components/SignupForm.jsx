import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import * as z from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Eye, EyeOff } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/Select";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/Form';

const formSchema = z.object({
    fullName: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
    username: z.string().min(3, { message: 'Username must be at least 3 characters.' }),
    email: z.string().email({ message: 'Invalid email address.' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
    role: z.enum(['buyer', 'agent'], { required_error: "Please select a role." }),
    avatar: z.any().refine((files) => files?.length > 0, "Avatar is required.")
});

const SignupForm = () => {
    const { signup } = useAuth();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullName: '',
            username: '',
            email: '',
            password: '',
            role: 'buyer'
        },
    });

    const onSubmit = async (data) => {
        setIsSubmitting(true);

        const formData = new FormData();
        formData.append('fullName', data.fullName);
        formData.append('username', data.username);
        formData.append('email', data.email);
        formData.append('password', data.password);
        formData.append('role', data.role);
        formData.append('avatar', data.avatar[0]);

        const success = await signup(formData);
        setIsSubmitting(false);

        if (success) {
            navigate(data.role === 'agent' ? '/dashboard' : '/');
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 relative">
                <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                        <FormItem className="space-y-2">
                            <FormLabel className="text-slate-900 font-semibold ml-1 text-sm">Full Name</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="e.g. John Doe"
                                    className="h-14 rounded-xl border-2 border-slate-200 bg-white/50 backdrop-blur-sm focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-blue-500 focus-visible:ring-offset-0 transition-all font-medium text-base px-5 shadow-sm hover:border-slate-300 hover:shadow-md"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage className="ml-1 font-medium text-xs" />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem className="space-y-2">
                            <FormLabel className="text-slate-900 font-semibold ml-1 text-sm">Username</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="e.g. johndoe"
                                    className="h-14 rounded-xl border-2 border-slate-200 bg-white/50 backdrop-blur-sm focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-blue-500 focus-visible:ring-offset-0 transition-all font-medium text-base px-5 shadow-sm hover:border-slate-300 hover:shadow-md"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage className="ml-1 font-medium text-xs" />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem className="space-y-2">
                            <FormLabel className="text-slate-900 font-semibold ml-1 text-sm">Email Address</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter your email"
                                    className="h-14 rounded-xl border-2 border-slate-200 bg-white/50 backdrop-blur-sm focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-blue-500 focus-visible:ring-offset-0 transition-all font-medium text-base px-5 shadow-sm hover:border-slate-300 hover:shadow-md"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage className="ml-1 font-medium text-xs" />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem className="space-y-2">
                            <FormLabel className="text-slate-900 font-semibold ml-1 text-sm">Password</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Create a strong password"
                                        className="h-14 rounded-xl border-2 border-slate-200 bg-white/50 backdrop-blur-sm focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-blue-500 focus-visible:ring-offset-0 transition-all font-medium text-base px-5 shadow-sm hover:border-slate-300 hover:shadow-md pr-12"
                                        {...field}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </FormControl>
                            <FormMessage className="ml-1 font-medium text-xs" />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="avatar"
                    render={({ field: { onChange, value, ...field } }) => (
                        <FormItem className="space-y-2">
                            <FormLabel className="text-slate-900 font-semibold ml-1 text-sm">Profile Picture</FormLabel>
                            <FormControl>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    className="h-14 rounded-xl border-2 border-slate-200 bg-white/50 backdrop-blur-sm focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-blue-500 focus-visible:ring-offset-0 transition-all font-medium text-base px-5 shadow-sm hover:border-slate-300 hover:shadow-md file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-gradient-to-r file:from-slate-900 file:to-slate-700 file:text-white hover:file:from-slate-800 hover:file:to-slate-600 file:cursor-pointer file:transition-all"
                                    onChange={(e) => onChange(e.target.files)}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage className="ml-1 font-medium text-xs" />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                        <FormItem className="space-y-2">
                            <FormLabel className="text-slate-900 font-semibold ml-1 text-sm">I am a</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger className="h-14 rounded-xl border-2 border-slate-200 bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 font-medium text-base px-5 hover:border-slate-300 hover:shadow-md transition-all">
                                        <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent className="rounded-xl border-2 border-slate-200 shadow-xl">
                                    <SelectItem value="buyer" className="text-base font-medium cursor-pointer">Buyer / Tenant</SelectItem>
                                    <SelectItem value="agent" className="text-base font-medium cursor-pointer">Property Owner / Agent</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage className="ml-1 font-medium text-xs" />
                        </FormItem>
                    )}
                />
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-14 rounded-xl bg-gradient-to-r from-slate-900 to-slate-700 hover:from-slate-800 hover:to-slate-600 text-white font-bold text-base transition-all shadow-xl shadow-slate-900/20 hover:shadow-2xl hover:shadow-slate-900/30 hover:scale-[1.02] mt-10 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                    {isSubmitting ? (
                        <span className="flex items-center gap-2">
                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Creating Account...
                        </span>
                    ) : 'Create Account'}
                </Button>
            </form>
        </Form>
    );
};

export default SignupForm;