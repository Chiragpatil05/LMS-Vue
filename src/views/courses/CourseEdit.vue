<template>
  <app-layout :page-title="course ? `Edit ${course.title}` : 'Edit Course'">
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-pulse flex flex-col items-center">
        <div class="w-12 h-12 rounded-full bg-primary-200"></div>
        <p class="mt-4 text-gray-600">Loading course details...</p>
      </div>
    </div>
    
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
    
    <div v-else-if="course" class="max-w-4xl mx-auto">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Basic Information -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-xl font-semibold mb-4">Basic Information</h2>
          
          <div class="space-y-4">
            <div>
              <label for="title" class="form-label">Course Title</label>
              <input 
                id="title" 
                v-model="course.title" 
                type="text" 
                class="form-input"
                required
              />
            </div>
            
            <div>
              <label for="description" class="form-label">Description</label>
              <textarea 
                id="description" 
                v-model="course.description" 
                rows="4" 
                class="form-input"
                required
              ></textarea>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="category" class="form-label">Category</label>
                <select 
                  id="category" 
                  v-model="course.category" 
                  class="form-input"
                  required
                >
                  <option value="">Select Category</option>
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
                  v-model="course.level" 
                  class="form-input"
                  required
                >
                  <option value="">Select Level</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="price" class="form-label">Price ($)</label>
                <input 
                  id="price" 
                  v-model.number="course.price" 
                  type="number" 
                  min="0" 
                  step="0.01" 
                  class="form-input"
                  required
                />
              </div>
              
              <div>
                <label for="thumbnail" class="form-label">Thumbnail URL</label>
                <input 
                  id="thumbnail" 
                  v-model="course.thumbnail" 
                  type="url" 
                  class="form-input"
                  required
                />
              </div>
            </div>
            
            <div>
              <label for="status" class="form-label">Status</label>
              <select 
                id="status" 
                v-model="course.status" 
                class="form-input"
                required
              >
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
        </div>
        
        <!-- Learning Outcomes -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-xl font-semibold mb-4">Learning Outcomes</h2>
          
          <div class="space-y-4">
            <div v-for="(outcome, index) in course.outcomes" :key="index" class="flex gap-2">
              <input 
                v-model="course.outcomes[index]" 
                type="text" 
                class="form-input flex-1"
                placeholder="What will students learn?"
              />
              <button 
                type="button" 
                @click="removeOutcome(index)" 
                class="text-error-600 hover:text-error-700"
              >
                Remove
              </button>
            </div>
            
            <button 
              type="button" 
              @click="addOutcome" 
              class="btn btn-outline"
            >
              Add Learning Outcome
            </button>
          </div>
        </div>
        
        <!-- Prerequisites -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-xl font-semibold mb-4">Prerequisites</h2>
          
          <div class="space-y-4">
            <div v-for="(prerequisite, index) in course.prerequisites" :key="index" class="flex gap-2">
              <input 
                v-model="course.prerequisites[index]" 
                type="text" 
                class="form-input flex-1"
                placeholder="What should students know beforehand?"
              />
              <button 
                type="button" 
                @click="removePrerequisite(index)" 
                class="text-error-600 hover:text-error-700"
              >
                Remove
              </button>
            </div>
            
            <button 
              type="button" 
              @click="addPrerequisite" 
              class="btn btn-outline"
            >
              Add Prerequisite
            </button>
          </div>
        </div>
        
        <!-- Lessons -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-xl font-semibold mb-4">Course Content</h2>
          
          <div class="space-y-6">
            <div 
              v-for="(lesson, index) in course.lessons" 
              :key="index" 
              class="border rounded-lg p-4"
            >
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-medium">Lesson {{ index + 1 }}</h3>
                <button 
                  type="button" 
                  @click="removeLesson(index)"
                  class="text-error-600 hover:text-error-700"
                >
                  Remove Lesson
                </button>
              </div>
              
              <div class="space-y-4">
                <div>
                  <label :for="'lesson-title-' + index" class="form-label">Title</label>
                  <input 
                    :id="'lesson-title-' + index"
                    v-model="lesson.title" 
                    type="text" 
                    class="form-input"
                    required
                  />
                </div>
                
                <div>
                  <label :for="'lesson-description-' + index" class="form-label">Description</label>
                  <textarea 
                    :id="'lesson-description-' + index"
                    v-model="lesson.description" 
                    rows="2" 
                    class="form-input"
                    required
                  ></textarea>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label :for="'lesson-duration-' + index" class="form-label">Duration (minutes)</label>
                    <input 
                      :id="'lesson-duration-' + index"
                      v-model="lesson.duration" 
                      type="text" 
                      class="form-input"
                      required
                    />
                  </div>
                  
                  <div>
                    <label :for="'lesson-video-' + index" class="form-label">Video URL</label>
                    <input 
                      :id="'lesson-video-' + index"
                      v-model="lesson.videoUrl" 
                      type="url" 
                      class="form-input"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <button 
              type="button" 
              @click="addLesson" 
              class="btn btn-outline w-full"
            >
              Add Lesson
            </button>
          </div>
        </div>
        
        <!-- Submit -->
        <div class="flex justify-end space-x-4">
          <router-link to="/courses" class="btn btn-outline">
            Cancel
          </router-link>
          <button 
            type="submit" 
            class="btn btn-primary"
            :disabled="loading"
          >
            {{ loading ? 'Saving Changes...' : 'Save Changes' }}
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
  name: 'CourseEdit',
  components: {
    AppLayout
  },
  data() {
    return {
      user: null,
      course: null,
      loading: true,
      saving: false,
      error: null
    };
  },
  methods: {
    addOutcome() {
      this.course.outcomes.push('');
    },
    removeOutcome(index) {
      this.course.outcomes.splice(index, 1);
    },
    addPrerequisite() {
      this.course.prerequisites.push('');
    },
    removePrerequisite(index) {
      this.course.prerequisites.splice(index, 1);
    },
    addLesson() {
      this.course.lessons.push({
        title: '',
        description: '',
        duration: '45 min',
        videoUrl: ''
      });
    },
    removeLesson(index) {
      this.course.lessons.splice(index, 1);
    },
    async fetchCourse() {
      this.loading = true;
      this.error = null;
      
      try {
        const courseId = this.$route.params.id;
        const response = await axios.get(`http://localhost:3000/courses/${courseId}`);
        this.course = response.data;
        
        if (!this.course) {
          this.error = 'Course not found';
          return;
        }
        
        // Check if user is the course instructor
        if (this.course.instructorId !== this.user.id) {
          this.error = 'You do not have permission to edit this course';
          return;
        }
        
        // Ensure arrays exist
        this.course.outcomes = this.course.outcomes || [''];
        this.course.prerequisites = this.course.prerequisites || [''];
        this.course.lessons = this.course.lessons || [{
          title: '',
          description: '',
          duration: '45 min',
          videoUrl: ''
        }];
      } catch (error) {
        console.error('Error fetching course:', error);
        this.error = 'Failed to load course details. Please try again later.';
      } finally {
        this.loading = false;
      }
    },
    async handleSubmit() {
      if (this.saving) return;
      
      this.saving = true;
      
      try {
        // Remove empty outcomes and prerequisites
        this.course.outcomes = this.course.outcomes.filter(item => item.trim() !== '');
        this.course.prerequisites = this.course.prerequisites.filter(item => item.trim() !== '');
        
        // Update course data
        const courseData = {
          ...this.course,
          updatedAt: new Date().toISOString()
        };
        
        // Update course
        await axios.put(`http://localhost:3000/courses/${this.course.id}`, courseData);
        
        // Redirect to course details
        this.$router.push(`/courses/${this.course.id}`);
      } catch (error) {
        console.error('Error updating course:', error);
        alert('Failed to update course. Please try again.');
      } finally {
        this.saving = false;
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
        this.fetchCourse();
      }
    } else {
      this.$router.push('/login');
    }
  }
};
</script>