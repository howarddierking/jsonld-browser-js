const idx  = require('../src/index');
const should = require('should');
const P = require('bluebird');
const readFile = P.promisify(require('fs').readFile);
const jsonld = require('jsonld');

describe('index', ()=>{
  describe('#expandRelativeIRI', ()=>{
    it('should return the qualified name when given a base name and a local name', ()=>{
      idx.expandRelativeIRI('http://foo.com/', 'bar').should.eql('http://foo.com/bar');
    });
    it('should curry properly', ()=>{
      idx.expandRelativeIRI('http://foo.com/')('bar').should.eql('http://foo.com/bar');
    });
    it('should return the local name when the base name is not provided', ()=>{
      idx.expandRelativeIRI(undefined, 'bar').should.eql('bar');
    });
  });

  describe('#expandCompactIRI', ()=>{
    it('should return the qualified name when given a map and a local name', ()=>{
      let prefixes = {
        a: 'http://foo.com/',
        b: 'http://bar.com/'
      };

      idx.expandCompactIRI(prefixes, 'a:alpha').should.eql('http://foo.com/alpha');
      idx.expandCompactIRI(prefixes, 'b:bravo').should.eql('http://bar.com/bravo');
    });
    it('should return the local name when the q value cannot be found in the map', ()=>{
      idx.expandCompactIRI({}, 'a:alpha').should.eql('a:alpha');
    });
  });

  describe('#getCompactIRIPrefix', ()=>{
    it('should return the prefix for a valid compact IRI', ()=>{
      idx.getCompactIRIPrefix('a:foo').should.eql('a');
    });
  });

  describe('#getCompactIRISuffix', ()=>{
    it('should return the prefix for a valid compact IRI', ()=>{
      idx.getCompactIRISuffix('a:foo').should.eql('foo');
    });
  });

  describe.only('#getContext', ()=>{
    it('should resolve when context is embedded in the document', (done)=>{
      const expectedContext = {
        '@base': 'http://localhost',
        '@vocab': 'http://build-rest.net/vocab#'
      };

      readFile('test-resources/index-inlined.ld-json', 'utf8')
      .then(doc=>{
        return JSON.parse(doc);
      })
      .then(doc=>{
        return idx.getContext(doc);
      })
      .then(context=>{
        context.should.eql(expectedContext);
        done();
      });
    });
    it('should resolve when context URL is embedded in the document');
    it('should reosolve context URL');
  });

  describe.skip('Scenario: Inline Resource', ()=>{
    it('should expand the document properly', ()=>{
      readFile('test-resources/index-inlined.ld-json', 'utf8')
      .then((doc)=>{
        return jsonld.promises.expand(JSON.parse(doc));
      })
      .then(doc=>{
        debugger;
      });
    });
  });
});




/*
  extract context so that client can specify shorthand path and full URLs can be easily resolved
    inline context
    external context
*/
