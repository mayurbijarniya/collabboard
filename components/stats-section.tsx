"use client";

import React, { useState, useEffect } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

interface TotalsData {
  totalUsers: number;
  totalOrgs: number;
  totalBoards: number;
  totalNotes: number;
  totalChecklistItems: number;
}

const statsData = [
  { key: "totalOrgs", label: "Organizations" },
  { key: "totalUsers", label: "Users" },
  { key: "totalBoards", label: "Boards" },
  { key: "totalNotes", label: "Notes" },
  { key: "totalChecklistItems", label: "Checklist Items" },
] as const;

export function StatsSection() {
  const [totals, setTotals] = useState<TotalsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/stats");
      if (response.ok) {
        const { totals } = await response.json();
        setTotals(totals);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !totals) {
    return null;
  }

  return (
    <section className="py-16 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Platform Growth</h2>
          <p className="text-lg text-muted-foreground">
            Platform metrics showing the progression from organizations to checklist items
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-6">
          {statsData.map((stat, index) => (
            <React.Fragment key={stat.key}>
              <Card className="w-full lg:w-auto lg:min-w-[180px]">
                <CardHeader className="pb-2 text-center">
                  <CardDescription className="text-xs text-muted-foreground">
                    {stat.label}
                  </CardDescription>
                  <CardTitle className="text-2xl font-bold text-foreground">
                    {totals[stat.key].toLocaleString()}
                  </CardTitle>
                </CardHeader>
              </Card>
              {index < statsData.length - 1 && (
                <ArrowRight className="hidden lg:block w-6 h-6 text-muted-foreground" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
