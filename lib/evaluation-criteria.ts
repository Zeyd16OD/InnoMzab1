export const evaluationCriteria = [
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

export const getStatusLabel = (status: string, language = "ar"): string => {
  const statusLabels = {
    ar: {
      successful: "مشروع ناجح",
      promising: "مشروع واعد",
      "needs-work": "يحتاج إلى تحسين",
      failed: "مشروع غير مجدي",
    },
    en: {
      successful: "Successful Project",
      promising: "Promising Project",
      "needs-work": "Needs Improvement",
      failed: "Unfeasible Project",
    },
    fr: {
      successful: "Projet Réussi",
      promising: "Projet Prometteur",
      "needs-work": "Nécessite des Améliorations",
      failed: "Projet Non Viable",
    },
  }

  return statusLabels[language as keyof typeof statusLabels]?.[status as keyof typeof statusLabels.ar] || status
}

