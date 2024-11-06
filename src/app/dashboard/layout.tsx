// components/Layout.tsx
"use client";
import React, { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaBars, FaTimes, FaHome, FaSignOutAlt } from "react-icons/fa";
import { BsFilePost } from "react-icons/bs";
import { AiOutlineDown } from "react-icons/ai"; // Import down arrow icon
import { GoProjectTemplate } from "react-icons/go";
import { MdCastForEducation } from "react-icons/md";
import { GiSkills } from "react-icons/gi";

type LayoutProps = {
  children: ReactNode;
};

const UserDashboardLayout = ({ children }: LayoutProps) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const menuItems = [
    {
      name: "Blogs",
      href: "/dashboard",
      icon: <BsFilePost />,
      children: [
        { name: "All Blogs", href: "/dashboard/blogs" },
        { name: "Create Blog", href: "/dashboard/create-blog" },
      ],
    },
    {
      name: "Project",
      href: "/dashboard",
      icon: <GoProjectTemplate />,
      children: [
        { name: "All Projects", href: "/dashboard/projects" },
        { name: "Create Project", href: "/dashboard/create-project" },
      ],
    },
    {
      name: "Education",
      href: "/dashboard",
      icon: <MdCastForEducation />,
      children: [
        { name: "Educations", href: "/dashboard/educations" },
        { name: "Create Education", href: "/dashboard/create-education" },
      ],
    },
    {
      name: "Experience",
      href: "/dashboard",
      icon: <MdCastForEducation />,
      children: [
        { name: "Expererience", href: "/dashboard/experience" },
        { name: "Create Experience", href: "/dashboard/create-experience" },
      ],
    },
    {
      name: "Skills",
      href: "/dashboard",
      icon: <GiSkills />,
      children: [{ name: "Create Skills", href: "/dashboard/create-skills" }],
    },
  ];

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleMenu = (menuName: string) => {
    setOpenMenu(openMenu === menuName ? null : menuName);
  };

  return (
    <div className="flex h-screen">
      {/* Hamburger Icon for Mobile */}
      <button
        className="text-black text-2xl p-2 absolute top-1 left-0 z-50 md:hidden"
        onClick={toggleSidebar}
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-white text-black p-5 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 z-40 w-64 md:relative md:translate-x-0 md:w-64 lg:w-64 flex flex-col`}
      >
        <h2 className="text-2xl font-bold mb-8 text-black border-gray-500 border-b">
          Dashboard
        </h2>

        {/* Main Menu Items */}
        <ul className="space-y-4">
          {menuItems.map((item) => (
            <li key={item.name}>
              <button
                onClick={() => toggleMenu(item.name)}
                className={`flex items-center justify-between space-x-3 p-2 rounded w-full ${
                  pathname === item.href
                    ? "bg-red-500 text-white"
                    : "hover:bg-gray-200"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-base">{item.name}</span>
                </div>
                <AiOutlineDown
                  className={`transition-transform duration-300 ${
                    openMenu === item.name ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown menu */}
              {openMenu === item.name && (
                <ul className="ml-8 space-y-2 mt-2">
                  {item.children.map((child) => (
                    <li key={child.name}>
                      <Link href={child.href}>
                        <h1
                          className={`block p-2 rounded ${
                            pathname === child.href
                              ? "bg-red-500 text-white"
                              : "hover:bg-gray-200"
                          }`}
                        >
                          {child.name}
                        </h1>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>

        {/* Spacer to push Home and Logout to the bottom */}
        <div className="mt-auto">
          <ul className="space-y-4">
            <li>
              <Link href="/">
                <h1
                  className={`flex items-center space-x-3 p-2 rounded ${
                    pathname === "/"
                      ? "bg-red-500 text-white"
                      : "hover:bg-gray-200"
                  }`}
                >
                  <span className="text-xl">
                    <FaHome />
                  </span>
                  <span className="text-base">Home</span>
                </h1>
              </Link>
            </li>
            <li>
              <button className="flex items-center space-x-3 p-2 rounded hover:bg-gray-200 text-black w-full">
                <span className="text-xl">
                  <FaSignOutAlt />
                </span>
                <span className="text-base">Logout</span>
              </button>
            </li>
          </ul>
        </div>
      </aside>

      {/* Overlay for mobile when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Main content area */}
      <main className="flex-1 p-8 bg-gray-100 overflow-y-auto">{children}</main>
    </div>
  );
};

export default UserDashboardLayout;
