/** jquery ui: iconselectmenu */
$.widget('custom.iconselectmenu', $.ui.selectmenu, {
  _renderItem: function (ul, item) {
    const li = $('<li>'); const wrapper = $('<div>')
    wrapper.text(item.label).css({ height: '12px' })
    li.css({ paddingLeft: 'unset', paddingRight: 'unset' })

    if (item.disabled) { li.addClass('ui-state-disabled') }

    $('<span>', {
      style: 'background-image: url(' + item.element.attr('data-url') + ')',
      class: 'ui-icon'
    }).appendTo(wrapper)

    return li.append(wrapper).appendTo(ul)
  },
  _renderButtonItem: function (item) {
    console.log(item)
    const wrapper = $('<div>', { text: item.label }).addClass('ui-menu').css({ paddingLeft: '1em', height: '12px' })
    const buttonItem = $('<span>', {
      style: 'background-image: url(' + item.element.attr('data-url') + ')',
      class: 'ui-icon'
    }).css({ left: 0 })
    wrapper.append(buttonItem)
    this._setText(buttonItem, item.label)
    return wrapper
  }
})
