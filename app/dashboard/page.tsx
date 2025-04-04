"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/context/language-context"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, PlusCircle, FileText, User, Calendar } from "lucide-react"
import { supabase, type Project } from "@/lib/supabase"

export default function DashboardPage() {
  const { t, dir } = useLanguage()
  const { user, userRole } = useAuth()
  const router = useRouter()

  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
      return
    }

    if (userRole !== "project_owner") {
      router.push("/investor-dashboard")
      return
    }

    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .eq("owner_id", user.id)
          .order("created_at", { ascending: false })

        if (error) {
          console.error("Error fetching projects:", error)
          return
        }

        setProjects(data || [])
      } catch (err) {
        console.error("Error fetching projects:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjects()
  }, [user, userRole, router])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
            قيد التقييم
          </Badge>
        )
      case "evaluated":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
            تم التقييم
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
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

  return (
    <div className="flex flex-col" dir={dir}>
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{t("dashboard")}</h1>
              <p className="text-muted-foreground">{t("dashboard-subtitle")}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>{t("quick-links")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link href="/profile">
                      <User className="mr-2 h-4 w-4" />
                      {t("profile")}
                    </Link>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link href="/submit-project">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      {t("submit-project")}
                    </Link>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link href="/meetings">
                      <Calendar className="mr-2 h-4 w-4" />
                      جلسات التوجيه والإرشاد
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>{t("my-projects")}</CardTitle>
                    <CardDescription>{t("manage-your-projects")}</CardDescription>
                  </div>
                  <Button asChild>
                    <Link href="/submit-project">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      {t("create-project")}
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  {projects.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                      <h3 className="mt-4 text-lg font-medium">{t("no-projects")}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">{t("no-projects-description")}</p>
                      <Button className="mt-4" asChild>
                        <Link href="/submit-project">{t("submit-project")}</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {projects.map((project) => (
                        <Card key={project.id}>
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-lg">{project.project_name}</CardTitle>
                              {getStatusBadge(project.status)}
                            </div>
                            <CardDescription>{new Date(project.created_at).toLocaleDateString()}</CardDescription>
                          </CardHeader>
                          <CardContent className="pb-2">
                            <p className="line-clamp-2 text-sm text-muted-foreground">{project.description}</p>
                          </CardContent>
                          <CardFooter>
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/projects/${project.id}`}>{t("view-details")}</Link>
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

