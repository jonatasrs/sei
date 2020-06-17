function ListaPorEspecificacao(BaseName) {
    var processosVisualizados = document.querySelectorAll('.processoVisualizado')
    var processosNaoVisualizados = document.querySelectorAll('.processoNaoVisualizado')

    i1 = 0 // variável para indexar qual classe de visualizados que o querySelectorAll deve pegar
    i2 = 0 // variável para indexar qual classe de nãoVisualizados que o querySelectorAll deve pegar
    function visualizados(item1) {
    	// pega informações do título do processo
    	var info1 = item1.getAttribute("onmouseover");
        titulo1 = info1.split("'");    
        
        //pega o espaço onde está o número e substitui pelo título
    	processoVisualizado = document.querySelectorAll('.processoVisualizado')[i1]  
    	if(titulo1[1] != ''){
        	processoVisualizado.innerHTML = titulo1[1]	
        }   else ( processoVisualizado.innerHTML += ' (sem especificação)' )	
        i1++       
    }

    function naovisualizados(item2) {
    	// pega informações do título do processo
    	var info2 = item2.getAttribute("onmouseover");
        titulo2 = info2.split("'");
        
        //pega o espaço onde está o número e substitui pelo título
        processoNaoVisualizado = document.querySelectorAll('.processoNaoVisualizado')[i2]  
        if(titulo2[1] != ''){
    		processoNaoVisualizado.innerHTML = titulo2[1]
    	} else ( processoNaoVisualizado.innerHTML +=' (sem especificação)' )	
        i2++ 
    } 
    processosVisualizados.forEach(visualizados);
    processosNaoVisualizados.forEach(naovisualizados);
}