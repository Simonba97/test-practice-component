import { html, css, LitElement } from 'lit';

export class TestPracticeComponent extends LitElement {
  static styles = css`
    :host {
      display: flex;
      justify-content: center;;
      padding: 10px;
    }

    /* Estilos básicos del componente */
    .container {
      width: 400px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 20px;
      background-color: #f0f0f0;
      border: 1px solid #ccc;
      border-radius: 8px;
    }
    
    .form-group {
      display: flex;
      flex-direction: column;
      margin-bottom: 12px;
    }

    .form-group label {
      margin-bottom: 4px;
    }

    .input-field, select, .radio-group {
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }

    .radio-group {
      display: flex;
      gap: 12px;
    }

    .button-group {
      display: flex;
      justify-content: space-evenly;
      margin-top: 16px;
    }

    button {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .save-btn {
      background-color: #007bff;
      color: white;
    }

    .view-btn {
      background-color: #6c757d;
      color: white;
    }

    .nonRegistedClients {
      margin: 20px 0;
    }

    .clientRow {
      cursor: pointer;
    }

    .client-details { 
      margin-bottom: 25px;  
    }

    .client-details p {
      margin:5px 0;
    }
    
    .message {
      margin-top: 16px;
      color: red;
      font-weight: 500;
    }

    .error {
      color: red;
    }
    .success {
      color: green;
    }
  `;

  static properties = {
    showClientList: { type: Boolean },
    clientList: { type: Array },
    clientSelected: { type: Object },
    showMessage: { type: Boolean },
    message: { type: String },
    typeMessage: { type: String },
  };

  constructor() {
    super();
    this.showClientList = false;
    this.clientList = [];
    this.clientSelected = {};
    this.showMessage = false;
    this.message = null;
    this.typeMessage = null;
  }

  _saveNewClient(e) {

    this.showMessage = false;
    this.message = null;
    this.typeMessage = null;

    const messageError = this._validateInformation();
    if (messageError) {
      this.showMessage = true;
      this.typeMessage = 'error';
      this.message = messageError;
      return;
    }

    const name = this.shadowRoot.getElementById('name').value;
    const lastName = this.shadowRoot.getElementById('lastName').value;
    const civilStatus = this.shadowRoot.getElementById('civilStatus').value;
    const clientType = this.shadowRoot.querySelector('input[name="clientType"]:checked').value;
    const birthDate = this.shadowRoot.getElementById('birthDate').value;
    const id = Date.now();

    const newClient = {
      name,
      lastName,
      civilStatus,
      clientType,
      birthDate,
      id
    };

    this.clientList = [...this.clientList, newClient];
    this.showMessage = true;
    this.typeMessage = 'success';
    this.message = "Se ha guardado el cliente con exito";

    this.clearForm();

  } // end _saveNewClient

  _validateInformation() {

    /* Validar campos vacíos */
    const fieldsEmpty = [];
    if (!this.shadowRoot.getElementById('name').value) fieldsEmpty.push('Nombres');
    if (!this.shadowRoot.getElementById('lastName').value) fieldsEmpty.push('Apellidos');
    if (!this.shadowRoot.getElementById('civilStatus').value) fieldsEmpty.push('Estado Civil');
    if (!this.shadowRoot.querySelector('input[name="clientType"]:checked')?.value) fieldsEmpty.push('Tipo de Cliente');
    if (!this.shadowRoot.getElementById('birthDate').value) fieldsEmpty.push('Fecha de Nacimiento');
    if (fieldsEmpty.length > 0) return `Debe ingresar los siguientes campos: ${fieldsEmpty.join(', ')}`;

    /* Validar fecha correcta */
    const birthDate = new Date(this.shadowRoot.getElementById('birthDate').value);
    const today = new Date();
    if (birthDate > today) return 'La fecha de nacimiento no puede ser posterior a la actual';

  } // end _validateInformation

  clearForm() {
    this.shadowRoot.getElementById('name').value = '';
    this.shadowRoot.getElementById('lastName').value = '';
    this.shadowRoot.getElementById('civilStatus').value = '';
    this.shadowRoot.querySelector('input[name="clientType"]:checked').checked = false;
    this.shadowRoot.getElementById('birthDate').value = '';
  }

  _clientSelected(clientId) {
    this.clientSelected = this.clientList.find(client => client.id === clientId);
  } // end _clientSelected

  _deleteClient(clientId) {
    this.clientList = [...this.clientList.filter(client => client.id !== clientId)];
  }

  render() {
    return html`
      <div class="container">
        ${this.showClientList ? this.renderClients() : this.renderFormAddClient()}
        ${this.showMessage ? html`<span class="message ${this.typeMessage}">${this.message}</span>` : null}
      </div>
    `;
  }

  renderFormAddClient() {
    return html`
      <div class="form-section">
        <div class="form-group">
          <label for="name">Nombres</label>
          <input id="name" class="input-field" type="text" placeholder="Ingrese sus nombres">
        </div>
        <div class="form-group">  
          <label for="lastName">Apellidos</label>
          <input id="lastName" class="input-field" type="text" placeholder="Ingrese sus apellidos">
        </div>
        <div class="form-group">
          <label for="civilStatus">Estado Civil</label>
          <select id="civilStatus" class="input-field">
            <option value="">Seleccione una opción</option>
            <option value="Soltero">Soltero</option>
            <option value="Casado">Casado</option>
            <option value="Divorciado">Divorciado</option>
            <option value="Viudo">Viudo</option>
          </select>
        </div>
        <div class="form-group">
          <label>Tipo de Cliente</label>
          <div class="radio-group">
            <label><input type="radio" name="clientType" value="Nacional"> Nacional</label>
            <label><input type="radio" name="clientType" value="Extrangero"> Extranjero</label>
          </div>
        </div>
        <div class="form-group">
          <label for="birthDate">Fecha de Nacimiento</label>
          <input id="birthDate" class="input-field" type="date">
        </div>
        <div class="button-group">
          <button class="save-btn" @click="${this._saveNewClient}">Guardar</button>
          <button class="view-btn" @click="${() => {
        this.showClientList = !this.showClientList;
        this.showMessage = false;
        this.message = null;
        this.typeMessage = null;
      }}">Ver Clientes</button>
        </div>
      </div>
    `;
  } // end renderFormAddClient

  renderClients() {
    return html`
      <div class="client-list">
        <h3>Lista de Clientes</h3>
        ${this.clientList.length === 0 ?
        html`
          <div class="nonRegistedClients">
            <span>No hay clientes registrados aún</span>
          </div>
          `
        :
        html`
            ${this.clientList.map(client => html`
              <span @click="${() => this._clientSelected(client.id)}" class="clientRow">${client.name}</span><button @click="${() => this._deleteClient(client.id)}" class="btnDeleteClient" id="client-${client.id}">🗑️</button>
            `)}

          <div class="client-details">
            <h4>Detalle de Cliente</h4>
            <p>Estado Civil: <span id="detailCivilStatus">${this.clientSelected.civilStatus}</span></p>
            <p>Tipo de Cliente: <span id="detailClientType">${this.clientSelected.clientType}</span></p>
            <p>Fecha de Nacimiento: <span id="detailBirthDate">${this.clientSelected.birthDate}</span></p>
          </div>
        `}
        <button class="view-btn" @click="${() => this.showClientList = !this.showClientList}">Regresar</button>
      </div>
    `
  } // end renderClients

}
