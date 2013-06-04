basePath = '../';

files = [
  JASMINE,
  JASMINE_ADAPTER,
  'app/lib/jquery/jquery-1.9.1.js',
  'app/lib/angular/angular.js',
  'app/lib/angular/angular-*.js',
  'app/lib/angular-ui/ui-utils.js',
  'test/lib/angular/angular-mocks.js',
  'app/js/**/*.js',
  'test/unit/**/*.js',
  'test/unit/mock/*.js'
];

autoWatch = true;

browsers = ['Chrome'];

junitReporter = {
  outputFile: 'test_out/unit.xml',
  suite: 'unit'
};
