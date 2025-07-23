<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Respuesta al Ejercicio de Limitación de Tratamiento</title>
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
    <h2 style="text-align:center; margin-bottom:20px;">Respuesta al ejercicio de limitación de tratamiento</h2>

    <p style="text-align: right;">En <strong>{{ $city }}</strong>, a <strong>{{ $date }}</strong></p>

    <p>
        Muy Sr/Sra. Mío/a: <strong>{{ $full_name }}</strong>
    </p>

    <p>
        De acuerdo con su petición, ejercitando su derecho de limitación de Tratamiento, de conformidad con lo dispuesto en el artículo 18 del REGLAMENTO (UE) 2016/679 DEL PARLAMENTO EUROPEO Y DEL CONSEJO DEL 27 DE ABRIL DE 2016 y, en consecuencia,
    </p>

    <strong>LE COMUNICO</strong>

    <p>
        Que habiéndose resuelto favorablemente su petición de ejercicio del derecho de limitación de Tratamiento, la información sobre sus datos de carácter personal contenidos en el fichero de esta empresa ha sido limitada en el siguiente sentido:
    </p>

    <div>
        {!! $limitation_applied !!}
    </div>
    
    <div class="firma">
        <p>Atentamente,</p>
        <p><strong>{{ $company_name }}</strong></p>
    </div>
</body>
</html>