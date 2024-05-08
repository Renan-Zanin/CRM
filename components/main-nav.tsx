"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { DollarSign, History, Package, Truck, Users2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { UserButton } from "@clerk/nextjs";

export default function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathName = usePathname();
  const params = useParams();

  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const routes = [
    {
      href: `/${params.storeId}/clientes`,
      label: "CLIENTES",
      active: pathName === `/${params.storeId}/clientes`,
      icon: <Users2 size={30} />,
    },
    {
      href: `/${params.storeId}/fornecedores`,
      label: "FORNECEDORES",
      active: pathName === `/${params.storeId}/fornecedores`,
      icon: <Truck size={30} />,
    },

    {
      href: `/${params.storeId}/estoque`,
      label: "ESTOQUE",
      active: pathName === `/${params.storeId}/estoque`,
      icon: <Package size={30} />,
    },
  ];

  return (
    <nav className="flex md:mx-auto mx-2 items-center">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
            <div className="hidden sm:block sm:ml-6">
              <div className="flex space-x-4 justify-between items-center">
                <img className="h-20 mt-[-4px] mr-10" src="/logo.jpeg" />
                {routes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    className={cn(
                      "flex text-lg font-medium transition-colors hover:text-gray-400 pr-4",
                      route.active
                        ? "text-white dark:text-black"
                        : "text-gray-600"
                    )}
                  >
                    <div className="pr-2">{route.icon}</div>
                    {route.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="ml-auto mt-6 items-center space-x-4 pl-[30vh] hidden sm:block">
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
          <div className="absolute inset-y-0 left-[-10] top-1 flex items-center sm:hidden z-50">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <svg
                className={`${isOpen ? "hidden" : "block"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div
        className={`sm:hidden ${
          isOpen ? "block" : "hidden"
        } absolute z-40 top-0 left-0 w-40% h-full bg-black`}
        onClick={() => setIsOpen(false)}
      >
        <div className="px-4 pt-8 pb-3 space-y-8">
          <button className="absolute top-4 right-4" onClick={toggleMenu}>
            <svg
              className="h-6 w-6 text-gray-400 hover:text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <img className="h-20 mt-[-4px] mr-10" src="/logo.jpeg" />

          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex text-lg font-medium transition-colors hover:text-gray-400 pr-4",
                route.active ? "text-white dark:text-black" : "text-gray-600"
              )}
            >
              <div className="pr-2">{route.icon}</div>
              {route.label}
            </Link>
          ))}
          <div className="pt-10 flex items-center space-x-4">
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </div>
    </nav>
  );
}
