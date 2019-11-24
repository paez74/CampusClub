import Vue from 'vue';
import Router from 'vue-router';
import login from '@/components/login';
import forgotPassword from '@/components/forgotPassword';
import core from '@/components/core';
import changepassword from '@/components/changepassword';
import home from '@/components/home';

import facultylist from '@/components/facultylist';
import facultyform from '@/components/facultyform';
import studentlist from '@/components/studentlist';
import studentform from '@/components/studentform';
import personlist from '@/components/personlist';
import personform from '@/components/personform';
import rolelist from '@/components/rolelist';
import roleform from '@/components/roleform';
import userlist from '@/components/userlist';
import userform from '@/components/userform';
import campusClublist from '@/components/campusClublist';
import campusClubform from '@/components/campusClubform';
import departmentlist from '@/components/departmentlist';
import departmentform from '@/components/departmentform';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      component: core,
      children: [
        {
          path: '/',
          component: home,
          meta: {
            requiresAuth: false
          }
        },
        {
          path: '/changepassword/',
          name: 'changepassword',
          component: changepassword,
          meta: {
            requiresAuth: false
          }
        },
        {
          path: '/facultylist/:from_catalog?',
          name: 'facultylist',
          component: facultylist,
          meta: {
            requiresAuth: true,
            credentials: [
              'facultyRead',
              'facultyUpdate',
              'facultyCreate',
              'facultyDelete'
            ]
          }
        },
        {
          path: '/facultyform',
          name: 'facultyform',
          component: facultyform,
          meta: {
            requiresAuth: true,
            credentials: ['facultyCreate']
          }
        },
        {
          path: '/facultyform/:id',
          name: 'facultyformedit',
          component: facultyform,
          meta: {
            requiresAuth: true,
            credentials: ['facultyUpdate']
          }
        },
        {
          path: '/facultydetail/:id',
          name: 'facultydetail',
          component: facultyform
        },
        {
          path: '/studentlist/:from_catalog?',
          name: 'studentlist',
          component: studentlist,
          meta: {
            requiresAuth: true,
            credentials: [
              'studentRead',
              'studentUpdate',
              'studentCreate',
              'studentDelete'
            ]
          }
        },
        {
          path: '/studentform',
          name: 'studentform',
          component: studentform,
          meta: {
            requiresAuth: true,
            credentials: ['studentCreate']
          }
        },
        {
          path: '/studentform/:id',
          name: 'studentformedit',
          component: studentform,
          meta: {
            requiresAuth: true,
            credentials: ['studentUpdate']
          }
        },
        {
          path: '/studentdetail/:id',
          name: 'studentdetail',
          component: studentform
        },
        {
          path: '/personlist/:from_catalog?',
          name: 'personlist',
          component: personlist,
          meta: {
            requiresAuth: true,
            credentials: [
              'personRead',
              'personUpdate',
              'personCreate',
              'personDelete'
            ]
          }
        },
        {
          path: '/personform',
          name: 'personform',
          component: personform,
          meta: {
            requiresAuth: true,
            credentials: ['personCreate']
          }
        },
        {
          path: '/personform/:id',
          name: 'personformedit',
          component: personform,
          meta: {
            requiresAuth: true,
            credentials: ['personUpdate']
          }
        },
        {
          path: '/persondetail/:id',
          name: 'persondetail',
          component: personform
        },
        {
          path: '/rolelist/:from_catalog?',
          name: 'rolelist',
          component: rolelist,
          meta: {
            requiresAuth: true,
            credentials: ['roleRead', 'roleUpdate', 'roleCreate', 'roleDelete']
          }
        },
        {
          path: '/roleform',
          name: 'roleform',
          component: roleform,
          meta: {
            requiresAuth: true,
            credentials: ['roleCreate']
          }
        },
        {
          path: '/roleform/:id',
          name: 'roleformedit',
          component: roleform,
          meta: {
            requiresAuth: true,
            credentials: ['roleUpdate']
          }
        },
        {
          path: '/roledetail/:id',
          name: 'roledetail',
          component: roleform
        },
        {
          path: '/userlist/:from_catalog?',
          name: 'userlist',
          component: userlist,
          meta: {
            requiresAuth: true,
            credentials: ['userRead', 'userUpdate', 'userCreate', 'userDelete']
          }
        },
        {
          path: '/userform',
          name: 'userform',
          component: userform,
          meta: {
            requiresAuth: true,
            credentials: ['userCreate']
          }
        },
        {
          path: '/userform/:id',
          name: 'userformedit',
          component: userform,
          meta: {
            requiresAuth: true,
            credentials: ['userUpdate']
          }
        },
        {
          path: '/userdetail/:id',
          name: 'userdetail',
          component: userform
        },
        {
          path: '/campusClublist/:from_catalog?',
          name: 'campusClublist',
          component: campusClublist,
          meta: {
            requiresAuth: true,
            credentials: [
              'campusClubRead',
              'campusClubUpdate',
              'campusClubCreate',
              'campusClubDelete'
            ]
          }
        },
        {
          path: '/campusClubform',
          name: 'campusClubform',
          component: campusClubform,
          meta: {
            requiresAuth: true,
            credentials: ['campusClubCreate']
          }
        },
        {
          path: '/campusClubform/:id',
          name: 'campusClubformedit',
          component: campusClubform,
          meta: {
            requiresAuth: true,
            credentials: ['campusClubUpdate']
          }
        },
        {
          path: '/campusClubdetail/:id',
          name: 'campusClubdetail',
          component: campusClubform
        },
        {
          path: '/departmentlist/:from_catalog?',
          name: 'departmentlist',
          component: departmentlist,
          meta: {
            requiresAuth: true,
            credentials: [
              'departmentRead',
              'departmentUpdate',
              'departmentCreate',
              'departmentDelete'
            ]
          }
        },
        {
          path: '/departmentform',
          name: 'departmentform',
          component: departmentform,
          meta: {
            requiresAuth: true,
            credentials: ['departmentCreate']
          }
        },
        {
          path: '/departmentform/:id',
          name: 'departmentformedit',
          component: departmentform,
          meta: {
            requiresAuth: true,
            credentials: ['departmentUpdate']
          }
        },
        {
          path: '/departmentdetail/:id',
          name: 'departmentdetail',
          component: departmentform
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/forgotPassword',
      name: 'forgotPassword',
      component: forgotPassword
    }
  ]
});
