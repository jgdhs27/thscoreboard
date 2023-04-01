const replayTableBatchSize = 50;
const batchedTableParentHtml = document.getElementById('replay-table-bodies');

// Initialize global variables if they were not provided by html
// Needed for jest environment

var activeFilters = {};
var allReplays = [];

try {
  // initialize table content
  const xhr = new XMLHttpRequest();
  if(window.location.pathname === '/') {
    xhr.open('GET', window.location.href + 'replays/index/json', true);
  } else {
    xhr.open('GET', window.location.toString() + "/json", true);
  }
  xhr.responseType = 'json';
  xhr.onload = function() {
    if (xhr.status === 200) {
      allReplays = xhr.response;
      constructAndRenderBatchedTable(xhr.response);
    } else {
      document.getElementById('replay-table').innerHTML = '<p style="color: red;">Failed to load replays</p>';
    }
  };
  xhr.send();
} catch(error) {
  // Catch ReferenceError for test suite but do nothing
}

function onClick(elm) {
  const filterType = elm.getAttribute('filterType');
  const value = elm.getAttribute('value');
  
  activeFilters = updateFilters(activeFilters, filterType, value);
  const filteredReplays = filterReplays(activeFilters, allReplays);
  constructAndRenderBatchedTable(filteredReplays);
}

function updateFilters(filters, filterType, value) {
  if (filters[filterType] === undefined) {
    filters[filterType] = [];
  }
  const indexOfValue = filters[filterType].indexOf(value);
  if (indexOfValue === -1) {
    filters[filterType].push(value);
  }
  else {
    filters[filterType].splice(indexOfValue, 1);
    if (filters[filterType].length === 0) {
      delete filters[filterType];
    }
  }
  return filters;
}

function filterReplays(filters, replays) {
  let filteredReplays = [...replays];
  for (const [filterType, allowedValues] of Object.entries(filters)) {
    filteredReplays = filteredReplays.filter((replay) => {
      return allowedValues.includes(replay[filterType]);
    });
  };
  return filteredReplays;
}

function constructAndRenderBatchedTable(replays) {
  clearBatchedTableHtml();
  
  let startIndex = 0;
  let endIndex = Math.min(replayTableBatchSize, replays.length);
  while (startIndex < replays.length) {
    isFirstTable = startIndex === 0;
    constructAndRenderTableBody(
      replays, startIndex, endIndex, isFirstTable
    );
    startIndex += replayTableBatchSize;
    endIndex += replayTableBatchSize;
    endIndex = Math.min(endIndex, replays.length);
  }
}

function constructAndRenderTableBody(replays, startIndex, endIndex, isFirstTable) {
  const newTableHtml = document.createElement("table");
  newTableHtml.className = "replay-table";
  const newTBodyHtml = document.createElement("tbody");

  if (isFirstTable) {
    populateTable(newTBodyHtml, replays, startIndex, endIndex);
  } else {
    delayedPopulateTable(newTBodyHtml, replays, startIndex, endIndex);
  }

  newTableHtml.appendChild(newTBodyHtml);
  batchedTableParentHtml.appendChild(newTableHtml);
}

function delayedPopulateTable(tbodyHtml, replays, startIndex, endIndex) {
  // Delays the execution of the populateTable function to prevent blocking the
  // main thread and improve performance. This allows other code to run, such
  // as UI updates, while the table is being populated.
  setTimeout(() => {
    populateTable(tbodyHtml, replays, startIndex, endIndex)
  }, 1);
}

function populateTable(tbodyHtml, replays, startIndex, endIndex) {
  for (let i = startIndex; i < endIndex; i++) {
    const replay = replays[i];
    const row = document.createElement('tr');
    for (const [columnName, value] of Object.entries(replay)) {
      const cell = createTableCell(columnName, value)
      if (cell) {
        row.appendChild(cell);
      }
    }
    tbodyHtml.appendChild(row);
  }
}

 function createTableCell(columnName, value) {
  const cell = document.createElement('td');
  if ((columnName === "Game" && !showGameColumn) || columnName === "Id") {
    return null;
  }

  // Value is primitive or has type {"text": ..., "url": ...}
  if (typeof value === "object") {
    cell.appendChild(createLink(value.url, value.text));
  } else { 
    const text = document.createTextNode(value);
    cell.appendChild(text);
  }
  return cell;
}

function createLink(url, text) {
  const link = document.createElement('a'); // 'a' as in the <a> HTML tag
  link.href = url;
  const linkText = document.createTextNode(text);
  link.appendChild(linkText)
  return link;
}

function clearBatchedTableHtml() {
  batchedTableParentHtml.innerHTML = '';
}

try {
  module.exports = {updateFilters, filterReplays};
} catch(error) {
  // Shut up error in console but do nothing
}
