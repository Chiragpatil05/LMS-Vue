<template>
  <app-layout page-title="Assignments">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">Assignments</h2>
        <p class="text-gray-600">
          {{ user.role === 'instructor' ? 'Manage and grade assignments' : 'View and submit your assignments' }}
        </p>
      </div>
      
      <div v-if="user.role === 'instructor'" class="flex space-x-3">
        <router-link to="/assignments/create" class="btn btn-primary">
          <span class="flex items-center">
            <svg class="w-5 h-5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create Assignment
          </span>
        </router-link>
      </div>
    </div>
    
    <!-- Filters -->
    <div class="bg-white rounded-lg p-4 shadow-sm mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label for="course" class="form-label">Course</label>
          <select 
            id="course" 
            v-model="filters.courseId" 
            class="form-input"
          >
            <option value="">All Courses</option>
            <option 
              v-for="course in courses" 
              :key="course.id" 
              :value="course.id"
            >
              {{ course.title }}
            </option>
          </select>
        </div>
        
        <div>
          <label for="status" class="form-label">Status</label>
          <select 
            id="status" 
            v-model="filters.status" 
            class="form-input"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="submitted">Submitted</option>
            <option value="graded">Graded</option>
          </select>
        </div>
        
        <div>
          <label for="search" class="form-label">Search</label>
          <input 
            id="search" 
            type="text" 
            v-model="filters.search" 
            placeholder="Search assignments..."
            class="form-input"
          />
        </div>
      </div>
    </div>
    
    <!-- Loading state -->
    <div v-if="loading" class="bg-white rounded-lg p-8 shadow-sm text-center">
      <div class="animate-pulse flex justify-center">
        <svg class="w-10 h-10 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      </div>
      <p class="mt-4 text-gray-600">Loading assignments...</p>
    </div>
    
    <!-- Empty state -->
    <div v-else-if="filteredAssignments.length === 0" class="bg-white rounded-lg p-8 shadow-sm text-center">
      <svg class="w-16 h-16 text-gray-400 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
      <h3 class="mt-4 text-lg font-medium text-gray-900">No assignments found</h3>
      <p class="mt-1 text-gray-500">
        {{ user.role === 'instructor' ? 'Create your first assignment to get started.' : 'No assignments match your current filters.' }}
      </p>
      
      <div class="mt-6" v-if="user.role === 'instructor'">
        <router-link to="/assignments/create" class="btn btn-primary">
          Create Assignment
        </router-link>
      </div>
      
      <div class="mt-6" v-else-if="hasFilters">
        <button @click="clearFilters" class="btn btn-outline">
          Clear Filters
        </button>
      </div>
    </div>
    
    <!-- Assignments list -->
    <div v-else class="space-y-4">
      <div 
        v-for="assignment in filteredAssignments" 
        :key="assignment.id" 
        class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
      >
        <div class="p-6">
          <div class="flex justify-between items-start">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">
                {{ assignment.title }}
              </h3>
              <p class="text-sm text-gray-600 mt-1">{{ assignment.description }}</p>
            </div>
            
            <div class="flex items-center space-x-2">
              <span 
                class="px-2 py-1 text-xs font-medium rounded-full"
                :class="{
                  'bg-warning-100 text-warning-800': isUpcoming(assignment.dueDate),
                  'bg-error-100 text-error-800': isOverdue(assignment.dueDate),
                  'bg-success-100 text-success-800': isSubmitted(assignment)
                }"
              >
                {{ getAssignmentStatus(assignment) }}
              </span>
            </div>
          </div>
          
          <div class="mt-4 flex items-center justify-between">
            <div class="flex items-center space-x-4 text-sm text-gray-500">
              <div class="flex items-center">
                <svg class="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                {{ getCourse(assignment.courseId)?.title || 'Unknown Course' }}
              </div>
              
              <div class="flex items-center">
                <svg class="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Due {{ formatDueDate(assignment.dueDate) }}
              </div>
              
              <div class="flex items-center">
                <svg class="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                {{ assignment.totalPoints }} points
              </div>
            </div>
            
            <div class="flex space-x-2">
              <router-link 
                :to="`/assignments/${assignment.id}`" 
                class="btn btn-primary py-1 px-3"
              >
                {{ user.role === 'instructor' ? 'View Submissions' : 'View Details' }}
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </app-layout>
</template>

<script>
import AppLayout from '../../components/layout/AppLayout.vue';
import axios from 'axios';

export default {
  name: 'AssignmentsList',
  components: {
    AppLayout
  },
  data() {
    return {
      user: null,
      assignments: [],
      courses: [],
      loading: true,
      filters: {
        courseId: '',
        status: '',
        search: ''
      }
    };
  },
  computed: {
    filteredAssignments() {
      return this.assignments.filter(assignment => {
        // Filter by course
        if (this.filters.courseId && assignment.courseId !== this.filters.courseId) {
          return false;
        }
        
        // Filter by status
        if (this.filters.status) {
          const status = this.getAssignmentStatus(assignment).toLowerCase();
          if (status !== this.filters.status) {
            return false;
          }
        }
        
        // Filter by search term
        if (this.filters.search) {
          const searchTerm = this.filters.search.toLowerCase();
          return assignment.title.toLowerCase().includes(searchTerm) || 
                 assignment.description.toLowerCase().includes(searchTerm);
        }
        
        return true;
      });
    },
    hasFilters() {
      return this.filters.courseId || this.filters.status || this.filters.search;
    }
  },
  methods: {
    clearFilters() {
      this.filters = {
        courseId: '',
        status: '',
        search: ''
      };
    },
    getCourse(courseId) {
      return this.courses.find(course => course.id === courseId);
    },
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
    isUpcoming(date) {
      const dueDate = new Date(date);
      const now = new Date();
      return dueDate > now;
    },
    isOverdue(date) {
      const dueDate = new Date(date);
      const now = new Date();
      return dueDate < now;
    },
    isSubmitted(assignment) {
      if (!assignment.submissions) return false;
      return assignment.submissions.some(submission => 
        submission.studentId === this.user.id
      );
    },
    getAssignmentStatus(assignment) {
      if (this.user.role === 'student') {
        if (this.isSubmitted(assignment)) {
          const submission = assignment.submissions.find(s => s.studentId === this.user.id);
          return submission.grade ? 'Graded' : 'Submitted';
        }
        return this.isOverdue(assignment.dueDate) ? 'Overdue' : 'Pending';
      } else {
        // For instructors, show submission stats
        const submissionCount = assignment.submissions?.length || 0;
        const gradedCount = assignment.submissions?.filter(s => s.grade !== undefined).length || 0;
        return `${gradedCount}/${submissionCount} Graded`;
      }
    },
    async fetchAssignments() {
      this.loading = true;
      
      try {
        let assignmentsResponse;
        
        if (this.user.role === 'instructor') {
          // Instructors see assignments for their courses
          const coursesResponse = await axios.get(`http://localhost:3000/courses?instructorId=${this.user.id}`);
          this.courses = coursesResponse.data;
          
          const courseIds = this.courses.map(course => course.id);
          assignmentsResponse = await axios.get('http://localhost:3000/assignments');
          this.assignments = assignmentsResponse.data.filter(assignment => 
            courseIds.includes(assignment.courseId)
          );
        } else {
          // Students see assignments from enrolled courses
          const enrollmentsResponse = await axios.get(`http://localhost:3000/enrollments?studentId=${this.user.id}`);
          const enrolledCourseIds = enrollmentsResponse.data.map(enrollment => enrollment.courseId);
          
          const coursesResponse = await axios.get(`http://localhost:3000/courses?${enrolledCourseIds.map(id => `id=${id}`).join('&')}`);
          this.courses = coursesResponse.data;
          
          assignmentsResponse = await axios.get('http://localhost:3000/assignments');
          this.assignments = assignmentsResponse.data.filter(assignment => 
            enrolledCourseIds.includes(assignment.courseId)
          );
        }
      } catch (error) {
        console.error('Error fetching assignments:', error);
      } finally {
        this.loading = false;
      }
    }
  },
  created() {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
      this.fetchAssignments();
    } else {
      this.$router.push('/login');
    }
  }
};
</script>