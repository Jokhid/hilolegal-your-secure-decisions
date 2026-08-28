# CONTENT_REVIEW.md

Afirmaciones legales, financieras o comerciales que necesitan validación humana (de José Carlos o Verónica, según el caso) antes de darlas por buenas. No he corregido ninguna de estas — solo las señalo, tal como pide el proceso: no modificar hechos legales o financieros por intuición.

Cada entrada: página/archivo, frase exacta, por qué está aquí, y qué decidir.

---

## 1. ~~"Rentabilidad con garantías y beneficios fiscales."~~ — RESUELTO

Eliminada al reestructurar `josecarlos.tsx` (petición explícita del cliente, brief "REESTRUCTURACIÓN COMPLETA DE LA PÁGINA DE JOSÉ CARLOS", sección 5). La sección "Pensión, ahorro e inversión" donde vivía esta frase ya no existe como catálogo de producto; el contenido de ahorro/inversión ahora vive dentro de "Planificar" sin prometer rentabilidad ni fiscalidad genérica.

---

## 2. ~~"Gracias a José Carlos conseguimos financiación al 100% para nuestra primera vivienda."~~ — RESUELTO

Los 3 testimonios fabricados de José Carlos (Ana M. / Marcos R. / Familia López) se **eliminaron** — no eran reseñas reales. Las 2 reseñas reales de Google que pasaste (Cristian Llopis y SRG) están publicadas en la página de Verónica, con `Review` en el JSON-LD. Ninguna reseña real específica de José Carlos existe todavía — su sección de testimonios queda sin renderizar hasta que existan.

---

## 3. "Seguros de ahorro con rentabilidad garantizada (como el SIALP), hasta el 110 % del capital aportado."

**Dónde**: `src/lib/blogPosts.ts` — post `dinero-parado-en-el-banco`.

**Por qué**: cifra concreta y verificable (110 % del capital aportado) sobre un producto financiero real. Si la normativa o las condiciones del SIALP cambian de aquí a que alguien lea el artículo, la cifra quedaría desactualizada.

**Qué decidir**: confirmar que el 110 % sigue siendo correcto en la fecha de publicación/lectura, o suavizar a algo como "hasta un porcentaje del capital aportado, según condiciones vigentes".

---

## 4. "Garantiza el 85 % del valor más alto alcanzado por la inversión" / "Con hasta el 75 % de exposición a renta variable, ofrece protección del capital y potencial de rentabilidad por encima de la inflación."

**Dónde**: `src/lib/blogPosts.ts` — post `sialp-2026-ahorro-sin-impuestos`, sección sobre la tecnología "iGG (individualized Growing Guarantee)".

**Por qué**: describe el mecanismo exacto de garantía de un producto financiero concreto (aparentemente de Nationale-Nederlanden, dado el contexto de otro post). Son cifras y mecanismos de producto muy específicos — exactamente el tipo de afirmación que solo puede confirmar quien tiene acceso a la ficha del producto vigente, no algo que yo pueda verificar.

**Qué decidir**: confirmar contra la documentación oficial del producto que el 85 % y el 75 % siguen vigentes y descritos correctamente.

---

## 5. Proyección de ahorro a 30 años ("aproximadamente 166.000 €")

**Dónde**: `src/lib/blogPosts.ts` — post `prevision-financiera-vision`.

**Por qué**: es un cálculo de interés compuesto con una rentabilidad media del 5 % anual **explícitamente asumida** (no prometida como garantizada) — probablemente está bien tal como está, ya que el artículo declara la hipótesis. Lo incluyo solo porque es el tipo de cifra concreta que, sacada de contexto (por ejemplo, en una captura de pantalla compartida en redes), podría leerse como una promesa de rentabilidad. Prioridad baja.

**Qué decidir**: opcional — si quieres, se puede reforzar la frase de la hipótesis ("rentabilidad media del 5 % anual, sin garantía") para que quede inequívoco incluso fuera de contexto.

---

## 6. Afirmaciones de procedimiento en la nueva página de Administración de Fincas

**Dónde**: `src/routes/administracion-fincas.index.tsx` — FAQ y JSON-LD (`FAQPage`).

**Por qué**: dos respuestas describen procedimientos regulados por la Ley de Propiedad Horizontal sin citar artículos ni plazos concretos (a propósito, para no fabricar datos que no puedo verificar), pero sí afirman cómo funciona el proceso en términos generales:
- "¿Cómo se gestiona el cambio de administrador?" — describe una coordinación con el administrador saliente para el traspaso de documentación y cuentas.
- "Ya tenemos administrador, ¿podemos cambiar en cualquier momento?" — afirma que el cambio se acuerda en junta de propietarios, sin especificar mayorías ni plazos de convocatoria.
- "¿Qué pasa con los propietarios que no pagan sus cuotas?" — describe un "protocolo de seguimiento y reclamación ordenada" sin detallar el procedimiento legal de reclamación de impagos (monitorio, recargos, etc.).

**Qué decidir**: confirmar que estas descripciones generales son correctas y no prometen nada que no se pueda cumplir en la práctica. Si en algún momento se quiere citar una mayoría, plazo o artículo concreto de la LPH, debe confirmarse contra la normativa vigente antes de publicarlo — no lo he hecho aquí precisamente para evitar ese riesgo.

---

## 7. Reestructuración de `josecarlos.tsx` — claims corregidos y cifra de experiencia

**Dónde**: `src/routes/josecarlos.tsx` (reestructuración completa, brief "REESTRUCTURACIÓN COMPLETA DE LA PÁGINA DE JOSÉ CARLOS").

**Claims reescritos por instrucción explícita del cliente** (no son afirmaciones inventadas por mí — el propio brief pidió eliminar o suavizar este tipo de frases):
- "Comparo y negocio en tu nombre, no defender los intereses de un banco concreto" → ahora: "Trabajo como gestor en Nationale-Nederlanden, ING y ABANCA, lo que me permite comparar entre estas tres entidades" (en la bio, en la sección Financiar, en Entidades y en el FAQ). Ya no se afirma que se negocia en nombre del cliente ni que se compara todo el mercado bancario.
- "No vendo productos. Ordeno decisiones" (título de la sección eliminada `Diagnosis`) → desaparece junto con el componente.

**Por qué están aquí igualmente**: aunque el cambio lo pidió el cliente, sigue siendo lenguaje sobre condiciones/relación bancaria — si en el futuro se quiere volver a un tono más comercial, debe revisarse con el mismo cuidado.

**Cifra "más de 25 años" de experiencia** (subtítulo de la sección "Sobre mí"): viene dada literalmente por José Carlos en su propio brief, no la he verificado de forma independiente (no tengo forma de hacerlo). Si el número no es exacto, debe corregirlo él.

**Qué decidir**: nada pendiente salvo confirmar la cifra de "25 años" si no es exacta.

---

## Cómo usar este documento

Cuando confirmes o corrijas cada punto, dímelo y lo actualizo en el código. No voy a tocar ninguna de estas frases por mi cuenta — son afirmaciones de producto/negocio, no de diseño o código.
