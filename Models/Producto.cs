using System.Text.Json.Serialization;

namespace SistemaDeVentasCafe.Models;

public partial class Producto
{
    public int IdProducto { get; set; }
    public string? Descripcion { get; set; }
    public decimal? PrecioVenta { get; set; }
    public int? StockActual { get; set; }
    public int? NumeroDeLote { get; set; }
    public DateOnly? FechaVencimiento { get; set; }
    [JsonIgnore]
    public virtual ICollection<Facturaproducto> Facturaproductos { get; set; } = new List<Facturaproducto>();
}