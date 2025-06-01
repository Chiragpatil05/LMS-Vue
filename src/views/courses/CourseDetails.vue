<template>
  <app-layout :page-title="course ? course.title : 'Course Details'">
    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-pulse flex flex-col items-center">
        <svg class="w-12 h-12 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
        <p class="mt-4 text-gray-600">Loading course details...</p>
      </div>
    </div>
    
    <!-- Error state -->
    <div v-else-if="error" class="bg-white rounded-lg p-8 shadow-sm text-center">
      <svg class="w-16 h-16 text-error-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <h3 class="mt-4 text-lg font-medium text-gray-900">Error Loading Course</h3>
      <p class="mt-1 text-gray-500">{{ error }}</p>
      <div class="mt-6">
        <router-link to="/courses" class="btn btn-primary">
          Back to Courses
        </router-link>
      </div>
    </div>
    
    <!-- Course content -->
    <div v-else-if="course" class="space-y-6">
      <!-- Course header -->
      <div class="relative rounded-xl overflow-hidden h-64 bg-gradient-to-r from-primary-600 to-accent-600">
        <img 
          v-if="course.thumbnail" 
          :src="course.thumbnail" 
          :alt="course.title"
          class="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30"
        />
        
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        
        <div class="absolute bottom-0 left-0 p-6 text-white">
          <div class="flex items-center mb-2">
            <span 
              class="px-2 py-1 text-xs font-medium rounded bg-white/20 backdrop-blur-sm"
            >
              {{ course.category ? capitalize(course.category.replace('-', ' ')) : 'General' }}
            </span>
            <span 
              class="ml-2 px-2 py-1 text-xs font-medium rounded"
              :class="{
                'bg-success-500/20': course.level === 'beginner',
                'bg-warning-500/20': course.level === 'intermediate',
                'bg-error-500/20': course.level === 'advanced'
              }"
            >
              {{ capitalize(course.level) }}
            </span>
          </div>
          
          <h1 class="text-3xl font-bold">{{ course.title }}</h1>
          
          <div class="mt-2 flex items-center">
            <div class="flex items-center">
              <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span class="ml-1">{{ course.rating || 0 }}/5</span>
            </div>
            <span class="mx-2">•</span>
            <span>{{ course.enrolled || 0 }} students</span>
            <span class="mx-2">•</span>
            <span>{{ course.lessons?.length || 0 }} lessons</span>
          </div>
        </div>
        
        <div class="absolute top-4 right-4 flex space-x-2">
          <router-link 
            v-if="isInstructor" 
            :to="`/courses/${course.id}/edit`" 
            class="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </router-link>
        </div>
      </div>
      
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main content -->
        <div class="lg:col-span-2 space-y-6">
          <!-- About section -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-xl font-semibold mb-4">About This Course</h2>
            <p class="text-gray-700">{{ course.description }}</p>
            
            <div class="mt-6 space-y-4">
              <div>
                <h3 class="text-lg font-medium mb-2">What You'll Learn</h3>
                <ul class="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <li 
                    v-for="(item, index) in course.outcomes || []" 
                    :key="index"
                    class="flex items-start"
                  >
                    <svg class="w-5 h-5 text-success-500 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span class="text-gray-700">{{ item }}</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 class="text-lg font-medium mb-2">Prerequisites</h3>
                <ul class="space-y-1">
                  <li 
                    v-for="(item, index) in course.prerequisites || []" 
                    :key="index"
                    class="flex items-start"
                  >
                    <svg class="w-5 h-5 text-primary-500 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span class="text-gray-700">{{ item }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <!-- Curriculum section -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-xl font-semibold mb-4">Course Content</h2>
            
            <div v-if="course.lessons && course.lessons.length > 0">
              <div class="mb-4 flex items-center justify-between">
                <span class="text-gray-600">{{ course.lessons.length }} lessons • {{ totalDuration }} total</span>
                <button @click="expandAll = !expandAll" class="text-primary-600 text-sm hover:underline">
                  {{ expandAll ? 'Collapse All' : 'Expand All' }}
                </button>
              </div>
              
              <div class="border rounded-lg divide-y">
                <div 
                  v-for="(lesson, index) in course.lessons" 
                  :key="index"
                  class="overflow-hidden"
                >
                  <div 
                    @click="toggleLesson(index)"
                    class="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                  >
                    <div class="flex items-center">
                      <svg 
                        class="w-5 h-5 mr-2 transition-transform duration-200"
                        :class="{ 'transform rotate-90': expandedLessons.includes(index) }"
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                      </svg>
                      <span class="font-medium">{{ index + 1 }}. {{ lesson.title }}</span>
                    </div>
                    <div class="text-gray-500 text-sm">{{ lesson.duration || '15 min' }}</div>
                  </div>
                  
                  <div 
                    v-if="expandedLessons.includes(index)"
                    class="bg-gray-50 p-4 text-gray-700"
                  >
                    <p>{{ lesson.description || 'No description available.' }}</p>
                    
                    <div class="mt-4">
                      <button 
                        v-if="isEnrolled || isInstructor"
                        @click="startLesson(index)"
                        class="btn btn-primary py-1 px-3"
                      >
                        Start Lesson
                      </button>
                      <div v-else class="text-sm text-gray-600">
                        Enroll in this course to access this lesson
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div v-else class="text-center p-8 text-gray-500">
              No lessons available yet.
            </div>
          </div>
          
          <!-- Instructor section -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-xl font-semibold mb-4">Instructor</h2>
            
            <div class="flex items-start">
              <img 
                :src="course.instructorAvatar" 
                :alt="course.instructorName"
                class="w-16 h-16 rounded-full mr-4"
              />
              <div>
                <h3 class="text-lg font-medium">{{ course.instructorName }}</h3>
                <p class="text-gray-600">{{ course.instructorTitle || 'Course Instructor' }}</p>
                <p class="mt-2 text-gray-700">{{ course.instructorBio || 'No instructor bio available.' }}</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Sidebar -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-sm p-6 sticky top-6">
            <div class="text-center mb-4">
              <span class="text-3xl font-bold text-gray-900">{{ course.price ? `₹${course.price}` : 'Free' }}</span>
              <p v-if="course.price && course.originalPrice" class="text-gray-500 line-through">
                ₹{{ course.originalPrice }}
              </p>
            </div>
            
            <button 
              v-if="!isEnrolled && !isInstructor"
              @click="enrollInCourse"
              class="w-full btn btn-primary"
              :disabled="enrolling"
            >
              <span v-if="enrolling">Enrolling...</span>
              <span v-else>Enroll Now</span>
            </button>
            
            <button 
              v-else-if="isEnrolled"
              class="w-full btn btn-primary"
            >
              Continue Learning
            </button>
            
            <button 
              v-else
              class="w-full btn btn-primary"
              @click="$router.push(`/courses/${course.id}/edit`)"
            >
              Edit Course
            </button>
            
            <div class="mt-6 space-y-4">
              <div class="flex items-center">
                <svg class="w-5 h-5 text-gray-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="text-gray-700">{{ totalDuration }} total length</span>
              </div>
              
              <div class="flex items-center">
                <svg class="w-5 h-5 text-gray-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
                <span class="text-gray-700">{{ course.lessons?.length || 0 }} lessons</span>
              </div>
              
              <div class="flex items-center">
                <svg class="w-5 h-5 text-gray-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span class="text-gray-700">Last updated {{ formatDate(course.updatedAt) }}</span>
              </div>
              
              <div class="flex items-center">
                <svg class="w-5 h-5 text-gray-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span class="text-gray-700">Full lifetime access</span>
              </div>
              
              <div class="flex items-center">
                <svg class="w-5 h-5 text-gray-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m-6-8h6M5 5h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z" />
                </svg>
                <span class="text-gray-700">Certificate of completion</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <LessonViewer
      v-if="selectedLesson !== null"
      :lesson="course.lessons[selectedLesson]"
      :has-previous-lesson="selectedLesson > 0"
      :has-next-lesson="selectedLesson < course.lessons.length - 1"
      @close="selectedLesson = null"
      @previous="selectedLesson--"
      @next="selectedLesson++"
    />
  </app-layout>
</template>

<script>
import AppLayout from '../../components/layout/AppLayout.vue';
import LessonViewer from '../../components/lessons/LessonViewer.vue';
import axios from 'axios';

export default {
  name: 'CourseDetails',
  components: {
    AppLayout,
    LessonViewer
  },
  data() {
    return {
      user: null,
      course: null,
      loading: true,
      error: null,
      expandedLessons: [],
      expandAll: false,
      isEnrolled: false,
      enrolling: false,
      selectedLesson: null
    };
  },
  computed: {
    isInstructor() {
      return this.user && this.course && this.user.id === this.course.instructorId;
    },
    totalDuration() {
      if (!this.course || !this.course.lessons) {
        return '0 hours';
      }
      
      // Calculate total minutes
      const totalMinutes = this.course.lessons.reduce((total, lesson) => {
        // Extract number from duration string like "15 min"
        const minutes = parseInt(lesson.duration) || 15;
        return total + minutes;
      }, 0);
      
      // Convert to hours and minutes
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      
      if (hours === 0) {
        return `${minutes} minutes`;
      } else if (minutes === 0) {
        return `${hours} hour${hours > 1 ? 's' : ''}`;
      } else {
        return `${hours} hour${hours > 1 ? 's' : ''} ${minutes} minute${minutes > 1 ? 's' : ''}`;
      }
    }
  },
  methods: {
    capitalize(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    },
    toggleLesson(index) {
      if (this.expandedLessons.includes(index)) {
        this.expandedLessons = this.expandedLessons.filter(i => i !== index);
      } else {
        this.expandedLessons.push(index);
      }
    },
    formatDate(dateString) {
      if (!dateString) return 'Unknown date';
      
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    },
    async fetchCourseDetails() {
      this.loading = true;
      this.error = null;
      
      try {
        const courseId = this.$route.params.id;
        
        // Fetch course details
        const courseResponse = await axios.get(`http://localhost:3000/courses/${courseId}`);
        this.course = courseResponse.data;
        
        if (!this.course) {
          this.error = 'Course not found';
          return;
        }
        
        // Check if user is enrolled (for students)
        if (this.user.role === 'student') {
          const enrollmentResponse = await axios.get(
            `http://localhost:3000/enrollments?studentId=${this.user.id}&courseId=${courseId}`
          );
          this.isEnrolled = enrollmentResponse.data.length > 0;
        }
      } catch (error) {
        console.error('Error fetching course details:', error);
        this.error = 'Failed to load course details. Please try again later.';
      } finally {
        this.loading = false;
      }
    },
    async enrollInCourse() {
      if (this.enrolling) return;
      
      this.enrolling = true;
      
      try {
        const enrollment = {
          id: Date.now().toString(),
          studentId: this.user.id,
          courseId: this.course.id,
          enrolledDate: new Date().toISOString(),
          progress: 0,
          completed: false
        };
        
        await axios.post('http://localhost:3000/enrollments', enrollment);
        
        // Update course enrolled count
        const updatedCourse = {
          ...this.course,
          enrolled: (this.course.enrolled || 0) + 1
        };
        
        await axios.put(`http://localhost:3000/courses/${this.course.id}`, updatedCourse);
        
        this.isEnrolled = true;
        this.course = updatedCourse;
        
        // Show success message
        alert('Successfully enrolled in the course!');
      } catch (error) {
        console.error('Error enrolling in course:', error);
        alert('Failed to enroll in the course. Please try again later.');
      } finally {
        this.enrolling = false;
      }
    },
    startLesson(index) {
      this.selectedLesson = index;
    }
  },
  watch: {
    expandAll(newVal) {
      if (newVal) {
        // Expand all lessons
        this.expandedLessons = this.course.lessons.map((_, index) => index);
      } else {
        // Collapse all lessons
        this.expandedLessons = [];
      }
    }
  },
  created() {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
      this.fetchCourseDetails();
    } else {
      this.$router.push('/login');
    }
  }
};
</script>