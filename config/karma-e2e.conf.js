basePath = '../';

files = [
  ANGULAR_SCENARIO,
  ANGULAR_SCENARIO_ADAPTER,
  'app/lib/jquery/jquery-1.9.1.min.js',
  'test/e2e/**/*.js'
];

autoWatch = false;

browsers = ['Chrome'];

singleRun = true;

proxies = {
  '/': 'http://localhost:8000/'
};

junitReporter = {
  outputFile: 'test_out/e2e.xml',
  suite: 'e2e'
};
