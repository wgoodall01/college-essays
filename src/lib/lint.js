import writeGood from 'write-good';

export function lint(text) {
  // errors: [{index, offset, text, why, type:"warning"/"error"}]
  const allErrors = [
    ...errorsWriteGood(text),
    ...errorsDetectTK(text),
    ...errorsDetectTODO(text),
    ...errorsDetectTwospace(text)
  ];
  allErrors.sort((a, b) => a.index - b.index);
  return allErrors;
}

function errorsDetectTwospace(text) {
  const errors = [];

  const regex = /(  +)/g;

  for (let match = regex.exec(text); match; match = regex.exec(text)) {
    errors.push({
      index: match.index,
      offset: match[1].length,
      text: `"${match[1]}"`,
      why: 'includes two spaces after punctuation',
      type: 'error'
    });
  }

  return errors;
}

function errorsDetectTK(text) {
  const errors = [];

  const regex = /TK/g;

  for (let match = regex.exec(text); match; match = regex.exec(text)) {
    errors.push({
      index: match.index,
      offset: 2, // "TK".length == 2,
      text: 'TK',
      why: 'included in writing',
      type: 'error'
    });
  }

  return errors;
}

function errorsDetectTODO(text) {
  const errors = [];

  const regex = /TODO/g;

  for (let match = regex.exec(text); match; match = regex.exec(text)) {
    errors.push({
      index: match.index,
      offset: 4, // "TODO".length == 4,
      text: 'TODO',
      why: 'included in writing',
      type: 'error'
    });
  }

  return errors;
}

function errorsWriteGood(text) {
  const errors = writeGood(text);
  for (let err of errors) {
    const splitInd = err.reason.indexOf('"', 2);
    err.text = err.reason.substring(1, splitInd);
    err.why = err.reason.substring(splitInd + 1, err.reason.length).trim();
    err.type = 'warning';
  }
  return errors;
}
