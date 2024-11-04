'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateUser } from '@/action/userRegistration';
import SelectFormField from '@/components/selectFromField';
import { RefreshCcw } from 'lucide-react';
import { Copy } from 'lucide-react';
// Define the roles and statuses as constants
const ROLES = ['admin', 'tutor', 'parent'] as const;
const STATUSES = ['active', 'disabled', 'pendingApproval'] as const;

// Define a constant for Malaysian states
const MStates = [
    { label: 'Kuala Lumpur', value: 'kl' },
    { label: 'Selangor', value: 'sg' },
    { label: 'Pulau Pinang', value: 'pp' },
    { label: 'Johor', value: 'joh' },
    { label: 'Perak', value: 'prk' },
    { label: 'Melaka', value: 'mlk' },
    { label: 'Negeri Sembilan', value: 'ns' },
    { label: 'Terengganu', value: 'trg' },
    { label: 'Kelantan', value: 'kltn' },
    { label: 'Kedah', value: 'kd' },
    { label: 'Perlis', value: 'pls' },
    { label: 'Pahang', value: 'pah' },
    { label: 'Sabah', value: 'sb' },
    { label: 'Sarawak', value: 'srw' }
] as const;

const userSchema = z.object({
    id: z.string().optional(),
    email: z.string().email("Invalid email address"),
    name: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.literal("Malaysia"), // Fixed country name
    role: z.enum(ROLES).optional(),
    status: z.enum(STATUSES).optional(),
    phone: z.string().optional(),
    password: z.string().optional()
});

type UserFormData = z.infer<typeof userSchema>;

interface UserUpdateFormProps {
    initialData: Partial<{
        id: string;
        email: string;
        name?: string ;
        address?: string ;
        city?: string ;
        state?: string ;
        country?: string;
        role?: 'admin' | 'parent' | 'tutor';
        status: 'active' | 'disabled' | 'pendingApproval'; // Keep status as it was
        phone?: string ;
        password?: string;
    }> ;
}

export default function UserUpdateForm({ initialData }: UserUpdateFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const form = useForm<UserFormData>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            id: initialData?.id || '',
            email: initialData?.email || '',
            name: initialData?.name || '',
            address: initialData?.address || '',
            city: initialData?.city || '',
            state: initialData?.state || '',
            country: 'Malaysia', // Default to Malaysia
            role: initialData?.role || 'tutor', // Default role
            status: initialData?.status || 'active', // Default status
            phone: initialData?.phone || '',
            password: '',
        },
    })
    

    const handleSubmit = async (data: UserFormData) => {
        try {
            setIsLoading(true)

            //@ts-ignore
            const res = await updateUser(initialData?.id,data)
           
            toast({
                title: "Success",
                description: "User details have been successfully updated.",
            })
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update user details. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const generatePassword = () => {
        const randomPassword = Math.random().toString(36).slice(-12) +
            Math.random().toString(36).slice(-12)
        form.setValue('password', randomPassword)
    }

    const copyPassword = () => {
        const password = form.getValues('password')
        if (password) {
            navigator.clipboard.writeText(password)
            toast({
                title: "Password Copied",
                description: "The password has been copied to your clipboard.",
            })
        }
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Update User Details</CardTitle>
                <CardDescription>
                    Update user information and permissions. All fields except email are optional.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="email"
                                disabled={true}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input {...field} type="email" placeholder="user@example.com" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="Full name" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Address</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="Street address" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="city"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>City</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="City" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <SelectFormField
                                control={form.control}
                                loading={isLoading}
                                label="State"
                                placeholder="Select a state"
                                name="state"
                                form={form}
                                //@ts-ignore
                                options={MStates}
                            />
                            <FormField
                                control={form.control}
                                name="country"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Country</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a country" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Malaysia">Malaysia</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="role"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Role</FormLabel>
                                        <FormControl>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a role" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {ROLES.map((role) => (
                                                        <SelectItem key={role} value={role}>{role}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Status</FormLabel>
                                        <FormControl>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {STATUSES.map((status) => (
                                                        <SelectItem key={status} value={status}>{status}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone</FormLabel>
                                        <div className="flex items-center w-full"> {/* Flex container for layout */}
                                            <span className="mr-2 text-gray-500">+60</span> {/* Country code display */}
                                            <FormControl className="flex-grow">
                                                <Input
                                                    {...field}
                                                    type="tel"
                                                    placeholder="123 456 7890" // Placeholder without country code
                                                    className="w-full" // Make the input fill width
                                                />
                                            </FormControl>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <div className="space-y-2">
                                            <div className="relative">
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        type={showPassword ? 'text' : 'password'}
                                                        placeholder="Password"
                                                        className="pr-20" // Increased padding for the eye icon
                                                    />
                                                </FormControl>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={togglePasswordVisibility}
                                                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                                >
                                                    {showPassword ?
                                                        <EyeOff className="h-4 w-4 text-gray-500" /> :
                                                        <Eye className="h-4 w-4 text-gray-500" />
                                                    }
                                                </Button>
                                            </div>
                                            <div className="flex space-x-2">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={generatePassword}
                                                    className="flex-1"
                                                >
                                                    <RefreshCcw className="h-4 w-4 mr-2" />
                                                    Generate
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={copyPassword}
                                                    className="flex-1"
                                                >
                                                    <Copy className="h-4 w-4 mr-2" />
                                                    Copy
                                                </Button>
                                            </div>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />



                        </div>



                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Update User'}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}