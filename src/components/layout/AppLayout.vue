<template>
  <div class="flex h-screen bg-gray-50">
    <!-- Sidebar (desktop) -->
    <aside class="hidden md:flex md:flex-col md:w-64 bg-white border-r border-gray-200">
      <div class="p-4 border-b border-gray-200">
        <h1 class="text-xl font-semibold text-primary-600">EduLearn LMS</h1>
      </div>
      
      <div class="flex-1 overflow-y-auto py-4">
        <nav class="px-2 space-y-1">
          <router-link 
            to="/dashboard" 
            class="nav-link"
            :class="{ 'bg-primary-50 text-primary-700': $route.path === '/dashboard' }"
          >
            <svg class="nav-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Dashboard
          </router-link>
          
          <router-link 
            to="/courses" 
            class="nav-link"
            :class="{ 'bg-primary-50 text-primary-700': $route.path.includes('/courses') }"
          >
            <svg class="nav-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Courses
          </router-link>
          
          <router-link 
            to="/assignments" 
            class="nav-link"
            :class="{ 'bg-primary-50 text-primary-700': $route.path.includes('/assignments') }"
          >
            <svg class="nav-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Assignments
          </router-link>
          
          <router-link 
            to="/quizzes" 
            class="nav-link"
            :class="{ 'bg-primary-50 text-primary-700': $route.path.includes('/quizzes') }"
          >
            <svg class="nav-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Quizzes
          </router-link>
        </nav>
      </div>
      
      <div class="p-4 border-t border-gray-200">
        <div class="flex items-center">
          <img 
            :src="user.avatar" 
            alt="User avatar" 
            class="w-8 h-8 rounded-full mr-3"
          />
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-900">{{ user.name }}</p>
            <p class="text-xs text-gray-500 capitalize">{{ user.role }}</p>
          </div>
          <button @click="logout" class="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
    
    <!-- Main content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Top navbar -->
      <header class="bg-white border-b border-gray-200 shadow-sm z-10">
        <div class="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div class="flex items-center md:hidden">
            <button @click="isMobileMenuOpen = !isMobileMenuOpen" class="text-gray-500 hover:text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 class="ml-3 text-lg font-semibold text-primary-600">EduLearn LMS</h1>
          </div>
          
          <div class="flex items-center">
            <router-link to="/profile" class="flex items-center md:hidden">
              <img 
                :src="user.avatar" 
                alt="User avatar" 
                class="w-8 h-8 rounded-full"
              />
            </router-link>
            <h1 class="hidden md:block text-xl font-semibold text-gray-800">{{ pageTitle }}</h1>
          </div>
          
          <div class="flex items-center space-x-4">
            <div class="relative">
              <button @click="isNotificationsOpen = !isNotificationsOpen" class="text-gray-500 hover:text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
              
              <div v-if="isNotificationsOpen" class="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div class="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                  <div class="px-4 py-2 border-b border-gray-200">
                    <h3 class="text-sm font-medium text-gray-900">Notifications</h3>
                  </div>
                  <div v-if="notifications.length === 0" class="px-4 py-3 text-sm text-gray-500">
                    No new notifications
                  </div>
                  <div v-for="notification in notifications" :key="notification.id" class="px-4 py-3 hover:bg-gray-50">
                    <p class="text-sm text-gray-700">{{ notification.message }}</p>
                    <p class="text-xs text-gray-500 mt-1">{{ formatDate(notification.date) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <!-- Mobile menu -->
      <div v-if="isMobileMenuOpen" class="md:hidden fixed inset-0 z-40 flex">
        <div @click="isMobileMenuOpen = false" class="fixed inset-0 bg-gray-600 bg-opacity-75"></div>
        <div class="relative flex-1 flex flex-col max-w-xs w-full bg-white">
          <div class="absolute top-0 right-0 -mr-12 pt-2">
            <button @click="isMobileMenuOpen = false" class="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
              <svg class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div class="pt-5 pb-4 flex-1 overflow-y-auto">
            <div class="flex-shrink-0 flex items-center px-4">
              <h1 class="text-xl font-semibold text-primary-600">EduLearn LMS</h1>
            </div>
            <nav class="mt-5 px-2 space-y-1">
              <router-link 
                to="/dashboard" 
                class="nav-link"
                :class="{ 'bg-primary-50 text-primary-700': $route.path === '/dashboard' }"
                @click="isMobileMenuOpen = false"
              >
                <svg class="nav-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Dashboard
              </router-link>
              
              <router-link 
                to="/courses" 
                class="nav-link"
                :class="{ 'bg-primary-50 text-primary-700': $route.path.includes('/courses') }"
                @click="isMobileMenuOpen = false"
              >
                <svg class="nav-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Courses
              </router-link>
              
              <router-link 
                to="/assignments" 
                class="nav-link"
                :class="{ 'bg-primary-50 text-primary-700': $route.path.includes('/assignments') }"
                @click="isMobileMenuOpen = false"
              >
                <svg class="nav-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Assignments
              </router-link>
              
              <router-link 
                to="/quizzes" 
                class="nav-link"
                :class="{ 'bg-primary-50 text-primary-700': $route.path.includes('/quizzes') }"
                @click="isMobileMenuOpen = false"
              >
                <svg class="nav-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Quizzes
              </router-link>
            </nav>
          </div>
          
          <div class="flex-shrink-0 border-t border-gray-200 p-4">
            <div class="flex items-center">
              <img 
                :src="user.avatar" 
                alt="User avatar" 
                class="w-10 h-10 rounded-full mr-3"
              />
              <div class="flex-1">
                <p class="text-base font-medium text-gray-900">{{ user.name }}</p>
                <p class="text-sm text-gray-500 capitalize">{{ user.role }}</p>
              </div>
              <button @click="logout" class="text-gray-400 hover:text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Page content -->
      <main class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-gray-50">
        <slot></slot>
      </main>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppLayout',
  props: {
    pageTitle: {
      type: String,
      default: 'Dashboard'
    }
  },
  data() {
    return {
      user: null,
      isMobileMenuOpen: false,
      isNotificationsOpen: false,
      notifications: [
        {
          id: 1,
          message: 'New assignment has been posted in Web Development course',
          date: new Date(Date.now() - 60 * 60 * 1000)
        },
        {
          id: 2,
          message: 'Your submission for JavaScript Basics has been graded',
          date: new Date(Date.now() - 24 * 60 * 60 * 1000)
        }
      ]
    };
  },
  methods: {
    logout() {
      localStorage.removeItem('user');
      this.$router.push('/login');
    },
    formatDate(date) {
      // Simple relative time formatter
      const now = new Date();
      const diffInHours = Math.floor((now - new Date(date)) / (1000 * 60 * 60));
      
      if (diffInHours < 1) {
        return 'Just now';
      } else if (diffInHours < 24) {
        return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
      } else {
        const diffInDays = Math.floor(diffInHours / 24);
        return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
      }
    }
  },
  created() {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
    } else {
      this.$router.push('/login');
    }
  },
  watch: {
    '$route'() {
      this.isMobileMenuOpen = false;
      this.isNotificationsOpen = false;
    }
  }
};
</script>

<style>
.nav-link {
  @apply flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200;
}

.nav-icon {
  @apply mr-3 flex-shrink-0 h-5 w-5;
}
</style>