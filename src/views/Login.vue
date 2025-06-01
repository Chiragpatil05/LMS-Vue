<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
      <div class="flex justify-center mb-8">
        <h1 class="text-2xl font-bold text-primary-600">EduLearn LMS</h1>
      </div>
      
      <h2 class="text-center text-2xl font-semibold text-gray-800 mb-6">Sign in to your account</h2>
      
      <div v-if="error" class="mb-4 p-3 bg-error-50 text-error-700 rounded-md">
        {{ error }}
      </div>
      
      <form @submit.prevent="handleLogin">
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
        
        <div class="mb-6">
          <label for="password" class="form-label">Password</label>
          <input 
            id="password" 
            type="password" 
            v-model="password" 
            class="form-input" 
            required
          />
        </div>
        
        <button 
          type="submit" 
          class="w-full btn btn-primary"
          :disabled="loading"
        >
          <span v-if="loading">Signing in...</span>
          <span v-else>Sign in</span>
        </button>
      </form>
      
      <div class="mt-4 text-center">
        <p class="text-gray-600">
          Don't have an account? 
          <router-link to="/register" class="text-primary-600 hover:underline">
            Sign up
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: '',
      error: '',
      loading: false
    };
  },
  methods: {
    async handleLogin() {
      this.loading = true;
      this.error = '';
      
      try {
        // Fetch users from json-server to simulate authentication
        const response = await axios.get('http://localhost:3000/users');
        const users = response.data;
        
        // Find user with matching email and password
        const user = users.find(u => 
          u.email === this.email && u.password === this.password
        );
        
        if (user) {
          // Remove password before storing user data
          const { password, ...userData } = user;
          
          // Store user data in localStorage
          localStorage.setItem('user', JSON.stringify(userData));
          
          // Redirect to dashboard
          this.$router.push('/dashboard');
        } else {
          this.error = 'Invalid email or password';
        }
      } catch (error) {
        console.error('Login error:', error);
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