<?php
/*
    ARCHIVO: reservas.php (BACKEND LIMPIO)
    DESCRIPCIÓN: Recibe datos vía POST, intenta enviar email y responde JSON.
*/

// Forzar respuesta JSON siempre
header('Content-Type: application/json; charset=utf-8');

// Configuración Básica
$correo_destino = "reservas@hotelmagla.com"; // CAMBIAR POR EL REAL
$asunto_default = "Nueva Reserva Web - Hotel Magla";

// Respuesta por defecto
$response = ['success' => false, 'message' => 'Método no permitido.'];

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // 1. Sanitización de Datos
    $nombre     = strip_tags(trim($_POST["nombre"] ?? ''));
    $telefono   = strip_tags(trim($_POST["telefono"] ?? ''));
    $email      = filter_var(trim($_POST["email"] ?? ''), FILTER_SANITIZE_EMAIL);
    $llegada    = strip_tags(trim($_POST["llegada"] ?? ''));
    $salida     = strip_tags(trim($_POST["salida"] ?? ''));
    $habitacion = strip_tags(trim($_POST["habitacion"] ?? ''));
    $huespedes  = strip_tags(trim($_POST["huespedes"] ?? ''));
    $mensaje    = strip_tags(trim($_POST["mensaje"] ?? ''));

    // 2. Validación
    if (empty($nombre) || empty($email) || empty($telefono)) {
        echo json_encode(['success' => false, 'message' => 'Faltan datos obligatorios.']);
        exit;
    }

    // 3. Construcción del Email (HTML)
    $cuerpo = "
    <html>
    <head>
        <title>Solicitud de Reserva</title>
    </head>
    <body style='font-family: Arial, sans-serif;'>
        <div style='background-color: #f8f8f8; padding: 20px;'>
            <h2 style='color: #6A1B1F;'>Nueva Solicitud desde Web</h2>
            <hr>
            <p><strong>Cliente:</strong> $nombre</p>
            <p><strong>Teléfono:</strong> $telefono</p>
            <p><strong>Email:</strong> $email</p>
            <br>
            <p><strong>Llegada:</strong> $llegada</p>
            <p><strong>Salida:</strong> $salida</p>
            <p><strong>Alojamiento:</strong> $habitacion ($huespedes huéspedes)</p>
            <br>
            <p><strong>Comentarios:</strong><br> $mensaje</p>
        </div>
    </body>
    </html>
    ";

    // 4. Encabezados para Email HTML
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= "From: Web Hotel Magla <noreply@hotelmagla.com>" . "\r\n";
    $headers .= "Reply-To: $email" . "\r\n";

    // 5. Envío
    // NOTA: Usamos @ para suprimir errores de PHP en pantalla y manejarlo nosotros
    if (@mail($correo_destino, "Reserva: $nombre ($llegada)", $cuerpo, $headers)) {
        $response = ['success' => true, 'message' => 'Correo enviado exitosamente.'];
    } else {
        // Si mail() falla (común en localhost o hostings restrictivos), el JS manejará el fallback a WhatsApp
        $response = ['success' => false, 'message' => 'El servidor de correo no respondió.'];
    }
}

echo json_encode($response);
?>