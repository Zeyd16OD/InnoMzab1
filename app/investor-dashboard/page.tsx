"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/context/language-context"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Search, User, Filter } from "lucide-react"
import { supabase, type Project } from "@/lib/supabase"

export default function InvestorDashboardPage() {
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

    if (userRole !== "investor") {
      router.push("/dashboard")
      return
    }

    const fetchProjects = async () => {
      try {
        // Fetch all evaluated projects
        const { data, error } = await supabase
          .from("projects")
          .select("*")
          .eq("status", "evaluated")
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
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{t("investor-dashboard")}</h1>
              <p className="text-muted-foreground">{t("investor-dashboard-subtitle")}</p>
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
                    <Link href="/investor-profile">
                      <User className="mr-2 h-4 w-4" />
                      {t("profile")}
                    </Link>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link href="/browse-projects">
                      <Search className="mr-2 h-4 w-4" />
                      {t("browse-projects")}
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>{t("filters")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>{t("project-status")}</Label>
                    <Select defaultValue="all">
                      <SelectTrigger>
                        <SelectValue placeholder={t("select-status")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t("all-projects")}</SelectItem>
                        <SelectItem value="successful">{t("status-successful")}</SelectItem>
                        <SelectItem value="promising">{t("status-promising")}</SelectItem>
                        <SelectItem value="needs-work">{t("status-needs-work")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>{t("investment-range")}</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input type="number" placeholder={t("min")} />
                      <Input type="number" placeholder={t("max")} />
                    </div>
                  </div>

                  <Button className="w-full">
                    <Filter className="mr-2 h-4 w-4" />
                    {t("apply-filters")}
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle>{t("available-projects")}</CardTitle>
                  <CardDescription>{t("browse-available-projects")}</CardDescription>
                </CardHeader>
                <CardContent>
                  {projects.length === 0 ? (
                    <div className="text-center py-8">
                      <Search className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                      <h3 className="mt-4 text-lg font-medium">{t("no-projects")}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">{t("no-projects-available-description")}</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {projects.map((project) => (
                        <Card key={project.id}>
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-lg">{project.project_name}</CardTitle>
                              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                                {t("evaluated")}
                              </Badge>
                            </div>
                            <CardDescription>
                              {project.owner_name} • {new Date(project.created_at).toLocaleDateString()}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="pb-2">
                            <p className="line-clamp-2 text-sm text-muted-foreground">{project.description}</p>
                            <div className="mt-2 flex items-center">
                              <span className="text-sm font-medium">{t("required-budget")}:</span>
                              <span className="ml-2 text-sm">{project.required_budget} دج</span>
                            </div>
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

// Add missing imports
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

