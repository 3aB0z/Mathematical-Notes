import React, { useState } from 'react';
import { PLACEHOLDER } from '../utils/latexHelpers';

interface MathKeyboardProps {
  onInsert: (template: string) => void;
}

interface KeyConfig {
  label: string;
  template: string;
  tooltip: string;
}

interface KeyCategory {
  name: string;
  keys: KeyConfig[];
}

const CATEGORIES: KeyCategory[] = [
  {
    name: 'Basic',
    keys: [
      { label: 'x/y', template: `\\frac{${PLACEHOLDER}}{${PLACEHOLDER}}`, tooltip: 'Fraction' },
      { label: 'x^n', template: `^{${PLACEHOLDER}}`, tooltip: 'Superscript' },
      { label: 'x_n', template: `_{${PLACEHOLDER}}`, tooltip: 'Subscript' },
      { label: '√', template: `\\sqrt{${PLACEHOLDER}}`, tooltip: 'Square Root' },
      { label: 'n√', template: `\\sqrt[${PLACEHOLDER}]{${PLACEHOLDER}}`, tooltip: 'N-th Root' },
      { label: '()', template: `(${PLACEHOLDER})`, tooltip: 'Parentheses' },
      { label: '[]', template: `[${PLACEHOLDER}]`, tooltip: 'Brackets' },
      { label: '{}', template: `\\{${PLACEHOLDER}\\}`, tooltip: 'Braces' },
      { label: '|x|', template: `|${PLACEHOLDER}|`, tooltip: 'Absolute Value' },
    ]
  },
  {
    name: 'Calculus',
    keys: [
      { label: '∫', template: `\\int`, tooltip: 'Integral' },
      { label: '∫a-b', template: `\\int_{${PLACEHOLDER}}^{${PLACEHOLDER}}`, tooltip: 'Definite Integral' },
      { label: '∑', template: `\\sum`, tooltip: 'Sum' },
      { label: '∑i=0', template: `\\sum_{${PLACEHOLDER}=${PLACEHOLDER}}^{${PLACEHOLDER}}`, tooltip: 'Summation Range' },
      { label: 'lim', template: `\\lim_{${PLACEHOLDER} \\to ${PLACEHOLDER}}`, tooltip: 'Limit' },
      { label: '∂', template: `\\partial`, tooltip: 'Partial Derivative' },
      { label: 'd/dx', template: `\\frac{d}{dx}`, tooltip: 'Derivative Operator' },
      { label: '∞', template: `\\infty`, tooltip: 'Infinity' },
      { label: '→', template: `\\to`, tooltip: 'Approaches' },
    ]
  },
  {
    name: 'Greek',
    keys: [
      { label: 'α', template: '\\alpha', tooltip: 'Alpha' },
      { label: 'β', template: '\\beta', tooltip: 'Beta' },
      { label: 'γ', template: '\\gamma', tooltip: 'Gamma' },
      { label: 'δ', template: '\\delta', tooltip: 'Delta' },
      { label: 'Δ', template: '\\Delta', tooltip: 'Delta (Upper)' },
      { label: 'ε', template: '\\epsilon', tooltip: 'Epsilon' },
      { label: 'θ', template: '\\theta', tooltip: 'Theta' },
      { label: 'λ', template: '\\lambda', tooltip: 'Lambda' },
      { label: 'μ', template: '\\mu', tooltip: 'Mu' },
      { label: 'π', template: '\\pi', tooltip: 'Pi' },
      { label: 'ρ', template: '\\rho', tooltip: 'Rho' },
      { label: 'σ', template: '\\sigma', tooltip: 'Sigma' },
      { label: 'Σ', template: '\\Sigma', tooltip: 'Sigma (Upper)' },
      { label: 'τ', template: '\\tau', tooltip: 'Tau' },
      { label: 'φ', template: '\\phi', tooltip: 'Phi' },
      { label: 'ω', template: '\\omega', tooltip: 'Omega' },
      { label: 'Ω', template: '\\Omega', tooltip: 'Omega (Upper)' },
    ]
  },
  {
    name: 'Operators',
    keys: [
      { label: '±', template: '\\pm', tooltip: 'Plus-Minus' },
      { label: '×', template: '\\times', tooltip: 'Times' },
      { label: '⋅', template: '\\cdot', tooltip: 'Dot' },
      { label: '÷', template: '\\div', tooltip: 'Divide' },
      { label: '≠', template: '\\neq', tooltip: 'Not Equal' },
      { label: '≈', template: '\\approx', tooltip: 'Approximately' },
      { label: '≤', template: '\\leq', tooltip: 'Less than or Equal' },
      { label: '≥', template: '\\geq', tooltip: 'Greater than or Equal' },
      { label: '≡', template: '\\equiv', tooltip: 'Equivalent' },
      { label: '∀', template: '\\forall', tooltip: 'For All' },
      { label: '∃', template: '\\exists', tooltip: 'Exists' },
      { label: '∈', template: '\\in', tooltip: 'Element Of' },
      { label: '∉', template: '\\notin', tooltip: 'Not Element Of' },
      { label: '⊂', template: '\\subset', tooltip: 'Subset' },
      { label: '∪', template: '\\cup', tooltip: 'Union' },
      { label: '∩', template: '\\cap', tooltip: 'Intersection' },
    ]
  },
  {
    name: 'Matrix',
    keys: [
      { label: 'Matrix 2x2', template: `\\begin{bmatrix} ${PLACEHOLDER} & ${PLACEHOLDER} \\\\ ${PLACEHOLDER} & ${PLACEHOLDER} \\end{bmatrix}`, tooltip: '2x2 Matrix' },
      { label: 'Vector', template: `\\begin{bmatrix} ${PLACEHOLDER} \\\\ ${PLACEHOLDER} \\end{bmatrix}`, tooltip: 'Vector' },
      { label: 'Cases', template: `\\begin{cases} ${PLACEHOLDER} & \\text{if } ${PLACEHOLDER} \\\\ ${PLACEHOLDER} & \\text{otherwise} \\end{cases}`, tooltip: 'Cases' },
    ]
  }
];

const MathKeyboard: React.FC<MathKeyboardProps> = ({ onInsert }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="flex flex-col bg-gray-50 border-t border-gray-200 select-none">
      {/* Tabs */}
      <div className="flex bg-gray-100 border-b border-gray-200 overflow-x-auto no-scrollbar">
        {CATEGORIES.map((cat, index) => (
          <button
            key={cat.name}
            onClick={() => setActiveTab(index)}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap focus:outline-none transition-colors ${
              activeTab === index
                ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="p-2 overflow-y-auto max-h-48">
        <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2">
          {CATEGORIES[activeTab].keys.map((key, idx) => (
            <button
              key={`${activeTab}-${idx}`}
              onMouseDown={(e) => {
                 // Important: Prevent the button from stealing focus from the editor
                 e.preventDefault();
              }}
              onClick={() => onInsert(key.template)}
              title={key.tooltip}
              className="flex items-center justify-center h-10 p-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-blue-50 hover:border-blue-400 hover:text-blue-700 transition-all shadow-sm active:scale-95 active:bg-blue-100"
            >
              {key.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MathKeyboard;