"use client"

import { useLanguage } from "@/context/language-context"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

export default function AboutPage() {
  const { dir } = useLanguage()

  return (
    <div className="flex flex-col" dir={dir}>
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                عن منصة InnoMzab
              </h1>
              <p className="text-xl text-muted-foreground">منصة رقمية لدعم الابتكار وريادة الأعمال في مجتمع مزاب</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Content */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <p className="text-muted-foreground">
                منصة InnoMzab هي مبادرة تهدف إلى دعم الشباب وأصحاب المشاريع الناشئة في مجتمع مزاب من خلال توفير بيئة
                متكاملة لتطوير المشاريع وتقييمها وربطها بالمستثمرين المناسبين. تسعى المنصة لتعزيز روح الابتكار والريادة
                في المجتمع وخلق فرص عمل للشباب وتحقيق التنمية المستدامة.
              </p>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold">رسالتنا</h3>
                  <p className="text-muted-foreground mt-2">
                    تمكين الشباب وأصحاب المشاريع الناشئة في مجتمع مزاب من تحويل أفكارهم إلى مشاريع ناجحة ومستدامة من
                    خلال توفير الدعم المتكامل، بدءًا من التقييم المهني للمشاريع، وصولاً إلى ربطهم بالمستثمرين وتوفير
                    التوجيه المناسب.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-bold">رؤيتنا</h3>
                  <p className="text-muted-foreground mt-2">
                    خلق منظومة ريادية متكاملة تساهم في التنمية الاقتصادية المستدامة لمجتمع مزاب، وتحويله إلى مركز
                    للابتكار وريادة الأعمال في المنطقة، من خلال استثمار طاقات الشباب وتوجيهها نحو المشاريع ذات الأثر
                    الإيجابي على المجتمع.
                  </p>
                </div>
              </div>
            </div>
            <div className="mx-auto lg:mx-0 relative aspect-video overflow-hidden rounded-xl">
              <Image
                src="/images/innomzab-logo.png"
                alt="INNOMZAB"
                width={600}
                height={400}
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">قيمنا</h2>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 md:grid-cols-3 gap-6 py-12">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <CardTitle>الابتكار</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  نشجع الابتكار والإبداع في جميع المشاريع ونسعى لتطوير حلول مبتكرة للتحديات التي تواجه المجتمع
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <CardTitle>الشفافية</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  نلتزم بالشفافية والنزاهة في جميع تعاملاتنا ونسعى لبناء الثقة مع جميع الأطراف المعنية
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <CardTitle>التعاون</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  نؤمن بأهمية التعاون والشراكة بين مختلف الجهات لتحقيق النجاح وتعظيم الأثر الإيجابي
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <CardTitle>التميز</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  نسعى دائماً للتميز والجودة في جميع خدماتنا ومبادراتنا ونعمل على التحسين المستمر
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <CardTitle>المسؤولية المجتمعية</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  نؤمن بمسؤوليتنا تجاه المجتمع ونسعى لتحقيق التنمية المستدامة وتعزيز الرفاهية الاجتماعية
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <CardTitle>التطوير المستمر</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  نلتزم بالتطوير المستمر لخدماتنا ومنصتنا لتلبية احتياجات المستفيدين وتحقيق أهدافنا
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Challenges and Solutions */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">التحديات والحلول</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                نعمل على معالجة التحديات الرئيسية التي تواجه رواد الأعمال في مجتمع مزاب
              </p>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <Card className="overflow-hidden">
              <CardHeader className="bg-muted/50">
                <CardTitle>التحديات</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="bg-red-100 p-1 rounded-full mt-1">
                      <CheckCircle className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium">صعوبة الوصول إلى التمويل</p>
                      <p className="text-sm text-muted-foreground">
                        يواجه الشباب صعوبة في الحصول على التمويل اللازم لبدء مشاريعهم وتطويرها
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="bg-red-100 p-1 rounded-full mt-1">
                      <CheckCircle className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium">نقص الخبرة والتوجيه</p>
                      <p className="text-sm text-muted-foreground">
                        افتقار الشباب للخبرة الكافية في إدارة المشاريع والتخطيط الاستراتيجي
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="bg-red-100 p-1 rounded-full mt-1">
                      <CheckCircle className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium">ضعف التنسيق بين الجهات</p>
                      <p className="text-sm text-muted-foreground">
                        عدم وجود تنسيق فعال بين مختلف الجهات الداعمة لريادة الأعمال
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="bg-red-100 p-1 rounded-full mt-1">
                      <CheckCircle className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium">صعوبة تقييم المشاريع</p>
                      <p className="text-sm text-muted-foreground">
                        عدم وجود آليات موحدة وموثوقة لتقييم جدوى المشاريع وفرص نجاحها
                      </p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <CardHeader className="bg-muted/50">
                <CardTitle>حلولنا</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="bg-green-100 p-1 rounded-full mt-1">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">منصة تقييم متكاملة</p>
                      <p className="text-sm text-muted-foreground">
                        توفير نظام تقييم شامل للمشاريع يعتمد على معايير علمية ومهنية
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="bg-green-100 p-1 rounded-full mt-1">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">جلسات توجيه وإرشاد</p>
                      <p className="text-sm text-muted-foreground">
                        توفير جلسات إرشادية مع خبراء في مختلف المجالات لتوجيه أصحاب المشاريع
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="bg-green-100 p-1 rounded-full mt-1">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">ربط مباشر بالمستثمرين</p>
                      <p className="text-sm text-muted-foreground">
                        توفير منصة تفاعلية تربط أصحاب المشاريع بالمستثمرين المهتمين
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="bg-green-100 p-1 rounded-full mt-1">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">متابعة وتحليل الأداء</p>
                      <p className="text-sm text-muted-foreground">
                        توفير أدوات لمتابعة أداء المشاريع وتقييم تقدمها بعد التمويل
                      </p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}

