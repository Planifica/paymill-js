function PaymillService() {

}

PaymillService.prototype.handler = null;
PaymillService.prototype.getPaymillObject = function() {
	throw new PMError(PMError.Type._, "PaymillService.getPaymillObject() is abstract! Did you initialze?");
};
PaymillService.prototype.getEndpointPath = function() {
	throw new PMError(PMError.Type._, "PaymillService.getEndpointPath() is abstract! Did you initialze?");
};
PaymillService.prototype.setHandler = function(handler) {
    this.handler = handler;
};

PaymillService.prototype._create = function(paramMap, type, cb) {
	try {
		var result = new type.prototype.constructor();
		var httpRequest = new HttpRequest(this.getEndpointPath(), "POST", paramMap);
		return this._request(httpRequest, function(httpData) {
			var allData = JSON.parse(httpData);
			result.fromJson(allData.data);
			return result;
		}, cb);
	} catch(e) {
		return this._reject(e, cb);
	}
};

PaymillService.prototype._detail = function(obj, cb) {
	try {
        var result = getRefreshObject(obj,this.getPaymillObject());
		var httpRequest = new HttpRequest(this.getEndpointPath() + "/" + result.id, "GET");
		return this._request(httpRequest, function(httpData) {
			var allData = JSON.parse(httpData);
			result.fromJson(allData.data);
			return result;
		}, cb);
	} catch(e) {
		return this._reject(e, cb);
	}
};
PaymillService.prototype._update = function(obj, cb) {
    if (! (obj instanceof this.getPaymillObject())) {
        return this._reject(new PMError(PMError.Type.WRONG_PARAMS, "Incorrect object type for update(), must be " + this.getPaymillObject()));
    }
    return this._updateWithMap(obj,obj.getUpdateMap(),cb);
};
PaymillService.prototype._updateWithMap = function(obj,map,cb) {

    try {
        var result = getRefreshObject(obj,this.getPaymillObject());
        var httpRequest = new HttpRequest(this.getEndpointPath() + "/" + result.id, "PUT", map);
        return this._request(httpRequest, function(httpData) {
            var allData = JSON.parse(httpData);
            result.fromJson(allData.data);
            return result;
        }, cb);
    } catch(e) {
        return this._reject(e, cb);
    }
};

PaymillService.prototype._list = function(count, offset, filter, order, cb) {
	try {
		var pmType = this.getPaymillObject();
		var paramMap = {
		};
		if (count) {
			paramMap.count = count;
		}
		if (offset) {
			paramMap.offset = offset;
		}
		if (order) {
			__.extend(paramMap, order.toHttpMap());
		}
		if (filter) {
			__.extend(paramMap, filter);
		}
		var httpRequest = new HttpRequest(this.getEndpointPath(), "GET", paramMap);
		return this._request(httpRequest, function(httpData) {
			var allData = JSON.parse(httpData);
			var result = new PaymillList();
			result.count = allData.data_count;
			result.items = deserializePaymillObjectList(allData.data, pmType);
			return result;
		}, cb);
	} catch(e) {
		return this._reject(e, cb);
	}
};

PaymillService.prototype._remove = function(obj, cb) {
    return this._removeWithMap(obj,null,cb);
};

PaymillService.prototype._removeWithMap = function(obj, params, cb) {
    try {
        var pmType = this.getPaymillObject();
        var path = this.getEndpointPath();
        var id = getIdFromObject(obj, pmType);
        var result;
        if ( obj instanceof pmType) {
            result = obj;
        } else {
            result = new pmType.prototype.constructor();
        }
        var httpRequest = new HttpRequest(path + "/" + id, "DELETE", params);
        return this._request(httpRequest, function(httpData) {
            var allData = JSON.parse(httpData);
            result.fromJson(allData.data);
            return result;
        }, cb);
    } catch(e) {
        return this._reject(e, cb);
    }
};

PaymillService.prototype._request = function(httpRequest, httpDataHandler, cb) {
	var defer = this.handler.getDeferedObject();
	var promise = this.handler.getPromiseObject(defer);
	promise = this.handler.includeCallbackInPromise(promise, cb);
    this.handler.httpRequest(httpRequest).then(function(httpData) {
		try {
			var result = httpDataHandler(httpData);
			defer.resolve(result);
		} catch(e) {
			defer.reject(e);
		}
	}, function(error) {
		defer.reject(error);
	});
	return promise;
};
PaymillService.prototype._reject = function(error, cb) {
	var defer = this.handler.getDeferedObject();
	var promise = this.handler.getPromiseObject(defer);
	promise = this.handler.includeCallbackInPromise(promise, cb);
	defer.reject(error);
	return promise;
};
