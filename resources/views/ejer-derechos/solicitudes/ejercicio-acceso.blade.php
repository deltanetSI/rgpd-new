<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <title>Ejercicio del derecho de acceso</title>
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
    <h2 style="text-align:center; margin-bottom:20px;">Ejercicio del derecho de acceso</h2>
    <p>
        D/Dña <strong>{{ $full_name }}</strong><br>
        mayor de edad, con domicilio a efectos de notificaciones en <strong>{{ $full_address }}</strong><br>
        y con DNI <strong>{{ $nif }}</strong> del que acompaña fotocopia, mediante el presente escrito ejercito
        el derecho de acceso, de conformidad con lo dispuesto en el artículo 15 del REGLAMENTO (UE) 2016/679 DEL
        PARLAMENTO EUROPEO Y DEL CONSEJO DE 27 DE ABRIL DE 2016, en consecuencia,
    </p>
    <strong>SOLICITO</strong>
    <p>
        Que se me facilite el derecho de acceso y toda la información sobre mi persona contenida en el fichero, en el
        plazo de un mes desde la recepción de esta solicitud, y que se me notifique de forma escrita a la dirección
        arriba indicada.
    </p>
    <p>
        Que dicha información comprenda:
    </p>
    <ul>
        <li>
            Los datos sobre mi persona incluidos en el fichero
        </li>
        <li>
            Información sobre el origen de los datos
        </li>
        <li>
            Los cesionarios de los datos
        </li>
        <li>
            La especificación de los concretos usos y finalidades para los que se almacenaron los datos.
        </li>
    </ul>
    <p>
        En <strong>{{ $city }}</strong>, a <strong>{{ $date }}</strong>
    </p>

    <div class="firma">
        Firma del interesado
    </div>
</body>

</html>
