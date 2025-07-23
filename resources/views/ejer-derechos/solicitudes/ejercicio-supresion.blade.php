<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Ejercicio del Derecho de Supresión</title>
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
    <h2 style="text-align:center; margin-bottom:20px;">Ejercicio del derecho de supresión</h2>
    <p>
        D/Dña <strong>{{ $full_name }}</strong>,
        mayor de edad, con domicilio a efectos de notificaciones en <strong>{{ $full_address }}</strong>
        y con DNI <strong>{{ $nif }}</strong> del que acompaña fotocopia, mediante el presente escrito ejercito
        el derecho de supresión, de conformidad con lo dispuesto en el artículo 17 del REGLAMENTO (UE) 2016/679 DEL
        PARLAMENTO EUROPEO Y DEL CONSEJO DE 27 DE ABRIL DE 2016, y su normativa de desarrollo y en consecuencia, 
    </p>
    <strong>SOLICITO</strong>
    <p>
        Que se proceda a la supresión de los datos personales sobre los cuales se ejercita el derecho, en el plazo de diez días desde la recepción de esta solicitud, y que se me notifique de forma escrita a la dirección arriba indicada el resultado de la cancelación practicada o, en su caso, de forma motivada su denegación. 
    </p>
    <p>
        Los datos a cancelar son los siguientes: 
    </p>
    <div>
        {!! $data_to_delete !!}
    </div>
    <p>
        Si los datos cancelados hubieran sido cedidos previamente, se notifique al Responsable del fichero cesionario la cancelación practicada, a fin de que éste proceda también a realizar la cancelación oportuna. 
    </p>
    <p>
        En <strong>{{ $city }}</strong>, a <strong>{{ $date }}</strong>
    </p>

    <div class="firma">
        Firma del interesado
    </div>
</body>
</html>