/**
 *
 * Creates a new PaymentService. Generally you should never create a PAYMILL service on your own. Instead use the exported "payments".
 * @class PaymentService
 */
function PaymentService() {

}

PaymentService.prototype = new PaymillService();
PaymentService.prototype.constructor = PaymentService;
PaymentService.prototype.getPaymillObject = function() {
	return Payment;
};
PaymentService.prototype.getEndpointPath = function() {
	return "/payments";
};

/**
 * Create a Payment with a token.
 * @param {string} token the payment token, generated by the PAYMILL bridge.
 * @param {(string|Client)} [client] the identifier of a client or a client.
 * @param {Object} [cb] a callback.
 * @return {Promise} a promise, which will be fulfilled with a Payment or rejected with a PMError.
 * @memberOf PaymentService
 */
PaymentService.prototype.create = function(token, client, cb) {
    try {
        validateString(token,"token",false);
        var map = {
            token : token
        };
        if (!(__.isEmpty(client))) {
            map.client = getIdFromObject(client, Client);
        }
        return this._create(map, Payment, cb);
    } catch (e) {
        return this._reject(e);
    }
};

/**
 * List Payments.
 * @param {(string|number)} [count] limit of objects to be listed. use for pagination.
 * @param {(string|number)} [offset] offset. use for pagination.
 * @param {(Payment.Filter|null)} [filter] a list filter or null.
 * @param {(Payment.Order|null)} [order] a list order or null.
 * @param {Object} [cb] a callback.
 * @return {Promise} a promise, which will be fulfilled with a PayMillObjectList or rejected with a PMError.
 * @memberOf PaymentService
 */
PaymentService.prototype.list = function(count, offset, filter, order, cb) {
	return this._list(count, offset, filter, order, cb);
};

/**
 * Remove a Payment.
 * @param {Payment} obj a payment object or its id.
 * @param {Object} [cb] a callback.
 * @return {Promise} a promise, which will be fulfilled with a Payment or rejected with a PMError.
 * @memberOf PaymentService
 */
PaymentService.prototype.remove = function(obj, cb) {
	return this._remove(obj, cb);
};

/**
 * Get a Payment.
 * @param {(string|Payment)} obj a payment object or its id. note, if you set a payment object it will be updated, no new object will be created.
 * @param {Object} [cb] a callback.
 * @return {Promise} a promise, which will be fulfilled with a Payment or rejected with a PMError.
 * @memberOf PaymentService
 */
PaymentService.prototype.detail = function(obj, cb) {
	return this._detail(obj, cb);
};

