using FluentValidation;
using SistemaDeVentasCafe.DTOs;

namespace SistemaDeVentasCafe.Validaciones
{
    public class QRCreateValidaciones : AbstractValidator<QRCreateDto>
    {
        public QRCreateValidaciones()
        {
            RuleFor(a => a.Nombre).NotEmpty().WithMessage("El nombre no puede estar vacio.");
            RuleFor(a => a.Apellido).NotEmpty().WithMessage("El apellido no puede estar vacio.");
            RuleFor(a => a.Pais).NotEmpty().WithMessage("EL país no puede estar vacio.");
            RuleFor(a => a.Localidad).NotEmpty().WithMessage("La localidad no puede estar vacia.");
        }
    }
}
