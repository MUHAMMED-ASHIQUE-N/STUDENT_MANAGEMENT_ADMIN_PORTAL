import homeIcon from './assets/user.jpg'

const AdminPath = {
    Dashboard: 'dashboard',
    Students: 'students',
    Courses: 'courses',
    Certificate: 'certificate',
    Payment: 'payment',
};



export const AdminMenuItems = [
    { Path:AdminPath.Dashboard, icon: homeIcon, label: 'Dashboard'},
    { Path:AdminPath.Students, icon: homeIcon, label: 'Student'},
    { Path:AdminPath.Courses, icon: homeIcon, label: 'Courses'},
    { Path:AdminPath.Certificate, icon: homeIcon, label: 'Certificate'},
    { Path:AdminPath.Payment, icon: homeIcon, label: 'Payment'},

];