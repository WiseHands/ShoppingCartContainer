import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import '/node_modules/wise-shopping-cart/wise-shopping-cart.js';
import '@polymer/paper-radio-group/paper-radio-group.js';
import '@polymer/paper-radio-button/paper-radio-button.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/iron-ajax/iron-ajax.js';

class WiseShoppingCartContainer extends PolymerElement {
  static get template() {
    // language=HTML
    return html`
        <style>
            section {
                display: block;
            }

            .order-details {
            }

            .cart {
                display: flex;
            }

            paper-radio-group {
                display: flex;
                flex-direction: column;
                padding: 0 1em;
            }

            paper-radio-group :first-child {
                padding-top: 0;
            }

            h3 {
                padding: 0 .5em;
            }

            wise-shopping-cart {
                margin-right: .5em;
                flex: 1;
            }

            .shopping-cart-container {
                flex: 1;
            }

            .order-details-container {
                width: 30%;
            }

            .order-details {
                display: flex;
                flex-direction: column;
            }

            paper-card {
                flex: 1;
                margin-bottom: 1em;
                padding-bottom: .5em;
            }

            span[slot=prefix] {
                margin-right: .5em;
            }

            .error-span {
                color: red;
                min-height: 1.2em;
            }

            paper-input {
                padding: 0 1em;
            }

            h1 {
                font-size: 1.8rem;
                font-weight: 600;
                text-transform: uppercase;
            }

            paper-button {
                background-color: #fff;
                color: #000;
                border: 2px solid #000;
                border-radius: 0;
                width: fit-content;
                margin-right: 0;
            }

            paper-button:hover {
                background-color: #000;
                color: #fff;
                border: 2px solid #fff;
            }

            paper-button[disabled] {
                border: 2px solid grey;
                color: grey;
            }

            .total-container {
                display: flex;
                flex-direction: column;
                align-items: flex-end;
            }

            .order-details :nth-last-child(2) h3 {
                margin-bottom: 0;
            }

            .department-number {
                padding-bottom: 1em;
            }

            #clientcomments {
                padding-bottom: 1em;
            }

            @media (max-width: 750px) {
                .cart {
                    flex-direction: column;
                }

                .shopping-cart-container, .order-details-container {
                    width: 100%;
                }

                wise-shopping-cart {
                    margin-right: 0;
                }
            }
        </style>
        <div>
            <div class="cart-container">
                <div class="cart">
                    <div class="shopping-cart-container">
                        <wise-shopping-cart cart-items="[[cart.items]]"></wise-shopping-cart>
                    </div>
                    <div class="order-details-container">
                        <div class="order-details">

                            <paper-card>
                                <h3>Тип доставки:</h3>
                                <paper-radio-group id="deliveryType" selected="[[cart.deliveryType]]"
                                                   on-selected-changed="_onDeliveryTypeChange">
                                    <template is="dom-if" if="[[cart.configuration.delivery.courier.isCourierActive]]">
                                        <paper-radio-button name="COURIER">Кур'єр</paper-radio-button>
                                    </template>
                                    <template is="dom-if"
                                              if="[[cart.configuration.delivery.postDepartment.isPostDepartmentActive]]">
                                        <paper-radio-button name="POSTSERVICE">Нова Пошта</paper-radio-button>
                                    </template>
                                    <template is="dom-if"
                                              if="[[cart.configuration.delivery.selfTake.isSelfTakeActive]]">
                                        <paper-radio-button name="SELFTAKE">Самовивіз</paper-radio-button>
                                    </template>
                                </paper-radio-group>
                            </paper-card>

                            <paper-card>
                                <h3>Тип оплати:</h3>
                                <paper-radio-group id="paymentType" selected="[[cart.paymentType]]"
                                                   on-selected-changed="_onPaymentTypeChange">
                                    <template is="dom-if" if="[[cart.configuration.payment.cash.isActive]]">
                                        <paper-radio-button name="CREDITCARD">Онлайн</paper-radio-button>
                                    </template>
                                    <template is="dom-if" if="[[cart.configuration.payment.creditCard.isActivePayByCash]]">
                                        <paper-radio-button name="CASHONDELIVERY">Готівкою</paper-radio-button>
                                    </template>
                                </paper-radio-group>
                            </paper-card>

                            <paper-card>
                                <h3>Замовник:</h3>
                                <paper-input pattern=".*\\S.*" id="clientName" label="Ім'я" required
                                             error-message="Заповніть, будь ласка, це поле"
                                             value="[[cart.client.name]]" on-blur="_validateAndSend"></paper-input>
                                <paper-input id="clientPhone" pattern="^\\d{9}$" label="Телефон" required
                                             error-message="Заповніть, будь ласка, це поле"
                                             value="[[cart.client.phone]]" on-blur="_validateAndSend">
                                    <span slot="prefix">+380</span>
                                </paper-input>
                                <paper-input id="clientComments" label="Коментар" value="[[cart.client.comments]]"
                                             on-blur="_validateAndSend"></paper-input>
                            </paper-card>
                            <template is="dom-if" if="[[_isAddressCardVisible(cart.deliveryType)]]">
                                <paper-card>
                                    <h3>Адреса:</h3>

                                    <div hidden="[[!_isCourierDeliveryType(cart.deliveryType)]]">
                                        <paper-input id="street" pattern=".*\\S.*" label="Вулиця"
                                                     value="[[cart.client.address.street]]" required
                                                     error-message="Заповніть, будь ласка, це поле"
                                                     on-blur="_validateAndSendClientAddressInfo"></paper-input>
                                        <paper-input id="building" pattern=".*\\S.*"
                                                     label="Будинок" value="[[cart.client.address.building]]"
                                                     required error-message="Заповніть, будь ласка, це поле"
                                                     on-blur="_validateAndSendClientAddressInfo"></paper-input>
                                        <paper-input id="appartment" label="Квартира"
                                                     value="[[cart.client.address.appartment]]"
                                                     on-blur="_validateAndSendClientAddressInfo"></paper-input>
                                    </div>

                                    <div hidden="[[_isCourierDeliveryType(cart.deliveryType)]]">
                                        <paper-input id="clientCity" value="[[cart.client.postDepartamentInfo.city]]" pattern=".*\\S.*"
                                                     label="Місто" required
                                                     error-message="Заповніть, будь ласка, це поле"
                                                     on-blur="_validateAndSendClientPostInfo"></paper-input>
                                        <paper-input id="clientPostDepartmentNumber"
                                                     value="[[cart.client.postDepartamentInfo.postDepartmentNumber]]"
                                                     class="department-number" pattern="^[0-9]*$" label="Відділення"
                                                     required error-message="Заповніть, будь ласка, це поле"
                                                     on-blur="_validateAndSendClientPostInfo">
                                            <span slot="prefix">№</span>
                                        </paper-input>
                                    </div>
                                </paper-card>
                            </template>
                            <span class="error-span">[[errorMessage]]</span>
                            <div class="total-container">
                                <h1>СУМА: [[_calculateTotal(cart.items)]] грн</h1>
                                <paper-button disabled=[[!cart.items.length]] on-tap="_proceed">NEXT
                                </paper-button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <iron-ajax id="ajax" handle-as="json" on-last-response-changed="_onLastResponseChanged"></iron-ajax>
    `;
  }

  ready() {
    super.ready();
    this._generateRequest('GET', `${this.hostname}/api/cart?cartId=${this.cartId}`);
    this.addEventListener('decrease-item-quantity', event => {
        this._generateRequest('DELETE', `http://localhost:3334/api/cart/decrease-quantity?uuid=${event.detail}&cartId=${this.cartId}`);
      }
    );
    this.addEventListener('increase-item-quantity', event => {
        this._generateRequest('POST', `${this.hostname}/api/cart/increase-quantity?uuid=${event.detail}&cartId=${this.cartId}`);
      }
    );
    this.addEventListener('remove-item', event => {
        this._generateRequest('DELETE', `${this.hostname}/api/cart?uuid=${event.detail}&cartId=${this.cartId}`);
      }
    );

  }

  static get properties() {
    return {
      cart: {
        type: Object,
        value: {
          items: []
        }
      },
      cartId: {
        type: String
      },
      hostname: {
        type: String,
          value: ''
      },
      errorMessage: String
    };
  }

  _proceed() {
    const deliveryType = this.$.deliveryType;
    const paymentType = this.$.paymentType;
    const requiredInputs = Array.from(this.shadowRoot.querySelectorAll('paper-input[required]')).filter(input => input.offsetWidth > 0 && input.offsetHeight > 0);
    let validInputs = 0;
    if (!deliveryType.selected) {
      this.set('errorMessage', 'Вкажіть, будь ласка, тип доставки');
      return;
    }
    if (!paymentType.selected) {
      this.set('errorMessage', 'Вкажіть, будь ласка, тип оплати');
      return;
    }
    this.set('errorMessage', '');

    requiredInputs.forEach(input => {
      if (input.validate()) {
        validInputs++;
      }
    });
    const isValid = validInputs === requiredInputs.length;
    if (isValid) {
      //  do stuff
      console.log('we are fucking valid!!!');
    }
  }

  _validateAndSend(event) {
    const targetElement = event.target;
    if (targetElement.validate() && targetElement.value) {
      this._generateRequest('PUT', `${this.hostname}/api/cart/client/info?${targetElement.id}=${targetElement.value}&cartId=${this.cartId}`);
    }
  }

  _generateRequest(method, url) {
    const ajax = this.$.ajax;
    ajax.method = method;
    ajax.url = url;
    ajax.generateRequest();
  }

  _onLastResponseChanged(event, response) {
    const cartData = response.value;
    console.log(cartData);
    this.set('cart', cartData ? cartData : {items: []});
  }

  _calculateTotal(items) {
    let total = 0;
    items.forEach(item => {
      total += item.quantity * item.price;
    });
    if(this.cart.deliveryType === 'COURIER') {
        total += this.cart.configuration.delivery.courier.deliveryPrice;
    }
    return total;
  }

  _validateAndSendClientAddressInfo(event) {
    const targetElement = event.target;
    if (targetElement.validate() && targetElement.value) {
      this._generateRequest('PUT', `${this.hostname}/api/cart/address/info?${targetElement.id}=${targetElement.value}&cartId=${this.cartId}`);
    }
  }

  _validateAndSendClientPostInfo(event) {
    const targetElement = event.target;
    if (targetElement.validate() && targetElement.value) {
      this._generateRequest('PUT', `${this.hostname}/api/cart/post/info?${targetElement.id}=${targetElement.value}&cartId=${this.cartId}`);
    }
  }

  _onDeliveryTypeChange(event, data) {
    this._generateRequest('PUT', `${this.hostname}/api/cart/delivery?deliverytype=${data.value}&cartId=${this.cartId}`);
  }

  _onPaymentTypeChange(event, data) {
    this._generateRequest('PUT', `${this.hostname}/api/cart/payment?paymenttype=${data.value}&cartId=${this.cartId}`);
  }

  _isAddressCardVisible(deliveryType) {
    const isCourier = deliveryType === 'COURIER';
    const isPostService = deliveryType === 'POSTSERVICE';
    return isCourier || isPostService;
  }

  _isCourierDeliveryType(deliveryType) {
    return deliveryType === 'COURIER';
  }

}

window.customElements.define('wise-shopping-cart-container', WiseShoppingCartContainer);