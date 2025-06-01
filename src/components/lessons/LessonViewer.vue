<template>
  <div class="fixed inset-0 z-50 overflow-hidden bg-gray-900">
    <div class="flex h-full flex-col">
      <!-- Header -->
      <div class="flex items-center justify-between bg-white px-4 py-3 shadow-sm">
        <div class="flex items-center">
          <button 
            @click="$emit('close')" 
            class="mr-4 text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div>
            <h2 class="text-lg font-medium text-gray-900">{{ lesson.title }}</h2>
            <p class="text-sm text-gray-500">{{ lesson.duration }}</p>
          </div>
        </div>
        
        <div class="flex items-center space-x-4">
          <button 
            v-if="hasPreviousLesson"
            @click="$emit('previous')"
            class="flex items-center text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </button>
          
          <button 
            v-if="hasNextLesson"
            @click="$emit('next')"
            class="flex items-center text-gray-500 hover:text-gray-700"
          >
            Next
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Content -->
      <div class="flex-1 overflow-y-auto bg-black">
        <div class="aspect-w-16 aspect-h-9 w-full">
          <div v-if="!videoUrl" class="w-full h-full flex items-center justify-center text-white">
            <p>No video available for this lesson</p>
          </div>
          <iframe
            v-else
            :src="videoUrl"
            class="w-full h-full"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
        
        <div class="max-w-4xl mx-auto p-6">
          <div class="bg-white rounded-lg p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Lesson Description</h3>
            <p class="text-gray-700">{{ lesson.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LessonViewer',
  props: {
    lesson: {
      type: Object,
      required: true
    },
    hasPreviousLesson: {
      type: Boolean,
      default: false
    },
    hasNextLesson: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    videoUrl() {
      if (!this.lesson.videoUrl) return null;
      
      // Handle YouTube URLs
      if (this.lesson.videoUrl.includes('youtube.com') || this.lesson.videoUrl.includes('youtu.be')) {
        const videoId = this.getYouTubeVideoId(this.lesson.videoUrl);
        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}`;
        }
      }
      
      // Handle Vimeo URLs
      if (this.lesson.videoUrl.includes('vimeo.com')) {
        const videoId = this.getVimeoVideoId(this.lesson.videoUrl);
        if (videoId) {
          return `https://player.vimeo.com/video/${videoId}`;
        }
      }
      
      return this.lesson.videoUrl;
    }
  },
  methods: {
    getYouTubeVideoId(url) {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);
      return (match && match[2].length === 11) ? match[2] : null;
    },
    getVimeoVideoId(url) {
      const regExp = /vimeo\.com\/(?:video\/)?([0-9]+)/;
      const match = url.match(regExp);
      return match ? match[1] : null;
    }
  }
};
</script>

<style scoped>
.aspect-w-16 {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 Aspect Ratio */
}

.aspect-w-16 > * {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>