require("whatwg-fetch");
var Promise = require("rsvp").Promise;

function fetch(url, opts, auth) {
  var opts = opts || {};
  var headers = {};
  if (auth) {
    headers["Authorization"] = auth.token_type + " " + auth.access_token;
  }
  if (Object.keys(headers).length) {
    opts.headers = headers;
  }
  return window.fetch(url, opts);
}

function makePath(obj, path) {
  var segments = path.split("/").filter(function(s) {
    return s.length;
  });
  function mk(obj, path) {
    var n;
    if (path.length === 0) {
      return obj;
    }
    if (!obj.hasOwnProperty(path[0])) {
      n = {};
      obj[path[0]] = n;
    } else {
      n = obj[path[0]];
    }
    return mk(n, path.slice(1));
  }
  return mk(obj, segments);
}

function objToQuery(obj) {
  return Object.keys(obj).map(function(key) {
    return encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]);
  }).join("&");
}

function makeMethod(url, schema, path, method, auth) {
  var endpoint = url + path;
  if(schema.basePath){
    enpoint += url + schema.basePath + path;
  }
  return function(args) {
    var query = args ? objToQuery(args) : "";
    var url = endpoint + (query.length ? "?" + query : "");
    return fetch(url, {
      method: method,
      mode: "cors"
    }, auth).then(function(res) {
      return res.json();
    });
  };
}

function getSchema(url, auth) {
  return fetch(url + "/api-docs", {}, auth).then(function(res) {
    return res.json();
  });
}

function makeAPI(url, schema, auth) {
  var api = {};
  Object.keys(schema.paths).forEach(function(path) {
    var target = makePath(api, path);
    const methods = schema.paths[path];
    Object.keys(methods).forEach(function(method) {
      const spec = methods[method];
      target[spec.operationId] = makeMethod(url, schema, path, method, auth);
    });
  });
  return api;
}

function connect(url, auth) {
  return getSchema(url, auth).then(function(schema) {
    return makeAPI(url, schema, auth);
  });
}

module.exports = connect;
