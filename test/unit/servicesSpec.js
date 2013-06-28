'use strict';

/* jasmine specs for services go here */

describe('service', function() {
  beforeEach(module('explorer.services'), []);


  describe('version', function() {
    it('should return current version', inject(function(version) {
      expect(version).toEqual('0.1');
    }));
  });

  describe('SearchService', function() {

    describe('_getSearchObj()', function() {
        it('should return an empty object when no parameters are set', inject(function(SearchService) {
            expect(SearchService._getSearchObj(SearchService).facets).toBe('');
            expect(SearchService._getSearchObj(SearchService).filters).toBeUndefined();
            expect(SearchService._getSearchObj(SearchService).fields).toBe('');
        }));

        it('should return an object with properties when they are set', inject(function(SearchService) {
            SearchService.facets = ['facet1', 'facet2'];
            SearchService.filters = [{'key': 'filter1', 'val': 'f1'}, {'key': 'filter2', 'val': 'f2'}];
            expect(SearchService._getSearchObj(SearchService).facets).toBe('facet1,facet2');
            expect(SearchService._getSearchObj(SearchService).filter0).toBe('filter1=f1');
            expect(SearchService._getSearchObj(SearchService).filter1).toBe('filter2=f2');
        }));
    });

  });
});
