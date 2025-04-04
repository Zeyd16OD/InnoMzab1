"use server"

import { z } from "zod"

// Define the schema for project submission
const projectSchema = z.object({
  projectName: z.string(),
  ownerName: z.string(),
  description: z.string(),
  targetAudience: z.string(),
  mainObjectives: z.string(),
  requiredBudget: z.string(),
  currentFunding: z.string().optional(),
  previousExperience: z.string(),
  timeline: z.string().optional(),
  communityImpact: z.string(),
  requiredResources: z.string().optional(),
  anticipatedChallenges: z.string().optional(),
  sustainabilityPlan: z.string(),
})

// Define the evaluation criteria
const evaluationCriteria = [
  {
    name: "feasibility",
    arabicName: "الجدوى",
    description: "مدى قابلية المشروع للتنفيذ من الناحية التقنية والمالية والتشغيلية",
    weight: 0.25,
  },
  {
    name: "impact",
    arabicName: "التأثير المجتمعي",
    description: "مدى تأثير المشروع على المجتمع المحلي وقدرته على حل مشكلة حقيقية",
    weight: 0.25,
  },
  {
    name: "expertise",
    arabicName: "الخبرة",
    description: "مدى توفر الخبرة والمهارات اللازمة لتنفيذ المشروع",
    weight: 0.15,
  },
  {
    name: "sustainability",
    arabicName: "الاستدامة",
    description: "قدرة المشروع على الاستمرار والنمو على المدى الطويل",
    weight: 0.2,
  },
  {
    name: "clarity",
    arabicName: "وضوح الرؤية",
    description: "مدى وضوح أهداف المشروع وخطة العمل",
    weight: 0.15,
  },
]

// Define the evaluation result type
export type EvaluationResult = {
  projectName: string
  ownerName: string
  score: number
  status: "successful" | "promising" | "needs-work" | "failed"
  criteria: {
    feasibility: number
    impact: number
    expertise: number
    sustainability: number
    clarity: number
  }
  feedback: string
  recommendations: string[]
}

export async function evaluateProject(formData: FormData): Promise<EvaluationResult> {
  // Parse form data
  const rawData: Record<string, string> = {}
  formData.forEach((value, key) => {
    rawData[key] = value.toString()
  })

  try {
    // Validate the data
    const projectData = projectSchema.parse(rawData)

    // Instead of calling the Hugging Face API, we'll generate a mock evaluation
    // based on the project data
    return generateMockEvaluation(projectData)
  } catch (error) {
    console.error("Error evaluating project:", error)
    // Return a default evaluation in case of error
    return generateDefaultEvaluation(rawData.projectName || "المشروع", rawData.ownerName || "صاحب المشروع")
  }
}

// New function to generate a mock evaluation based on the project data
function generateMockEvaluation(projectData: z.infer<typeof projectSchema>): EvaluationResult {
  // Calculate scores based on the content length and some basic heuristics
  const descriptionScore = Math.min(85, 50 + projectData.description.length / 20)
  const impactScore = Math.min(90, 60 + projectData.communityImpact.length / 15)

  // Map previous experience to a score
  let expertiseScore = 70
  if (projectData.previousExperience === "advanced") {
    expertiseScore = 85
  } else if (projectData.previousExperience === "intermediate") {
    expertiseScore = 75
  } else if (projectData.previousExperience === "beginner") {
    expertiseScore = 65
  } else {
    expertiseScore = 55
  }

  // Calculate sustainability score
  const sustainabilityScore = Math.min(85, 55 + projectData.sustainabilityPlan.length / 15)

  // Calculate clarity score based on objectives and timeline
  const clarityScore = Math.min(
    88,
    60 + projectData.mainObjectives.length / 10 + (projectData.timeline?.length || 0) / 20,
  )

  // Calculate overall score with weights
  const overallScore = Math.round(
    descriptionScore * 0.25 +
      impactScore * 0.25 +
      expertiseScore * 0.15 +
      sustainabilityScore * 0.2 +
      clarityScore * 0.15,
  )

  // Determine status based on score
  let status: "successful" | "promising" | "needs-work" | "failed"
  if (overallScore >= 85) {
    status = "successful"
  } else if (overallScore >= 70) {
    status = "promising"
  } else if (overallScore >= 50) {
    status = "needs-work"
  } else {
    status = "failed"
  }

  // Generate feedback based on scores
  let feedback = ""
  if (status === "successful") {
    feedback =
      "المشروع متميز ويظهر إمكانات كبيرة للنجاح. الخطة واضحة ومدروسة جيداً، مع تحديد دقيق للفئة المستهدفة والأهداف. نتوقع أن يكون لهذا المشروع تأثير إيجابي كبير على المجتمع المحلي."
  } else if (status === "promising") {
    feedback =
      "المشروع واعد ويمتلك إمكانات جيدة للنجاح. هناك بعض النقاط التي تحتاج إلى تحسين خاصة في جانب الخبرة والاستدامة. ننصح بتطوير خطة أكثر تفصيلاً للاستدامة المالية على المدى الطويل."
  } else if (status === "needs-work") {
    feedback =
      "المشروع يحتاج إلى مزيد من العمل والتطوير. هناك نقاط قوة في الفكرة الأساسية، لكن الخطة تفتقر إلى التفاصيل الكافية في بعض الجوانب المهمة. ننصح بإعادة النظر في خطة العمل وتطويرها بشكل أكثر تفصيلاً."
  } else {
    feedback =
      "المشروع في وضعه الحالي يواجه تحديات كبيرة قد تعيق نجاحه. نوصي بإعادة تقييم الفكرة الأساسية والبحث عن طرق لتحسين الجدوى والاستدامة."
  }

  // Generate recommendations based on scores
  const recommendations = generateRecommendations(
    descriptionScore,
    impactScore,
    expertiseScore,
    sustainabilityScore,
    clarityScore,
    projectData,
  )

  return {
    projectName: projectData.projectName,
    ownerName: projectData.ownerName,
    score: overallScore,
    status,
    criteria: {
      feasibility: Math.round(descriptionScore),
      impact: Math.round(impactScore),
      expertise: Math.round(expertiseScore),
      sustainability: Math.round(sustainabilityScore),
      clarity: Math.round(clarityScore),
    },
    feedback,
    recommendations,
  }
}

function generateRecommendations(
  feasibilityScore: number,
  impactScore: number,
  expertiseScore: number,
  sustainabilityScore: number,
  clarityScore: number,
  projectData: z.infer<typeof projectSchema>,
): string[] {
  const recommendations: string[] = []

  // Add recommendations based on low scores
  if (feasibilityScore < 70) {
    recommendations.push("إجراء دراسة جدوى أكثر تفصيلاً للمشروع")
    recommendations.push("تحديد المتطلبات المالية والتقنية بشكل أكثر دقة")
  }

  if (impactScore < 70) {
    recommendations.push("توضيح التأثير المجتمعي للمشروع بشكل أكثر تفصيلاً")
    recommendations.push("تحديد مؤشرات قياس الأثر الاجتماعي والاقتصادي")
  }

  if (expertiseScore < 70) {
    recommendations.push("تعزيز فريق العمل بخبرات إضافية في المجال")
    recommendations.push("البحث عن مرشدين ومستشارين متخصصين")
  }

  if (sustainabilityScore < 70) {
    recommendations.push("تطوير خطة استدامة مالية أكثر تفصيلاً")
    recommendations.push("تنويع مصادر الدخل للمشروع")
  }

  if (clarityScore < 70) {
    recommendations.push("تحديد الأهداف بشكل أكثر وضوحاً وقابلية للقياس")
    recommendations.push("وضع جدول زمني تفصيلي لمراحل تنفيذ المشروع")
  }

  // Add general recommendations
  recommendations.push("دراسة المنافسين بشكل أكثر تفصيلاً")
  recommendations.push("تطوير استراتيجية تسويقية متكاملة")

  // If budget is high, add financial recommendation
  if (Number.parseInt(projectData.requiredBudget) > 1000000) {
    recommendations.push("البحث عن شراكات استراتيجية لتقليل التكاليف الأولية")
  }

  // Limit to 5 recommendations
  return recommendations.slice(0, 5)
}

function generateDefaultAIResponse(): string {
  return `
الجدوى: 70
التأثير المجتمعي: 75
الخبرة: 65
الاستدامة: 70
وضوح الرؤية: 80
الدرجة الإجمالية: 72
التعليق: المشروع واعد ويمتلك إمكانات جيدة للنجاح. هناك بعض النقاط التي تحتاج إلى تحسين خاصة في جانب الخبرة والاستدامة. ننصح بتطوير خطة أكثر تفصيلاً للاستدامة المالية على المدى الطويل.
التوصيات:
- تطوير خطة تسويقية أكثر تفصيلاً
- البحث عن شركاء استراتيجيين في المجال
- تعزيز فريق العمل بخبرات إضافية
- دراسة المنافسين بشكل أكثر تفصيلاً
- وضع مؤشرات أداء واضحة لقياس نجاح المشروع
`
}

function generateDefaultRecommendations(status: string): string[] {
  switch (status) {
    case "successful":
      return [
        "التركيز على استراتيجية النمو والتوسع",
        "بناء شراكات استراتيجية لتعزيز المشروع",
        "تطوير خطة تسويقية متكاملة",
        "الاستثمار في تدريب وتطوير الفريق",
      ]
    case "promising":
      return [
        "تطوير خطة تسويقية أكثر تفصيلاً",
        "البحث عن شركاء استراتيجيين في المجال",
        "تعزيز فريق العمل بخبرات إضافية",
        "دراسة المنافسين بشكل أكثر تفصيلاً",
      ]
    case "needs-work":
      return [
        "إعادة صياغة أهداف المشروع بشكل أكثر وضوحاً",
        "تطوير خطة مالية أكثر واقعية",
        "البحث عن مرشدين ومستشارين في المجال",
        "التركيز على حل مشكلة محددة بدلاً من تشتيت الجهود",
      ]
    case "failed":
      return [
        "إعادة تقييم جدوى المشروع بشكل شامل",
        "التركيز على مشكلة أكثر إلحاحاً في السوق",
        "بناء فريق عمل متكامل المهارات",
        "البحث عن نماذج أعمال بديلة",
      ]
    default:
      return [
        "تطوير خطة عمل أكثر تفصيلاً",
        "تحديد الأهداف بشكل أكثر وضوحاً",
        "دراسة السوق والمنافسين",
        "بناء فريق عمل متكامل المهارات",
      ]
  }
}

function generateDefaultEvaluation(projectName: string, ownerName: string): EvaluationResult {
  return {
    projectName,
    ownerName,
    score: 72,
    status: "promising",
    criteria: {
      feasibility: 70,
      impact: 75,
      expertise: 65,
      sustainability: 70,
      clarity: 80,
    },
    feedback:
      "المشروع واعد ويمتلك إمكانات جيدة للنجاح. هناك بعض النقاط التي تحتاج إلى تحسين خاصة في جانب الخبرة والاستدامة. ننصح بتطوير خطة أكثر تفصيلاً للاستدامة المالية على المدى الطويل.",
    recommendations: [
      "تطوير خطة تسويقية أكثر تفصيلاً",
      "البحث عن شركاء استراتيجيين في المجال",
      "تعزيز فريق العمل بخبرات إضافية",
      "دراسة المنافسين بشكل أكثر تفصيلاً",
      "وضع مؤشرات أداء واضحة لقياس نجاح المشروع",
    ],
  }
}

