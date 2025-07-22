import React, { useState } from 'react'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'

const Calculator: React.FC = () => {
  const [display, setDisplay] = useState('0')
  const [previousValue, setPreviousValue] = useState<number | null>(null)
  const [operation, setOperation] = useState<string | null>(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num)
      setWaitingForOperand(false)
    } else {
      setDisplay(display === '0' ? num : display + num)
    }
  }

  const inputOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display)

    if (previousValue === null) {
      setPreviousValue(inputValue)
    } else if (operation) {
      const currentValue = previousValue || 0
      const newValue = calculate(currentValue, inputValue, operation)

      setDisplay(String(newValue))
      setPreviousValue(newValue)
    }

    setWaitingForOperand(true)
    setOperation(nextOperation)
  }

  const calculate = (firstValue: number, secondValue: number, operation: string): number => {
    switch (operation) {
      case '+':
        return firstValue + secondValue
      case '-':
        return firstValue - secondValue
      case '×':
        return firstValue * secondValue
      case '÷':
        return firstValue / secondValue
      case '=':
        return secondValue
      default:
        return secondValue
    }
  }

  const performCalculation = () => {
    const inputValue = parseFloat(display)

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation)
      setDisplay(String(newValue))
      setPreviousValue(null)
      setOperation(null)
      setWaitingForOperand(true)
    }
  }

  const clear = () => {
    setDisplay('0')
    setPreviousValue(null)
    setOperation(null)
    setWaitingForOperand(false)
  }

  const clearEntry = () => {
    setDisplay('0')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-md mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Calculator
          </h1>
          
          {/* Display */}
          <div className="mb-4">
            <input
              type="text"
              value={display}
              readOnly
              className="w-full p-4 text-right text-2xl font-mono bg-gray-100 dark:bg-gray-700 border rounded-lg text-gray-900 dark:text-white"
            />
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-4 gap-2">
            {/* Row 1 */}
            <Button variant="outline" onClick={clear} className="text-red-600">C</Button>
            <Button variant="outline" onClick={clearEntry}>CE</Button>
            <Button variant="outline" onClick={() => inputOperation('÷')}>÷</Button>
            <Button variant="outline" onClick={() => inputOperation('×')}>×</Button>

            {/* Row 2 */}
            <Button variant="outline" onClick={() => inputNumber('7')}>7</Button>
            <Button variant="outline" onClick={() => inputNumber('8')}>8</Button>
            <Button variant="outline" onClick={() => inputNumber('9')}>9</Button>
            <Button variant="outline" onClick={() => inputOperation('-')}>-</Button>

            {/* Row 3 */}
            <Button variant="outline" onClick={() => inputNumber('4')}>4</Button>
            <Button variant="outline" onClick={() => inputNumber('5')}>5</Button>
            <Button variant="outline" onClick={() => inputNumber('6')}>6</Button>
            <Button variant="outline" onClick={() => inputOperation('+')}>+</Button>

            {/* Row 4 */}
            <Button variant="outline" onClick={() => inputNumber('1')}>1</Button>
            <Button variant="outline" onClick={() => inputNumber('2')}>2</Button>
            <Button variant="outline" onClick={() => inputNumber('3')}>3</Button>
            <Button variant="default" onClick={performCalculation} className="row-span-2 h-auto">=</Button>

            {/* Row 5 */}
            <Button variant="outline" onClick={() => inputNumber('0')} className="col-span-2">0</Button>
            <Button variant="outline" onClick={() => inputNumber('.')}>.</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Calculator
