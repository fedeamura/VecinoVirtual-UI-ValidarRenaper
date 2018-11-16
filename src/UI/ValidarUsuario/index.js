import React from "react";

//Styles
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import "@UI/transitions.css";
import styles from "./styles";

//Router
import { withRouter } from "react-router-dom";

//REDUX
import { connect } from "react-redux";
import { push } from "connected-react-router";

//Componentes
import { Typography, Icon, Button, Grid } from "@material-ui/core";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import { DatePicker } from "material-ui-pickers";
import MiSelect from "@Componentes/MiSelect";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";
import _ from "lodash";
import { CSSTransition } from "react-transition-group";

//Mis componentes
import Validador from "@Componentes/_Validador";
import MiCardLogin from "@Componentes/MiCardLogin";
import ContentSwapper from "@Componentes/ContentSwapper";
import MiPanelMensaje from "@Componentes/MiPanelMensaje";
import MiBanerError from "@Componentes/MiBanerError";

//Mis Rules
import Rules_Usuario from "@Rules/Rules_Usuario";
import classnames from "classnames";

const mapDispatchToProps = dispatch => ({
  redireccionar: url => {
    dispatch(push(url));
  }
});

const mapStateToProps = state => {
  return {};
};

const padding = "2rem";

const PAGINA_EXTRA_ERROR_TOKEN = "PAGINA_EXTRA_ERROR_TOKEN";
const PAGINA_EXTRA_EXITO = "PAGINA_EXTRA_EXITO";
const PAGINA_EXTRA_ERROR_VALIDANDO = "PAGINA_EXTRA_ERROR_VALIDANDO";

const PAGINA_FORM = 1;

class ValidarUsuario extends React.Component {
  constructor(props) {
    super(props);

    const urlParams = new URLSearchParams(props.location.search);

    this.state = {
      token: urlParams.get("token"),
      url: urlParams.get("url"),
      validandoToken: true,
      errorValidandoToken: undefined,
      //Form
      errores: [],
      nombre: "",
      apellido: "",
      dni: "",
      sexo: "m",
      fechaNacimiento: new Date(),
      //UI
      visible: false,
      paginaExtraActual: undefined
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ visible: true });
    }, 500);

    this.validarToken();
  }

  validarToken = () => {
    this.setState(
      {
        validandoToken: true,
        paginaActual: undefined
      },
      () => {
        Rules_Usuario.getDatos(this.state.token)
          .then(data => {
            if (data.validacionDNI === true) {
              this.setState({
                paginaExtraActual: PAGINA_EXTRA_ERROR_TOKEN,
                errorValidandoToken: "Su usuario ya se encuentra validado"
              });
              return;
            }

            let { fechaNacimiento } = data;
            if (fechaNacimiento) {
              fechaNacimiento = this.convertirFechaStringToDate(fechaNacimiento);
            }

            this.setState({
              nombre: data.nombre || "",
              apellido: data.apellido || "",
              dni: (data.dni || "") + "",
              fechaNacimiento: fechaNacimiento || new Date(),
              sexo: data.sexoMasculino || true ? "m" : "f"
            });
            this.cambiarPagina(PAGINA_FORM);
          })
          .catch(error => {
            this.setState({
              errorValidandoToken: error,
              paginaExtraActual: PAGINA_EXTRA_ERROR_TOKEN
            });
          })
          .finally(() => {
            this.setState({ validandoToken: false });
          });
      }
    );
  };

  cambiarPagina = pagina => {
    this.setState({
      paginaAnterior: this.state.paginaActual,
      paginaActual: pagina
    });
  };

  onInputChange = e => {
    let { errores } = this.state;
    errores[e.currentTarget.name] = undefined;
    this.setState({ [e.currentTarget.name]: e.currentTarget.value, errores: errores });
  };

  onInputKeyPress = e => {
    if (e.key === "Enter") {
      this.onBotonValidarClick();
    }
  };

  onInputFechaNacimientoChange = fecha => {
    let { errores } = this.state;
    errores["fechaNacimiento"] = undefined;
    this.setState({ fechaNacimiento: fecha, errores: errores });
  };

  onInputSexoChange = e => {
    this.setState({ sexo: e.target.value });
  };

  onBotonValidarClick = () => {
    let { nombre, apellido, dni, fechaNacimiento, sexo } = this.state;
    console.log(this.state);

    let errores = [];
    errores["nombre"] = Validador.validar([Validador.requerido, Validador.min(nombre, 3), Validador.max(nombre, 50)], nombre);
    errores["apellido"] = Validador.validar([Validador.requerido, Validador.min(apellido, 3), Validador.max(apellido, 50)], apellido);

    errores["dni"] = Validador.validar([Validador.requerido, Validador.numericoEntero, Validador.min(dni, 7), Validador.max(dni, 8)], dni);

    errores["fechaNacimiento"] = fechaNacimiento == undefined ? "Dato requerido" : undefined;

    //Si hay errores, corto aca
    this.setState({ errores: errores });

    let conError = false;
    for (var prop in errores) {
      if (errores.hasOwnProperty(prop) && errores[prop] != undefined) {
        conError = true;
      }
    }

    if (conError) return;

    this.setState({ cargando: true }, () => {
      Rules_Usuario.validarUsuario({
        token: this.state.token,
        nombre: nombre,
        apellido: apellido,
        dni: dni,
        fechaNacimiento: this.convertirFechaNacimientoString(fechaNacimiento),
        sexoMasculino: sexo == "m"
      })
        .then(data => {
          this.setState({ paginaExtraActual: PAGINA_EXTRA_EXITO });
        })
        .catch(error => {
          this.setState({ errorValidando: error, paginaExtraActual: PAGINA_EXTRA_ERROR_VALIDANDO });
        })
        .finally(() => {
          this.setState({ cargando: false });
        });
    });
  };

  convertirFechaStringToDate = fecha => {
    let año = fecha.split("T")[0].split("-")[0];
    let mes = parseInt(fecha.split("T")[0].split("-")[1]) - 1;
    let dia = fecha.split("T")[0].split("-")[2];

    return new Date(año, mes, dia);
  };

  convertirFechaNacimientoString = fecha => {
    let dia = fecha.getDate();
    if (dia < 10) dia = "0" + dia;
    let mes = fecha.getMonth() + 1;
    if (mes < 10) mes = "0" + mes;
    let año = fecha.getFullYear();
    return dia + "/" + mes + "/" + año;
  };

  onBotonReintentarClick = () => {
    this.setState({ paginaExtraActual: undefined });
  };

  onBotonRedirigirClick = () => {
    let { url } = this.state;
    if (url) {
      if (url.indexOf("?") != -1) {
        url += "&token=" + this.state.token;
      } else {
        url += "?token=" + this.state.token;
      }
    }
    window.location.href = url;
  };

  render() {
    const { classes } = this.props;

    const cargando = this.state.cargando || this.state.validandoToken;

    return (
      <React.Fragment>
        <div className={classes.root}>
          <MiCardLogin
            cargando={cargando}
            visible={this.state.visible}
            rootClassName={classes.cardRoot}
            className={classes.card}
            titulo="Vecino Virtual"
            subtitulo="Validar usuario"
          >
            <div className={classes.contenedorInfo}>
              <Icon>info_outline</Icon>
              <Typography variant="body1">
                A partir de ahora para continuar su información debe estar validada formalmente a través del Registro Nacional de las
                Personas
              </Typography>
            </div>
            {this.renderContent()}
            {this.renderContentExtra()}
          </MiCardLogin>
        </div>
      </React.Fragment>
    );
  }

  renderContent() {
    const { classes } = this.props;

    const anim =
      this.state.paginaAnterior == undefined
        ? "cross-fade"
        : this.state.paginaAnterior < this.state.paginaActual
          ? "mover-derecha"
          : "mover-izquierda";

    return (
      <div className={classes.content}>
        <ContentSwapper transitionName={anim} transitionEnterTimeout={500} transitionLeaveTimeout={500} className={classes.contentSwapper}>
          <div key="paginaForm" className={classes.contentSwapperContent} visible={"" + (this.state.paginaActual == PAGINA_FORM)}>
            {this.renderPaginaForm()}
          </div>
        </ContentSwapper>
      </div>
    );
  }

  renderContentExtra() {
    return (
      <React.Fragment>
        <CSSTransition in={this.state.paginaExtraActual == PAGINA_EXTRA_ERROR_VALIDANDO} timeout={300} classNames="anim-fade" unmountOnExit>
          {this.renderPaginaErrorValidando()}
        </CSSTransition>
        <CSSTransition in={this.state.paginaExtraActual == PAGINA_EXTRA_ERROR_TOKEN} timeout={300} classNames="anim-fade" unmountOnExit>
          {this.renderPaginaErrorValidandoToken()}
        </CSSTransition>
        <CSSTransition in={this.state.paginaExtraActual == PAGINA_EXTRA_EXITO} timeout={300} classNames="anim-fade" unmountOnExit>
          {this.renderPaginaExito()}
        </CSSTransition>
      </React.Fragment>
    );
  }

  renderPaginaErrorValidandoToken() {
    return (
      <div style={{ height: "100%", position: "absolute", left: 0, top: 0, boton: 0, right: 0, backgroundColor: "white" }}>
        <MiPanelMensaje error mensaje={this.state.errorValidandoToken} />
      </div>
    );
  }

  renderPaginaForm() {
    let { classes } = this.props;

    return (
      <div className={classes.root}>
        {/* Error  */}
        <MiBanerError
          visible={this.state.mostrarError}
          mensaje={this.state.error}
          onClose={() => {
            this.setState({ mostrarError: false });
          }}
        />

        {/* Contenido */}
        <div className={classes.content}>
          <div style={{ padding: padding, paddingTop: "16px" }}>
            <Grid container spacing={16}>
              <Grid item xs={12} sm={6}>
                <FormControl
                  className={classes.formControl}
                  fullWidth
                  margin="dense"
                  error={this.state.errores["nombre"] !== undefined}
                  aria-describedby="textoNombreError"
                >
                  <InputLabel htmlFor="inputNombre">Nombre</InputLabel>
                  <Input
                    id="inputNombre"
                    autoFocus
                    value={this.state.nombre}
                    name="nombre"
                    inputProps={{
                      maxLength: 30
                    }}
                    type="text"
                    onKeyPress={this.onInputKeyPress}
                    onChange={this.onInputChange}
                  />
                  <FormHelperText id="textoNombreError">{this.state.errores["nombre"]}</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl
                  className={classes.formControl}
                  fullWidth
                  margin="dense"
                  error={this.state.errores["apellido"] !== undefined}
                  aria-describedby="textoApellidoError"
                >
                  <InputLabel htmlFor="inputApellido">Apellido</InputLabel>
                  <Input
                    id="inputApellido"
                    value={this.state.apellido}
                    name="apellido"
                    inputProps={{
                      maxLength: 30
                    }}
                    type="text"
                    onKeyPress={this.onInputKeyPress}
                    onChange={this.onInputChange}
                  />
                  <FormHelperText id="textoApellidoError">{this.state.errores["apellido"]}</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl
                  className={classes.formControl}
                  fullWidth
                  margin="dense"
                  error={this.state.errores["dni"] !== undefined}
                  aria-describedby="textoDniError"
                >
                  <InputLabel htmlFor="inputDni">N° de Documento</InputLabel>
                  <Input
                    id="inputDni"
                    value={this.state.dni}
                    name="dni"
                    type="number"
                    onKeyPress={this.onInputKeyPress}
                    onChange={this.onInputChange}
                  />
                  <FormHelperText id="textoDniError">{this.state.errores["dni"]}</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  keyboard
                  style={{ marginTop: "4px", width: "100%" }}
                  label="Fecha de nacimiento"
                  format="dd/MM/yyyy"
                  openToYearSelection={true}
                  disableFuture={true}
                  labelFunc={this.renderLabelFecha}
                  invalidDateMessage="Fecha inválida"
                  maxDateMessage="Fecha inválida"
                  minDateMessage="Fecha inválida"
                  mask={value => (value ? [/\d/, /\d/, "/", /\d/, /\d/, "/", /\d/, /\d/, /\d/, /\d/] : [])}
                  value={this.state.fechaNacimiento}
                  onChange={this.onInputFechaNacimientoChange}
                  disableOpenOnEnter
                  animateYearScrolling={false}
                />
              </Grid>
              <Grid item xs={12} style={{ marginTop: "16px" }}>
                <FormControl component="fieldset" className={classes.formControl}>
                  <FormLabel component="legend">Sexo</FormLabel>
                  <RadioGroup
                    aria-label="Sexo"
                    name="sexo"
                    style={{ flexDirection: "row" }}
                    value={this.state.sexo}
                    onChange={this.onInputSexoChange}
                  >
                    <FormControlLabel value="m" control={<Radio />} label="Masculino" />
                    <FormControlLabel value="f" control={<Radio />} label="Femenino" />
                  </RadioGroup>
                </FormControl>
              </Grid>
            </Grid>
          </div>
        </div>

        <div
          className={classes.footer}
          style={{
            padding: padding,
            paddingBottom: "16px",
            paddingTop: "16px"
          }}
        >
          <div style={{ flex: 1 }} />

          <Button variant="raised" color="primary" className={classes.button} onClick={this.onBotonValidarClick}>
            Validar datos
          </Button>
        </div>
      </div>
    );
    // return <PaginaForm padding={padding} datosIniciales={this.state.datosForm} onCargando={this.onCargando} onReady={this.onFormReady} />;
  }

  renderPaginaErrorValidando() {
    return <MiPanelMensaje error mensaje={this.state.errorValidando} boton="Reintentar" onBotonClick={this.onBotonReintentarClick} />;
  }

  renderPaginaExito() {
    return (
      <MiPanelMensaje
        lottieExito
        mensaje="Su usuario se ha validado correctamente"
        // detalle={"Le enviamos un e-mail a " + email + " con las instrucciones para activarlo"}
        boton="Aceptar"
        onBotonClick={this.onBotonRedirigirClick}
      />
    );
  }
}

let componente = ValidarUsuario;
componente = withStyles(styles)(componente);
componente = withRouter(componente);
componente = connect(
  mapStateToProps,
  mapDispatchToProps
)(componente);

export default componente;
