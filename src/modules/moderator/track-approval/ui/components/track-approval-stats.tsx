"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Music, Clock, CheckCircle, XCircle, TrendingUp, Users } from "lucide-react";

export function TrackApprovalStats() {
  // Mock data - in real app, this would come from an API
  const stats = {
    pendingTracks: 45,
    approvedToday: 12,
    rejectedToday: 3,
    avgApprovalTime: "2.5 hours",
    totalArtists: 23,
    weeklyTrend: "+15%",
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Tracks</CardTitle>
          <Clock className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.pendingTracks}</div>
          <p className="text-muted-foreground text-xs">Awaiting review</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Approved Today</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{stats.approvedToday}</div>
          <p className="text-muted-foreground text-xs">+2 from yesterday</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Rejected Today</CardTitle>
          <XCircle className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{stats.rejectedToday}</div>
          <p className="text-muted-foreground text-xs">-1 from yesterday</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg. Review Time</CardTitle>
          <TrendingUp className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.avgApprovalTime}</div>
          <p className="text-muted-foreground text-xs">
            <Badge variant="secondary" className="text-green-600">
              -30min
            </Badge>
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Artists</CardTitle>
          <Users className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalArtists}</div>
          <p className="text-muted-foreground text-xs">With pending tracks</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Weekly Growth</CardTitle>
          <Music className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.weeklyTrend}</div>
          <p className="text-muted-foreground text-xs">Track submissions</p>
        </CardContent>
      </Card>
    </div>
  );
}
