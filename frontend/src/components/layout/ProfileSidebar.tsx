import { useEffect, useState } from "react";
import { Github, Linkedin } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { ContactIcon } from "@/components/icons/Contact";
import { ProfileIcon } from "@/components/icons/Profile";
import { ProjectIcon } from "@/components/icons/Project";
import { fetchContactLinks, fetchProfile, fetchProjects } from "@/lib/api";
import type { ContactLink, Profile, Project } from "@/types";

const PLATFORM_ICON = {
  github: Github,
  linkedin: Linkedin,
} as const;

export function ProfileSidebar() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [contactLinks, setContactLinks] = useState<ContactLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all([fetchProfile(), fetchProjects(), fetchContactLinks()])
      .then(([profileData, projectsData, contactData]) => {
        if (cancelled) return;
        setProfile(profileData);
        setProjects(projectsData);
        setContactLinks(contactData);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <aside className="flex h-fit flex-col gap-6">
      <section className="space-y-4">
        <SectionHeading icon={<ProfileIcon className="h-5 w-5" />} label="Profile" />

        <div className="flex flex-col items-center gap-4 rounded-2xl bg-card p-8 text-center">
          {isLoading ? (
            <>
              <Skeleton className="h-32 w-32 rounded-2xl" />
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-24" />
            </>
          ) : (
            <>
              <Avatar className="h-32 w-32 bg-pink-100 dark:bg-pink-950">
                {profile?.avatar_url && <AvatarImage src={profile.avatar_url} alt={profile.name} />}
                <AvatarFallback>{profile?.avatar_initials}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-xl font-semibold">{profile?.name}</p>
                <p className="text-sm text-muted-foreground">{profile?.role}</p>
              </div>
            </>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeading icon={<ProjectIcon className="h-5 w-5" />} label="Projects" />

        <div className="space-y-2 rounded-2xl bg-card p-4">
          {isLoading ? (
            <>
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </>
          ) : (
            projects.map((project) => (
              <ProjectRow key={project.id} project={project} />
            ))
          )}
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeading icon={<ContactIcon className="h-5 w-5" />} label="Contact" />

        <div className="space-y-2 rounded-2xl bg-card p-4">
          {isLoading ? (
            <>
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </>
          ) : (
            contactLinks.map((link) => <ContactRow key={link.id} link={link} />)
          )}
        </div>
      </section>
    </aside>
  );
}

function SectionHeading({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 text-lg font-semibold">
      {icon}
      {label}
    </div>
  );
}

function ProjectRow({ project }: { project: Project }) {
  const content = (
    <div className="flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-accent">
      <span className="h-9 w-9 shrink-0 rounded-lg bg-muted" />
      <span className="text-sm font-medium">{project.name}</span>
    </div>
  );

  if (!project.url) return content;

  return (
    <a href={project.url} target="_blank" rel="noreferrer">
      {content}
    </a>
  );
}

function ContactRow({ link }: { link: ContactLink }) {
  const Icon = PLATFORM_ICON[link.platform as keyof typeof PLATFORM_ICON] ?? Github;

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-accent"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
        <Icon className="h-4 w-4" />
      </span>
      <span className="text-sm font-medium">{link.label}</span>
    </a>
  );
}
