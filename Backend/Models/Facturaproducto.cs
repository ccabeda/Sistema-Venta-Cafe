using System.Text.Json.Serialization;

namespace SistemaDeVentasCafe.Models;

public partial class Facturaproducto
{
    [JsonIgnore]
    public int IdFacturaProductos { get; set; }
    public int? CantidadDelProducto { get; set; }
    [JsonIgnore]
    public int IdFactura { get; set; }
    public int IdProducto { get; set; }
    [JsonIgnore]
    public virtual Factura? fFactura { get; set; }
    [JsonIgnore]
    public virtual Producto? fProducto { get; set; }
}