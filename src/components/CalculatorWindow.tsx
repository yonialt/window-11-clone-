import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { Menu } from 'lucide-react';

interface KeyDef {
  label: string;
  kind: 'func' | 'num' | 'op' | 'equals';
}

// Windows 11 Calculator — Standard mode keypad layout
const KEY_ROWS: KeyDef[][] = [
  [
    { label: '%', kind: 'func' },
    { label: 'CE', kind: 'func' },
    { label: 'C', kind: 'func' },
    { label: '⌫', kind: 'func' },
  ],
  [
    { label: '¹⁄ₓ', kind: 'func' },
    { label: 'x²', kind: 'func' },
    { label: '²√x', kind: 'func' },
    { label: '÷', kind: 'op' },
  ],
  [
    { label: '7', kind: 'num' },
    { label: '8', kind: 'num' },
    { label: '9', kind: 'num' },
    { label: '×', kind: 'op' },
  ],
  [
    { label: '4', kind: 'num' },
    { label: '5', kind: 'num' },
    { label: '6', kind: 'num' },
    { label: '−', kind: 'op' },
  ],
  [
    { label: '1', kind: 'num' },
    { label: '2', kind: 'num' },
    { label: '3', kind: 'num' },
    { label: '+', kind: 'op' },
  ],
  [
    { label: '±', kind: 'func' },
    { label: '0', kind: 'num' },
    { label: '.', kind: 'num' },
    { label: '=', kind: 'equals' },
  ],
];

const MEMORY_BUTTONS = ['MC', 'MR', 'M+', 'M−', 'MS'];

// Windows 11 light-theme key colors
const KEY_CLASSES: Record<KeyDef['kind'], string> = {
  func: 'bg-white border-[#E0E0E0] text-[#1B1B1B] hover:bg-[#F5F5F5] active:bg-[#E9E9E9]',
  num: 'bg-white border-[#E0E0E0] text-[#1B1B1B] hover:bg-[#F5F5F5] active:bg-[#E9E9E9]',
  op: 'bg-[#F0F0F0] border-[#E6E6E6] text-[#1B1B1B] hover:bg-[#E3E3E3] active:bg-[#D9D9D9]',
  equals: 'bg-[#0067C0] border-[#0067C0] text-white hover:bg-[#005A9E] active:bg-[#004D87]',
};

const KEY_FONT_SIZE: Record<KeyDef['kind'], string> = {
  func: 'text-sm',
  num: 'text-xl',
  op: 'text-2xl',
  equals: 'text-2xl',
};

export const CalculatorWindow: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [prev, setPrev] = useState<number | null>(null);
  const [op, setOp] = useState<string | null>(null);
  const [fresh, setFresh] = useState(true);
  const [memory, setMemory] = useState<number | null>(null);

  const input = (val: string) => {
    if (fresh) {
      setDisplay(val === '.' ? '0.' : val);
      setFresh(false);
    } else {
      if (val === '.' && display.includes('.')) return;
      setDisplay(display === '0' && val !== '.' ? val : display + val);
    }
  };

  const calc = (a: number, b: number, operator: string): number => {
    switch (operator) {
      case '+': return a + b;
      case '−': return a - b;
      case '×': return a * b;
      case '÷': return b !== 0 ? a / b : 0;
      default: return b;
    }
  };

  const operate = (operator: string) => {
    const current = parseFloat(display);
    if (prev !== null && op && !fresh) {
      const result = calc(prev, current, op);
      setDisplay(String(result));
      setPrev(result);
    } else {
      setPrev(current);
    }
    setOp(operator);
    setFresh(true);
  };

  const equals = () => {
    if (prev === null || !op) return;
    const result = calc(prev, parseFloat(display), op);
    setDisplay(String(parseFloat(result.toFixed(10))));
    setPrev(null);
    setOp(null);
    setFresh(true);
  };

  const clearAll = () => {
    setDisplay('0');
    setPrev(null);
    setOp(null);
    setFresh(true);
  };

  const clearEntry = () => {
    setDisplay('0');
    setFresh(true);
  };

  const backspace = () => {
    if (fresh) return;
    setDisplay((d) =>
      d.length <= 1 || (d.length === 2 && d.startsWith('-')) ? '0' : d.slice(0, -1)
    );
  };

  const applyUnary = (fn: (n: number) => number) => {
    const result = fn(parseFloat(display));
    if (result === Infinity || result === -Infinity) {
      setDisplay('Cannot divide by zero');
      setFresh(true);
      return;
    }
    if (Number.isNaN(result)) {
      setDisplay('Invalid input');
      setFresh(true);
      return;
    }
    setDisplay(String(parseFloat(result.toFixed(10))));
    setFresh(true);
  };

  const toggleSign = () => setDisplay(String(parseFloat(display) * -1));
  const percent = () => setDisplay(String(parseFloat(display) / 100));

  const handleKey = (label: string) => {
    switch (label) {
      case '%': percent(); break;
      case 'CE': clearEntry(); break;
      case 'C': clearAll(); break;
      case '⌫': backspace(); break;
      case '¹⁄ₓ': applyUnary((n) => 1 / n); break;
      case 'x²': applyUnary((n) => n * n); break;
      case '²√x': applyUnary((n) => Math.sqrt(n)); break;
      case '÷':
      case '×':
      case '−':
      case '+': operate(label); break;
      case '=': equals(); break;
      case '±': toggleSign(); break;
      default: input(label);
    }
  };

  const hasMemory = memory !== null;

  const memoryAction = (action: string) => {
    const current = parseFloat(display);
    switch (action) {
      case 'MC': setMemory(null); break;
      case 'MR':
        if (hasMemory) {
          setDisplay(String(memory));
          setFresh(true);
        }
        break;
      case 'M+': setMemory((m) => (m ?? 0) + current); break;
      case 'M−': setMemory((m) => (m ?? 0) - current); break;
      case 'MS': setMemory(current); break;
    }
  };

  // Keyboard support — same keys as the real calculator
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (/^[0-9]$/.test(e.key)) input(e.key);
      else if (e.key === '.') input('.');
      else if (e.key === '+') operate('+');
      else if (e.key === '-') operate('−');
      else if (e.key === '*') operate('×');
      else if (e.key === '/') { e.preventDefault(); operate('÷'); }
      else if (e.key === 'Enter' || e.key === '=') equals();
      else if (e.key === 'Backspace') backspace();
      else if (e.key === 'Escape') clearAll();
      else if (e.key === 'Delete') clearEntry();
      else if (e.key === '%') percent();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const expression = prev !== null && op ? `${prev} ${op}` : '';

  // Auto-fit the displayed number/result: shrink the font until it fits the
  // display box in BOTH directions (never clipped, never hidden).
  const valueRef = useRef<HTMLSpanElement>(null);

  const fitDisplay = () => {
    const el = valueRef.current;
    if (!el) return;
    const box = el.parentElement;
    if (!box) return;
    let size = 52;
    el.style.fontSize = `${size}px`;
    const maxWidth = box.clientWidth - 2;
    const maxHeight = box.clientHeight;
    while (size > 14 && (el.scrollWidth > maxWidth || el.scrollHeight > maxHeight)) {
      size -= 2;
      el.style.fontSize = `${size}px`;
    }
  };

  useLayoutEffect(() => {
    fitDisplay();
    window.addEventListener('resize', fitDisplay);
    return () => window.removeEventListener('resize', fitDisplay);
  });

  return (
    <div
      className="flex flex-col h-full select-none"
      style={{ fontFamily: 'var(--win11-font), "Segoe UI", sans-serif', background: '#FFFFFF', color: '#1B1B1B' }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-3 pt-3 shrink-0">
        <button className="p-1.5 -ml-1.5 rounded hover:bg-black/5 transition-colors" title="Menu">
          <Menu className="w-4 h-4 text-[#1B1B1B]" />
        </button>
        <span className="text-sm font-semibold">Standard</span>
      </div>

      {/* Memory row */}
      <div className="flex items-center gap-1 px-3 pt-2.5 shrink-0">
        <span className="text-xs text-[#484848] w-14 flex items-center gap-1.5 shrink-0">
          {hasMemory && <span className="w-1.5 h-1.5 rounded-full bg-[#0067C0] shrink-0" />}
          Memory
        </span>
        {MEMORY_BUTTONS.map((m) => {
          const disabled = (m === 'MR' || m === 'M+' || m === 'M−') && !hasMemory;
          return (
            <button
              key={m}
              disabled={disabled}
              onClick={() => memoryAction(m)}
              className="flex-1 py-1.5 rounded text-xs font-medium text-[#1B1B1B] hover:bg-black/5 active:bg-black/10 transition-colors disabled:text-[#A8A8A8] disabled:pointer-events-none"
            >
              {m}
            </button>
          );
        })}
      </div>

      {/* Display */}
      <div className="flex-1 flex flex-col items-end justify-end px-4 pb-3 pt-2 min-h-[44px] overflow-hidden">
        <span className="text-sm text-[#484848] h-5 leading-5 truncate max-w-full">{expression}</span>
        <span
          ref={valueRef}
          className="font-light text-[#1B1B1B] leading-tight whitespace-nowrap max-w-full"
          style={{ fontSize: 52 }}
        >
          {display}
        </span>
      </div>

      {/* Keypad */}
      <div className="px-3 pb-3 pt-1 grid gap-1.5 shrink-0" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {KEY_ROWS.flat().map((key) => (
          <button
            key={key.label}
            onClick={() => handleKey(key.label)}
            className={`h-[54px] rounded-[4px] border transition-colors active:scale-[0.98] ${KEY_CLASSES[key.kind]} ${KEY_FONT_SIZE[key.kind]}`}
          >
            {key.label}
          </button>
        ))}
      </div>
    </div>
  );
};
