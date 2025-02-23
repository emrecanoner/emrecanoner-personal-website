import Image from 'next/image'
import { FiMail, FiMapPin, FiBriefcase, FiAward, FiGithub, FiLinkedin, FiTwitter, FiExternalLink, FiCalendar, FiClock, FiEye, FiStar, FiGitBranch } from 'react-icons/fi'
import { SiHackerrank } from 'react-icons/si'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHackerrank } from '@fortawesome/free-brands-svg-icons'
import Link from 'next/link'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { getEducation, getExperience, getSkills, getProjects, getCertificates, getUserProfile, getRandomProjects } from '@/supabase/queries'
import { getBlogPosts, getBooks } from '@/lib/notion/client'
import { getPostViews } from '@/supabase/queries'
import { ScrollProgress } from '@/components/ui/scroll-progress'
import { PostMeta } from '@/components/blog/post-meta'
import { Suspense } from 'react'
import { Loading } from '@/components/ui/loading'

export default async function Home() {
  return (
    <div className="relative min-h-screen bg-background">
      <Suspense fallback={<Loading />}>
        <HomeContent />
      </Suspense>
    </div>
  )
}

async function HomeContent() {
  // Verileri çek
  const userProfile = await getUserProfile()
  const experience = await getExperience()
  const education = await getEducation()
  const skills = await getSkills()
  const blogPosts = await getBlogPosts()
  const books = await getBooks()
  
  const postsWithViews = await Promise.all(
    blogPosts.slice(0, 3).map(async (post) => {
      const views = await getPostViews(post.slug)
      return { ...post, views }
    })
  )

  return (
    <main className="mx-auto max-w-4xl px-4 pt-8">
      <ScrollProgress />
      {/* Hero Section */}
      <section className="container relative mx-auto max-w-4xl px-4 pb-12 sm:pb-16">
        {/* Background Pattern */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -left-4 top-20 h-48 w-48 rounded-full bg-primary/5 blur-3xl sm:h-72 sm:w-72" />
          <div className="absolute -right-4 top-40 h-48 w-48 rounded-full bg-primary/10 blur-3xl sm:h-72 sm:w-72" />
        </div>

        <div className="flex flex-col-reverse items-center gap-8 md:flex-row md:justify-between">
          <div className="flex w-full flex-col items-center gap-4 text-center md:w-auto md:items-start md:text-left">
            <div className="space-y-2">
              <p className="text-base font-medium text-primary sm:text-lg">Hi, I'm</p>
              <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
                {userProfile.name} {userProfile.surname}
              </h1>
              <p className="text-base text-muted-foreground sm:text-lg">
                {userProfile.title}
              </p>
            </div>
            
            <p className="max-w-md text-sm text-muted-foreground sm:text-base">
              {userProfile.short_intro}
            </p>

            <div className="flex items-center gap-2 text-xs text-muted-foreground sm:text-sm">
              <FiMapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span>{userProfile.location}</span>
            </div>

            <div className="flex gap-4 sm:gap-5">
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 w-fit sm:h-10 transition-all duration-200 hover:bg-[#1a1f36] hover:text-white dark:hover:bg-white dark:hover:text-[#1a1f36]" 
                asChild
              >
                <a href={`mailto:${userProfile.email}`} className="flex items-center gap-2">
                  <FiMail className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  Contact Me
                </a>
              </Button>
              {userProfile.social_links?.map((link) => (
                <Button
                  key={link.id}
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 sm:h-10 sm:w-10 transition-all duration-200 hover:bg-[#1a1f36] hover:text-white dark:hover:bg-white dark:hover:text-[#1a1f36]"
                  asChild
                >
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    {link.platform === 'github' && <FiGithub className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
                    {link.platform === 'linkedin' && <FiLinkedin className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
                    {link.platform === 'hackerrank' && <FontAwesomeIcon icon={faHackerrank} className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
                  </a>
                </Button>
              ))}
            </div>
          </div>

          <div className="relative w-32 sm:w-40 md:w-48">
            <div className="relative aspect-square overflow-hidden rounded-full border border-primary/10 transition-all duration-300 hover:border-primary/20">
              <Image
                src={userProfile.profile_image_url}
                alt={`${userProfile.name} ${userProfile.surname}`}
                fill
                className="object-cover object-[center_15%] transition-transform duration-300 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="container mx-auto max-w-4xl px-4 py-8 sm:py-12">
        <h2 className="mb-6 text-xl font-bold tracking-tight sm:mb-8 sm:text-2xl">About</h2>
        <Card className="transition-all duration-300 hover:shadow-lg">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground sm:text-base leading-relaxed">
              {userProfile.about}
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Experience Section */}
      <section className="container mx-auto max-w-4xl px-4 py-8 sm:py-12">
        <h2 className="mb-6 text-xl font-bold tracking-tight sm:mb-8 sm:text-2xl">Experience</h2>
        <div className="relative space-y-6 before:absolute before:inset-0 before:left-4 before:ml-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-primary/20 before:via-primary/50 before:to-primary/20 sm:space-y-8 md:before:left-1/2 md:before:-ml-0.5">
          {experience.map((job, index) => (
            <div key={job.id} className="relative flex flex-col gap-4 md:flex-row md:justify-center">
              {index % 2 === 0 ? (
                // Sağ taraf
                <>
                  <div className="md:w-1/2 md:pr-8" />
                  <div className="absolute left-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary bg-background sm:h-10 sm:w-10 md:left-1/2 md:-ml-5">
                    <FiBriefcase className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
                  </div>
                  <div className="ml-12 flex sm:ml-14 md:ml-0 md:w-1/2 md:pl-8">
                    <Card className="w-full transition-all duration-300 hover:shadow-lg">
                      <CardHeader>
                        <div className="flex items-center gap-4">
                          <div className="group relative h-12 w-12 overflow-hidden rounded-lg border">
                            <Image
                              src={job.logo_url}
                              alt={`${job.company_name} Logo`}
                              fill
                              className="object-contain p-1.5 transition-transform duration-300 group-hover:scale-105"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-8">
                              <CardTitle>{job.position}</CardTitle>
                              <Badge variant="outline" className="shrink-0">
                                {new Date(job.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - {job.end_date ? new Date(job.end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present'}
                              </Badge>
                            </div>
                            <CardDescription>{job.company_name}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <ul className="ml-4 list-disc text-sm text-muted-foreground">
                          {job.responsibilities.map((resp, i) => (
                            <li key={i}>{resp}</li>
                          ))}
                        </ul>
                        {job.technologies && job.technologies.length > 0 && (
                          <div className="mt-4">
                            <h4 className="mb-2 text-base font-medium">Technologies</h4>
                            <div className="flex flex-wrap gap-1.5">
                              {job.technologies.map((tech, i) => (
                                <Badge key={i} variant="secondary" className="transition-colors hover:bg-primary hover:text-primary-foreground">{tech}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {job.projects && job.projects.length > 0 && (
                          <div className="mt-4 space-y-3">
                            <h4 className="text-base font-medium">Key Projects</h4>
                            {job.projects.map((project, i) => (
                              <div key={i}>
                                <div className="mb-1 flex items-center gap-2">
                                  <span className="text-sm font-medium">{project.title}</span>
                                  {project.github_url && (
                                    <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition-colors hover:text-primary">
                                      <FiGithub className="h-4 w-4" />
                                    </a>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground">{project.description}</p>
                                {project.technologies && project.technologies.length > 0 && (
                                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                                    {project.technologies.map((tech, techIndex) => (
                                      <Badge 
                                        key={techIndex} 
                                        variant="secondary" 
                                        className="text-xs transition-colors hover:bg-primary hover:text-primary-foreground"
                                      >
                                        {tech}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </>
              ) : (
                // Sol taraf
                <>
                  <div className="ml-12 flex sm:ml-14 md:ml-0 md:w-1/2 md:justify-end md:pr-8">
                    <Card className="w-full transition-all duration-300 hover:shadow-lg">
                      <CardHeader>
                        <div className="flex items-center gap-4">
                          <div className="group relative h-12 w-12 overflow-hidden rounded-lg border">
                            <Image
                              src={job.logo_url}
                              alt={`${job.company_name} Logo`}
                              fill
                              className="object-contain p-1.5 transition-transform duration-300 group-hover:scale-105"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-8">
                              <CardTitle>{job.position}</CardTitle>
                              <Badge variant="outline" className="shrink-0">
                                {new Date(job.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - {job.end_date ? new Date(job.end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present'}
                              </Badge>
                            </div>
                            <CardDescription>{job.company_name}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <ul className="ml-4 list-disc text-sm text-muted-foreground">
                          {job.responsibilities.map((resp, i) => (
                            <li key={i}>{resp}</li>
                          ))}
                        </ul>
                        {job.technologies && job.technologies.length > 0 && (
                          <div className="mt-4">
                            <h4 className="mb-2 text-base font-medium">Technologies</h4>
                            <div className="flex flex-wrap gap-1.5">
                              {job.technologies.map((tech, i) => (
                                <Badge key={i} variant="secondary" className="transition-colors hover:bg-primary hover:text-primary-foreground">{tech}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {job.projects && job.projects.length > 0 && (
                          <div className="mt-4 space-y-3">
                            <h4 className="text-base font-medium">Key Projects</h4>
                            {job.projects.map((project, i) => (
                              <div key={i}>
                                <div className="mb-1 flex items-center gap-2">
                                  <span className="text-sm font-medium">{project.title}</span>
                                  {project.github_url && (
                                    <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition-colors hover:text-primary">
                                      <FiGithub className="h-4 w-4" />
                                    </a>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground">{project.description}</p>
                                {project.technologies && project.technologies.length > 0 && (
                                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                                    {project.technologies.map((tech, techIndex) => (
                                      <Badge 
                                        key={techIndex} 
                                        variant="secondary" 
                                        className="text-xs transition-colors hover:bg-primary hover:text-primary-foreground"
                                      >
                                        {tech}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                  <div className="absolute left-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary bg-background sm:h-10 sm:w-10 md:left-1/2 md:-ml-5">
                    <FiBriefcase className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
                  </div>
                  <div className="md:w-1/2 md:pl-8" />
                </>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Education Section */}
      <section className="container mx-auto max-w-4xl px-4 py-8 sm:py-12">
        <h2 className="mb-6 text-xl font-bold tracking-tight sm:mb-8 sm:text-2xl">Education</h2>
        <div className="relative space-y-6 before:absolute before:inset-0 before:left-4 before:ml-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-primary/20 before:via-primary/50 before:to-primary/20 sm:space-y-8 md:before:left-1/2 md:before:-ml-0.5">
          {education.map((edu, index) => (
            <div key={edu.id} className="relative flex flex-col gap-4 md:flex-row md:justify-center">
              {index % 2 === 0 ? (
                // Right Side
                <>
                  <div className="md:w-1/2 md:pr-8" />
                  <div className="absolute left-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary bg-background sm:h-10 sm:w-10 md:left-1/2 md:-ml-5">
                    <FiAward className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
                  </div>
                  <div className="ml-12 flex sm:ml-14 md:ml-0 md:w-1/2 md:pl-8">
                    <Card className="w-full transition-all duration-300 hover:shadow-lg">
                      <CardHeader>
                        <div className="flex items-center gap-4">
                          <div className="relative h-12 w-12 overflow-hidden rounded-lg border">
                            <Image
                              src={edu.logo_url}
                              alt={`${edu.school} Logo`}
                              fill
                              className="object-contain p-2"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-8">
                              <CardTitle>{edu.field}</CardTitle>
                              <Badge variant="outline" className="shrink-0">
                                {new Date(edu.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - {edu.end_date ? new Date(edu.end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present'}
                              </Badge>
                            </div>
                            <CardDescription>{edu.school}</CardDescription>
                            {edu.gpa && (
                              <CardDescription>GPA: {edu.gpa}</CardDescription>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {edu.description && (
                            <p className="text-sm text-muted-foreground">{edu.description}</p>
                          )}
                          {edu.projects && edu.projects.length > 0 && (
                            <div>
                              <h4 className="mb-2 text-base font-medium">Notable Projects</h4>
                              <div className="space-y-3">
                                {edu.projects.map((project, i) => (
                                  <div key={i}>
                                    <div className="mb-1 flex items-center gap-2">
                                      <span className="text-sm font-medium">{project.title}</span>
                                      {project.github_url && (
                                        <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition-colors hover:text-primary">
                                          <FiGithub className="h-4 w-4" />
                                        </a>
                                      )}
                                    </div>
                                    {project.description && (
                                      <p className="text-sm text-muted-foreground">{project.description}</p>
                                    )}
                                    {project.technologies && project.technologies.length > 0 && (
                                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                                        {project.technologies.map((tech, techIndex) => (
                                          <Badge 
                                            key={techIndex} 
                                            variant="secondary" 
                                            className="text-xs transition-colors hover:bg-primary hover:text-primary-foreground"
                                          >
                                            {tech}
                                          </Badge>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          {edu.achievements && edu.achievements.length > 0 && (
                            <div>
                              <h4 className="mb-2 text-base font-medium">Achievements</h4>
                              <div className="flex flex-wrap gap-1.5">
                                {edu.achievements.map((achievement, i) => (
                                  <Badge key={i} variant="secondary">
                                    <FiAward className="mr-1.5 h-3.5 w-3.5" />
                                    {achievement}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </>
              ) : (
                // Left Side
                <>
                  <div className="ml-12 flex sm:ml-14 md:ml-0 md:w-1/2 md:justify-end md:pr-8">
                    <Card className="w-full transition-all duration-300 hover:shadow-lg">
                      <CardHeader>
                        <div className="flex items-center gap-4">
                          <div className="relative h-12 w-12 overflow-hidden rounded-lg border">
                            <Image
                              src={edu.logo_url}
                              alt={`${edu.school} Logo`}
                              fill
                              className="object-contain p-2"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-8">
                              <CardTitle>{edu.field}</CardTitle>
                              <Badge variant="outline" className="shrink-0">
                                {new Date(edu.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - {edu.end_date ? new Date(edu.end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present'}
                              </Badge>
                            </div>
                            <CardDescription>{edu.school}</CardDescription>
                            {edu.gpa && (
                              <CardDescription>GPA: {edu.gpa}</CardDescription>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {edu.description && (
                            <p className="text-sm text-muted-foreground">{edu.description}</p>
                          )}
                          {edu.projects && edu.projects.length > 0 && (
                            <div>
                              <h4 className="mb-2 text-base font-medium">Notable Projects</h4>
                              <div className="space-y-3">
                                {edu.projects.map((project, i) => (
                                  <div key={i}>
                                    <div className="mb-1 flex items-center gap-2">
                                      <span className="text-sm font-medium">{project.title}</span>
                                      {project.github_url && (
                                        <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition-colors hover:text-primary">
                                          <FiGithub className="h-4 w-4" />
                                        </a>
                                      )}
                                    </div>
                                    {project.description && (
                                      <p className="text-sm text-muted-foreground">{project.description}</p>
                                    )}
                                    {project.technologies && project.technologies.length > 0 && (
                                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                                        {project.technologies.map((tech, techIndex) => (
                                          <Badge 
                                            key={techIndex} 
                                            variant="secondary" 
                                            className="text-xs transition-colors hover:bg-primary hover:text-primary-foreground"
                                          >
                                            {tech}
                                          </Badge>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          {edu.achievements && edu.achievements.length > 0 && (
                            <div>
                              <h4 className="mb-2 text-base font-medium">Achievements</h4>
                              <div className="flex flex-wrap gap-1.5">
                                {edu.achievements.map((achievement, i) => (
                                  <Badge key={i} variant="secondary">
                                    <FiAward className="mr-1.5 h-3.5 w-3.5" />
                                    {achievement}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="absolute left-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary bg-background sm:h-10 sm:w-10 md:left-1/2 md:-ml-5">
                    <FiAward className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
                  </div>
                  <div className="md:w-1/2 md:pl-8" />
                </>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Skills Section */}
      <section className="container mx-auto max-w-4xl px-4 py-8 sm:py-12">
        <div className="mb-6 flex items-center justify-between sm:mb-8">
          <h2 className="text-xl font-bold tracking-tight sm:text-2xl">Skills</h2>
          <Button variant="outline" size="sm" className="gap-2" asChild>
            <a href="http://www.hackerrank.com/emrecanoner" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faHackerrank} className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              HackerRank Profile
            </a>
          </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {Object.entries(
            skills.reduce((acc, skill) => {
              if (!acc[skill.category]) {
                acc[skill.category] = [];
              }
              acc[skill.category].push(skill);
              return acc;
            }, {} as Record<string, typeof skills>)
          ).map(([category, categorySkills]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="text-lg">{category}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {categorySkills.map((skill) => (
                    <TooltipProvider key={skill.id}>
                      <Tooltip>
                        <TooltipTrigger>
                          <Badge 
                            variant="secondary"
                            className="px-3 py-1 transition-colors hover:bg-primary hover:text-primary-foreground"
                          >
                            <span className="font-medium">{skill.name}</span>
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{skill.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured Projects */}
      <section className="container mx-auto max-w-4xl px-4 py-8 sm:py-12">
        <h2 className="mb-6 text-xl font-bold tracking-tight sm:mb-8 sm:text-2xl">Featured Projects</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {(await getRandomProjects()).map((project) => (
            <Card key={project.title} className="group relative flex h-full flex-col overflow-hidden transition-all hover:shadow-lg">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{project.title}</CardTitle>
                    <CardDescription>{project.description}</CardDescription>
                  </div>
                  <Badge variant="outline" className="transition-colors hover:bg-primary hover:text-primary-foreground">
                    {project.type === 'education' ? 'Academic' : 'Professional'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col flex-grow">
                <div className="mt-auto space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {project.technologies?.map((tech, index) => (
                      <Badge key={index} variant="secondary" className="transition-colors hover:bg-primary hover:text-primary-foreground">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  {project.github_url && (
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="gap-2 transition-all duration-200 hover:bg-[#1a1f36] hover:text-white dark:hover:bg-white dark:hover:text-[#1a1f36]" asChild>
                        <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                          <FiGithub className="h-4 w-4" />
                          Source Code
                        </a>
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Latest Blog Posts */}
      <section className="container mx-auto max-w-4xl px-4 py-8 sm:py-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight sm:mb-8 sm:text-2xl">Latest Blog Posts</h2>
          <Button variant="outline" className="h-8 w-fit sm:h-10 transition-all duration-200 hover:bg-[#1a1f36] hover:text-white dark:hover:bg-white dark:hover:text-[#1a1f36]" asChild>
            <a href="/blog">
              View All
              <FiExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>
        <div className="grid gap-6">
          {postsWithViews.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} scroll={false}>
              <Card className="group relative transition-all hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg group-hover:text-primary mb-2.5">
                        {post.title}
                      </CardTitle>
                      <PostMeta
                        date={post.date}
                        readingTime={post.reading_time}
                        views={post.views}
                        className="mt-1"
                      />
                    </div>
                    {post.category && (
                      <Badge variant="outline" className="min-w-[80px] h-6 flex items-center justify-center shrink-0">
                        {post.category}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {post.description}
                  </p>
                </CardContent>
                <div className="absolute inset-0 flex items-center justify-center bg-background/80 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                  <p className="text-sm font-medium">Continue reading →</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>
      
      {/* Currently Reading Section */}
      <section className="container mx-auto max-w-4xl px-4 py-8 sm:py-12">
      <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight sm:mb-8 sm:text-2xl">Currently Reading</h2>
          <Button variant="outline" className="h-8 w-fit sm:h-10 transition-all duration-200 hover:bg-[#1a1f36] hover:text-white dark:hover:bg-white dark:hover:text-[#1a1f36]" asChild>
            <a href="/library">
              View All
              <FiExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          {books
            .filter(book => book.status === 'Reading')
            .slice(0, 2)
            .map((book) => (
              <Card key={book.id} className="group relative overflow-hidden">
                <div className="flex p-6">
                  <div className="relative h-[120px] w-[80px] flex-shrink-0">
                    <Image
                      src={book.cover_image}
                      alt={book.title}
                      fill
                      className="rounded-sm object-contain"
                      sizes="80px"
                    />
                  </div>
                  <div className="ml-4 flex flex-col">
                    <h3 className="font-semibold group-hover:text-primary">
                      {book.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {book.author}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {Array.isArray(book.category) && book.category.map((cat, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {cat}
                        </Badge>
                      ))}
                    </div>
                    <div className="mt-auto">
                      <div className="mt-auto flex items-center gap-1 text-xs text-muted-foreground">
                        <FiStar className="h-3.5 w-3.5 fill-primary text-primary" />
                        <span className="flex items-center">{book.rating === 'Not rated' ? 'Not rated' : `${book.rating}`}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-background/80 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                  <p className="mx-6 text-sm text-center">
                    {book.description}
                  </p>
                </div>
              </Card>
            ))}
        </div>
      </section>

      {/* Certifications Section */}
      <section className="container mx-auto max-w-4xl px-4 py-8 sm:py-12">
        <h2 className="mb-6 text-xl font-bold tracking-tight sm:mb-8 sm:text-2xl">Certifications</h2>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <FiAward className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle className="text-lg">AWS Certified Solutions Architect</CardTitle>
                  <CardDescription>Amazon Web Services</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto max-w-4xl px-4 py-8 sm:py-12">
        <Separator className="mb-6 sm:mb-8" />
        <div className="flex flex-col items-center justify-between gap-4 text-xs text-muted-foreground sm:text-sm md:flex-row">
          <div>
            © 2024 {userProfile.name} {userProfile.surname}. All rights reserved.
          </div>
          <div className="flex gap-4">
            {userProfile.social_links?.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground"
              >
                {link.platform === 'github' && <FiGithub className="h-4 w-4" />}
                {link.platform === 'linkedin' && <FiLinkedin className="h-4 w-4" />}
                {link.platform === 'hackerrank' && <FontAwesomeIcon icon={faHackerrank} className="h-4 w-4" />}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </main>
  )
}
