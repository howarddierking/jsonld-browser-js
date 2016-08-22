const R = require('ramda');
const P = require('bluebird');

// first :: [a] -> a | Undefined
const first = R.nth(0);

// id :: Object -> String | Undefined
const id = R.prop('@id');

// defaultToEmptyString :: String -> String
const defaultToEmptyString = R.defaultTo('');

// expandRelativeIRI :: String -> String -> String
const expandRelativeIRI = exports.expandRelativeIRI = R.curry(function(namespace, name){
  return R.concat(defaultToEmptyString(namespace), name);
});

// splitCompactIRI :: String -> [String]
const splitCompactIRI = R.split(':');

// getCompactIRIPrefix :: String -> String
const getCompactIRIPrefix = exports.getCompactIRIPrefix = R.pipe(splitCompactIRI, first);

// getCompactIRISuffix :: String -> String
const getCompactIRISuffix = exports.getCompactIRISuffix = R.pipe(splitCompactIRI, R.nth(1));

const canExpandCompactIRI = exports.canExpandCompactIRI = R.curry(function(context, compactIRI){
  return R.has(getCompactIRIPrefix(compactIRI))(context);
});

// expandCompactIRI :: Object -> String -> String
const expandCompactIRI = exports.expandCompactIRI = R.curry(function(context, compactIRI){
  // https://www.w3.org/TR/json-ld/#compact-iris
  // Prefixes are expanded when the form of the value is a compact IRI represented as a prefix:suffix combination, 
  // the prefix matches a term defined within the active context, and the suffix does not begin with two slashes (//). 
  // The compact IRI is expanded by concatenating the IRI mapped to the prefix to the (possibly empty) suffix. 
  // If the prefix is not defined in the active context, or the suffix begins with two slashes (such as in 
  // http://example.com), the value is interpreted as absolute IRI instead. If the prefix is an underscore (_), 
  // the value is interpreted as blank node identifier instead.

  // Because ':' appears to be a reserved token for IRIs (http://www.ietf.org/rfc/rfc3987.txt), this expansion
  // function will enforce that there can be only 1 ':' character and that is used to separate prefix and suffix
  
  return R.when(
    canExpandCompactIRI(context),
    a => R.concat(R.prop(getCompactIRIPrefix(a), context), getCompactIRISuffix(a))
  )(compactIRI);
});




// s -> Promise [a]
const getResource = function(uri){
  return Q($.getJSON(uri))
  .then(doc => {
    return jsonld.promises.expand(doc);
  });
};

// {s: [a]} -> s -> Promise [a]
const localProperty = function(obj, p){
  return Q.fcall(function(){ return R.prop(p()); });   
};

// {'@id': u, *} -> s -> Promise [a]
const remoteProperty = function(obj, p){
  return getResource(p());
};

// Object -> s -> Promise [Object] | Undefined
const property = function(obj, property){
  // TODO: enable this resolver to be supplied via the property signature
  let defNsResolver = namespaceResolver('http://build-rest.net/vocab#');
  let p = R.when(R.complement(R.is(Function)), R.invoker(R.identity))(property);

  

  // when @id is root || @id does not exist || obj[property] exists
  //   return obj[property]

  // when @id is not root && @id does exist
  //   dereference @id and return property(dereferenced obj, property)
  let hasLocal = R.anyPass([ R.complement(R.has('@id')), R.has(p()) ]);

  return R.ifElse(hasLocal, localProperty, remoteProperty)(obj, p);

  // does the container have an @id property? if so, dereference it and look for the property
  // gate: unless @id for the supplied representation
};

    
// let bugsIndex = '/resources/index.ld-json';
// let container = $('#pipelines');

// getExpanded(bugsIndex)
// .then(function(idxDoc){
//   debugger;
//   let backlog = property(first(idxDoc), 'backlog');
// });


// let backlog = index.property(backlog)
// let bug = backlog.values[1]
// let titleProp = bug.property(title)
// let title = titleProp.first.@value
