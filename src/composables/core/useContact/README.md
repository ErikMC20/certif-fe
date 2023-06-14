---
category: Global
---

# Composables: useContact

## Creador de cuerpo de peticion correos y telefonos

> **Warning**
> NO TIENE QUE VER NADA CON EL MODULO DE CONTACTOS

::: tip
Usar para crear el cuerpo de las peticiones para crear, actualizar y borrar telefonos.
:::

## Usage

```js
import { useContact } from 'src/composables/core';

const { updateBodyContact, deletedBodyContact, createdBodyContact } =
  useContact(idUser, phones, emails);
```
