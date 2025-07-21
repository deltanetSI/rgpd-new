<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Cláusula de Protección de Datos para Empleados</title>
    <style>
        body { font-family: Arial, sans-serif; font-size: 14px; }
        .firma { margin-top: 60px; }
    </style>
</head>
<body>
    <h2 style="text-align:center;">CLÁUSULA PARA EMPLEADOS EN MATERIA DE PROTECCIÓN DE DATOS PERSONALES</h2>
    <p>
        Yo, Don/Doña <strong>{{ $employee_name }}</strong><br>
        Con DNI nº <strong>{{ $employee_dni }}</strong>
    </p>
    <p>
        De conformidad a lo dispuesto en el Reglamento (UE) 2016/679 de 27 de abril, relativo a la protección de las personas físicas en lo que respecta al tratamiento de datos personales y a la libre circulación de estos datos (RGPD) y conforme a la Ley Orgánica 3/2018 de 5 de diciembre, relativa a la protección de datos personales y garantía de los derechos digitales (LOPDGDD), como empleado y usuario autorizado por <strong>{{ $company_name }}</strong>, con domicilio social situado en <strong>{{ $company_address }}</strong>, en adelante, la EMPRESA, tengo conocimiento que los datos personales aportados para la formalización de la relación laboral, o contractual están integrados en un fichero titularidad de la empresa.
    </p>
    <p>
        Para realizar el tratamiento de datos de carácter personal, para los cuales, la EMPRESA, sea responsable o encargado de tratamiento, manifiesto que:
    </p>
    <ul>
        <li>La recogida y tratamiento de datos de carácter personal, tiene las siguientes finalidades: gestión de recursos humanos, gestión de la prevención de riesgos laborales y gestión y control de servicios de vigilancia de la salud.</li>
        <li>He sido informado de la política de seguridad de la EMPRESA y de las disposiciones legales que deben observarse según la legislación vigente en el tratamiento de datos de carácter personal.</li>
        <li>Me comprometo a no revelar a ninguna persona perteneciente a la EMPRESA o ajena a ella mis datos de acceso (nombres de usuario y contraseñas) a los sistemas informáticos que utilizo normalmente para desarrollar mi trabajo. Si modifico mis contraseñas de acceso, me comprometo a observar las directrices de seguridad que a este respecto se han incorporado a la norma de seguridad de la EMPRESA.</li>
        <li>Me comprometo a no revelar datos personales objeto de tratamiento en el desarrollo de mi actividad laboral a terceras personas ajenas a la EMPRESA sin solicitar el previo consentimiento a mis superiores.</li>
        <li>Observo el deber del secreto profesional en el tratamiento de la información, quedando obligado a guardar sigilo profesional y absoluta discreción respecto de la información que pueda conocer directa o indirectamente en el desarrollo de mi actividad profesional en el seno de la EMPRESA, absteniéndome de realizar acciones, derivar o transmitir cualquier información que pueda perjudicar los intereses de la EMPRESA tanto materiales como morales o de imagen o que pueda suponer un incumplimiento de la normativa española y europea en protección de datos. Soy consciente de que el incumplimiento de estas obligaciones supondrá la transgresión de la buena fe contractual en mi relación con la EMPRESA, además de estar tipificada como delito en los artículos 197 a 199 del Código Penal.</li>
        <li>He sido informado de que, con la finalidad de proteger adecuadamente el Sistema de Información, se han implantado unas normas de seguridad, que regulan el uso de los medios informáticos por parte del empleado. Por tanto, siguiendo la doctrina expuesta en los Fundamentos de Derecho de la Sentencia del Tribunal Supremo del 26 de septiembre de 2007, <strong>{{ $company_name }}</strong>, regula la utilización de sus medios informáticos no permitiendo la utilización de dichos medios, propiedad de la EMPRESA, para finalidades personales ajenas a las tareas profesionales. Los equipos de trabajo serán auditados regularmente con la finalidad de garantizar la observación de las normas antes citadas.</li>
        <li>He sido informado de que los datos objeto de tratamiento no serán cedidos o comunicados a terceros, salvo en los supuestos necesarios para el cumplimiento de las finalidades previstas. De esta manera, los datos personales serán cedidos, en los casos siguientes:
            <ul>
                <li>la información fiscal y laboral será comunicada a los Organismos de la Seguridad Social, la Administración Tributaria, los Servicios Públicos de empleo estatal, la Autoridad laboral, así como en los supuestos previstos y fijados en la normativa aplicable.</li>
                <li>la información necesaria a las Compañías Aseguradoras para la contratación de seguros de vida, de accidentes y de salud, donde usted sea beneficiario.</li>
                <li>la información necesaria para los cursos de formación y para sus docentes, en el caso de que usted sea seleccionado para asistir a estos cursos.</li>
            </ul>
        </li>
        {{-- esto la videovigilancia sera una clausula opcional lo dejamos comentado por ahora --}}
        {{-- <li>La EMPRESA, tiene un sistema de videovigilancia y declaro que he sido informado:
            <ul>
                <li>Que los datos personales se incorporan al fichero denominado “videovigilancia” y serán tratados con la finalidad de seguridad a través de un sistema de videovigilancia.</li>
                <li>Que el destinatario de sus datos personales es la empresa de seguridad.</li>
            </ul>
        </li> --}}
        <li>Me comprometo a comunicar los cambios de mis datos personales para tenerlos actualizados y consiento expresamente el tratamiento de mis datos para los fines establecidos.</li>
        <li>Asimismo, conozco que puedo ejercitar los derechos de acceso, rectificación, supresión, oposición, limitación del tratamiento y derecho al olvido. Para ello, deberé enviar un correo electrónico, adjuntando una fotocopia de mi DNI, a la siguiente dirección: <strong>{{ $company_email }}</strong> solicitando el ejercicio del derecho o derechos, que la normativa vigente en materia de protección de datos, me reconoce.</li>
    </ul>
    <p>
        Por todo ello, para que conste a los efectos oportunos, firmo la presente, para acreditar la recepción de la información que este documento contiene.
    </p>
    <p>
        En <strong>{{ $company_city }}</strong>, a <strong>{{ $employee_date }}</strong>.
    </p>
    <div class="firma">
        Firma del empleado.
    </div>
</body>
</html>
