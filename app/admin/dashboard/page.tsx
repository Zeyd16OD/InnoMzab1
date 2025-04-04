"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/context/language-context"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  Users,
  FileText,
  DollarSign,
  Settings,
  Search,
  Wallet,
  Loader2,
  Edit,
  Trash,
  Ban,
  CheckCircle,
} from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function AdminDashboardPage() {
  const { t, dir } = useLanguage()
  const { user, userRole } = useAuth()
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProjects: 0,
    totalInvestments: 0,
    fundTotal: 0,
    fundIn: 0,
    fundOut: 0,
    fundInvested: 0,
    fundAvailable: 0,
  })
  const [users, setUsers] = useState([])
  const [projects, setProjects] = useState([])
  const [investments, setInvestments] = useState([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
      return
    }

    if (userRole !== "admin") {
      router.push("/")
      return
    }

    const fetchData = async () => {
      try {
        // Fetch stats
        const { data: usersData } = await supabase.from("users").select("*")
        const { data: projectsData } = await supabase.from("projects").select("*")
        const { data: investmentsData } = await supabase.from("investments").select("*")

        // Calculate fund stats
        let fundIn = 0
        let fundOut = 0
        let fundInvested = 0

        if (investmentsData) {
          investmentsData.forEach((inv) => {
            if (inv.type === "deposit") fundIn += inv.amount
            if (inv.type === "withdrawal") fundOut += inv.amount
            if (inv.type === "investment") fundInvested += inv.amount
          })
        }

        setStats({
          totalUsers: usersData?.length || 0,
          totalProjects: projectsData?.length || 0,
          totalInvestments: investmentsData?.filter((inv) => inv.type === "investment")?.length || 0,
          fundTotal: fundIn - fundOut,
          fundIn,
          fundOut,
          fundInvested,
          fundAvailable: fundIn - fundOut - fundInvested,
        })

        setUsers(usersData || [])
        setProjects(projectsData || [])
        setInvestments(investmentsData || [])
      } catch (error) {
        console.error("Error fetching admin data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [user, userRole, router])

  const filteredUsers = users.filter(
    (user) =>
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredProjects = projects.filter(
    (project) =>
      project.project_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.owner_name?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredInvestments = investments.filter(
    (inv) =>
      inv.project_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.investor_name?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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
            <h1 className="text-3xl font-bold tracking-tighter">{t("admin-dashboard")}</h1>
            <p className="text-muted-foreground">مرحباً بك في لوحة تحكم مدير النظام</p>
          </div>
        </div>
      </section>

      <section className="w-full py-6">
        <div className="container px-4 md:px-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium">{t("total-users")}</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">مستخدم مسجل في المنصة</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium">{t("total-projects")}</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalProjects}</div>
                <p className="text-xs text-muted-foreground">مشروع تم تقديمه</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium">{t("total-investments")}</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalInvestments}</div>
                <p className="text-xs text-muted-foreground">استثمار تم إجراؤه</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium">{t("fund-available")}</CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.fundAvailable.toLocaleString()} دج</div>
                <p className="text-xs text-muted-foreground">رصيد متاح في صندوق الاستثمار</p>
              </CardContent>
            </Card>
          </div>

          {/* Investment Fund Card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{t("investment-fund")}</CardTitle>
              <CardDescription>إحصائيات صندوق الاستثمار</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">{t("total-fund")}</p>
                  <p className="text-2xl font-bold">{stats.fundTotal.toLocaleString()} دج</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">{t("fund-in")}</p>
                  <p className="text-2xl font-bold text-green-600">{stats.fundIn.toLocaleString()} دج</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">{t("fund-out")}</p>
                  <p className="text-2xl font-bold text-red-600">{stats.fundOut.toLocaleString()} دج</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">{t("fund-invested")}</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.fundInvested.toLocaleString()} دج</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">{t("fund-available")}</p>
                  <p className="text-2xl font-bold text-primary">{stats.fundAvailable.toLocaleString()} دج</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Tabs */}
          <Tabs defaultValue="users">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>{t("manage-users")}</span>
              </TabsTrigger>
              <TabsTrigger value="projects" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>{t("manage-projects")}</span>
              </TabsTrigger>
              <TabsTrigger value="investments" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                <span>{t("manage-investments")}</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span>{t("system-settings")}</span>
              </TabsTrigger>
            </TabsList>

            {/* Users Tab */}
            <TabsContent value="users" className="space-y-4 mt-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">{t("user-management")}</h2>
                <div className="relative w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="بحث عن مستخدم..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-right p-3">{t("user-id")}</th>
                          <th className="text-right p-3">{t("user-name")}</th>
                          <th className="text-right p-3">{t("user-email")}</th>
                          <th className="text-right p-3">{t("user-role")}</th>
                          <th className="text-right p-3">{t("user-status")}</th>
                          <th className="text-right p-3">{t("actions")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="text-center p-4 text-muted-foreground">
                              لا توجد نتائج
                            </td>
                          </tr>
                        ) : (
                          filteredUsers.map((user) => (
                            <tr key={user.id} className="border-b hover:bg-muted/50">
                              <td className="p-3">{user.id}</td>
                              <td className="p-3">{user.full_name}</td>
                              <td className="p-3">{user.email}</td>
                              <td className="p-3">
                                {user.role === "admin" && "مدير النظام"}
                                {user.role === "investor" && "مستثمر"}
                                {user.role === "project_owner" && "صاحب مشروع"}
                              </td>
                              <td className="p-3">
                                {user.status === "active" && (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    {t("active")}
                                  </span>
                                )}
                                {user.status === "inactive" && (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                    {t("inactive")}
                                  </span>
                                )}
                                {user.status === "suspended" && (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                    {t("suspended")}
                                  </span>
                                )}
                              </td>
                              <td className="p-3">
                                <div className="flex items-center gap-2">
                                  <Button variant="ghost" size="icon" title={t("edit")}>
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  {user.status === "active" ? (
                                    <Button variant="ghost" size="icon" title={t("suspend")}>
                                      <Ban className="h-4 w-4" />
                                    </Button>
                                  ) : (
                                    <Button variant="ghost" size="icon" title={t("activate")}>
                                      <CheckCircle className="h-4 w-4" />
                                    </Button>
                                  )}
                                  <Button variant="ghost" size="icon" title={t("delete")}>
                                    <Trash className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Projects Tab */}
            <TabsContent value="projects" className="space-y-4 mt-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">{t("manage-projects")}</h2>
                <div className="relative w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="بحث عن مشروع..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-right p-3">معرف المشروع</th>
                          <th className="text-right p-3">اسم المشروع</th>
                          <th className="text-right p-3">صاحب المشروع</th>
                          <th className="text-right p-3">الميزانية المطلوبة</th>
                          <th className="text-right p-3">حالة المشروع</th>
                          <th className="text-right p-3">تاريخ التقديم</th>
                          <th className="text-right p-3">{t("actions")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredProjects.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="text-center p-4 text-muted-foreground">
                              لا توجد نتائج
                            </td>
                          </tr>
                        ) : (
                          filteredProjects.map((project) => (
                            <tr key={project.id} className="border-b hover:bg-muted/50">
                              <td className="p-3">{project.id}</td>
                              <td className="p-3">{project.project_name}</td>
                              <td className="p-3">{project.owner_name}</td>
                              <td className="p-3">{project.required_budget.toLocaleString()} دج</td>
                              <td className="p-3">
                                {project.status === "pending" && (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                    قيد التقييم
                                  </span>
                                )}
                                {project.status === "evaluated" && (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    تم التقييم
                                  </span>
                                )}
                              </td>
                              <td className="p-3">{new Date(project.created_at).toLocaleDateString()}</td>
                              <td className="p-3">
                                <div className="flex items-center gap-2">
                                  <Button variant="ghost" size="icon" title="عرض التفاصيل" asChild>
                                    <Link href={`/projects/${project.id}`}>
                                      <FileText className="h-4 w-4" />
                                    </Link>
                                  </Button>
                                  <Button variant="ghost" size="icon" title={t("edit")}>
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon" title={t("delete")}>
                                    <Trash className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Investments Tab */}
            <TabsContent value="investments" className="space-y-4 mt-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">{t("manage-investments")}</h2>
                <div className="relative w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="بحث عن استثمار..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-right p-3">معرف الاستثمار</th>
                          <th className="text-right p-3">المستثمر</th>
                          <th className="text-right p-3">المشروع</th>
                          <th className="text-right p-3">المبلغ</th>
                          <th className="text-right p-3">النوع</th>
                          <th className="text-right p-3">الحالة</th>
                          <th className="text-right p-3">التاريخ</th>
                          <th className="text-right p-3">{t("actions")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredInvestments.length === 0 ? (
                          <tr>
                            <td colSpan={8} className="text-center p-4 text-muted-foreground">
                              لا توجد نتائج
                            </td>
                          </tr>
                        ) : (
                          filteredInvestments.map((inv) => (
                            <tr key={inv.id} className="border-b hover:bg-muted/50">
                              <td className="p-3">{inv.id}</td>
                              <td className="p-3">{inv.investor_name}</td>
                              <td className="p-3">{inv.project_name || "-"}</td>
                              <td className="p-3">{inv.amount.toLocaleString()} دج</td>
                              <td className="p-3">
                                {inv.type === "deposit" && "إيداع"}
                                {inv.type === "withdrawal" && "سحب"}
                                {inv.type === "investment" && "استثمار"}
                              </td>
                              <td className="p-3">
                                {inv.status === "completed" && (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    {t("completed")}
                                  </span>
                                )}
                                {inv.status === "pending" && (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                    {t("pending")}
                                  </span>
                                )}
                                {inv.status === "failed" && (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                    {t("failed")}
                                  </span>
                                )}
                              </td>
                              <td className="p-3">{new Date(inv.created_at).toLocaleDateString()}</td>
                              <td className="p-3">
                                <div className="flex items-center gap-2">
                                  <Button variant="ghost" size="icon" title={t("edit")}>
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon" title={t("delete")}>
                                    <Trash className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t("system-settings")}</CardTitle>
                  <CardDescription>إعدادات النظام الأساسية</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">اسم المنصة</label>
                    <Input defaultValue="منصة برقان" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">البريد الإلكتروني للتواصل</label>
                    <Input defaultValue="info@bergane.dz" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">الحد الأدنى للاستثمار</label>
                    <Input defaultValue="10000" type="number" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">رسوم المنصة (%)</label>
                    <Input defaultValue="5" type="number" />
                  </div>

                  <Button className="mt-4">حفظ الإعدادات</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
}

