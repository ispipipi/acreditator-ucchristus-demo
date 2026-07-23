# Acreditator UC CHRISTUS — Demo estática

Demo navegable de la plataforma de gestión de acreditación para Red UC CHRISTUS.
Stack: HTML estático multi-archivo + Tailwind CDN + JS vanilla. Sin backend: estado en
localStorage (`acreditator-ucchristus-v1`). Datos 100% ficticios.

## Estructura
- `index.html` — login con 4 perfiles demo (admin / encargado / jefatura / auditor)
- `panel.html` — panel de control (KPIs vs umbral, semáforos, próximo paso)
- `punto.html` — detalle por punto con selector 2.1 / 2.2 / 3.1 / 4.3 (`?p=`)
- `ficha.html` — ficha de persona con vigencias calculadas
- `dotacion.html` — dotación unificada 3 fuentes · `importar.html` — wizard 3 pasos con validación
- `sincronizacion.html` — log de ingesta Academia · `alertas.html` — recordatorios
- `reportes.html` — reportería con columnas configurables
- `jefatura.html` — vista de servicio · `presentacion.html` — modo presentación fiscalizador
- `unidades.html` — administrador de unidades de la red (solo admin)

## Deploy
GitHub Pages, branch main, root. Repo público.
