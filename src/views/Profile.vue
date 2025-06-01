<template>
  <app-layout page-title="Profile">
    <div class="max-w-3xl mx-auto space-y-6">
      <!-- Profile Information -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center">
          <img 
            :src="user.avatar" 
            :alt="user.name"
            class="w-20 h-20 rounded-full"
          />
          <div class="ml-6">
            <h2 class="text-2xl font-bold text-gray-900">{{ user.name }}</h2>
            <p class="text-gray-600">{{ user.email }}</p>
            <p class="text-sm text-gray-500 capitalize mt-1">{{ user.role }}</p>
          </div>
        </div>
        
        <div class="mt-6 border-t pt-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="form-label">Member Since</label>
              <p class="text-gray-700">{{ formatDate(user.createdAt) }}</p>
            </div>
            <div>
              <label class="form-label">Account Type</label>
              <p class="text-gray-700 capitalize">{{ user.role }}</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Statistics -->
      <div v-if="user.role === 'student'" class="bg-white rounded-lg shadow-sm p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Learning Progress</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-primary-50 rounded-lg p-4">
            <p class="text-sm font-medium text-primary-600">Enrolled Courses</p>
            <p class="mt-2 text-3xl font-bold text-primary-800">{{ stats.enrolledCourses }}</p>
          </div>
          <div class="bg-secondary-50 rounded-lg p-4">
            <p class="text-sm font-medium text-secondary-600">Completed Assignments</p>
            <p class="mt-2 text-3xl font-bold text-secondary-800">{{ stats.completedAssignments }}</p>
          </div>
          <div class="bg-accent-50 rounded-lg p-4">
            <p class="text-sm font-medium text-accent-600">Average Quiz Score</p>
            <p class="mt-2 text-3xl font-bold text-accent-800">{{ stats.averageQuizScore }}%</p>
          </div>
        </div>
      </div>
      
      <div v-else class="bg-white rounded-lg shadow-sm p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Teaching Statistics</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-primary-50 rounded-lg p-4">
            <p class="text-sm font-medium text-primary-600">Active Courses</p>
            <p class="mt-2 text-3xl font-bold text-primary-800">{{ stats.activeCourses }}</p>
          </div>
          <div class="bg-secondary-50 rounded-lg p-4">
            <p class="text-sm font-medium text-secondary-600">Total Students</p>
            <p class="mt-2 text-3xl font-bold text-secondary-800">{{ stats.totalStudents }}</p>
          </div>
          <div class="bg-accent-50 rounded-lg p-4">
            <p class="text-sm font-medium text-accent-600">Average Rating</p>
            <p class="mt-2 text-3xl font-bold text-accent-800">{{ stats.averageRating }}/5</p>
          </div>
        </div>
      </div>
      
      <!-- Account Settings -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Account Settings</h3>
        <form @submit.prevent="updateProfile" class="space-y-4">
          <div>
            <label for="name" class="form-label">Name</label>
            <input 
              id="name" 
              v-model="form.name" 
              type="text" 
              class="form-input"
              required
            />
          </div>
          
          <div>
            <label for="email" class="form-label">Email</label>
            <input 
              id="email" 
              v-model="form.email" 
              type="email" 
              class="form-input"
              required
            />
          </div>
          
          <div>
            <label for="avatar" class="form-label">Avatar URL</label>
            <input 
              id="avatar" 
              v-model="form.avatar" 
              type="url" 
              class="form-input"
              required
            />
          </div>
          
          <div class="flex justify-end">
            <button 
              type="submit" 
              class="btn btn-primary"
              :disabled="loading"
            >
              {{ loading ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </app-layout>
</template>

<script>
import AppLayout from '../components/layout/AppLayout.vue';
import axios from 'axios';

export default {
  name: 'Profile',
  components: {
    AppLayout
  },
  data() {
    return {
      user: null,
      stats: {
        enrolledCourses: 0,
        completedAssignments: 0,
        averageQuizScore: 0,
        activeCourses: 0,
        totalStudents: 0,
        averageRating: 0
      },
      form: {
        name: '',
        email: '',
        avatar: ''
      },
      loading: false
    };
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },
    async fetchStats() {
      try {
        if (this.user.role === 'student') {
          // Fetch student statistics
          const enrollmentsResponse = await axios.get(`http://localhost:3000/enrollments?studentId=${this.user.id}`);
          this.stats.enrolledCourses = enrollmentsResponse.data.length;
          
          const assignmentsResponse = await axios.get(`http://localhost:3000/assignments`);
          const completedAssignments = assignmentsResponse.data.filter(assignment => 
            assignment.submissions?.some(s => s.studentId === this.user.id)
          );
          this.stats.completedAssignments = completedAssignments.length;
          
          const quizzesResponse = await axios.get(`http://localhost:3000/quizzes`);
          const quizAttempts = quizzesResponse.data.flatMap(quiz => 
            quiz.attempts?.filter(a => a.studentId === this.user.id) || []
          );
          if (quizAttempts.length > 0) {
            const totalScore = quizAttempts.reduce((sum, attempt) => sum + attempt.score, 0);
            this.stats.averageQuizScore = Math.round(totalScore / quizAttempts.length);
          }
        } else {
          // Fetch instructor statistics
          const coursesResponse = await axios.get(`http://localhost:3000/courses?instructorId=${this.user.id}`);
          const courses = coursesResponse.data;
          
          this.stats.activeCourses = courses.filter(c => c.status === 'active').length;
          this.stats.totalStudents = courses.reduce((total, course) => total + (course.enrolled || 0), 0);
          
          if (courses.length > 0) {
            const totalRating = courses.reduce((sum, course) => sum + (course.rating || 0), 0);
            this.stats.averageRating = (totalRating / courses.length).toFixed(1);
          }
        }
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    },
    async updateProfile() {
      if (this.loading) return;
      
      this.loading = true;
      
      try {
        const updatedUser = {
          ...this.user,
          ...this.form
        };
        
        await axios.put(`http://localhost:3000/users/${this.user.id}`, updatedUser);
        
        // Update local storage
        localStorage.setItem('user', JSON.stringify(updatedUser));
        this.user = updatedUser;
        
        alert('Profile updated successfully!');
      } catch (error) {
        console.error('Error updating profile:', error);
        alert('Failed to update profile. Please try again.');
      } finally {
        this.loading = false;
      }
    }
  },
  created() {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
      this.form.name = this.user.name;
      this.form.email = this.user.email;
      this.form.avatar = this.user.avatar;
      this.fetchStats();
    } else {
      this.$router.push('/login');
    }
  }
};
</script>