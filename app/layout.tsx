import type React from "react"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { LanguageProvider } from "@/context/language-context"
import { AuthProvider } from "@/context/auth-context"
import { inter } from "@/lib/fonts"

export const metadata = {
  title: "منصة InnoMzab | دعم الابتكار في مجتمع مزاب",
  description: "منصة لدعم الشباب والشركات الناشئة في مجتمع مزاب",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={inter.className}>
        <AuthProvider>
          <LanguageProvider>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  )
}



import './globals.css'