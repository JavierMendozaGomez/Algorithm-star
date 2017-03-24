var Nodo = require('./Nodo.js')

function esFactible(i, j, matCerrados, numFils, numCols){ // Devuelve true si el nodo no está en la lista de cerrados y se puede recorrer dicha casilla
  return !(i < 0 || i == numFils || j < 0 || j == numCols || matCerrados[i][j] == -1)
}

function getDistancia(iIni, jIni, iDestino, jDestino){
  return Math.sqrt(Math.pow((iDestino - iIni),2) + Math.pow((jDestino - jIni),2))
}

function procesaNodo(listaAbiertos, nodoPadre, i, j, iFin, jFin, matPadres, matCerrados){
    var nodoEncontrado = listaAbiertos.find(nodo => nodo.i === i && nodo.j === j)
    var nuevaG = getDistancia(nodoPadre.i, nodoPadre.j, i, j) + matCerrados[i][j];
    var nuevoPadre = nodoPadre;
    var H = getDistancia(i,j,iFin,jFin)

    if(nodoEncontrado){//Si el nodo ya existia en la lista de abiertos
      if(nuevaG > nodoEncontrado.G){ // Comprobamos de que la nueva ruta no es superior a la ya existente
          nuevaG = nodoEncontrado.G  // se mantienen los nodos anteriores
          nuevoPadre = nodoEncontrado
       }
      listaAbiertos = listaAbiertos.filter(item => item !== nodoEncontrado); //lo elimino de la lista
    }
      listaAbiertos.push(new Nodo(i,j,nuevaG,H,nuevoPadre))
      matPadres[i][j] = nuevoPadre
  }

function procesa(NodoPadre, i, j, iFin, jFin, matCerrados, listaAbiertos, numFils, numCols, matPadres, callback){
  try{
  if(esFactible(i-1, j, matCerrados, numFils, numCols))
      procesaNodo(listaAbiertos, NodoPadre, i-1, j, iFin,jFin, matPadres, matCerrados)

  if(esFactible(i-1, j+1, matCerrados, numFils, numCols))
    procesaNodo(listaAbiertos, NodoPadre, i-1, j+1, iFin,jFin, matPadres, matCerrados)

  if(esFactible(i, j+1, matCerrados, numFils, numCols))
    procesaNodo(listaAbiertos, NodoPadre, i, j+1, iFin,jFin, matPadres, matCerrados)

  if(esFactible(i+1, j+1, matCerrados, numFils, numCols))
    procesaNodo(listaAbiertos, NodoPadre, i+1, j+1, iFin,jFin, matPadres, matCerrados)

  if(esFactible(i+1, j, matCerrados, numFils, numCols))
    procesaNodo(listaAbiertos, NodoPadre, i+1, j, iFin,jFin, matPadres, matCerrados)

  if(esFactible(i+1, j-1, matCerrados, numFils, numCols))
    procesaNodo(listaAbiertos, NodoPadre, i+1, j-1, iFin,jFin, matPadres, matCerrados)

  if(esFactible(i, j-1, matCerrados, numFils, numCols))
    procesaNodo(listaAbiertos, NodoPadre, i, j-1, iFin,jFin, matPadres, matCerrados)

  if(esFactible(i-1, j-1, matCerrados, numFils, numCols))
    procesaNodo(listaAbiertos, NodoPadre, i-1, j-1, iFin,jFin, matPadres, matCerrados)

  if(i+1 == iFin && j == jFin ||
    i+1 == iFin && j+1 == jFin ||
    i == iFin && j+1 == jFin ||
    i-1 == iFin && j+1 == jFin ||
    i-1 == iFin && j == jFin ||
    i-1 == iFin && j-1 == jFin ||
    i+1 == iFin && j-1 == jFin ||
    i+1 == iFin && j-1 == jFin){
      matCerrados[iFin][jFin] = -1
     return callback(null,matPadres)
    }
    listaAbiertos.sort((nodo1,nodo2) => (nodo2.G + nodo2.H ) < (nodo1.G + nodo1.H))  // lo ordenamos decrecientemente
    matCerrados[listaAbiertos[0].i][listaAbiertos[0].j] = -1 // Lo añadimos a lista de cerrados
    NodoPadre = listaAbiertos.shift()
    procesa(NodoPadre, NodoPadre.i, NodoPadre.j , iFin,jFin,matCerrados, listaAbiertos, numFils, numCols, matPadres, callback)
  }
  catch(e){
   return callback('No existe ningun camino posible')
  }
}


function getDistancia(iIni, jIni, iDestino, jDestino){
  return Math.sqrt(Math.pow((iDestino - iIni),2) + Math.pow((jDestino - jIni),2))
}
function dibujaCamino(nodoFin,matCerrados,matPadres, numFils, numCols, camino, callback){
  matCerrados = new Array(numFils) // Indica si el nodo esta cerrado o no
  for(var i = 0; i < numFils; i++){
        matCerrados[i] = new Array(numCols)
  }
  while(nodoFin != null){
    matCerrados[nodoFin.i][nodoFin.j] = -1
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
  var nodoInicial = new Nodo(event.nodoInicial.i, event.nodoInicial.j, getDistancia(event.nodoInicial.i,event.nodoInicial.j, event.nodoFinal.i, event.nodoFinal.j),null)
  var matCerrados = event.matMuros
  matCerrados[nodoInicial.i][nodoInicial.j] = -1
  var listaAbiertos = []
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
