import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

const customtheme = definePreset(Aura, {
    semantic: {
        primary: {
            50: '{blue.50}',
            100: '{blue.100}',
            200: '{blue.200}',
            300: '{blue.300}',
            400: '{blue.400}',
            500: '{blue.500}',
            600: '{blue.600}',
            700: '{blue.700}',
            800: '{blue.800}',
            900: '{blue.900}',
            950: '{blue.950}'
        }
    },
    colorScheme: {
        light: {
            surface: {
                0: '#ffffff', // Blanco para el modo claro
                50: '{teal.50}',
                100: '{teal.100}',
                200: '{teal.200}',
                300: '{teal.300}',
                400: '{teal.400}',
                500: '{teal.500}',
                600: '{teal.600}',
                700: '{teal.700}',
                800: '{teal.800}',
                900: '{teal.900}',
                950: '{teal.950}'
            }
        },
        dark: {
            surface: {
                // CAMBIO AQUÍ: ¡Define un color oscuro para surface.0 en modo oscuro!
                // Por ejemplo, puedes usar un valor de la paleta 'slate' que ya tienes definida.
                0: '{slate.900}', // Un gris muy oscuro para el modo oscuro, de la paleta 'slate'
                50: '{slate.50}',
                100: '{slate.100}',
                200: '{slate.200}',
                300: '{slate.300}',
                400: '{slate.400}',
                500: '{slate.500}',
                600: '{slate.600}',
                700: '{slate.700}',
                800: '{slate.800}',
                900: '{slate.900}',
                950: '{slate.950}'
            }
        }
    }
});

export default customtheme;