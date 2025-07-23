<?php

namespace App\Enums;

/**
 * Enum para gestionar los tipos de plantillas de ejercicio de derechos.
 * Actúa como la "interfaz" centralizada que define cada plantilla.
 */
enum DataRightsTemplateType: string
{
    // --- Solicitudes Iniciales ---
    case EJERCICIO_ACCESO = 'ejercicio-acceso';
    case EJERCICIO_RECTIFICACION = 'ejercicio-rectificacion';
    case EJERCICIO_SUPRESION = 'ejercicio-supresion';
    case EJERCICIO_OPOSICION = 'ejercicio-oposicion';
    case EJERCICIO_LIMITACION = 'ejercicio-limitacion';

    // --- Respuestas Favorables ---
    case RESPUESTA_ACCESO = 'respuesta-acceso';
    case RESPUESTA_RECTIFICACION = 'respuesta-rectificacion';
    case RESPUESTA_SUPRESION = 'respuesta-supresion';
    case RESPUESTA_OPOSICION = 'respuesta-oposicion';
    case RESPUESTA_LIMITACION = 'respuesta-limitacion';

    // --- Respuestas Desfavorables ---
    case RESPUESTA_DESESTIMATORIA_ACCESO = 'respuesta-desestimatoria-acceso';
    case RESPUESTA_DESESTIMATORIA_RECTIFICACION = 'respuesta-desestimatoria-rectificacion';
    case RESPUESTA_DESESTIMATORIA_SUPRESION = 'respuesta-desestimatoria-supresion';
    case RESPUESTA_DESESTIMATORIA_OPOSICION = 'respuesta-desestimatoria-oposicion';
    case RESPUESTA_DESESTIMATORIA_LIMITACION = 'respuesta-desestimatoria-limitacion';

    // --- Otros ---
    case REQUERIMIENTO_SUBSANACION = 'requerimiento-subsanacion';

    /**
     * Devuelve la ruta a la vista Blade correspondiente, según la estructura de carpetas.
     */
    public function getViewPath(): string
    {
        return match ($this) {
            self::EJERCICIO_ACCESO, self::EJERCICIO_RECTIFICACION, self::EJERCICIO_SUPRESION, self::EJERCICIO_OPOSICION, self::EJERCICIO_LIMITACION => 'ejer-derechos.solicitudes.' . $this->value,
            self::RESPUESTA_ACCESO, self::RESPUESTA_RECTIFICACION, self::RESPUESTA_SUPRESION, self::RESPUESTA_OPOSICION, self::RESPUESTA_LIMITACION => 'ejer-derechos.respuestas-fav.' . $this->value,
            self::RESPUESTA_DESESTIMATORIA_ACCESO, self::RESPUESTA_DESESTIMATORIA_RECTIFICACION, self::RESPUESTA_DESESTIMATORIA_SUPRESION, self::RESPUESTA_DESESTIMATORIA_OPOSICION, self::RESPUESTA_DESESTIMATORIA_LIMITACION => 'ejer-derechos.respuestas-desfav.' . $this->value,
            self::REQUERIMIENTO_SUBSANACION => 'ejer-derechos.solicitud-documentacion.' . $this->value,
        };
    }

    /**
     * Devuelve el nombre del campo de la BBDD que almacena el contenido principal de la respuesta.
     */
    public function getRequiredContentField(): ?string
    {
        return match ($this) {
            // Respuestas Favorables
            self::RESPUESTA_ACCESO => 'information_provided',
            self::RESPUESTA_RECTIFICACION => 'rectified_data',
            self::RESPUESTA_SUPRESION => 'deleted_data',
            self::RESPUESTA_LIMITACION => 'limitation_applied',
            self::RESPUESTA_OPOSICION => null, // Oposición favorable no tiene campo de texto, solo es una notificación

            // Respuestas Desfavorables
            self::RESPUESTA_DESESTIMATORIA_ACCESO, self::RESPUESTA_DESESTIMATORIA_RECTIFICACION, self::RESPUESTA_DESESTIMATORIA_SUPRESION, self::RESPUESTA_DESESTIMATORIA_OPOSICION, self::RESPUESTA_DESESTIMATORIA_LIMITACION => 'denial_reasons',
            
            // Otros
            self::REQUERIMIENTO_SUBSANACION => 'required_documentation',

            // Las solicitudes iniciales no tienen campo de contenido de respuesta
            default => null,
        };
    }

    /**
     * Devuelve un array con todos los valores de los casos.
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    /**
     * Devuelve los tipos que son considerados una solicitud inicial.
     */
    public static function initialRequestTypes(): array
    {
        return [
            self::EJERCICIO_ACCESO->value,
            self::EJERCICIO_RECTIFICACION->value,
            self::EJERCICIO_SUPRESION->value,
            self::EJERCICIO_OPOSICION->value,
            self::EJERCICIO_LIMITACION->value,
        ];
    }
}