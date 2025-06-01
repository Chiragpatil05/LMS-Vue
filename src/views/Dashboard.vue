<template>
  <app-layout page-title="Dashboard">
    <div class="space-y-6">
      <!-- Welcome section -->
      <div class="bg-white shadow-sm rounded-lg overflow-hidden">
        <div class="px-6 py-5 sm:px-8 sm:py-6 bg-gradient-to-r from-primary-600 to-accent-600 text-white">
          <h2 class="text-xl font-semibold">Welcome back, {{ user.name }}!</h2>
          <p class="mt-1 text-primary-100">Here's an overview of your learning journey</p>
        </div>
        <div class="px-6 py-4 sm:px-8 sm:py-6 bg-white">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-primary-50 rounded-lg p-4 text-center">
              <p class="text-sm font-medium text-primary-600">Enrolled Courses</p>
              <p class="mt-2 text-3xl font-bold text-primary-800">{{ enrolledCoursesCount }}</p>
            </div>
            <div class="bg-secondary-50 rounded-lg p-4 text-center">
              <p class="text-sm font-medium text-secondary-600">Pending Assignments</p>
              <p class="mt-2 text-3xl font-bold text-secondary-800">{{ pendingAssignmentsCount }}</p>
            </div>
            <div class="bg-accent-50 rounded-lg p-4 text-center">
              <p class="text-sm font-medium text-accent-600">Upcoming Quizzes</p>
              <p class="mt-2 text-3xl font-bold text-accent-800">{{ upcomingQuizzesCount }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Upcoming deadlines -->
        <div class="lg:col-span-2">
          <h3 class="text-lg font-medium text-gray-800 mb-4">Upcoming Deadlines</h3>
          <div class="bg-white shadow-sm rounded-lg divide-y divide-gray-200">
            <div v-if="upcomingDeadlines.length === 0" class="p-6 text-center text-gray-500">
              No upcoming deadlines
            </div>
            <div 
              v-for="item in upcomingDeadlines" 
              :key="item.id" 
              class="p-4 hover:bg-gray-50 transition-colors duration-150"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <div 
                    class="flex-shrink-0 h-10 w-10 rounded-md flex items-center justify-center"
                    :class="{
                      'bg-primary-100 text-primary-600': item.type === 'course',
                      'bg-secondary-100 text-secondary-600': item.type === 'assignment',
                      'bg-accent-100 text-accent-600': item.type === 'quiz'
                    }"
                  >
                    <svg v-if="item.type === 'course'" class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <svg v-else-if="item.type === 'assignment'" class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <svg v-else class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div class="ml-4">
                    <h4 class="text-sm font-medium text-gray-900">{{ item.title }}</h4>
                    <p class="text-sm text-gray-500">{{ item.course }}</p>
                  </div>
                </div>
                <div class="text-right">
                  <p 
                    class="text-sm font-medium"
                    :class="{
                      'text-error-600': isUrgent(item.dueDate),
                      'text-warning-600': isSoon(item.dueDate),
                      'text-gray-500': !isUrgent(item.dueDate) && !isSoon(item.dueDate)
                    }"
                  >
                    {{ formatDueDate(item.dueDate) }}
                  </p>
                  <p class="text-xs text-gray-500 capitalize">{{ item.type }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent activities -->
        <div>
          <h3 class="text-lg font-medium text-gray-800 mb-4">Recent Activity</h3>
          <div class="bg-white shadow-sm rounded-lg divide-y divide-gray-200">
            <div v-if="activities.length === 0" class="p-6 text-center text-gray-500">
              No recent activities
            </div>
            <div 
              v-for="activity in activities" 
              :key="activity.id" 
              class="p-4"
            >
              <div class="flex space-x-3">
                <div class="flex-shrink-0">
                  <div 
                    class="h-8 w-8 rounded-full flex items-center justify-center"
                    :class="{
                      'bg-primary-100 text-primary-600': activity.type === 'course',
                      'bg-secondary-100 text-secondary-600': activity.type === 'assignment',
                      'bg-accent-100 text-accent-600': activity.type === 'quiz',
                      'bg-success-100 text-success-600': activity.type === 'grade'
                    }"
                  >
                    <svg v-if="activity.type === 'course'" class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <svg v-else-if="activity.type === 'assignment'" class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <svg v-else-if="activity.type === 'quiz'" class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <svg v-else class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
                <div class="min-w-0 flex-1">
                  <p class="text-sm text-gray-800">{{ activity.message }}</p>
                  <p class="text-xs text-gray-500 mt-1">{{ formatActivityDate(activity.date) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Progress section -->
      <div v-if="user.role === 'student'" class="mt-6">
        <h3 class="text-lg font-medium text-gray-800 mb-4">Your Progress</h3>
        <div class="bg-white shadow-sm rounded-lg p-6">
          <div v-if="courses.length === 0" class="text-center text-gray-500">
            No enrolled courses to show progress
          </div>
          <div v-else class="space-y-4">
            <div v-for="course in courses.slice(0, 3)" :key="course.id" class="mb-3">
              <div class="flex justify-between items-center mb-2">
                <span class="text-sm font-medium text-gray-900">{{ course.title }}</span>
                <span class="text-sm text-gray-500">{{ course.progress }}% complete</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  class="h-2.5 rounded-full"
                  :class="{
                    'bg-success-500': course.progress > 66,
                    'bg-warning-500': course.progress > 33 && course.progress <= 66,
                    'bg-primary-500': course.progress <= 33
                  }"
                  :style="`width: ${course.progress}%`"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Instructor stats -->
      <div v-if="user.role === 'instructor'" class="mt-6">
        <h3 class="text-lg font-medium text-gray-800 mb-4">Your Courses</h3>
        <div class="bg-white shadow-sm rounded-lg overflow-hidden">
          <div class="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200">
            <div class="p-6 text-center">
              <p class="text-sm font-medium text-gray-500">Total Students</p>
              <p class="mt-2 text-3xl font-semibold text-gray-900">{{ totalStudents }}</p>
            </div>
            <div class="p-6 text-center">
              <p class="text-sm font-medium text-gray-500">Average Rating</p>
              <p class="mt-2 text-3xl font-semibold text-gray-900">{{ averageRating }}/5</p>
            </div>
            <div class="p-6 text-center">
              <p class="text-sm font-medium text-gray-500">Course Completion Rate</p>
              <p class="mt-2 text-3xl font-semibold text-gray-900">{{ completionRate }}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </app-layout>
</template>

<script>
import AppLayout from '../components/layout/AppLayout.vue';
import axios from 'axios';

export default {
  name: 'Dashboard',
  components: {
    AppLayout
  },
  data() {
    return {
      user: null,
      courses: [],
      enrolledCoursesCount: 0,
      pendingAssignmentsCount: 0,
      upcomingQuizzesCount: 0,
      upcomingDeadlines: [],
      activities: [],
      totalStudents: 0,
      averageRating: 0,
      completionRate: 0
    };
  },
  methods: {
    formatDueDate(date) {
      const dueDate = new Date(date);
      const now = new Date();
      
      // Calculate difference in days
      const diffTime = dueDate - now;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 0) {
        return 'Overdue';
      } else if (diffDays === 0) {
        return 'Due today';
      } else if (diffDays === 1) {
        return 'Due tomorrow';
      } else {
        return `Due in ${diffDays} days`;
      }
    },
    isUrgent(date) {
      const dueDate = new Date(date);
      const now = new Date();
      
      const diffTime = dueDate - now;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      return diffDays <= 1;
    },
    isSoon(date) {
      const dueDate = new Date(date);
      const now = new Date();
      
      const diffTime = dueDate - now;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      return diffDays > 1 && diffDays <= 3;
    },
    formatActivityDate(date) {
      const activityDate = new Date(date);
      const now = new Date();
      
      // Calculate difference in hours
      const diffTime = now - activityDate;
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      
      if (diffHours < 1) {
        return 'Just now';
      } else if (diffHours < 24) {
        return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
      } else {
        const diffDays = Math.floor(diffHours / 24);
        if (diffDays < 7) {
          return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        } else {
          return activityDate.toLocaleDateString();
        }
      }
    },
    async fetchDashboardData() {
      try {
        if (this.user.role === 'student') {
          // Fetch enrolled courses
          const coursesResponse = await axios.get(`http://localhost:3000/enrollments?studentId=${this.user.id}`);
          this.enrolledCoursesCount = coursesResponse.data.length;
          
          // Fetch courses details
          if (coursesResponse.data.length > 0) {
            const courseIds = coursesResponse.data.map(enrollment => enrollment.courseId);
            const courseDetailsResponse = await axios.get(`http://localhost:3000/courses?${courseIds.map(id => `id=${id}`).join('&')}`);
            this.courses = courseDetailsResponse.data.map(course => ({
              ...course,
              progress: Math.floor(Math.random() * 100) // Simulated progress
            }));
          }
          
          // Fetch pending assignments
          const assignmentsResponse = await axios.get(`http://localhost:3000/assignments`);
          this.pendingAssignmentsCount = assignmentsResponse.data.filter(assignment => 
            !assignment.submissions || !assignment.submissions.some(s => s.studentId === this.user.id)
          ).length;
          
          // Fetch upcoming quizzes
          const quizzesResponse = await axios.get(`http://localhost:3000/quizzes`);
          this.upcomingQuizzesCount = quizzesResponse.data.filter(quiz => 
            !quiz.attempts || !quiz.attempts.some(a => a.studentId === this.user.id)
          ).length;
          
        } else if (this.user.role === 'instructor') {
          // Fetch instructor courses
          const coursesResponse = await axios.get(`http://localhost:3000/courses?instructorId=${this.user.id}`);
          this.courses = coursesResponse.data;
          
          // Simulate instructor statistics
          this.totalStudents = coursesResponse.data.reduce((total, course) => {
            return total + (course.enrolledStudents?.length || 0);
          }, 0);
          
          this.averageRating = this.courses.length > 0 
            ? (this.courses.reduce((sum, course) => sum + (course.rating || 0), 0) / this.courses.length).toFixed(1) 
            : 0;
          
          this.completionRate = Math.floor(Math.random() * 40) + 60; // Random between 60-100%
        }
        
        // Fetch upcoming deadlines
        this.upcomingDeadlines = [
          {
            id: 1,
            type: 'assignment',
            title: 'JavaScript Fundamentals',
            course: 'Web Development Basics',
            dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // 2 days from now
          },
          {
            id: 2,
            type: 'quiz',
            title: 'HTML & CSS Quiz',
            course: 'Web Development Basics',
            dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) // 5 days from now
          },
          {
            id: 3,
            type: 'assignment',
            title: 'Final Project Submission',
            course: 'Advanced JavaScript',
            dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000) // 10 days from now
          }
        ];
        
        // Mock activities
        this.activities = [
          {
            id: 1,
            type: 'assignment',
            message: 'You submitted "CSS Layouts" assignment',
            date: new Date(Date.now() - 3 * 60 * 60 * 1000) // 3 hours ago
          },
          {
            id: 2,
            type: 'course',
            message: 'You completed "HTML Basics" lesson',
            date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
          },
          {
            id: 3,
            type: 'quiz',
            message: 'You scored 85% on "JavaScript Basics" quiz',
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
          },
          {
            id: 4,
            type: 'grade',
            message: 'Your "Responsive Design" assignment was graded: A',
            date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) // 4 days ago
          }
        ];
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    }
  },
  created() {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
      this.fetchDashboardData();
    } else {
      this.$router.push('/login');
    }
  }
};
</script>