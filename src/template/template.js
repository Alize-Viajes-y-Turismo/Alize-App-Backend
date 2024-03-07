const getEmailTemplate = (data) => {

// html de lo que le llegara al correo

    const { email, token } = data;
  
    const emailUser = email.split('@')[0].toString();
    const url = 'PÁGINA RECUPERACIÓN DE CONTRASEÑA'; 
    
    return `
    <form>
      <div>
        <label>Hola ${ emailUser }</label>
        <br>
        <a href="${ url }?token=${ token }" target="_blank">    Recuperar contraseña     </a>
      </div>
    </form>
    `;
  }
  
  module.exports = {
    getEmailTemplate
  }