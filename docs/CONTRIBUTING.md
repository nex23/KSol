# Guía para Contribuidores - KSol

¡Gracias por tu interés en contribuir a KSol! Esta guía te ayudará a entender cómo contribuir de manera efectiva.

## Código de Conducta

Todos los contribuidores deben seguir nuestro código de conducta:

- Sé respetuoso con otros contribuidores
- Proporciona feedback constructivo
- Reporta comportamiento inapropiado a los mantenedores
- Enfócate en lo que es mejor para la comunidad

## Cómo Contribuir

### 1. Reportar Bugs

Si encuentras un bug, abre un issue con:

- **Título claro:** Describe el problema en una línea
- **Descripción detallada:** Qué esperabas vs. qué sucedió
- **Pasos para reproducir:** Instrucciones claras para reproducir
- **Entorno:** Sistema operativo, versión de Node, etc.
- **Screenshots:** Si es relevante

**Plantilla:**

```markdown
## Descripción del Bug
Descripción clara del problema.

## Pasos para Reproducir
1. Ir a...
2. Hacer clic en...
3. Ver error...

## Comportamiento Esperado
Debería...

## Comportamiento Actual
Sucede...

## Entorno
- OS: macOS 14.0
- Node: 20.0.0
- Browser: Chrome 120
```

### 2. Sugerir Mejoras

Para sugerir una mejora, abre un issue con:

- **Descripción clara:** Qué quieres mejorar
- **Motivación:** Por qué es importante
- **Ejemplos:** Cómo debería funcionar

**Plantilla:**

```markdown
## Descripción de la Mejora
Descripción clara de la mejora sugerida.

## Motivación
Por qué esta mejora sería útil.

## Ejemplos
Cómo debería funcionar.
```

### 3. Enviar Pull Requests

#### Preparación

1. **Fork el repositorio:**
   ```bash
   git clone https://github.com/tu-usuario/ksol.git
   cd ksol
   ```

2. **Crear rama de feature:**
   ```bash
   git checkout -b feature/descripcion-corta
   ```

3. **Instalar dependencias:**
   ```bash
   pnpm install
   ```

4. **Crear rama de desarrollo:**
   ```bash
   git checkout -b develop
   ```

#### Desarrollo

1. **Hacer cambios:**
   - Edita los archivos necesarios
   - Sigue las convenciones de código
   - Escribe tests para nuevas funcionalidades

2. **Verificar cambios:**
   ```bash
   # Ejecutar linter
   pnpm check

   # Ejecutar tests
   pnpm test

   # Compilar
   pnpm build
   ```

3. **Commit con mensajes claros:**
   ```bash
   git add .
   git commit -m "feat: agregar nueva funcionalidad"
   ```

#### Enviar PR

1. **Push a tu fork:**
   ```bash
   git push origin feature/descripcion-corta
   ```

2. **Crear Pull Request:**
   - Ve a GitHub
   - Haz clic en "New Pull Request"
   - Selecciona `develop` como rama base
   - Completa la plantilla de PR

**Plantilla de PR:**

```markdown
## Descripción
Descripción clara de los cambios.

## Tipo de Cambio
- [ ] Bug fix
- [ ] Nueva funcionalidad
- [ ] Mejora
- [ ] Breaking change

## Cambios Relacionados
Relacionado con #123

## Cómo Probar
Pasos para probar los cambios.

## Checklist
- [ ] He actualizado la documentación
- [ ] He agregado tests
- [ ] Los tests pasan
- [ ] No hay warnings de linter
```

## Convenciones de Código

### Commits

Usa el formato de Conventional Commits:

```
<tipo>(<alcance>): <descripción>

<cuerpo opcional>

<pie opcional>
```

**Tipos:**
- `feat:` Nueva funcionalidad
- `fix:` Corrección de bug
- `docs:` Cambios en documentación
- `style:` Cambios de formato (sin cambiar código)
- `refactor:` Refactorización de código
- `perf:` Mejora de rendimiento
- `test:` Agregar o actualizar tests
- `chore:` Cambios en build, dependencias, etc.

**Ejemplos:**

```bash
git commit -m "feat(kermesses): agregar filtro por estado"
git commit -m "fix(sales): corregir cálculo de total"
git commit -m "docs: actualizar guía de instalación"
```

### Nombres de Ramas

```
feature/descripcion-corta
bugfix/descripcion-corta
docs/descripcion-corta
refactor/descripcion-corta
```

### Nombres de Archivos

- **Componentes React:** PascalCase
  ```
  KermesseDetail.tsx
  DonateIngredient.tsx
  ```

- **Utilidades:** camelCase
  ```
  formatCurrency.ts
  validateEmail.ts
  ```

- **Constantes:** UPPER_SNAKE_CASE
  ```
  KERMESSE_STATUS.ts
  API_ENDPOINTS.ts
  ```

### Estilos de Código

#### TypeScript

```typescript
// ✅ Bueno
interface KermesseData {
  id: number;
  title: string;
  beneficiaryName: string;
}

const getKermesseById = async (id: number): Promise<KermesseData | null> => {
  // ...
};

// ❌ Malo
const getKermesseById = async (id) => {
  // ...
};
```

#### React

```typescript
// ✅ Bueno
export default function KermesseDetail() {
  const { data: kermesse } = trpc.kermesses.getById.useQuery({ id: 1 });

  if (!kermesse) return <LoadingState />;

  return (
    <div>
      <h1>{kermesse.title}</h1>
    </div>
  );
}

// ❌ Malo
export default function KermesseDetail() {
  const kermesse = useQuery(...);
  return kermesse ? <div>{kermesse.title}</div> : null;
}
```

#### Tailwind CSS

```typescript
// ✅ Bueno
<div className="flex items-center justify-between gap-4 p-4 bg-white rounded-lg shadow">
  <h2 className="text-lg font-semibold text-slate-900">Título</h2>
</div>

// ❌ Malo
<div style={{ display: 'flex', justifyContent: 'space-between' }}>
  <h2 style={{ fontSize: '18px', fontWeight: 'bold' }}>Título</h2>
</div>
```

### Estructura de Componentes

```typescript
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/trpc';
import { formatCurrency } from '@/lib/utils';

// Props interface
interface ComponentProps {
  id: number;
  onSuccess?: () => void;
}

// Componente
export default function MyComponent({ id, onSuccess }: ComponentProps) {
  // Hooks
  const [isOpen, setIsOpen] = useState(false);
  const { data, isLoading } = trpc.router.procedure.useQuery({ id });
  const mutation = trpc.router.procedure.useMutation({
    onSuccess: () => {
      onSuccess?.();
    },
  });

  // Handlers
  const handleSubmit = () => {
    mutation.mutate({ /* data */ });
  };

  // Render
  if (isLoading) return <LoadingState />;

  return (
    <div>
      <Button onClick={handleSubmit}>Enviar</Button>
    </div>
  );
}
```

## Testing

### Escribir Tests

Usa Vitest para pruebas unitarias:

```typescript
import { describe, it, expect } from 'vitest';
import { formatCurrency } from '@/lib/utils';

describe('formatCurrency', () => {
  it('debe formatear centavos a bolivianos', () => {
    expect(formatCurrency(1500)).toBe('15.00 bs');
  });

  it('debe manejar cero', () => {
    expect(formatCurrency(0)).toBe('0.00 bs');
  });
});
```

### Ejecutar Tests

```bash
# Ejecutar todos los tests
pnpm test

# Ejecutar tests en watch mode
pnpm test:watch

# Ejecutar tests con coverage
pnpm test:coverage
```

## Documentación

### Actualizar Documentación

Cuando hagas cambios significativos:

1. **Actualiza README.md** si es necesario
2. **Actualiza ARCHITECTURE.md** si cambias la arquitectura
3. **Actualiza API.md** si cambias las APIs
4. **Actualiza DATABASE.md** si cambias el esquema
5. **Agrega comentarios** en el código complejo

### Formato de Documentación

Usa Markdown con:

- Títulos jerárquicos (H1, H2, H3)
- Listas y tablas
- Bloques de código con lenguaje
- Enlaces internos
- Ejemplos claros

```markdown
# Título Principal

## Subtítulo

Párrafo explicativo.

### Sección

Contenido de la sección.

**Importante:** Texto destacado.

```typescript
// Ejemplo de código
const x = 5;
```

| Columna 1 | Columna 2 |
|-----------|-----------|
| Valor 1   | Valor 2   |
```

## Proceso de Revisión

1. **Revisión automática:**
   - Linter (TypeScript)
   - Tests
   - Build

2. **Revisión manual:**
   - Mantenedores revisan el código
   - Solicitan cambios si es necesario
   - Aprueban cuando está listo

3. **Merge:**
   - PR se merge a `develop`
   - Se agrega a changelog
   - Se cierra el issue relacionado

## Estándares de Calidad

### Cobertura de Tests

- Mínimo 80% de cobertura
- Todas las funciones públicas deben tener tests
- Casos edge deben estar cubiertos

### Rendimiento

- No agregar dependencias innecesarias
- Optimizar queries de base de datos
- Usar lazy loading cuando sea apropiado

### Seguridad

- No commit de secretos
- Validar todas las entradas
- Usar HTTPS en producción
- Escapar outputs HTML

### Accesibilidad

- Usar semántica HTML correcta
- Agregar atributos ARIA cuando sea necesario
- Asegurar contraste de colores
- Soportar navegación por teclado

## Roadmap

El roadmap del proyecto está disponible en [README.md](../README.md#roadmap).

Para contribuir a funcionalidades del roadmap:

1. Comenta en el issue del roadmap
2. Discute tu enfoque
3. Envía PR cuando esté listo

## Preguntas Frecuentes

### ¿Cómo empiezo?

1. Lee [SETUP.md](./SETUP.md)
2. Instala dependencias
3. Crea una rama de feature
4. Haz cambios
5. Envía PR

### ¿Cuánto tiempo tarda la revisión?

Normalmente 2-3 días. Los mantenedores revisarán cuando tengan tiempo disponible.

### ¿Puedo trabajar en una funcionalidad del roadmap?

¡Sí! Comenta en el issue primero para evitar trabajo duplicado.

### ¿Qué si mi PR es rechazado?

No es personal. Los mantenedores proporcionarán feedback constructivo. Puedes:

1. Hacer los cambios sugeridos
2. Discutir si no estás de acuerdo
3. Cerrar el PR si prefieres

## Reconocimiento

Todos los contribuidores serán reconocidos en:

- Archivo CONTRIBUTORS.md
- Página de créditos en el sitio web
- Release notes

## Contacto

¿Preguntas? Abre un issue o contacta a los mantenedores.

---

**Última actualización:** Noviembre 2025

¡Gracias por contribuir a KSol! 🎉
