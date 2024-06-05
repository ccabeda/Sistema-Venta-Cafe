using SistemaDeVentasCafe.Models;

namespace SistemaDeVentasCafe.Repository.IRepository
{
    public interface IRepositoryFacturaProducto
    {
        Task<List<Facturaproducto>> ListarTodos();
    }
}
