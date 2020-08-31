# SpinPay - NodeJS
Lib JavaScript para integração no NodeJS com a [API](https://docs.spinpay.com.br/#//) [SpinPay](https://spinpay.com.br/).

### Instalação

```bash
npm install spinpay --save
```

### Utilização
```javascript
var SpinPay = require('spinpay');

var spinPay = new SpinPay({ 
    key: <key>,        // Chave fornecida pelo SpinPay
    token: <token>,    // Token fornecido pelo SpinPay
    apiHost: <host>,   // Host do SpinPay, "https://sandbox-api.spinpay.com.br", 
    version: <version>, // Versão da API, "v1"
});

spinPay.getPaymentMethods()
.then(function(response){
  //success
}, function(err){
  //error
});
```

### Funções
getPaymentMethods

createPayment

sendPaymentMethod

getPaymentStatus

cancelPayment

refundPayment

paymentRefunds

### License

MIT