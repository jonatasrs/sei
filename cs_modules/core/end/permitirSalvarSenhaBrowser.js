// Description: Permite que o navegador salve a senha do usuário ao fazer login no sistema.
function permitirSalvarSenhaBrowser () {
  function changeInput () {
    const pwdSenha = document.querySelector('#frmLogin #divSenha>span.input-group>input#pwdSenha')
    const input = document.querySelector('#frmLogin #divSenha>span.input-group>input[name=pwdSenha]')
    if (pwdSenha && input) {
      // Remove o campo de senha que esta visivel
      pwdSenha.remove()
      // Muda o campo de senha para ser do tipo password
      input.setAttribute('id', 'pwdSenha')
      input.classList.add('form-control')
      input.removeAttribute('style')
    }
  }

  setTimeout(changeInput, 500)
}
