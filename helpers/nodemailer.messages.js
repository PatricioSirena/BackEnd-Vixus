const transporter = require('../helpers/nodemailer.config')


const registroUsuario = async (emailUsuario) => {
    const info = await transporter.sendMail({
        from: `Bienvenido a Vixus!!!" <${process.env.USER_NODEMAILER}>`, // sender address
        to: emailUsuario, // list of receivers
        subject: "Registro de usuario", // Subject line
        html: `
    <div style="text-align: center; height: 50vh;">
    <div style='width: 100%; background-color: white;' >
        <img style="height: 15vh;" src="https://res.cloudinary.com/dkp3sew2y/image/upload/v1729171597/Logo_Vixus.jpg" alt="">
    </div>        
    <div>
        <h1 style="color: #000; text-align: center;">Bienvenido a Vixus!</h1>
        <p>Gracias por registrarte y confiar en nosotros, esperamos que tengas una excelente experiencia, no dudes en consultarnos por Whatsapp cuqluier duda que tengas!!</p>
    </div>
    <button style="
    background-color: #964b00be;
    border: 1px solid #786C3B;
    border-radius: 5px;
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
    ">
        Ir a Vixus!
    </button>
</div>
    `,
    });
}


const recuperoContraseniaUsuario = async (emailUsuario, token) => {
    const info = await transporter.sendMail({
        from: `Vixus <${process.env.USER_NODEMAILER}>`, // sender address
        to: emailUsuario, // list of receivers
        subject: "Recupero de contraseña", // Subject line
        html: `
    <div style="height: fit-content; display: flex; justify-content: center;">
        <div style='width: 100vw;'>
            <img style="height: 15%;" src="https://res.cloudinary.com/dkp3sew2y/image/upload/v1729171597/Logo_Vixus.jpg" alt="">
        </div>  
        <div>
            <p>Hace click en el siguiente boton para cambiar tu contraseña!<p/>
        </div>
            <button style="
            background-color: #964b00be;
            border: 1px solid #786C3B;
            border-radius: 5px;
            padding: 10px 20px;
            font-size: 16px;
            cursor: pointer;
            box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);">
                <a style="text-decoration: none; color: black;" href="ejemploDeRutaFront/${token}">
                    Cambiar contraseña
                </a>
            </button>
    </div>
    `,
    });
}

const envioDeOrdenDeCompra = async (emailUsuario, linkDePago) => {
    const info = await transporter.sendMail({
        from: `Vixus <${process.env.USER_NODEMAILER}>`, // sender address
        to: emailUsuario, // list of receivers
        subject: "Orden de compra", // Subject line
        html: `
    <div style="height: fit-content; display: flex; justify-content: center;">
        <div style='width: 100vw;'>
            <img style="height: 15%;" src="https://res.cloudinary.com/dkp3sew2y/image/upload/v1729171597/Logo_Vixus.jpg" alt="">
        </div> 
        <div>
            <p>Muchas gracias por tu compra!! Hace click en el siguiente enlace para realizar el pago!!<p/>
        </div>
        <button style="
            background-color: #964b00be;
            border: 1px solid #786C3B;
            border-radius: 5px;
            padding: 10px 20px;
            font-size: 16px;
            cursor: pointer;
            box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);">
                <a style="text-decoration: none; color: black;" href="${linkDePago}">
                    Finalizar compra
                </a>
            </button>
    </div>
    `,
    });
}

module.exports = {
    registroUsuario,
    recuperoContraseniaUsuario,
    envioDeOrdenDeCompra
}