<template>
  <app-layout page-title="Courses">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">Courses</h2>
        <p class="text-gray-600">
          {{ user.role === 'instructor' ? 'Manage and create courses' : 'Browse and enroll in courses' }}
        </p>
      </div>
      
      <div v-if="user.role === 'instructor'" class="flex space-x-3">
        <router-link to="/courses/create" class="btn btn-primary">
          <span class="flex items-center">
            <svg class="w-5 h-5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create Course
          </span>
        </router-link>
      </div>
    </div>
    
    <!-- Filters -->
    <div class="bg-white rounded-lg p-4 shadow-sm mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label for="category" class="form-label">Category</label>
          <select 
            id="category" 
            v-model="filters.category" 
            class="form-input"
          >
            <option value="">All Categories</option>
            <option value="web-development">Web Development</option>
            <option value="mobile-development">Mobile Development</option>
            <option value="data-science">Data Science</option>
            <option value="ui-ux-design">UI/UX Design</option>
          </select>
        </div>
        
        <div>
          <label for="level" class="form-label">Level</label>
          <select 
            id="level" 
            v-model="filters.level" 
            class="form-input"
          >
            <option value="">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
        
        <div>
          <label for="status" class="form-label">Status</label>
          <select 
            id="status" 
            v-model="filters.status" 
            class="form-input"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        
        <div>
          <label for="search" class="form-label">Search</label>
          <input 
            id="search" 
            type="text" 
            v-model="filters.search" 
            placeholder="Search courses..."
            class="form-input" 
          />
        </div>
      </div>
    </div>
    
    <!-- Loading state -->
    <div v-if="loading" class="bg-white rounded-lg p-8 shadow-sm text-center">
      <div class="animate-pulse flex justify-center">
        <svg class="w-10 h-10 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      </div>
      <p class="mt-4 text-gray-600">Loading courses...</p>
    </div>
    
    <!-- Empty state -->
    <div v-else-if="filteredCourses.length === 0" class="bg-white rounded-lg p-8 shadow-sm text-center">
      <svg class="w-16 h-16 text-gray-400 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
      <h3 class="mt-4 text-lg font-medium text-gray-900">No courses found</h3>
      <p class="mt-1 text-gray-500">
        {{ user.role === 'instructor' ? 'Create your first course to get started.' : 'No courses match your current filters.' }}
      </p>
      
      <div class="mt-6" v-if="user.role === 'instructor'">
        <router-link to="/courses/create" class="btn btn-primary">
          Create Course
        </router-link>
      </div>
      
      <div class="mt-6" v-else-if="hasFilters">
        <button @click="clearFilters" class="btn btn-outline">
          Clear Filters
        </button>
      </div>
    </div>
    
    <!-- Course grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="course in filteredCourses" 
        :key="course.id" 
        class="bg-white rounded-lg shadow-sm overflow-hidden transition-transform duration-300 hover:shadow-md hover:-translate-y-1"
      >
        <div class="relative">
          <img 
            :src="course.thumbnail" 
            :alt="course.title"
            class="w-full h-40 object-cover"
          />
          <div class="absolute top-0 right-0 p-2">
            <span 
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
              :class="{
                'bg-success-100 text-success-800': course.level === 'beginner',
                'bg-warning-100 text-warning-800': course.level === 'intermediate',
                'bg-error-100 text-error-800': course.level === 'advanced'
              }"
            >
              {{ capitalize(course.level) }}
            </span>
          </div>
        </div>
        
        <div class="p-4">
          <h3 class="text-lg font-semibold text-gray-900 line-clamp-1">{{ course.title }}</h3>
          
          <p class="mt-2 text-sm text-gray-600 line-clamp-2">{{ course.description }}</p>
          
          <div class="mt-3 flex items-center">
            <img 
              :src="course.instructorAvatar" 
              :alt="course.instructorName"
              class="w-6 h-6 rounded-full mr-2"
            />
            <span class="text-sm text-gray-600">{{ course.instructorName }}</span>
          </div>
          
          <div class="mt-3 flex items-center justify-between">
            <div class="flex items-center">
              <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span class="ml-1 text-sm text-gray-600">{{ course.rating || 0 }}/5</span>
            </div>
            
            <span class="text-sm text-gray-600">
              {{ course.enrolled || 0 }} students
            </span>
          </div>
          
          <div class="mt-4 flex justify-between items-center">
            <span class="text-primary-600 font-medium">
              {{ course.price ? `$${course.price}` : 'Free' }}
            </span>
            
            <router-link :to="`/courses/${course.id}`" class="btn btn-primary py-1 px-3">
              {{ isEnrolled(course.id) ? 'Continue' : 'View Course' }}
            </router-link>
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
  name: 'CoursesList',
  components: {
    AppLayout
  },
  data() {
    return {
      user: null,
      courses: [],
      enrollments: [],
      loading: true,
      filters: {
        category: '',
        level: '',
        status: '',
        search: ''
      }
    };
  },
  computed: {
    filteredCourses() {
      return this.courses.filter(course => {
        // Filter by category
        if (this.filters.category && course.category !== this.filters.category) {
          return false;
        }
        
        // Filter by level
        if (this.filters.level && course.level !== this.filters.level) {
          return false;
        }
        
        // Filter by status
        if (this.filters.status && course.status !== this.filters.status) {
          return false;
        }
        
        // Filter by search term
        if (this.filters.search) {
          const searchTerm = this.filters.search.toLowerCase();
          return course.title.toLowerCase().includes(searchTerm) || 
                 course.description.toLowerCase().includes(searchTerm);
        }
        
        return true;
      });
    },
    hasFilters() {
      return this.filters.category || this.filters.level || this.filters.status || this.filters.search;
    }
  },
  methods: {
    capitalize(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    },
    clearFilters() {
      this.filters = {
        category: '',
        level: '',
        status: '',
        search: ''
      };
    },
    isEnrolled(courseId) {
      return this.enrollments.some(enrollment => enrollment.courseId === courseId);
    },
    async fetchCourses() {
      this.loading = true;
      
      try {
        if (this.user.role === 'instructor') {
          // Instructors see their own courses
          const response = await axios.get(`http://localhost:3000/courses?instructorId=${this.user.id}`);
          this.courses = response.data;
        } else {
          // Students see all active courses
          const response = await axios.get('http://localhost:3000/courses?status=active');
          this.courses = response.data;
          
          // Fetch student enrollments
          const enrollmentsResponse = await axios.get(`http://localhost:3000/enrollments?studentId=${this.user.id}`);
          this.enrollments = enrollmentsResponse.data;
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        this.loading = false;
      }
    }
  },
  created() {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
      this.fetchCourses();
    } else {
      this.$router.push('/login');
    }
  }
};
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>