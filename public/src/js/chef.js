/**
 * public/src/js/index.js - sous-chef
 * 
 * Licensed under Apache-2.0.
 */

import OrdersCtl  from './controllers/chef/orders'
import CreateMealCtl  from './controllers/chef/create'

const app = angular.module('SousChef', [ 'ngRoute', 'ngAnimate' ])

app.controller('OrdersCtl', OrdersCtl)
app.controller('CreateMeal', CreateMealCtl)

angular.element(() => angular.bootstrap(document, ['SousChef']))