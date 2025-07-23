<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Ejercicio del Derecho de Rectificación</title>
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
    <h2 style="text-align:center; margin-bottom:20px;">Ejercicio del derecho de rectificación</h2>
    <p>
        D/Dña <strong>{{ $full_name }}</strong>, 
        mayor de edad, con domicilio a efectos de notificaciones en <strong>{{ $full_address }}</strong> 
        y con DNI <strong>{{ $nif }}</strong> del que acompaña fotocopia, mediante el presente escrito ejercito
        el derecho de rectificación, de conformidad con lo dispuesto en el artículo 16 del REGLAMENTO (UE) 2016/679 DEL
        PARLAMENTO EUROPEO Y DEL CONSEJO DE 27 DE ABRIL DE 2016, en consecuencia,
    </p>
    <strong>SOLICITO</strong> 
    <p>
        Que se proceda a la rectificación de los datos personales sobre los cuales se ejercita el derecho, y que se me notifique por correo a la dirección arriba indicada el resultado de la rectificación practicada. 
    </p>
    <p>
        Los datos a rectificar son los siguientes: 
    </p>
    <div>
        {!! $data_to_rectify !!}
    </div>
    <p>
        Si los datos rectificados hubieran sido comunicados previamente, se notifique al Responsable del fichero cesionario la rectificación practicada, a fin de que éste proceda también a realizar la corrección oportuna. 
    </p>
    <p>
        En <strong>{{ $city }}</strong>, a <strong>{{ $date }}</strong> 
    </p>

    <div class="firma">
        Firma del interesado
    </div>
</body>
</html>