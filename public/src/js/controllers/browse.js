/**
 * public/src/js/browse.js - sous-chef
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

    $scope.itemPages
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

  $http.get('/pages.json')
    .then(res => {
      $scope.pages = [... new Array(res.data.pages).keys()]
    })
    .catch(err => console.error(err))

  $scope.activeItem = null
  $scope.itemPages = []

  $scope.setActive = item => {
    $scope.activeItem = item
  }

  const fileUpload = $('<input type="file" style="display:none;" multiple="false" accept="image/*" />')
    .appendTo(document.body)
    .on('change', () => {
      const item = $scope.activeItem
      const data = new FormData()
      data.append('photo', fileUpload.get(0).files[0])

      $.ajax({
        type: 'POST',
        url: `/edit/${ item.name }/photo`,
        data,
        dataType: 'json',
        processData: false,
        contentType: false,
        success: () => {
          item.lastRefresh = Date.now()
          $scope.$apply()
        },
        error: err => console.error(err)
      })
    })

  $scope.editImage = () => fileUpload.click()

  let activeItemBkp

  $('#editItem').on('show.bs.modal', () => {
    activeItemBkp = JSON.parse(JSON.stringify($scope.activeItem))
  }).on('hide.bs.modal', () => {
    Object.assign($scope.activeItem, activeItemBkp)
    $scope.$apply()
  })

  //$scope.newItem = () => {
  //  $scope.activeItem = {}
  //  $('#editItem').modal('show')
  //}

  $scope.saveItem = () => {
    let item = $scope.activeItem

    $.ajax({
      type: 'POST',
      url: `/edit/${ activeItemBkp.name }`,
      data: item,
      success: () => $('#editItem').modal('hide'),
      error: err => {
        $scope.editError = err.responseText
        $scope.$apply()
      }
    })
  }

  $scope.$watch('page', page => {
    if (($scope.itemPages.length - 1) < page) {
      $http.get('/items.json?page=' + page)
        .then(res => $scope.itemPages.push(res.data.results.map(i => {
          i.threshold = parseFloat(i.threshold)
          i.amountnew = parseFloat(i.amountnew)

          return i
        })))
        .catch(err => console.error(err))
    }
  })
}]