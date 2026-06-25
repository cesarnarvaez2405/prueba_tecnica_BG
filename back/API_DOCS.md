# API Backend - Prueba Técnica BG

## Configuración General

- **Base URL:** `http://{host}:{port}/prueba-tecnica-bg/server`
- **Puerto por defecto:** `1010`
- **Swagger UI:** `http://{host}:{port}/docs`
- **CORS:** Habilitado

---

## Endpoints

### 1. DOCS (`/docs`)

#### GET `/docs`
Lista todos los archivos en S3 cruzados con la tabla de resultados de procesamiento.

**Response:**
```json
[
  {
    "archivoActual": "CuentaDeposito_20260625.txt",
    "archivoOrigen": "PHO_CD_DES_20260625.txt",
    "nombreTransformado": "CuentaDeposito_20260625.txt",
    "estado": "TRANSFORMADO",
    "batchId": "uuid-del-lote",
    "ruleId": "uuid-de-la-regla",
    "errorMessage": "-",
    "processedAt": "2026-06-25T10:00:00.000Z"
  },
  {
    "archivoActual": "ArchivoSinMapeo_001.txt",
    "archivoOrigen": "-",
    "nombreTransformado": "-",
    "estado": "-",
    "batchId": "-",
    "ruleId": "-",
    "errorMessage": "-",
    "processedAt": "-"
  }
]
```

#### POST `/docs/generar-prueba`
Genera 10 archivos de prueba y los sube a S3. No requiere body.

**Response:**
```json
{
  "archivosGenerados": 10,
  "archivos": [
    "PHO_CD_DES_20260625.txt",
    "PHO_CD_DES_20260625.csv",
    "PHO_SV_20260625.txt",
    "..."
  ],
  "resultados": [...]
}
```

#### POST `/docs/upload`
Sube un archivo a S3.

**Request:** `multipart/form-data`
- `file`: archivo binario

#### POST `/docs/upload-masivo`
Sube múltiples archivos a S3.

**Request:** `multipart/form-data`
- `files`: array de archivos binarios (máx 20)

**Response:**
```json
{
  "archivosSubidos": 5,
  "resultados": [...]
}
```

---

### 2. RULES (`/rules`)

#### POST `/rules`
Crea una nueva regla de mapeo.

**Request Body:**
```json
{
  "pattern": "PHO_CD_DES_*",
  "dateFormat": "AAAAMMDD",
  "outTemplate": "CuentaDeposito",
  "priority": 1,
  "isActive": true
}
```

**Response:** Objeto Rule creado.

#### GET `/rules`
Obtiene todas las reglas activas.

**Query Params:**
- `includeInactive` (boolean, opcional, default: `false`): si es `true`, incluye las reglas inactivas.

**Response:**
```json
[
  {
    "id": "uuid",
    "pattern": "PHO_CD_DES_*",
    "dateFormat": "AAAAMMDD",
    "outTemplate": "CuentaDeposito",
    "priority": 1,
    "isActive": true,
    "fechaCreacion": "2026-06-25T...",
    "fechaModificacion": "2026-06-25T..."
  }
]
```

#### GET `/rules/:id`
Obtiene una regla por ID.

#### PATCH `/rules/:id`
Actualiza una regla. Genera versionamiento histórico: desactiva la regla actual y crea una nueva con los cambios.

**Request Body:** Cualquier campo de CreateRuleDto (todos opcionales).

#### DELETE `/rules/:id`
Borrado lógico. Marca la regla como `isActive: false`.

---

### 3. PROCESSOR (`/processor`)

#### POST `/processor/start`
Inicia el procesamiento de archivos. No requiere body. Internamente:
1. Obtiene la lista de archivos de S3
2. Obtiene las reglas activas de la BD
3. Envía un mensaje a SQS con `{ batchId, fileKeys, rules }`

**Response:**
```json
{
  "batchId": "550e8400-e29b-41d4-a716-446655440000",
  "archivosEnviados": 10,
  "estado": "ENVIADO_A_SQS"
}
```

#### SSE `/processor/status/:batchId`
**Server-Sent Events.** Abre una conexión SSE que se mantiene abierta hasta que el procesamiento del `batchId` termine. Cuando la Lambda termina y guarda los resultados, este endpoint envía un evento con el resumen y cierra la conexión.

**Cómo conectar desde el front:**
```typescript
const batchId = "550e8400-e29b-41d4-a716-446655440000";
const eventSource = new EventSource(
  `http://localhost:1010/prueba-tecnica-bg/server/processor/status/${batchId}`
);

eventSource.onmessage = (event) => {
  const resumen = JSON.parse(event.data);
  // resumen = { batchId, total, transformados, errores, noMapeados }
  eventSource.close();
};

eventSource.onerror = (error) => {
  eventSource.close();
};
```

**Evento recibido:**
```json
{
  "batchId": "550e8400-e29b-41d4-a716-446655440000",
  "total": 10,
  "transformados": 8,
  "errores": 0,
  "noMapeados": 2
}
```

---

### 4. RESULTS (`/results`)

#### POST `/results`
Guarda los resultados de procesamiento. Este endpoint es llamado por la Lambda, no por el front.

**Request Body:**
```json
{
  "batchId": "uuid-del-lote",
  "resultados": [
    {
      "archivoOrigen": "PHO_CD_DES_20260625.txt",
      "nombreTransformado": "CuentaDeposito_20260625.txt",
      "estado": "TRANSFORMADO",
      "ruleId": "uuid-de-la-regla"
    },
    {
      "archivoOrigen": "ArchivoSinMapeo.txt",
      "estado": "NO_MAPEADO"
    }
  ]
}
```

#### GET `/results?batchId=uuid`
Obtiene los resultados de un lote por `batchId`. Incluye la relación con la regla aplicada.

**Query Params:**
- `batchId` (UUID, requerido)

**Response:**
```json
[
  {
    "id": "uuid",
    "batchId": "uuid-del-lote",
    "archivoOrigen": "PHO_CD_DES_20260625.txt",
    "nombreTransformado": "CuentaDeposito_20260625.txt",
    "estado": "TRANSFORMADO",
    "ruleId": "uuid-de-la-regla",
    "errorMessage": null,
    "processedAt": "2026-06-25T...",
    "rule": {
      "id": "uuid",
      "pattern": "PHO_CD_DES_*",
      "dateFormat": "AAAAMMDD",
      "outTemplate": "CuentaDeposito",
      "priority": 1,
      "isActive": true
    }
  }
]
```

#### GET `/results/summary?batchId=uuid`
Obtiene el resumen de un lote procesado.

**Query Params:**
- `batchId` (UUID, requerido)

**Response:**
```json
{
  "batchId": "uuid-del-lote",
  "total": 10,
  "transformados": 8,
  "errores": 0,
  "noMapeados": 2
}
```

---

## Estados posibles de procesamiento

| Estado | Descripción |
|--------|-------------|
| `TRANSFORMADO` | El archivo fue renombrado exitosamente según la regla |
| `NO_MAPEADO` | El archivo no coincidió con ninguna regla activa |
| `ERROR` | Ocurrió un error al procesar el archivo |

---

## Flujo completo recomendado para el Front

### 1. Gestión de reglas
- Crear reglas con `POST /rules`
- Listar reglas con `GET /rules`
- Editar/eliminar con `PATCH /rules/:id` y `DELETE /rules/:id`

### 2. Carga de archivos
- Subir archivos con `POST /docs/upload-masivo` o `POST /docs/upload`
- O generar archivos de prueba con `POST /docs/generar-prueba`
- Listar archivos con `GET /docs` (muestra estado de procesamiento)

### 3. Procesamiento
```
1. POST /processor/start
   → Recibir { batchId }

2. Abrir SSE: GET /processor/status/{batchId}
   → Esperar evento con el resumen

3. Cuando llega el evento:
   → Mostrar resumen (total, transformados, errores, noMapeados)
   → Cerrar EventSource

4. Consultar detalle: GET /results?batchId={batchId}
   → Mostrar tabla con archivo origen, nombre transformado, estado, regla aplicada
```

### 4. Consulta posterior
- `GET /docs` para ver todos los archivos y su estado
- `GET /results?batchId=uuid` para ver el detalle de un lote
- `GET /results/summary?batchId=uuid` para ver solo el resumen

---

## Enums

### DateFormatEnum
```typescript
enum DateFormatEnum {
  AAAAMMDD = 'AAAAMMDD'
}
```

---

## Validación
El backend tiene validación global habilitada:
- Propiedades desconocidas en el body son rechazadas con error 400
- Los campos requeridos que falten generan error 400
- Los UUIDs inválidos generan error 400
