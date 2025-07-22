#!/bin/bash

# Este script crea una nueva rama de feature, asegurándose de que la rama 'dev' esté actualizada.
# para usarlo tienes que estar en la carpeta del proyecto y hacer ./start_feature.sh nombre-de-la-nueva-implementacion

# Colores para la salida en consola
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}### Iniciando nueva Feature ###${NC}"

# 1. Validar que se proporcionó un nombre para la rama
if [ -z "$1" ]; then
    echo -e "${RED}Error: Debes proporcionar un nombre para tu nueva rama de feature.${NC}"
    echo -e "${RED}Uso: ./start_feature.sh <nombre-de-la-feature>${NC}"
    exit 1
fi

FEATURE_NAME="feature/$1"

# 2. Asegurarse de estar en la rama 'dev'
echo -e "${GREEN}Cambiando a la rama 'dev'...${NC}"
git switch dev
if [ $? -ne 0 ]; then
    echo -e "${RED}Error: No se pudo cambiar a la rama 'dev'. Asegúrate de que existe.${NC}"
    exit 1
fi

# 3. Pull de los últimos cambios de 'dev'
echo -e "${GREEN}Actualizando la rama 'dev' con los últimos cambios remotos...${NC}"
git pull origin dev
if [ $? -ne 0 ]; then
    echo -e "${RED}Advertencia: Hubo un problema al hacer pull de 'dev'. Puede haber conflictos.${NC}"
fi

# 4. Crear y cambiar a la nueva rama de feature
echo -e "${GREEN}Creando y cambiando a la rama: ${FEATURE_NAME}${NC}"
git switch -c "$FEATURE_NAME"
if [ $? -ne 0 ]; then
    echo -e "${RED}Error: No se pudo crear la rama ${FEATURE_NAME}.${NC}"
    exit 1
fi

echo -e "${GREEN}¡Listo! Estás en la rama '${FEATURE_NAME}'. ¡Empieza a codificar!${NC}"
echo -e "${GREEN}Cuando termines, usa el script 'finish_feature.sh' para fusionar y limpiar.${NC}"

exit 0