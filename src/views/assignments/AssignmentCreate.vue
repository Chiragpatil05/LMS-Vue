<template>
  <app-layout page-title="Create Assignment">
    <div class="max-w-4xl mx-auto">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Basic Information -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-xl font-semibold mb-4">Assignment Details</h2>
          
          <div class="space-y-4">
            <div>
              <label for="course" class="form-label">Course</label>
              <select 
                id="course" 
                v-model="assignment.courseId" 
                class="form-input"
                required
              >
                <option value="">Select Course</option>
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
              <label for="title" class="form-label">Title</label>
              <input 
                id="title" 
                v-model="assignment.title" 
                type="text" 
                class="form-input"
                required
              />
            </div>
            
            <div>
              <label for="description" class="form-label">Description</label>
              <textarea 
                id="description" 
                v-model="assignment.description" 
                rows="4" 
                class="form-input"
                required
              ></textarea>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="dueDate" class="form-label">Due Date</label>
                <input 
                  id="dueDate" 
                  v-model="assignment.dueDate" 
                  type="datetime-local" 
                  class="form-input"
                  required
                />
              </div>
              
              <div>
                <label for="points" class="form-label">Total Points</label>
                <input 
                  id="points" 
                  v-model.number="assignment.totalPoints" 
                  type="number" 
                  min="0" 
                  class="form-input"
                  required
                />
              </div>
            </div>
          </div>
        </div>
        
        <!-- Submit -->
        <div class="flex justify-end space-x-4">
          <router-link to="/assignments" class="btn btn-outline">
            Cancel
          </router-link>
          <button 
            type="submit" 
            class="btn btn-primary"
            :disabled="loading"
          >
            {{ loading ? 'Creating Assignment...' : 'Create Assignment' }}
          </button>
        </div>
      </form>
    </div>
  </app-layout>
</template>

<script>
import AppLayout from '../../components/layout/AppLayout.vue';
import axios from 'axios';

export default {
  name: 'AssignmentCreate',
  components: {
    AppLayout
  },
  data() {
    return {
      user: null,
      courses: [],
      loading: false,
      assignment: {
        courseId: '',
        title: '',
        description: '',
        dueDate: '',
        totalPoints: 100
      }
    };
  },
  methods: {
    async fetchCourses() {
      try {
        const response = await axios.get(`http://localhost:3000/courses?instructorId=${this.user.id}`);
        this.courses = response.data;
      } catch (error) {
        console.error('Error fetching courses:', error);
        alert('Failed to load courses. Please try again.');
      }
    },
    async handleSubmit() {
      if (this.loading) return;
      
      this.loading = true;
      
      try {
        const assignmentData = {
          ...this.assignment,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          submissions: []
        };
        
        await axios.post('http://localhost:3000/assignments', assignmentData);
        
        this.$router.push('/assignments');
      } catch (error) {
        console.error('Error creating assignment:', error);
        alert('Failed to create assignment. Please try again.');
      } finally {
        this.loading = false;
      }
    }
  },
  created() {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
      if (this.user.role !== 'instructor') {
        this.$router.push('/dashboard');
      } else {
        this.fetchCourses();
      }
    } else {
      this.$router.push('/login');
    }
  }
};
</script>