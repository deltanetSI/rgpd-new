<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Requerimiento de Subsanación de Solicitud</title>
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
    <h2 style="text-align:center; margin-bottom:20px;">Respuesta requiriendo al afectado para que aporte documentación o subsane defectos en la solicitud</h2>

    <p style="text-align: right;">En <strong>{{ $city }}</strong>, a <strong>{{ $date }}</strong></p>

    <p>
        Muy Sr/Sra. Mío/a: <strong>{{ $full_name }}</strong>
    </p>

    <p>
        De acuerdo con su petición, ejercitando su derecho de <strong>{{ $right_exercised }}</strong>, de conformidad con lo dispuesto en el REGLAMENTO (UE) 2016/679 DEL PARLAMENTO EUROPEO Y DEL CONSEJO DEL 27 DE ABRIL DE 2016 y, en consecuencia,
    </p>

    <strong>LE COMUNICO</strong>

    <p>
        Que su solicitud realizada en fecha <strong>{{ $request_date }}</strong>, por la que ejercita su derecho de <strong>{{ $right_exercised }}</strong>, contiene defectos, bien por no haberse realizado con los requisitos establecidos en la normativa vigente, bien porque la misma carece de los documentos acreditativos en que basa su petición.
    </p>
    <p>
        Para poder atender su solicitud precisamos que nos envíe:
    </p>
    
    <div>
        {!! $required_documentation !!}
    </div>

    <div class="firma">
        <p>Atentamente,</p>
        <p><strong>{{ $company_name }}</strong></p>
    </div>
</body>
</html>