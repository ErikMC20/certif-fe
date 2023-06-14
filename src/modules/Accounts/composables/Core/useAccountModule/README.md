---
category: Global
---

# Composables: useAccountModule

- ## El composable crea funciones de logica para los componentes del modulo de cuentas


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
