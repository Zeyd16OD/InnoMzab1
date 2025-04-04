"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useLanguage } from "@/context/language-context"
import { useAuth } from "@/context/auth-context"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertCircle, Loader2, CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { supabase, type InvestorProfile } from "@/lib/supabase"

const AREAS_OF_INTEREST = [
  { value: "technology", label: "area-technology" },
  { value: "agriculture", label: "area-agriculture" },
  { value: "education", label: "area-education" },
  { value: "health", label: "area-health" },
  { value: "energy", label: "area-energy" },
  { value: "finance", label: "area-finance" },
  { value: "retail", label: "area-retail" },
  { value: "manufacturing", label: "area-manufacturing" },
  { value: "services", label: "area-services" },
  { value: "other", label: "area-other" },
]

const PROJECT_STAGES = [
  { value: "idea", label: "stage-idea" },
  { value: "startup", label: "stage-startup" },
  { value: "growth", label: "stage-growth" },
  { value: "established", label: "stage-established" },
]

export default function InvestorProfilePage() {
  const { t, dir } = useLanguage()
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const isSetup = searchParams.get("setup") === "true"

  const [profile, setProfile] = useState<Partial<InvestorProfile>>({
    full_name: "",
    email: "",
    phone: "",
    location: "",
    areas_of_interest: [],
    investment_min: 0,
    investment_max: 0,
    preferred_stage: [],
    previous_investments: "",
    industry_expertise: [],
    investment_goals: "",
    investment_criteria: "",
    availability: "",
  })

  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
      return
    }

    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase.from("investor_profiles").select("*").eq("user_id", user.id).single()

        if (error && error.code !== "PGRST116") {
          console.error("Error fetching profile:", error)
          return
        }

        if (data) {
          setProfile(data)
        } else if (user.email) {
          // Pre-fill email if no profile exists
          setProfile((prev) => ({ ...prev, email: user.email || "" }))
        }
      } catch (err) {
        console.error("Error fetching profile:", err)
      } finally {
        setIsFetching(false)
      }
    }

    fetchProfile()
  }, [user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    if (!user) {
      setError("You must be logged in to update your profile")
      setIsLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from("investor_profiles")
        .upsert({
          user_id: user.id,
          ...profile,
        })
        .select()

      if (error) {
        setError(error.message)
        setIsLoading(false)
        return
      }

      setSuccess("Profile updated successfully")

      if (isSetup) {
        // Redirect to dashboard after initial setup
        setTimeout(() => {
          router.push("/investor-dashboard")
        }, 1500)
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfile((prev) => ({ ...prev, [name]: value }))
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfile((prev) => ({ ...prev, [name]: Number.parseFloat(value) || 0 }))
  }

  const toggleAreaOfInterest = (value: string) => {
    setProfile((prev) => {
      const areas = prev.areas_of_interest || []
      return {
        ...prev,
        areas_of_interest: areas.includes(value) ? areas.filter((area) => area !== value) : [...areas, value],
      }
    })
  }

  const togglePreferredStage = (value: string) => {
    setProfile((prev) => {
      const stages = prev.preferred_stage || []
      return {
        ...prev,
        preferred_stage: stages.includes(value) ? stages.filter((stage) => stage !== value) : [...stages, value],
      }
    })
  }

  if (isFetching) {
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
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                {isSetup ? t("complete-investor-profile") : t("investor-profile")}
              </h1>
              <p className="text-muted-foreground">
                {isSetup ? t("complete-investor-profile-subtitle") : t("investor-profile-subtitle")}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <Card className="mx-auto max-w-2xl">
            <CardHeader>
              <CardTitle>{t("investor-profile-details")}</CardTitle>
              <CardDescription>
                {isSetup
                  ? t("complete-your-investor-profile-to-continue")
                  : t("update-your-investor-profile-information")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert variant="success" className="mb-4 bg-green-50 text-green-800 border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">{t("personal-information")}</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="full_name">{t("full-name")}</Label>
                      <Input
                        id="full_name"
                        name="full_name"
                        value={profile.full_name || ""}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">{t("email")}</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={profile.email || ""}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">{t("phone")}</Label>
                      <Input id="phone" name="phone" value={profile.phone || ""} onChange={handleChange} required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">{t("location")}</Label>
                      <Input
                        id="location"
                        name="location"
                        value={profile.location || ""}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">{t("investment-preferences")}</h3>

                  <div className="space-y-2">
                    <Label>{t("areas-of-interest")}</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {AREAS_OF_INTEREST.map((area) => (
                        <div key={area.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`area-${area.value}`}
                            checked={(profile.areas_of_interest || []).includes(area.value)}
                            onCheckedChange={() => toggleAreaOfInterest(area.value)}
                          />
                          <Label htmlFor={`area-${area.value}`}>{t(area.label)}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="investment_min">{t("investment-min")}</Label>
                      <Input
                        id="investment_min"
                        name="investment_min"
                        type="number"
                        value={profile.investment_min || ""}
                        onChange={handleNumberChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="investment_max">{t("investment-max")}</Label>
                      <Input
                        id="investment_max"
                        name="investment_max"
                        type="number"
                        value={profile.investment_max || ""}
                        onChange={handleNumberChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>{t("preferred-stage")}</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {PROJECT_STAGES.map((stage) => (
                        <div key={stage.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`stage-${stage.value}`}
                            checked={(profile.preferred_stage || []).includes(stage.value)}
                            onCheckedChange={() => togglePreferredStage(stage.value)}
                          />
                          <Label htmlFor={`stage-${stage.value}`}>{t(stage.label)}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">{t("experience-and-criteria")}</h3>

                  <div className="space-y-2">
                    <Label htmlFor="previous_investments">{t("previous-investments")}</Label>
                    <Textarea
                      id="previous_investments"
                      name="previous_investments"
                      value={profile.previous_investments || ""}
                      onChange={handleChange}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="industry_expertise">{t("industry-expertise")}</Label>
                    <Input
                      id="industry_expertise"
                      name="industry_expertise"
                      value={profile.industry_expertise?.join(", ") || ""}
                      onChange={(e) => {
                        const expertiseArray = e.target.value
                          .split(",")
                          .map((item) => item.trim())
                          .filter(Boolean)

                        setProfile((prev) => ({ ...prev, industry_expertise: expertiseArray }))
                      }}
                      placeholder={t("industry-expertise-placeholder")}
                    />
                    <p className="text-sm text-muted-foreground">{t("separate-with-commas")}</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="investment_goals">{t("investment-goals")}</Label>
                    <Textarea
                      id="investment_goals"
                      name="investment_goals"
                      value={profile.investment_goals || ""}
                      onChange={handleChange}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="investment_criteria">{t("investment-criteria")}</Label>
                    <Textarea
                      id="investment_criteria"
                      name="investment_criteria"
                      value={profile.investment_criteria || ""}
                      onChange={handleChange}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="availability">{t("availability")}</Label>
                    <Select
                      value={profile.availability || ""}
                      onValueChange={(value) => setProfile((prev) => ({ ...prev, availability: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t("select-availability")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="flexible">{t("flexible")}</SelectItem>
                        <SelectItem value="weekdays">{t("weekdays-only")}</SelectItem>
                        <SelectItem value="weekends">{t("weekends-only")}</SelectItem>
                        <SelectItem value="limited">{t("limited-availability")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("saving")}
                    </>
                  ) : isSetup ? (
                    t("complete-setup")
                  ) : (
                    t("save-profile")
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

