<template>
  <app-layout page-title="Create Course">
    <div class="max-w-4xl mx-auto">
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
            {{ loading ? 'Creating Course...' : 'Create Course' }}
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
  name: 'CourseCreate',
  components: {
    AppLayout
  },
  data() {
    return {
      user: null,
      loading: false,
      course: {
        title: '',
        description: '',
        thumbnail: '',
        category: '',
        level: '',
        price: 0,
        originalPrice: 0,
        status: 'active',
        outcomes: [''],
        prerequisites: [''],
        lessons: [
          {
            title: '',
            description: '',
            duration: '45 min',
            videoUrl: ''
          }
        ]
      }
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
    async handleSubmit() {
      if (this.loading) return;
      
      this.loading = true;
      
      try {
        // Remove empty outcomes and prerequisites
        this.course.outcomes = this.course.outcomes.filter(item => item.trim() !== '');
        this.course.prerequisites = this.course.prerequisites.filter(item => item.trim() !== '');
        
        // Add instructor information and other metadata
        const courseData = {
          ...this.course,
          id: Date.now().toString(),
          instructorId: this.user.id,
          instructorName: this.user.name,
          instructorAvatar: this.user.avatar,
          rating: 0,
          enrolled: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        // Set original price higher than actual price for discount display
        courseData.originalPrice = courseData.price * 2;
        
        // Create course
        await axios.post('http://localhost:3000/courses', courseData);
        
        // Redirect to courses list
        this.$router.push('/courses');
      } catch (error) {
        console.error('Error creating course:', error);
        alert('Failed to create course. Please try again.');
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
      }
    } else {
      this.$router.push('/login');
    }
  }
};
</script>