const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event) => {
    // Solo permitir solicitudes POST
    if (event.httpMethod !== 'POST') {
        return { 
            statusCode: 405, 
            body: JSON.stringify({ error: 'Método no permitido' }) 
        };
    }

    try {
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseKey) {
            throw new Error('Faltan las variables de entorno SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en Netlify');
        }

        const supabase = createClient(supabaseUrl, supabaseKey);
        const data = JSON.parse(event.body);

        const { error } = await supabase
            .from('reservas')
            .insert([
                {
                    nombre: data.nombre,
                    apellido: data.apellido,
                    email: data.email,
                    telefono: data.telefono,
                    fecha: data.fecha,
                    horario: data.horario,
                    tipo_sesion: data.tipo_sesion
                }
            ]);

        if (error) throw error;

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Reserva guardada con éxito' })
        };
    } catch (error) {
        console.error('Error en Netlify Function:', error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
