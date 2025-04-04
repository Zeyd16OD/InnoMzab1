"use client"

import { createContext, useContext, type ReactNode } from "react"

interface LanguageContextType {
  t: (key: string) => string
  dir: string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// قاموس الترجمة باللغة العربية فقط
const translations: Record<string, string> = {
  // الصفحة الرئيسية
  "hero-title": "منصة برقان لدعم الشباب والشركات الناشئة",
  "hero-subtitle": "نربط بين أصحاب المشاريع والمستثمرين لخلق فرص نجاح حقيقية",
  "hero-description":
    "منصة متكاملة تساعد الشباب وأصحاب المشاريع الناشئة على تقديم أفكارهم وتقييمها والحصول على التمويل المناسب من المستثمرين المهتمين",
  "get-started": "ابدأ الآن",
  "learn-more": "اعرف المزيد",

  // التحديات
  "challenges-title": "التحديات التي نعالجها",
  "challenge-1": "صعوبة الوصول إلى التمويل",
  "challenge-2": "نقص الخبرة والتوجيه",
  "challenge-3": "ضعف التنسيق بين الجهات",
  "challenge-4": "سوء توجيه الأموال",
  "challenge-5": "صعوبة تقييم المشاريع",

  // الحلول
  "solutions-title": "حلولنا المبتكرة",
  "solution-1-title": "تقييم ذكي للمشاريع",
  "solution-1-desc": "نظام تقييم متكامل يحلل جدوى المشاريع وفرص نجاحها",
  "solution-2-title": "ربط مباشر بالمستثمرين",
  "solution-2-desc": "منصة تفاعلية تربط أصحاب المشاريع بالمستثمرين المناسبين",
  "solution-3-title": "متابعة وتحليل الأداء",
  "solution-3-desc": "أدوات لقياس أداء المشاريع ومتابعة تقدمها بعد التمويل",

  // الإحصائيات
  "stats-title": "إحصائيات منصتنا",
  "stats-projects": "مشروع تم تقييمه",
  "stats-entrepreneurs": "رائد أعمال",
  "stats-success": "نسبة نجاح المشاريع",

  // التسجيل
  "submit-title": "قدم مشروعك الآن",
  "submit-subtitle": "احصل على تقييم شامل وفرصة للتواصل مع المستثمرين",
  "submit-button": "تقديم مشروع",

  // التنقل
  home: "الرئيسية",
  about: "من نحن",
  resources: "الموارد",
  contact: "اتصل بنا",
  "submit-project": "قدم مشروعك",
  evaluation: "التقييم",

  // التذييل
  "footer-rights": "جميع الحقوق محفوظة",
  "footer-privacy": "سياسة الخصوصية",
  "footer-terms": "شروط الاستخدام",

  // صفحة من نحن
  "about-title": "من نحن",
  "about-subtitle": "نبذة عن منصة برقان",
  "about-description":
    "منصة برقان هي مبادرة تهدف إلى دعم الشباب وأصحاب المشاريع الناشئة في مجتمع مزاب من خلال توفير منصة متكاملة لتقييم المشاريع وربطها بالمستثمرين المناسبين. نسعى لخلق بيئة داعمة للابتكار وريادة الأعمال وتعزيز التنمية الاقتصادية المحلية.",
  "mission-title": "مهمتنا",
  "mission-description":
    "تمكين الشباب وأصحاب المشاريع الناشئة من تحقيق أفكارهم وتحويلها إلى مشاريع ناجحة من خلال توفير التقييم المهني والتوجيه المناسب والربط بمصادر التمويل.",
  "vision-title": "رؤيتنا",
  "vision-description":
    "خلق منظومة متكاملة لدعم ريادة الأعمال في مجتمع مزاب تساهم في التنمية الاقتصادية المستدامة وخلق فرص عمل للشباب.",
  "values-title": "قيمنا",
  "value-1": "الابتكار",
  "value-2": "الشفافية",
  "value-3": "التعاون",
  "value-4": "التميز",
  "value-5": "المسؤولية المجتمعية",

  // صفحة الموارد
  "resources-title": "الموارد",
  "resources-subtitle": "مجموعة من الموارد والأدوات لمساعدة رواد الأعمال",
  "view-resource": "عرض المورد",
  "resource-category-funding": "التمويل",
  "resource-category-planning": "التخطيط",
  "resource-category-marketing": "التسويق",
  "resource-category-legal": "القانوني",
  "resource-category-management": "الإدارة",

  // صفحة الاتصال
  "contact-title": "اتصل بنا",
  "contact-subtitle": "نحن هنا للإجابة على استفساراتك",
  "contact-name": "الاسم",
  "contact-email": "البريد الإلكتروني",
  "contact-subject": "الموضوع",
  "contact-message": "الرسالة",
  "send-message": "إرسال الرسالة",
  "contact-success": "تم إرسال رسالتك بنجاح",

  // التقييم
  "evaluation-title": "تقييم المشروع",
  "evaluation-subtitle": "نتائج تقييم مشروعك",
  "project-score": "الدرجة الإجمالية",
  "criteria-feasibility": "الجدوى",
  "criteria-impact": "التأثير المجتمعي",
  "criteria-expertise": "الخبرة",
  "criteria-sustainability": "الاستدامة",
  "criteria-clarity": "وضوح الرؤية",
  "feedback-title": "التعليقات",
  recommendations: "التوصيات",

  // حالة المشروع
  "status-successful": "مشروع ناجح",
  "status-promising": "مشروع واعد",
  "status-needs-work": "يحتاج إلى تحسين",
  "status-failed": "مشروع غير مجدي",

  // تقديم المشروع
  "project-name": "اسم المشروع",
  "owner-name": "اسم صاحب المشروع",
  "project-description": "وصف المشروع",
  "target-audience": "الفئة المستهدفة",
  "main-objectives": "الأهداف الرئيسية",
  "required-budget": "الميزانية المطلوبة",
  "current-funding": "التمويل الحالي",
  "previous-experience": "الخبرة السابقة",
  timeline: "الجدول الزمني",
  "community-impact": "التأثير المجتمعي",
  "required-resources": "الموارد المطلوبة",
  "anticipated-challenges": "التحديات المتوقعة",
  "sustainability-plan": "خطة الاستدامة",
  "form-success": "تم تقديم مشروعك بنجاح",

  // المستخدمين
  login: "تسجيل الدخول",
  register: "إنشاء حساب",
  logout: "تسجيل الخروج",
  email: "البريد الإلكتروني",
  password: "كلمة المرور",
  "confirm-password": "تأكيد كلمة المرور",
  "login-button": "تسجيل الدخول",
  "register-button": "إنشاء حساب",
  "project-owner": "صاحب مشروع",
  investor: "مستثمر",
  admin: "مدير النظام",
  "select-role": "اختر نوع الحساب",
  "have-account": "لديك حساب بالفعل؟",
  "no-account": "ليس لديك حساب؟",
  "login-here": "سجل دخول من هنا",
  "register-here": "أنشئ حساب من هنا",

  // لوحة التحكم
  dashboard: "لوحة التحكم",
  "investor-dashboard": "لوحة تحكم المستثمر",
  "admin-dashboard": "لوحة تحكم المدير",
  "my-projects": "مشاريعي",
  "browse-projects": "تصفح المشاريع",
  "project-details": "تفاصيل المشروع",
  "no-projects": "لا توجد مشاريع حالياً",
  "create-project": "إنشاء مشروع جديد",
  "quick-links": "روابط سريعة",
  "manage-your-projects": "إدارة مشاريعك",
  "view-details": "عرض التفاصيل",

  // المستثمر
  "available-projects": "المشاريع المتاحة",
  "browse-available-projects": "تصفح المشاريع المتاحة للاستثمار",
  filters: "التصفية",
  "project-status": "حالة المشروع",
  "select-status": "اختر الحالة",
  "all-projects": "جميع المشاريع",
  "investment-range": "نطاق الاستثمار",
  min: "الحد الأدنى",
  max: "الحد الأقصى",
  "apply-filters": "تطبيق التصفية",
  search: "بحث",
  "search-projects": "البحث في المشاريع",
  "projects-found": "مشروع تم العثور عليه",
  "no-projects-found": "لم يتم العثور على مشاريع",
  "try-different-filters": "حاول استخدام معايير تصفية مختلفة",
  evaluated: "تم التقييم",
  "contact-project-owner": "التواصل مع صاحب المشروع",

  // الملف الشخصي
  profile: "الملف الشخصي",
  "edit-profile": "تعديل الملف الشخصي",
  "save-profile": "حفظ التغييرات",
  "full-name": "الاسم الكامل",
  phone: "رقم الهاتف",
  location: "الموقع",
  bio: "نبذة شخصية",
  expertise: "الخبرات",
  "complete-profile": "استكمال الملف الشخصي",
  "complete-profile-subtitle": "استكمل بياناتك الشخصية للاستفادة من جميع مميزات المنصة",
  "profile-subtitle": "إدارة معلوماتك الشخصية",
  "profile-details": "بيانات الملف الشخصي",
  "complete-your-profile-to-continue": "استكمل ملفك الشخصي للمتابعة",
  "update-your-profile-information": "تحديث معلومات ملفك الشخصي",
  "expertise-placeholder": "مثال: برمجة، تسويق، إدارة مشاريع",
  "separate-with-commas": "افصل بين الخبرات بفواصل",
  "complete-setup": "إكمال الإعداد",
  saving: "جاري الحفظ...",
  loading: "جاري التحميل...",

  // المحفظة
  wallet: "المحفظة",
  "wallet-balance": "رصيد المحفظة",
  "add-funds": "إضافة رصيد",
  "withdraw-funds": "سحب رصيد",
  "transaction-history": "سجل المعاملات",
  date: "التاريخ",
  amount: "المبلغ",
  type: "النوع",
  status: "الحالة",
  deposit: "إيداع",
  withdrawal: "سحب",
  investment: "استثمار",
  completed: "مكتمل",
  pending: "قيد التنفيذ",
  failed: "فشل",

  // الاستثمار
  "invest-now": "استثمر الآن",
  "investment-amount": "مبلغ الاستثمار",
  "confirm-investment": "تأكيد الاستثمار",
  "investment-success": "تم الاستثمار بنجاح",
  "investment-details": "تفاصيل الاستثمار",
  "total-investments": "إجمالي الاستثمارات",
  "active-investments": "الاستثمارات النشطة",
  "investment-date": "تاريخ الاستثمار",
  "investment-project": "المشروع المستثمر فيه",

  // لوحة تحكم المدير
  "admin-overview": "نظرة عامة",
  "total-users": "إجمالي المستخدمين",
  "total-projects": "إجمالي المشاريع",
  "total-investments": "إجمالي الاستثمارات",
  "manage-users": "إدارة المستخدمين",
  "manage-projects": "إدارة المشاريع",
  "manage-investments": "إدارة الاستثمارات",
  "system-settings": "إعدادات النظام",
  "user-management": "إدارة المستخدمين",
  "user-id": "معرف المستخدم",
  "user-name": "اسم المستخدم",
  "user-email": "البريد الإلكتروني",
  "user-role": "نوع الحساب",
  "user-status": "حالة الحساب",
  active: "نشط",
  inactive: "غير نشط",
  suspended: "معلق",
  actions: "إجراءات",
  edit: "تعديل",
  delete: "حذف",
  suspend: "تعليق",
  activate: "تنشيط",
  "investment-fund": "صندوق الاستثمار",
  "total-fund": "إجمالي الصندوق",
  "fund-in": "إيداعات",
  "fund-out": "سحوبات",
  "fund-invested": "مبالغ مستثمرة",
  "fund-available": "المبلغ المتاح",

  // عام
  "not-specified": "غير محدد",
  "submitted-by": "قدمه",
  "evaluation-in-progress": "جاري تقييم المشروع",
  "no-evaluation-available": "لا يوجد تقييم متاح",
  "go-back": "العودة",
  "project-not-found": "لم يتم العثور على المشروع",

  // الصفحة الرئيسية الجديدة
  "for-entrepreneurs": "لأصحاب المشاريع",
  "for-investors": "للمستثمرين",
  "entrepreneur-signup": "تسجيل كصاحب مشروع",
  "investor-signup": "تسجيل كمستثمر",
  "entrepreneur-description": "قدم مشروعك واحصل على تقييم شامل وفرصة للتواصل مع المستثمرين",
  "investor-description": "استثمر في مشاريع واعدة تم تقييمها بدقة وتابع استثماراتك",
  "how-it-works": "كيف تعمل المنصة",
  "step-1": "التسجيل وإنشاء حساب",
  "step-2": "تقديم تفاصيل المشروع (لأصحاب المشاريع)",
  "step-3": "الحصول على تقييم شامل",
  "step-4": "التواصل مع المستثمرين",
  "step-5": "متابعة تقدم المشروع والاستثمار",
  "success-stories": "قصص نجاح",
  "success-story-1-title": "مشروع الواحة الذكية",
  "success-story-1-desc": "حصل على تمويل 2 مليون دينار وحقق نمواً بنسبة 150% خلال عام",
  "success-story-2-title": "تطبيق توصيل المنتجات المحلية",
  "success-story-2-desc": "وفر 50 فرصة عمل للشباب وخدم أكثر من 5000 عميل",
  "success-story-3-title": "مركز التدريب التقني",
  "success-story-3-desc": "درب أكثر من 200 شاب وساهم في توظيف 80% منهم",
  "platform-benefits": "مميزات المنصة",
  "benefit-1-title": "تقييم ذكي للمشاريع",
  "benefit-1-desc": "تقييم شامل لجدوى المشروع وفرص نجاحه",
  "benefit-2-title": "ربط مباشر بالمستثمرين",
  "benefit-2-desc": "تواصل مباشر مع مستثمرين مهتمين بمجال مشروعك",
  "benefit-3-title": "متابعة وتحليل الأداء",
  "benefit-3-desc": "أدوات لقياس أداء المشروع ومتابعة تقدمه",
  "benefit-4-title": "محفظة استثمارية متكاملة",
  "benefit-4-desc": "إدارة استثماراتك ومتابعة عائداتها بسهولة",
  "join-now": "انضم الآن",
  testimonials: "آراء المستخدمين",
  "testimonial-1-name": "أحمد محمد",
  "testimonial-1-role": "صاحب مشروع",
  "testimonial-1-text":
    "ساعدتني منصة برقان في الحصول على تقييم احترافي لمشروعي والتواصل مع مستثمرين جادين، مما ساهم في إطلاق مشروعي بنجاح",
  "testimonial-2-name": "سارة أحمد",
  "testimonial-2-role": "مستثمرة",
  "testimonial-2-text":
    "المنصة وفرت لي فرصاً استثمارية مميزة تم تقييمها بشكل احترافي، مما سهل علي اتخاذ قرارات استثمارية صائبة",
  "testimonial-3-name": "محمد علي",
  "testimonial-3-role": "صاحب مشروع",
  "testimonial-3-text": "التقييم الشامل الذي حصلت عليه ساعدني في تحسين خطة مشروعي وجذب اهتمام المستثمرين",
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const t = (key: string): string => {
    return translations[key] || key
  }

  const contextValue: LanguageContextType = {
    t,
    dir: "rtl",
  }

  return <LanguageContext.Provider value={contextValue}>{children}</LanguageContext.Provider>
}

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

