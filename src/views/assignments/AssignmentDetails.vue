<template>
  <app-layout :page-title="assignment ? assignment.title : 'Assignment Details'">
    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-pulse flex flex-col items-center">
        <svg class="w-12 h-12 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p class="mt-4 text-gray-600">Loading assignment details...</p>
      </div>
    </div>
    
    <!-- Error state -->
    <div v-else-if="error" class="bg-white rounded-lg p-8 shadow-sm text-center">
      <svg class="w-16 h-16 text-error-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <h3 class="mt-4 text-lg font-medium text-gray-900">Error Loading Assignment</h3>
      <p class="mt-1 text-gray-500">{{ error }}</p>
      <div class="mt-6">
        <router-link to="/assignments" class="btn btn-primary">
          Back to Assignments
        </router-link>
      </div>
    </div>
    
    <!-- Assignment content -->
    <div v-else-if="assignment" class="space-y-6">
      <!-- Assignment header -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex justify-between items-start">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">{{ assignment.title }}</h1>
            <p class="mt-2 text-gray-600">{{ assignment.description }}</p>
          </div>
          
          <div class="flex items-center space-x-2">
            <span 
              class="px-3 py-1 text-sm font-medium rounded-full"
              :class="{
                'bg-warning-100 text-warning-800': isUpcoming(assignment.dueDate),
                'bg-error-100 text-error-800': isOverdue(assignment.dueDate),
                'bg-success-100 text-success-800': isSubmitted
              }"
            >
              {{ getAssignmentStatus }}
            </span>
          </div>
        </div>
        
        <div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <p class="text-sm text-gray-500">Due Date</p>
              <p class="font-medium">{{ formatDueDate(assignment.dueDate) }}</p>
            </div>
          </div>
          
          <div class="flex items-center">
            <svg class="w-5 h-5 text-gray-400 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <div>
              <p class="text-sm text-gray-500">Total Points</p>
              <p class="font-medium">{{ assignment.totalPoints }} points</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Student view -->
      <div v-if="user.role === 'student'" class="bg-white rounded-lg shadow-sm p-6">
        <h2 class="text-xl font-semibold mb-4">Your Submission</h2>
        
        <div v-if="isSubmitted" class="space-y-4">
          <div class="bg-gray-50 rounded-lg p-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500">Submitted on</p>
                <p class="font-medium">{{ formatDate(submission.submissionDate) }}</p>
              </div>
              
              <div v-if="submission.grade !== undefined" class="text-right">
                <p class="text-sm text-gray-500">Grade</p>
                <p class="text-xl font-bold text-primary-600">
                  {{ submission.grade }}/{{ assignment.totalPoints }}
                </p>
              </div>
            </div>
            
            <div class="mt-4">
              <p class="text-sm text-gray-500">Submission Link</p>
              <a 
                :href="submission.content" 
                target="_blank" 
                class="text-primary-600 hover:underline break-all"
              >
                {{ submission.content }}
              </a>
            </div>
            
            <div v-if="submission.feedback" class="mt-4">
              <p class="text-sm text-gray-500">Instructor Feedback</p>
              <p class="mt-1 text-gray-700">{{ submission.feedback }}</p>
            </div>
          </div>
        </div>
        
        <div v-else>
          <div v-if="isOverdue(assignment.dueDate)" class="bg-error-50 text-error-700 p-4 rounded-lg mb-4">
            <p class="font-medium">This assignment is overdue</p>
            <p class="text-sm mt-1">The deadline was {{ formatDate(assignment.dueDate) }}</p>
          </div>
          
          <form @submit.prevent="submitAssignment" class="space-y-4">
            <div>
              <label for="submission-link" class="form-label">Submission Link</label>
              <input 
                id="submission-link" 
                v-model="submissionLink" 
                type="url" 
                class="form-input"
                placeholder="https://github.com/your-repo"
                required
              />
              <p class="mt-1 text-sm text-gray-500">
                Please provide a link to your work (e.g., GitHub repository, Google Drive, etc.)
              </p>
            </div>
            
            <button 
              type="submit" 
              class="btn btn-primary"
              :disabled="submitting"
            >
              {{ submitting ? 'Submitting...' : 'Submit Assignment' }}
            </button>
          </form>
        </div>
      </div>
      
      <!-- Instructor view -->
      <div v-else class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold">Student Submissions</h2>
          <p class="text-gray-500">
            {{ assignment.submissions?.length || 0 }} submissions
          </p>
        </div>
        
        <div v-if="!assignment.submissions || assignment.submissions.length === 0" class="text-center py-8">
          <svg class="w-12 h-12 text-gray-400 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p class="mt-4 text-gray-600">No submissions yet</p>
        </div>
        
        <div v-else class="space-y-4">
          <div 
            v-for="submission in assignment.submissions" 
            :key="submission.id"
            class="border rounded-lg p-4"
          >
            <div class="flex items-start justify-between">
              <div>
                <div class="flex items-center">
                  <img 
                    :src="getStudentAvatar(submission.studentId)" 
                    :alt="getStudentName(submission.studentId)"
                    class="w-8 h-8 rounded-full mr-2"
                  />
                  <div>
                    <p class="font-medium">{{ getStudentName(submission.studentId) }}</p>
                    <p class="text-sm text-gray-500">
                      Submitted {{ formatDate(submission.submissionDate) }}
                    </p>
                  </div>
                </div>
                
                <div class="mt-3">
                  <a 
                    :href="submission.content" 
                    target="_blank" 
                    class="text-primary-600 hover:underline break-all"
                  >
                    {{ submission.content }}
                  </a>
                </div>
              </div>
              
              <div class="text-right">
                <p class="text-sm text-gray-500">Grade</p>
                <p class="text-xl font-bold" :class="submission.grade ? 'text-primary-600' : 'text-gray-400'">
                  {{ submission.grade || '-' }}/{{ assignment.totalPoints }}
                </p>
              </div>
            </div>
            
            <div class="mt-4">
              <label :for="'feedback-' + submission.id" class="form-label">Feedback</label>
              <textarea 
                :id="'feedback-' + submission.id"
                v-model="submission.feedback"
                rows="2"
                class="form-input"
                placeholder="Provide feedback to the student..."
              ></textarea>
            </div>
            
            <div class="mt-4 flex items-center justify-between">
              <div class="flex-1 mr-4">
                <label :for="'grade-' + submission.id" class="form-label">Grade</label>
                <input 
                  :id="'grade-' + submission.id"
                  v-model.number="submission.grade"
                  type="number"
                  :max="assignment.totalPoints"
                  min="0"
                  class="form-input"
                />
              </div>
              
              <button 
                @click="gradeSubmission(submission)"
                class="btn btn-primary"
                :disabled="grading"
              >
                {{ grading ? 'Saving...' : 'Save Grade' }}
              </button>
            </div>
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
  name: 'AssignmentDetails',
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
      submissionLink: '',
      submitting: false,
      grading: false
    };
  },
  computed: {
    isSubmitted() {
      if (!this.assignment?.submissions) return false;
      return this.assignment.submissions.some(submission => 
        submission.studentId === this.user.id
      );
    },
    submission() {
      if (!this.assignment?.submissions) return null;
      return this.assignment.submissions.find(submission => 
        submission.studentId === this.user.id
      );
    },
    getAssignmentStatus() {
      if (this.isSubmitted) {
        return this.submission.grade ? 'Graded' : 'Submitted';
      }
      return this.isOverdue(this.assignment.dueDate) ? 'Overdue' : 'Pending';
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
    formatDueDate(date) {
      const dueDate = new Date(date);
      const now = new Date();
      
      // Calculate difference in days
      const diffTime = dueDate - now;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 0) {
        return `Due ${this.formatDate(date)} (Overdue)`;
      } else if (diffDays === 0) {
        return `Due today at ${dueDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
      } else if (diffDays === 1) {
        return `Due tomorrow at ${dueDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
      } else {
        return `Due ${this.formatDate(date)}`;
      }
    },
    isUpcoming(date) {
      const dueDate = new Date(date);
      const now = new Date();
      return dueDate > now;
    },
    isOverdue(date) {
      const dueDate = new Date(date);
      const now = new Date();
      return dueDate < now;
    },
    getStudentName(studentId) {
      const student = this.students.find(s => s.id === studentId);
      return student ? student.name : 'Unknown Student';
    },
    getStudentAvatar(studentId) {
      const student = this.students.find(s => s.id === studentId);
      return student ? student.avatar : 'https://ui-avatars.com/api/?name=Unknown+Student&background=random';
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
        
        // For instructors, fetch all students
        if (this.user.role === 'instructor') {
          const studentsResponse = await axios.get('http://localhost:3000/users?role=student');
          this.students = studentsResponse.data;
        }
      } catch (error) {
        console.error('Error fetching assignment details:', error);
        this.error = 'Failed to load assignment details. Please try again later.';
      } finally {
        this.loading = false;
      }
    },
    async submitAssignment() {
      if (this.submitting) return;
      
      this.submitting = true;
      
      try {
        const submission = {
          id: Date.now().toString(),
          studentId: this.user.id,
          submissionDate: new Date().toISOString(),
          content: this.submissionLink
        };
        
        // Add submission to assignment
        const updatedAssignment = {
          ...this.assignment,
          submissions: [...(this.assignment.submissions || []), submission]
        };
        
        await axios.put(`http://localhost:3000/assignments/${this.assignment.id}`, updatedAssignment);
        
        this.assignment = updatedAssignment;
        this.submissionLink = '';
        
        alert('Assignment submitted successfully!');
      } catch (error) {
        console.error('Error submitting assignment:', error);
        alert('Failed to submit assignment. Please try again.');
      } finally {
        this.submitting = false;
      }
    },
    async gradeSubmission(submission) {
      if (this.grading) return;
      
      this.grading = true;
      
      try {
        // Update submission in assignment
        const updatedSubmissions = this.assignment.submissions.map(s => 
          s.id === submission.id ? submission : s
        );
        
        const updatedAssignment = {
          ...this.assignment,
          submissions: updatedSubmissions
        };
        
        await axios.put(`http://localhost:3000/assignments/${this.assignment.id}`, updatedAssignment);
        
        this.assignment = updatedAssignment;
        
        alert('Grade saved successfully!');
      } catch (error) {
        console.error('Error grading submission:', error);
        alert('Failed to save grade. Please try again.');
      } finally {
        this.grading = false;
      }
    }
  },
  created() {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
      this.fetchAssignmentDetails();
    } else {
      this.$router.push('/login');
    }
  }
};
</script>