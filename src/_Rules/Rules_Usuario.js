import _ from "lodash";
const KEY_INFO_PUBLICA = "UIYAUISYNQNNWSDSS";

const metodos = {
  getDatos: token => {
    const url = `${window.Config.BASE_URL_WS}/v1/Usuario?token=${token}`;

    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      })
        .then(data => data.json())
        .then(data => {
          if (data.ok != true) {
            reject(data.error);
            return;
          }

          resolve(data.return);
        })
        .catch(error => {
          reject("Error procesando la solicitud");
        });
    });
  },
  validarUsuario: comando => {
    const url = `${window.Config.BASE_URL_WS}/v1/Usuario/ActualizarDatosPersonales?token=${comando.token}`;

    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(comando)
      })
        .then(data => data.json())
        .then(data => {
          if (data.ok != true) {
            reject(data.error);
            return;
          }

          resolve(data.return);
        })
        .catch(error => {
          reject("Error procesando la solicitud");
        });
    });
  }
};

export default metodos;
