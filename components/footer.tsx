"use client"

import Link from "next/link"
import { useLanguage } from "@/context/language-context"

export default function Footer() {
  const { t, dir } = useLanguage()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-muted/40" dir={dir}>
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">InnoMzab</h3>
            <p className="text-sm text-muted-foreground">منصة لدعم الشباب والشركات الناشئة في مجتمع مزاب</p>
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">{t("home")}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-muted-foreground hover:text-primary">
                  {t("home")}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-primary">
                  {t("about")}
                </Link>
              </li>
              <li>
                <Link href="/submit-project" className="text-sm text-muted-foreground hover:text-primary">
                  {t("submit-project")}
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">{t("contact")}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary">
                  {t("contact")}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} {t("footer-rights")}
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary">
              {t("footer-privacy")}
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary">
              {t("footer-terms")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

