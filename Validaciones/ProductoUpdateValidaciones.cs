using FluentValidation;
using SistemaDeVentasCafe.DTOs;

namespace SistemaDeVentasCafe.Validaciones
{
    public class ProductoUpdateValidaciones : AbstractValidator<ProductoUpdateDto>
    {
        public ProductoUpdateValidaciones()
        {
            RuleFor(a => a.Descripcion).NotEmpty().WithMessage("La descripción no puede estar vacio.");
            RuleFor(a => a.StockActual).NotEmpty().WithMessage("El stock no puede estar vacio.");
            RuleFor(a => a.NumeroDeLote).NotEmpty().WithMessage("El número de lote no puede estar vacio.");
            RuleFor(a => a.FechaVencimiento).NotEmpty().WithMessage("La fecha de vencimiento no puede estar vacia.");
            RuleFor(a => a.PrecioVenta).NotEmpty().WithMessage("El precio de caducidad no puede estar vacio.");
        }
    }
}
