var assert = require('assert')
var fs = require('fs')

var isUsefulSteps = require('./index')
var Constants = require('./Constants.js')

// If there's no steps return message
assert.equal(isUsefulSteps(''), Constants.EN_ADD_STEPS)

fs.readFile('./test.md', 'utf8', function (err, data) {
  if (err) {
    return console.log(err)
  }
  // If we have steps isUsefulSteps should return true.
  assert.equal(isUsefulSteps(data), true)
})

var https = require('https')

https.get(
  {
    hostname: 'api.github.com',
    port: 443,
    path: '/repos/yourfirstpr/yourfirstpr.github.io/issues/7',
    headers: { 'user-agent': 'yourfirstpr-issue-proto Tests' }
  },
  function (res) {
    var str = ''

    res.on('data', function (chunk) {
      str += chunk
    })
    res.on('end', function () {
      var body = JSON.parse(str).body
      assert.equal(isUsefulSteps(body), true)
    })
  }
).on('error', function (e) {
  console.log(e.message)
})

// Test the example in the README
var exec = require('child_process').exec

exec('cat test.md | ./cli.js', function (error, stdout, stderr) {
  assert.equal(stdout, 'OK\n')
  if (error !== null) {
    console.log('exec error: ' + error)
  }
})
