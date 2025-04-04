"use client"

import { useLanguage } from "@/context/language-context"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ArrowRight,
  Users,
  LineChart,
  BarChart,
  Star,
  Wallet,
  FileText,
  PieChart,
  DollarSign,
  Search,
  CalendarDays,
} from "lucide-react"

export default function Home() {
  const { t, dir } = useLanguage()

  return (
    <div className="flex flex-col" dir={dir}>
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-primary/10 to-primary/5">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center text-center">
            <img src="/images/innomzab-logo.png" alt="INNOMZAB" className="h-48 mb-8" />
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl mb-4">
              منصة InnoMzab للابتكار
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">{t("hero-subtitle")}</p>
            <p className="text-muted-foreground max-w-3xl mx-auto mb-8">{t("hero-description")}</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/about">
                <Button variant="outline" size="lg">
                  {t("learn-more")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Sign Up Sections */}
      <section className="w-full py-12 md:py-24 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">{t("join-now")}</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              اختر نوع الحساب المناسب لك وابدأ رحلتك مع منصة InnoMzab
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* For Entrepreneurs */}
            <Card className="relative overflow-hidden border-2 border-primary/20 hover:border-primary/50 transition-all duration-300">
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-4 py-1 rounded-bl-lg font-medium">
                لأصحاب المشاريع
              </div>
              <CardHeader className="pt-12">
                <CardTitle className="text-2xl">{t("for-entrepreneurs")}</CardTitle>
                <CardDescription className="text-base">{t("entrepreneur-description")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 bg-primary/10 p-1.5 rounded-full">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">قدم مشروعك</h3>
                      <p className="text-sm text-muted-foreground">أدخل تفاصيل مشروعك للحصول على تقييم شامل</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 bg-primary/10 p-1.5 rounded-full">
                      <PieChart className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">احصل على تقييم احترافي</h3>
                      <p className="text-sm text-muted-foreground">تقييم شامل لجدوى مشروعك وفرص نجاحه</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 bg-primary/10 p-1.5 rounded-full">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">تواصل مع المستثمرين</h3>
                      <p className="text-sm text-muted-foreground">فرصة للتواصل مع مستثمرين مهتمين بمجال مشروعك</p>
                    </div>
                  </div>
                </div>

                <Link href="/auth/register?role=project_owner" className="block w-full">
                  <Button className="w-full bg-primary hover:bg-primary/90" size="lg">
                    {t("entrepreneur-signup")}
                    <ArrowRight className="ms-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* For Investors */}
            <Card className="relative overflow-hidden border-2 border-primary/20 hover:border-primary/50 transition-all duration-300">
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-4 py-1 rounded-bl-lg font-medium">
                للمستثمرين
              </div>
              <CardHeader className="pt-12">
                <CardTitle className="text-2xl">{t("for-investors")}</CardTitle>
                <CardDescription className="text-base">{t("investor-description")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 bg-primary/10 p-1.5 rounded-full">
                      <BarChart className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">تصفح المشاريع المقيمة</h3>
                      <p className="text-sm text-muted-foreground">استعرض مشاريع تم تقييمها بدقة واختر ما يناسبك</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 bg-primary/10 p-1.5 rounded-full">
                      <DollarSign className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">استثمر بثقة</h3>
                      <p className="text-sm text-muted-foreground">استثمر في مشاريع واعدة بناءً على تقييمات موثوقة</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 bg-primary/10 p-1.5 rounded-full">
                      <Wallet className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">تابع استثماراتك</h3>
                      <p className="text-sm text-muted-foreground">إدارة محفظتك الاستثمارية ومتابعة أداء استثماراتك</p>
                    </div>
                  </div>
                </div>

                <Link href="/auth/register?role=investor" className="block w-full">
                  <Button className="w-full bg-primary hover:bg-primary/90" size="lg">
                    {t("investor-signup")}
                    <ArrowRight className="ms-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">كيف تعمل المنصة؟</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              نقدم حلولاً متكاملة لكل من أصحاب المشاريع والمستثمرين
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-12">
            {/* Project Owners Section */}
            <div className="bg-muted/20 p-6 rounded-xl">
              <h3 className="text-2xl font-bold mb-6 text-center">لأصحاب المشاريع</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-lg">تقديم المشروع</h4>
                    <p className="text-muted-foreground">قم بإدخال تفاصيل مشروعك للحصول على تقييم شامل واحترافي</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <PieChart className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-lg">تقييم المشروع</h4>
                    <p className="text-muted-foreground">احصل على تقييم مفصل لمشروعك ونقاط القوة والضعف وفرص النجاح</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <CalendarDays className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-lg">جلسات إرشادية</h4>
                    <p className="text-muted-foreground">
                      احضر جلسات إرشادية مع خبراء في المجال للحصول على التوجيه اللازم
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-lg">التواصل مع المستثمرين</h4>
                    <p className="text-muted-foreground">
                      تواصل مع المستثمرين المهتمين بمشروعك للحصول على التمويل المناسب
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Investors Section */}
            <div className="bg-muted/20 p-6 rounded-xl">
              <h3 className="text-2xl font-bold mb-6 text-center">للمستثمرين</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Search className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-lg">استكشاف المشاريع</h4>
                    <p className="text-muted-foreground">تصفح مشاريع مقيمة بشكل احترافي وذات فرص نجاح عالية</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <BarChart className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-lg">تحليلات المشاريع</h4>
                    <p className="text-muted-foreground">
                      احصل على تحليلات مفصلة لكل مشروع تساعدك على اتخاذ قرار استثماري صائب
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <DollarSign className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-lg">استثمار آمن</h4>
                    <p className="text-muted-foreground">
                      استثمر في مشاريع تم تقييمها وفق معايير دقيقة تضمن لك عائدًا جيدًا
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <LineChart className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-lg">متابعة الاستثمارات</h4>
                    <p className="text-muted-foreground">تابع استثماراتك ومستوى تقدم المشاريع التي استثمرت فيها</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Benefits */}
      <section className="w-full py-12 md:py-24 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
              {t("platform-benefits")}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">ما يميز منصة InnoMzab عن غيرها</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <div className="p-2 rounded-full bg-primary/10 mb-4 w-12 h-12 flex items-center justify-center">
                  <PieChart className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{t("benefit-1-title")}</CardTitle>
                <CardDescription>{t("benefit-1-desc")}</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-primary/20">
              <CardHeader>
                <div className="p-2 rounded-full bg-primary/10 mb-4 w-12 h-12 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{t("benefit-2-title")}</CardTitle>
                <CardDescription>{t("benefit-2-desc")}</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-primary/20">
              <CardHeader>
                <div className="p-2 rounded-full bg-primary/10 mb-4 w-12 h-12 flex items-center justify-center">
                  <LineChart className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{t("benefit-3-title")}</CardTitle>
                <CardDescription>{t("benefit-3-desc")}</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-primary/20">
              <CardHeader>
                <div className="p-2 rounded-full bg-primary/10 mb-4 w-12 h-12 flex items-center justify-center">
                  <Wallet className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{t("benefit-4-title")}</CardTitle>
                <CardDescription>{t("benefit-4-desc")}</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">{t("success-stories")}</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">قصص نجاح حقيقية من منصة InnoMzab</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="overflow-hidden">
              <div className="h-48 relative">
                <Image src="/images/success-story-1.jpg" alt="قصة نجاح" fill className="object-cover" />
              </div>
              <CardHeader>
                <CardTitle>{t("success-story-1-title")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{t("success-story-1-desc")}</p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <div className="h-48 relative">
                <Image src="/images/success-story-2.jpg" alt="قصة نجاح" fill className="object-cover" />
              </div>
              <CardHeader>
                <CardTitle>{t("success-story-2-title")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{t("success-story-2-desc")}</p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <div className="h-48 relative">
                <Image src="/images/success-story-3.jpg" alt="قصة نجاح" fill className="object-cover" />
              </div>
              <CardHeader>
                <CardTitle>{t("success-story-3-title")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{t("success-story-3-desc")}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="w-full py-12 md:py-24 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">{t("testimonials")}</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">ماذا يقول مستخدمو منصة InnoMzab</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-lg font-bold text-primary">أ</span>
                  </div>
                  <div>
                    <CardTitle className="text-lg">{t("testimonial-1-name")}</CardTitle>
                    <CardDescription>{t("testimonial-1-role")}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex mb-2">
                  {[1, 2, 3, 4, 5].map((index) => (
                    <Star key={index} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground">{t("testimonial-1-text")}</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/20">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-lg font-bold text-primary">س</span>
                  </div>
                  <div>
                    <CardTitle className="text-lg">{t("testimonial-2-name")}</CardTitle>
                    <CardDescription>{t("testimonial-2-role")}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex mb-2">
                  {[1, 2, 3, 4, 5].map((index) => (
                    <Star key={index} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground">{t("testimonial-2-text")}</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/20">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-lg font-bold text-primary">م</span>
                  </div>
                  <div>
                    <CardTitle className="text-lg">{t("testimonial-3-name")}</CardTitle>
                    <CardDescription>{t("testimonial-3-role")}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex mb-2">
                  {[1, 2, 3, 4, 5].map((index) => (
                    <Star key={index} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground">{t("testimonial-3-text")}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}

