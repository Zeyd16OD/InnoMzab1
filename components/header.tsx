"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useLanguage } from "@/context/language-context"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Menu, X, User, LogOut } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

export default function Header() {
  const { t, dir } = useLanguage()
  const { user, userRole, signOut } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const navItems = [
    { href: "/", label: t("home") },
    { href: "/about", label: t("about") },
  ]

  const authenticatedNavItems =
    userRole === "project_owner"
      ? [
          { href: "/dashboard", label: t("dashboard") },
          { href: "/submit-project", label: t("submit-project") },
        ]
      : userRole === "investor"
        ? [
            { href: "/investor-dashboard", label: t("investor-dashboard") },
            { href: "/browse-projects", label: t("browse-projects") },
          ]
        : userRole === "admin"
          ? [{ href: "/admin/dashboard", label: t("admin-dashboard") }]
          : []

  const authNavItems = []

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/images/innomzab-logo.png" alt="INNOMZAB" width={60} height={60} className="object-contain" />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6" dir={dir}>
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-medium transition-colors hover:text-primary">
              {item.label}
            </Link>
          ))}

          {authenticatedNavItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-medium transition-colors hover:text-primary">
              {item.label}
            </Link>
          ))}

          {authNavItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-medium transition-colors hover:text-primary">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                  <span className="sr-only">قائمة المستخدم</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {userRole === "investor" && (
                  <>
                    <DropdownMenuItem>
                      <Link href="/investor-profile" className="w-full">
                        {t("profile")}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/investor-dashboard" className="w-full">
                        {t("dashboard")}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/investor/wallet" className="w-full">
                        {t("wallet")}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/investor/investments" className="w-full">
                        {t("investment-details")}
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}

                {userRole === "project_owner" && (
                  <>
                    <DropdownMenuItem>
                      <Link href="/profile" className="w-full">
                        {t("profile")}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/dashboard" className="w-full">
                        {t("dashboard")}
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}

                {userRole === "admin" && (
                  <>
                    <DropdownMenuItem>
                      <Link href="/admin/dashboard" className="w-full">
                        {t("admin-dashboard")}
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}

                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut className="h-4 w-4 mr-2" />
                  {t("logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMenu}>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">القائمة</span>
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <nav className="container py-4 flex flex-col gap-2" dir={dir}>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium transition-colors hover:text-primary py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            {authenticatedNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium transition-colors hover:text-primary py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            {authNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium transition-colors hover:text-primary py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            {user && (
              <Button
                variant="ghost"
                className="justify-start px-2 py-2 h-auto font-medium text-sm"
                onClick={() => {
                  signOut()
                  setIsMenuOpen(false)
                }}
              >
                <LogOut className="h-4 w-4 mr-2" />
                {t("logout")}
              </Button>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}

