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
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

export default function ProductsPage({ showAlert }) {
  const [products, setProducts] = useState([]);

  // peticion de productos
  const request_get = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5224/api/Producto/Listar"
      );
      setProducts(response.data.resultado);
    } catch (error) {
      console.error("error al traer productos:", error);
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
    console.log("productSelected: ", productSelected);
    try {
      const response = await axios.post(
        "http://localhost:5224/api/Producto/Registrar",
        productSelected
      );
      console.log("producto agregado: ", response.data);
      await request_get();
      toggledialogAdd();
      showAlert("Producto agregado", "success");
    } catch (error) {
      console.log("error al agregar producto: ", error);
      showAlert("Error", "error");
    }
  };

  // peticion put
  const request_put = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5224/api/Producto/Modificar`,
        productSelected
      );
      console.log("producto actualizado:", response.data);
      request_get();
      toggledialogEdit();
      showAlert("Producto editado", "warning", <EditIcon />);
    } catch (error) {
      console.error("error al actualizar producto: ", error);
      showAlert("Error", "error");
    }
  };

  // peticion delete
  const request_delete = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:5224/api/Producto/Anular/` +
          productSelected.idProducto,
        productSelected
      );
      console.log("producto eliminado correctamente", response);
      request_get();
      toggledialogDelete();
      showAlert("Producto eliminado", "error", <DeleteIcon />);
    } catch (error) {
      console.error("error al eliminar producto: ", error);
      showAlert("Error", "error");
    }
  };

  // producto seleccionado
  const [productSelected, setProductSelected] = useState({
    descripcion: "",
    precioVenta: 0,
    stockActual: 0,
    numeroDeLote: 0,
    fechaVencimiento: new Date().toISOString(),
  });

  // seleccionar producto
  const selectProduct = (product, action) => {
    setProductSelected(product);
    action === "edit" ? toggledialogEdit() : toggledialogDelete();
  };

  // manejar cambios en textfields
  const handleChange = (e) => {
    const { name, value } = e.target;
    // si el campo es numerico, convertir a int/float
    const parsedValue =
      name === "precioVenta" ||
      name === "stockActual" ||
      name === "numeroDeLote"
        ? parseFloat(value)
        : value;
    setProductSelected((prevState) => ({
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

  // filtrado de  productos
  const [searchQuery, setSearchQuery] = useState("");
  const filteredProducts = products.filter(
    (product) =>
      product.descripcion.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.idProducto.toString().startsWith(searchQuery)
  );

  // paginado
  const [page, setPage] = useState(1);
  const productsPerPage = 9; // productos por pagina

  const handleNextPage = () => {
    setPage(page + 1);
  };
  const handlePrevPage = () => {
    setPage(page - 1);
  };

  const indexOfLastProduct = page * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  // eleccion de fecha de vencimiento
  const [expirationDate, setExpirationDate] = useState(null);
  const handleExpirationDateChange = (date) => {
    setExpirationDate(date);
    try {
      const formattedDate = date ? date.toISOString().slice(0, 10) : null;
      setProductSelected((prevState) => ({
        ...prevState,
        fechaVencimiento: formattedDate,
      }));
      console.log("formattedDate: ", formattedDate);
    } catch (error) {
      console.error("fecha invalida: ", error);
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" alignItems={"center"}>
          <h2>Productos</h2>
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
            Agregar producto
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
            disabled={indexOfLastProduct >= filteredProducts.length}
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
              <TableCell>Descripción</TableCell>
              <TableCell align="center">Precio</TableCell>
              <TableCell align="center">Stock</TableCell>
              <TableCell align="center">Lote</TableCell>
              <TableCell align="center">Vencimiento</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentProducts.map((product) => (
              <TableRow key={product.idProducto}>
                <TableCell align="center">{product.idProducto}</TableCell>
                <TableCell>{product.descripcion}</TableCell>
                <TableCell align="center">{`$${product.precioVenta}`}</TableCell>
                <TableCell align="center">{product.stockActual}</TableCell>
                <TableCell align="center">{product.numeroDeLote}</TableCell>
                <TableCell align="center">{product.fechaVencimiento}</TableCell>
                <TableCell align="center">
                  <Tooltip title="Editar" arrow>
                    <IconButton
                      size="small"
                      onClick={() => selectProduct(product, "edit")}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  &nbsp;&nbsp;&nbsp;
                  <Tooltip title="Eliminar" arrow>
                    <IconButton
                      size="small"
                      onClick={() => selectProduct(product, "delete")}
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

      {/* dialog de agregar producto*/}
      <Dialog open={dialogAdd} onClose={toggledialogAdd}>
        <DialogTitle>Agregar Nuevo Producto</DialogTitle>
        <DialogContent sx={{ paddingBottom: 1 }}>
          <TextField
            label="Descripcion"
            name="descripcion"
            required
            fullWidth
            sx={{ marginBottom: 1, marginTop: 0.7 }}
            onChange={handleChange}
            autoComplete="off"
          />
          <TextField
            label="Precio"
            name="precioVenta"
            required
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
            label="Stock"
            name="stockActual"
            required
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
            label="Numero de Lote"
            name="numeroDeLote"
            required
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
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Fecha de Vencimiento"
              value={expirationDate}
              required
              onChange={(date) => {
                handleExpirationDateChange(date);
              }}
              slotProps={{
                textField: { variant: "outlined" },
              }}
              sx={{ width: "100%" }}
            />
          </LocalizationProvider>
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

      {/* dialog de editar producto*/}
      <Dialog open={dialogEdit} onClose={toggledialogEdit}>
        <DialogTitle>Editar Producto</DialogTitle>
        <DialogContent sx={{ paddingBottom: 1 }}>
          <TextField
            label="Descripcion"
            name="descripcion"
            fullWidth
            sx={{ marginBottom: 1, marginTop: 0.7 }}
            onChange={handleChange}
            value={productSelected && productSelected.descripcion}
            autoComplete="off"
          />
          <TextField
            label="Precio"
            name="precioVenta"
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
            value={productSelected && productSelected.precioVenta}
            autoComplete="off"
            type="number"
          />
          <TextField
            label="Stock"
            name="stockActual"
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
            value={productSelected && productSelected.stockActual}
            autoComplete="off"
            type="number"
          />
          <TextField
            label="Numero de Lote"
            name="numeroDeLote"
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
            value={productSelected && productSelected.numeroDeLote}
            autoComplete="off"
            type="number"
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Fecha de Vencimiento"
              value={
                productSelected ? dayjs(productSelected.fechaVencimiento) : null
              }
              onChange={(date) => {
                handleExpirationDateChange(date);
              }}
              slotProps={{
                textField: { variant: "outlined" },
              }}
              sx={{ width: "100%" }}
            />
          </LocalizationProvider>
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

      {/* dialog de eliminar producto*/}
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
