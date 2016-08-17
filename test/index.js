var idx  = require('../src/index');
var should = require('should');

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
});
