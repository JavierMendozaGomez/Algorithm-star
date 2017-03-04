(function(){
  angular.
    module('myApp').
     controller('tableController', tableController)
     tableController.$inject = ["$scope", "$log", "$http"]

function tableController($scope, $log, $http){
      $scope.numFils = 10
      $scope.numCols = 10
      $scope.class=''

      $scope.loadTable = function(){
          $scope.celdas = new Array($scope.numFils) // Indica si el nodo esta cerrado o no
          for(let i = 0; i < $scope.numFils; i++){
                $scope.celdas[i] = new Array($scope.numCols)
          }
      }

      $scope.changeClass = function(i,j){
          $scope.celdas[i][j] = { class : $scope.class}
      }

      $scope.getFils = function(){
        let list = []
        for(let i = 0; i < $scope.numFils;i++)
            list.push(i)
        return list;
      }

      $scope.getCols = function(){
        let list = []
        for(let i = 0; i < $scope.numCols;i++)
            list.push(i)
        return list;
      }
      
    }
})()
