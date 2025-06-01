<template>
  <app-layout :page-title="assignment ? `${assignment.title} - Submissions` : 'Assignment Submissions'">
    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-pulse flex flex-col items-center">
        <svg class="w-12 h-12 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p class="mt-4 text-gray-600">Loading submissions...</p>
      </div>
    </div>
    
    <!-- Error state -->
    <div v-else-if="error" class="bg-white rounded-lg p-8 shadow-sm text-center">
      <svg class="w-16 h-16 text-error-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <h3 class="mt-4 text-lg font-medium text-gray-900">Error Loading Submissions</h3>
      <p class="mt-1 text-gray-500">{{ error }}</p>
      <div class="mt-6">
        <router-link to="/assignments" class="btn btn-primary">
          Back to Assignments
        </router-link>
      </div>
    </div>
    
    <!-- Submissions content -->
    <div v-else-if="assignment" class="space-y-6">
      <!-- Assignment info -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex justify-between items-start">
          <div>
            <h2 class="text-xl font-semibold text-gray-900">{{ assignment.title }}</h2>
            <p class="mt-2 text-gray-600">{{ assignment.description }}</p>
          </div>
          
          <div class="text-right">
            <p class="text-sm text-gray-500">Due Date</p>
            <p class="font-medium">{{ formatDate(assignment.dueDate) }}</p>
          </div>
        </div>
        
        <div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p class="text-sm text-gray-500">Course</p>
            <p class="font-medium">{{ course?.title || 'Unknown Course' }}</p>
          </div>
          
          <div>
            <p class="text-sm text-gray-500">Total Points</p>
            <p class="font-medium">{{ assignment.totalPoints }} points</p>
          </div>
          
          <div>
            <p class="text-sm text-gray-500">Submissions</p>
            <p class="font-medium">{{ assignment.submissions?.length || 0 }} students</p>
          </div>
        </div>
      </div>
      
      <!-- Submissions list -->
      <div class="bg-white rounded-lg shadow-sm overflow-hidden">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold">Student Submissions</h3>
            
            <div class="flex items-center space-x-4">
              <div class="text-sm text-gray-500">
                {{ getGradedCount }} of {{ assignment.submissions?.length || 0 }} graded
              </div>
              
              <select 
                v-model="filters.status" 
                class="form-input py-1"
              >
                <option value="">All Status</option>
                <option value="graded">Graded</option>
                <option value="ungraded">Ungraded</option>
              </select>
            </div>
          </div>
          
          <div v-if="!assignment.submissions || assignment.submissions.length === 0" class="text-center py-8">
            <svg class="w-12 h-12 text-gray-400 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p class="mt-4 text-gray-600">No submissions yet</p>
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
                      Submitted
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Grade
                    </th>
                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr 
                    v-for="submission in filteredSubmissions" 
                    :key="submission.id"
                  >
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <img 
                          :src="getStudentAvatar(submission.studentId)" 
                          :alt="getStudentName(submission.studentId)"
                          class="w-8 h-8 rounded-full"
                        />
                        <div class="ml-3">
                          <p class="text-sm font-medium text-gray-900">
                            {{ getStudentName(submission.studentId) }}
                          </p>
                          <p class="text-sm text-gray-500">
                            {{ getStudentEmail(submission.studentId) }}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900">
                        {{ formatDate(submission.submissionDate) }}
                      </div>
                      <div class="text-sm text-gray-500">
                        {{ isLate(submission.submissionDate) ? 'Late' : 'On time' }}
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span 
                        class="px-2 py-1 text-xs font-medium rounded-full"
                        :class="{
                          'bg-success-100 text-success-800': submission.grade !== undefined,
                          'bg-warning-100 text-warning-800': submission.grade === undefined
                        }"
                      >
                        {{ submission.grade !== undefined ? 'Graded' : 'Pending' }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div v-if="submission.grade !== undefined" class="text-sm">
                        <span class="font-medium text-gray-900">
                          {{ submission.grade }}
                        </span>
                        <span class="text-gray-500">
                          /{{ assignment.totalPoints }}
                        </span>
                      </div>
                      <div v-else class="text-sm text-gray-500">
                        Not graded
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        @click="openGradeModal(submission)"
                        class="text-primary-600 hover:text-primary-900"
                      >
                        {{ submission.grade !== undefined ? 'Edit Grade' : 'Grade' }}
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
    
    <!-- Grade modal -->
    <div 
      v-if="showGradeModal" 
      class="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title" 
      role="dialog" 
      aria-modal="true"
    >
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div 
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
          aria-hidden="true"
          @click="closeGradeModal"
        ></div>
        
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  Grade Submission
                </h3>
                
                <div class="mt-4">
                  <div class="mb-4">
                    <p class="text-sm text-gray-500">Student</p>
                    <p class="font-medium">{{ getStudentName(selectedSubmission?.studentId) }}</p>
                  </div>
                  
                  <div class="mb-4">
                    <p class="text-sm text-gray-500">Submission Link</p>
                    <a 
                      :href="selectedSubmission?.content" 
                      target="_blank"
                      class="text-primary-600 hover:underline break-all"
                    >
                      {{ selectedSubmission?.content }}
                    </a>
                  </div>
                  
                  <div class="mb-4">
                    <label for="grade" class="form-label">Grade (out of {{ assignment.totalPoints }})</label>
                    <input 
                      id="grade" 
                      v-model.number="gradeForm.grade" 
                      type="number" 
                      :max="assignment.totalPoints"
                      min="0"
                      class="form-input"
                      required
                    />
                  </div>
                  
                  <div>
                    <label for="feedback" class="form-label">Feedback</label>
                    <textarea 
                      id="feedback" 
                      v-model="gradeForm.feedback" 
                      rows="3" 
                      class="form-input"
                      placeholder="Provide feedback to the student..."
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button 
              type="button" 
              class="btn btn-primary sm:ml-3"
              :disabled="saving"
              @click="saveGrade"
            >
              {{ saving ? 'Saving...' : 'Save Grade' }}
            </button>
            <button 
              type="button" 
              class="btn btn-outline mt-3 sm:mt-0"
              @click="closeGradeModal"
            >
              Cancel
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
  name: 'AssignmentSubmissions',
  components: {
    AppLayout
  },
  data() {
    return {
      user: null,
      assignment: null,
      course: null,
      students: [],
      loading: true,
      error: null,
      filters: {
        status: ''
      },
      showGradeModal: false,
      selectedSubmission: null,
      gradeForm: {
        grade: null,
        feedback: ''
      },
      saving: false
    };
  },
  computed: {
    filteredSubmissions() {
      if (!this.assignment?.submissions) return [];
      
      return this.assignment.submissions.filter(submission => {
        if (this.filters.status === 'graded') {
          return submission.grade !== undefined;
        } else if (this.filters.status === 'ungraded') {
          return submission.grade === undefined;
        }
        return true;
      });
    },
    getGradedCount() {
      if (!this.assignment?.submissions) return '0';
      return this.assignment.submissions.filter(s => s.grade !== undefined).length;
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
    isLate(submissionDate) {
      return new Date(submissionDate) > new Date(this.assignment.dueDate);
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
    openGradeModal(submission) {
      this.selectedSubmission = submission;
      this.gradeForm.grade = submission.grade;
      this.gradeForm.feedback = submission.feedback || '';
      this.showGradeModal = true;
    },
    closeGradeModal() {
      this.showGradeModal = false;
      this.selectedSubmission = null;
      this.gradeForm = {
        grade: null,
        feedback: ''
      };
    },
    async saveGrade() {
      if (this.saving) return;
      
      this.saving = true;
      
      try {
        // Update submission in assignment
        const updatedSubmissions = this.assignment.submissions.map(s => 
          s.id === this.selectedSubmission.id 
            ? { 
                ...s, 
                grade: this.gradeForm.grade,
                feedback: this.gradeForm.feedback
              }
            : s
        );
        
        const updatedAssignment = {
          ...this.assignment,
          submissions: updatedSubmissions
        };
        
        await axios.put(`http://localhost:3000/assignments/${this.assignment.id}`, updatedAssignment);
        
        this.assignment = updatedAssignment;
        this.closeGradeModal();
        
        alert('Grade saved successfully!');
      } catch (error) {
        console.error('Error saving grade:', error);
        alert('Failed to save grade. Please try again.');
      } finally {
        this.saving = false;
      }
    },
    async fetchAssignmentDetails() {
      this.loading = true;
      this.error = null;
      
      try {
        const assignmentId = this.$route.params.id;
        
        // Fetch assignment details
        const assignmentResponse = await axios.get(`http://localhost:3000/assignments/${assignmentId}`);
        this.assignment = assignmentResponse.data;
        
        if (!this.assignment) {
          this.error = 'Assignment not found';
          return;
        }
        
        // Fetch course details
        const courseResponse = await axios.get(`http://localhost:3000/courses/${this.assignment.courseId}`);
        this.course = courseResponse.data;
        
        // Verify instructor permission
        if (this.course.instructorId !== this.user.id) {
          this.error = 'You do not have permission to view these submissions';
          return;
        }
        
        // Fetch all students
        const studentsResponse = await axios.get('http://localhost:3000/users?role=student');
        this.students = studentsResponse.data;
      } catch (error) {
        console.error('Error fetching assignment details:', error);
        this.error = 'Failed to load assignment details. Please try again later.';
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
        this.fetchAssignmentDetails();
      }
    } else {
      this.$router.push('/login');
    }
  }
};
</script>