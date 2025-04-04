"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/context/language-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, AlertCircle, Info, Loader2 } from "lucide-react"
import type { EvaluationResult } from "../actions/evaluate-project"

export default function EvaluationPage() {
  const { t, dir } = useLanguage()
  const [evaluationData, setEvaluationData] = useState<EvaluationResult | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get evaluation result from localStorage
    const storedEvaluation = localStorage.getItem("evaluationResult")

    if (storedEvaluation) {
      try {
        const parsedEvaluation = JSON.parse(storedEvaluation)
        setEvaluationData(parsedEvaluation)
      } catch (error) {
        console.error("Error parsing evaluation data:", error)
        // Use mock data if parsing fails
        setEvaluationData(getMockEvaluationData())
      }
    } else {
      // Use mock data if no stored evaluation
      setEvaluationData(getMockEvaluationData())
    }

    setLoading(false)
  }, [])

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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4">جاري تحميل نتائج التقييم...</p>
      </div>
    )
  }

  if (!evaluationData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <AlertCircle className="h-8 w-8 text-red-500" />
        <p className="mt-4">لم يتم العثور على نتائج تقييم. يرجى تقديم مشروعك أولاً.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col" dir={dir}>
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{t("evaluation-title")}</h1>
              <p className="text-muted-foreground">{t("evaluation-subtitle")}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <Card className="mx-auto max-w-4xl">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl">{evaluationData.projectName}</CardTitle>
                  <CardDescription>{evaluationData.ownerName}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(evaluationData.status)}
                  <Badge variant="outline" className={`${getStatusColor(evaluationData.status)} text-white`}>
                    {getStatusLabel(evaluationData.status)}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <h3 className="text-lg font-semibold">{t("project-score")}</h3>
                  <div className="text-2xl font-bold">{evaluationData.score}/100</div>
                </div>
                <Progress value={evaluationData.score} className="h-3" />
              </div>

              <Tabs defaultValue="criteria">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="criteria">معايير التقييم</TabsTrigger>
                  <TabsTrigger value="feedback">التعليقات والتوصيات</TabsTrigger>
                </TabsList>
                <TabsContent value="criteria" className="space-y-6 pt-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>{t("criteria-feasibility")}</span>
                      <span className="font-semibold">{evaluationData.criteria.feasibility}%</span>
                    </div>
                    <Progress value={evaluationData.criteria.feasibility} className="h-2" />
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>{t("criteria-impact")}</span>
                      <span className="font-semibold">{evaluationData.criteria.impact}%</span>
                    </div>
                    <Progress value={evaluationData.criteria.impact} className="h-2" />
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>{t("criteria-expertise")}</span>
                      <span className="font-semibold">{evaluationData.criteria.expertise}%</span>
                    </div>
                    <Progress value={evaluationData.criteria.expertise} className="h-2" />
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>{t("criteria-sustainability")}</span>
                      <span className="font-semibold">{evaluationData.criteria.sustainability}%</span>
                    </div>
                    <Progress value={evaluationData.criteria.sustainability} className="h-2" />
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>{t("criteria-clarity")}</span>
                      <span className="font-semibold">{evaluationData.criteria.clarity}%</span>
                    </div>
                    <Progress value={evaluationData.criteria.clarity} className="h-2" />
                  </div>
                </TabsContent>
                <TabsContent value="feedback" className="space-y-6 pt-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{t("feedback-title")}</h3>
                    <p className="text-muted-foreground">{evaluationData.feedback}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">التوصيات</h3>
                    <ul className="list-disc list-inside space-y-2">
                      {evaluationData.recommendations.map((recommendation, index) => (
                        <li key={index} className="text-muted-foreground">
                          {recommendation}
                        </li>
                      ))}
                    </ul>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

// Mock evaluation data for testing or when no real evaluation is available
function getMockEvaluationData(): EvaluationResult {
  return {
    projectName: "مشروع تطوير تطبيق للتجارة الإلكترونية",
    ownerName: "محمد أحمد",
    score: 78,
    status: "promising",
    criteria: {
      feasibility: 80,
      impact: 85,
      expertise: 65,
      sustainability: 75,
      clarity: 85,
    },
    feedback:
      "المشروع واعد ويمتلك إمكانات كبيرة للنجاح. هناك بعض النقاط التي تحتاج إلى تحسين خاصة في جانب الخبرة والاستدامة. ننصح بتطوير خطة أكثر تفصيلاً للاستدامة المالية على المدى الطويل وتعزيز فريق العمل بخبرات إضافية في مجال التجارة الإلكترونية.",
    recommendations: [
      "تطوير خطة تسويقية أكثر تفصيلاً",
      "البحث عن شركاء استراتيجيين في مجال التكنولوجيا",
      "تعزيز فريق العمل بخبرات إضافية",
      "دراسة المنافسين بشكل أكثر تفصيلاً",
      "وضع مؤشرات أداء واضحة لقياس نجاح المشروع",
    ],
  }
}

