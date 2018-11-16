const styles = theme => {
  return {
    progress: {
      opacity: 0,
      transition: "opacity 0.3s",
      "&.visible": {
        opacity: 1
      }
    },
    overlayCargando: {
      backgroundColor: "rgba(255,255,255,0.6)",
      position: "absolute",
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      opacity: 0,
      borderRadius: "16px",
      pointerEvents: "none",
      transition: "opacity 0.3s",
      "&.visible": {
        opacity: 1,
        pointerEvents: "auto"
      }
    },
    root: {
      display: "flex",
      width: "100%",
      flexDirection: "column",
      height: "100%",
      justifyContent: "center"
    },
    card: {
      overflow: "hidden",
      position: "relative"
    },
    cardRoot: {
      maxHeight: "100%",
      [theme.breakpoints.up("sm")]: {
        maxHeight: "670px"
      },
      maxWidth: "900px",
      alignSelf: "center",
      height: "100%",
      opacity: 0,
      transform: "translateY(100px)",
      transition: "all 0.3s",
      "&.visible": {
        opacity: 1,
        transform: "translateY(0)"
      }
    },
    cardContent: {
      height: "100%",
      maxHeight: "100%",
      display: "flex",
      flexDirection: "column",
      flex: 1,
      "& > div": {
        display: "flex",
        flexDirection: "column",
        flex: 1
      }
    },
    header: {
      paddingBottom: "0",
      display: "flex",
      alignItems: "center"
    },
    contenedorTextosSistema: {
      marginLeft: "16px"
    },
    imagenLogoMuni: {
      width: "64px",
      height: "64px",
      backgroundImage: "url(https://servicios2.cordoba.gov.ar/VecinoVirtualUtils_Internet/Resources/Imagenes/escudo_verde.png)",
      backgroundRepeat: "no-repeat",
      backgroundSize: "contain",
      backgroundPosition: "center"
    },
    contentSwapper: {
      height: "100%",
      flex: 1,
      display: "flex",
      "& > span": { width: "100%" }
    },
    contentSwapperContent: {
      height: "100%",
      width: "100%",
      display: "flex"
    },
    contenedorPaginaExtra: {
      position: "absolute",
      left: 0,
      top: 0,
      bottom: 0,
      right: 0
    },
    content: {
      overflow: "auto",
      flex: 1,
      display: "flex",
      flexDirection: "column",
      position: "relative"
    },
    mainContent: {
      flex: 1,
      overflow: "auto"
    },
    footer: {
      borderTop: "1px solid rgba(0,0,0,0.1)",
      padding: "16px",
      display: "flex"
    },
    paginaExtra: {
      position: "absolute",
      backgroundColor: "white",
      height: "100%",
      width: "100%",
      display: "flex",
      opacity: 0,
      pointerEvents: "none",
      transition: "all 0.3s",
      "&.visible": {
        opacity: 1,
        pointerEvents: "all"
      }
    },
    contenedorInfo: {
      display: "flex",
      padding: "20px",
      alignItems: "center",
      backgroundColor: "#FFFDE7",
      "& > .material-icons": {
        marginRight: "8px"
      }
    }
  };
};
export default styles;
