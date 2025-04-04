"use client"

import type React from "react"

import { useState } from "react"
import { useLanguage } from "@/context/language-context"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, Loader2, CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { supabase } from "@/lib/supabase"
import { evaluateProject } from "../actions/evaluate-project"

export default function SubmitProjectPage() {
  const { t, dir } = useLanguage()
  const { user } = useAuth()
  const router = useRouter()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!user) {
      router.push("/auth/login")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      // Get form data
      const formData = new FormData(e.currentTarget)
      const projectData = Object.fromEntries(formData.entries())

      // Save project to Supabase
      const { data: project, error: projectError } = await supabase
        .from("projects")
        .insert({
          owner_id: user.id,
          project_name: projectData.projectName as string,
          owner_name: projectData.ownerName as string,
          description: projectData.description as string,
          target_audience: projectData.targetAudience as string,
          main_objectives: projectData.mainObjectives as string,
          required_budget: Number.parseFloat(projectData.requiredBudget as string) || 0,
          current_funding: projectData.currentFunding as string,
          previous_experience: projectData.previousExperience as string,
          timeline: projectData.timeline as string,
          community_impact: projectData.communityImpact as string,
          required_resources: projectData.requiredResources as string,
          anticipated_challenges: projectData.anticipatedChallenges as string,
          sustainability_plan: projectData.sustainabilityPlan as string,
          status: "pending",
        })
        .select()

      if (projectError) {
        throw new Error(projectError.message)
      }

      // Call the evaluation action
      const evaluationResult = await evaluateProject(formData)

      // Save evaluation result to Supabase
      const { error: evaluationError } = await supabase.from("project_evaluations").insert({
        project_id: project[0].id,
        score: evaluationResult.score,
        status: evaluationResult.status,
        criteria: evaluationResult.criteria,
        feedback: evaluationResult.feedback,
        recommendations: evaluationResult.recommendations,
      })

      if (evaluationError) {
        throw new Error(evaluationError.message)
      }

      // Update project status to evaluated
      const { error: updateError } = await supabase
        .from("projects")
        .update({ status: "evaluated" })
        .eq("id", project[0].id)

      if (updateError) {
        throw new Error(updateError.message)
      }

      setIsSuccess(true)

      // Redirect to evaluation page after 2 seconds
      setTimeout(() => {
        router.push(`/projects/${project[0].id}`)
      }, 2000)
    } catch (err: any) {
      console.error("Error submitting project:", err)
      setError(err.message || "An error occurred while submitting your project")
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col" dir={dir}>
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{t("submit-title")}</h1>
              <p className="text-muted-foreground">{t("submit-subtitle")}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <Card className="mx-auto max-w-4xl">
            <CardHeader>
              <CardTitle>{t("submit-title")}</CardTitle>
              <CardDescription>{t("submit-subtitle")}</CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {isSuccess ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="rounded-full bg-green-100 p-3 mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{t("form-success")}</h3>
                  <p className="text-muted-foreground">سيتم تقييم مشروعك وستظهر النتائج قريباً</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="projectName">{t("project-name")}</Label>
                      <Input id="projectName" name="projectName" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ownerName">{t("owner-name")}</Label>
                      <Input id="ownerName" name="ownerName" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">{t("project-description")}</Label>
                    <Textarea id="description" name="description" rows={4} required />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="targetAudience">{t("target-audience")}</Label>
                      <Input id="targetAudience" name="targetAudience" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mainObjectives">{t("main-objectives")}</Label>
                      <Input id="mainObjectives" name="mainObjectives" required />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="requiredBudget">{t("required-budget")}</Label>
                      <Input id="requiredBudget" name="requiredBudget" type="number" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currentFunding">{t("current-funding")}</Label>
                      <Input id="currentFunding" name="currentFunding" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="previousExperience">{t("previous-experience")}</Label>
                    <Select name="previousExperience">
                      <SelectTrigger id="previousExperience">
                        <SelectValue placeholder="اختر مستوى الخبرة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">لا توجد خبرة سابقة</SelectItem>
                        <SelectItem value="beginner">خبرة بسيطة (أقل من سنة)</SelectItem>
                        <SelectItem value="intermediate">خبرة متوسطة (1-3 سنوات)</SelectItem>
                        <SelectItem value="advanced">خبرة متقدمة (أكثر من 3 سنوات)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timeline">{t("timeline")}</Label>
                    <Textarea id="timeline" name="timeline" rows={2} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="communityImpact">{t("community-impact")}</Label>
                    <Textarea id="communityImpact" name="communityImpact" rows={3} required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="requiredResources">{t("required-resources")}</Label>
                    <Textarea id="requiredResources" name="requiredResources" rows={2} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="anticipatedChallenges">{t("anticipated-challenges")}</Label>
                    <Textarea id="anticipatedChallenges" name="anticipatedChallenges" rows={2} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sustainabilityPlan">{t("sustainability-plan")}</Label>
                    <Textarea id="sustainabilityPlan" name="sustainabilityPlan" rows={3} required />
                  </div>

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        جاري التقييم...
                      </>
                    ) : (
                      t("submit-button")
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

