/**
 * public/src/js/index.js - sous-chef
 * 
 * Licensed under Apache-2.0.
 */

import NavFactory from './factories/nav'

import NavCtl    from './controllers/nav'
import BrowseCtl from './controllers/browse'
import MealsCtl  from './controllers/meals'

const app = angular.module('SousChef', [ 'ngRoute', 'ngAnimate' ])

app.factory('$NavFactory', NavFactory)

app.config(['$routeProvider', '$locationProvider', ($router, $location) => {
  $router
    .when('/', {
      templateUrl: '/views/browse.html',
      controller: 'BrowseCtl'
    })
    .when('/meals', {
      templateUrl: '/views/meals.html',
      controller: 'MealsCtl'
    })
    .otherwise('/')

  $location.html5Mode(true)
}])

app.filter('mass', ['numberFilter', num => {
  return str => (num(str, 2) + ' kg')
}])

app.controller('NavCtl', NavCtl)
app.controller('BrowseCtl', BrowseCtl)
app.controller('MealsCtl', MealsCtl)

angular.element(() => angular.bootstrap(document, ['SousChef']))