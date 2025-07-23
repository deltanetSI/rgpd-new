<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Ejercicio del Derecho de Limitación de Tratamiento</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 14px;
            padding: 15px 20px;
        }
        .firma {
            margin-top: 60px;
        }
    </style>
</head>
<body>
    <h2 style="text-align:center; margin-bottom:20px;">Ejercicio del derecho de limitación de tratamiento</h2>
    <p>
        D/Dña <strong>{{ $full_name }}</strong>,
        mayor de edad, con domicilio a efectos de notificaciones en <strong>{{ $full_address }}</strong>
        y con DNI <strong>{{ $nif }}</strong> del que acompaña fotocopia, mediante el presente escrito ejercito
        el derecho de limitación de Tratamiento, de conformidad con lo dispuesto en el artículo 18 del REGLAMENTO (UE) 2016/679 DEL
        PARLAMENTO EUROPEO Y DEL CONSEJO DE 27 DE ABRIL DE 2016, y en consecuencia,
    </p>
    
    <strong>SOLICITO</strong>
    <p>
        Que se me facilite el derecho de limitación de Tratamiento de toda la información de que dispongan sobre mi persona contenida en sus ficheros, en el plazo de un mes desde la recepción de esta solicitud, y que se me notifique de forma escrita a la dirección arriba indicada.
    </p>
    <p>
        Que la limitación solicitada corresponde a la siguiente:
    </p>
    <div>
        {!! $limitation_details !!}
    </div>

    <p>
        En <strong>{{ $city }}</strong>, a <strong>{{ $date }}</strong>
    </p>

    <div class="firma">
        Firma del interesado
    </div>
</body>
</html>