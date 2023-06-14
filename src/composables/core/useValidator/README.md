---
category: Global
---

# Composables: useValidator

- ## Creador de validaciones para los inputs compatible con quasar framework

::: tip
Usar para crear el cuerpo de las peticiones para crear, actualizar y borrar telefonos.
:::

## Usage

```js
import { useCRMValidator } from 'src/composables/core';

const { generateValidators } = useCRMValidator();
```

```html
<q-input
  autogrow
  outlined
  bottom-slots
  v-model="text"
  placeholder="Escriba su comentario"
  dense
  color="primary"
  ref="commentRef"
  :rules="generateValidators(['fieldRequired'])"
></q-input>
```

## List Validators

- ### fieldRequired
- ### validName
- ### validLastName
- ### validNITCI
