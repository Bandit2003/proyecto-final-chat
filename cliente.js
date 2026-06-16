const socket = io(); 

const pantallaIngreso = document.getElementById('pantalla-ingreso');
const pantallaChat = document.getElementById('pantalla-chat');
const inputUsuario = document.getElementById('usernameInput');
const btnIngresar = document.getElementById('btn-ingresar');

let nombreUsuario = '';

btnIngresar.addEventListener('click', () => {
    const apodo = inputUsuario.value.trim();

    if (apodo !== '') {
        nombreUsuario = apodo;
        pantallaIngreso.style.display = 'none';
        pantallaChat.style.display = 'flex'; 
        console.log("¡Ingreso exitoso! El usuario es:", nombreUsuario);
    } else {
        alert('Por favor, ingresa un apodo para entrar al chat.');
    }
});