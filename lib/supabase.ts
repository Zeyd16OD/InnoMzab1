import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type UserRole = "project_owner" | "investor"

export type ProjectOwnerProfile = {
  id: string
  user_id: string
  full_name: string
  email: string
  phone: string
  location: string
  bio: string
  expertise: string[]
  created_at: string
}

export type InvestorProfile = {
  id: string
  user_id: string
  full_name: string
  email: string
  phone: string
  location: string
  areas_of_interest: string[]
  investment_min: number
  investment_max: number
  preferred_stage: string[]
  previous_investments: string
  industry_expertise: string[]
  investment_goals: string
  investment_criteria: string
  availability: string
  created_at: string
}

export type Project = {
  id: string
  owner_id: string
  project_name: string
  owner_name: string
  description: string
  target_audience: string
  main_objectives: string
  required_budget: number
  current_funding: string
  previous_experience: string
  timeline: string
  community_impact: string
  required_resources: string
  anticipated_challenges: string
  sustainability_plan: string
  created_at: string
  status: "pending" | "evaluated"
}

export type ProjectEvaluation = {
  id: string
  project_id: string
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
  created_at: string
}

