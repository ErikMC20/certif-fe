---
category: Component
---

# Componente GuestsDialog

- ## Componente para asignar usuarios

::: tip
Su uso se realizo para obtener los participantes de una reunion
:::

## Uso

```js
import GuestsDialog from 'src/components/Activities/Dialogs/MeetActivityDialog.vue//Dialogs/GuestsDialog.vue';
```

## Types
```ts
SearchUser from 'src/components/types';
TabsModule 'contacts' | 'users' | 'leads' | 'prospects';
```

## Props

```ts
v-model // abrir el dialog
v-model:selected // manejar dinamicamente el array de usuarios
firstTab (optional) // el primer tab en mostrar enter TabsModule
tabsFiltered (optional) // los tabs que se filtraran
```


```html
<!-- Html example Basic-->
<GuestsDialog
    v-model="addGuestDialog"
    v-model:selected="guestsSelected"
    @delete-guest="removeInviteeFromReminders"
  />

<!-- Html example Complete-->
<GuestsDialog
    v-model="addGuestDialog"
    first-tab="contacts"
    :tabs-filtered="['contacts', 'users']"
    v-model:selected="guestsSelected"
    @delete-guest="removeInviteeFromReminders"
  />
```

## Dependencies
- External [VueUse](https://vueuse.org/core/useasyncstate/).

## Functions
- No tiene
