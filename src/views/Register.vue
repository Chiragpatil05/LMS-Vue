<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
      <div class="flex justify-center mb-8">
        <h1 class="text-2xl font-bold text-primary-600">EduLearn LMS</h1>
      </div>
      
      <h2 class="text-center text-2xl font-semibold text-gray-800 mb-6">Create your account</h2>
      
      <div v-if="error" class="mb-4 p-3 bg-error-50 text-error-700 rounded-md">
        {{ error }}
      </div>
      
      <form @submit.prevent="handleRegister">
        <div class="mb-4">
          <label for="name" class="form-label">Full Name</label>
          <input 
            id="name" 
            type="text" 
            v-model="name" 
            class="form-input" 
            required
          />
        </div>
        
        <div class="mb-4">
          <label for="email" class="form-label">Email</label>
          <input 
            id="email" 
            type="email" 
            v-model="email" 
            class="form-input" 
            required
          />
        </div>
        
        <div class="mb-4">
          <label for="password" class="form-label">Password</label>
          <input 
            id="password" 
            type="password" 
            v-model="password" 
            class="form-input" 
            required
          />
        </div>
        
        <div class="mb-6">
          <label class="form-label">Account Type</label>
          <div class="flex space-x-4 mt-1">
            <label class="flex items-center">
              <input 
                type="radio" 
                v-model="role" 
                value="student"
                class="text-primary-600 focus:ring-primary-500"
              />
              <span class="ml-2">Student</span>
            </label>
            <label class="flex items-center">
              <input 
                type="radio" 
                v-model="role" 
                value="instructor"
                class="text-primary-600 focus:ring-primary-500"
              />
              <span class="ml-2">Instructor</span>
            </label>
          </div>
        </div>
        
        <button 
          type="submit" 
          class="w-full btn btn-primary"
          :disabled="loading"
        >
          <span v-if="loading">Creating account...</span>
          <span v-else>Create Account</span>
        </button>
      </form>
      
      <div class="mt-4 text-center">
        <p class="text-gray-600">
          Already have an account? 
          <router-link to="/login" class="text-primary-600 hover:underline">
            Sign in
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Register',
  data() {
    return {
      name: '',
      email: '',
      password: '',
      role: 'student',
      error: '',
      loading: false
    };
  },
  methods: {
    async handleRegister() {
      this.loading = true;
      this.error = '';
      
      try {
        // Check if email already exists
        const response = await axios.get(`http://localhost:3000/users?email=${this.email}`);
        
        if (response.data.length > 0) {
          this.error = 'Email already in use. Please use a different email.';
          this.loading = false;
          return;
        }
        
        // Create new user
        const newUser = {
          id: Date.now().toString(),
          name: this.name,
          email: this.email,
          password: this.password,
          role: this.role,
          createdAt: new Date().toISOString(),
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(this.name)}&background=random`
        };
        
        await axios.post('http://localhost:3000/users', newUser);
        
        // Remove password before storing user data
        const { password, ...userData } = newUser;
        
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Redirect to dashboard
        this.$router.push('/dashboard');
      } catch (error) {
        console.error('Registration error:', error);
        this.error = 'An error occurred. Please try again.';
      } finally {
        this.loading = false;
      }
    }
  },
  created() {
    // Check if user is already logged in
    const user = localStorage.getItem('user');
    if (user) {
      this.$router.push('/dashboard');
    }
  }
};
</script>