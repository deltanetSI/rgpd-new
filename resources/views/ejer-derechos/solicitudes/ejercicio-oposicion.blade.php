<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Ejercicio del Derecho de Oposición</title>
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
    <h2 style="text-align:center; margin-bottom:20px;">Ejercicio del derecho de oposición</h2>
    <p>
        D/Dña <strong>{{ $full_name }}</strong>,
        mayor de edad, con domicilio a efectos de notificaciones en <strong>{{ $full_address }}</strong>
        y con DNI <strong>{{ $nif }}</strong> del que acompaña fotocopia, mediante el presente escrito ejercito
        el derecho de oposición, de conformidad con lo dispuesto en el artículo 21 del REGLAMENTO (UE) 2016/679 DEL
        PARLAMENTO EUROPEO Y DEL CONSEJO DE 27 DE ABRIL DE 2016, y en consecuencia,
    </p>
    
    <strong>EXPONGO</strong>
    <div>
        {!! $reasons_for_opposition !!}
    </div>

    <strong>SOLICITO</strong>
    <p>
        Que se proceda a suspender el Tratamiento de los datos personales que figuran sobre mi persona en cualquier fichero de los sean titulares, en el plazo de diez días desde la recepción de esta solicitud, y que se me notifique de forma escrita a la dirección arriba indicada la exclusión del Tratamiento de mis datos personales o, en su caso, de forma motivada su denegación.
    </p>

    <p>
        En <strong>{{ $city }}</strong>, a <strong>{{ $date }}</strong>
    </p>

    <div class="firma">
        Firma del interesado
    </div>
</body>
</html>