const assert = require('chai').assert;
const expect = require('chai').expect;

const SpinPayAPI = require('./SpinPayAPI');
const { makePurchase, makeRefund } = require('./mock');

function makeSpinPayAPI() {
  return new SpinPayAPI({
    key: process.env.SPINPAY_KEY,
    token: process.env.SPINPAY_TOKEN,
    apiHost: process.env.SPINPAY_HOST,
    version: process.env.SPINPAY_VERSION,
  });
}

describe('Initialization', () => {
  it('should create a SpinPayAPI helper', () => {
    const spinPayAPI = makeSpinPayAPI();
    expect(spinPayAPI.http.defaults.baseURL).to.be.equal(`${process.env.SPINPAY_HOST}/${process.env.SPINPAY_VERSION}`)
  })
})

describe('Payment Methods', () => {
  let spinPayAPI;

  before(function () {
    spinPayAPI = makeSpinPayAPI();
  })

  it('should return the payment methods', async () => {
    const c = await spinPayAPI.getPaymentMethods()
    expect(c.paymentMethods).to.have.lengthOf(2);
  })
})

describe('Payment CRUD', () => {
  let spinPayAPI;
  

  before(function () {
    spinPayAPI = makeSpinPayAPI();
  })

  it('should create a payment', async () => {
    const purchase = makePurchase();
    const payment = await spinPayAPI.createPayment(purchase)
    expect(payment).to.have.own.property('status')
  })

  it('should return a payment status', async () => {
    const purchase = makePurchase();
    const payment = await spinPayAPI.createPayment(purchase)
    const status = await spinPayAPI.getPaymentStatus(payment.pspReferenceId)
    expect(status).to.have.own.property('status')
  })

  it('should cancel a payment', async () => {
    const purchase = makePurchase();
    const payment = await spinPayAPI.createPayment(purchase)
    const status = await spinPayAPI.cancelPayment(payment.pspReferenceId)
    expect(status.status).to.be.oneOf(['CANCELLING', 'CANCELLED'])
  })
})
