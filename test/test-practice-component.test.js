import { html } from 'lit';
import { fixture, expect, nextFrame } from '@open-wc/testing';

import '../test-practice-component.js';

/**
 * Function to add a client to the form and simulate the click on the save button
 */
async function addClient(el, { name, lastName, civilStatus, clientType, birthDate }) {

  // Assign field values ​​to the form
  el.shadowRoot.getElementById('name').value = name;
  el.shadowRoot.getElementById('lastName').value = lastName;
  el.shadowRoot.getElementById('civilStatus').value = civilStatus;
  el.shadowRoot.querySelector(`input[name="clientType"][value="${clientType}"]`).checked = true;
  el.shadowRoot.getElementById('birthDate').value = birthDate;

  // Simulate clicking the save button
  el.shadowRoot.querySelector('.save-btn').click();

} // end addClient

describe('TestPracticeComponent', () => {

  describe('Tests para validar la funcionalidad del formulario de clientes', () => {

    it('mostrar el mensaje de error si hay campos vacíos al guardar', async () => {
      const el = await fixture(html`<test-practice-component></test-practice-component>`);

      // Assign field empty values ​​to the form
      el.shadowRoot.getElementById('name').value = '';
      el.shadowRoot.getElementById('lastName').value = '';
      el.shadowRoot.getElementById('civilStatus').value = '';
      const selectedClientType = el.shadowRoot.querySelector('input[name="clientType"]:checked');
      if (selectedClientType) {
        selectedClientType.checked = false;
      }
      el.shadowRoot.getElementById('birthDate').value = '';

      // Simulate clicking the save button
      el.shadowRoot.querySelector('.save-btn').click();

      // Wait for DOM update
      await nextFrame();

      // Verify that the error message has been displayed
      const messageErrorSelector = el.shadowRoot.querySelector('.message.error');
      expect(messageErrorSelector).to.not.be.null;
      expect(messageErrorSelector.textContent).to.equal('Debe ingresar los siguientes campos: Nombres, Apellidos, Estado Civil, Tipo de Cliente, Fecha de Nacimiento');
    });

    it('mostrar el mensaje de error si la fecha ingresada es superior a la fecha actual', async () => {
      const el = await fixture(html`<test-practice-component></test-practice-component>`);

      // Calculate invalid date of birth (one day after today)
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 2);

      // Add customer with invalid date
      await addClient(el, {
        name: 'Simón',
        lastName: 'Bustamante Alzate',
        civilStatus: 'Soltero',
        clientType: 'Nacional',
        birthDate: `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`,
      });

      // Wait for DOM update
      await nextFrame();

      // Verify that the error message has been displayed
      const messageErrorSelector = el.shadowRoot.querySelector('.message.error');
      expect(messageErrorSelector).to.not.be.null;
      expect(messageErrorSelector.textContent).to.equal('La fecha de nacimiento no puede ser posterior a la actual');
    });

    it('mostrar el mensaje de éxito si el formulario fue diligenciado correctamente', async () => {
      const el = await fixture(html`<test-practice-component></test-practice-component>`);

      // Calculate valid date of birth (one day before today)
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);

      // Add customer with valid data
      await addClient(el, {
        name: 'Simón',
        lastName: 'Bustamante Alzate',
        civilStatus: 'Soltero',
        clientType: 'Nacional',
        birthDate: `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`,
      });

      // Wait for DOM update
      await nextFrame();

      // Verify that the success message has been displayed
      const messageSuccessSelector = el.shadowRoot.querySelector('.message.success');
      expect(messageSuccessSelector).to.not.be.null;
      expect(messageSuccessSelector.textContent).to.equal('Se ha guardado el cliente con exito');
    });

    it('mostrar mensaje de clientes vacíos cuando se intenta ver la lista de clientes y no existen registros', async () => {
      const el = await fixture(html`<test-practice-component></test-practice-component>`);

      // Simulate clicking on the view clients button
      el.shadowRoot.querySelector('.view-btn').click();

      // Wait for DOM update
      await nextFrame();

      // Verify that the message "There are no clients" is displayed
      const messageNonRegisteredClients = el.shadowRoot.querySelector('span').textContent;
      expect(messageNonRegisteredClients).to.equal('No hay clientes registrados aún');
    });

    it('mostrar lista de clientes cuando la lista de clientes contiene información', async () => {
      const el = await fixture(html`<test-practice-component></test-practice-component>`);

      // Calculate valid date of birth
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);

      // Add customer with valid data
      await addClient(el, {
        name: 'Simón',
        lastName: 'Bustamante Alzate',
        civilStatus: 'Soltero',
        clientType: 'Nacional',
        birthDate: `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`,
      });

      // Simulate clicking on the view clients button
      el.shadowRoot.querySelector('.view-btn').click();

      // Wait for DOM update
      await nextFrame();

      // Verify that the customer list is displayed correctly
      const clientRow = el.shadowRoot.querySelector('.clientRow');
      expect(clientRow).to.not.be.null;
    });

    it('mostrar detalle del cliente cuando se le da click', async () => {
      const el = await fixture(html`<test-practice-component></test-practice-component>`);

      // Calculate valid date of birth
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);

      // Add multiple clients with valid data
      await addClient(el, {
        name: 'Simón',
        lastName: 'Bustamante Alzate',
        civilStatus: 'Soltero',
        clientType: 'Nacional',
        birthDate: `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`,
      });

      await addClient(el, {
        name: 'Lucas',
        lastName: 'Vera Alzate',
        civilStatus: 'Casado',
        clientType: 'Nacional',
        birthDate: `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`,
      });

      await addClient(el, {
        name: 'Samuel',
        lastName: 'García Alzate',
        civilStatus: 'Soltero',
        clientType: 'Nacional',
        birthDate: `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`,
      });

      // Simulate clicking on the view clients button
      el.shadowRoot.querySelector('.view-btn').click();

      // Wait for DOM update
      await nextFrame();

      // Simulate clicking on the first customer's row
      el.shadowRoot.querySelector('.clientRow').click();

      // Wait for DOM update
      await nextFrame();

      // Verify that the details of the selected client are displayed correctly
      const civilStatusSelector = el.shadowRoot.querySelector('#detailCivilStatus');
      const clientTypeSelector = el.shadowRoot.querySelector('#detailClientType');
      const birthDateSelector = el.shadowRoot.querySelector('#detailBirthDate');

      expect(civilStatusSelector).to.not.be.null;
      expect(clientTypeSelector).to.not.be.null;
      expect(birthDateSelector).to.not.be.null;

      expect(civilStatusSelector.textContent).to.equal('Soltero');
      expect(clientTypeSelector.textContent).to.equal('Nacional');
      expect(birthDateSelector.textContent).to.equal(`${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`);
    });

    it('eliminar correctamente un cliente de la lista', async () => {
      const el = await fixture(html`<test-practice-component></test-practice-component>`);

      // Calculate valid date of birth
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);

      // Add multiple clients with valid data
      await addClient(el, {
        name: 'Simón',
        lastName: 'Bustamante Alzate',
        civilStatus: 'Soltero',
        clientType: 'Nacional',
        birthDate: `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`,
      });

      await addClient(el, {
        name: 'Lucas',
        lastName: 'Vera Alzate',
        civilStatus: 'Casado',
        clientType: 'Nacional',
        birthDate: `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`,
      });

      await addClient(el, {
        name: 'Samuel',
        lastName: 'García Alzate',
        civilStatus: 'Soltero',
        clientType: 'Nacional',
        birthDate: `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`,
      });

      // Simulate clicking on the view clients button
      el.shadowRoot.querySelector('.view-btn').click();

      // Wait for DOM update
      await nextFrame();

      // Simulate clicking on the first customer's row
      const btnDeleteClient = el.shadowRoot.querySelector('.btnDeleteClient');

      // Get the id of the client to delete
      const clientToDeleteId = btnDeleteClient.dataset.clientId;

      // Simulate clicking the delete button
      btnDeleteClient.click();

      // Verify that the client has been deleted
      const remainingClients = el.clientList;
      const deletedClient = remainingClients.find(client => client.id === clientToDeleteId);

      // Validate that the client does not exist
      expect(deletedClient).to.be.undefined;
    });
  });
});
