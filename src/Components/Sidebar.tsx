import { AdminMenuItems } from '../Constant';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logouticon from '../assets/logout.png'

const Sidebar = () => {
    const { logout } = useAuth();
    return (
        <div>
            <div className="w-60 h-full bg-white shadow-md hidden md:flex pb-8">
                <div className="mt-5  flex flex-col justify-between w-full h-full pr-8">
                    <div className='space-y-4' >
                        {AdminMenuItems.map((data, index) => (
                            <Link to={data.Path}
                                key={index}
                                onClick={() => (data.Path)}
                                className={`focus:bg-gradient-to-br from-blue-600 to-indigo-600 focus:rounded-r-2xl  focus:text-white w-full cursor-pointer md:p-3 flex items-center gap-3 `}>
                                <data.icon className="w-5 h-5 ml-3 " />
                                <p className="hidden md:block font-medium ">{data.label} </p>
                            </Link>
                        ))}
                    </div>
                    <button
                        onClick={() => logout()}
                        className="text-gray-600 hover:text-red-500 transition-colors duration-200 pb-8 flex items-center gap-3 font-medium md:p-3 cursor-pointer"
                    >
                        <img src={logouticon} alt="" className="w-5 h-5 ml-3 bg-white " />
                        <span className='hidden md:block'> Logout</span>

                    </button>
                </div>
            </div>
            <div className='bg-white  py-3 fixed bottom-0 w-full md:hidden'>
                <ul className='text-white flex justify-around items-center'>
                    {AdminMenuItems.map((data, index) => (
                        <li key={index}
                        >
                            <Link to={data.Path}
                                className={`w-full cursor-pointer md:p-3 flex items-center gap-3`} >
                                 <data.icon className="w-4 h-4  text-black" />
                            </Link>
                        </li>
                    ))}
                    <button
                        onClick={() => logout()}
                        className="text-gray-600 gap-3 font-medium cursor-pointer"
                    >
                        <img src={logouticon} alt="" className="w-4 h-4 " />
                    </button>
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;


