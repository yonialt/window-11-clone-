import React, { useState } from 'react';

export const CalculatorWindow: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [prev, setPrev] = useState<number | null>(null);
  const [op, setOp] = useState<string | null>(null);
  const [fresh, setFresh] = useState(true);

  const input = (val: string) => {
    if (fresh) {
      setDisplay(val === '.' ? '0.' : val);
      setFresh(false);
    } else {
      if (val === '.' && display.includes('.')) return;
      setDisplay(display === '0' && val !== '.' ? val : display + val);
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

  const calc = (a: number, b: number, operator: string): number => {
    switch (operator) {
      case '+': return a + b;
      case '-': return a - b;
      case '×': return a * b;
      case '÷': return b !== 0 ? a / b : 0;
      default: return b;
    }
  };

  const equals = () => {
    if (prev === null || !op) return;
    const result = calc(prev, parseFloat(display), op);
    setDisplay(String(parseFloat(result.toFixed(10))));
    setPrev(null);
    setOp(null);
    setFresh(true);
  };

  const clear = () => {
    setDisplay('0');
    setPrev(null);
    setOp(null);
    setFresh(true);
  };

  const buttons = [
    ['C', '±', '%', '÷'],
    ['7', '8', '9', '×'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['0', '.', '='],
  ];

  const getBtnStyle = (btn: string) => {
    if (['÷', '×', '-', '+', '='].includes(btn)) {
      return { background: '#0078D4', color: 'white' };
    }
    if (['C', '±', '%'].includes(btn)) {
      return { background: 'rgba(255,255,255,0.12)', color: 'white' };
    }
    return { background: 'rgba(255,255,255,0.06)', color: 'white' };
  };

  const handleBtn = (btn: string) => {
    if (btn === 'C') clear();
    else if (btn === '±') setDisplay(String(parseFloat(display) * -1));
    else if (btn === '%') setDisplay(String(parseFloat(display) / 100));
    else if (['÷', '×', '-', '+'].includes(btn)) operate(btn);
    else if (btn === '=') equals();
    else input(btn);
  };

  return (
    <div className="flex flex-col h-full p-4" style={{ fontFamily: 'var(--win11-font)', background: '#1C1C1C' }}>
      <div className="flex-1 flex items-end justify-end px-2 pb-4">
        <span className="text-white text-5xl font-light truncate max-w-full">{display}</span>
      </div>
      <div className="grid gap-1.5" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {buttons.flat().map((btn, i) => (
          <button
            key={i}
            onClick={() => handleBtn(btn)}
            className="rounded-full text-lg font-medium transition-all hover:brightness-125 active:scale-95"
            style={{
              ...getBtnStyle(btn),
              height: btn === '0' ? 56 : 56,
              gridColumn: btn === '0' ? 'span 2' : undefined,
              fontSize: btn === 'C' ? 16 : 20,
            }}
          >
            {btn}
          </button>
        ))}
      </div>
    </div>
  );
};
