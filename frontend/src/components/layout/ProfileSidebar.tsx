import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowIcon } from "@/components/icons/Arrow";
import { fetchContactLinks, fetchProfile, fetchProjects } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { ContactLink, Profile, Project } from "@/types";

const PLATFORM_ICON_SRC: Record<string, string> = {
  github: "/github.svg",
  linkedin: "/linkedin.svg",
  instagram: "/instagram.svg",
};

const PROJECT_DOT_CLASSES = ["bg-brand", "bg-[#9F9FF8]", "bg-frontend", "bg-backend"];

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
      <section className="surface-card overflow-hidden rounded-[2rem]">
        {isLoading ? (
          <div className="flex flex-col items-center gap-4 p-8">
            <Skeleton className="h-32 w-32 rounded-2xl" />
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        ) : (
          <>
            <div className="brand-gradient relative h-24 w-full">
              <Avatar className="absolute -bottom-8 left-6 h-16 w-16 border-4 border-card bg-pink-100 dark:bg-pink-950">
                {profile?.avatar_url && (
                  <AvatarImage src={profile.avatar_url} alt={profile.name} />
                )}
                <AvatarFallback>{profile?.avatar_initials}</AvatarFallback>
              </Avatar>
            </div>

            <div className="space-y-1 px-6 pb-5 pt-11 text-left">
              <p className="text-lg font-semibold">{profile?.name}</p>
              <p className="text-sm text-muted-foreground">{profile?.bio}</p>
            </div>

            {contactLinks.length > 0 && (
              <div
                className="grid divide-x divide-border border-t border-border"
                style={{ gridTemplateColumns: `repeat(${contactLinks.length}, minmax(0, 1fr))` }}
              >
                {contactLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={link.label}
                    className="flex items-center justify-center py-3 transition-colors hover:bg-accent"
                  >
                    {PLATFORM_ICON_SRC[link.platform] ? (
                      <img src={PLATFORM_ICON_SRC[link.platform]} alt="" className="h-4 w-4" />
                    ) : (
                      <span className="text-xs font-medium text-brand">{link.label}</span>
                    )}
                  </a>
                ))}
              </div>
            )}
          </>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="px-2 text-sm font-medium text-muted-foreground">Projects</h2>

        <div className="surface-card space-y-1 rounded-[2rem] p-3">
          {isLoading ? (
            <>
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </>
          ) : (
            projects.map((project, index) => (
              <ProjectRow
                key={project.id}
                project={project}
                dotClassName={PROJECT_DOT_CLASSES[index % PROJECT_DOT_CLASSES.length]}
              />
            ))
          )}
        </div>
      </section>

      <Link
        to="/about"
        className="flex items-center justify-between rounded-[2rem] bg-brand px-6 py-4 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90"
      >
        Check my Portfolio
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/20">
          <ArrowIcon className="h-3 w-3 -rotate-90 text-brand-foreground" />
        </span>
      </Link>
    </aside>
  );
}

function ProjectRow({ project, dotClassName }: { project: Project; dotClassName: string }) {
  const content = (
    <div className="flex items-center gap-3 rounded-2xl px-3 py-3 transition-colors hover:bg-accent">
      <span className={cn("h-3 w-3 shrink-0 rounded-full", dotClassName)} />
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
