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
  $scope.page = 0
  $scope.pages = []
  $scope.sortBy = 'name'
  $scope.editError = ''

  $scope.color = category => {
    const colorMap = {}

    $scope.mealPages
      .reduce((a, b) => a.concat(b), [])
      .map(a => a.category)
      .filter((e, i, s) => s.indexOf(e) === i)
      .forEach((a, i) => colorMap[a] = PILL_COLORS[i % PILL_COLORS.length])
    
    return colorMap[category]
  }

  $scope.prevPage = () => {
    if ($scope.page > 0) $scope.page -= 1
  }

  $scope.gotoPage = page => {
    $scope.page = page
  }

  $scope.nextPage = () => {
    if ($scope.page < $scope.pages.length) $scope.page += 1
  }

  $http.get('/order/pages.json')
    .then(res => {
      $scope.pages = [... new Array(res.data.pages).keys()]
    })
    .catch(err => console.error(err))

  $scope.activeMeal = null
  $scope.mealPages = []

  $scope.setActive = meal => {
    $scope.activeMeal = meal
  }

  $scope.$watch('page', page => {
    if (($scope.mealPages.length - 1) < page) {
      $http.get('/order/all.json?page=' + page)
        .then(res => $scope.mealPages.push(res.data.results))
        .catch(err => console.error(err))
    }
  })

  $scope.rejectMeal = (owner, name) => {
    if (confirm('Are you sure you wish to reject the meal? This action is irreversible.')) {
      $.getJSON('/order/reject/' + name + '/by/' + owner, () => {
        location.reload()
      }).fail(err => {
        $scope.editError = err.responseText
        $scope.$apply()
      })
    }
  }

  $scope.approveMeal = (owner, name) => {
    if (confirm('Are you certain you wish to approve the meal? This action is irreversible.')) {
      $.getJSON('/order/approve/' + name + '/by/' + owner, () => {
        location.reload()
      }).fail(err => {
        $scope.editError = err.responseText
        $scope.$apply()
      })
    }
  }
}]