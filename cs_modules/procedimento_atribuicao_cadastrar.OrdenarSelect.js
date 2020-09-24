function OrdenarSelect() {
  const select = $('#selAtribuicao');
  const firstOption = select.val();

  select.html(select.children('option').sort((a, b) => {
    const aIsBigger = a.text.substring(14) > b.text.substring(14);

    if (aIsBigger) return 1;
    if (!aIsBigger) return -1;
    return 0;
  })).val(firstOption);
};
