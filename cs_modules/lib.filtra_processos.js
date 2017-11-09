var selectorTrDentroTabela = 'tbody>tr[class^="infraTr"]';
var attributeFiltro = 'data-filtro';
var prefixFiltroTabela = 'filtro';
var prefixFiltroTrMostrar = 'mostrar';
var separator = ',';

function addClassAttr(element, attr, clazz) {
	var attributeArray;
	var attrValue = element.attr(attr);
	if (attrValue) {
		attributeArray = attrValue.split(separator);
		if (attributeArray.indexOf(clazz) === -1)
			attributeArray.push(clazz);
	} else {
		attributeArray = [clazz];
	}
	element.attr(attr, attributeArray.join(separator));
	return element;
}

function removeClassAttr(element, attr, clazz) {
	var attrValue = element.attr(attr);
	if (attrValue) {
		var attributeArray = attrValue.split(separator);
		var posClazz = attributeArray.indexOf(clazz);
		if (posClazz !== -1) {
			attributeArray.splice(posClazz, 1);
			if (attributeArray.length)
				element.attr(attr, attributeArray);
			else
				element.removeAttr(attr);
		}
	}
	return element;
}

function toggleClassAttr(element, attr, clazz, value) {
	if (value) return addClassAttr(element, attr, clazz);
	else return removeClassAttr(element, attr, clazz);
}

function hasClassAttr(element, attr, clazz) {
	var attrValue = element.attr(attr);
	if (attrValue) return attrValue.split(separator).indexOf(clazz) !== -1;
	return false;
}

function filtrarTabela(tabela, trs, sufix, isShowTr) {
	addClassAttr(tabela, attributeFiltro, prefixFiltroTabela + sufix);
	if (trs === null) trs = tabela.find(selectorTrDentroTabela);
	trs.each(function (index, element) {
		toggleClassAttr($(element), attributeFiltro, prefixFiltroTrMostrar + sufix, isShowTr(index, element));
	});
	atualizaFiltro(tabela, trs);
}

function atualizaFiltro(tabela, trs) {
	var checkbox;
	var elementr;
	var possuiTodasClasses;
	var arrayFiltroClasse = [];
	$.each((tabela.attr(attributeFiltro) || '').split(separator), function(index, element) {
		if (element.indexOf(prefixFiltroTabela) === 0)
			arrayFiltroClasse.push(prefixFiltroTrMostrar + element.substring(prefixFiltroTabela.length));
	});
	
	var quantidadeMostrar = 0;
	var arrayFiltroClasseLen = arrayFiltroClasse.length;
	trs.each(function (index, element) {
		possuiTodasClasses = true;
		elementr = $(element);
		for (var i = 0; i < arrayFiltroClasseLen; i++) {
			if (!hasClassAttr(elementr, attributeFiltro, arrayFiltroClasse[i])) {
				possuiTodasClasses = false; break;
			}
		}
		
		checkbox = $(element.children[0].children[1]);
		if (possuiTodasClasses) {
			element.style.display = 'table-row';
			quantidadeMostrar++;
		} else {
			element.style.display = 'none';
			if (checkbox.prop('checked')) checkbox.click();
		}
		checkbox.prop('disabled', !possuiTodasClasses);
	});
	tabela.children('caption').text(quantidadeMostrar + ' registro' + (quantidadeMostrar === 1 ? '' : 's') + ':');
}

function removerFiltroTabela(tabela, trs, sufix) {
	removeClassAttr(tabela, attributeFiltro, prefixFiltroTabela + sufix);
	if (trs === null) trs = tabela.find(selectorTrDentroTabela);
	trs.each(function() {
		removeClassAttr($(this), attributeFiltro, prefixFiltroTrMostrar + sufix);
	});
	atualizaFiltro(tabela, trs);
}