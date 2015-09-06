#!/usr/bin/env node

var isUsefulSteps = require('./index')

var stdin = ''

process.stdin.on('readable', function () {
  var chunk = this.read()
  if (chunk !== null) {
    stdin += chunk
  }
})

process.stdin.on('end', function () {
  var isUseful = isUsefulSteps(stdin)
  if (isUseful === true) {
    console.log('OK')
  } else {
    console.log(isUseful)
  }
})
