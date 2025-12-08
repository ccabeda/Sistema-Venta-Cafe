import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableContainer,
  TableHead,
  TableCell,
  TableBody,
  TableRow,
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/EditRounded";
import DeleteIcon from "@mui/icons-material/DeleteRounded";
import ArrowBackIosRounded from "@mui/icons-material/ArrowBackIosRounded";
import ArrowForwardIosRounded from "@mui/icons-material/ArrowForwardIosRounded";

export default function ClientsPage({ showAlert }) {
  const [clients, setClients] = useState([]);
  const [data, setData] = useState([]);

  // peticion de clientes
  const request_get = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5224/api/Cliente/Listar"
      );
      setClients(response.data.resultado);
    } catch (error) {
      console.error("error al traer clientes:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await request_get();
    };
    fetchData();
  }, []);

  // peticion post
  const request_post = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5224/api/Cliente/Registrar",
        clientSelected
      );
      console.log("cliente agregado: ", response.data);
      await request_get();
      toggledialogAdd();
      showAlert("Cliente agregado", "success");
    } catch (error) {
      console.log("error al agregar cliente: ", error);
      showAlert("Error", "error");
    }
  };

  // peticion put
  const request_put = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5224/api/Cliente/Modificar`,
        clientSelected
      );
      console.log("cliente actualizado:", response.data);
      request_get();
      toggledialogEdit();
      showAlert("Cliente editado", "warning", <EditIcon />);
    } catch (error) {
      console.error("error al actualizar cliente: ", error);
      showAlert("Error", "error");
    }
  };

  // peticion delete
  const request_delete = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:5224/api/Cliente/Anular/` + clientSelected.idCliente,
        clientSelected
      );
      console.log("cliente eliminado correctamente");
      request_get();
      toggledialogDelete();
      showAlert("Cliente eliminado", "error", <DeleteIcon />);
    } catch (error) {
      console.error("error al eliminar cliente: ", error);
      showAlert("Error", "error");
    }
  };

  // cliente seleccionado
  const [clientSelected, setClientSelected] = useState({
    dni: 0,
    nombre: "",
    apellido: "",
    telefono: 0,
    correoElectronico: "",
  });

  // seleccionar cliente
  const selectClient = (client, action) => {
    setClientSelected(client);
    action === "edit" ? toggledialogEdit() : toggledialogDelete();
  };

  // manejar cambios en textfields
  const handleChange = (e) => {
    const { name, value } = e.target;
    // si el campo es numerico, convertir a int/float
    const parsedValue =
      name === "dni" || name === "telefono" ? parseFloat(value) : value;
    setClientSelected((prevState) => ({
      ...prevState,
      [name]: parsedValue,
    }));
  };

  // abrir/cerrar dialogs
  const [dialogAdd, setDialogAdd] = useState(false);
  const toggledialogAdd = () => {
    setDialogAdd(!dialogAdd);
  };

  const [dialogEdit, setDialogEdit] = useState(false);
  const toggledialogEdit = () => {
    setDialogEdit(!dialogEdit);
  };

  const [dialogDelete, setDialogDelete] = useState(false);
  const toggledialogDelete = () => {
    setDialogDelete(!dialogDelete);
  };

  // filtrado de  clientes
  const [searchQuery, setSearchQuery] = useState("");
  const filteredClients = clients.filter(
    (client) =>
      client.nombre.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
      client.apellido.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
      client.idCliente.toString().startsWith(searchQuery)
  );

  // paginado
  const [page, setPage] = useState(1);
  const clientsPerPage = 9; // clientes por pagina

  const handleNextPage = () => {
    setPage(page + 1);
  };
  const handlePrevPage = () => {
    setPage(page - 1);
  };

  const indexOfLastClient = page * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;
  const currentClients = filteredClients.slice(
    indexOfFirstClient,
    indexOfLastClient
  );

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" alignItems={"center"}>
          <h2>Clientes</h2>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <TextField
            label="Buscar"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="small"
            sx={{ width: 400 }}
          />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <Button
            variant={"contained"}
            onClick={toggledialogAdd}
            color={"secondary"}
          >
            Agregar cliente
          </Button>
        </Box>
        <Box sx={{ marginLeft: "auto", display: "flex" }}>
          <IconButton
            size="large"
            onClick={handlePrevPage}
            disabled={page === 1}
            sx={{ height: "90%" }}
          >
            <ArrowBackIosRounded />
          </IconButton>
          <IconButton
            size="large"
            onClick={handleNextPage}
            disabled={indexOfLastClient >= filteredClients.length}
            sx={{ height: "90%" }}
          >
            <ArrowForwardIosRounded />
          </IconButton>
        </Box>
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">ID</TableCell>
              <TableCell align="center">DNI</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Apellido</TableCell>
              <TableCell>Telefono</TableCell>
              <TableCell>Correo Electronico</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentClients.map((client) => (
              <TableRow key={client.idCliente}>
                <TableCell align="center">{client.idCliente}</TableCell>
                <TableCell align="center">{client.dni}</TableCell>
                <TableCell>{client.nombre}</TableCell>
                <TableCell>{client.apellido}</TableCell>
                <TableCell>{client.telefono}</TableCell>
                <TableCell>{client.correoElectronico}</TableCell>
                <TableCell align="center">
                  <Tooltip title="Editar" arrow>
                    <IconButton
                      size="small"
                      onClick={() => selectClient(client, "edit")}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  &nbsp;&nbsp;&nbsp;
                  <Tooltip title="Eliminar" arrow>
                    <IconButton
                      size="small"
                      onClick={() => selectClient(client, "delete")}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* dialog de agregar cliente*/}
      <Dialog open={dialogAdd} onClose={toggledialogAdd}>
        <DialogTitle>Agregar Nuevo Cliente</DialogTitle>
        <DialogContent sx={{ paddingBottom: 1 }}>
          <TextField
            label="DNI"
            name="dni"
            fullWidth
            sx={{
              marginBottom: 1,
              marginTop: 0.7,
              "& input[type=number]": {
                "-moz-appearance": "textfield",
              },
              "& input[type=number]::-webkit-outer-spin-button": {
                "-webkit-appearance": "none",
                margin: 0,
              },
              "& input[type=number]::-webkit-inner-spin-button": {
                "-webkit-appearance": "none",
                margin: 0,
              },
            }}
            onChange={handleChange}
            autoComplete="off"
            type="number"
          />
          <TextField
            label="Nombre"
            name="nombre"
            fullWidth
            sx={{ marginBottom: 1 }}
            onChange={handleChange}
            autoComplete="off"
          />
          <TextField
            label="Apellido"
            name="apellido"
            fullWidth
            sx={{ marginBottom: 1 }}
            onChange={handleChange}
            autoComplete="off"
          />
          <TextField
            label="Telefono"
            name="telefono"
            fullWidth
            sx={{
              marginBottom: 1,
              "& input[type=number]": {
                "-moz-appearance": "textfield",
              },
              "& input[type=number]::-webkit-outer-spin-button": {
                "-webkit-appearance": "none",
                margin: 0,
              },
              "& input[type=number]::-webkit-inner-spin-button": {
                "-webkit-appearance": "none",
                margin: 0,
              },
            }}
            onChange={handleChange}
            autoComplete="off"
            type="number"
          />
          <TextField
            label="Correo Electronico"
            name="correoElectronico"
            fullWidth
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions sx={{ marginRight: 2, marginBottom: 1 }}>
          <Button
            onClick={toggledialogAdd}
            variant={"contained"}
            color={"error"}
          >
            Cancelar
          </Button>
          <Button
            variant={"contained"}
            color={"success"}
            onClick={request_post}
          >
            Agregar
          </Button>
        </DialogActions>
      </Dialog>

      {/* dialog de editar cliente*/}
      <Dialog open={dialogEdit} onClose={toggledialogEdit}>
        <DialogTitle>Editar Cliente</DialogTitle>
        <DialogContent sx={{ paddingBottom: 1 }}>
          <TextField
            label="DNI"
            name="dni"
            fullWidth
            sx={{
              marginBottom: 1,
              marginTop: 0.7,
              "& input[type=number]": {
                "-moz-appearance": "textfield",
              },
              "& input[type=number]::-webkit-outer-spin-button": {
                "-webkit-appearance": "none",
                margin: 0,
              },
              "& input[type=number]::-webkit-inner-spin-button": {
                "-webkit-appearance": "none",
                margin: 0,
              },
            }}
            onChange={handleChange}
            value={clientSelected && clientSelected.dni}
            autoComplete="off"
            type="number"
          />
          <TextField
            label="Nombre"
            name="nombre"
            fullWidth
            sx={{ marginBottom: 1 }}
            onChange={handleChange}
            value={clientSelected && clientSelected.nombre}
            autoComplete="off"
          />
          <TextField
            label="Apellido"
            name="apellido"
            fullWidth
            sx={{ marginBottom: 1 }}
            onChange={handleChange}
            value={clientSelected && clientSelected.apellido}
            autoComplete="off"
          />
          <TextField
            label="Telefono"
            name="telefono"
            fullWidth
            sx={{
              marginBottom: 1,
              "& input[type=number]": {
                "-moz-appearance": "textfield",
              },
              "& input[type=number]::-webkit-outer-spin-button": {
                "-webkit-appearance": "none",
                margin: 0,
              },
              "& input[type=number]::-webkit-inner-spin-button": {
                "-webkit-appearance": "none",
                margin: 0,
              },
            }}
            onChange={handleChange}
            value={clientSelected && clientSelected.telefono}
            autoComplete="off"
            type="number"
          />
          <TextField
            label="Correo Electronico"
            name="correoElectronico"
            fullWidth
            onChange={handleChange}
            value={clientSelected && clientSelected.correoElectronico}
          />
        </DialogContent>
        <DialogActions sx={{ marginRight: 2, marginBottom: 1 }}>
          <Button
            onClick={toggledialogEdit}
            variant={"contained"}
            color={"error"}
          >
            Cancelar
          </Button>
          <Button variant={"contained"} color={"success"} onClick={request_put}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* dialog de eliminar cliente*/}
      <Dialog open={dialogDelete} onClose={toggledialogDelete}>
        <DialogTitle>Seguro que desea elimninar?</DialogTitle>
        <DialogActions sx={{ marginRight: 2, marginBottom: 1 }}>
          <Button
            onClick={toggledialogDelete}
            variant={"contained"}
            color={"error"}
          >
            No
          </Button>
          <Button
            variant={"contained"}
            color={"success"}
            onClick={request_delete}
          >
            Si
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
