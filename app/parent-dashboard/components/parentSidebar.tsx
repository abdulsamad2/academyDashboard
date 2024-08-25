'use client'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Home, CreditCard, Book, Calendar, MessageSquare, User, LogOut, Bell, X, Menu } from 'lucide-react' // Import necessary icons

const ParentSidebar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen)
    }

    return (
        <>
            <aside className={cn(
                "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full",
                "md:translate-x-0 md:static"
            )}>
                <div className="flex flex-col h-full">
                    <div className="p-4 border-b">
                        <div className="flex items-center space-x-3">
                            <Avatar>
                                <AvatarImage src="/placeholder-avatar.jpg" alt="Parent" />
                                <AvatarFallback>JD</AvatarFallback>
                            </Avatar>
                            <div>
                                <h2 className="font-semibold">John Doe</h2>
                                <p className="text-sm text-gray-500">Parent</p>
                            </div>
                        </div>
                    </div>
                    <nav className="flex-1 p-4 space-y-2">
                        <Button variant="ghost" className="w-full justify-start">
                            <Home className="mr-2 h-4 w-4" />
                            Dashboard
                        </Button>
                        <Button variant="ghost" className="w-full justify-start">
                            <CreditCard className="mr-2 h-4 w-4" />
                            Billing
                        </Button>
                        <Button variant="ghost" className="w-full justify-start">
                            <Book className="mr-2 h-4 w-4" />
                            Courses
                        </Button>
                        <Button variant="ghost" className="w-full justify-start">
                            <Calendar className="mr-2 h-4 w-4" />
                            Schedule
                        </Button>
                        <Button variant="ghost" className="w-full justify-start">
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Messages
                        </Button>
                        <Button variant="ghost" className="w-full justify-start">
                            <User className="mr-2 h-4 w-4" />
                            Profile
                        </Button>
                    </nav>
                    <div className="p-4 border-t">
                        <Button variant="ghost" className="w-full justify-start text-red-500">
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                        </Button>
                    </div>
                </div>
            </aside>
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white shadow-sm z-10">
                    <div className="flex items-center justify-between p-4">
                        <div className="flex items-center space-x-4">
                            <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleSidebar}>
                                {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </Button>
                            <h1 className="text-2xl font-bold">Parent Dashboard</h1>
                        </div>
                        <Button variant="outline" size="icon">
                            <Bell className="h-4 w-4" />
                        </Button>
                    </div>
                </header>
        </div>
        </>
    )
}

export default ParentSidebar
