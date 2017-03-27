/**
 * public/src/js/index.js - sous-chef
 * 
 * Licensed under Apache-2.0.
 */

import NavFactory from './factories/nav'

import NavCtl from './controllers/nav'
import DashCtl from './controllers/dash'

const app = angular.module('SousChef', [ 'ngRoute', 'ngAnimate' ])

app.factory('$NavFactory', NavFactory)

app.config(['$routeProvider', '$locationProvider', ($router, $location) => {
  $router
    .when('/', {
      templateUrl: '/views/udashboard.html',
      controller: 'DashCtl'
    })
    .when('/browse', {
      templateUrl: '/views/browse.html'
    })
    .when('/meals', {
      templateUrl: '/views/meals.html'
    })
    .otherwise('/')

  $location.html5Mode(true)
}])

app.controller('NavCtl', NavCtl)
app.controller('DashCtl', DashCtl)

angular.element(() => angular.bootstrap(document, ['SousChef']))