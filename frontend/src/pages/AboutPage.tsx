import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchProfile } from "@/lib/api";
import type { Profile } from "@/types";

export function AboutPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchProfile()
      .then((data) => {
        if (!cancelled) setProfile(data);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mx-auto max-w-2xl space-y-8 p-6 lg:p-10">
      <Link to="/" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
        ← Voltar para todos os posts
      </Link>

      <div className="space-y-6 rounded-2xl bg-card p-10 text-center">
        {isLoading ? (
          <div className="flex flex-col items-center gap-4">
            <Skeleton className="h-32 w-32 rounded-2xl" />
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : (
          <>
            <Avatar className="mx-auto h-32 w-32 bg-pink-100 dark:bg-pink-950">
              {profile?.avatar_url && (
                <AvatarImage src={profile.avatar_url} alt={profile.name} />
              )}
              <AvatarFallback>{profile?.avatar_initials}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-semibold">{profile?.name}</h1>
              <p className="text-sm text-muted-foreground">{profile?.role}</p>
            </div>
            <p className="text-left leading-relaxed text-foreground/90">{profile?.about}</p>
          </>
        )}
      </div>
    </div>
  );
}
