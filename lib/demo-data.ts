// Template data for demonstration purposes

// Project Owner Data
export const projectOwnerTemplate = {
  id: "po-123456",
  name: "أحمد محمد",
  email: "ahmed@example.com",
  phone: "+213 555 123 456",
  role: "project_owner",
  profileImage: "/images/demo/ahmed-profile.jpg",
  bio: "رائد أعمال شاب من مزاب، متخصص في مجال التكنولوجيا والابتكار. حاصل على شهادة في هندسة البرمجيات وخبرة 5 سنوات في تطوير التطبيقات.",
  projects: [
    {
      id: "proj-1",
      title: "منصة تعليمية رقمية",
      description:
        "منصة تعليمية متكاملة تستهدف طلاب المدارس والجامعات في مزاب، توفر محتوى تعليمي تفاعلي باللغة العربية.",
      category: "تكنولوجيا التعليم",
      fundingRequired: 500000,
      fundingReceived: 150000,
      status: "active",
      createdAt: "2023-09-15",
      evaluationScore: 85,
      thumbnail: "/images/demo/education-platform.jpg",
      pitchDeck: "/files/demo/education-platform-pitch.pdf",
      businessPlan: {
        executiveSummary: "منصة تعليمية رقمية تهدف إلى تحسين جودة التعليم في مزاب من خلال توفير محتوى تعليمي تفاعلي.",
        marketAnalysis: "سوق التعليم الرقمي في الجزائر ينمو بنسبة 25% سنويًا، مع وجود أكثر من 500,000 طالب في المنطقة.",
        competitiveAdvantage: "محتوى مخصص باللغة العربية، تركيز على المناهج المحلية، تقنيات تعلم تفاعلية متقدمة.",
        financialProjections: {
          year1: { revenue: 200000, expenses: 150000, profit: 50000 },
          year2: { revenue: 450000, expenses: 250000, profit: 200000 },
          year3: { revenue: 800000, expenses: 400000, profit: 400000 },
        },
        implementationPlan:
          "إطلاق النسخة التجريبية خلال 3 أشهر، التوسع إلى 10 مدارس خلال السنة الأولى، تغطية كامل المنطقة خلال 3 سنوات.",
      },
    },
    {
      id: "proj-2",
      title: "تطبيق توصيل المنتجات المحلية",
      description:
        "تطبيق يربط المنتجين المحليين في مزاب بالمستهلكين مباشرة، مما يدعم الاقتصاد المحلي ويوفر منتجات طازجة.",
      category: "التجارة الإلكترونية",
      fundingRequired: 300000,
      fundingReceived: 50000,
      status: "pending_evaluation",
      createdAt: "2024-01-10",
      evaluationScore: null,
      thumbnail: "/images/demo/local-delivery.jpg",
    },
  ],
  meetings: [
    {
      id: "meet-1",
      title: "جلسة استشارية حول خطة التسويق",
      date: "2024-04-15T14:00:00",
      duration: 60, // minutes
      mentor: "سمير عبد الله",
      status: "upcoming",
    },
    {
      id: "meet-2",
      title: "مراجعة خطة العمل",
      date: "2024-03-20T10:00:00",
      duration: 45, // minutes
      mentor: "ليلى أحمد",
      status: "completed",
      notes: "تم مناقشة استراتيجية التوسع وتحديد نقاط القوة والضعف في خطة العمل.",
    },
  ],
}

// Investor Data
export const investorTemplate = {
  id: "inv-789012",
  name: "محمد علي",
  email: "mohamed@example.com",
  phone: "+213 555 789 012",
  role: "investor",
  profileImage: "/images/demo/mohamed-profile.jpg",
  bio: "مستثمر ورجل أعمال من مزاب، متخصص في دعم المشاريع الناشئة في مجالات التكنولوجيا والتعليم والصناعات التقليدية.",
  investmentPreferences: {
    sectors: ["تكنولوجيا", "تعليم", "صناعات تقليدية", "زراعة"],
    minInvestment: 50000,
    maxInvestment: 1000000,
    stagePreference: ["seed", "early", "growth"],
    geographicFocus: ["مزاب", "الجزائر"],
  },
  wallet: {
    balance: 2500000,
    transactions: [
      {
        id: "trans-1",
        type: "deposit",
        amount: 1000000,
        date: "2023-12-01T09:30:00",
        status: "completed",
      },
      {
        id: "trans-2",
        type: "investment",
        amount: 150000,
        projectId: "proj-1",
        projectTitle: "منصة تعليمية رقمية",
        date: "2024-01-15T14:20:00",
        status: "completed",
      },
      {
        id: "trans-3",
        type: "deposit",
        amount: 1650000,
        date: "2024-02-10T11:15:00",
        status: "completed",
      },
    ],
  },
  investments: [
    {
      id: "inv-1",
      projectId: "proj-1",
      projectTitle: "منصة تعليمية رقمية",
      amount: 150000,
      equity: 5, // percentage
      date: "2024-01-15T14:20:00",
      status: "active",
      returns: null, // not yet realized
      projectOwner: "أحمد محمد",
      projectCategory: "تكنولوجيا التعليم",
    },
  ],
  savedProjects: [
    {
      id: "proj-3",
      title: "مصنع صغير للمنتجات التقليدية",
      description: "مصنع لإنتاج وتسويق المنتجات التقليدية لمنطقة مزاب، مع التركيز على الجودة والأصالة.",
      category: "الصناعات التقليدية",
      fundingRequired: 450000,
      evaluationScore: 78,
      thumbnail: "/images/demo/traditional-factory.jpg",
    },
    {
      id: "proj-4",
      title: "مزرعة ذكية للزراعة المستدامة",
      description: "مشروع زراعي يستخدم التكنولوجيا الحديثة لتحسين الإنتاج الزراعي وترشيد استهلاك المياه.",
      category: "الزراعة",
      fundingRequired: 700000,
      evaluationScore: 92,
      thumbnail: "/images/demo/smart-farm.jpg",
    },
  ],
}

// Project Evaluation Template
export const projectEvaluationTemplate = {
  projectId: "proj-1",
  evaluator: "خبير التقييم",
  date: "2023-10-05",
  overallScore: 85,
  categories: [
    {
      name: "الجدوى الاقتصادية",
      score: 82,
      comments: "المشروع يظهر إمكانية تحقيق عائد جيد على الاستثمار، مع خطة مالية واقعية.",
    },
    {
      name: "الابتكار والتميز",
      score: 90,
      comments: "فكرة مبتكرة تلبي احتياجًا حقيقيًا في السوق المحلي، مع ميزات تنافسية واضحة.",
    },
    {
      name: "قابلية التنفيذ",
      score: 85,
      comments: "الفريق يمتلك المهارات اللازمة، والخطة التنفيذية واضحة ومفصلة.",
    },
    {
      name: "التأثير الاجتماعي",
      score: 88,
      comments: "المشروع سيساهم في تحسين جودة التعليم في المنطقة وخلق فرص عمل جديدة.",
    },
    {
      name: "استدامة المشروع",
      score: 80,
      comments: "نموذج العمل قابل للاستمرار، مع إمكانية التوسع مستقبلاً.",
    },
  ],
  recommendations:
    "المشروع واعد ويستحق الاستثمار. نوصي بالتركيز على استراتيجية التسويق وتوسيع قاعدة المستخدمين في المراحل الأولى.",
}

