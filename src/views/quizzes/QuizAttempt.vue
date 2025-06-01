<template>
  <app-layout :page-title="quiz ? quiz.title : 'Take Quiz'">
    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-pulse flex flex-col items-center">
        <svg class="w-12 h-12 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p class="mt-4 text-gray-600">Loading quiz...</p>
      </div>
    </div>
    
    <!-- Error state -->
    <div v-else-if="error" class="bg-white rounded-lg p-8 shadow-sm text-center">
      <svg class="w-16 h-16 text-error-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <h3 class="mt-4 text-lg font-medium text-gray-900">Error Loading Quiz</h3>
      <p class="mt-1 text-gray-500">{{ error }}</p>
      <div class="mt-6">
        <router-link to="/quizzes" class="btn btn-primary">
          Back to Quizzes
        </router-link>
      </div>
    </div>
    
    <!-- Quiz content -->
    <div v-else-if="quiz" class="max-w-3xl mx-auto">
      <!-- Quiz header -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div class="flex justify-between items-start">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">{{ quiz.title }}</h1>
            <p class="mt-2 text-gray-600">{{ quiz.description }}</p>
          </div>
          
          <div class="text-right">
            <div class="text-2xl font-bold" :class="timeLeft <= 300 ? 'text-error-600' : 'text-gray-900'">
              {{ formatTime(timeLeft) }}
            </div>
            <p class="text-sm text-gray-500">Time Remaining</p>
          </div>
        </div>
        
        <div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-gray-400 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <div>
              <p class="text-sm text-gray-500">Questions</p>
              <p class="font-medium">{{ quiz.questions.length }}</p>
            </div>
          </div>
          
          <div class="flex items-center">
            <svg class="w-5 h-5 text-gray-400 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <div>
              <p class="text-sm text-gray-500">Total Points</p>
              <p class="font-medium">{{ quiz.totalPoints }}</p>
            </div>
          </div>
          
          <div class="flex items-center">
            <svg class="w-5 h-5 text-gray-400 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p class="text-sm text-gray-500">Passing Score</p>
              <p class="font-medium">{{ quiz.passingScore }}</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Questions -->
      <div class="space-y-6">
        <div 
          v-for="(question, index) in quiz.questions" 
          :key="index"
          class="bg-white rounded-lg shadow-sm p-6"
        >
          <div class="flex justify-between items-start mb-4">
            <h3 class="text-lg font-medium text-gray-900">Question {{ index + 1 }}</h3>
            <div class="text-sm text-gray-500">
              {{ index + 1 }} of {{ quiz.questions.length }}
            </div>
          </div>
          
          <p class="text-gray-800 mb-6">{{ question.text }}</p>
          
          <!-- Multiple choice options -->
          <div v-if="question.type === 'multiple-choice'" class="space-y-3">
            <label 
              v-for="option in question.options" 
              :key="option"
              class="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
              :class="answers[index]?.answer === option ? 'border-primary-500 bg-primary-50' : 'border-gray-200'"
            >
              <input 
                type="radio" 
                :name="'question-' + index"
                :value="option"
                v-model="answers[index].answer"
                class="text-primary-600 focus:ring-primary-500"
              />
              <span class="ml-3">{{ option }}</span>
            </label>
          </div>
          
          <!-- True/False options -->
          <div v-else class="space-y-3">
            <label 
              v-for="option in [true, false]" 
              :key="option"
              class="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
              :class="answers[index]?.answer === option ? 'border-primary-500 bg-primary-50' : 'border-gray-200'"
            >
              <input 
                type="radio" 
                :name="'question-' + index"
                :value="option"
                v-model="answers[index].answer"
                class="text-primary-600 focus:ring-primary-500"
              />
              <span class="ml-3">{{ option ? 'True' : 'False' }}</span>
            </label>
          </div>
        </div>
      </div>
      
      <!-- Submit button -->
      <div class="mt-6 flex justify-end">
        <button 
          @click="submitQuiz"
          class="btn btn-primary"
          :disabled="!isAllAnswered || submitting"
        >
          {{ submitting ? 'Submitting...' : 'Submit Quiz' }}
        </button>
      </div>
    </div>
    
    <!-- Results modal -->
    <div 
      v-if="showResults" 
      class="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title" 
      role="dialog" 
      aria-modal="true"
    >
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div 
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
          aria-hidden="true"
        ></div>
        
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  Quiz Results
                </h3>
                
                <div class="mt-4">
                  <div class="text-center py-6">
                    <div class="text-4xl font-bold mb-2" :class="{
                      'text-success-600': quizResult.passed,
                      'text-error-600': !quizResult.passed
                    }">
                      {{ quizResult.score }}/{{ quiz.totalPoints }}
                    </div>
                    <p class="text-lg text-gray-600">
                      {{ quizResult.passed ? 'Congratulations! You passed!' : 'Keep practicing! You can do better!' }}
                    </p>
                  </div>
                  
                  <div class="border-t border-gray-200 pt-4">
                    <div class="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p class="text-sm text-gray-500">Correct Answers</p>
                        <p class="text-2xl font-semibold text-success-600">
                          {{ quizResult.correctAnswers }}
                        </p>
                      </div>
                      <div>
                        <p class="text-sm text-gray-500">Time Taken</p>
                        <p class="text-2xl font-semibold text-gray-900">
                          {{ formatTime(quizResult.timeTaken) }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <router-link 
              to="/quizzes" 
              class="btn btn-primary sm:ml-3"
            >
              Back to Quizzes
            </router-link>
            <button 
              type="button" 
              class="btn btn-outline mt-3 sm:mt-0"
              @click="reviewAnswers"
            >
              Review Answers
            </button>
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
  name: 'QuizAttempt',
  components: {
    AppLayout
  },
  data() {
    return {
      user: null,
      quiz: null,
      loading: true,
      error: null,
      timeLeft: 0,
      timer: null,
      answers: [],
      submitting: false,
      showResults: false,
      quizResult: {
        score: 0,
        correctAnswers: 0,
        timeTaken: 0,
        passed: false
      }
    };
  },
  computed: {
    isAllAnswered() {
      return this.answers.length === this.quiz?.questions.length &&
             this.answers.every(answer => answer.answer !== undefined);
    }
  },
  methods: {
    formatTime(seconds) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    },
    startTimer() {
      this.timeLeft = this.quiz.timeLimit * 60;
      this.timer = setInterval(() => {
        if (this.timeLeft > 0) {
          this.timeLeft--;
        } else {
          this.submitQuiz(true);
        }
      }, 1000);
    },
    async submitQuiz(timeExpired = false) {
      if (this.submitting) return;
      
      this.submitting = true;
      clearInterval(this.timer);
      
      try {
        // Calculate score
        let correctAnswers = 0;
        this.quiz.questions.forEach((question, index) => {
          if (this.answers[index].answer === question.correctAnswer) {
            correctAnswers++;
          }
        });
        
        const score = Math.round((correctAnswers / this.quiz.questions.length) * this.quiz.totalPoints);
        const timeTaken = (this.quiz.timeLimit * 60) - this.timeLeft;
        
        // Create attempt record
        const attempt = {
          id: Date.now().toString(),
          studentId: this.user.id,
          attemptDate: new Date().toISOString(),
          score,
          timeSpent: timeTaken,
          answers: this.answers
        };
        
        // Update quiz with new attempt
        const updatedQuiz = {
          ...this.quiz,
          attempts: [...(this.quiz.attempts || []), attempt]
        };
        
        await axios.put(`http://localhost:3000/quizzes/${this.quiz.id}`, updatedQuiz);
        
        // Set result data
        this.quizResult = {
          score,
          correctAnswers,
          timeTaken,
          passed: score >= this.quiz.passingScore
        };
        
        // Show results
        this.showResults = true;
      } catch (error) {
        console.error('Error submitting quiz:', error);
        alert(timeExpired ? 'Time expired! Failed to submit quiz.' : 'Failed to submit quiz. Please try again.');
      } finally {
        this.submitting = false;
      }
    },
    reviewAnswers() {
      this.showResults = false;
    },
    async fetchQuiz() {
      this.loading = true;
      this.error = null;
      
      try {
        const quizId = this.$route.params.id;
        
        // Fetch quiz details
        const quizResponse = await axios.get(`http://localhost:3000/quizzes/${quizId}`);
        this.quiz = quizResponse.data;
        
        if (!this.quiz) {
          this.error = 'Quiz not found';
          return;
        }
        
        // Check if user has already attempted this quiz
        if (this.quiz.attempts?.some(attempt => attempt.studentId === this.user.id)) {
          this.error = 'You have already attempted this quiz';
          return;
        }
        
        // Initialize answers array
        this.answers = this.quiz.questions.map(question => ({
          questionId: question.id,
          answer: undefined
        }));
        
        // Start timer
        this.startTimer();
      } catch (error) {
        console.error('Error fetching quiz:', error);
        this.error = 'Failed to load quiz. Please try again later.';
      } finally {
        this.loading = false;
      }
    }
  },
  created() {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
      if (this.user.role !== 'student') {
        this.$router.push('/dashboard');
      } else {
        this.fetchQuiz();
      }
    } else {
      this.$router.push('/login');
    }
  },
  beforeUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
};
</script>