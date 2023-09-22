const TicketControl = require("../models/ticket-control");

const ticketControl = new TicketControl();

const socketController = (socket) => {
    //Se disparan todos los eventos cuando un nuevo cliente se conecta
    socket.emit( 'ultimo-ticket', ticketControl.ultimo );
    //disparando el socket que muestra los ultimos 4 
    socket.emit('ultimos-4', ticketControl.ultimos4 );
    //disparando el socket que muestra los tickets pendientes
    socket.emit( 'ticket-pendientes', ticketControl.tickets.length );

    
    
    socket.on('siguiente-ticket', ( payload, callback ) => {
        
       const siguiente = ticketControl.siguiente();
       callback( siguiente );
       socket.broadcast.emit( 'ticket-pendientes', ticketControl.tickets.length );


    });

    //agregando el socket del boton atender ticket
    socket.on('atender-ticket', ( { escritorio }, callback) => {
        //validacion de si el escritorio por si no viene
        if( !escritorio ) {
            return callback({
                ok: false,
                msg: 'El escritorio es obligatorio'
            });
        }
        //saber cual es el ticket que tenemos que atender
        const ticket = ticketControl.atenderTicket( escritorio );
        //TODO notificar cambio en los ultimos 4
        socket.broadcast.emit( 'ultimos-4', ticketControl.ultimos4 );
        socket.emit( 'ticket-pendientes', ticketControl.tickets.length );
        socket.broadcast.emit( 'ticket-pendientes', ticketControl.tickets.length )

        
        if( !ticket ) {
            callback({
                ok: false,
                msg: 'Ya no hay tickets pendientes'
            });
        } else {
            callback({
                ok: true,
                ticket
            })
        }
        
    });

}




module.exports = {
    socketController
}

