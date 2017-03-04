var Nodo = require('./Nodo.js')

function esFactible(i, j,matCerrados,numFils,numCols){ // Devuelve true si el nodo no está en la lista de cerrados y se puede recorrer dicha casilla
  return !(i < 0 || i == numFils || j < 0 || j == numCols || matCerrados[i][j] == 1)
}

function getDistancia(iIni, jIni, iDestino, jDestino){
  return Math.sqrt(Math.pow((iDestino - iIni),2) + Math.pow((jDestino - jIni),2))
}

function procesaNodo(listaAbiertos, nodoPadre, i , j, iFin,jFin){
    var nodoEncontrado = listaAbiertos.find(nodo => nodo.i === i && nodo.j === j)
    var nuevaG = getDistancia(nodoPadre.i, nodoPadre.j, i, j);
    var nuevoPadre = nodoPadre;
    var H = getDistancia(i,j,iFin,jFin)

    if(nodoEncontrado){//Si el nodo ya existia en la lista de abiertos
      if(nuevaG > nodoEncontrado.G){ // Comprobamos de que la nueva ruta no es superior a la ya existente
          nuevaG = nodoEncontrado.G
          nuevoPadre = nodoEncontrado
       }
      listaAbiertos = listaAbiertos.filter(item => item !== nodoEncontrado); //lo elimino de la lista
    }
      listaAbiertos.push(new Nodo(i,j,nuevaG,H,nuevoPadre))
  }

function procesa(NodoPadre, i, j, iFin, jFin, matCerrados, listaAbiertos, numFils, numCols){
  if(esFactible(i-1, j, matCerrados, numFils, numCols))
      procesaNodo(listaAbiertos, NodoPadre, i-1, j, iFin,jFin)

  if(esFactible(i-1, j+1, matCerrados, numFils, numCols))
    procesaNodo(listaAbiertos, NodoPadre, i-1, j+1, iFin,jFin)

  if(esFactible(i, j+1, matCerrados, numFils, numCols))
    procesaNodo(listaAbiertos, NodoPadre, i, j+1, iFin,jFin)

  if(esFactible(i+1, j+1, matCerrados, numFils, numCols))
    procesaNodo(listaAbiertos, NodoPadre, i+1, j+1, iFin,jFin)

  if(esFactible(i+1, j, matCerrados, numFils, numCols))
    procesaNodo(listaAbiertos, NodoPadre, i+1, j, iFin,jFin)

  if(esFactible(i+1, j-1, matCerrados, numFils, numCols))
    procesaNodo(listaAbiertos, NodoPadre, i+1, j-1, iFin,jFin)

  if(esFactible(i, j-1, matCerrados, numFils, numCols))
    procesaNodo(listaAbiertos, NodoPadre, i, j-1, iFin,jFin)

  if(esFactible(i-1, j-1, matCerrados, numFils, numCols))
    procesaNodo(listaAbiertos, NodoPadre, i-1, j-1, iFin,jFin)

  if(i+1 == iFin && j == jFin ||
    i+1 == iFin && j+1 == jFin ||
    i == iFin && j+1 == jFin ||
    i-1 == iFin && j+1 == jFin ||
    i-1 == iFin && j == jFin ||
    i-1 == iFin && j-1 == jFin ||
    i+1 == iFin && j-1 == jFin ||
    i+1 == iFin && j-1 == jFin){
      matCerrados[iFin][jFin] = 1
      return
    }
    listaAbiertos.sort((nodo1,nodo2) => (nodo2.G + nodo2.H) < (nodo1.G + nodo1.H))  // lo ordenamos decrecientemente
    matCerrados[listaAbiertos[0].i][listaAbiertos[0].j] = 1 // Lo añadimos a lista de cerrados
    NodoPadre = listaAbiertos.shift()
    procesa(NodoPadre, NodoPadre.i, NodoPadre.j , iFin,jFin,matCerrados, listaAbiertos, numFils, numCols)
}


function getDistancia(iIni, jIni, iDestino, jDestino){
  return Math.sqrt(Math.pow((iDestino - iIni),2) + Math.pow((jDestino - jIni),2))
}

exports.handler = function(event, context, result) {
  var numFils = event.numFils
  var numCols = event.numCols
  var nodoFin = new Nodo(event.nodoFinal.i, event.nodoFinal.j,0,0,null)
  var nodoInicial = new Nodo(event.nodoInicial.i, event.nodoInicial.j, getDistancia(event.nodoInicial.i,event.nodoInicial.j, event.nodoFinal.i, event.nodoFinal.j),null)
  var matCerrados = event.matMuros

  matCerrados[nodoInicial.i][nodoInicial.j] = 1
  var listaAbiertos = []
  var linea = ''
  try{
    procesa(nodoInicial,nodoInicial.i, nodoInicial.j, 2,5, matCerrados, listaAbiertos, numFils , numCols)
      for(var i = 0; i < numFils; i++){   //Imprimimos la matriz
        for(var j = 0; j < numCols;j++)
          linea += matCerrados[i][j]
        console.log(linea)
        linea = ''
      }
    result(null,matCerrados)
    }
  catch(e){
    result('No existe ningun camino encontrado')
  }
}
