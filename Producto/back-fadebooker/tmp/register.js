(async () => {
  try {
    const res = await fetch('http://localhost:3000/api/usuarios/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: 'ProveedorNode',
        apellido: 'Cinco',
        email: 'proveedor-node@example.local',
        contrasena: 'Secret123!',
        rol: 'Proveedor'
      })
    })
    const text = await res.text()
    console.log(text)
  } catch (e) {
    console.error(e)
  }
})()
