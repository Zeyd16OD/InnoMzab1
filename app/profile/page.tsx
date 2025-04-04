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
import { AlertCircle, Loader2, CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { supabase, type ProjectOwnerProfile } from "@/lib/supabase"

export default function ProfilePage() {
  const { t, dir } = useLanguage()
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const isSetup = searchParams.get("setup") === "true"

  const [profile, setProfile] = useState<Partial<ProjectOwnerProfile>>({
    full_name: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    expertise: [],
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
        const { data, error } = await supabase
          .from("project_owner_profiles")
          .select("*")
          .eq("user_id", user.id)
          .single()

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
        .from("project_owner_profiles")
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
          router.push("/dashboard")
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
                {isSetup ? t("complete-profile") : t("profile")}
              </h1>
              <p className="text-muted-foreground">
                {isSetup ? t("complete-profile-subtitle") : t("profile-subtitle")}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <Card className="mx-auto max-w-2xl">
            <CardHeader>
              <CardTitle>{t("profile-details")}</CardTitle>
              <CardDescription>
                {isSetup ? t("complete-your-profile-to-continue") : t("update-your-profile-information")}
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

              <form onSubmit={handleSubmit} className="space-y-4">
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

                <div className="space-y-2">
                  <Label htmlFor="bio">{t("bio")}</Label>
                  <Textarea id="bio" name="bio" value={profile.bio || ""} onChange={handleChange} rows={4} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expertise">{t("expertise")}</Label>
                  <Input
                    id="expertise"
                    name="expertise"
                    value={profile.expertise?.join(", ") || ""}
                    onChange={(e) => {
                      const expertiseArray = e.target.value
                        .split(",")
                        .map((item) => item.trim())
                        .filter(Boolean)

                      setProfile((prev) => ({ ...prev, expertise: expertiseArray }))
                    }}
                    placeholder={t("expertise-placeholder")}
                  />
                  <p className="text-sm text-muted-foreground">{t("separate-with-commas")}</p>
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

