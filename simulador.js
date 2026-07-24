// simulador.js
const { exec } = require('child_process');

// Una ruta real de ejemplo (coordenadas consecutivas en La Libertad)
const rutaAmbulancia = [
  { lat: -2.226382, lng: -80.884521 }, // Punto de partida (Cerca de la UPSE)
  { lat: -2.227000, lng: -80.885000 },
  { lat: -2.227500, lng: -80.885500 },
  { lat: -2.228000, lng: -80.886000 },
  { lat: -2.228500, lng: -80.886500 },
  { lat: -2.229000, lng: -80.887000 }  // Destino final
];

let indice = 0;

console.log("🚑 =================================================");
console.log("🚑 Simulador de Movimiento de Ambulancia Iniciado");
console.log("🚑 =================================================");

const enviarCoordenadas = setInterval(() => {
  if (indice >= rutaAmbulancia.length) {
    console.log("\n🏁 La ambulancia ha llegado a su destino. Fin de la simulación.");
    clearInterval(enviarCoordenadas);
    return;
  }

  const posicionActual = rutaAmbulancia[indice];

  // Construimos el JSON con los datos requeridos por tu controlador
  const data = JSON.stringify({
    amb_id: 1, // ID de la ambulancia de prueba que insertamos en la BD
    ub_latitud: posicionActual.lat,
    ub_longitud: posicionActual.lng
  });

  // Usamos cURL (nativo en Windows/PowerShell) para hacer la petición HTTP PUT sin instalar paquetes extra
  const comandoCurl = `curl -X PUT -H "Content-Type: application/json" -d "${data.replace(/"/g, '\\"')}" http://localhost:3000/api/geolocalizacion/actualizar`;

  exec(comandoCurl, (error, stdout, stderr) => {
    if (error) {
      console.error(`❌ Error al conectar con el servidor: ${error.message}`);
      return;
    }
    
    // Si la API responde bien, veremos el mensaje de éxito del controlador
    console.log(`📡 [Envío ${indice + 1}] Coordenadas enviadas -> Lat: ${posicionActual.lat}, Lng: ${posicionActual.lng}`);
    console.log(`   --> Respuesta API: ${stdout.trim()}`);
    indice++;
  });

}, 4000); // Se ejecuta de forma repetitiva cada 4 segundos