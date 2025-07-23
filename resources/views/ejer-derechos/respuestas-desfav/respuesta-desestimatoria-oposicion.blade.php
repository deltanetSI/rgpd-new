<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Respuesta Desestimatoria al Derecho de Oposición</title>
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
    <h2 style="text-align:center; margin-bottom:20px;">Respuesta desestimatoria del derecho de oposición</h2>

    <p style="text-align: right;">En <strong>{{ $city }}</strong>, a <strong>{{ $date }}</strong></p>

    <p>
        Muy Sr/Sra. Mío/a: <strong>{{ $full_name }}</strong>
    </p>

    <p>
        De acuerdo con su petición, ejercitando su derecho de oposición, de conformidad con lo dispuesto en el artículo 21 del REGLAMENTO (UE) 2016/679 DEL PARLAMENTO EUROPEO Y DEL CONSEJO DEL 27 DE ABRIL DE 2016, y su normativa de desarrollo y en consecuencia
    </p>

    <strong>LE COMUNICO</strong>

    <p>
        Que se desestima su petición de ejercicio del derecho de oposición al Tratamiento de sus datos de carácter personal contenidos en el fichero de esta empresa, por los siguientes motivos:
    </p>
    
    <div>
        {!! $denial_reasons !!}
    </div>

    <p>
        De conformidad con lo dispuesto en el artículo 77 del REGLAMENTO (UE) 2016/679 DEL PARLAMENTO EUROPEO Y DEL CONSEJO DEL 27 DE ABRIL DE 2016, le informo de su derecho a presentar una reclamación ante la Autoridad de Control responsable, si considera que el Tratamiento de sus datos personales no se ajusta a lo dispuesto en el reglamento.
    </p>

    <div class="firma">
        <p>Atentamente,</p>
        <p><strong>{{ $company_name }}</strong></p>
    </div>
</body>
</html>