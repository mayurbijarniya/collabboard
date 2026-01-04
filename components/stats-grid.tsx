"use client";

import { useEffect, useState } from "react";
import { Database, LayoutGrid, FileText, Building2, Users } from "lucide-react";

interface StatsData {
  totalUsers: number;
  totalOrgs: number;
  totalBoards: number;
  totalNotes: number;
}

export function StatsGrid() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/stats");
        if (res.ok) {
          const data = await res.json();
          setStats(data.totals);
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-2 animate-pulse">
            <div className="w-5 h-5 rounded bg-slate-200 dark:bg-slate-700" />
            <div className="h-5 w-14 bg-slate-200 dark:bg-slate-700 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const items = [
    { value: stats.totalBoards, label: "Boards", icon: LayoutGrid },
    { value: stats.totalNotes, label: "Notes", icon: FileText },
    { value: stats.totalOrgs, label: "Orgs", icon: Building2 },
    { value: stats.totalUsers, label: "Users", icon: Users },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
      {/* Live indicator */}
      <div className="flex items-center gap-2 pr-3 border-r border-slate-200 dark:border-zinc-700">
        <Database className="w-5 h-5 text-green-500 animate-pulse" />
        <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium">LIVE</span>
      </div>

      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-2 pl-2">
          <item.icon className="w-5 h-5 text-slate-400 dark:text-zinc-500" />
          <div className="text-left">
            <div className="text-xl font-bold text-slate-900 dark:text-white">
              {item.value.toLocaleString()}
            </div>
            <div className="text-xs text-slate-400 dark:text-zinc-500">
              {item.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
