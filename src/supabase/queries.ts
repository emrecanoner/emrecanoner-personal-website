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

interface EducationProject {
  title: string
  description: string
  github_url: string | null
  technologies: string[]
  education: {
    end_date: string | null
  }
}

interface ExperienceProject {
  title: string
  description: string
  github_url: string | null
  technologies: string[]
  experience: {
    end_date: string | null
  }
}

export async function getRandomProjects() {
  // Eğitim projelerini al
  const { data: educationProjects } = await supabase
    .from('education_projects')
    .select(`
      title,
      description,
      github_url,
      technologies,
      education:education!inner (
        end_date
      )
    `)
    .limit(3) as { data: EducationProject[] | null }

  // İş deneyimi projelerini al
  const { data: experienceProjects } = await supabase
    .from('experience_projects')
    .select(`
      title,
      description,
      github_url,
      technologies,
      experience:experience!inner (
        end_date
      )
    `)
    .limit(3) as { data: ExperienceProject[] | null }

  // Eğitim projelerini formatla
  const formattedEduProjects = (educationProjects || []).map(project => ({
    title: project.title,
    description: project.description,
    github_url: project.github_url,
    technologies: project.technologies || [],
    type: 'education' as const,
    date: project.education?.end_date || 'Present'
  }))

  // İş deneyimi projelerini formatla
  const formattedExpProjects = (experienceProjects || []).map(project => ({
    title: project.title,
    description: project.description,
    github_url: project.github_url,
    technologies: project.technologies || [],
    type: 'experience' as const,
    date: project.experience?.end_date || 'Present'
  }))

  return [...formattedEduProjects, ...formattedExpProjects]
} 