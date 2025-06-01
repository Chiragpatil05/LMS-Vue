<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
    <div class="text-center">
      <h1 class="text-9xl font-bold text-primary-500">404</h1>
      <h2 class="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">Page not found</h2>
      <p class="mt-6 text-base leading-7 text-gray-600">Sorry, we couldn't find the page you're looking for.</p>
      <div class="mt-10 flex items-center justify-center gap-x-6">
        <router-link to="/dashboard" class="btn btn-primary">
          Go back home
        </router-link>
        <router-link to="/courses" class="text-sm font-semibold text-gray-900">
          View courses <span aria-hidden="true">→</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFound'
}
</script>