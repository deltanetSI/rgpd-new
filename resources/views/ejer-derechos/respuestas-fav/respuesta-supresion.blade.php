<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Respuesta al Ejercicio del Derecho de Supresión</title>
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
    <h2 style="text-align:center; margin-bottom:20px;">Respuesta al ejercicio del derecho de supresión</h2>

    <p style="text-align: right;">En <strong>{{ $city }}</strong>, a <strong>{{ $date }}</strong></p>

    <p>
        Muy Sr/Sra. Mío/a: <strong>{{ $full_name }}</strong>
    </p>

    <p>
        De acuerdo con su petición, ejercitando su derecho de supresión, de conformidad con lo dispuesto en el artículo 17 del REGLAMENTO (UE) 2016/679 DEL PARLAMENTO EUROPEO Y DEL CONSEJO DEL 27 DE ABRIL DE 2016, en consecuencia,
    </p>

    <strong>LE COMUNICO</strong>

    <p>
        Que habiéndose resuelto favorablemente su petición de ejercicio del derecho de cancelación de sus datos personales contenidos en el fichero de esta empresa.
    </p>
    <p>
        Los datos cancelados son los siguientes:
    </p>
    
    <div>
        {!! $deleted_data !!}
    </div>

    <p>
        Se ha procedido con anterioridad a comunicarlo asimismo a los Responsables de los ficheros a los que se comunicó sus datos, para que procedan también a realizar la supresión de los mismos. 
    </p>
    <p>
        La supresión acordada implica el bloqueo de sus datos, consistente en la identificación y reserva de los mismos con el fin de impedir su Tratamiento, excepto para su puesta a disposición de las Administraciones Públicas, Jueces y Tribunales, para la atención de las posibles responsabilidades nacidas del Tratamiento, durante el plazo de prescripción de éstas. 
    </p>
    <p>
        Cumplido el citado plazo se procederá a la supresión.
    </p>

    <div class="firma">
        <p>Atentamente,</p>
        <p><strong>{{ $company_name }}</strong></p>
    </div>
</body>
</html>