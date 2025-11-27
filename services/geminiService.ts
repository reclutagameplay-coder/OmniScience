import { GoogleGenAI, Type } from "@google/genai";
import { Subject, QuizQuestion } from '../types';

// Initialize the Gemini client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- PRELOADED STATIC CONTENT (MATHEMATICS) ---
// Contenido generado y fijado para evitar llamadas a la API y asegurar disponibilidad.

const STATIC_MATH_TOPICS = [
  "Fundamentos de Álgebra",
  "Geometría Plana",
  "Funciones y Gráficas",
  "Trigonometría",
  "Límites y Continuidad",
  "Cálculo Diferencial (Derivadas)",
  "Cálculo Integral",
  "Estadística Descriptiva"
];

const STATIC_MATH_THEORY: Record<string, string> = {
  [`${Subject.MATH}-Fundamentos de Álgebra`]: `
# Fundamentos de Álgebra

## Definición
El álgebra es la rama de las matemáticas que utiliza letras y símbolos para representar números y cantidades en fórmulas y ecuaciones. Es el lenguaje universal para generalizar operaciones aritméticas.

## Principios Clave
- **Variables**: Símbolos (como $x$, $y$, $z$) que representan números desconocidos o cambiantes.
- **Constantes**: Valores fijos que no cambian (ej. $5$, $\\pi$).
- **Ecuaciones**: Igualdades matemáticas que muestran que dos expresiones tienen el mismo valor (ej. $2x + 3 = 9$).
- **Operaciones Inversas**: El método para despejar variables (la suma deshace la resta, la multiplicación deshace la división).

## Explicación Detallada
El álgebra nos permite resolver problemas donde faltan datos. En lugar de decir "tengo algo, le sumo 2 y me da 5", escribimos $x + 2 = 5$. El objetivo fundamental es manipular estas ecuaciones manteniendo el equilibrio (lo que haces a un lado, debes hacerlo al otro) para encontrar el valor de la incógnita.

El álgebra es la base para casi todas las matemáticas avanzadas, ya que proporciona las herramientas para modelar relaciones del mundo real, desde calcular intereses bancarios hasta programar videojuegos.

## Analogía o Ejemplo
> **La Balanza**: Imagina una balanza antigua en equilibrio. En un platillo tienes una caja cerrada (la variable $x$) y dos pesas de 1kg. En el otro platillo tienes 5 pesas de 1kg.
>
> Para saber cuánto pesa la caja sin abrirla, quitas 2 pesas de *ambos* platillos. La balanza sigue equilibrada, y ahora tienes la caja sola en un lado y 3 pesas en el otro. Por tanto, la caja pesa 3kg. ¡Eso es álgebra!

## Conclusión
El álgebra no se trata solo de encontrar $x$, sino de entender las relaciones y patrones entre cantidades. Es la herramienta que transforma problemas verbales en soluciones lógicas.
`,

  [`${Subject.MATH}-Geometría Plana`]: `
# Geometría Plana

## Definición
La geometría plana (o euclidiana) estudia las propiedades y medidas de figuras en dos dimensiones, es decir, figuras que tienen ancho y alto pero no profundidad, como triángulos, círculos y cuadrados.

## Principios Clave
- **Punto, Línea y Plano**: Los bloques constructores fundamentales.
- **Ángulos**: La medida de separación entre dos rayos que comparten un vértice.
- **Polígonos**: Figuras cerradas formadas por segmentos de recta (triángulos, cuadriláteros, etc.).
- **Teorema de Pitágoras**: En un triángulo rectángulo, $a^2 + b^2 = c^2$.

## Explicación Detallada
La geometría plana se ocupa de calcular el perímetro (borde), el área (superficie interior) y las relaciones angulares de las figuras. Se basa en una serie de axiomas y postulados establecidos por Euclides hace más de 2000 años.

Es esencial para campos como la arquitectura, el diseño gráfico, la ingeniería civil y la navegación. Entender cómo interactúan las formas permite desde diseñar un logotipo equilibrado hasta calcular cuánta pintura necesitas para una pared.

## Analogía o Ejemplo
> **El Plano del Arquitecto**: Un plano de una casa es pura geometría plana. Las paredes son líneas, las habitaciones son rectángulos y las puertas describen arcos al abrirse.
>
> Si el arquitecto necesita saber la longitud de una viga diagonal para sostener un techo triangular, no la mide físicamente; usa el Teorema de Pitágoras basándose en la altura y la base del triángulo.

## Conclusión
La geometría plana nos enseña a visualizar y medir el espacio bidimensional, proporcionando la lógica estructural necesaria para construir y diseñar en nuestro mundo.
`,

  [`${Subject.MATH}-Funciones y Gráficas`]: `
# Funciones y Gráficas

## Definición
Una función es una relación matemática entre dos conjuntos donde a cada elemento del primer conjunto (entrada o dominio) le corresponde exactamente un elemento del segundo conjunto (salida o rango). Se denota usualmente como $f(x)$.

## Principios Clave
- **Entrada ($x$) y Salida ($y$)**: $x$ es la variable independiente, $y$ es la dependiente.
- **Dominio**: Todos los valores posibles de entrada.
- **Rango**: Todos los valores posibles de salida.
- **Gráfica**: La representación visual de la función en un plano cartesiano.

## Explicación Detallada
Las funciones son reglas de asignación. Por ejemplo, la función $f(x) = 2x$ es una regla que dice "toma el número de entrada y multiplícalo por dos".
Las gráficas nos permiten visualizar el comportamiento de estas reglas. Una línea recta indica una relación lineal (constante), mientras que una curva puede indicar aceleración o crecimiento exponencial. Interpretar gráficas es crucial para entender datos en economía, biología y física.

## Analogía o Ejemplo
> **La Máquina Expendedora**: Imagina una máquina expendedora perfecta. Los botones que presionas son la "entrada" ($x$) y el refresco que sale es la "salida" ($y$).
>
> Es una función porque para cada botón específico (A1), sale un producto específico (Coca-Cola). No puede suceder que presiones A1 y a veces salga agua y a veces salga jugo; eso violaría la definición de función.

## Conclusión
Las funciones son el corazón del modelado matemático. Nos permiten predecir resultados basándonos en reglas establecidas y visualizar cómo cambia una variable en respuesta a otra.
`,

  [`${Subject.MATH}-Trigonometría`]: `
# Trigonometría

## Definición
La trigonometría es el estudio de las relaciones entre los lados y los ángulos de los triángulos, especialmente los triángulos rectángulos. Proviene del griego "trigonon" (triángulo) y "metron" (medida).

## Principios Clave
- **Seno ($sin$)**: Opuesto / Hipotenusa.
- **Coseno ($cos$)**: Adyacente / Hipotenusa.
- **Tangente ($tan$)**: Opuesto / Adyacente.
- **Círculo Unitario**: Un círculo de radio 1 usado para definir funciones trigonométricas para cualquier ángulo.

## Explicación Detallada
La trigonometría conecta el álgebra con la geometría. Mientras que la geometría mide formas estáticas, la trigonometría es fundamental para estudiar fenómenos periódicos como las ondas de sonido, la luz, las mareas y las órbitas planetarias.

Las funciones trigonométricas nos permiten calcular distancias inaccesibles. Por ejemplo, podemos calcular la altura de una montaña sabiendo la distancia a la base y el ángulo de elevación de nuestra vista a la cima.

## Analogía o Ejemplo
> **La Sombra del Árbol**: Imagina que quieres medir un árbol gigante pero no puedes treparlo. Esperas a una hora del día donde el sol proyecta una sombra.
>
> Mides la longitud de la sombra (Cateto Adyacente) y el ángulo al que está el sol en el cielo. Usando la función **Tangente**, puedes calcular la altura del árbol (Cateto Opuesto) sin jamás tocar la cima.

## Conclusión
La trigonometría es indispensable para la navegación, la astronomía y la física. Es la herramienta matemática que nos permite medir el mundo a distancia y entender los ciclos de la naturaleza.
`,

  [`${Subject.MATH}-Límites y Continuidad`]: `
# Límites y Continuidad

## Definición
El límite describe el valor al que se acerca una función o secuencia a medida que la entrada (variable) se acerca a un cierto valor. Es el concepto fundacional del cálculo.

## Principios Clave
- **Aproximación**: No nos importa qué pasa *en* el punto exacto, sino qué pasa *cerca* de él.
- **Límites Laterales**: Acercarse por la izquierda o por la derecha.
- **Continuidad**: Una función es continua si puedes dibujarla sin levantar el lápiz del papel (el límite coincide con el valor de la función).

## Explicación Detallada
Antes del cálculo, las matemáticas tenían problemas con el infinito y lo infinitesimalmente pequeño. Los límites resuelven esto. Por ejemplo, la función $f(x) = (x^2 - 1) / (x - 1)$ no está definida en $x = 1$ (división por cero). Sin embargo, si nos acercamos mucho a 1 (ej. 0.999 o 1.001), el valor se acerca a 2. Decimos que el límite cuando $x$ tiende a 1 es 2.

## Analogía o Ejemplo
> **Caminar hacia la pared**: Imagina que caminas hacia una pared. En cada paso, avanzas exactamente la mitad de la distancia que te falta.
> 1. Estás a 1 metro.
> 2. Estás a 0.5 metros.
> 3. Estás a 0.25 metros.
>
> Nunca tocarás matemáticamente la pared (siempre queda una mitad), pero tu posición se *aproxima* infinitamente a la pared. El "límite" de tu viaje es la pared.

## Conclusión
Los límites nos permiten manejar lo infinitamente pequeño y son el escalón necesario para definir derivadas e integrales, permitiendo el estudio del movimiento y el cambio.
`,

  [`${Subject.MATH}-Cálculo Diferencial (Derivadas)`]: `
# Cálculo Diferencial (Derivadas)

## Definición
La derivada mide la rapidez con la que cambia una función en un punto dado. Geométricamente, es la pendiente de la recta tangente a la curva en ese punto.

## Principios Clave
- **Tasa de Cambio**: Cómo cambia $y$ cuando cambia $x$.
- **Pendiente**: La inclinación de la curva.
- **Reglas de Derivación**: Reglas mecánicas (como la regla de la potencia) para encontrar derivadas sin usar límites cada vez.

## Explicación Detallada
El cálculo diferencial trata sobre el cambio. En el mundo real, nada es estático. Los coches aceleran, las poblaciones crecen, el café se enfría. La derivada nos dice exactamente *cuán rápido* ocurren estos cambios en un instante preciso.

Si tienes una función que describe la posición de un cohete, la derivada de esa función te da su **velocidad**. La derivada de la velocidad te da su **aceleración**.

## Analogía o Ejemplo
> **Velocímetro vs. Odómetro**:
> - El **Odómetro** (cuenta kilómetros) te dice la distancia total (la función original).
> - El **Velocímetro** te dice tu velocidad en ese preciso instante (la derivada).
>
> Aunque hayas recorrido 100km en 2 horas, el velocímetro podría haber marcado 0 (en un semáforo) o 120 (rebasando). La derivada captura ese detalle instantáneo.

## Conclusión
Las derivadas son esenciales para la optimización (encontrar máximos y mínimos). Ingenieros y economistas las usan para minimizar costos o maximizar eficiencia.
`,

  [`${Subject.MATH}-Cálculo Integral`]: `
# Cálculo Integral

## Definición
La integral es, fundamentalmente, la operación inversa a la derivada. Mientras la derivada divide cosas en partes instantáneas, la integral suma infinitas partes pequeñas para encontrar un todo (acumulación o área).

## Principios Clave
- **Integral Indefinida**: Encontrar la función original (antiderivada).
- **Integral Definida**: Calcular el área exacta bajo una curva entre dos puntos.
- **Teorema Fundamental del Cálculo**: Conecta la derivación con la integración.

## Explicación Detallada
Si conoces la velocidad de un objeto en todo momento (derivada), la integración te permite calcular exactamente qué distancia ha recorrido (función original).
Geométricamente, sirve para calcular áreas de formas irregulares y volúmenes de sólidos complejos que no tienen fórmulas simples como un cubo o una esfera básica.

## Analogía o Ejemplo
> **Llenando el Tanque**: Imagina que estás llenando un tanque de agua, pero el flujo del grifo cambia constantemente (a veces rápido, a veces lento).
>
> Si registras el flujo de agua cada segundo (la tasa de cambio), la **integral** es la suma de toda esa agua que ha entrado. Te dice el volumen total acumulado en el tanque al final del día.

## Conclusión
El cálculo integral es la herramienta de la acumulación. Se usa para calcular volúmenes, trabajo físico, probabilidades totales y centros de masa.
`,

  [`${Subject.MATH}-Estadística Descriptiva`]: `
# Estadística Descriptiva

## Definición
La estadística descriptiva es la rama de las matemáticas que recolecta, organiza, resume y presenta datos de manera informativa. No hace predicciones (eso es inferencial), solo describe lo que hay.

## Principios Clave
- **Media**: El promedio aritmético.
- **Mediana**: El valor central cuando los datos están ordenados.
- **Moda**: El valor que más se repite.
- **Desviación Estándar**: Cuánto se alejan los datos del promedio (dispersión).

## Explicación Detallada
Vivimos en la era de la información. La estadística descriptiva nos ayuda a dar sentido a grandes cantidades de datos crudos. En lugar de mirar una lista de 1000 notas de examen, calculamos la media para ver cómo le fue a la clase en general, o la desviación estándar para ver si las notas fueron muy variadas o todas similares.

## Analogía o Ejemplo
> **El Jugador de Baloncesto**: Imagina que quieres evaluar a un jugador.
> - Decir que anotó 20 puntos en un partido es un **dato**.
> - Decir que su **promedio** (media) de temporada es 25 puntos nos dice qué tan bueno es generalmente.
> - Si su **desviación estándar** es baja, significa que es consistente (siempre anota cerca de 25). Si es alta, es impredecible (un día anota 50, otro día 5).

## Conclusión
La estadística descriptiva es esencial para la ciencia de datos, la investigación médica y la toma de decisiones empresariales, permitiéndonos resumir la realidad numérica en métricas comprensibles.
`
};

// --- PRELOADED STATIC CONTENT (PHYSICS) ---

const STATIC_PHYSICS_TOPICS = [
  "Cinemática (Movimiento)",
  "Dinámica y Leyes de Newton",
  "Trabajo y Energía",
  "Termodinámica",
  "Ondas y Sonido",
  "Electrostática y Magnetismo",
  "Óptica Geométrica",
  "Física Moderna"
];

const STATIC_PHYSICS_THEORY: Record<string, string> = {
  [`${Subject.PHYSICS}-Cinemática (Movimiento)`]: `
# Cinemática (Movimiento)

## Definición
La cinemática es la rama de la mecánica clásica que describe el movimiento de los cuerpos sin considerar las fuerzas que lo originan. Se centra en el "cómo" se mueven las cosas.

## Principios Clave
- **Posición y Desplazamiento**: Dónde está un objeto y cuánto ha cambiado su posición.
- **Velocidad**: La rapidez con dirección (cambio de posición respecto al tiempo).
- **Aceleración**: El cambio de velocidad respecto al tiempo.
- **Movimiento Rectilíneo Uniforme (MRU)**: Velocidad constante, aceleración cero.

## Explicación Detallada
La cinemática nos da el vocabulario para describir el movimiento. Todo en el universo se mueve, pero necesitamos marcos de referencia para medirlo.
Usamos ecuaciones como $d = v \\cdot t$ para movimientos simples, o $d = v_i t + 0.5 a t^2$ cuando hay aceleración (como la gravedad). Esto nos permite predecir dónde estará un objeto en el futuro si conocemos sus condiciones actuales.

## Analogía o Ejemplo
> **El Viaje en Carretera**:
> - Tu **desplazamiento** es qué tan lejos estás de casa en línea recta.
> - Tu **velocidad** es lo que marca el velocímetro (más la dirección hacia donde vas).
> - Tu **aceleración** es lo que sientes cuando pisas el acelerador o frenas bruscamente (te pegas al asiento o te vas hacia adelante).

## Conclusión
La cinemática es la base para entender la física. Sin describir el movimiento, no podemos empezar a entender las fuerzas que lo causan.
`,

  [`${Subject.PHYSICS}-Dinámica y Leyes de Newton`]: `
# Dinámica y Leyes de Newton

## Definición
La dinámica estudia las causas del movimiento, es decir, las fuerzas. Explica "por qué" se mueven las cosas, basándose en las tres leyes formuladas por Isaac Newton.

## Principios Clave
- **1ª Ley (Inercia)**: Un objeto se mantiene en reposo o movimiento constante a menos que actúe una fuerza sobre él.
- **2ª Ley (Fuerza)**: $F = m \\cdot a$ (La fuerza es igual a la masa por la aceleración).
- **3ª Ley (Acción-Reacción)**: Para cada acción, hay una reacción igual y opuesta.

## Explicación Detallada
Las leyes de Newton son quizás las más famosas de la ciencia.
La primera ley nos dice que el movimiento es el estado natural de las cosas; la fricción es lo que suele detenerlas.
La segunda ley nos da la fórmula para calcular cuánta fuerza se necesita para mover algo pesado.
La tercera ley explica interacciones: si empujas una pared, la pared te empuja a ti con la misma fuerza (por eso no la atraviesas).

## Analogía o Ejemplo
> **El Carrito de Supermercado**:
> 1. **Inercia**: El carrito quieto no se mueve solo; necesitas empujarlo.
> 2. **F=ma**: Si el carrito está lleno (mucha masa), necesitas empujar más fuerte (más fuerza) para que acelere igual que uno vacío.
> 3. **Acción-Reacción**: Cuando caminas empujando el carrito, tus pies empujan el suelo hacia atrás, y el suelo te empuja a ti hacia adelante.

## Conclusión
La dinámica gobierna desde el movimiento de los planetas hasta el diseño de automóviles seguros. Es el manual de instrucciones de las fuerzas del universo.
`,

  [`${Subject.PHYSICS}-Trabajo y Energía`]: `
# Trabajo y Energía

## Definición
En física, el "trabajo" ocurre cuando una fuerza mueve un objeto a lo largo de una distancia. La "energía" es la capacidad para realizar ese trabajo.

## Principios Clave
- **Energía Cinética ($E_c$)**: Energía del movimiento ($0.5 m v^2$).
- **Energía Potencial ($E_p$)**: Energía almacenada por posición ($m g h$).
- **Conservación de la Energía**: La energía no se crea ni se destruye, solo se transforma.
- **Potencia**: La rapidez con la que se realiza un trabajo.

## Explicación Detallada
El concepto de energía unifica toda la física. Si levantas una roca, realizas trabajo contra la gravedad y le das a la roca energía potencial. Si la sueltas, esa energía potencial se convierte en energía cinética mientras cae.
La ley de conservación de la energía es una herramienta poderosa: nos permite resolver problemas complejos comparando la energía al principio y al final, sin preocuparnos por lo que pasa en medio.

## Analogía o Ejemplo
> **La Montaña Rusa**:
> - En la cima de la colina más alta, el vagón tiene máxima **energía potencial** y mínima velocidad.
> - Al bajar, la gravedad convierte esa altura en velocidad (**energía cinética**).
> - En el punto más bajo, va rapidísimo. La energía total (suma de ambas) es constante durante todo el viaje (ignorando fricción).

## Conclusión
Entender la energía es vital para todo, desde calcular el consumo de combustible hasta entender procesos biológicos y reacciones químicas.
`,

  [`${Subject.PHYSICS}-Termodinámica`]: `
# Termodinámica

## Definición
La termodinámica estudia el calor, la temperatura y su relación con la energía y el trabajo. Describe cómo la energía fluye en el universo a nivel macroscópico.

## Principios Clave
- **Calor vs. Temperatura**: Calor es transferencia de energía; temperatura es la medida de la agitación molecular.
- **Entropía**: Medida del desorden de un sistema.
- **Leyes de la Termodinámica**: Reglas absolutas sobre la energía térmica (ej. el calor fluye de caliente a frío).

## Explicación Detallada
La termodinámica explica por qué los motores funcionan y por qué el tiempo parece ir en una sola dirección.
La Segunda Ley es crucial: establece que la entropía (desorden) del universo siempre aumenta. Por eso es fácil romper un huevo pero imposible "des-romperlo", y por eso ninguna máquina puede ser 100% eficiente (siempre se pierde energía como calor).

## Analogía o Ejemplo
> **La Taza de Café**:
> - Si dejas una taza de café caliente en una mesa, se enfría. El calor fluye del café (caliente) al aire (frío) hasta alcanzar el equilibrio térmico.
> - Nunca verás una taza de café absorber calor espontáneamente del aire frío para calentarse sola. Eso violaría la segunda ley de la termodinámica.

## Conclusión
La termodinámica es la ciencia de los motores, refrigeradores, atmósferas y estrellas. Define los límites de lo que es tecnológicamente posible.
`,

  [`${Subject.PHYSICS}-Ondas y Sonido`]: `
# Ondas y Sonido

## Definición
Una onda es una perturbación que viaja a través del espacio o la materia, transportando energía sin transportar masa. El sonido es una onda mecánica que viaja por el aire.

## Principios Clave
- **Frecuencia y Periodo**: Qué tan rápido vibra la onda.
- **Longitud de Onda**: La distancia entre dos crestas.
- **Amplitud**: La altura de la onda (intensidad).
- **Efecto Doppler**: Cambio de frecuencia debido al movimiento de la fuente.

## Explicación Detallada
Las ondas están en todas partes. La luz, el sonido, los sismos y las señales de WiFi son ondas.
Estudiamos cómo se reflejan (eco), se refractan (cambian de dirección) y se superponen (interferencia). El sonido, por ejemplo, necesita un medio (aire, agua) para viajar, mientras que la luz puede viajar en el vacío.

## Analogía o Ejemplo
> **La Piedra en el Estanque**:
> Tiras una piedra al agua. Se crean ondas circulares que se alejan.
> - El agua en sí solo sube y baja en su lugar.
> - Lo que viaja hacia la orilla es la **energía** de la perturbación, no el agua misma. Así funciona el sonido llegando a tu oído.

## Conclusión
El estudio de las ondas es esencial para las telecomunicaciones, la música, la medicina (ultrasonido) y la comprensión de la estructura del universo.
`,

  [`${Subject.PHYSICS}-Electrostática y Magnetismo`]: `
# Electrostática y Magnetismo

## Definición
Estudia las cargas eléctricas en reposo (electrostática) y en movimiento (electrodinámica/magnetismo). Electricidad y magnetismo son dos caras de la misma moneda: el electromagnetismo.

## Principios Clave
- **Carga Eléctrica**: Propiedad fundamental (positiva/negativa). Cargas iguales se repelen, opuestas se atraen.
- **Campo Eléctrico/Magnético**: La región donde se siente la fuerza eléctrica o magnética.
- **Ley de Coulomb**: La fuerza entre cargas disminuye con el cuadrado de la distancia.
- **Inducción**: Un campo magnético variable crea electricidad.

## Explicación Detallada
Esta rama explica desde los rayos en una tormenta hasta cómo funciona tu ordenador.
Las cargas crean campos eléctricos. Si pones esas cargas en movimiento (corriente), crean campos magnéticos. Si mueves un imán cerca de un cable, creas corriente eléctrica. Esta interacción es la base de todos los generadores eléctricos y motores del mundo.

## Analogía o Ejemplo
> **El Globo y el Pelo**:
> Frotas un globo en tu pelo. Los electrones saltan del pelo al globo.
> - El globo queda con carga negativa y tu pelo con positiva.
> - Como cargas opuestas se atraen, ¡tu pelo se levanta tratando de pegarse al globo! Eso es fuerza electrostática pura.

## Conclusión
El electromagnetismo es la fuerza que mantiene unidos a los átomos y la base de toda nuestra tecnología moderna y civilización electrificada.
`,

  [`${Subject.PHYSICS}-Óptica Geométrica`]: `
# Óptica Geométrica

## Definición
La óptica estudia el comportamiento de la luz. La óptica geométrica trata la luz como rayos rectos para explicar cómo se forman las imágenes en espejos y lentes.

## Principios Clave
- **Reflexión**: La luz rebota (espejos). Ángulo de incidencia = ángulo de reflexión.
- **Refracción**: La luz se dobla al cambiar de medio (lentes, agua).
- **Índice de Refracción**: Qué tanto se frena la luz en un material.
- **Lentes Convergentes/Divergentes**: Enfocan o dispersan la luz.

## Explicación Detallada
La óptica nos permite manipular la luz. Entendiendo la refracción, podemos diseñar gafas para corregir la visión, microscopios para ver células y telescopios para ver galaxias.
La luz viaja más lento en el vidrio que en el aire; este cambio de velocidad es lo que causa que "se doble" y nos permita enfocar imágenes.

## Analogía o Ejemplo
> **El Lápiz Roto**:
> Mete un lápiz en un vaso con agua. Parece que el lápiz está partido o doblado en la superficie.
> No le pasó nada al lápiz. Es la **fracción**: la luz que viene de la parte sumergida cambia de dirección al salir del agua al aire, engañando a tu cerebro sobre la posición real del objeto.

## Conclusión
La óptica no es solo sobre ver; es sobre instrumentos que extienden nuestros sentidos y tecnologías como la fibra óptica que conecta internet.
`,

  [`${Subject.PHYSICS}-Física Moderna`]: `
# Física Moderna

## Definición
Se refiere a la física desarrollada a principios del siglo XX que revolucionó nuestra comprensión del universo, incluyendo la Relatividad (Einstein) y la Mecánica Cuántica.

## Principios Clave
- **Relatividad Especial**: El tiempo y el espacio no son absolutos; dependen de la velocidad del observador. $E=mc^2$.
- **Dualidad Onda-Partícula**: La luz (y la materia) se comporta a veces como onda y a veces como partícula.
- **Principio de Incertidumbre**: No puedes conocer posición y velocidad de una partícula con precisión infinita simultáneamente.

## Explicación Detallada
La física clásica (Newton) funciona bien para cosas cotidianas. Pero para cosas muy rápidas (cercanas a la luz) o muy pequeñas (átomos), falla.
La física moderna nos dice cosas extrañas: el tiempo pasa más lento si te mueves rápido (dilatación del tiempo) y las partículas pueden estar en dos lugares a la vez hasta que las observas.

## Analogía o Ejemplo
> **El GPS**:
> Los satélites GPS orbitan la Tierra a gran velocidad y menor gravedad.
> Según la relatividad, sus relojes van a un ritmo ligeramente diferente al de tu teléfono en la tierra. Si los ingenieros no corrigieran este efecto relativista usando las fórmulas de Einstein, ¡tu GPS fallaría por kilómetros cada día!

## Conclusión
La física moderna nos dio la energía nuclear, los láseres, los transistores (chips de computadora) y una comprensión profunda del origen del universo.
`
};

// --- PRELOADED STATIC CONTENT (CHEMISTRY) ---

const STATIC_CHEMISTRY_TOPICS = [
  "Estructura Atómica",
  "Tabla Periódica",
  "Enlaces Químicos",
  "Estequiometría",
  "Gases Ideales",
  "Disoluciones",
  "Equilibrio Químico",
  "Química Orgánica (Básica)"
];

const STATIC_CHEMISTRY_THEORY: Record<string, string> = {
  [`${Subject.CHEMISTRY}-Estructura Atómica`]: `
# Estructura Atómica

## Definición
El átomo es la unidad básica de la materia. Todo lo que te rodea está hecho de átomos. Su estructura consta de un núcleo central denso y una nube de electrones a su alrededor.

## Principios Clave
- **Protón**: Carga positiva (+), ubicado en el núcleo. Define qué elemento es.
- **Neutrón**: Sin carga (neutro), ubicado en el núcleo. Aporta masa y estabilidad.
- **Electrón**: Carga negativa (-), orbita alrededor del núcleo. Responsable de las reacciones químicas.
- **Isótopos**: Átomos del mismo elemento con diferente número de neutrones.

## Explicación Detallada
Aunque la palabra átomo significa "indivisible" en griego, hoy sabemos que están compuestos de partículas subatómicas. El núcleo contiene casi toda la masa, pero ocupa un espacio diminuto. Los electrones se mueven en regiones llamadas "orbitales" (no órbitas perfectas como planetas) donde es probable encontrarlos.
La identidad de un átomo depende de sus protones (Número Atómico). Si cambias los protones, cambias de elemento (ej. de Carbono a Nitrógeno).

## Analogía o Ejemplo
> **El Estadio de Fútbol**:
> Si un átomo fuera del tamaño de un estadio de fútbol:
> - El **núcleo** sería una canica en el centro del campo.
> - Los **electrones** serían mosquitos zumbando en las gradas más altas.
> - El resto del estadio es **espacio vacío**. ¡La materia es mayormente vacío!

## Conclusión
Entender la estructura atómica es fundamental para comprender por qué los elementos se comportan como lo hacen y cómo se combinan para formar todo lo que existe.
`,

  [`${Subject.CHEMISTRY}-Tabla Periódica`]: `
# Tabla Periódica

## Definición
La Tabla Periódica es una disposición organizada de todos los elementos químicos conocidos, ordenados por su número atómico, configuración electrónica y propiedades químicas recurrentes.

## Principios Clave
- **Grupos (Columnas)**: Elementos con propiedades similares y mismos electrones de valencia.
- **Periodos (Filas)**: Indican el nivel de energía principal que se está llenando.
- **Metales, No Metales y Metaloides**: Clasificación principal de tipos de elementos.
- **Electronegatividad**: Tendencia de un átomo a atraer electrones.

## Explicación Detallada
La tabla no es solo una lista; es un mapa. Su diseño nos permite predecir el comportamiento de un elemento solo por su ubicación.
Por ejemplo, los elementos del Grupo 18 (Gases Nobles) son inertes y no reaccionan porque tienen sus capas de electrones llenas. Los del Grupo 1 (Metales Alcalinos) son muy reactivos porque desesperadamente quieren perder un electrón.

## Analogía o Ejemplo
> **El Calendario Semanal**:
> La tabla periódica es como un calendario.
> - Los días de la semana se repiten (Lunes, Martes...).
> - Si sabes cómo es un "Lunes" (Grupo), puedes esperar que el próximo Lunes tenga características similares, aunque sea una fecha diferente (Periodo).

## Conclusión
La Tabla Periódica es la herramienta más poderosa del químico. Resume todo el comportamiento químico del universo en una sola hoja de papel.
`,

  [`${Subject.CHEMISTRY}-Enlaces Químicos`]: `
# Enlaces Químicos

## Definición
Un enlace químico es la fuerza que mantiene unidos a los átomos para formar moléculas o compuestos. Los átomos se unen para alcanzar una configuración más estable (generalmente llenando su última capa de electrones).

## Principios Clave
- **Enlace Iónico**: Transferencia completa de electrones (de un metal a un no metal). Crea iones atraídos por carga opuesta.
- **Enlace Covalente**: Compartición de electrones entre dos no metales.
- **Enlace Metálico**: Un "mar de electrones" compartidos libremente entre átomos de metal.

## Explicación Detallada
Los átomos rara vez están solos; prefieren tener compañía para ser estables (Regla del Octeto).
En la **sal común (NaCl)**, el Sodio le regala un electrón al Cloro (Enlace Iónico).
En el **agua ($H_2O$)**, el Oxígeno comparte electrones con el Hidrógeno (Enlace Covalente).
Esta diferencia determina las propiedades: los compuestos iónicos suelen ser cristales duros con altos puntos de fusión, mientras que los covalentes pueden ser gases o líquidos a temperatura ambiente.

## Analogía o Ejemplo
> **Tipos de Relaciones**:
> - **Iónico**: Uno da y el otro recibe (un regalo). Se mantienen juntos porque ahora tienen cargas opuestas.
> - **Covalente**: Compartir un paraguas bajo la lluvia. Ambos lo sostienen y deben estar cerca.
> - **Metálico**: Una comuna hippie donde todo es de todos. Los electrones fluyen libremente por todo el vecindario.

## Conclusión
Los enlaces químicos son el pegamento del universo. Sin ellos, no habría agua, ni ADN, ni rocas; solo una sopa de átomos solitarios.
`,

  [`${Subject.CHEMISTRY}-Estequiometría`]: `
# Estequiometría

## Definición
La estequiometría es el cálculo de las relaciones cuantitativas entre los reactivos y productos en una reacción química. Se basa en la ley de conservación de la masa.

## Principios Clave
- **El Mol**: La unidad de cantidad de sustancia ($6.022 \\times 10^{23}$ partículas).
- **Masa Molar**: Cuánto pesa un mol de una sustancia (g/mol).
- **Ecuación Balanceada**: Igual número de átomos de cada elemento a ambos lados de la flecha.

## Explicación Detallada
La química es como cocinar, pero con precisión atómica. Si la reacción dice $2H_2 + O_2 \\rightarrow 2H_2O$, significa que necesitas exactamente 2 moles de hidrógeno por cada 1 mol de oxígeno para hacer 2 moles de agua.
La estequiometría nos permite responder preguntas como: "Si tengo 10 gramos de A, ¿cuántos gramos de B voy a producir?". Es vital en la industria para no desperdiciar materiales.

## Analogía o Ejemplo
> **Sándwiches de Jamón**:
> Receta: 2 Rebanadas de Pan + 1 Jamón = 1 Sándwich.
> - Si tienes 10 rebanadas de pan y 3 de jamón, el jamón es el **reactivo limitante**. Solo puedes hacer 3 sándwiches y te sobrará pan.
>
> La estequiometría hace exactamente esto, pero contando átomos en lugar de rebanadas.

## Conclusión
La estequiometría es la matemática de la química. Permite pasar del mundo microscópico (átomos) al mundo macroscópico (gramos) que podemos medir en una balanza.
`,

  [`${Subject.CHEMISTRY}-Gases Ideales`]: `
# Gases Ideales

## Definición
El modelo de gas ideal es una simplificación teórica que describe el comportamiento de los gases bajo condiciones normales. Se rige por la ecuación $PV = nRT$.

## Principios Clave
- **Presión ($P$)**: La fuerza que ejercen las partículas al chocar contra las paredes.
- **Volumen ($V$)**: El espacio que ocupa el gas.
- **Temperatura ($T$)**: Medida de la energía cinética (velocidad) de las partículas.
- **Cantidad ($n$)**: Número de moles.

## Explicación Detallada
Esta ley conecta todas las variables de un gas.
- **Ley de Boyle**: Si aprietas un globo (menor volumen), la presión sube.
- **Ley de Charles**: Si calientas un globo, se infla (mayor volumen).
Aunque los gases reales tienen pequeñas desviaciones, la ley de los gases ideales funciona increíblemente bien para predecir comportamientos en la mayoría de las situaciones cotidianas.

## Analogía o Ejemplo
> **Coches de Choque (Auto de choque)**:
> Imagina partículas de gas como coches de choque en una pista cerrada.
> - **Temperatura alta**: Los coches van muy rápido.
> - **Presión alta**: Los coches chocan muy fuerte y seguido contra las paredes.
> - **Volumen pequeño**: La pista es muy chica, así que chocan más a menudo.

## Conclusión
Comprender los gases es crucial para todo, desde entender cómo respiramos (presión pulmonar) hasta diseñar motores de combustión y predecir el clima.
`,

  [`${Subject.CHEMISTRY}-Disoluciones`]: `
# Disoluciones

## Definición
Una disolución es una mezcla homogénea de dos o más sustancias. El componente en mayor cantidad es el disolvente y el de menor cantidad es el soluto.

## Principios Clave
- **Soluto**: Lo que se disuelve (ej. sal).
- **Disolvente**: Lo que disuelve (ej. agua). "Lo semejante disuelve a lo semejante".
- **Concentración**: Cuánto soluto hay (Molaridad, % en masa).
- **Saturación**: El punto en que ya no se puede disolver más soluto.

## Explicación Detallada
La mayoría de las reacciones químicas ocurren en disolución (usualmente en agua).
Entender la concentración es vital. En medicina, una solución intravenosa debe tener la concentración exacta de sales para no dañar las células sanguíneas. En química ambiental, medimos contaminantes en partes por millón (ppm).

## Analogía o Ejemplo
> **El Café Dulce**:
> - El café es el **disolvente**.
> - El azúcar es el **soluto**.
> - Si pones una cucharada, es una solución **diluida**.
> - Si pones 10 cucharadas y el azúcar se queda en el fondo sin deshacerse, la solución está **saturada**.

## Conclusión
Las disoluciones están en todas partes: el aire que respiramos, el agua de mar, las aleaciones metálicas (como el acero) y nuestra propia sangre.
`,

  [`${Subject.CHEMISTRY}-Equilibrio Químico`]: `
# Equilibrio Químico

## Definición
El equilibrio químico ocurre en reacciones reversibles cuando la velocidad de la reacción directa es igual a la velocidad de la reacción inversa. Las concentraciones de reactivos y productos permanecen constantes en el tiempo.

## Principios Clave
- **Reversibilidad**: Los reactivos se convierten en productos y los productos vuelven a ser reactivos ($A + B \\rightleftharpoons C + D$).
- **Constante de Equilibrio ($K_{eq}$)**: Un número que nos dice si la reacción favorece a los productos o reactivos.
- **Principio de Le Chatelier**: Si perturbas un sistema en equilibrio, este se ajustará para contrarrestar la perturbación.

## Explicación Detallada
Muchas reacciones no llegan al final (donde se agotan los reactivos), sino que llegan a un punto medio estable. Es un equilibrio **dinámico**: las moléculas siguen reaccionando, pero no hay cambio neto visible.
El Principio de Le Chatelier es fascinante: si añades más reactivo, el sistema trabajará para consumirlo. Si aumentas la presión, el sistema intentará reducirla ocupando menos volumen.

## Analogía o Ejemplo
> **La Escalera Mecánica**:
> Imagina que caminas hacia arriba en una escalera mecánica que baja.
> Si caminas a la misma velocidad exacta a la que baja la escalera, te mantienes en el mismo lugar.
> Estás en movimiento constante (**dinámico**), pero tu posición no cambia (**equilibrio**).

## Conclusión
El equilibrio es vital en procesos industriales (como hacer amoníaco para fertilizantes) y en nuestro cuerpo (mantener el pH de la sangre estable).
`,

  [`${Subject.CHEMISTRY}-Química Orgánica (Básica)`]: `
# Química Orgánica (Básica)

## Definición
Es la rama de la química que estudia los compuestos del Carbono. Es la química de la vida.

## Principios Clave
- **El Carbono**: Un átomo único capaz de formar 4 enlaces y cadenas largas o anillos estables.
- **Hidrocarburos**: Compuestos solo de carbono e hidrógeno (alcanos, alquenos).
- **Grupos Funcionales**: Grupos de átomos que dan características especiales (Alcoholes -OH, Ácidos -COOH).
- **Isomería**: Moléculas con la misma fórmula pero diferente estructura.

## Explicación Detallada
El carbono es el "lego" definitivo de la naturaleza. Puede unirse a sí mismo y a casi cualquier otro elemento, creando millones de estructuras complejas, desde el plástico de tu botella hasta el ADN de tus células.
La química orgánica estudia cómo se construyen estas moléculas y cómo reaccionan. Es la base de la farmacéutica, los polímeros y la biología.

## Analogía o Ejemplo
> **Esqueletos y Accesorios**:
> - La cadena de carbonos es el **esqueleto** o chasis.
> - Los grupos funcionales son los **accesorios** que definen qué hace la molécula.
> - Si le pones un grupo "Alcohol" a una cadena de 2 carbonos, obtienes Etanol (el del vino). Si le pones un grupo "Ácido", obtienes Ácido Acético (vinagre). ¡Mismo esqueleto, función totalmente diferente!

## Conclusión
La química orgánica explica la estructura de los seres vivos, los medicamentos, los plásticos y los combustibles. Es la química de la complejidad y la diversidad.
`
};

// --- Caching System with Persistence ---

// Helper to load from local storage safely
const loadCache = <T>(key: string): T | null => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (e) {
    console.warn("Could not load cache", e);
    return null;
  }
};

// Helper to save to local storage safely
const saveCache = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn("Storage full or unavailable", e);
  }
};

// Initialize caches: Load from storage OR use Static Defaults
const loadInitialTopics = () => {
  const cached = loadCache<Record<string, string[]>>('topicsCache') || {};
  // Ensure Static topics are always present and updated
  cached[Subject.MATH] = STATIC_MATH_TOPICS;
  cached[Subject.PHYSICS] = STATIC_PHYSICS_TOPICS;
  cached[Subject.CHEMISTRY] = STATIC_CHEMISTRY_TOPICS;
  return cached;
};

const loadInitialTheory = () => {
  const cached = loadCache<Record<string, string>>('theoryCache') || {};
  // Merge static theory into cache (Math + Physics + Chemistry)
  return { 
    ...cached, 
    ...STATIC_MATH_THEORY,
    ...STATIC_PHYSICS_THEORY,
    ...STATIC_CHEMISTRY_THEORY
  };
};

const topicsCache: Record<string, string[]> = loadInitialTopics();
const theoryCache: Record<string, string> = loadInitialTheory();

/**
 * Solves a problem using the Thinking Model (Gemini 2.5/3.0 Pro) for high reasoning.
 */
export const solveProblem = async (subject: Subject, problem: string): Promise<string> => {
  try {
    const systemInstruction = `
      Actúa como un profesor experto y paciente de ${subject}.
      Tu objetivo es resolver el problema proporcionado paso a paso.
      1. Identifica qué tipo de problema es.
      2. Desglosa los datos conocidos.
      3. Explica las fórmulas o teoremas necesarios.
      4. Resuelve el problema mostrando el procedimiento matemático claramente.
      5. Concluye con la respuesta final resaltada.
      Usa formato Markdown. Usa LaTeX (entre signos $) para fórmulas matemáticas complejas si es necesario.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview", // Best for complex reasoning (STEM)
      contents: problem,
      config: {
        systemInstruction: systemInstruction,
        thinkingConfig: { thinkingBudget: 4096 }, // Enable thinking for complex logic
      },
    });

    return response.text || "No pude generar una respuesta. Intenta de nuevo.";
  } catch (error) {
    console.error("Error solving problem:", error);
    throw new Error("Hubo un error al conectar con el tutor virtual.");
  }
};

/**
 * Explains a theoretical concept with persistent caching.
 */
export const getTheoryExplanation = async (subject: Subject, topic: string): Promise<string> => {
  const cacheKey = `${subject}-${topic}`;
  
  // Check in-memory cache (which now includes preloaded static content)
  if (theoryCache[cacheKey]) {
    return theoryCache[cacheKey];
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // Fast for text generation
      contents: `Explica detalladamente el tema "${topic}" en el contexto de ${subject}.
      La explicación debe ser educativa, visualmente clara y estructurada en Markdown para una app web.
      
      Estructura requerida:
      # Título del Concepto (Grande)
      
      ## Definición
      [Definición clara y concisa]

      ## Principios Clave
      - [Punto 1]
      - [Punto 2]
      
      ## Explicación Detallada
      [Desarrollo del tema usando párrafos claros]

      ## Analogía o Ejemplo
      > [Usa un bloque de cita para una analogía memorable o un ejemplo del mundo real]
      
      ## Conclusión
      [Resumen breve]

      Usa **negritas** para términos importantes. No uses bloques de código para texto normal.
      `,
    });

    const text = response.text || "No hay explicación disponible.";
    
    // Update cache and persist
    theoryCache[cacheKey] = text;
    saveCache('theoryCache', theoryCache);
    
    return text;
  } catch (error) {
    console.error("Error fetching theory:", error);
    throw new Error("No pude recuperar la teoría.");
  }
};

/**
 * Generates a quiz using structured JSON output.
 */
export const generateQuiz = async (subject: Subject, difficulty: 'Fácil' | 'Medio' | 'Difícil'): Promise<QuizQuestion[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Genera 5 preguntas de opción múltiple sobre ${subject}, nivel ${difficulty}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { 
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              correctIndex: { type: Type.INTEGER, description: "Index 0-3 of the correct answer" },
              explanation: { type: Type.STRING, description: "Brief explanation of why it is correct" }
            },
            required: ["question", "options", "correctIndex", "explanation"]
          }
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("Empty response");
    
    return JSON.parse(jsonText) as QuizQuestion[];
  } catch (error) {
    console.error("Error generating quiz:", error);
    return [];
  }
};

/**
 * Suggests topics for the theory section with persistent caching.
 */
export const suggestTopics = async (subject: Subject): Promise<string[]> => {
    // Check in-memory cache (includes preloaded math topics)
    if (topicsCache[subject]) {
        return topicsCache[subject];
    }

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Dame una lista JSON de 8 temas fundamentales, interesantes y ordenados por complejidad para estudiar en ${subject}. Solo devuelve un array de strings.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                }
            }
        });
        const topics = JSON.parse(response.text || "[]");
        
        // Update cache and persist
        topicsCache[subject] = topics;
        saveCache('topicsCache', topicsCache);
        
        return topics;
    } catch (e) {
        return ["Conceptos Básicos", "Historia", "Aplicaciones Modernas"];
    }
}