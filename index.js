var md = require('markdown').markdown
var Constants = require('./Constants.js')

function isUsefulSteps (steps) {
  steps = parseSteps(steps)
  // If there's no steps
  if (Object.keys(steps).length === 0) {
    return Constants.EN_ADD_STEPS
  }
  return true
}

function parseSteps (markdown) {
  // TODO: I don't like that this is sync... Bah
  var parsedMarkdown = md.parse(markdown)

  // Convert lists into an mson inspired object
  var json = {}
  var shouldParse = false
  parsedMarkdown.forEach(function (markdownLine, index) {
    var lineType = markdownLine[0]

    // Look for start
    if (lineType === 'header' && fuzzyStringMatch(markdownLine[2], Constants.EN_START)) {
      shouldParse = true
    }

    // Look for end
    if (lineType === 'para' && fuzzyStringMatch(markdownLine[2], Constants.EN_END)) {
      shouldParse = false
    }

    if (!shouldParse) {
      return
    }

    if (lineType.indexOf('list') !== -1) {
      var listName = index
      // Search backwards for a header to give it it's listName.
      for (var i = index; i > -1; i--) {
        if (listName === index && parsedMarkdown[i][0] === 'header') {
          listName = parsedMarkdown[i][2]
        }
      }
      json[listName] = markdownListToObject(markdownLine)
    }
  })

  return json
}

// Used to detect start and ends of what we want to parse.
function fuzzyStringMatch (string, find) {
  if (typeof string !== 'string' || typeof find !== 'string') {
    return false
  }
  string = string.replace(/\s/g, '').toLowerCase()
  find = find.replace(/\s/g, '').toLowerCase()
  return string.indexOf(find) !== -1
}

// Any children get converted to HTML
function markdownListToObject (list) {
  var object = {}
  // Check for list items
  list.forEach(function (potentialListItem, index) {
    if (list[index][0] === 'listitem') {
      list[index].shift()
      var listItemName = index
      var listItemBody = list[index][0]
      // check for a key
      if (listItemBody.indexOf(':') !== -1) {
        listItemName = listItemBody.split(':')[0]
        listItemBody = listItemBody.replace(listItemName + ':', '').trim()
      }
      object[listItemName] = md.renderJsonML(md.toHTMLTree(list[index]))
    }
  })
  return object
}

module.exports = isUsefulSteps
