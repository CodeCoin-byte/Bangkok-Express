// doesn't work for td and some other elements that may not be placed into <div>
function createElement(html) {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.firstElementChild;
}

const escapeHtml = (string) => Array.from(string).map(char => {
  switch(char) {
    case '&':
      return '&amp;';
    case '"':
      return '&quot;';
    case '\'':
      return '&#39;';
    case '<':
      return '&lt;';
    case '>':
      return '&gt;';
    default:
      return char;
  }
}).join('');

export {createElement, escapeHtml}
