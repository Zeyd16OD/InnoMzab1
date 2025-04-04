"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useLanguage } from "@/context/language-context"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { ArrowLeft, CheckCircle, Loader2, AlertCircle, DollarSign } from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function InvestProjectPage({ params }: { params: { id: string } }) {
  const { t, dir } = useLanguage()
  const { user, userRole } = useAuth()
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [project, setProject] = useState<any>(null)
  const [walletBalance, setWalletBalance] = useState(0)
  const [investmentAmount, setInvestmentAmount] = useState(0)
  const [minInvestment] = useState(10000) // الحد الأدنى للاستثمار
  const [maxInvestment, setMaxInvestment] = useState(0) // الحد الأقصى للاستثمار (سيتم تحديده بناءً على رصيد المحفظة)

  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
      return
    }

    if (userRole !== "investor") {
      router.push("/")
      return
    }

    const fetchData = async () => {
      try {
        // جلب بيانات المشروع
        const { data: projectData, error: projectError } = await supabase
          .from("projects")
          .select("*")
          .eq("id", params.id)
          .single()

        if (projectError) {
          throw new Error(projectError.message)
        }

        if (!projectData) {
          throw new Error("لم يتم العثور على المشروع")
        }

        setProject(projectData)

        // جلب رصيد المحفظة
        const { data: walletData, error: walletError } = await supabase
          .from("investor_wallets")
          .select("balance")
          .eq("user_id", user.id)
          .single()

        if (walletError && walletError.code !== "PGRST116") {
          throw new Error(walletError.message)
        }

        const balance = walletData?.balance || 0
        setWalletBalance(balance)

        // تحديد الحد الأقصى للاستثمار (إما رصيد المحفظة أو المبلغ المطلوب للمشروع)
        const max = Math.min(balance, projectData.required_budget)
        setMaxInvestment(max)

        // تعيين قيمة افتراضية للاستثمار (50% من الحد الأقصى)
        setInvestmentAmount(Math.max(minInvestment, Math.floor(max * 0.5)))
      } catch (err: any) {
        console.error("Error fetching data:", err)
        setError(err.message || "حدث خطأ أثناء جلب البيانات")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [user, userRole, params.id, router])

  const handleInvestmentChange = (value: number[]) => {
    setInvestmentAmount(value[0])
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value)
    if (!isNaN(value)) {
      // التأكد من أن القيمة ضمن الحدود المسموح بها
      const amount = Math.max(minInvestment, Math.min(value, maxInvestment))
      setInvestmentAmount(amount)
    }
  }

  const handleInvest = async () => {
    if (investmentAmount < minInvestment || investmentAmount > maxInvestment) {
      setError(`يجب أن يكون مبلغ الاستثمار بين ${minInvestment} و ${maxInvestment} دج`)
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      // إنشاء معاملة استثمار
      const { error: transactionError } = await supabase.from("transactions").insert({
        user_id: user.id,
        project_id: project.id,
        amount: investmentAmount,
        type: "investment",
        status: "completed",
        description: `استثمار في مشروع: ${project.project_name}`,
      })

      if (transactionError) {
        throw new Error(transactionError.message)
      }

      // تحديث رصيد المحفظة
      const { error: walletError } = await supabase
        .from("investor_wallets")
        .update({ balance: walletBalance - investmentAmount })
        .eq("user_id", user.id)

      if (walletError) {
        throw new Error(walletError.message)
      }

      // إنشاء سجل استثمار
      const { error: investmentError } = await supabase.from("investments").insert({
        investor_id: user.id,
        project_id: project.id,
        amount: investmentAmount,
        status: "active",
        investment_date: new Date().toISOString(),
      })

      if (investmentError) {
        throw new Error(investmentError.message)
      }

      setIsSuccess(true)

      // إعادة التوجيه بعد 2 ثانية
      setTimeout(() => {
        router.push("/investor-dashboard")
      }, 2000)
    } catch (err: any) {
      console.error("Error processing investment:", err)
      setError(err.message || "حدث خطأ أثناء معالجة الاستثمار")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4">{t("loading")}</p>
      </div>
    )
  }

  if (error && !project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <AlertCircle className="h-8 w-8 text-red-500" />
        <p className="mt-4">{error}</p>
        <Button className="mt-4" variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("go-back")}
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col" dir={dir}>
      <section className="w-full py-8 bg-primary/10">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-start">
            <h1 className="text-3xl font-bold tracking-tighter">{t("invest-now")}</h1>
            <p className="text-muted-foreground">استثمر في مشروع: {project.project_name}</p>
          </div>
        </div>
      </section>

      <section className="w-full py-6">
        <div className="container px-4 md:px-6">
          {isSuccess ? (
            <Card className="mx-auto max-w-md">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="rounded-full bg-green-100 p-3 mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{t("investment-success")}</h3>
                  <p className="text-muted-foreground mb-6">تم الاستثمار بنجاح في مشروع {project.project_name}</p>
                  <p className="font-medium mb-6">مبلغ الاستثمار: {investmentAmount.toLocaleString()} دج</p>
                  <p className="text-sm text-muted-foreground">جاري إعادة توجيهك إلى لوحة التحكم...</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>{t("investment-details")}</CardTitle>
                    <CardDescription>أدخل تفاصيل استثمارك في المشروع</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {error && (
                      <div className="bg-red-50 text-red-800 p-3 rounded-md flex items-start gap-2">
                        <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                        <p>{error}</p>
                      </div>
                    )}

                    <div className="space-y-2">
                      <label className="text-sm font-medium">المشروع</label>
                      <div className="p-3 bg-muted rounded-md">{project.project_name}</div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">الميزانية المطلوبة</label>
                      <div className="p-3 bg-muted rounded-md">{project.required_budget.toLocaleString()} دج</div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">مبلغ الاستثمار</label>
                      <div className="flex items-center gap-4">
                        <div className="relative flex-1">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="number"
                            value={investmentAmount}
                            onChange={handleInputChange}
                            className="pl-9"
                            min={minInvestment}
                            max={maxInvestment}
                          />
                        </div>
                        <span className="font-medium">دج</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span>{minInvestment.toLocaleString()} دج</span>
                        <span>{maxInvestment.toLocaleString()} دج</span>
                      </div>
                      <Slider
                        value={[investmentAmount]}
                        min={minInvestment}
                        max={maxInvestment}
                        step={1000}
                        onValueChange={handleInvestmentChange}
                      />
                    </div>

                    <div className="bg-muted p-4 rounded-md">
                      <h4 className="font-medium mb-2">ملاحظات هامة:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>الحد الأدنى للاستثمار هو {minInvestment.toLocaleString()} دج</li>
                        <li>يمكنك استثمار ما يصل إلى {maxInvestment.toLocaleString()} دج في هذا المشروع</li>
                        <li>سيتم خصم المبلغ من رصيد محفظتك فور تأكيد الاستثمار</li>
                        <li>يمكنك متابعة استثماراتك من خلال لوحة التحكم الخاصة بك</li>
                      </ul>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => router.back()}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      العودة
                    </Button>
                    <Button
                      onClick={handleInvest}
                      disabled={isSubmitting || investmentAmount < minInvestment || investmentAmount > maxInvestment}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          جاري التنفيذ...
                        </>
                      ) : (
                        <>{t("confirm-investment")}</>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              <div className="md:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>محفظتك</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">الرصيد المتاح</p>
                      <p className="text-2xl font-bold">{walletBalance.toLocaleString()} دج</p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">مبلغ الاستثمار</p>
                      <p className="text-2xl font-bold text-primary">{investmentAmount.toLocaleString()} دج</p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">الرصيد المتبقي بعد الاستثمار</p>
                      <p className="text-xl font-medium">{(walletBalance - investmentAmount).toLocaleString()} دج</p>
                    </div>

                    <div className="pt-4">
                      <Link href="/investor/wallet">
                        <Button variant="outline" className="w-full">
                          إدارة المحفظة
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

