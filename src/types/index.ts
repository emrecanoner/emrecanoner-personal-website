export interface Education {
  id: number
  degree: string
  field: string
  school: string
  gpa?: number
  start_date: string
  end_date: string | null
  description?: string
  projects?: {
    title: string
    description?: string
    technologies?: string[]
    github_url?: string
  }[]
  achievements?: string[]
  logo_url: string
  created_at: string
  updated_at: string
}

export interface Experience {
  id: number
  company_name: string
  position: string
  start_date: string
  end_date: string | null
  location?: string
  logo_url: string
  description: string
  responsibilities: string[]
  technologies?: string[]
  projects?: {
    title: string
    description: string
    technologies?: string[]
    github_url?: string
  }[]
  created_at: string
  updated_at: string
}

export interface Skill {
  id: number
  category: string
  name: string
  description: string
}

export interface Project {
  id: number
  title: string
  description: string
  github_url: string
  demo_url?: string
  technologies: string[]
  stars: number
  forks: number
}

export interface BlogPost {
  id: number
  title: string
  description: string
  slug: string
  published_date: string
  reading_time: number
  views: number
  category: string
}

export interface Certificate {
  id: number
  title: string
  issuer: string
  issue_date: string
  credential_url?: string
}

export interface UserProfile {
  id: number
  name: string
  surname: string
  title: string
  short_intro: string
  about: string
  location: string
  email: string
  profile_image_url: string
  created_at: string
  updated_at: string
  social_links?: SocialLink[]
}

export interface SocialLink {
  id: number
  user_id: number
  platform: string
  url: string
  created_at: string
  updated_at: string
} 