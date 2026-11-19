// src/utils/ionValue.ts
// En Ionic 7.2.x el evento ionInput NO trae `detail.value` tipado,
// así que el valor se lee desde el elemento que disparó el evento.
export const inputValue = (e: Event): string =>
  String((e.target as HTMLIonInputElement).value ?? '');
