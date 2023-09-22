//REFERENCIAS HTML PARA TRABAJAR 
const lblNuevoTicket = document.querySelector('#lblNuevoTicket');
const button = document.querySelector('button');



const socket = io();

socket.on('connect', () => {
    // console.log('Conectado');
    button.disabled = false;

});

socket.on('disconnect', () => {
    // console.log('Desconectado del servidor');

    button.disabled = true;

});

//evento de escuchar el ultimo ticket en la cola
socket.on('ultimo-ticket', ( ultimo ) => {
    //mostrando ese ultimo ticket en el front
    lblNuevoTicket.innerText = 'Ticket ' + ultimo;
})




button.addEventListener( 'click', () => {
    
    socket.emit( 'siguiente-ticket', null, ( ticket ) => {
        lblNuevoTicket.innerText = ticket;
    });

});