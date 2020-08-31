const axios = require('axios').default;

function SpinPayAPI({
  key,
  token,
  apiHost = 'https://sandbox-api.spinpay.com.br',
  version = 'v1'
}) {
  this.http = axios.create({
    baseURL: `${apiHost}/${version}`,
    timeout: 5000,
    responseType: 'json',
    headers: {
      'X-Merchant-Key': key,
      'X-Merchant-Token': token,
      'Accept': 'application/json'
    }
  });
}

/**
 * @function getPaymentMethods
 * Retorna uma lista com todas as instituições financeiras suportadas pela Spin Pay,
 * assim como as informações que cada instituição financeira requer para realizar um pagamento 
 * e os esquemas necessários para obtenção dos recursos de QRCode e AppLink quando disponíveis.
 * 
 * @param {string} [channel="Web"]
 * @param {string} [countryCode="BR"]
 * @param {string} [locale="pt-BR"]
 */

SpinPayAPI.prototype.getPaymentMethods = function(channel = 'Web', countryCode = 'BR', locale = 'pt-BR') {
  const path = `/checkouts/payment-methods?channel=${channel}&countryCode=${countryCode}&locale=${locale}`;
  return this.http.get(path).then(response => response.data);
}

/**
 * @function createPayment
 * Cria um novo pedido de pagamento e /ou inicia o fluxo de pagamento por meio
 * de redirecionamento.
 * 
 * @param {string} body.merchantOrderReference Id da referência que identifica um pagamento de forma única para seller. É recomendado que esse valor seja único por pagamento.
 * @param {string} body.referenceId
 * @param {object} body.amount
 * @param {object} body.shopper
 * @param {object} body.items Itens comprados.
 * @param {string} [body.transactionId] Identificação da Transação relacionada a esse pagamento.
 * @param {object} [body.paymentFlow] Determina o fluxo de criação do payment.
 * @param {object} [body.paymentMethod] Objeto de matriz de detalhes a ser fornecido pelo comprador para concluir o pagamento com esse método de pagamento.
 * @param {string} [body.merchantName] Nome do seller que deve ser mostrado ao consumidor. Se omitido, o nome cadastrado pelo lojista será utilizado.
 * @param {number} [body.delayToSettlement=180] O tempo de espera para a liquidação, especificado em minutos. Valor padrão é de 180 minutos, devido ao tempo médio de cancelamento para compras. Este valor deve ser maior para cenários de aluguel quando o seller deve esperar até que o período de aluguel expire para que o montante seja liquidado.
 * @param {number} [body.delayToAutoCancel=30] O tempo de espera para a liquidação, especificado em minutos. Valor padrão é de 180 minutos, devido ao tempo médio de cancelamento para compras. Este valor deve ser maior para cenários de aluguel quando o seller deve esperar até que o período de aluguel expire para que o montante seja liquidado.
 * @param {object} [body.shipping]
 * @param {object} [body.billingAddress]
 * @param {string} [body.orderUrl] URL da ordem de compra do backoffice do seller.
 * @param {string} [body.callbackUrl] URL para enviar notificação da plataforma Spin Pay para a plataforma do seller. Para mais informações sobre as notificações, veja a seção Notifications. Mas caso o lojista não queira implementar esse callbackUrl, ele pode consultar ativamente o status do pagamento na Spin Pay periodicamente (sugestão: a cada 1 minuto).
 */

SpinPayAPI.prototype.createPayment = function(body) {
  const path = `/checkouts/payments`;
  return this.http.post(path, body)
    .then(response => response.data);
}

/**
 * @function sendPaymentMethod 
 * Envia um método de pagamento para um pagamento já existente, 
 * mas que foi criado sem paymentMethod.
 * 
 * @param {string} body.type Código do método de pagamento
 * @param {object} body.rest Coleção que contém as informações específicas do método de pagamento.
 */
SpinPayAPI.prototype.sendPaymentMethod = function(pspReferenceId, { type, ...rest }) {
  const path = `/checkouts/payments/${pspReferenceId}/payment-methods`;
  return this.http.post(path, {
    type,
    ...rest
  }).then(response => response.data)
}

/**
 * @function getPaymentStatus
 * Obtém status de um pagamento
 *
 * @param {string} pspReferenceId ID do pagamento que deseja visualizar o status
 */

SpinPayAPI.prototype.getPaymentStatus = function(pspReferenceId) {
  const path = `/checkouts/payments/${pspReferenceId}/status`
  return this.http.get(path).then(response => response.data)
}

/**
 * @function cancelPayment
 * Cancela um pagamento desde que ele ainda não tenha sido liquidado. Caso tenha sido liquidado, um estorno deve ser requisitado.
 *
 * @param {string} pspReferenceId ID do pagamento que deseja cancelar
 */

SpinPayAPI.prototype.cancelPayment = function(pspReferenceId) {
  const path = `/checkouts/payments/${pspReferenceId}/cancel`
  return this.http.post(path).then(response => response.data)
}

/**
 * @function refundPayment
 * Estorna um pagamento que já foi liquidado para o lojista.
 *
 * @param {string} pspReferenceId ID do pagamento que deseja cancelar
 * @param {object} body.amount 
 * @param {string} body.transactionRefundId Identificação da transação relacionada a esse estorno. Deve ser única por estorno.
 * @param {number} [body.delayToCompose] Tempo máximo em dias corridos para o estorno ser composto. Caso o estorno seja composto até esse período (ou antes), então este será efetivado no próximo dia útil.
 * @param {string} [body.notes] Comentário sobre o estorno.
 */
SpinPayAPI.prototype.refundPayment = function(pspReferenceId, { 
    amount, 
    transactionRefundId,
    delayToCompose,
    notes
  }) {
  const path = `/checkouts/payments/${pspReferenceId}/refunds`
  return this.http.post(path, {
    amount, 
    transactionRefundId,
    delayToCompose,
    notes
  }).then(response => response.data)
}

/**
 * @function paymentRefunds
 * Retorna um estorno de pagamento especificado
 * 
 * @param {string} refundId ID do estorno do pagamento que deseja consultar
 * @param {string} pspReferenceId ID do pagamento do estorno
 */
SpinPayAPI.prototype.paymentRefunds = function(refundId, pspReferenceId) {
  const path = `/checkouts/payments/${pspReferenceId}/refunds/${refundId}`
  return this.http.get(path).then(response => response.data)
}

module.exports = SpinPayAPI;