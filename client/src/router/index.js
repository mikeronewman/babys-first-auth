import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import Signup from '../views/Signup.vue';
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';

Vue.use(VueRouter);

const loggedInRedirectDashboard = (to, from, next) => {
  if (localStorage.token) {
    next('/dashboard');
  } else {
    next();
  }
};

const isLoggedIn = (to, from, next) => {
  if (localStorage.token) {
    next();
  } else {
    next('/login');
  }
};

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup,
    beforeEnter: loggedInRedirectDashboard,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    beforeEnter: loggedInRedirectDashboard,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    beforeEnter: isLoggedIn,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
