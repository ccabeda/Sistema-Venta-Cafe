using System.Text.Json.Serialization;

namespace SistemaDeVentasCafe.Models;

public partial class Cliente
{
    public int IdCliente { get; set; }
    public int? Dni { get; set; }
    public string? Nombre { get; set; }
    public string? Apellido { get; set; }
    public int? Telefono { get; set; }
    public string? CorreoElectronico { get; set; }

    [JsonIgnore]
    public virtual ICollection<Factura> Facturas { get; set; } = new List<Factura>();
}