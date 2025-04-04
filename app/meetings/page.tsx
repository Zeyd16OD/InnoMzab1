"use client"
import { useState } from "react"
import { useLanguage } from "@/context/language-context"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, Users, CheckCircle, Loader2, CalendarDays } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data for upcoming meetings
const upcomingMeetings = [
  {
    id: 1,
    title: "تطوير خطة عمل المشروع",
    description: "جلسة توجيهية حول كيفية تطوير خطة عمل احترافية لمشروعك",
    date: "2025-04-10",
    time: "14:00",
    duration: "60",
    mentor: "أحمد محمد",
    mentorTitle: "مستشار أعمال",
    availableSeats: 5,
    totalSeats: 10,
  },
  {
    id: 2,
    title: "استراتيجيات التسويق للشركات الناشئة",
    description: "كيفية تسويق مشروعك بميزانية محدودة وجذب العملاء المستهدفين",
    date: "2025-04-15",
    time: "16:00",
    duration: "90",
    mentor: "سارة علي",
    mentorTitle: "مختصة في التسويق الرقمي",
    availableSeats: 3,
    totalSeats: 12,
  },
  {
    id: 3,
    title: "التمويل وجذب المستثمرين",
    description: "كيفية تجهيز عرض تقديمي جذاب للمستثمرين وتأمين التمويل اللازم",
    date: "2025-04-20",
    time: "15:00",
    duration: "75",
    mentor: "محمد أحمد",
    mentorTitle: "مستثمر ومستشار مالي",
    availableSeats: 8,
    totalSeats: 15,
  },
]

// Mock data for booked meetings
const bookedMeetings = [
  {
    id: 101,
    title: "إدارة المشاريع التقنية",
    description: "أساسيات إدارة المشاريع التقنية والتعامل مع فريق العمل",
    date: "2025-04-05",
    time: "13:00",
    duration: "60",
    mentor: "خالد عبدالله",
    mentorTitle: "مدير تقني سابق",
    status: "قادم",
    meetingLink: "https://meet.google.com/abc-defg-hij",
  },
]

export default function MeetingsPage() {
  const { t, dir } = useLanguage()
  const { user } = useAuth()
  const router = useRouter()
  const [isBooking, setIsBooking] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [selectedMeeting, setSelectedMeeting] = useState<any>(null)

  // Handle meeting booking
  const handleBookMeeting = (meeting: any) => {
    setSelectedMeeting(meeting)
    setIsBooking(true)

    // Simulate API call
    setTimeout(() => {
      setIsBooking(false)
      setBookingSuccess(true)

      // Reset success state after 2 seconds
      setTimeout(() => {
        setBookingSuccess(false)
      }, 2000)
    }, 1500)
  }

  // Format date to Arabic format
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString("ar-EG", options)
  }

  if (!user) {
    router.push("/auth/login")
    return null
  }

  return (
    <div className="flex flex-col" dir={dir}>
      <section className="w-full py-12 md:py-24 lg:py-32 bg-primary/10">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">جلسات التوجيه والإرشاد</h1>
              <p className="text-muted-foreground max-w-[700px] mx-auto">
                احجز موعدًا مع خبراء في مجال ريادة الأعمال للحصول على التوجيه والإرشاد لمشروعك
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12">
        <div className="container px-4 md:px-6">
          <Tabs defaultValue="upcoming">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="upcoming">الجلسات المتاحة</TabsTrigger>
              <TabsTrigger value="booked">الجلسات المحجوزة</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {upcomingMeetings.map((meeting) => (
                  <Card key={meeting.id} className="overflow-hidden">
                    <CardHeader className="p-4 bg-muted/50">
                      <div className="flex justify-between">
                        <CardTitle className="text-xl">{meeting.title}</CardTitle>
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                          {meeting.duration} دقيقة
                        </Badge>
                      </div>
                      <CardDescription className="mt-2 line-clamp-2">{meeting.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 space-y-4">
                      <div className="flex items-start gap-3">
                        <Calendar className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="font-medium">التاريخ والوقت</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(meeting.date)} - الساعة {meeting.time}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Users className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="font-medium">المرشد</p>
                          <p className="text-sm text-muted-foreground">
                            {meeting.mentor} - {meeting.mentorTitle}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between border-t pt-4 mt-2">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            المقاعد المتاحة: <span className="font-medium">{meeting.availableSeats}</span> /{" "}
                            {meeting.totalSeats}
                          </p>
                        </div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="default" size="sm">
                              حجز مقعد
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>تأكيد حجز جلسة</DialogTitle>
                              <DialogDescription>هل أنت متأكد من رغبتك في حجز هذه الجلسة؟</DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4 py-4">
                              <h3 className="font-medium">{meeting.title}</h3>
                              <div className="flex items-center gap-2 text-sm">
                                <Calendar className="h-4 w-4" />
                                <span>{formatDate(meeting.date)}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Clock className="h-4 w-4" />
                                <span>
                                  الساعة {meeting.time} ({meeting.duration} دقيقة)
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Users className="h-4 w-4" />
                                <span>{meeting.mentor}</span>
                              </div>
                            </div>

                            <DialogFooter>
                              <Button onClick={() => handleBookMeeting(meeting)} disabled={isBooking || bookingSuccess}>
                                {isBooking ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    جاري الحجز...
                                  </>
                                ) : bookingSuccess ? (
                                  <>
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    تم الحجز بنجاح
                                  </>
                                ) : (
                                  "تأكيد الحجز"
                                )}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="booked" className="space-y-6">
              {bookedMeetings.length === 0 ? (
                <div className="text-center py-12">
                  <CalendarDays className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                  <h3 className="mt-4 text-lg font-medium">لا توجد جلسات محجوزة</h3>
                  <p className="mt-2 text-sm text-muted-foreground">لم تقم بحجز أي جلسات بعد</p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {bookedMeetings.map((meeting) => (
                    <Card key={meeting.id} className="overflow-hidden">
                      <CardHeader className="p-4 bg-muted/50">
                        <div className="flex justify-between">
                          <CardTitle className="text-xl">{meeting.title}</CardTitle>
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                            {meeting.status}
                          </Badge>
                        </div>
                        <CardDescription className="mt-2 line-clamp-2">{meeting.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 space-y-4">
                        <div className="flex items-start gap-3">
                          <Calendar className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <p className="font-medium">التاريخ والوقت</p>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(meeting.date)} - الساعة {meeting.time}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Users className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <p className="font-medium">المرشد</p>
                            <p className="text-sm text-muted-foreground">
                              {meeting.mentor} - {meeting.mentorTitle}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 p-3 bg-muted rounded-md">
                          <p className="font-medium mb-1">رابط الاجتماع:</p>
                          <a
                            href={meeting.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline break-all"
                          >
                            {meeting.meetingLink}
                          </a>
                          <p className="text-xs text-muted-foreground mt-2">
                            سيتم فتح الرابط قبل 10 دقائق من بدء الجلسة
                          </p>
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 bg-muted/30 border-t">
                        <Button variant="outline" className="w-full">
                          إضافة إلى التقويم
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
}

