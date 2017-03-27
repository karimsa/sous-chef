/**
 * public/src/js/controllers/nav.js - sous-chef
 * 
 * Licensed under Apache 2.0.
 */

export default ['$NavFactory', '$scope', ($NavFactory, $scope) => {
  $scope.nav = $NavFactory.nav
  $scope.current = route => location.pathname === route
}]