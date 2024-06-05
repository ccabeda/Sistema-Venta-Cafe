using SistemaDeVentasCafe.Models;

namespace SistemaDeVentasCafe.Repository.IRepository
{
    public interface IRepositoryMedioDePago
    {
        Task Crear(Mediodepago medioDePago);
        Task<Mediodepago?> ObtenerPorId(int id);
    }
}
