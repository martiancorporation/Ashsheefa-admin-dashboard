'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { LayoutDashboard, User, FileText, LogOut, ChevronsLeftRight, Settings, MessageSquareMore, House, Plane, BriefcaseMedical, Stethoscope, Syringe, UserSearch, Mic } from 'lucide-react'
import { cn } from "@/lib/utils"
import Image from 'next/image'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import useAuthDataStore from '@/store/authStore'
import API from '@/api'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'


const menuItems = [
  {
    icon: House,
    label: 'Dashboard',
    href: '/dashboard',
    matchPaths: ['/dashboard']
  },
  {
    icon: UserSearch,
    label: 'Patients Enquiry',
    href: '/dashboard/patients-enquiries',
    matchPaths: ['/dashboard/patients-enquiries']
  },

  {
    icon: Plane,
    label: 'International Patient',
    href: '/dashboard/international-patients',
    matchPaths: ['/dashboard/international-patients', '/dashboard/international-patients/[id]']
  },
  {
    icon: User,
    label: 'Patients',
    href: '/dashboard/patient',
    matchPaths: ['/dashboard/patient', '/dashboard/patient/[id]']
  },
  {
    icon: Stethoscope,
    label: 'Doctors',
    href: '/dashboard/doctors',
    matchPaths: ['/dashboard/doctors', '/dashboard/doctors/[id]']
  },
  {
    icon: Syringe,
    label: 'Health checkup',
    href: '/dashboard/health-checkup',
    matchPaths: ['/dashboard/health-checkup', '/dashboard/health-checkup/[id]']
  },
  {
    icon: BriefcaseMedical,
    label: 'Departments',
    href: '/dashboard/departments',
    matchPaths: ['/dashboard/departments', '/dashboard/departments/[id]']
  },
  {
    icon: FileText,
    label: 'Blog',
    href: '/dashboard/blogs',
    matchPaths: ['/dashboard/blogs', '/dashboard/blogs/all-blogs', '/dashboard/blogs/create-blog', '/dashboard/blogs/edit']
  },
  {
    icon: Mic,
    label: 'News',
    href: '/dashboard/news',
    matchPaths: ['/dashboard/news', '/dashboard/news/all-news', '/dashboard/news/create-news', '/dashboard/news/edit']
  },
  {
    icon: Settings,
    label: 'Settings',
    href: '/dashboard/settings',
    matchPaths: ['/dashboard/settings']
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const clearAuthData = useAuthDataStore((state) => state.clearAuthData)

  const handleLogout = () => {
    API.auth.Logout(router, clearAuthData);
  }

  const isActiveRoute = (item) => {
    if (item.label === 'Dashboard') {
      return pathname === '/dashboard'
    }

    // For more precise matching, check exact matches first, then startsWith
    return item.matchPaths.some(path => {
      // Handle dynamic routes with [id]
      if (path.includes('[id]')) {
        const basePath = path.replace('/[id]', '')
        return pathname.startsWith(basePath) && pathname !== basePath
      }
      // For exact paths - be more specific to avoid conflicts
      if (pathname === path) {
        return true
      }
      // For paths that should match sub-routes, but be careful about overlaps
      if (pathname.startsWith(path + '/')) {
        return true
      }
      return false
    })
  }

  return (
    <div className={cn(
      " h-screen flex flex-col transition-all duration-500 relative",
      isCollapsed ? "w-20" : "w-64"
    )}>
      <div className={isCollapsed ? ' flex  flex-col  justify-center items-center' : "flex  flex-col gap-y-0 justify-center items-center "}>
        <div className={isCollapsed ? ` h-[45px] flex flex-col items-center justify-center ` : ` h-[45px] flex flex-col items-center justify-center`} >
          {isCollapsed ?
            <Image src="/assets/images/logo.png" alt="Logo" className='w-[35px] ' width={50} height={50} /> :
            <div className="w-[130px]  flex ">
              <Image
                src="/assets/images/logo.png"
                alt="white Logo"
                width={500}
                height={500}
                className="h-[30px]  xl:h-[35px] "
              />
              <div className="flex flex-col justify-center items-center">
                <p className="uppercase text-[#83A83E] leading-3 md:leading-4 font-bold text-sm ">
                  Ashsheefa
                </p>
                <p className="uppercase text-[11px]  text-[#3B8BF4]">
                  Hospital
                </p>
              </div>
            </div>}
        </div>
        <div className='h-[1px] bg-[#D9D9D9]' style={{ width: isCollapsed ? '70%' : '80%' }}>

        </div>
        {/* <div className="absolute top-6 -right-4 ">
          <div
            variant="ghost"

            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-black cursor-pointer bg-white rounded-[8px] px-2 py-1 border border-[rgb(0,0,0,0.15)]"
          >
            {isCollapsed ? <ChevronsLeftRight className='w-4' /> : <ChevronsLeftRight className='w-4' />}
          </div>
        </div> */}
      </div>
      <nav className={isCollapsed ? "w-full px-4 py-3" : "w-full  px-4 py-3"}>
        <ul>
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>
                <span className={cn(
                  " flex items-center gap-x-2 text-sm py-2 px-2 my-0 text-[#7F7F7F] rounded-[12px] hover:bg-[#FFFFFF] hover:text-[#323232] cursor-pointer transition-all border border-transparent hover:border hover:border-[#E5E5E5]",
                  isActiveRoute(item) ? "bg-[#FFFFFF] text-[#323232] border border-[#E5E5E5]" : "",
                  isCollapsed ? "justify-center" : ""
                )}>
                  <TooltipProvider className='relative'>
                    <Tooltip>
                      <TooltipTrigger>
                        <item.icon className={cn("shrink-0", isCollapsed ? "mr-0 w-4" : "mr-0 w-4")} />
                      </TooltipTrigger>
                      <TooltipContent className='bg-white text-[#41A3FF]  border absolute ml-8'>
                        <p>{item.label}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  {!isCollapsed && <span>{item.label}</span>}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className='h-[1px] bg-[#D0D5DD] mx-auto' style={{ width: isCollapsed ? '70%' : '80%' }}>

      </div>
      <div className={isCollapsed ? 'px-4 pt-2' : "px-6 pt-2"}>

        <AlertDialog className='w-full '>
          <AlertDialogTrigger className='w-full'>
            <Button
              className={cn(
                "w-full flex items-center justify-start bg-transparent border-none shadow-none text-[#7F7F7F] hover:bg-gray-100 cursor-pointer",
                isCollapsed ? "p-2" : ""
              )}
            >
              <LogOut className={cn("shrink-0 text-[#7F7F7F]", isCollapsed ? "mr-0 " : "mr-0")} />
              {!isCollapsed && <span className='text-sm font-medium'>Log out</span>}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className='max-w-sm flex flex-col gap-y-4'>
            <AlertDialogHeader>
              <AlertDialogTitle className='text-center text-sm sm:text-base flex flex-col items-center gap-y-1'>

                Are you sure, you want to Logout?
              </AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogFooter className="w-full grid grid-cols-2 gap-x-4  px-10 place-content-center content-center">
              <AlertDialogCancel className='bg-gray-100 border text-xs  sm:text-sm py-4 hover:bg-gray-200'>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleLogout}
                className='bg-red-500 py-4 text-white text-xs  sm:text-sm hover:bg-red-600'
              >
                Logout
              </AlertDialogAction>
            </AlertDialogFooter>
            <div className="text-[#52544F] font-normal text-xs leading-4 text-center">
              Facing issues? <span className="text-[#004CA3] font-normal text-xs leading-4">Talk to our technical person </span>
            </div>

          </AlertDialogContent>
        </AlertDialog>
      </div>

      {
        <div className='w-full flex flex-col items-center absolute bottom-4 left-1/2 transform -translate-x-1/2'>
          {isCollapsed ? <p className='text-blue-700 font-semibold'>M</p> :
            <div>
              <div className='text-[#656565] text-sm flex items-center gap-x-1'>
                Developed By
                <Image src="/assets/images/love.svg"
                  className='w-4 h-4'
                  alt="love" width={50} height={50} />
              </div>
              <a href='https://martiancorporation.com/' target='_blank' className='text-[#323232] text-sm'>

                Martian Corporation
              </a>
            </div>
          }
        </div>
      }
    </div>
  )
}

export default Sidebar

