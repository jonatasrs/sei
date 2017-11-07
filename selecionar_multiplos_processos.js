{
	let shifted = false;
	let desativarClick = false;
	
	let elementos = [
		{id: 'chkDetalhadoItem'},
		{id: 'chkRecebidosItem'},
		{id: 'chkGeradosItem'},
		{id: 'chkInfraItem'},
	];
	
	function alteradoCheckbox(chkbox, element) {
		if (!desativarClick) {
			if (shifted) {
				let chkboxs = $(element.selectorCheckbox).get();
				let index1 = chkboxs.indexOf(chkbox);
				let index2 = chkboxs.indexOf(element.lastElement);
				
				if (index1 <= index2)
					efetuarClique(chkboxs, index1, index2);
				else
					efetuarClique(chkboxs, index2, index1);
				
			} else {
				element.lastElement = chkbox;
			}
		}
	}
	
	function efetuarClique(array, index1, index2) {
		desativarClick = true;
		for (var i = index1 + 1; i < index2; i++) {
			if (array[i].offsetParent !== null)
				$(array[i]).click();
		}
		desativarClick = false;
	}
	
	$(document).on('keyup keydown', function(e) {
		shifted = e.shiftKey;
	});
	
	$.each(elementos, function(index, element) {
		element.selectorCheckbox = 'input:checkbox[id^="' + element.id + '"]';
		$(element.selectorCheckbox).change(function() {
			alteradoCheckbox(this, element);
		});
	});
}