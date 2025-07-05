import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  Calendar, 
  MessageSquare, 
  TrendingUp,
  Clock,
  CheckCircle,
  User,
  Star,
  BookOpen,
  Target,
  Award
} from 'lucide-react';
import { Link } from 'wouter';

export default function MentorDashboard() {
  const { currentUser, userProfile, logout } = useAuth();

  const nextSession = {
    date: 'Today',
    time: '3:00 PM',
    student: 'Alex Chen',
    topic: 'Resume Review & Interview Prep'
  };

  const students = [
    { 
      id: 1, 
      name: 'Alex Chen', 
      university: 'University of Toronto', 
      program: 'Computer Science', 
      progress: 65,
      lastActive: '2 days ago'
    },
    { 
      id: 2, 
      name: 'Sarah Kim', 
      university: 'McGill University', 
      program: 'Business Administration', 
      progress: 45,
      lastActive: '1 week ago'
    },
    { 
      id: 3, 
      name: 'Michael Rodriguez', 
      university: 'UBC', 
      program: 'Engineering', 
      progress: 80,
      lastActive: '3 days ago'
    },
  ];

  const recentActivities = [
    { id: 1, action: 'Completed session with Alex Chen', date: '2 hours ago', icon: CheckCircle, color: 'text-green-600' },
    { id: 2, action: 'Reviewed Sarah\'s assignment submission', date: '1 day ago', icon: BookOpen, color: 'text-blue-600' },
    { id: 3, action: 'Provided feedback on career goals', date: '2 days ago', icon: Target, color: 'text-purple-600' },
  ];

  const monthlyStats = [
    { label: 'Sessions Conducted', value: 18, change: '+12%' },
    { label: 'Student Engagement', value: 92, change: '+5%' },
    { label: 'Goals Achieved', value: 14, change: '+8%' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Welcome, {userProfile?.displayName || currentUser?.email?.split('@')[0]}!
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  AspireLink Mentor Dashboard
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                Mentor
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
                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center mr-3">
                  <Users className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Students</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">3</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <Calendar className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Next Session</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">Today</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                  <Star className="w-4 h-4 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Rating</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">4.9</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <Award className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Impact Score</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">92</p>
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
                  <Calendar className="w-5 h-5 mr-2 text-emerald-600" />
                  Upcoming Session
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                        {nextSession.topic}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        with {nextSession.student}
                      </p>
                    </div>
                    <Badge className="bg-emerald-600 text-white">
                      {nextSession.date} at {nextSession.time}
                    </Badge>
                  </div>
                  <div className="flex space-x-3">
                    <Button size="sm">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Start Session
                    </Button>
                    <Button variant="outline" size="sm">
                      <Clock className="w-4 h-4 mr-2" />
                      Reschedule
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Your Students */}
            <Card>
              <CardHeader>
                <CardTitle>Your Students</CardTitle>
                <CardDescription>
                  Track progress and manage your mentorship relationships
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {students.map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">{student.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {student.program} • {student.university}
                          </p>
                          <p className="text-xs text-gray-500">Last active: {student.lastActive}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {student.progress}% Complete
                          </p>
                          <Progress value={student.progress} className="w-20 h-2 mt-1" />
                        </div>
                        <Button variant="outline" size="sm">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Message
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
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
            {/* Monthly Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                  This Month
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {monthlyStats.map((stat, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {stat.label}
                      </p>
                      <p className="text-xs text-gray-500">{stat.change} vs last month</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {stat.value}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Session
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Create Assignment
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Star className="w-4 h-4 mr-2" />
                  Leave Feedback
                </Button>
              </CardContent>
            </Card>

            {/* Mentor Resources */}
            <Card>
              <CardHeader>
                <CardTitle>Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="ghost" className="w-full justify-start text-left">
                  <BookOpen className="w-4 h-4 mr-2" />
                  <div>
                    <p className="font-medium">Mentoring Guide</p>
                    <p className="text-xs text-gray-500">Best practices & tips</p>
                  </div>
                </Button>
                <Button variant="ghost" className="w-full justify-start text-left">
                  <Users className="w-4 h-4 mr-2" />
                  <div>
                    <p className="font-medium">Community Forum</p>
                    <p className="text-xs text-gray-500">Connect with other mentors</p>
                  </div>
                </Button>
                <Button variant="ghost" className="w-full justify-start text-left">
                  <Target className="w-4 h-4 mr-2" />
                  <div>
                    <p className="font-medium">Training Materials</p>
                    <p className="text-xs text-gray-500">Improve your skills</p>
                  </div>
                </Button>
              </CardContent>
            </Card>

            {/* Program Impact */}
            <Card>
              <CardHeader>
                <CardTitle>Your Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Total Students Mentored</span>
                    <span className="text-sm font-medium">12</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Sessions Completed</span>
                    <span className="text-sm font-medium">89</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Success Rate</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      94%
                    </Badge>
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