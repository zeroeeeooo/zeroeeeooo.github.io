import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-2 flex justify-around items-center">
      <NavLink 
        to="/" 
        className={({ isActive }) => 
          `flex flex-col items-center p-2 ${isActive ? 'text-[#FFD1DC] relative' : 'text-gray-500'}`
        }
      >
        {({ isActive }) => (
          <>
            <i className="fa-solid fa-home text-xl"></i>
            <span className="text-xs mt-1">主页</span>
            {isActive && <div className="absolute -top-1 w-10 h-1 bg-[#FFD1DC] rounded-full"></div>}
          </>
        )}
      </NavLink>
      
      <NavLink 
        to="/diary" 
        className={({ isActive }) => 
          `flex flex-col items-center p-2 ${isActive ? 'text-[#FFD1DC] relative' : 'text-gray-500'}`
        }
      >
        {({ isActive }) => (
          <>
            <i className="fa-solid fa-book text-xl"></i>
            <span className="text-xs mt-1">日记</span>
            {isActive && <div className="absolute -top-1 w-10 h-1 bg-[#FFD1DC] rounded-full"></div>}
          </>
        )}
      </NavLink>
      
      <NavLink 
        to="/album" 
        className={({ isActive }) => 
          `flex flex-col items-center p-2 ${isActive ? 'text-[#FFD1DC] relative' : 'text-gray-500'}`
        }
      >
        {({ isActive }) => (
          <>
            <i className="fa-solid fa-images text-xl"></i>
            <span className="text-xs mt-1">相册</span>
            {isActive && <div className="absolute -top-1 w-10 h-1 bg-[#FFD1DC] rounded-full"></div>}
          </>
        )}
      </NavLink>
    </nav>
  );
}