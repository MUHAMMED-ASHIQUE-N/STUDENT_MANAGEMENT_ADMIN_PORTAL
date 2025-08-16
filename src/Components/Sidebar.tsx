
import React, { useState } from 'react';
import { AdminMenuItems } from '../Constant';
import { Link } from 'react-router-dom';

const Sidebar = () => {

    // const [openMenu, setOpenMenu] = useState(null);

    // const toggleMenu = (index) => {
    //     setOpenMenu(openMenu === index ? null : index);
    // }

    return (
        <div className="w-16 md:w-60  bg-white shadow-md flex flex-col">
            <div className="mt-5 w-full flex flex-col gap-5 text-black">
                {AdminMenuItems.map((data, index) => (
                    
                        <Link to={data.Path}
                            key={index}
                            onClick={() => (data.Path)}
                            className={`w-full cursor-pointer p-3 flex items-center gap-3`}>
                            <img src={data.icon} alt="" className="w-6 h-6 ml-3" />
                            <p className="hidden md:block">{data.label}

                            </p>
                        </Link>
                     
                    
                ))}
            </div>
        </div>
    );
};

export default Sidebar;
