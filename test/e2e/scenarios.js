'use strict';

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */

describe('SB-Explorer', function() {

  beforeEach(function() {
    browser().navigateTo('../../app/index.html');
  });


  it('should automatically redirect to /collections when location hash/fragment is empty', function() {
    expect(browser().location().url()).toBe("/collections");
  });


  describe('collections', function() {

    beforeEach(function() {
      browser().navigateTo('#/collections');
    });


    it('should render collections-list when user navigates to /collections', function() {
      expect(repeater('.collection').count()).toBe(20);
    });

  });


  describe('collections search', function() {

    beforeEach(function() {
      browser().navigateTo('#/collections/4f552e93e4b018de15819c51');
    });


    it('should render collections-search when user navigates to /collections with an id', function() {
      expect(repeater('.sb-item').count()).toBeGreaterThan(19);
    });

  });
});
