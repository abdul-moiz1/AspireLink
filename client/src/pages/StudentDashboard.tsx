import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  Calendar, 
  MessageSquare, 
  Target, 
  TrendingUp,
  Clock,
  CheckCircle,
  User,
  Users,
  Award
} from 'lucide-react';

export default function StudentDashboard() {
  const { currentUser, userProfile, logout } = useAuth();

  const nextSession = {
    date: 'Tomorrow',
    time: '2:00 PM',
    mentor: 'Sarah Johnson',
    topic: 'Career Planning & Goal Setting'
  };

  const recentActivities = [
    { id: 1, action: 'Completed session with mentor', date: '2 days ago', icon: CheckCircle, color: 'text-green-600' },
    { id: 2, action: 'Submitted reflection assignment', date: '3 days ago', icon: BookOpen, color: 'text-blue-600' },
    { id: 3, action: 'Joined career development workshop', date: '1 week ago', icon: Users, color: 'text-purple-600' },
  ];

  const progressStats = [
    { label: 'Sessions Completed', value: 6, total: 16, percentage: 37.5 },
    { label: 'Goals Achieved', value: 3, total: 8, percentage: 37.5 },
    { label: 'Assignments Submitted', value: 4, total: 6, percentage: 66.7 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Welcome back, {userProfile?.displayName || currentUser?.email?.split('@')[0]}!
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  AspireLink Student Dashboard
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Student
              </Badge>
              <Button variant="outline" onClick={logout}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <Calendar className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Next Session</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">Tomorrow</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Progress</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">38%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <Target className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Goals</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">3/8</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                  <Award className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Achievements</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">5</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Next Session */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                  Upcoming Session
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                        {nextSession.topic}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        with {nextSession.mentor}
                      </p>
                    </div>
                    <Badge className="bg-blue-600 text-white">
                      {nextSession.date} at {nextSession.time}
                    </Badge>
                  </div>
                  <div className="flex space-x-3">
                    <Button size="sm">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Join Session
                    </Button>
                    <Button variant="outline" size="sm">
                      <Clock className="w-4 h-4 mr-2" />
                      Reschedule
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Progress Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Your Progress</CardTitle>
                <CardDescription>
                  Track your mentorship journey and achievements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {progressStats.map((stat, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {stat.label}
                      </span>
                      <span className="text-sm text-gray-500">
                        {stat.value}/{stat.total}
                      </span>
                    </div>
                    <Progress value={stat.percentage} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center`}>
                        <activity.icon className={`w-4 h-4 ${activity.color}`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {activity.action}
                        </p>
                        <p className="text-xs text-gray-500">{activity.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Mentor Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2 text-emerald-600" />
                  Your Mentor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <User className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                    Sarah Johnson
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                    Senior Product Manager at TechCorp
                  </p>
                  <p className="text-xs text-gray-500 mb-4">
                    5 years experience • Toronto, ON
                  </p>
                  <Button size="sm" className="w-full">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <BookOpen className="w-4 h-4 mr-2" />
                  View Assignments
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Session
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Target className="w-4 h-4 mr-2" />
                  Update Goals
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Join Community
                </Button>
              </CardContent>
            </Card>

            {/* Program Info */}
            <Card>
              <CardHeader>
                <CardTitle>Program Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Program Start</span>
                    <span className="text-sm font-medium">Jan 15, 2025</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Current Phase</span>
                    <Badge variant="secondary">Month 2</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Program End</span>
                    <span className="text-sm font-medium">May 15, 2025</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}