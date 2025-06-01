import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Dashboard from '../views/Dashboard.vue';
import CoursesList from '../views/courses/CoursesList.vue';
import CourseDetails from '../views/courses/CourseDetails.vue';
import CourseCreate from '../views/courses/CourseCreate.vue';
import CourseEdit from '../views/courses/CourseEdit.vue';
import AssignmentsList from '../views/assignments/AssignmentsList.vue';
import AssignmentDetails from '../views/assignments/AssignmentDetails.vue';
import AssignmentCreate from '../views/assignments/AssignmentCreate.vue';
import AssignmentSubmissions from '../views/assignments/AssignmentSubmissions.vue';
import QuizzesList from '../views/quizzes/QuizzesList.vue';
import QuizDetails from '../views/quizzes/QuizDetails.vue';
import QuizCreate from '../views/quizzes/QuizCreate.vue';
import QuizAttempt from '../views/quizzes/QuizAttempt.vue';
import Profile from '../views/Profile.vue';
import NotFound from '../views/NotFound.vue';

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresAuth: false }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { requiresAuth: false }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/courses',
    name: 'CoursesList',
    component: CoursesList,
    meta: { requiresAuth: true }
  },
  {
    path: '/courses/create',
    name: 'CourseCreate',
    component: CourseCreate,
    meta: { requiresAuth: true, requiresInstructor: true }
  },
  {
    path: '/courses/:id',
    name: 'CourseDetails',
    component: CourseDetails,
    meta: { requiresAuth: true }
  },
  {
    path: '/courses/:id/edit',
    name: 'CourseEdit',
    component: CourseEdit,
    meta: { requiresAuth: true, requiresInstructor: true }
  },
  {
    path: '/assignments',
    name: 'AssignmentsList',
    component: AssignmentsList,
    meta: { requiresAuth: true }
  },
  {
    path: '/assignments/create',
    name: 'AssignmentCreate',
    component: AssignmentCreate,
    meta: { requiresAuth: true, requiresInstructor: true }
  },
  {
    path: '/assignments/:id',
    name: 'AssignmentDetails',
    component: AssignmentDetails,
    meta: { requiresAuth: true }
  },
  {
    path: '/assignments/:id/submissions',
    name: 'AssignmentSubmissions',
    component: AssignmentSubmissions,
    meta: { requiresAuth: true, requiresInstructor: true }
  },
  {
    path: '/quizzes',
    name: 'QuizzesList',
    component: QuizzesList,
    meta: { requiresAuth: true }
  },
  {
    path: '/quizzes/create',
    name: 'QuizCreate',
    component: QuizCreate,
    meta: { requiresAuth: true, requiresInstructor: true }
  },
  {
    path: '/quizzes/:id',
    name: 'QuizDetails',
    component: QuizDetails,
    meta: { requiresAuth: true }
  },
  {
    path: '/quizzes/:id/attempt',
    name: 'QuizAttempt',
    component: QuizAttempt,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem('user') !== null;
  const userData = isLoggedIn ? JSON.parse(localStorage.getItem('user')) : null;
  const isInstructor = userData ? userData.role === 'instructor' : false;

  if (to.meta.requiresAuth && !isLoggedIn) {
    next({ name: 'Login' });
  } else if (to.meta.requiresInstructor && !isInstructor) {
    next({ name: 'Dashboard' });
  } else {
    next();
  }
});

export default router;