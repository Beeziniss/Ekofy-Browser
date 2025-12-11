"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Music, Users, DollarSign, Play, Heart } from "lucide-react";

const Page = () => {
  // Mock data
  const stats = [
    {
      title: "Total Streams",
      value: "1,234,567",
      change: "+12.5%",
      trend: "up",
      icon: Play,
      color: "text-green-500",
    },
    {
      title: "Total Revenue",
      value: "$45,678",
      change: "+8.3%",
      trend: "up",
      icon: DollarSign,
      color: "text-blue-500",
    },
    {
      title: "Followers",
      value: "89,432",
      change: "+5.2%",
      trend: "up",
      icon: Users,
      color: "text-purple-500",
    },
    {
      title: "Total Tracks",
      value: "156",
      change: "+3",
      trend: "up",
      icon: Music,
      color: "text-orange-500",
    },
  ];

  const recentTracks = [
    { id: 1, title: "Midnight Dreams", plays: 45678, likes: 3421, revenue: "$1,234" },
    { id: 2, title: "Summer Vibes", plays: 38912, likes: 2890, revenue: "$987" },
    { id: 3, title: "Electric Soul", plays: 29384, likes: 2145, revenue: "$745" },
    { id: 4, title: "Ocean Waves", plays: 21567, likes: 1678, revenue: "$562" },
    { id: 5, title: "Urban Nights", plays: 18934, likes: 1432, revenue: "$478" },
  ];

  const monthlyData = [
    { month: "Jan", streams: 45000, revenue: 3200 },
    { month: "Feb", streams: 52000, revenue: 3800 },
    { month: "Mar", streams: 48000, revenue: 3500 },
    { month: "Apr", streams: 61000, revenue: 4200 },
    { month: "May", streams: 73000, revenue: 5100 },
    { month: "Jun", streams: 89000, revenue: 6300 },
  ];

  const topCountries = [
    { country: "United States", percentage: 35, streams: 432100 },
    { country: "United Kingdom", percentage: 18, streams: 221800 },
    { country: "Germany", percentage: 12, streams: 147900 },
    { country: "France", percentage: 10, streams: 123400 },
    { country: "Japan", percentage: 8, streams: 98700 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="container mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white">Artist Studio</h1>
            <p className="mt-1 text-slate-300">Welcome back! Here&apos;s your performance overview</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-400">Last updated</p>
            <p className="font-semibold text-white">Dec 12, 2025</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="border-slate-700 bg-slate-800/50 backdrop-blur">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-300">{stat.title}</CardTitle>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="mt-2 flex items-center text-xs">
                    {stat.trend === "up" ? (
                      <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="mr-1 h-4 w-4 text-red-500" />
                    )}
                    <span className={stat.trend === "up" ? "text-green-500" : "text-red-500"}>{stat.change}</span>
                    <span className="ml-1 text-slate-400">from last month</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Monthly Performance */}
          <Card className="border-slate-700 bg-slate-800/50 backdrop-blur lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-white">Monthly Performance</CardTitle>
              <p className="text-sm text-slate-400">Streams and revenue over the last 6 months</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monthlyData.map((data, index) => {
                  const maxStreams = Math.max(...monthlyData.map((d) => d.streams));
                  const streamPercentage = (data.streams / maxStreams) * 100;
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="w-12 font-medium text-slate-300">{data.month}</span>
                        <span className="text-slate-400">{data.streams.toLocaleString()} streams</span>
                        <span className="font-semibold text-green-400">${data.revenue.toLocaleString()}</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-700">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                          style={{ width: `${streamPercentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Top Countries */}
          <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-white">Top Countries</CardTitle>
              <p className="text-sm text-slate-400">Your biggest markets</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topCountries.map((country, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-300">{country.country}</span>
                      <span className="text-sm text-slate-400">{country.percentage}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-700">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"
                        style={{ width: `${country.percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-500">{country.streams.toLocaleString()} streams</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Tracks Performance */}
        <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-white">Top Performing Tracks</CardTitle>
            <p className="text-sm text-slate-400">Your best tracks this month</p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">#</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Track Name</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-slate-300">Plays</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-slate-300">Likes</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-slate-300">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTracks.map((track, index) => (
                    <tr key={track.id} className="border-b border-slate-700/50 transition-colors hover:bg-slate-700/30">
                      <td className="px-4 py-4 text-slate-400">{index + 1}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded bg-gradient-to-br from-purple-500 to-pink-500">
                            <Music className="h-5 w-5 text-white" />
                          </div>
                          <span className="font-medium text-white">{track.title}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <Play className="h-4 w-4 text-green-400" />
                          <span className="text-slate-300">{track.plays.toLocaleString()}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <Heart className="h-4 w-4 text-red-400" />
                          <span className="text-slate-300">{track.likes.toLocaleString()}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span className="font-semibold text-green-400">{track.revenue}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <button className="rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 font-semibold text-white shadow-lg transition-all duration-200 hover:from-purple-700 hover:to-pink-700 hover:shadow-xl">
            Upload New Track
          </button>
          <button className="rounded-lg bg-slate-700 px-6 py-4 font-semibold text-white transition-all duration-200 hover:bg-slate-600">
            View Analytics
          </button>
          <button className="rounded-lg bg-slate-700 px-6 py-4 font-semibold text-white transition-all duration-200 hover:bg-slate-600">
            Manage Tracks
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
