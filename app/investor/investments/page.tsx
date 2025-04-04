"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/context/language-context"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { FileText, Loader2, DollarSign, Calendar, BarChart } from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function InvestorInvestmentsPage() {
  const { t, dir } = useLanguage()
  const { user, userRole } = useAuth()
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(true)
  const [investments, setInvestments] = useState([])
  const [stats, setStats] = useState({
    totalInvested: 0,
    activeInvestments: 0,
    projectsCount: 0,
  })

  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
      return
    }

    if (userRole !== "investor") {
      router.push("/")
      return
    }

    const fetchInvestments = async () => {
      try {
        // جلب الاستثمارات
        const { data, error } = await supabase
          .from("investments")
          .select(`
            *,
            projects:project_id (*)
          `)
          .eq("investor_id", user.id)
          .order("investment_date", { ascending: false })

        if (error) {
          throw error
        }

        setInvestments(data || [])

        // حساب الإحصائيات
        let totalInvested = 0
        let activeInvestments = 0
        const projectIds = new Set()

        data?.forEach((inv) => {
          totalInvested += inv.amount
          if (inv.status === "active") {
            activeInvestments += inv.amount
          }
          projectIds.add(inv.project_id)
        })

        setStats({
          totalInvested,
          activeInvestments,
          projectsCount: projectIds.size,
        })
      } catch (error) {
        console.error("Error fetching investments:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchInvestments()
  }, [user, userRole, router])

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4">{t("loading")}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col" dir={dir}>
      <section className="w-full py-8 bg-primary/10">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-start">
            <h1 className="text-3xl font-bold tracking-tighter">{t("investment-details")}</h1>
            <p className="text-muted-foreground">إدارة ومتابعة استثماراتك</p>
          </div>
        </div>
      </section>

      <section className="w-full py-6">
        <div className="container px-4 md:px-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium">{t("total-investments")}</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalInvested.toLocaleString()} دج</div>
                <p className="text-xs text-muted-foreground">إجمالي المبالغ المستثمرة</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium">{t("active-investments")}</CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeInvestments.toLocaleString()} دج</div>
                <p className="text-xs text-muted-foreground">الاستثمارات النشطة حالياً</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium">عدد المشاريع</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.projectsCount}</div>
                <p className="text-xs text-muted-foreground">عدد المشاريع المستثمر فيها</p>
              </CardContent>
            </Card>
          </div>

          {/* Investments List */}
          <Card>
            <CardHeader>
              <CardTitle>استثماراتك</CardTitle>
              <CardDescription>قائمة بجميع استثماراتك في المشاريع</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all">جميع الاستثمارات</TabsTrigger>
                  <TabsTrigger value="active">النشطة</TabsTrigger>
                  <TabsTrigger value="completed">المكتملة</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-6">
                  {renderInvestments(investments)}
                </TabsContent>

                <TabsContent value="active" className="mt-6">
                  {renderInvestments(investments.filter((inv) => inv.status === "active"))}
                </TabsContent>

                <TabsContent value="completed" className="mt-6">
                  {renderInvestments(investments.filter((inv) => inv.status === "completed"))}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )

  function renderInvestments(investmentsList) {
    if (investmentsList.length === 0) {
      return <div className="text-center py-8 text-muted-foreground">لا توجد استثمارات</div>
    }

    return (
      <div className="space-y-6">
        {investmentsList.map((investment) => (
          <Card key={investment.id} className="overflow-hidden">
            <div className="border-b p-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold">{investment.projects?.project_name}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>تاريخ الاستثمار: {new Date(investment.investment_date).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg">{investment.amount.toLocaleString()} دج</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      investment.status === "active" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {investment.status === "active" ? "نشط" : "مكتمل"}
                  </span>
                </div>
              </div>
            </div>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">وصف المشروع</p>
                    <p className="line-clamp-2">{investment.projects?.description}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">الميزانية المطلوبة</p>
                      <p className="font-medium">{investment.projects?.required_budget.toLocaleString()} دج</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">نسبة استثمارك</p>
                      <p className="font-medium">
                        {Math.round((investment.amount / investment.projects?.required_budget) * 100)}%
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">نسبة استثمارك من المشروع</span>
                      <span className="text-sm font-medium">
                        {Math.round((investment.amount / investment.projects?.required_budget) * 100)}%
                      </span>
                    </div>
                    <Progress
                      value={Math.round((investment.amount / investment.projects?.required_budget) * 100)}
                      className="h-2"
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/projects/${investment.project_id}`}>عرض تفاصيل المشروع</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }
}

