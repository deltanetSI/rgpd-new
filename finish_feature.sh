#!/bin/bash

# Este script sube los cambios de la feature, los fusiona en 'dev' y luego borra la rama de feature.
#para usar este script , hay que estar en la carpeta del proyecto y hacer ./finish_feature.sh

# Colores para la salida en consola
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}### Finalizando Feature y Fusionando a 'dev' ###${NC}"

# 1. Obtener el nombre de la rama actual
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

if [[ "$CURRENT_BRANCH" == "dev" || "$CURRENT_BRANCH" == "main" ]]; then
    echo -e "${RED}Error: No puedes ejecutar este script directamente desde la rama '${CURRENT_BRANCH}'.${NC}"
    echo -e "${RED}Debes estar en tu rama de feature (ej. 'feature/mi-nueva-feature').${NC}"
    exit 1
fi

if [[ "$CURRENT_BRANCH" != feature/* ]]; then
    echo -e "${YELLOW}Advertencia: La rama actual '${CURRENT_BRANCH}' no sigue la convención 'feature/*'.${NC}"
    read -p "¿Continuar de todos modos? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${RED}Operación cancelada.${NC}"
        exit 1
    fi
fi

echo -e "${GREEN}Rama actual: ${CURRENT_BRANCH}${NC}"

# 2. Asegurarse de que no hay cambios pendientes sin commit
if ! git diff-index --quiet HEAD --; then
    echo -e "${RED}Error: Tienes cambios sin commit en tu rama actual.${NC}"
    echo -e "${RED}Por favor, haz commit o stash de tus cambios antes de ejecutar este script.${NC}"
    exit 1
fi

# 3. Subir la rama de feature al remoto (por si acaso)
echo -e "${GREEN}Subiendo la rama '${CURRENT_BRANCH}' al repositorio remoto...${NC}"
git push origin "$CURRENT_BRANCH"
if [ $? -ne 0 ]; then
    echo -e "${RED}Error: No se pudo subir la rama '${CURRENT_BRANCH}' al remoto.${NC}"
    echo -e "${RED}Asegúrate de haberla creado con '-u' o de que no haya problemas de conexión.${NC}"
    exit 1
fi

# 4. Cambiar a la rama 'dev' y actualizarla
echo -e "${GREEN}Cambiando a la rama 'dev' y actualizándola...${NC}"
git switch dev
if [ $? -ne 0 ]; then
    echo -e "${RED}Error: No se pudo cambiar a la rama 'dev'.${NC}"
    exit 1
fi
git pull origin dev
if [ $? -ne 0 ]; then
    echo -e "${RED}Advertencia: Hubo un problema al hacer pull de 'dev'. Puede haber conflictos.${NC}"
fi

# 5. Fusionar la rama de feature en 'dev'
echo -e "${GREEN}Fusionando '${CURRENT_BRANCH}' en 'dev'...${NC}"
# Usamos --no-ff para siempre crear un merge commit, lo cual puede ser útil para ver la fusión
# en el historial, incluso si fuera un "fast-forward" merge.
git merge --no-ff "$CURRENT_BRANCH"
if [ $? -ne 0 ]; then
    echo -e "${RED}¡¡¡ATENCIÓN!!! Error al fusionar la rama '${CURRENT_BRANCH}' en 'dev'.${NC}"
    echo -e "${RED}Probablemente hay CONFLICTOS de fusión. Debes resolverlos manualmente.${NC}"
    echo -e "${RED}Después de resolver los conflictos, haz un 'git add .' y 'git commit' y luego 'git push origin dev'.${NC}"
    echo -e "${RED}No se borrará la rama de feature automáticamente si hay conflictos.${NC}"
    exit 1 # Sale con error para que el usuario resuelva
fi

# 6. Subir los cambios fusionados a 'dev'
echo -e "${GREEN}Subiendo los cambios fusionados a 'dev' remoto...${NC}"
git push origin dev
if [ $? -ne 0 ]; then
    echo -e "${RED}Error: No se pudieron subir los cambios a 'dev' remoto.${NC}"
    exit 1
fi

# 7. Borrar la rama de feature (local y remota)
echo -e "${GREEN}Borrando la rama local: ${CURRENT_BRANCH}${NC}"
git branch -d "$CURRENT_BRANCH"
if [ $? -ne 0 ]; then
    echo -e "${YELLOW}Advertencia: No se pudo borrar la rama local '${CURRENT_BRANCH}'. Puede que aún tenga cambios sin fusionar (usa -D para forzar).${NC}"
fi

echo -e "${GREEN}Borrando la rama remota: ${CURRENT_BRANCH}${NC}"
git push origin --delete "$CURRENT_BRANCH"
if [ $? -ne 0 ]; then
    echo -e "${YELLOW}Advertencia: No se pudo borrar la rama remota '${CURRENT_BRANCH}'.${NC}"
fi

echo -e "${GREEN}¡Feature '${CURRENT_BRANCH}' fusionada correctamente en 'dev' y ramas limpiadas!${NC}"

exit 0