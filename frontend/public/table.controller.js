(function(){
  angular.
    module('myApp').
     controller('tableController', tableController)
     tableController.$inject = ["$scope", "$log", "$http", "$timeout","$interval"]

function tableController($scope, $log, $http, $timeout, $interval){
      $scope.numFils = 8
      $scope.numCols = 8
      $scope.class=''
      $scope.existe = true;
      $scope.stoppedDrawPath;
      var stop;
      $scope.startDrawPath = function(){
        stop = $interval(function(){console.log('LO hace')},3000)
      }
      $scope.stopDrawPath = function(){
        $interval.cancel(stop)
      }
      $scope.loadTable = function(){

          $scope.celdas = new Array($scope.numFils) // Indica si el nodo esta cerrado o no
          for(let i = 0; i < $scope.numFils; i++){
                $scope.celdas[i] = new Array($scope.numCols)
          }

          for(let i = 0; i < $scope.numFils;i++)
              for(let j = 0; j < $scope.numCols;j++)
                $scope.celdas[i][j] = 0

          $scope.cellColors = new Array($scope.numFils) // Indica si el nodo esta cerrado o no
          for(let i = 0; i < $scope.numFils; i++){
                $scope.cellColors[i] = new Array($scope.numCols)
          }

          for(let i = 0; i < $scope.numFils;i++)
              for(let j = 0; j < $scope.numCols;j++)
                $scope.cellColors[i][j] = ''
      }

      $scope.changeClass = function(i,j){
          $scope.cellColors[i][j] = $scope.class
          if($scope.class == 'bg-danger')
            $scope.celdas[i][j] = 1
          else if($scope.class == 'bg-primary'){
            if($scope.nodoInicial)
              $scope.cellColors[$scope.nodoInicial.i][$scope.nodoInicial.j] = ''
            $scope.nodoInicial = {i:i, j:j}
          }
        else if($scope.class == 'bg-warning'){
          if($scope.nodoFinal)
            $scope.cellColors[$scope.nodoFinal.i][$scope.nodoFinal.j] = ''
          $scope.nodoFinal = {i:i, j:j}
        }
        else{
              $scope.celdas[i][j] = 0
        }
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

      $scope.drawPath = function(matrix){
          for(let i = 0; i < $scope.numFils;i++){
            for(let j = 0; j < $scope.numCols;j++){
              if(matrix[i][j] == -1)
                $scope.cellColors[i][j] = 'bg-success'
            }
          }

      }

      $scope.findPath = function () {
        console.log($scope.celdas)
        return $http.post('https://0eby8rs7ok.execute-api.eu-west-2.amazonaws.com/starAlgorithm/star-algorithm', {
          nodoInicial:$scope.nodoInicial,
          nodoFinal:$scope.nodoFinal,
          numFils:$scope.numFils,
          numCols:$scope.numCols,
          matMuros:$scope.celdas
        }).then(function(response) {
            console.log(response.data)
            $scope.drawPath(response.data)
        });
      };

    }
})()
