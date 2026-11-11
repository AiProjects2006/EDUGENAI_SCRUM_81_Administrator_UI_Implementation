import {
    LayoutDashboard,
    Users,
    BookOpen,
    ClipboardList,
    ShieldAlert,
    BarChart3,
    Bell,
    Settings,
    Sparkles,
    UserPlus,
    BookOpenCheck,
    Wand2,
} from "lucide-react";

export const navItems = [
    { label: "Admin Dashboard", icon: LayoutDashboard, active: true },
    { label: "User Management", icon: Users },
    { label: "Courses Administration", icon: BookOpen },
    { label: "Content Moderation", icon: ClipboardList },
    { label: "Platform Analytics", icon: BarChart3 },
    { label: "Notification Management", icon: Bell },
    { label: "System Settings", icon: Settings },
];

export const stats = [
    { label: "Total Users", value: "12.4k", icon: Users },
    { label: "Active Students", value: "10.2k", icon: Sparkles },
    { label: "Total Courses", value: "450", icon: BookOpen },
    { label: "AI Activities", value: "45.2k", icon: Sparkles },
];

export const chartData = [
    { t: "1", v: 30 },
    { t: "2", v: 45 },
    { t: "3", v: 38 },
    { t: "4", v: 55 },
    { t: "5", v: 62 },
    { t: "6", v: 70 },
    { t: "7", v: 58 },
    { t: "8", v: 48 },
    { t: "9", v: 52 },
    { t: "10", v: 40 },
    { t: "11", v: 44 },
    { t: "12", v: 35 },
];

export const activity = [
    {
        icon: UserPlus,
        color: "#a855f7",
        title: "User Created: Liam J.",
        time: "2 mins ago · System",
    },
    {
        icon: BookOpenCheck,
        color: "#ec4899",
        title: "Course Published: Bio 101",
        time: "15 mins ago · Sarah Miller",
    },
    {
        icon: Wand2,
        color: "#a855f7",
        title: "AI Gen: Physics Quiz",
        time: "44 mins ago · Auto-Worker",
    },
    {
        icon: ShieldAlert,
        color: "#ef4444",
        title: "Security Alert: Failed Login",
        time: "1 hour ago · IP 192.168.51",
    },
];

export const users = [
    {
        id: "#12044",
        name: "Liam Johnson",
        initials: "LJ",
        role: "Student",
        email: "liam.j@edu.ai",
        status: "Active",
        color: "#a855f7",
    },
    {
        id: "#12045",
        name: "Sarah Miller",
        initials: "SM",
        role: "Teacher",
        email: "s.miller@edu.ai",
        status: "Active",
        color: "#ec4899",
    },
    {
        id: "#12046",
        name: "David Ross",
        initials: "DR",
        role: "Parent",
        email: "d.ross@home.com",
        status: "Suspended",
        color: "#f59e0b",
    },
];
