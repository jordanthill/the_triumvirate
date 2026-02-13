"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface RepoData {
  stars: number;
  forks: number;
  openIssues: number;
  size: number; // KB
  language: string;
  updatedAt: string;
  createdAt: string;
}

interface Contributor {
  login: string;
  contributions: number;
  avatar: string;
  url: string;
}

interface CommitData {
  sha: string;
  message: string;
  author: string;
  date: string;
}

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="p-4 rounded-xl glass text-center">
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-xs text-gray-500 mt-1">{label}</div>
      {sub && <div className="text-[10px] text-gray-600 mt-0.5">{sub}</div>}
    </div>
  );
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
}

export default function StatsPage() {
  const [repo, setRepo] = useState<RepoData | null>(null);
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [commits, setCommits] = useState<CommitData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const [repoRes, contribRes, commitsRes] = await Promise.all([
          fetch("https://api.github.com/repos/jordanthill/the_triumvirate"),
          fetch("https://api.github.com/repos/jordanthill/the_triumvirate/contributors"),
          fetch("https://api.github.com/repos/jordanthill/the_triumvirate/commits?per_page=10"),
        ]);

        if (!repoRes.ok) throw new Error("Failed to fetch repo data");

        const repoJson = await repoRes.json();
        setRepo({
          stars: repoJson.stargazers_count,
          forks: repoJson.forks_count,
          openIssues: repoJson.open_issues_count,
          size: repoJson.size,
          language: repoJson.language || "TypeScript",
          updatedAt: repoJson.updated_at,
          createdAt: repoJson.created_at,
        });

        if (contribRes.ok) {
          const contribJson = await contribRes.json();
          setContributors(
            (Array.isArray(contribJson) ? contribJson : []).map((c: Record<string, unknown>) => ({
              login: c.login as string,
              contributions: c.contributions as number,
              avatar: c.avatar_url as string,
              url: c.html_url as string,
            }))
          );
        }

        if (commitsRes.ok) {
          const commitsJson = await commitsRes.json();
          setCommits(
            (Array.isArray(commitsJson) ? commitsJson : []).map((c: Record<string, unknown>) => {
              const commit = c.commit as Record<string, unknown>;
              const commitAuthor = commit.author as Record<string, string>;
              return {
                sha: (c.sha as string).slice(0, 7),
                message: (commit.message as string).split("\n")[0],
                author: commitAuthor.name,
                date: commitAuthor.date,
              };
            })
          );
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const totalContributions = contributors.reduce((s, c) => s + c.contributions, 0);
  const daysSinceCreation = repo
    ? Math.floor((Date.now() - new Date(repo.createdAt).getTime()) / 86400000)
    : 0;

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="text-gray-500 hover:text-white transition-colors text-sm"
        >
          &larr; Home
        </Link>
        <h1 className="text-2xl font-bold text-white">Site Stats</h1>
        {loading && (
          <span className="text-xs text-indigo-400 animate-pulse ml-2">
            Loading from GitHub...
          </span>
        )}
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error} &mdash; GitHub API may be rate-limited. Try again in a minute.
        </div>
      )}

      {repo && (
        <>
          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard label="Total Commits" value={totalContributions} />
            <StatCard label="Contributors" value={contributors.length} />
            <StatCard label="Stars" value={repo.stars} />
            <StatCard label="Forks" value={repo.forks} />
            <StatCard label="Open Issues" value={repo.openIssues} />
            <StatCard
              label="Repo Size"
              value={`${(repo.size / 1024).toFixed(1)} MB`}
            />
            <StatCard label="Language" value={repo.language} />
            <StatCard label="Days Active" value={daysSinceCreation} />
          </div>

          {/* Contributors */}
          {contributors.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-white">Contributors</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {contributors.map((c) => {
                  const pct = totalContributions
                    ? Math.round((c.contributions / totalContributions) * 100)
                    : 0;
                  return (
                    <a
                      key={c.login}
                      href={c.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 rounded-xl glass glass-hover transition-all group"
                    >
                      <img
                        src={c.avatar}
                        alt={c.login}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-white text-sm group-hover:text-indigo-400 transition-colors truncate">
                          {c.login}
                        </div>
                        <div className="text-xs text-gray-500">
                          {c.contributions} commits
                        </div>
                        {/* Progress bar */}
                        <div className="mt-1.5 h-1 rounded-full bg-white/5 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-indigo-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-xs font-medium text-gray-500">{pct}%</span>
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          {/* Recent commits */}
          {commits.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-white">Recent Commits</h2>
              <div className="glass rounded-2xl divide-y divide-white/5">
                {commits.map((c) => (
                  <div key={c.sha} className="flex items-start gap-3 px-4 py-3">
                    <code className="text-xs text-indigo-400 font-mono bg-indigo-500/10 px-2 py-0.5 rounded mt-0.5 shrink-0">
                      {c.sha}
                    </code>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-gray-300 truncate">{c.message}</p>
                      <p className="text-[10px] text-gray-600 mt-0.5">
                        {c.author} &middot; {timeAgo(c.date)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Last updated */}
          <p className="text-center text-xs text-gray-600">
            Last updated: {timeAgo(repo.updatedAt)} &middot; Data from GitHub API
          </p>
        </>
      )}

      {loading && !repo && (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 rounded-xl glass animate-pulse" />
          ))}
        </div>
      )}
    </div>
  );
}
