import homeIcon from './assets/dashboard1.png'
import students from './assets/user.png'
import course from './assets/book.png'
import certificate from './assets/online-certificate.png'
import payment from './assets/doller.png'

const AdminPath = {
    Dashboard: 'dashboard',
    Students: 'students',
    Courses: 'courses',
    Certificate: 'certificate',
    Payment: 'payment',
};


export const AdminMenuItems = [
    { Path:AdminPath.Dashboard, icon: homeIcon, label: 'Dashboard'},
    { Path:AdminPath.Students, icon: students, label: 'Student'},
    { Path:AdminPath.Courses, icon: course, label: 'Courses'},
    { Path:AdminPath.Certificate, icon: certificate, label: 'Certificate'},
    { Path:AdminPath.Payment, icon: payment, label: 'Payment'},

];


