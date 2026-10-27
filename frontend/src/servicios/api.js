
const API_URL = "http://localhost:3000/api";

export async function obtenerInventario() {
  const respuesta = await fetch(`${API_URL}/inventario`);

  if (!respuesta.ok) {
    throw new Error("No se pudo obtener el inventario");
  }

  return await respuesta.json();
}
