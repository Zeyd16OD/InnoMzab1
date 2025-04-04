"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/context/language-context"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Search, Filter } from "lucide-react"
import { supabase, type Project, type ProjectEvaluation } from "@/lib/supabase"

type ProjectWithEvaluation = Project & {
  evaluation: ProjectEvaluation | null
}

export default function BrowseProjectsPage() {
  const { t, dir } = useLanguage()
  const { user, userRole } = useAuth()
  const router = useRouter()

  const [projects, setProjects] = useState<ProjectWithEvaluation[]>([])
  const [filteredProjects, setFilteredProjects] = useState<ProjectWithEvaluation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [budgetMin, setBudgetMin] = useState<number | null>(null)
  const [budgetMax, setBudgetMax] = useState<number | null>(null)

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
        const { data: projectsData, error: projectsError } = await supabase
          .from("projects")
          .select("*")
          .eq("status", "evaluated")
          .order("created_at", { ascending: false })

        if (projectsError) {
          console.error("Error fetching projects:", projectsError)
          setIsLoading(false)
          return
        }

        // Fetch evaluations for all projects
        const { data: evaluationsData, error: evaluationsError } = await supabase
          .from("project_evaluations")
          .select("*")

        if (evaluationsError) {
          console.error("Error fetching evaluations:", evaluationsError)
          setIsLoading(false)
          return
        }

        // Combine projects with their evaluations
        const projectsWithEvaluations = projectsData.map((project) => {
          const evaluation = evaluationsData.find((evale) => evale.project_id === project.id) || null
          return { ...project, evaluation }
        })

        setProjects(projectsWithEvaluations)
        setFilteredProjects(projectsWithEvaluations)
      } catch (err) {
        console.error("Error fetching projects:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjects()
  }, [user, userRole, router])

  useEffect(() => {
    // Apply filters
    let filtered = [...projects]

    // Apply search term
    if (searchTerm) {
      filtered = filtered.filter(
        (project) =>
          project.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((project) => project.evaluation && project.evaluation.status === statusFilter)
    }

    // Apply budget filters
    if (budgetMin !== null) {
      filtered = filtered.filter((project) => project.required_budget >= budgetMin)
    }

    if (budgetMax !== null) {
      filtered = filtered.filter((project) => project.required_budget <= budgetMax)
    }

    setFilteredProjects(filtered)
  }, [searchTerm, statusFilter, budgetMin, budgetMax, projects])

  const handleApplyFilters = () => {
    // Filters are already applied in the useEffect
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "successful":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
            {t("status-successful")}
          </Badge>
        )
      case "promising":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
            {t("status-promising")}
          </Badge>
        )
      case "needs-work":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
            {t("status-needs-work")}
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
            {t("status-failed")}
          </Badge>
        )
      default:
        return <Badge variant="outline">{t("evaluated")}</Badge>
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
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{t("browse-projects")}</h1>
              <p className="text-muted-foreground">{t("browse-projects-subtitle")}</p>
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
                  <CardTitle>{t("filters")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="search">{t("search")}</Label>
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="search"
                        type="search"
                        placeholder={t("search-projects")}
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">{t("project-status")}</Label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger id="status">
                        <SelectValue placeholder={t("select-status")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t("all-projects")}</SelectItem>
                        <SelectItem value="successful">{t("status-successful")}</SelectItem>
                        <SelectItem value="promising">{t("status-promising")}</SelectItem>
                        <SelectItem value="needs-work">{t("status-needs-work")}</SelectItem>
                        <SelectItem value="failed">{t("status-failed")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>{t("investment-range")}</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="number"
                        placeholder={t("min")}
                        onChange={(e) => setBudgetMin(e.target.value ? Number.parseFloat(e.target.value) : null)}
                      />
                      <Input
                        type="number"
                        placeholder={t("max")}
                        onChange={(e) => setBudgetMax(e.target.value ? Number.parseFloat(e.target.value) : null)}
                      />
                    </div>
                  </div>

                  <Button className="w-full" onClick={handleApplyFilters}>
                    <Filter className="mr-2 h-4 w-4" />
                    {t("apply-filters")}
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-3">
              <Card>
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <CardTitle>{t("available-projects")}</CardTitle>
                      <CardDescription>
                        {filteredProjects.length} {t("projects-found")}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {filteredProjects.length === 0 ? (
                    <div className="text-center py-8">
                      <Search className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                      <h3 className="mt-4 text-lg font-medium">{t("no-projects-found")}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">{t("try-different-filters")}</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredProjects.map((project) => (
                        <Card key={project.id}>
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-lg">{project.project_name}</CardTitle>
                              {project.evaluation && getStatusBadge(project.evaluation.status)}
                            </div>
                            <CardDescription>
                              {project.owner_name} • {new Date(project.created_at).toLocaleDateString()}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="pb-2">
                            <p className="line-clamp-2 text-sm text-muted-foreground">{project.description}</p>
                            <div className="mt-2 flex flex-wrap gap-4">
                              <div className="flex items-center">
                                <span className="text-sm font-medium">{t("required-budget")}:</span>
                                <span className="ml-2 text-sm">{project.required_budget} دج</span>
                              </div>
                              {project.evaluation && (
                                <div className="flex items-center">
                                  <span className="text-sm font-medium">{t("project-score")}:</span>
                                  <span className="ml-2 text-sm">{project.evaluation.score}/100</span>
                                </div>
                              )}
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

