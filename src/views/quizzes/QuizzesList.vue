<template>
  <app-layout page-title="Quizzes">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">Quizzes</h2>
        <p class="text-gray-600">
          {{ user.role === 'instructor' ? 'Manage and create quizzes' : 'Take quizzes and view your results' }}
        </p>
      </div>
      
      <div v-if="user.role === 'instructor'" class="flex space-x-3">
        <router-link to="/quizzes/create" class="btn btn-primary">
          <span class="flex items-center">
            <svg class="w-5 h-5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create Quiz
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
            <option value="pending">Not Attempted</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        
        <div>
          <label for="search" class="form-label">Search</label>
          <input 
            id="search" 
            type="text" 
            v-model="filters.search" 
            placeholder="Search quizzes..."
            class="form-input"
          />
        </div>
      </div>
    </div>
    
    <!-- Loading state -->
    <div v-if="loading" class="bg-white rounded-lg p-8 shadow-sm text-center">
      <div class="animate-pulse flex justify-center">
        <svg class="w-10 h-10 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <p class="mt-4 text-gray-600">Loading quizzes...</p>
    </div>
    
    <!-- Empty state -->
    <div v-else-if="filteredQuizzes.length === 0" class="bg-white rounded-lg p-8 shadow-sm text-center">
      <svg class="w-16 h-16 text-gray-400 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <h3 class="mt-4 text-lg font-medium text-gray-900">No quizzes found</h3>
      <p class="mt-1 text-gray-500">
        {{ user.role === 'instructor' ? 'Create your first quiz to get started.' : 'No quizzes match your current filters.' }}
      </p>
      
      <div class="mt-6" v-if="user.role === 'instructor'">
        <router-link to="/quizzes/create" class="btn btn-primary">
          Create Quiz
        </router-link>
      </div>
      
      <div class="mt-6" v-else-if="hasFilters">
        <button @click="clearFilters" class="btn btn-outline">
          Clear Filters
        </button>
      </div>
    </div>
    
    <!-- Quizzes list -->
    <div v-else class="space-y-4">
      <div 
        v-for="quiz in filteredQuizzes" 
        :key="quiz.id" 
        class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
      >
        <div class="p-6">
          <div class="flex justify-between items-start">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">
                {{ quiz.title }}
              </h3>
              <p class="text-sm text-gray-600 mt-1">{{ quiz.description }}</p>
            </div>
            
            <div class="flex items-center space-x-2">
              <span 
                class="px-2 py-1 text-xs font-medium rounded-full"
                :class="{
                  'bg-success-100 text-success-800': hasPassedQuiz(quiz),
                  'bg-error-100 text-error-800': hasFailedQuiz(quiz),
                  'bg-warning-100 text-warning-800': !hasAttemptedQuiz(quiz)
                }"
              >
                {{ getQuizStatus(quiz) }}
              </span>
            </div>
          </div>
          
          
          
          <div class="mt-4 flex items-center justify-between">
            <div class="flex items-center space-x-4 text-sm text-gray-500">
              <div class="flex items-center">
                <svg class="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                {{ getCourse(quiz.courseId)?.title || 'Unknown Course' }}
              </div>
              
              <div class="flex items-center">
                <svg class="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ quiz.timeLimit }} minutes
              </div>
              
              <div class="flex items-center">
                <svg class="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                {{ quiz.totalPoints }} points
              </div>
              
              <div class="flex items-center">
                <svg class="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ quiz.passingScore }} to pass
              </div>
            </div>
            
            <div class="flex space-x-2">
              <router-link 
                :to="user.role === 'instructor' ? `/quizzes/${quiz.id}` : `/quizzes/${quiz.id}/attempt`" 
                class="btn btn-primary py-1 px-3"
              >
                {{ user.role === 'instructor' ? 'View Results' : hasAttemptedQuiz(quiz) ? 'View Attempt' : 'Start Quiz' }}
              </router-link>
            </div>
          </div>
          
          <!-- Student's previous attempt -->
          <div 
            v-if="user.role === 'student' && hasAttemptedQuiz(quiz)"
            class="mt-4 pt-4 border-t border-gray-200"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500">Your Score</p>
                <p class="text-lg font-semibold" :class="{
                  'text-success-600': hasPassedQuiz(quiz),
                  'text-error-600': hasFailedQuiz(quiz)
                }">
                  {{ getQuizScore(quiz) }}/{{ quiz.totalPoints }}
                  <span class="text-sm text-gray-500">({{ getQuizPercentage(quiz) }}%)</span>
                </p>
              </div>
              
              <div class="text-right">
                <p class="text-sm text-gray-500">Attempted on</p>
                <p class="text-sm font-medium">{{ formatDate(getLastAttempt(quiz)?.attemptDate) }}</p>
              </div>
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
  name: 'QuizzesList',
  components: {
    AppLayout
  },
  data() {
    return {
      user: null,
      quizzes: [],
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
    filteredQuizzes() {
      return this.quizzes.filter(quiz => {
        // Filter by course
        if (this.filters.courseId && quiz.courseId !== this.filters.courseId) {
          return false;
        }
        
        // Filter by status
        if (this.filters.status) {
          const hasAttempted = this.hasAttemptedQuiz(quiz);
          if (this.filters.status === 'pending' && hasAttempted) {
            return false;
          }
          if (this.filters.status === 'completed' && !hasAttempted) {
            return false;
          }
        }
        
        // Filter by search term
        if (this.filters.search) {
          const searchTerm = this.filters.search.toLowerCase();
          return quiz.title.toLowerCase().includes(searchTerm) || 
                 quiz.description.toLowerCase().includes(searchTerm);
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
    formatDate(date) {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    hasAttemptedQuiz(quiz) {
      return quiz.attempts?.some(attempt => attempt.studentId === this.user.id);
    },
    getLastAttempt(quiz) {
      if (!quiz.attempts) return null;
      const userAttempts = quiz.attempts.filter(attempt => attempt.studentId === this.user.id);
      if (userAttempts.length === 0) return null;
      return userAttempts.sort((a, b) => new Date(b.attemptDate) - new Date(a.attemptDate))[0];
    },
    hasPassedQuiz(quiz) {
      const lastAttempt = this.getLastAttempt(quiz);
      if (!lastAttempt) return false;
      return lastAttempt.score >= quiz.passingScore;
    },
    hasFailedQuiz(quiz) {
      const lastAttempt = this.getLastAttempt(quiz);
      if (!lastAttempt) return false;
      return lastAttempt.score < quiz.passingScore;
    },
    getQuizScore(quiz) {
      const lastAttempt = this.getLastAttempt(quiz);
      return lastAttempt ? lastAttempt.score : 0;
    },
    getQuizPercentage(quiz) {
      const score = this.getQuizScore(quiz);
      return Math.round((score / quiz.totalPoints) * 100);
    },
    getQuizStatus(quiz) {
      if (!this.hasAttemptedQuiz(quiz)) {
        return 'Not Attempted';
      }
      return this.hasPassedQuiz(quiz) ? 'Passed' : 'Failed';
    },
    async fetchQuizzes() {
      this.loading = true;
      
      try {
        let quizzesResponse;
        
        if (this.user.role === 'instructor') {
          // Instructors see quizzes for their courses
          const coursesResponse = await axios.get(`http://localhost:3000/courses?instructorId=${this.user.id}`);
          this.courses = coursesResponse.data;
          
          const courseIds = this.courses.map(course => course.id);
          quizzesResponse = await axios.get('http://localhost:3000/quizzes');
          this.quizzes = quizzesResponse.data.filter(quiz => 
            courseIds.includes(quiz.courseId)
          );
        } else {
          // Students see quizzes from enrolled courses
          const enrollmentsResponse = await axios.get(`http://localhost:3000/enrollments?studentId=${this.user.id}`);
          const enrolledCourseIds = enrollmentsResponse.data.map(enrollment => enrollment.courseId);
          
          const coursesResponse = await axios.get(`http://localhost:3000/courses?${enrolledCourseIds.map(id => `id=${id}`).join('&')}`);
          this.courses = coursesResponse.data;
          
          quizzesResponse = await axios.get('http://localhost:3000/quizzes');
          this.quizzes = quizzesResponse.data.filter(quiz => 
            enrolledCourseIds.includes(quiz.courseId)
          );
        }
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      } finally {
        this.loading = false;
      }
    }
  },
  created() {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
      this.fetchQuizzes();
    } else {
      this.$router.push('/login');
    }
  }
};
</script>