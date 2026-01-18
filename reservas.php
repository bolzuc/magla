<?php
/*
    ARCHIVO: reservas.php (VERSION SMTP ROBUSTA)
    UBICACIÓN: Carpeta raíz
    
    REQUISITO: Debes descargar la librería PHPMailer y colocarla en una carpeta 'libs/PHPMailer'
    o usar Composer. Aquí asumiremos carga manual de archivos si no usas composer.
*/

// Configuración de encabezados para respuesta JSON
header('Content-Type: application/json; charset=utf-8');

// ==============================================================================
// 1. IMPORTAR PHPMAILER (Descomenta las líneas si descargas la carpeta manual)
// ==============================================================================
// use PHPMailer\PHPMailer\PHPMailer;
// use PHPMailer\PHPMailer\Exception;
// use PHPMailer\PHPMailer\SMTP;

// require 'libs/PHPMailer/src/Exception.php';
// require 'libs/PHPMailer/src/PHPMailer.php';
// require 'libs/PHPMailer/src/SMTP.php';

// NOTA PARA EL USUARIO: 
// Si tu servidor no tiene PHPMailer instalado globalmente, 
// debes descargar los 3 archivos (Exception.php, PHPMailer.php, SMTP.php)
// y subirlos a tu carpeta 'libs/PHPMailer/src/'.

// ==========================================
// 2. CONFIGURACIÓN SMTP (EDITAR AQUÍ)
// ==========================================
$smtp_host = 'mail.hotelmagla.com'; // Tu servidor de correo (ej: mail.tudominio.com)
$smtp_user = 'info@hotelmagla.com'; // Tu cuenta de correo real
$smtp_pass = 'TuContraseñaSegura';  // La contraseña de ese correo
$smtp_port = 465;                   // Puerto (465 para SSL, 587 para TLS)
$smtp_secure = 'ssl';               // 'ssl' o 'tls'

$correo_destino = "reservas@hotelmagla.com"; // Quién recibe las reservas

// ==========================================
// 3. PROCESAR DATOS
// ==========================================

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Recoger datos
    $nombre = strip_tags(trim($_POST["nombre"] ?? ''));
    $telefono = strip_tags(trim($_POST["telefono"] ?? ''));
    $email = filter_var(trim($_POST["email"] ?? ''), FILTER_SANITIZE_EMAIL);
    $llegada = strip_tags(trim($_POST["llegada"] ?? ''));
    $salida = strip_tags(trim($_POST["salida"] ?? ''));
    $habitacion = strip_tags(trim($_POST["habitacion"] ?? ''));
    $huespedes = strip_tags(trim($_POST["huespedes"] ?? ''));
    $mensaje = strip_tags(trim($_POST["mensaje"] ?? ''));

    if (empty($nombre) || empty($email) || empty($telefono)) {
        echo json_encode(['success' => false, 'message' => 'Faltan datos obligatorios.']);
        exit;
    }

    // Cuerpo del Mensaje
    $body = "
    <h2>Nueva Solicitud de Reserva</h2>
    <p><strong>Cliente:</strong> $nombre</p>
    <p><strong>Teléfono:</strong> $telefono</p>
    <p><strong>Email:</strong> $email</p>
    <hr>
    <p><strong>Llegada:</strong> $llegada</p>
    <p><strong>Salida:</strong> $salida</p>
    <p><strong>Habitación:</strong> $habitacion ($huespedes pax)</p>
    <p><strong>Nota:</strong> $mensaje</p>
    ";

    // ==========================================
    // 4. ENVIAR CON PHPMAILER
    // ==========================================
    
    // SI NO TIENES PHPMAILER AÚN, USAREMOS MAIL() MEJORADO COMO FALLBACK TEMPORAL
    // Para activar PHPMailer, borra el bloque 'FALLBACK' y descomenta el bloque 'SMTP' abajo.
    
    /* --- BLOQUE SMTP (USAR ESTE CUANDO SUBAS LA LIBRERÍA) ---
    $mail = new PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host       = $smtp_host;
        $mail->SMTPAuth   = true;
        $mail->Username   = $smtp_user;
        $mail->Password   = $smtp_pass;
        $mail->SMTPSecure = $smtp_secure;
        $mail->Port       = $smtp_port;
        $mail->CharSet    = 'UTF-8';

        $mail->setFrom($smtp_user, 'Web Hotel Magla');
        $mail->addAddress($correo_destino);
        $mail->addReplyTo($email, $nombre);

        $mail->isHTML(true);
        $mail->Subject = "Reserva Web: $nombre ($llegada)";
        $mail->Body    = $body;

        $mail->send();
        echo json_encode(['success' => true, 'message' => '¡Solicitud enviada correctamente!']);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Error técnico: ' . $mail->ErrorInfo]);
    }
    ---------------------------------------------------------- */

    // --- BLOQUE FALLBACK (MAIL NATIVO MEJORADO) ---
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= "From: Web Magla <noreply@hotelmagla.com>" . "\r\n"; // Usa un dominio real
    $headers .= "Reply-To: $email" . "\r\n";

    if(@mail($correo_destino, "Reserva Web: $nombre", $body, $headers)) {
        echo json_encode(['success' => true, 'message' => '¡Solicitud recibida! Te contactaremos pronto.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error al enviar. Por favor escríbenos al WhatsApp.']);
    }
    // ----------------------------------------------

} else {
    echo json_encode(['success' => false, 'message' => 'Método no permitido.']);
}
?>