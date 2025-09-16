export function joinStrings(obj: any) {
  const result = [];

  for (const key in obj) {
    if (typeof obj[key] === 'string' && obj[key] !== ',') {
      result.push(obj[key]);
    } else if (typeof obj[key] === 'object') {
      result.push(joinStrings(obj[key]));
    }
  }

  return result.join('\n');
}
