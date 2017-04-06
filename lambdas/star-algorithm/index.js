  var Nodo = require('./Nodo.js')

function esFactible(i, j, matriz, numFils, numCols){ // Devuelve true si el nodo no está en la lista de cerrados y se puede recorrer dicha casilla
  return !(i < 0 || i == numFils || j < 0 || j == numCols)
}

function getDistancia(iIni, jIni, iDestino, jDestino){
  return Math.sqrt(Math.pow((iDestino - iIni),2) + Math.pow((jDestino - jIni),2))
}
function cargaSucesores( nodo,matriz, numFils, numCols){
  var sucesores = []
  var i = nodo.i
  var j = nodo.j
 if(esFactible(i-1, j, matriz, numFils, numCols)) // Si este sucesor no esta en la lista cerrada
      sucesores.push(new Nodo(i-1,j,0,0,null))

  if(esFactible(i-1, j+1, matriz, numFils, numCols))
          sucesores.push(new Nodo(i-1,j+1,0,0,null))


  if(esFactible(i, j+1, matriz, numFils, numCols))
         sucesores.push(new Nodo(i,j+1,0,0,null))


  if(esFactible(i+1, j+1, matriz, numFils, numCols))
          sucesores.push(new Nodo(i+1,j+1,0,0,null))


  if(esFactible(i+1, j, matriz, numFils, numCols))
         sucesores.push(new Nodo(i+1,j,0,0,null))


  if(esFactible(i+1, j-1, matriz, numFils, numCols))
         sucesores.push(new Nodo(i+1,j-1,0,0,null))


  if(esFactible(i, j-1, matriz, numFils, numCols))
         sucesores.push(new Nodo(i,j-1,0,0,null))

  if(esFactible(i-1, j-1, matriz, numFils, numCols))
       sucesores.push(new Nodo(i-1,j-1,0,0,null))
   return sucesores
}


function procesaNodo(listaAbiertos, listaCerrados, nodoN, i, j, iFin, jFin, matPadres, matriz){
    var nodoViejoAbiertos = listaAbiertos.find(nodo => nodo.i === i && nodo.j === j)
    var nodoViejoCerrados = listaCerrados.find(nodo => nodo.i === i && nodo.j === j)

    var nuevaG = nodoN.G + getDistancia(nodoN.i, nodoN.j, i, j);//GSUCESOR
    var nuevoPadre = nodoN;
    var H = getDistancia(i,j,iFin,jFin)
      if((nodoViejoAbiertos && nuevaG >= nodoViejoAbiertos.G) || (nodoViejoCerrados && nuevaG >= nodoViejoCerrados.G))
          return;

      if(nodoViejoCerrados){
            if(nuevaG < nodoViejoCerrados.G){ // Comprobamos de que la nueva ruta no es superior a la ya existente
                 listaCerrados = listaCerrados.filter(item => item !== nodoViejoCerrado); //lo elimino de la lista
                 listaAbiertos.push(new Nodo(nodoViejoCerrado.i,nodoViejoCerrado.j ,0,0,null))
            }
        }

      else if(nodoViejoAbiertos){
          if(nuevaG < nodoViejoAbiertos.G){ // Comprobamos de que la nueva ruta no es superior a la ya existente
               nodoViejoAbiertos.G = nuevaG // se mantienen los nodos anteriores
               matPadres[nodoViejoAbiertos.i][nodoViejoAbiertos.j] = nodoN //Se mantiene el padre anterior
          }
        }
      else {
        listaAbiertos.push(new Nodo(i,j,nuevaG,H,nuevoPadre))
        matPadres[i][j] = nuevoPadre
      }
      /*listaAbiertos.push(new Nodo(i,j,nuevaG,H,nuevoPadre))
      matPadres[i][j] = nuevoPadre*/
  }

function procesa(NodoPadre, i, j, iFin, jFin, matriz,listaCerrados, listaAbiertos, numFils, numCols, matPadres, callback){
  while(listaAbiertos.length > 0){
   listaAbiertos.sort((nodo1,nodo2) => (nodo2.G + nodo2.H ) < (nodo1.G + nodo1.H))  // lo ordenamos decrecientemente
   //matriz[listaAbiertos[0].i][listaAbiertos[0].j] = -1 // Lo añadimos a lista de cerrados
   var nodoN = listaAbiertos.shift() // Lo eliminamos de la lista de abiertos
   listaCerrados.push(new Nodo(nodoN.i,nodoN.j,0,0,null))
  if(nodoN.i  == iFin && nodoN.j == jFin) // Si es el nodoFin
      return callback(null,matPadres)  // Se ha encontrado el camino
  var sucesores = cargaSucesores(nodoN,matriz, numFils, numCols)
  var sucesor
  for(var k = 0; k < sucesores.length; k++){
      sucesor = sucesores[k]
      procesaNodo(listaAbiertos, listaCerrados, nodoN, sucesores[k].i, sucesores[k].j, iFin,jFin, matPadres, matriz)
    }
  }
   return callback('No existe camino')
}



function getDistancia(iIni, jIni, iDestino, jDestino){
  return Math.sqrt(Math.pow((iDestino - iIni),2) + Math.pow((jDestino - jIni),2))
}
function dibujaCamino(nodoFin,matriz,matPadres, numFils, numCols, camino, callback){
  while(nodoFin != null){
    console.log(nodoFin.i  + " " + nodoFin.j)
    camino.push({i:nodoFin.i, j : nodoFin.j})
    nodoFin = matPadres[nodoFin.i][nodoFin.j]
  }
  camino = camino.reverse();
  return callback(null,camino)
}


exports.handler = function(event, context, result) {
  var numFils = event.numFils
  var numCols = event.numCols
  var nodoFin = new Nodo(event.nodoFinal.i, event.nodoFinal.j,0,0,null)
  var nodoInicial = new Nodo(event.nodoInicial.i, event.nodoInicial.j,0,null)
  var matriz = event.matMuros
  var listaCerrados = []
  for(var i = 0; i < numFils;i++)
      for(var j = 0; j < numCols;j++){
        if(matriz[i][j] == -1)
           listaCerrados.push(new Nodo(i,j,0,0,null))
      }

  var listaAbiertos = [nodoInicial]
  var linea = ''
  var matPadres = new Array(numFils) //  Hace referencia al padre del nodo
     for(var i = 0; i < numFils; i++)
         matPadres[i] = new Array(numCols)

 procesa(nodoInicial,nodoInicial.i, nodoInicial.j, nodoFin.i, nodoFin.j, matriz,listaCerrados, listaAbiertos, numFils , numCols, matPadres, function(err,response){
          var camino = []
          if(err){
          console.log(err)
          result(err)
          }
          else{
            dibujaCamino(nodoFin, matriz, response, numFils, numCols, camino, function(err,data){
                  result(null,camino)
              }

             )
           }
        })

     }
