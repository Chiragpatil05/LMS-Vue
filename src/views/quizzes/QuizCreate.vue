<template>
  <app-layout page-title="Create Quiz">
    <div class="max-w-4xl mx-auto">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Basic Information -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-xl font-semibold mb-4">Quiz Details</h2>
          
          <div class="space-y-4">
            <div>
              <label for="course" class="form-label">Course</label>
              <select 
                id="course" 
                v-model="quiz.courseId" 
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
                v-model="quiz.title" 
                type="text" 
                class="form-input"
                required
              />
            </div>
            
            <div>
              <label for="description" class="form-label">Description</label>
              <textarea 
                id="description" 
                v-model="quiz.description" 
                rows="4" 
                class="form-input"
                required
              ></textarea>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label for="timeLimit" class="form-label">Time Limit (minutes)</label>
                <input 
                  id="timeLimit" 
                  v-model.number="quiz.timeLimit" 
                  type="number" 
                  min="1" 
                  class="form-input"
                  required
                />
              </div>
              
              <div>
                <label for="totalPoints" class="form-label">Total Points</label>
                <input 
                  id="totalPoints" 
                  v-model.number="quiz.totalPoints" 
                  type="number" 
                  min="1" 
                  class="form-input"
                  required
                />
              </div>
              
              <div>
                <label for="passingScore" class="form-label">Passing Score</label>
                <input 
                  id="passingScore" 
                  v-model.number="quiz.passingScore" 
                  type="number" 
                  min="1" 
                  :max="quiz.totalPoints" 
                  class="form-input"
                  required
                />
              </div>
            </div>
          </div>
        </div>
        
        <!-- Questions -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold">Questions</h2>
            <div class="space-x-2">
              <button 
                type="button" 
                @click="addQuestion('multiple-choice')" 
                class="btn btn-outline py-1 px-3"
              >
                Add Multiple Choice
              </button>
              <button 
                type="button" 
                @click="addQuestion('true-false')" 
                class="btn btn-outline py-1 px-3"
              >
                Add True/False
              </button>
            </div>
          </div>
          
          <div v-if="quiz.questions.length === 0" class="text-center py-8">
            <svg class="w-12 h-12 text-gray-400 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p class="mt-4 text-gray-600">No questions added yet</p>
            <p class="text-sm text-gray-500">Add questions using the buttons above</p>
          </div>
          
          <div v-else class="space-y-6">
            <div 
              v-for="(question, index) in quiz.questions" 
              :key="index"
              class="border rounded-lg p-4"
            >
              <div class="flex justify-between items-start mb-4">
                <h3 class="text-lg font-medium">Question {{ index + 1 }}</h3>
                <button 
                  type="button" 
                  @click="removeQuestion(index)"
                  class="text-error-600 hover:text-error-700"
                >
                  Remove
                </button>
              </div>
              
              <div class="space-y-4">
                <div>
                  <label :for="'question-text-' + index" class="form-label">Question Text</label>
                  <textarea 
                    :id="'question-text-' + index"
                    v-model="question.text" 
                    rows="2" 
                    class="form-input"
                    required
                  ></textarea>
                </div>
                
                <!-- Multiple choice options -->
                <div v-if="question.type === 'multiple-choice'" class="space-y-2">
                  <label class="form-label">Options</label>
                  <div 
                    v-for="(option, optionIndex) in question.options" 
                    :key="optionIndex"
                    class="flex items-center space-x-2"
                  >
                    <input 
                      type="radio" 
                      :name="'correct-' + index"
                      :checked="question.correctAnswer === option"
                      @change="question.correctAnswer = option"
                      class="text-primary-600 focus:ring-primary-500"
                      required
                    />
                    <input 
                      v-model="question.options[optionIndex]"
                      type="text" 
                      class="form-input flex-1"
                      :placeholder="`Option ${optionIndex + 1}`"
                      required
                    />
                    <button 
                      type="button"
                      @click="removeOption(question, optionIndex)"
                      class="text-error-600 hover:text-error-700"
                      :disabled="question.options.length <= 2"
                    >
                      Remove
                    </button>
                  </div>
                  
                  <button 
                    type="button"
                    @click="addOption(question)"
                    class="text-primary-600 hover:text-primary-700 text-sm"
                  >
                    Add Option
                  </button>
                </div>
                
                <!-- True/False options -->
                <div v-else class="space-y-2">
                  <label class="form-label">Correct Answer</label>
                  <div class="flex space-x-4">
                    <label class="flex items-center">
                      <input 
                        type="radio" 
                        v-model="question.correctAnswer" 
                        :value="true"
                        class="text-primary-600 focus:ring-primary-500"
                        required
                      />
                      <span class="ml-2">True</span>
                    </label>
                    <label class="flex items-center">
                      <input 
                        type="radio" 
                        v-model="question.correctAnswer" 
                        :value="false"
                        class="text-primary-600 focus:ring-primary-500"
                        required
                      />
                      <span class="ml-2">False</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Submit -->
        <div class="flex justify-end space-x-4">
          <router-link to="/quizzes" class="btn btn-outline">
            Cancel
          </router-link>
          <button 
            type="submit" 
            class="btn btn-primary"
            :disabled="loading || quiz.questions.length === 0"
          >
            {{ loading ? 'Creating Quiz...' : 'Create Quiz' }}
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
  name: 'QuizCreate',
  components: {
    AppLayout
  },
  data() {
    return {
      user: null,
      courses: [],
      loading: false,
      quiz: {
        courseId: '',
        title: '',
        description: '',
        timeLimit: 30,
        totalPoints: 100,
        passingScore: 70,
        questions: []
      }
    };
  },
  methods: {
    addQuestion(type) {
      const question = {
        id: Date.now().toString(),
        type,
        text: '',
        correctAnswer: type === 'multiple-choice' ? '' : null
      };
      
      if (type === 'multiple-choice') {
        question.options = ['', ''];
      }
      
      this.quiz.questions.push(question);
    },
    removeQuestion(index) {
      this.quiz.questions.splice(index, 1);
    },
    addOption(question) {
      question.options.push('');
    },
    removeOption(question, index) {
      if (question.options.length > 2) {
        question.options.splice(index, 1);
        if (question.correctAnswer === question.options[index]) {
          question.correctAnswer = '';
        }
      }
    },
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
        const quizData = {
          ...this.quiz,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          attempts: []
        };
        
        await axios.post('http://localhost:3000/quizzes', quizData);
        
        this.$router.push('/quizzes');
      } catch (error) {
        console.error('Error creating quiz:', error);
        alert('Failed to create quiz. Please try again.');
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