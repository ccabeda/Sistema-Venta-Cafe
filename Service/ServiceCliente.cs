using AutoMapper;
using iTextSharp.xmp.impl;
using Microsoft.AspNetCore.Mvc;
using SistemaDeVentasCafe.CodigoRepetido;
using SistemaDeVentasCafe.DTOs;
using SistemaDeVentasCafe.Models;
using SistemaDeVentasCafe.Service.IService;
using SistemaDeVentasCafe.UnitOfWork;

namespace SistemaDeVentasCafe.Service
{
    public class ServiceCliente : IServiceGeneric<ClienteUpdateDto, ClienteCreateDto> 
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly APIResponse _apiresponse;
        private readonly ILogger<ServiceCliente> _logger;
        public ServiceCliente(IMapper mapper, APIResponse apiresponse, ILogger<ServiceCliente> logger, IUnitOfWork unitOfWork)
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
                List<Cliente> lista = await _unitOfWork.repositoryCliente.ListarTodos();
                if (lista.Count == 0)
                {
                    _logger.LogError("La lista de clientes esta vacia.");
                    return Utilidades.NotFoundResponse(_apiresponse);
                }
                _logger.LogInformation("Lista de clientes traida con exito.");
                return Utilidades.ListOKResponse(lista, _apiresponse);
            }
            catch (Exception ex)
            {
                return Utilidades.ErrorHandling(ex, _apiresponse, _logger);
            }
        }

        public async Task<APIResponse> ObtenerPorId( int id)
        {
            try
            {
                var cliente = await _unitOfWork.repositoryCliente.ObtenerPorId(id);
                if (cliente == null)
                {
                    _logger.LogError("No existe cliente con ese id.");
                    return Utilidades.NotFoundResponse(_apiresponse);
                }
                _logger.LogInformation("Cliente traido con exito.");
                return Utilidades.OKResponse(cliente, _apiresponse);
            }
            catch (Exception ex)
            {
                return Utilidades.ErrorHandling(ex, _apiresponse, _logger);
            }
        }

        public async Task<APIResponse> Crear([FromBody] ClienteCreateDto clienteCreateDto)
        {
            try
            {
                var cliente = _mapper.Map<Cliente>(clienteCreateDto);
                await _unitOfWork.repositoryCliente.Crear(cliente);
                await _unitOfWork.Save();
                _logger.LogInformation("Cliente creado con exito.");
                return Utilidades.CreatedResponse(_apiresponse);
            }
            catch (Exception ex)
            {
                return Utilidades.ErrorHandling(ex, _apiresponse, _logger);
            }
        }

        public async Task<APIResponse> Actualizar([FromBody] ClienteUpdateDto clienteUpdateDto)
        {
            try
            {
                var cliente = await _unitOfWork.repositoryCliente.ObtenerPorId(clienteUpdateDto.IdCliente);
                if (cliente == null)
                {
                    _logger.LogError("No existe un cliente con esa id.");
                    return Utilidades.NotFoundResponse(_apiresponse);
                }
                _mapper.Map(clienteUpdateDto, cliente);
                await _unitOfWork.repositoryCliente.Actualizar(cliente);
                await _unitOfWork.Save();
                _logger.LogInformation("Cliente actualizado con exito.");
                return Utilidades.OKResponse(cliente, _apiresponse);
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
                var cliente = await _unitOfWork.repositoryCliente.ObtenerPorId(id);
                var listafacturas = await _unitOfWork.repositoryFactura.ListarTodos();
                if (cliente == null)
                {
                    _logger.LogError("No existe un cliente con esa id.");
                    return Utilidades.NotFoundResponse(_apiresponse);
                }
                if (!Utilidades.PrevenirEliminarCliente(listafacturas, cliente.IdCliente))
                {
                    _logger.LogError("El cliente no se puede eliminar porque hay una factura que contiene su Id.");
                    return Utilidades.NotFoundResponse(_apiresponse);
                }
                await _unitOfWork.repositoryCliente.Eliminar(cliente);
                await _unitOfWork.Save();
                _logger.LogInformation("Cliente eliminado con exito.");
                return Utilidades.OKResponse(cliente, _apiresponse);
            }
            catch (Exception ex)
            {
                return Utilidades.ErrorHandling(ex, _apiresponse, _logger);
            }
        }
    }
}
