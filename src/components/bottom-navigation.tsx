"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, Calendar, BarChart3, User, Plus } from "lucide-react"
import { motion } from "framer-motion"

const navItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/absen", label: "Absen", icon: Calendar },
  { href: "/laporan", label: "Laporan", icon: BarChart3 },
  { href: "/profil", label: "Profil", icon: User },
]

export function BottomNavigation() {
  const pathname = usePathname()

  return (
    <motion.nav 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pb-safe"
    >
      <div className="flex h-16 items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center justify-center space-y-1 px-3 py-2 text-sm font-medium transition-colors flex-1",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="bottom-nav-active-indicator"
                  className="absolute -top-3 w-12 h-1 bg-primary rounded-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <Icon 
                className={cn(
                  "h-5 w-5 transition-all",
                  isActive && "scale-110"
                )} 
              />
              <span className="text-xs">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </motion.nav>
  )
}