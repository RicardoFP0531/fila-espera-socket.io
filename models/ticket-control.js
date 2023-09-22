const path = require('path');
const fs = require('fs');



class Ticket {

    constructor(numero, escritorio) {
        this.numero = numero;
        this.escritorio = escritorio;
    }


}




class TicketControl {

    constructor() { //propiedades de mi clase
        //ultimo ticket que estoy atendiendo
        this.ultimo = 0;
        //saber que dia es hoy
        this.hoy = new Date().getDate();
        //manejar todos los tickets pendientes
        this.tickets = [];
        //manejar los ultimos 4 tickets que son los que se mostraran en la pantalla de vista
        this.ultimos4 = [];

        //la idea es leer el json y establecer las propiedades
        this.init();

    }

    //creando getter para el json de las propiedades que quiero grabar
    get toJson () {
        return {
            ultimo : this.ultimo,
            hoy : this.hoy,
            tickets : this.tickets,
            ultimos4 : this.ultimos4
        }
        
    }

    //metodo de inicializar la clase
    init() {
        //leyendo el data JSON 
        const { hoy, ultimos4, ultimo, tickets } = require('../db/data.json');
        //evaluar el dia de hoy con el actual, si es asi puedo leer la info de la data para cargar esas propiedades que se encuentran en la clase
        if ( hoy === this.hoy ) {
            //si es asi estamos trabajando en el mismo dia y estoy recargando el servidor
            this.tickets = tickets,
            this.ultimo = ultimo,
            this.ultimos4 = ultimos4
        } else {
            //es otro dia (hay que reinicializar todas las variables)
            this.guardarDB();
        }
        
    }

    //metodo de guardar en la base
    guardarDB() {

        const dbPath = path.join( __dirname, '../db/data.json');
        fs.writeFileSync( dbPath, JSON.stringify( this.toJson ))
    }

    //metodo de ticket siguiente
    siguiente() {
        //empezar un acumulador
        this.ultimo += 1;

        const ticket = new Ticket( this.ultimo, null );
        //insertmos el nuevo ticket en el arreglo de tickets
        this.tickets.push( ticket );

        //guardamos en la base de datos
        this.guardarDB();
        //regresa el nuevo ticket o el numero del ticket
        return 'Ticket' + ticket.numero

    }


    //metodo de atender ticket
    atenderTicket( escritorio ) {

        //no tenemos tickets
        if( this.tickets.length === 0 ) {
            return null;
        }
        //si tenemos alguno y me mandan el escritorio, necesito saber de mis tickets cual es ese numero, el primero y borrarlo del arreglo de tickets al que acabo de sacar
        const ticket = this.tickets.shift();

        //ticket que necesito atender ahora 
        ticket.escritorio = escritorio;

        //anadir a los ultimos 4 tickets
        this.ultimos4.unshift( ticket );

        //verificar que siempre sean 4 tickets
        if( this.ultimos4.length > 4 ) {
            this.ultimos4.splice( -1, 1 )
        }
        //guardando en la BD
        this.guardarDB();
        
        return ticket;

    }


}

module.exports = TicketControl;