/**
 * public/src/js/meals.js - sous-chef
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

  $http.get('/meal/pages.json')
    .then(res => {
      $scope.pages = [... new Array(res.data.pages).keys()]
    })
    .catch(err => console.error(err))

  $scope.activeMeal = null
  $scope.mealPages = []

  $scope.setActive = meal => {
    $scope.activeMeal = meal
  }

  const fileUpload = $('<input type="file" style="display:none;" multiple="false" accept="image/*" />')
    .appendTo(document.body)
    .on('change', () => {
      const meal = $scope.activeMeal
      const data = new FormData()
      data.append('photo', fileUpload.get(0).files[0])

      $.ajax({
        type: 'POST',
        url: `/meal/edit/${ meal.name }/photo`,
        data,
        dataType: 'json',
        processData: false,
        contentType: false,
        success: () => {
          meal.lastRefresh = Date.now()
          $scope.$apply()
        },
        error: err => console.error(err)
      })
    })

  $scope.editImage = () => fileUpload.click()

  let activeMealBkp

  $('#editMeal').on('show.bs.modal', () => {
    activeMealBkp = JSON.parse(JSON.stringify($scope.activeMeal))
  }).on('hide.bs.modal', () => {
    Object.assign($scope.activeMeal, activeMealBkp)
    $scope.$apply()
  })

  //$scope.newMeal = () => {
  //  $scope.activeMeal = {}
  //  $('#editMeal').modal('show')
  //}

  $scope.saveMeal = () => {
    let meal = $scope.activeMeal

    $.ajax({
      type: 'POST',
      url: `/meal/edit/${ activeMealBkp.name }`,
      data: meal,
      success: () => $('#editMeal').modal('hide'),
      error: err => {
        $scope.editError = err.responseText
        $scope.$apply()
      }
    })
  }

  $scope.$watch('page', page => {
    if (($scope.mealPages.length - 1) < page) {
      $http.get('/meal/all.json?page=' + page)
        .then(res => $scope.mealPages.push(res.data.results.map(i => {
          i.threshold = parseFloat(i.threshold)
          i.amountnew = parseFloat(i.amountnew)

          return i
        })))
        .catch(err => console.error(err))
    }
  })
}]