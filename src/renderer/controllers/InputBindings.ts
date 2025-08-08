export type Command =
  | "OPEN"
  | "SAVE"
  | "SAVE_AS"
  | "NEW"
  | "MOVE_LEFT"
  | "MOVE_RIGHT"
  | "MOVE_UP"
  | "MOVE_DOWN"
  | "BACKSPACE"
  | "ENTER";

export interface KeyEventLike {
  key: string;
  metaKey?: boolean;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
}

interface KeyBinding {
  key: string; // normalized lower-case except named keys like ArrowLeft, Backspace, Enter
  meta?: boolean;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  command: Command;
}

const BINDINGS: KeyBinding[] = [
  { key: "o", meta: true, command: "OPEN" },
  { key: "s", meta: true, command: "SAVE" },
  { key: "s", meta: true, shift: true, command: "SAVE_AS" },
  { key: "n", meta: true, command: "NEW" },

  { key: "arrowleft", command: "MOVE_LEFT" },
  { key: "arrowright", command: "MOVE_RIGHT" },
  { key: "arrowup", command: "MOVE_UP" },
  { key: "arrowdown", command: "MOVE_DOWN" },
  { key: "backspace", command: "BACKSPACE" },
  { key: "enter", command: "ENTER" },
];

function normalizeKey(key: string): string {
  const named = [
    "ArrowLeft",
    "ArrowRight",
    "ArrowUp",
    "ArrowDown",
    "Backspace",
    "Enter",
  ];
  if (named.includes(key)) return key.toLowerCase();
  return key.length === 1 ? key.toLowerCase() : key.toLowerCase();
}

export function resolveCommand(event: KeyEventLike): Command | null {
  const key = normalizeKey(event.key);
  for (const b of BINDINGS) {
    if (b.key !== key) continue;
    const meta = Boolean(event.metaKey);
    const ctrl = Boolean(event.ctrlKey);
    const shift = Boolean(event.shiftKey);
    const alt = Boolean(event.altKey);
    if (
      (b.meta ?? false) === meta &&
      (b.ctrl ?? false) === ctrl &&
      (b.shift ?? false) === shift &&
      (b.alt ?? false) === alt
    ) {
      return b.command;
    }
  }
  return null;
}

export function isTextInsertion(event: KeyEventLike): boolean {
  return event.key.length === 1 && !event.metaKey && !event.ctrlKey && true;
}
