"use client"

import { useState, useEffect } from 'react'
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { ArrowUpRight, ArrowDownRight, Users, UserCheck, CalendarDays, Clock, Activity, Globe } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Mock data for charts
const visitorData = [
  { name: 'Jan', visitors: 4000 },
  { name: 'Feb', visitors: 3000 },
  { name: 'Mar', visitors: 5000 },
  { name: 'Apr', visitors: 4500 },
  { name: 'May', visitors: 6000 },
  { name: 'Jun', visitors: 5500 },
]

const pageViewData = [
  { name: 'Mon', views: 1000 },
  { name: 'Tue', views: 1200 },
  { name: 'Wed', views: 1500 },
  { name: 'Thu', views: 1300 },
  { name: 'Fri', views: 1400 },
  { name: 'Sat', views: 1100 },
  { name: 'Sun', views: 900 },
]

const bounceRateData = [
  { name: '1', rate: 35 },
  { name: '2', rate: 40 },
  { name: '3', rate: 38 },
  { name: '4', rate: 42 },
  { name: '5', rate: 36 },
  { name: '6', rate: 39 },
]

const geographicData = [
  { name: 'North America', value: 400 },
  { name: 'Europe', value: 300 },
  { name: 'Asia', value: 300 },
  { name: 'South America', value: 200 },
  { name: 'Africa', value: 100 },
  { name: 'Oceania', value: 50 },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d']

export default function Analytics() {
  const [realtimeUsers, setRealtimeUsers] = useState(0)

  useEffect(() => {
    // Simulate real-time user count updates
    const interval = setInterval(() => {
      setRealtimeUsers(Math.floor(Math.random() * 100) + 50)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 md:p-8">
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Real-time Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{realtimeUsers}</div>
            <p className="text-xs text-muted-foreground">
              <ArrowUpRight className="inline mr-1" />
              +2.5% from last hour
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234,567</div>
            <p className="text-xs text-muted-foreground">
              <ArrowUpRight className="inline mr-1" />
              +14.2% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Month Visitors</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89,721</div>
            <p className="text-xs text-muted-foreground">
              <ArrowUpRight className="inline mr-1" />
              +7.8% from previous month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Session Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3m 42s</div>
            <p className="text-xs text-muted-foreground">
              <ArrowDownRight className="inline mr-1" />
              -0.3% from last week
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Visitors</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                visitors: {
                  label: "Visitors",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={visitorData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area type="monotone" dataKey="visitors" stroke="var(--color-visitors)" fill="var(--color-visitors)" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Weekly Page Views</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                views: {
                  label: "Views",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pageViewData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="views" fill="var(--color-views)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Bounce Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                rate: {
                  label: "Bounce Rate",
                  color: "hsl(var(--chart-3))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={bounceRateData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="rate" stroke="var(--color-rate)" />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Geographic Distribution</CardTitle>
            <CardDescription>Visitors by region</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                region: {
                  label: "Region",
                  color: "hsl(var(--chart-4))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={geographicData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {geographicData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="grid grid-cols-3 gap-4 mt-4">
              {geographicData.map((entry, index) => (
                <div key={`legend-${index}`} className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  <span className="text-sm">{entry.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
            <CardDescription>Top channels bringing visitors to your site</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-16 text-sm font-medium">Organic</div>
                <div className="w-full">
                  <div className="h-4 w-3/4 bg-blue-500 rounded"></div>
                </div>
                <div className="w-16 text-sm font-medium text-right">75%</div>
              </div>
              <div className="flex items-center">
                <div className="w-16 text-sm font-medium">Direct</div>
                <div className="w-full">
                  <div className="h-4 w-1/2 bg-green-500 rounded"></div>
                </div>
                <div className="w-16 text-sm font-medium text-right">50%</div>
              </div>
              <div className="flex items-center">
                <div className="w-16 text-sm font-medium">Referral</div>
                <div className="w-full">
                  <div className="h-4 w-1/3 bg-yellow-500 rounded"></div>
                </div>
                <div className="w-16 text-sm font-medium text-right">33%</div>
              </div>
              <div className="flex items-center">
                <div className="w-16 text-sm font-medium">Social</div>
                <div className="w-full">
                  <div className="h-4 w-1/4 bg-red-500 rounded"></div>
                </div>
                <div className="w-16 text-sm font-medium text-right">25%</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Engagement</CardTitle>
            <CardDescription>Time spent on site</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <Activity className="h-4 w-4 mr-2 text-muted-foreground" />
                <div className="text-sm font-medium">Average session duration</div>
                <div className="ml-auto font-bold">3m 42s</div>
              </div>
              <div className="flex items-center">
                <Activity className="h-4 w-4 mr-2 text-muted-foreground" />
                <div className="text-sm font-medium">Pages per session</div>
                <div className="ml-auto font-bold">4.2</div>
              </div>
              <div className="flex items-center">
                <Activity className="h-4 w-4 mr-2 text-muted-foreground" />
                <div className="text-sm font-medium">Bounce rate</div>
                <div className="ml-auto font-bold">38.5%</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}