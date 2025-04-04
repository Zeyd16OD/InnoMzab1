"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/context/language-context"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, AlertCircle, Info, Loader2, ArrowLeft, Mail } from "lucide-react"
import { supabase, type Project, type ProjectEvaluation } from "@/lib/supabase"

export default function ProjectDetailsPage({ params }: { params: { id: string } }) {
  const { t, dir } = useLanguage()
  const { user, userRole } = useAuth()
  const router = useRouter()

  const [project, setProject] = useState<Project | null>(null)
  const [evaluation, setEvaluation] = useState<ProjectEvaluation | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
      return
    }

    const fetchProjectDetails = async () => {
      try {
        // Fetch project
        const { data: projectData, error: projectError } = await supabase
          .from("projects")
          .select("*")
          .eq("id", params.id)
          .single()

        if (projectError) {
          throw new Error(projectError.message)
        }

        // Check if user has access to this project
        if (userRole === "project_owner" && projectData.owner_id !== user.id) {
          throw new Error("You do not have permission to view this project")
        }

        setProject(projectData)

        // Fetch evaluation if project is evaluated
        if (projectData.status === "evaluated") {
          const { data: evaluationData, error: evaluationError } = await supabase
            .from("project_evaluations")
            .select("*")
            .eq("project_id", params.id)
            .single()

          if (evaluationError && evaluationError.code !== "PGRST116") {
            throw new Error(evaluationError.message)
          }

          setEvaluation(evaluationData)
        }
      } catch (err: any) {
        console.error("Error fetching project details:", err)
        setError(err.message || "An error occurred while fetching project details")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjectDetails()
  }, [user, userRole, params.id, router])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "successful":
        return "bg-green-500"
      case "promising":
        return "bg-blue-500"
      case "needs-work":
        return "bg-yellow-500"
      case "failed":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "successful":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "promising":
        return <Info className="h-5 w-5 text-blue-500" />
      case "needs-work":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case "failed":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return null
    }
  }

  const getStatusLabel = (status: string) => {
    return t(`status-${status}`)
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4">{t("loading")}</p>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <AlertCircle className="h-8 w-8 text-red-500" />
        <p className="mt-4">{error || t("project-not-found")}</p>
        <Button className="mt-4" variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("go-back")}
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col" dir={dir}>
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{project.project_name}</h1>
              <p className="text-muted-foreground">
                {t("submitted-by")}: {project.owner_name}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>{t("project-details")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">{t("project-description")}</h3>
                    <p className="text-muted-foreground">{project.description}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-md font-medium mb-1">{t("target-audience")}</h3>
                      <p className="text-sm text-muted-foreground">{project.target_audience}</p>
                    </div>
                    <div>
                      <h3 className="text-md font-medium mb-1">{t("main-objectives")}</h3>
                      <p className="text-sm text-muted-foreground">{project.main_objectives}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-md font-medium mb-1">{t("required-budget")}</h3>
                      <p className="text-sm text-muted-foreground">{project.required_budget} دج</p>
                    </div>
                    <div>
                      <h3 className="text-md font-medium mb-1">{t("current-funding")}</h3>
                      <p className="text-sm text-muted-foreground">{project.current_funding || t("not-specified")}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-md font-medium mb-1">{t("previous-experience")}</h3>
                    <p className="text-sm text-muted-foreground">{project.previous_experience}</p>
                  </div>

                  <div>
                    <h3 className="text-md font-medium mb-1">{t("timeline")}</h3>
                    <p className="text-sm text-muted-foreground">{project.timeline || t("not-specified")}</p>
                  </div>

                  <div>
                    <h3 className="text-md font-medium mb-1">{t("community-impact")}</h3>
                    <p className="text-sm text-muted-foreground">{project.community_impact}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-md font-medium mb-1">{t("required-resources")}</h3>
                      <p className="text-sm text-muted-foreground">
                        {project.required_resources || t("not-specified")}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-md font-medium mb-1">{t("anticipated-challenges")}</h3>
                      <p className="text-sm text-muted-foreground">
                        {project.anticipated_challenges || t("not-specified")}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-md font-medium mb-1">{t("sustainability-plan")}</h3>
                    <p className="text-sm text-muted-foreground">{project.sustainability_plan}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>{t("project-status")}</CardTitle>
                </CardHeader>
                <CardContent>
                  {project.status === "pending" ? (
                    <div className="text-center py-8">
                      <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                      <p className="mt-4">{t("evaluation-in-progress")}</p>
                    </div>
                  ) : evaluation ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(evaluation.status)}
                        <Badge variant="outline" className={`${getStatusColor(evaluation.status)} text-white`}>
                          {getStatusLabel(evaluation.status)}
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{t("project-score")}</span>
                          <span className="font-bold">{evaluation.score}/100</span>
                        </div>
                        <Progress value={evaluation.score} className="h-2" />
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <h3 className="text-md font-medium">{t("evaluation-criteria")}</h3>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">{t("criteria-feasibility")}</span>
                            <span className="text-sm font-medium">{evaluation.criteria.feasibility}%</span>
                          </div>
                          <Progress value={evaluation.criteria.feasibility} className="h-1" />
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">{t("criteria-impact")}</span>
                            <span className="text-sm font-medium">{evaluation.criteria.impact}%</span>
                          </div>
                          <Progress value={evaluation.criteria.impact} className="h-1" />
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">{t("criteria-expertise")}</span>
                            <span className="text-sm font-medium">{evaluation.criteria.expertise}%</span>
                          </div>
                          <Progress value={evaluation.criteria.expertise} className="h-1" />
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">{t("criteria-sustainability")}</span>
                            <span className="text-sm font-medium">{evaluation.criteria.sustainability}%</span>
                          </div>
                          <Progress value={evaluation.criteria.sustainability} className="h-1" />
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">{t("criteria-clarity")}</span>
                            <span className="text-sm font-medium">{evaluation.criteria.clarity}%</span>
                          </div>
                          <Progress value={evaluation.criteria.clarity} className="h-1" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <AlertCircle className="mx-auto h-8 w-8 text-yellow-500" />
                      <p className="mt-4">{t("no-evaluation-available")}</p>
                    </div>
                  )}
                </CardContent>

                {userRole === "investor" && (
                  <CardFooter>
                    <Button className="w-full">
                      <Mail className="mr-2 h-4 w-4" />
                      {t("contact-project-owner")}
                    </Button>
                  </CardFooter>
                )}
              </Card>

              {evaluation && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>{t("feedback-title")}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{evaluation.feedback}</p>

                    <div className="space-y-2">
                      <h3 className="text-md font-medium">{t("recommendations")}</h3>
                      <ul className="list-disc list-inside space-y-1">
                        {evaluation.recommendations.map((recommendation, index) => (
                          <li key={index} className="text-sm text-muted-foreground">
                            {recommendation}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          <div className="mt-6">
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("go-back")}
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

