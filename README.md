<div  align="center"> 
<img src="https://github.com/GabrielaGL/md-links/assets/120422565/01b796f9-52be-4500-9610-1b3085b463c3" width="500px">

<b>Autora</b>
<br/>
[Gabriela Gomez](https://github.com/GabrielaGL)<br/>
<br/>
</div>

***

## Índice

* [Acerca del Proyecto](#acerca-del-proyecto)
* [Instalación](#instalación)
* [Uso](#uso)
* [Uso de librerías externas](#uso-de-librerías-externas)
* [Contribución](#contribución)
* [Referencias](#referencias)


***

## Acerca del proyecto

Esta herramienta es un paquete de Node.js diseñado en `Javascript` para filtrar y analizar enlaces en archivos Markdown. Proporciona estadísticas básicas de cada enlace, como su URL y estado. Es compatible con proyectos existentes y se puede integrar en flujos de trabajo automatizados. Ayuda a identificar enlaces rotos o redirigidos, mejorando la calidad de los proyectos web.

<br/>

***

## Instalación

Para instalar la paquetería debe ingresar el siguiente comando en su terminal

```javascript
npm install @gabrielagl/mdlinks
```
<br/>

***

## Uso

Para usar la paquetería es necesario usar el siguiente comando 

```javascript
 @gabrielagl/mdlinks <path> [options]
```

En el que `path` puede ser tanto la ruta **absoluta** o **relativa** del archivo o directorio que se quiere analizar, y `[options]` el comando o comandos extra para obtener estadísticas de cada URL.


<h3>Opciones</h3>

Sin ninguna opción extra se muestran las siguientes estadísticas:

* `href`: URL encontrada.
* `text`: Texto que aparecía dentro del link (`<a>`).
* `file`: Ruta del archivo donde se encontró el link.

<br/>

Con la opción `--validate` se muestra: 

* `href`: URL encontrada.
* `text`: Texto que aparecía dentro del link (`<a>`).
* `file`: Ruta del archivo donde se encontró el link.
* `status`: Código de respuesta HTTP.
* `ok`: Mensaje `fail` en caso de fallo u `ok` en caso de éxito.

<br/>

Con la opción `--stats` se muestra:

* `total`: total de URL encontrados.
* `unique`: URL válidas.
* `broken`: URL rotas o que no funcionan.

<br/>

Con la opción `--help` se muestra información de las opciones y el link al repositorio para consultar más información 


<h3>Ejemplos de uso</h3>

` gabrielagl/mdlinks file.md `

Este comando imprime las estadísticas base de cada URL dentro de `file.md `.

<br/>

` gabrielagl/mdlinks directory/ `

Esta comando imprime las estadísticas base de cada URL de los archivos dentro de `directory/ `, incluyendo las posibles carpetas y archivos dentro de este.

<br/>

` gabrielagl/mdlinks file.md --stats --validate `

Este comando imprime las estadísticas de cada URL en `file.md `, incluyendo las peticiones HTTP; así como las estadísticas generales de todos los URL: el total de URL, los que son válidos y los que están rotos.

<br/>

<h3> Demo Links con stats</h3>

<img src="https://github.com/GabrielaGL/md-links/assets/120422565/843caa12-c454-4cd0-b3d6-948fcfb9c7ab" width="500px">



***

## Uso de librerías externas

* `chalk`: Se utiliza para diseño de la línea de comando, como colores.
* `figlet`: Implementación del texto en ASCII.
* `marked`: Hace un filtro de cada URL con ayuda de un _custom renderer_.
* `DOMPurify`: Se encarga de _limpiar_ cada URL para evitar posibles amenazas con URL maliciosos.
* `node-fetch`: Se usa para hacer la petición HTTP para comprobar cada URL.

<br/>

***

## Contribución

Para cualquier contribución o reporte de algún error, puede hacer un apartado en los `issues`.

<br/>

***

## Referencias

* [Acerca de Node.js - Documentación oficial](https://nodejs.org/es/about/)
* [Node.js file system - Documentación oficial](https://nodejs.org/api/fs.html)
* [Node.js http.get - Documentación oficial](https://nodejs.org/api/http.html#http_http_get_options_callback)
* [FIGlet](https://ubunlog.com/figlet-banners-ascii-terminal/)
* [Marked](https://marked.js.org/)
* [Jest-ECMAScript Modules](https://jestjs.io/docs/ecmascript-modules)
* [Chalk](https://www.npmjs.com/package/chalk)
