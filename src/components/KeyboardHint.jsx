import React from 'react';

export default function KeyboardHint() {
  return (
    <div className="keyboard-hint" aria-hidden="true">
      <span><kbd>1</kbd>-<kbd>9</kbd> Place Move</span>
      <span><kbd>&larr;&uarr;&darr;&rarr;</kbd> Navigate</span>
      <span><kbd>R</kbd> Restart</span>
      <span><kbd>M</kbd> Mute</span>
    </div>
  );
}
