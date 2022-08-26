function OrdenarSelect() {
  if (!SavedOptions.CheckTypes.includes('ordenaratribuirprocesso')) return;

  const select = $('#selAtribuicao');
  const firstOption = select.val();

  select.html(select.children('option').sort((a, b) => {
    const aIsBigger = a.text.split(' - ')[1] > b.text.split(' - ')[1];

    if (aIsBigger) return 1;
    if (!aIsBigger) return -1;
    return 0;
  })).val(firstOption);
};
