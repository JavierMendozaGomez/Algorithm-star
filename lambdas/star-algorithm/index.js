  var Nodo = require('./Nodo.js')

function esFactible(i, j, matCerrados, numFils, numCols){ // Devuelve true si el nodo no está en la lista de cerrados y se puede recorrer dicha casilla
  return !(i < 0 || i == numFils || j < 0 || j == numCols || matCerrados[i][j] == -1)
}

function getDistancia(iIni, jIni, iDestino, jDestino){
  return Math.sqrt(Math.pow((iDestino - iIni),2) + Math.pow((jDestino - jIni),2))
}

function procesaNodo(listaAbiertos, nodoN, i, j, iFin, jFin, matPadres, matCerrados){
    var nodoEncontrado = listaAbiertos.find(nodo => nodo.i === i && nodo.j === j)
    var nuevaG = nodoN.G + getDistancia(nodoN.i, nodoN.j, i, j) + matCerrados[i][j];
    var nuevoPadre = nodoN;
    var H = getDistancia(i,j,iFin,jFin)

    if(nodoEncontrado){//Si el nodo ya existia en la lista de abiertos
      if(nuevaG > nodoEncontrado.G){ // Comprobamos de que la nueva ruta no es superior a la ya existente
          nuevaG = nodoEncontrado.G  // se mantienen los nodos anteriores
          nuevoPadre = matPadres[i][j] //Se mantiene el padre anterior
       }
      listaAbiertos = listaAbiertos.filter(item => item !== nodoEncontrado); //lo elimino de la lista
    }
      listaAbiertos.push(new Nodo(i,j,nuevaG,H,nuevoPadre))
      matPadres[i][j] = nuevoPadre
  }

function procesa(NodoPadre, i, j, iFin, jFin, matCerrados, listaAbiertos, numFils, numCols, matPadres, callback){
  while(listaAbiertos.length > 0){
   listaAbiertos.sort((nodo1,nodo2) => (nodo2.G + nodo2.H ) < (nodo1.G + nodo1.H))  // lo ordenamos decrecientemente
   matCerrados[listaAbiertos[0].i][listaAbiertos[0].j] = -1 // Lo añadimos a lista de cerrados
   var nodoN = listaAbiertos.shift() // Lo eliminamos de la lista de abiertos
  if(nodoN.i  == iFin && nodoN.j == jFin) // Si es el nodoFin
      return callback(null,matPadres)  // Se ha encontrado el camino
  i = nodoN.i
  j = nodoN.j
  if(esFactible(i-1, j, matCerrados, numFils, numCols)) // Si este sucesor no esta en la lista cerrada
      procesaNodo(listaAbiertos, nodoN, i-1, j, iFin,jFin, matPadres, matCerrados)

  if(esFactible(i-1, j+1, matCerrados, numFils, numCols))
    procesaNodo(listaAbiertos, nodoN, i-1, j+1, iFin,jFin, matPadres, matCerrados)

  if(esFactible(i, j+1, matCerrados, numFils, numCols))
    procesaNodo(listaAbiertos, nodoN, i, j+1, iFin,jFin, matPadres, matCerrados)

  if(esFactible(i+1, j+1, matCerrados, numFils, numCols))
    procesaNodo(listaAbiertos, nodoN, i+1, j+1, iFin,jFin, matPadres, matCerrados)

  if(esFactible(i+1, j, matCerrados, numFils, numCols))
    procesaNodo(listaAbiertos, nodoN, i+1, j, iFin,jFin, matPadres, matCerrados)

  if(esFactible(i+1, j-1, matCerrados, numFils, numCols))
    procesaNodo(listaAbiertos, nodoN, i+1, j-1, iFin,jFin, matPadres, matCerrados)

  if(esFactible(i, j-1, matCerrados, numFils, numCols))
    procesaNodo(listaAbiertos, nodoN, i, j-1, iFin,jFin, matPadres, matCerrados)

  if(esFactible(i-1, j-1, matCerrados, numFils, numCols))
    procesaNodo(listaAbiertos, nodoN, i-1, j-1, iFin,jFin, matPadres, matCerrados)

  }
   return callback('No existe camino')
}



function getDistancia(iIni, jIni, iDestino, jDestino){
  return Math.sqrt(Math.pow((iDestino - iIni),2) + Math.pow((jDestino - jIni),2))
}
function dibujaCamino(nodoFin,matCerrados,matPadres, numFils, numCols, camino, callback){
  while(nodoFin != null){
    console.log(nodoFin.i  + " " + nodoFin.j)
    camino.push({i:nodoFin.i, j : nodoFin.j})
    nodoFin = matPadres[nodoFin.i][nodoFin.j]
  }
  camino = camino.reverse();
  return callback(null,matCerrados)
}


exports.handler = function(event, context, result) {
  var numFils = event.numFils
  var numCols = event.numCols
  var nodoFin = new Nodo(event.nodoFinal.i, event.nodoFinal.j,0,0,null)
  var nodoInicial = new Nodo(event.nodoInicial.i, event.nodoInicial.j,0,null)
  var matCerrados = event.matMuros

  var listaAbiertos = [nodoInicial]
  var linea = ''
  var matPadres = new Array(numFils) //  Hace referencia al padre del nodo
     for(var i = 0; i < numFils; i++)
         matPadres[i] = new Array(numCols)

 procesa(nodoInicial,nodoInicial.i, nodoInicial.j, nodoFin.i, nodoFin.j, matCerrados, listaAbiertos, numFils , numCols, matPadres, function(err,response){
          var camino = []
          if(err){
          console.log(err)
          result(err)
          }
          else{
            dibujaCamino(nodoFin, matCerrados, response, numFils, numCols, camino, function(err,data){
              if(data){
                  for(var i = 0; i < numFils; i++){   //Imprimimos la matriz
                    for(var j = 0; j < numCols;j++){
                      if(!data[i][j])
                        data[i][j] = 0
                      linea+='  '+ data[i][j] + ' '
                    }
                    console.log(linea)
                    linea = ''
                  }
                  result(null,camino)
              }

             })
           }
        })

     }
