using System.Net;

namespace SistemaDeVentasCafe.Models
{
    public class APIResponse //clase para encapsular las respuestas de los endpoints y que sean iguales
    {
        public HttpStatusCode statusCode { get; set; } //almacena el codigo de estado que retorne el endpoint
        public bool fueExitoso { get; set; } = true; //verifica si fue exitoso o ocurrio un error en el endpoint
        public List<String>? Errores { get; set; } //lista para guardar los mensajes de error
        public object? Resultado { get; set; } //almacena el objeto a devolver en los endpoints
    }
}

