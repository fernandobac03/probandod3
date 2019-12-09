console.log("hello mundo")

d3.json ("https://gist.githubusercontent.com/double-thinker/817b155fd4fa5fc865f7b32007bd8744/raw/13068b32f82cc690fb352f405c69c156529ca464/partidos2.json").then (function (datosCompletos){//cargamos el JSON
         
    
	
	d3.csv("https://drive.google.com/file/d/13BeVUnoX5L4cKYw_FLHaf0pw0YqkDdiX/view?usp=sharing", function(data){
    console.log(data);
});
	
         //var datos = datosCompletos.partidos 
         var datosPartidos = datosCompletos.partidos
         
         console.log ("datos recibidos")
         
        //DEFINO ALTO Y ANCHO DE LA GRAFICA SVG
    
            var height = 500
            var width = 500
    //DEFINO MARGENES DE LA GRAFICA SVG
            var margin ={
                top: 20,
                botton: 50,
                left: 25,
                right: 50
            }
    
      //CARGAMOS EL CONTENEDOR
           var elementosSVG=d3.select("body")
           .append("svg")
         //  .attr("width", 500)//sin variable
           //.attr("height", 500)//sin variable
           
           .attr("width", width)//con variable definida
           .attr("height", height)//con variable definidia
          
           //HACER UNA ESCALA DE DOMINIO 1,10 Y DE RANGO 0PX, 500PX
           
           var escalaX = d3.scaleLinear()
              .domain ([1,10])
           // .range (["0px", "500px"])
           //modificar rango
           //.range (["25px","475"])
              .range([0 + margin.left, width - margin.right])
           
           //VISUALIZAR EJE X
           var ejeX=d3.axisBottom(escalaX)
           
           //PONER TICKS EJE X
           .ticks (5)
           //.tickFormat (d=>"hola") //texto a los valores del eje x
           .tickFormat (d3.format('.2s'))//DECIMALES
           //PINTAR EJE X
           elementosSVG
           //MUEVE EL EJE PARA Q APAREZCA LOS VALORES DEL EJE X
            .append("g")
    //para que el eje x se situe abajo, fijarse en las coordenadas (0,0)
           //.attr ("transform", "translate (0,470)")
        .attr("transform","translate(0, "+(height-margin.botton)+")")
            .call (ejeX)
           
           var escalaY = d3.scaleLinear()
              //.domain ([0,3000])//para valores fijos hasta 3000
              .domain (d3.extent(datosPartidos, d => d.votantes))//obtiene valores para el eje y del total de votantes y no solo de 3000
              //.range (["0px", "500px"])
          // .range (["500px", "0px"])
           
           //MODIFICAR RANGO
           //.range (["475px", "25px"])
           .range ([height - margin.botton, 0 + margin.top])
                      
           //VISUALIZAR EJE Y
           var ejeY=d3.axisLeft(escalaY)
           
           //PINTAR EJE Y
           elementosSVG
           //MUEVE EL EJE PARA Q APAREZCA LOS VALORES DEL EJE Y
            .append("g")
           // .attr ("transform", "translate (40,0)")
           .attr("transform","translate("+margin.left+",0)")
            .call (ejeY)
           
           //color
           var escalaColor=d3.scaleLinear ()
              .domain ([0.5,5,10])
           .range (["red","grey", "blue"])
           
           var escalatamanio = d3.scaleLinear ()
              .domain (d3.extent(datosPartidos, d=>d.votantes))
           .range ([8,20])
           
           
 elementosSVG
            .selectAll("circle")// esto es una seleccion vacia
            .data(datosPartidos)//aqui se hace el JOIN
            .enter()
            .append("circle")
            //.attr ("r",15)//valor de radio igual a 15 fijo
            .attr ("r", d=> escalatamanio (d.votantes)) 
            //.attr ("cx",15)
            //.attr ("cx", d => d.mediaAutoubicacion)
            .attr ("cx", d=> escalaX(d.mediaAutoubicacion))
             .attr ("cy", d=> escalaY(d.votantes))
           //aplicacion al attr fill con la variable d.mediaAutoubcacion
            .attr ("fill", d=> escalaColor(d.mediaAutoubicacion))

    //.on("click", d => pintarHistograma(d.partido))//METODO ELEMENTO CLICK
    //.on("mouseover", d => pintarHistograma(d.partido))//METODO RATON
    .on("mouseover", d => {pintarHistograma(d.partido)   
               pintarTooltip(d)
           })
    .on("mouseout",borrarTooltip)
    
    
    //VAMOS A PINTAR LA GRÁFICA DEL HISTOGRAMA
    /*************************************
               **********************
               ******************
               ***********
               *****
               ***/
   // pintarHistograma ("IU")
    
    
    var svgHistograma =d3.select("body")
           .append("svg")
              
           .attr("width", width)
           .attr("height", height)
    
    
    svgHistograma
           //MUEVE EL EJE PARA Q APAREZCA LOS VALORES DEL EJE X
            .append("g")
    //para que el eje x se situe abajo, fijarse en las coordenadas (0,0)
           //.attr ("transform", "translate (0,470)")
        .attr("transform","translate(0, "+(height-margin.botton)+")")
            .call (ejeX)
    
    
    //creo una nueva g, CREO EL EJE ENTERO NUEVO
    var gEjeYHistograma = svgHistograma
    .append("g")
    .attr("transfom", "traslate ("+ margin.left +",0)")
   
    
    // para etiquetar cada circulo, cambia diferentes etiquetas 
    var tooltip = d3.select("body")
    .append("div")
    .attr("class","tooltip")
    
    //BORRAR TOOLTIP
    function borrarTooltip (){
        tooltip
        //PARA BORRAR EL TOOLTIP JUGANDO CON LA OPACIDAD
        .style("opacity", 0)
        
        
    }
    
    //PINTAMOS TOOLTIP
    
    
    
    function pintarTooltip(d){
        
        
        //EJERCICIO PINTAR TOOLTIP
    
        
        
        
        tooltip
      .text(d.partido+ "-" + d.mediaAutoubicacion)//lo que se visualiza
      .style("top", d3.event.pageY)
      .style("left", d3.event.pageX)//para ubicar el tooltip
      .transition()
       //opacidad a 1
      .style ("opacity",1)
      
    }
    
    
    //********FUNCION*********************************
    function pintarHistograma (partidoseleccionado){
            
     var datosHistograma =          datosCompletos.histogramas[partidoseleccionado]
         
     
          
     var escalaYHistograma = d3.scaleLinear()
                .domain (d3.extent(datosHistograma, d => d.y))
           
           //MODIFICAR RANGO
           //.range (["475px", "25px"])
           .range ([height - margin.botton, 0 + margin.top])
          //VISUALIZAR EJE Y
    var ejeYHistograma=d3.axisLeft(escalaYHistograma)
           .ticks (5)
           //.tickFormat (d=>"hola") //texto a los valores del eje x
           .tickFormat (d3.format('.3s'))//DECIMALES
           //PINTAR EJE X
             //PINTAR EJE Y
   gEjeYHistograma
        .transition()
        .duration(1000)
        .delay(1000)
        .call(ejeYHistograma)
    
    /* svgHistograma
           //MUEVE EL EJE PARA Q APAREZCA LOS VALORES DEL EJE Y
            .append("g")
           // .attr ("transform", "translate (40,0)")
           .attr("transform","translate("+margin.left+",0)")
            .call (ejeYHistograma)*///C[DIGO ANTERIOR
    
    
    //LA 1RA VEZ A;NADIO CIRCULOS, LAS SIGUIENTES SE ACTUALIZA
    //ACTUALIZAR LOS CIRCULS SI YA EXISTIERAN, SI NO EXISTEN NO HACE NADA
    
    
    var escalaDelay = d3.scaleLinear()
              .domain ([1,10])
           // .range (["0px", "500px"])
           //modificar rango
           //.range (["25px","475"])
              .range([1000, 7000])
    
    
    svgHistograma
            .selectAll("circle")// esto es una seleccion vacia
            .data(datosHistograma)//aqui se hace el JOIN
        
        //EFECTO DE ANIMACION EN LOS CIRCULOS DE LA SEGUNDA GRAFICA HAGO EN LAS ACTUALIZACIONES
        //METODO TRANSITION
        .transition()
        
        .duration(500)
        .delay(1000) //delay fijo
        //.delay(d => escalaDelay(d.x)) // valor a cada circulo con escala
            
            .attr ("r", d=> escalatamanio(d.y)) 
            .attr ("cx", d=> escalaX(d.x))
            .attr ("cy", d=> escalaYHistograma(d.y))
            .attr ("fill", d=> escalaColor(d.x))
    
    //ANIADO NUEVOS ELEMENTOS
        svgHistograma
            .selectAll("circle")// esto es una seleccion vacia
            .data(datosHistograma)//aqui se hace el JOIN
            .enter()
            .append("circle")
        
            .attr ("r", d=> escalatamanio(d.y)) 
            .attr ("cx", d=> escalaX(d.x))
            .attr ("cy", d=> escalaYHistograma(d.y))
            .attr ("fill", d=> escalaColor(d.x))

        
}

})
