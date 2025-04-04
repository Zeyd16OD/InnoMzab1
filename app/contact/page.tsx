"use client"

import type React from "react"

import { useState } from "react"
import { useLanguage } from "@/context/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle, Mail, Phone, MapPin } from "lucide-react"

export default function ContactPage() {
  const { t, dir } = useLanguage()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setIsSuccess(true)
  }

  return (
    <div className="flex flex-col" dir={dir}>
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{t("contact-title")}</h1>
              <p className="text-muted-foreground">{t("contact-subtitle")}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
            <Card>
              <CardHeader>
                <CardTitle>{t("contact-title")}</CardTitle>
                <CardDescription>{t("contact-subtitle")}</CardDescription>
              </CardHeader>
              <CardContent>
                {isSuccess ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="rounded-full bg-green-100 p-3 mb-4">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{t("contact-success")}</h3>
                    <p className="text-muted-foreground">سنقوم بالرد عليك في أقرب وقت ممكن</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">{t("contact-name")}</Label>
                      <Input id="name" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">{t("contact-email")}</Label>
                      <Input id="email" type="email" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">{t("contact-subject")}</Label>
                      <Input id="subject" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">{t("contact-message")}</Label>
                      <Textarea id="message" rows={5} required />
                    </div>
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? "جاري الإرسال..." : t("send-message")}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-4">معلومات الاتصال</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold">البريد الإلكتروني</h3>
                      <p className="text-muted-foreground">info@bergane.dz</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold">الهاتف</h3>
                      <p className="text-muted-foreground">+213 123 456 789</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold">العنوان</h3>
                      <p className="text-muted-foreground">غرداية، الجزائر</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="aspect-video overflow-hidden rounded-xl bg-muted">
                {/* Placeholder for map */}
                <div className="h-full w-full flex items-center justify-center text-muted-foreground">خريطة الموقع</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

