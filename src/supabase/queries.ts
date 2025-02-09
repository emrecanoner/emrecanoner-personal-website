import { supabase } from './client'
import { Education, Experience, Skill, Project, BlogPost, Certificate, UserProfile } from "@/types"

export async function getEducation(): Promise<Education[]> {
  const { data: education, error: educationError } = await supabase
    .from('education')
    .select(`
      *,
      projects:education_projects(*)
    `)
    .order('start_date', { ascending: false })

  if (educationError) {
    throw new Error(`Error fetching education: ${educationError.message}`)
  }

  return education
}

export async function getExperience(): Promise<Experience[]> {
  const { data: experiences, error: experienceError } = await supabase
    .from('experience')
    .select(`
      *,
      projects:experience_projects(*)
    `)
    .order('start_date', { ascending: false })

  if (experienceError) throw experienceError
  return experiences
}

export async function getSkills(): Promise<Skill[]> {
  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .order('category', { ascending: true })

  if (error) throw error
  return data
}

export async function getProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('stars', { ascending: false })

  if (error) throw error
  return data
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('published_date', { ascending: false })
    .limit(3)

  if (error) throw error
  return data
}

export async function getCertificates(): Promise<Certificate[]> {
  const { data, error } = await supabase
    .from('certificates')
    .select('*')
    .order('issue_date', { ascending: false })

  if (error) throw error
  return data
}

export async function getUserProfile(): Promise<UserProfile> {
  const { data: profile, error: profileError } = await supabase
    .from('user_profile')
    .select('*, social_links(*)')
    .single()

  if (profileError) throw profileError
  return profile
} 