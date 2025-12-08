import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Typography,
} from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";
import BarChartIcon from "@mui/icons-material/BarChart";
import PieChartIcon from "@mui/icons-material/PieChart";
import MoneyIcon from "@mui/icons-material/AttachMoneyRounded";
import MovingIcon from "@mui/icons-material/MovingRounded";
import CafeIcon from "@mui/icons-material/LocalCafeOutlined";
import { useTheme } from "@emotion/react";
import axios from "axios";

export default function HomePage() {
  const theme = useTheme();

  // colores de los graficos
  const palette = [
    "#4B2E2E",
    "#6F4E37",
    "#8B4513",
    "#A0522D",
    "#8B5A2B",
    "#7B3F00",
    "#5C4033",
    "#4A2C2A",
    "#3B2F2F",
  ];

  // peticion de facturas y productos
  const [invoices, setInvoices] = useState([]);
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0); // ingresos totales
  const [productSalesData, setProductSalesData] = useState([]);
  const request_get = async () => {
    try {
      const [productsResponse, invoicesResponse] = await Promise.all([
        axios.get("http://localhost:5224/api/Producto/Listar"),
        axios.get("http://localhost:5224/api/Factura/Listar"),
      ]);

      setProducts(productsResponse.data.resultado);
      setInvoices(invoicesResponse.data.resultado);
      console.log(invoicesResponse.data.resultado);

      // total de ingresos
      const sum = invoicesResponse.data.resultado
        .filter((invoice) => invoice.estadoPago === true)
        .reduce((sum, invoice) => sum + invoice.precioTotal, 0);
      setTotal(sum);

      // ventas en los ultimos 7 dias
      const salesCount = countSalesLast7Days(invoicesResponse.data.resultado);
      setSalesCount(salesCount);

      // ventas de cada producto
      const productsSales = countProductsSales(
        invoicesResponse.data.resultado,
        productsResponse.data.resultado
      );
      setProductSalesData(productsSales);
    } catch (error) {
      console.error("error al traer productos y facturas:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await request_get();
    };
    fetchData();
  }, []);

  // contar ventas en los ultimos 7 dias
  const [salesCount, setSalesCount] = useState([]);
  const countSalesLast7Days = (invoices) => {
    const salesCount = Array(7).fill(0);
    const today = new Date();
    const todayStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    invoices.forEach((invoice) => {
      const invoiceDate = new Date(invoice.fechaFactura);
      const diffInTime = todayStart.getTime() - invoiceDate.getTime();
      const diffInDays = Math.floor(diffInTime / (1000 * 3600 * 24));

      if (diffInDays < 7 && diffInDays >= 0) {
        salesCount[6 - diffInDays]++;
      }
    });

    return salesCount;
  };

  // contar ventas de cada producto
  const countProductsSales = (invoices, products) => {
    const productSales = {};

    // contar ventas de cada producto
    invoices.forEach((invoice) => {
      invoice.lista_De_Productos.forEach((item) => {
        if (productSales[item.idProducto]) {
          productSales[item.idProducto] += item.cantidadDelProducto;
        } else {
          productSales[item.idProducto] = item.cantidadDelProducto;
        }
      });
    });

    // obtener nombres de los productos
    const productSalesData = Object.keys(productSales).map((key) => {
      const productName =
        products.find((product) => product.idProducto === parseInt(key, 10))
          ?.descripcion || `Producto ${key}`;
      return {
        id: key,
        value: productSales[key],
        label: productName,
      };
    });

    // ordenar productos por ventas (mayor a menor)
    productSalesData.sort((a, b) => b.value - a.value);

    // obtener los 5 mas vendidos y agrupar el resto como "otros"
    const top5Products = productSalesData.slice(0, 5);
    const otherProductsTotal = productSalesData
      .slice(5)
      .reduce((total, product) => total + product.value, 0);

    const newData = [
      ...top5Products,
      { id: "otros", value: otherProductsTotal, label: "Otros" },
    ];

    return newData;
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="flex-start">
      <h2>Resumen</h2>

      <Grid container spacing={3}>
        {/* card de la barchart */}
        <Grid item xl={6} lg={12} md={12} sm={12} xs={12}>
          <Card
            sx={{
              width: "100%",
              height: "100%",
              border:
                theme.palette.mode === "light" ? "1px solid #ccc" : "none",
              marginBottom: 3,
              borderRadius: 2,
            }}
          >
            <CardHeader
              title={
                <Box display="flex" alignItems="center">
                  <BarChartIcon
                    fontSize="large"
                    sx={{ color: "#fff", marginRight: 1.5 }}
                  />
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{ color: "#fff" }}
                  >
                    Ventas en los últimos 7 días
                  </Typography>
                </Box>
              }
              sx={{
                backgroundColor:
                  theme.palette.mode === "light"
                    ? theme.palette.secondary.dark
                    : null,
              }}
            />
            <CardContent>
              <Box display="flex" alignItems="center">
                <BarChart
                  xAxis={[
                    {
                      scaleType: "band",
                      data: [
                        "Lunes",
                        "Martes",
                        "Miércoles",
                        "Jueves",
                        "Viernes",
                        "Sábado",
                        "Domingo",
                      ],
                    },
                  ]}
                  series={[{ data: salesCount }]}
                  width={800}
                  height={500}
                  borderRadius={7}
                  colors={palette}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* card del pie */}
        <Grid item xl={4} lg={8} md={12} sm={12} xs={12}>
          <Card
            sx={{
              width: "100%",
              height: "100%",
              border:
                theme.palette.mode === "light" ? "1px solid #ccc" : "none",
              marginBottom: 3,
              borderRadius: 2,
            }}
          >
            <CardHeader
              title={
                <Box display="flex" alignItems="center">
                  <PieChartIcon
                    fontSize="large"
                    sx={{ color: "#fff", marginRight: 1.5 }}
                  />
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{ color: "#fff" }}
                  >
                    Productos más vendidos
                  </Typography>
                </Box>
              }
              sx={{
                backgroundColor:
                  theme.palette.mode === "light"
                    ? theme.palette.secondary.dark
                    : null,
              }}
            />
            <CardContent>
              <Box display="flex" alignItems="center">
                <PieChart
                  colors={palette}
                  series={[
                    {
                      data: productSalesData,
                      cornerRadius: 5,
                      paddingAngle: 1,
                      innerRadius: 80,
                      outerRadius: 185,
                      cx: "63%",
                      cy: 190,
                    },
                  ]}
                  width={500}
                  height={500}
                  slotProps={{
                    legend: {
                      direction: "column",
                      position: {
                        horizontal: "left",
                        vertical: "bottom",
                      },
                      itemGap: 5,
                    },
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        {/* cards */}
        <Grid item xl={2} lg={4} md={12} sm={12} xs={12}>
          <Grid container sx={{ height: "100%", width: "100%" }}>
            <Grid
              item
              xl={12}
              lg={12}
              md={4}
              sm={4}
              xs={4}
              sx={{
                marginBottom: { lg: 3, xl: 3 },
              }}
            >
              <Card
                sx={{
                  width: "100%",
                  height: "100%",
                  border:
                    theme.palette.mode === "light" ? "1px solid #ccc" : "none",
                  marginBottom: 3,
                  borderRadius: 2,
                }}
              >
                <CardHeader
                  title={
                    <Box display="flex" alignItems="center">
                      <MovingIcon
                        fontSize="large"
                        sx={{ color: "#fff", marginRight: 1 }}
                      />
                      <Typography
                        component="div"
                        sx={{ color: "#fff", fontSize: "1.2rem" }}
                      >
                        Ventas Totales
                      </Typography>
                    </Box>
                  }
                  sx={{
                    backgroundColor:
                      theme.palette.mode === "light"
                        ? theme.palette.secondary.dark
                        : null,
                  }}
                />
                <CardContent>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent={"center"}
                  >
                    <Typography variant={"h4"}> {invoices.length} </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid
              item
              xl={12}
              lg={12}
              md={4}
              sm={4}
              xs={4}
              sx={{
                marginBottom: { lg: 3, xl: 3 },
              }}
            >
              <Card
                sx={{
                  width: "100%",
                  height: "100%",
                  border:
                    theme.palette.mode === "light" ? "1px solid #ccc" : "none",
                  marginBottom: 3,
                  borderRadius: 2,
                }}
              >
                <CardHeader
                  title={
                    <Box display="flex" alignItems="center">
                      <MoneyIcon
                        fontSize="large"
                        sx={{ color: "#fff", marginRight: 1 }}
                      />
                      <Typography
                        component="div"
                        sx={{ color: "#fff", fontSize: "1.2rem" }}
                      >
                        Ingresos
                      </Typography>
                    </Box>
                  }
                  sx={{
                    backgroundColor:
                      theme.palette.mode === "light"
                        ? theme.palette.secondary.dark
                        : null,
                  }}
                />
                <CardContent>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent={"center"}
                  >
                    <Typography variant={"h4"}>
                      $
                      {total.toLocaleString("es-ES", {
                        maximumFractionDigits: 2,
                      })}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid
              item
              xl={12}
              lg={12}
              md={4}
              sm={4}
              xs={4}
              sx={{
                marginBottom: { lg: 0, xl: 0 },
              }}
            >
              <Card
                sx={{
                  width: "100%",
                  height: "100%",
                  border:
                    theme.palette.mode === "light" ? "1px solid #ccc" : "none",
                  marginBottom: 3,
                  borderRadius: 2,
                }}
              >
                <CardHeader
                  title={
                    <Box display="flex" alignItems="center">
                      <CafeIcon
                        fontSize="large"
                        sx={{ color: "#fff", marginRight: 0.7 }}
                      />
                      <Typography
                        component="div"
                        sx={{ color: "#fff", fontSize: "1.2rem" }}
                      >
                        Productos Totales
                      </Typography>
                    </Box>
                  }
                  sx={{
                    backgroundColor:
                      theme.palette.mode === "light"
                        ? theme.palette.secondary.dark
                        : null,
                  }}
                />
                <CardContent>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent={"center"}
                  >
                    <Typography variant={"h4"}> {products.length} </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
