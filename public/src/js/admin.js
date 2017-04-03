/**
 * public/src/js/index.js - sous-chef
 * 
 * Licensed under Apache-2.0.
 */

import OrdersCtl  from './controllers/admin/orders'

const app = angular.module('SousChef', [ 'ngRoute', 'ngAnimate' ])

app.controller('OrdersCtl', OrdersCtl)

angular.element(() => angular.bootstrap(document, ['SousChef']))