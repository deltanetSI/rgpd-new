<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Respuesta al Ejercicio del Derecho de Acceso</title>
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
    <h2 style="text-align:center; margin-bottom:20px;">Respuesta al ejercicio del derecho de acceso</h2>

    <p style="text-align: right;">En <strong>{{ $city }}</strong>, a <strong>{{ $date }}</strong></p>

    <p>
        Muy Sr/Sra. Mío/a: <strong>{{ $full_name }}</strong>
    </p>

    <p>
        De acuerdo con su petición, ejercitando su derecho de acceso, de conformidad con lo dispuesto en el artículo 15 del REGLAMENTO (UE) 2016/679 DEL PARLAMENTO EUROPEO Y DEL CONSEJO DEL 27 DE ABRIL DE 2016, en consecuencia,
    </p>

    <strong>LE COMUNICO</strong>

    <p>
        Que habiéndose resuelto favorablemente su petición de ejercicio del derecho de acceso, la información sobre sus datos de carácter personal contenidos en el fichero de esta empresa comprende:
    </p>

    <div>
        {!! $information_provided !!}
    </div>

    <div class="firma">
        <p>Atentamente,</p>
        <p><strong>{{ $company_name }}</strong></p>
    </div>
</body>
</html>