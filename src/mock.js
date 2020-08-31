function makeId(length) {
   let result           = '';
   const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   const charactersLength = characters.length;
   for ( let i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

function makeRefund(amount) {
  return {
    transactionRefundId: `${makeId(6)}-${makeId(5)}-${makeId(4)}`,
    "amount": {
      "value": 50.10,
      "currency": "BRL"
    },
    delayToCompose: 10
  }
}

function makePurchase() {
  return {
    "merchantOrderReference": makeId(6),
    "transactionId": makeId(32),
    "referenceId": `595b6e74-0030-43ab-9b89-${makeId(12)}`,
    "paymentMethod": {
      "type": "spintest",
      "cpf": "06308024910",
      "cellphone": "47996976816"
    },
    "merchantName": "Loja dos sonhos",
    "amount": {
      "value": 100.01,
      "currency": "BRL",
    },
    "delayToSettlement": 180,
    "delayToAutoCancel": 15,
    "shopper": {
      "reference": "c1245228-1c68-11e6-94ac-0afa86a846a5",
      "firstName": "John",
      "lastName": "Doe",
      "gender": "MALE",
      "document": "06308024910",
      "documentType": "CPF",
      "email": "john.doe@example.com",
      "phone": {
        "country": "55",
        "number": "21987654321"
      },
      "locale": "pt-BR"
    },
    "shipping": {
      "value": 49.99,
      "company": "Correios",
      "address": {
        "country": "BRA",
        "street": "Praia de Botafogo St.,",
        "number": "300",
        "complement": "3o. Andar",
        "neighborhood": "Botafogo",
        "postalCode": "22250040",
        "city": "Rio de Janeiro",
        "state": "RJ"
      }
    },
    "billingAddress": {
      "country": "BRA",
      "street": "Brigadeiro Faria Lima Avenue",
      "number": "4440",
      "complement": "10o. Andar - AP 1001",
      "neighborhood": "Itaim Bibi",
      "postalCode": "4538132",
      "city": "São Paulo",
      "state": "SP"
    },
    "items": [
      {
        "id": "132981",
        "description": "Meu primeiro produto",
        "value": 10.01,
        "quantity": 1,
        "discount": 0,
        "taxAmount": 0.9,
        "amountExcludingTax": 9.11,
        "amountIncludingTax": 10.01
      }
    ],
    "orderUrl": "https://admin.mystore.example.com/orders/v32478982",
    "callbackUrl": "https://api.example.com/some-path/to-notify/status-changes?an=mystore",
    "returnUrl": "https://mystore.example.com/checkout/order/v32478982"
  }
}

module.exports = {
  makeId,
  makePurchase,
  makeRefund,
}