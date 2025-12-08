using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using SistemaDeVentasCafe.CodigoRepetido;
using SistemaDeVentasCafe.DTOs;
using SistemaDeVentasCafe.Models;
using SistemaDeVentasCafe.Service.IService;
using SistemaDeVentasCafe.UnitOfWork;

namespace SistemaDeVentasCafe.Service
{
    public class ServiceProducto : IServiceGeneric<ProductoUpdateDto, ProductoCreateDto> 
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly APIResponse _apiresponse;
        private readonly ILogger<ServiceProducto> _logger;
        public ServiceProducto(IMapper mapper, APIResponse apiresponse, ILogger<ServiceProducto> logger, IUnitOfWork unitOfWork)
        {
            _mapper = mapper;
            _apiresponse = apiresponse;
            _logger = logger;
            _unitOfWork = unitOfWork;
        }

        public async Task<APIResponse> Listar()
        {
            try
            {
                List<Producto> lista = await _unitOfWork.repositoryProducto.ListarTodos();
                if (lista.Count == 0)
                {
                    _logger.LogError("La lista de productos esta vacia.");
                    return Utilidades.NotFoundResponse(_apiresponse);
                }
                _logger.LogInformation("Lista de productos traida con exito.");
                return Utilidades.ListOKResponse(lista, _apiresponse);
            }
            catch (Exception ex)
            {
                return Utilidades.ErrorHandling(ex, _apiresponse, _logger);
            }
        }

        public async Task<APIResponse> ObtenerPorId(int id)
        {
            try
            {
                var producto = await _unitOfWork.repositoryProducto.ObtenerPorId(id);
                if (producto == null)
                {
                    _logger.LogError("No existe producto con ese id.");
                    return Utilidades.NotFoundResponse(_apiresponse);
                }
                _logger.LogInformation("Producto traido con exito.");
                return Utilidades.OKResponse(producto, _apiresponse);
            }
            catch (Exception ex)
            {
                return Utilidades.ErrorHandling(ex, _apiresponse, _logger);
            }
        }

        public async Task<APIResponse> Crear([FromBody] ProductoCreateDto productoCreateDto)
        {
            try
            {
                var producto = _mapper.Map<Producto>(productoCreateDto);
                await _unitOfWork.repositoryProducto.Crear(producto);
                await _unitOfWork.Save();
                _logger.LogInformation("Producto creado con exito.");
                return Utilidades.CreatedResponse(_apiresponse);
            }
            catch (Exception ex)
            {
                return Utilidades.ErrorHandling(ex, _apiresponse, _logger);
            }
        }

        public async Task<APIResponse> Actualizar([FromBody] ProductoUpdateDto productoUpdateDto)
        {
            try
            {
                var producto = await _unitOfWork.repositoryProducto.ObtenerPorId(productoUpdateDto.IdProducto);
                if (producto == null)
                {
                    _logger.LogError("No existe un producto con esa id.");
                    return Utilidades.NotFoundResponse(_apiresponse);
                }
                _mapper.Map(productoUpdateDto, producto);
                await _unitOfWork.repositoryProducto.Actualizar(producto);
                await _unitOfWork.Save();
                _logger.LogInformation("Producto actualizado con exito.");
                return Utilidades.OKResponse(producto, _apiresponse);
            }
            catch (Exception ex)
            {
                return Utilidades.ErrorHandling(ex, _apiresponse, _logger);
            }
        }

        public async Task<APIResponse> Eliminar(int id)
        {
            try
            {
                var producto = await _unitOfWork.repositoryProducto.ObtenerPorId(id);
                var listafacturas = await _unitOfWork.repositoryFacturaProducto.ListarTodos();
                if (producto == null)
                {
                    _logger.LogError("No existe un producto con esa id.");
                    return Utilidades.NotFoundResponse(_apiresponse);
                }
                if (!Utilidades.PrevenirEliminarProducto(listafacturas, producto.IdProducto))
                {
                    _logger.LogError("El producto no se puede eliminar porque hay una factura que esta relacionada con el.");
                    return Utilidades.NotFoundResponse(_apiresponse);
                }
                await _unitOfWork.repositoryProducto.Eliminar(producto);
                await _unitOfWork.Save();
                _logger.LogInformation("Producto eliminado con exito.");
                return Utilidades.OKResponse(producto, _apiresponse);
            }
            catch (Exception ex)
            {
                return Utilidades.ErrorHandling(ex, _apiresponse, _logger);
            }
        }
    }
}
