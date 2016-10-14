(function () {
  'use strict';

  angular
    .module('activities.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('backoffice.activities', {
        abstract: true,
        url: '/activities',
        templateUrl: 'layout-backend.client.view.html'
      })
      .state('backoffice.activities.list', {
        url: '',
        templateUrl: 'modules/activities/client/views/list-activities.client.view.html',
        controller: 'ActivitiesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Activities List'
        }
      })
      .state('backoffice.activities.view', {
        url: '/:activityId',
        templateUrl: 'modules/activities/client/views/view-activity.client.view.html',
        controller: 'ActivitiesController',
        controllerAs: 'vm',
        resolve: {
          activityResolve: getActivity
        },
        data: {
          pageTitle: 'Activity {{ activityResolve.name }}'
        }
      });
  }

  getActivity.$inject = ['$stateParams', 'ActivitiesService'];

  function getActivity($stateParams, ActivitiesService) {
    return ActivitiesService.get({
      activityId: $stateParams.activityId
    }).$promise;
  }
}());
