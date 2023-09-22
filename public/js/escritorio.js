//referencias del html
const lblEscritorio = document.querySelector( 'h1' );
const btnAtender    = document.querySelector('button');
const lblTicket     = document.querySelector('small');
const divAlerta     = document.querySelector('.alert');
//tarea video 234 
const lblPendientes = document.querySelector('#lblPendientes');



const serachParams = new URLSearchParams( window.location.search );

if( !serachParams.has('escritorio') ) {

    //sacar al usuario al index
    window.location = 'index.html';
    throw new Error('El escritorio es obligatorio');

}


//constante para saber cual es el escritorio en donde me encuentro
const escritorio = serachParams.get( 'escritorio' );
lblEscritorio.innerText = escritorio;

//ocultando el alert al inicio de las operaciones
divAlerta.style.display = 'none';

//empieza a manipular con los sockets

const socket = io();

socket.on('connect', () => {
    // console.log('Conectado');
    btnAtender.disabled = false;

});

socket.on('disconnect', () => {
    // console.log('Desconectado del servidor');

    btnAtender.disabled = true;

});

//listener de los tickets pendientes
socket.on('ticket-pendientes', ( pendientes ) => {
    if( pendientes === 0 ) {
        lblPendientes.style.display = 'none';
    } else {
        lblPendientes.style.display = '';
        lblPendientes.innerText = pendientes;
        divAlerta.style.display = 'none';
    }
    
})




btnAtender.addEventListener( 'click', () => {
    
    //pedir al backend que este escuchando un evento
    socket.emit('atender-ticket', { escritorio }, ( { ok, ticket, msg } ) => {
        if( !ok ) {
            lblTicket.innerText = 'Nadie';
            return divAlerta.style.display = '';
        }
        //si no hay ningun error quiere decir que tengo un ticket
        lblTicket.innerText = 'Ticket ' + ticket.numero;

    })
      

});