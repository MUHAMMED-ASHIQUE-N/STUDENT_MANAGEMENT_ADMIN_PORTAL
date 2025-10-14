import { Award, Book, DollarSign, LayoutDashboardIcon, User } from 'lucide-react'

const AdminPath = {
    Dashboard: 'dashboard',
    Students: 'students',
    Courses: 'courses',
    Certificate: 'certificate',
    Payment: 'payment',
};


export const AdminMenuItems = [
    { Path:AdminPath.Dashboard, icon: LayoutDashboardIcon, label: 'Dashboard'},
    { Path:AdminPath.Students, icon: User, label: 'Student'},
    { Path:AdminPath.Courses, icon: Book, label: 'Courses'},
    { Path:AdminPath.Certificate, icon: Award, label: 'Certificate'},
    { Path:AdminPath.Payment, icon: DollarSign, label: 'Payment'},

];


