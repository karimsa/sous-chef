/**
 * public/src/js/orders.js - sous-chef
 * 
 * Licensed under Apache 2.0.
 */

const PILL_COLORS = [
  'primary',
  'success',
  'info',
  'warning',
  'danger'
]

export default ['$scope', '$http', ($scope, $http) => {
  $scope.steps = []
  $scope.ingredients = []
  $scope.newStep = { duration: 1 }
  $scope.newIngredient = { quantity: 1 }
  $scope.error = ''

  $scope.addStep = () => {
    if ($scope.newStep.step) {
      $scope.steps.push($scope.newStep)
      $scope.newStep = { duration: 1 }
    }
  }

  $scope.addIngredient = () => {
    if ($scope.newIngredient.text) {
      $scope.ingredients.push($scope.newIngredient)
      $scope.newIngredient = { quantity: 1 }
    }
  }

  $scope.editStep = step => {
    $scope.newStep = step
    $scope.steps = $scope.steps.filter(s => s !== step)
  }

  $scope.save = () => {
    $.ajax({
      type: 'POST',
      url: '/meal/create',
      data: {
        name: $scope.name,
        description: $scope.description,
        category: $scope.category,
        ingredients: $scope.ingredients,
        steps: $scope.steps
      },
      success: () => $('#createMeal').modal('hide'),
      error: err => {
        $scope.error = String(err.responseText)
        $scope.$apply()
      }
    })
  }

  $.getJSON('/item/all-ever', items => {
    $scope.items = items
    $scope.$apply()
  })
}]