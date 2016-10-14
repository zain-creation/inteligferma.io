﻿(function () {
  'use strict';

  angular
    .module('activities.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('backoffice.admin.activities', {
        abstract: true,
        url: '/activities',
        template: '<ui-view/>'
      })
      .state('backoffice.admin.activities.list', {
        url: '',
        views:{
          "content@backoffice":{
            templateUrl: 'modules/activities/client/views/admin/list-activities.client.view.html',
            controller: 'ActivitiesListController',
            controllerAs: 'vm',
          },
          "sidebar@backoffice":{
            templateUrl: 'modules/core/client/views/sidebar_left.client.view.html',
            controller: 'SidebarController',
            controllerAs: 'vm',
          }
        },
        data: {
          roles: ['admin']
        }
      })
      .state('admin.activities.create', {
        url: '/create',
        templateUrl: 'modules/activities/client/views/admin/form-activity.client.view.html',
        controller: 'ActivitiesController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          activityResolve: newActivity
        }
      })
      .state('backoffice.admin.activities.edit', {
        url: '/:activityId/edit',
        views:{
          "content@backoffice":{
            templateUrl: 'modules/activities/client/views/admin/form-activity.client.view.html',
            controller: 'ActivitiesController',
            controllerAs: 'vm',
            resolve: {
              activityResolve: getActivity
            }
          },
          "sidebar@backoffice":{
            templateUrl: 'modules/core/client/views/sidebar_left.client.view.html',
            controller: 'SidebarController',
            controllerAs: 'vm',
          }
        },
        data: {
          roles: ['admin']
        },

      });
  }

  getActivity.$inject = ['$stateParams', 'ActivitiesService'];

  function getActivity($stateParams, ActivitiesService) {
    return ActivitiesService.get({
      activityId: $stateParams.activityId
    }).$promise;
  }

  newActivity.$inject = ['ActivitiesService'];

  function newActivity(ActivitiesService) {
    return new ActivitiesService();
  }
}());
