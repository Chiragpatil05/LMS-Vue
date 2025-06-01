<template>
  <app-layout :page-title="quiz ? quiz.title : 'Quiz Details'">
    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-pulse flex flex-col items-center">
        <svg class="w-12 h-12 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p class="mt-4 text-gray-600">Loading quiz details...</p>
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
    <div v-else-if="quiz" class="space-y-6">
      <!-- Quiz header -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex justify-between items-start">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">{{ quiz.title }}</h1>
            <p class="mt-2 text-gray-600">{{ quiz.description }}</p>
          </div>
          
          <div class="flex items-center space-x-4">
            <router-link 
              :to="`/quizzes/${quiz.id}/edit`" 
              class="btn btn-outline py-1 px-3"
            >
              Edit Quiz
            </router-link>
          </div>
        </div>
        
        <div class="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-gray-400 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <div>
              <p class="text-sm text-gray-500">Course</p>
              <p class="font-medium">{{ course?.title || 'Unknown Course' }}</p>
            </div>
          </div>
          
          <div class="flex items-center">
            <svg class="w-5 h-5 text-gray-400 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p class="text-sm text-gray-500">Time Limit</p>
              <p class="font-medium">{{ quiz.timeLimit }} minutes</p>
            </div>
          </div>
          
          <div class="flex items-center">
            <svg class="w-5 h-5 text-gray-400 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <div>
              <p class="text-sm text-gray-500">Total Points</p>
              <p class="font-medium">{{ quiz.totalPoints }} points</p>
            </div>
          </div>
          
          <div class="flex items-center">
            <svg class="w-5 h-5 text-gray-400 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p class="text-sm text-gray-500">Passing Score</p>
              <p class="font-medium">{{ quiz.passingScore }} points</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Quiz statistics -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h2 class="text-xl font-semibold mb-6">Quiz Statistics</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-gray-50 rounded-lg p-4">
            <p class="text-sm text-gray-500">Total Attempts</p>
            <p class="text-2xl font-bold text-gray-900">{{ quiz.attempts?.length || 0 }}</p>
            <p class="text-sm text-gray-500 mt-1">
              {{ getUniqueStudentCount }} unique students
            </p>
          </div>
          
          <div class="bg-gray-50 rounded-lg p-4">
            <p class="text-sm text-gray-500">Average Score</p>
            <p class="text-2xl font-bold text-gray-900">{{ averageScore }}/{{ quiz.totalPoints }}</p>
            <p class="text-sm text-gray-500 mt-1">
              {{ averagePercentage }}% average
            </p>
          </div>
          
          <div class="bg-gray-50 rounded-lg p-4">
            <p class="text-sm text-gray-500">Pass Rate</p>
            <p class="text-2xl font-bold text-gray-900">{{ passRate }}%</p>
            <p class="text-sm text-gray-500 mt-1">
              {{ getPassedCount }} passed out of {{ quiz.attempts?.length || 0 }}
            </p>
          </div>
        </div>
      </div>
      
      <!-- Student attempts -->
      <div class="bg-white rounded-lg shadow-sm overflow-hidden">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-semibold">Student Attempts</h2>
            
            <div class="flex items-center space-x-4">
              <select 
                v-model="filters.status" 
                class="form-input py-1"
              >
                <option value="">All Status</option>
                <option value="passed">Passed</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>
          
          <div v-if="!quiz.attempts || quiz.attempts.length === 0" class="text-center py-8">
            <svg class="w-12 h-12 text-gray-400 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p class="mt-4 text-gray-600">No attempts yet</p>
          </div>
          
          <div v-else>
            <!-- Table header -->
            <div class="border-b border-gray-200">
              <table class="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Attempted
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Score
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr 
                    v-for="attempt in filteredAttempts" 
                    :key="attempt.id"
                  >
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <img 
                          :src="getStudentAvatar(attempt.studentId)" 
                          :alt="getStudentName(attempt.studentId)"
                          class="w-8 h-8 rounded-full"
                        />
                        <div class="ml-3">
                          <p class="text-sm font-medium text-gray-900">
                            {{ getStudentName(attempt.studentId) }}
                          </p>
                          <p class="text-sm text-gray-500">
                            {{ getStudentEmail(attempt.studentId) }}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900">
                        {{ formatDate(attempt.attemptDate) }}
                      </div>
                      <div class="text-sm text-gray-500">
                        {{ formatTimeSpent(attempt.timeSpent) }}
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm">
                        <span class="font-medium text-gray-900">
                          {{ attempt.score }}
                        </span>
                        <span class="text-gray-500">
                          /{{ quiz.totalPoints }}
                        </span>
                        <div class="text-sm text-gray-500">
                          {{ getScorePercentage(attempt.score) }}%
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span 
                        class="px-2 py-1 text-xs font-medium rounded-full"
                        :class="{
                          'bg-success-100 text-success-800': attempt.score >= quiz.passingScore,
                          'bg-error-100 text-error-800': attempt.score < quiz.passingScore
                        }"
                      >
                        {{ attempt.score >= quiz.passingScore ? 'Passed' : 'Failed' }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        @click="viewAttemptDetails(attempt)"
                        class="text-primary-600 hover:text-primary-900"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Attempt details modal -->
    <div 
      v-if="showAttemptModal" 
      class="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title" 
      role="dialog" 
      aria-modal="true"
    >
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div 
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
          aria-hidden="true"
          @click="closeAttemptModal"
        ></div>
        
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  Attempt Details
                </h3>
                
                <div class="mt-4">
                  <div class="mb-6 grid grid-cols-2 gap-4">
                    <div>
                      <p class="text-sm text-gray-500">Student</p>
                      <p class="font-medium">{{ getStudentName(selectedAttempt?.studentId) }}</p>
                    </div>
                    
                    <div class="text-right">
                      <p class="text-sm text-gray-500">Attempted on</p>
                      <p class="font-medium">{{ formatDate(selectedAttempt?.attemptDate) }}</p>
                    </div>
                  </div>
                  
                  <div class="space-y-6">
                    <div 
                      v-for="(answer, index) in selectedAttempt?.answers" 
                      :key="index"
                      class="border rounded-lg p-4"
                    >
                      <div class="flex items-start justify-between">
                        <div class="flex-1">
                          <p class="font-medium text-gray-900">
                            Question {{ index + 1 }}
                          </p>
                          <p class="mt-1 text-gray-700">
                            {{ getQuestion(answer.questionId)?.text }}
                          </p>
                        </div>
                        
                        <div 
                          class="ml-4 px-2 py-1 text-xs font-medium rounded-full"
                          :class="{
                            'bg-success-100 text-success-800': isCorrectAnswer(answer),
                            'bg-error-100 text-error-800': !isCorrectAnswer(answer)
                          }"
                        >
                          {{ isCorrectAnswer(answer) ? 'Correct' : 'Incorrect' }}
                        </div>
                      </div>
                      
                      <div class="mt-3">
                        <p class="text-sm text-gray-500">Student's Answer:</p>
                        <p class="mt-1 text-gray-700">{{ answer.answer }}</p>
                      </div>
                      
                      <div class="mt-2">
                        <p class="text-sm text-gray-500">Correct Answer:</p>
                        <p class="mt-1 text-gray-700">{{ getQuestion(answer.questionId)?.correctAnswer }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button 
              type="button" 
              class="btn btn-outline"
              @click="closeAttemptModal"
            >
              Close
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
  name: 'QuizDetails',
  components: {
    AppLayout
  },
  data() {
    return {
      user: null,
      quiz: null,
      course: null,
      students: [],
      loading: true,
      error: null,
      filters: {
        status: ''
      },
      showAttemptModal: false,
      selectedAttempt: null
    };
  },
  computed: {
//     filteredAttempts() {
//       if (!this.quiz?.attempts) return [];
      
//       return this.quiz.attempts.filter(attempt => {
//         if (this.filters.status === 'passed') {
//           return attempt.score >= this.quiz.passingScore;
//         } else if (this.filters.status === '
// failed') {
//           return attempt.score < this.quiz.passingScore;
//         }
//         return true;
//       }).sort((a, b) => new Date(b.attemptDate) - new Date(a.attemptDate));
//     },
    filteredAttempts() {
  if (!this.quiz?.attempts) return [];
  
  return this.quiz.attempts.filter(attempt => {
    if (this.filters.status === 'passed') {
      return attempt.score >= this.quiz.passingScore;
    } else if (this.filters.status === 'failed') {
      return attempt.score < this.quiz.passingScore;
    }
    return true;
  });
}
,
    getUniqueStudentCount() {
      if (!this.quiz?.attempts) return 0;
      const uniqueStudents = new Set(this.quiz.attempts.map(attempt => attempt.studentId));
      return uniqueStudents.size;
    },
    averageScore() {
      if (!this.quiz?.attempts || this.quiz.attempts.length === 0) return 0;
      const totalScore = this.quiz.attempts.reduce((sum, attempt) => sum + attempt.score, 0);
      return Math.round(totalScore / this.quiz.attempts.length);
    },
    averagePercentage() {
      return Math.round((this.averageScore / this.quiz.totalPoints) * 100);
    },
    getPassedCount() {
      if (!this.quiz?.attempts) return 0;
      return this.quiz.attempts.filter(attempt => attempt.score >= this.quiz.passingScore).length;
    },
    passRate() {
      if (!this.quiz?.attempts || this.quiz.attempts.length === 0) return 0;
      return Math.round((this.getPassedCount / this.quiz.attempts.length) * 100);
    }
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    formatTimeSpent(seconds) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}m ${remainingSeconds}s`;
    },
    getScorePercentage(score) {
      return Math.round((score / this.quiz.totalPoints) * 100);
    },
    getStudentName(studentId) {
      const student = this.students.find(s => s.id === studentId);
      return student ? student.name : 'Unknown Student';
    },
    getStudentEmail(studentId) {
      const student = this.students.find(s => s.id === studentId);
      return student ? student.email : '';
    },
    getStudentAvatar(studentId) {
      const student = this.students.find(s => s.id === studentId);
      return student ? student.avatar : 'https://ui-avatars.com/api/?name=Unknown+Student&background=random';
    },
    getQuestion(questionId) {
      return this.quiz.questions.find(q => q.id === questionId);
    },
    isCorrectAnswer(answer) {
      const question = this.getQuestion(answer.questionId);
      return question && answer.answer === question.correctAnswer;
    },
    viewAttemptDetails(attempt) {
      this.selectedAttempt = attempt;
      this.showAttemptModal = true;
    },
    closeAttemptModal() {
      this.showAttemptModal = false;
      this.selectedAttempt = null;
    },
    async fetchQuizDetails() {
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
        
        // Fetch course details
        const courseResponse = await axios.get(`http://localhost:3000/courses/${this.quiz.courseId}`);
        this.course = courseResponse.data;
        
        // Verify instructor permission
        if (this.course.instructorId !== this.user.id) {
          this.error = 'You do not have permission to view these results';
          return;
        }
        
        // Fetch all students
        const studentsResponse = await axios.get('http://localhost:3000/users?role=student');
        this.students = studentsResponse.data;
      } catch (error) {
        console.error('Error fetching quiz details:', error);
        this.error = 'Failed to load quiz details. Please try again later.';
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
        this.fetchQuizDetails();
      }
    } else {
      this.$router.push('/login');
    }
  }
};
</script>