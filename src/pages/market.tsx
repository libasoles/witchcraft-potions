import Potion from '@/components/Potion'
import { useState } from 'react'

export default function Market() {
  const [isBuyButtonEnabled, setIsBuyButtonEnabled] = useState(false)
  const [displayResultingDamage, setDisplayResultingDamage] = useState(false)

  const onQuantitySelection = (quantity: number) => {
    const isQuantityValid = quantity !== 0
    setIsBuyButtonEnabled(isQuantityValid)
  } // TODO: wrap in useCallback?

  return (
    <main className='p-8'>
      <h1 className="text-6xl font-mono text-center text-gray-800">Market</h1>

      <div className='flex flex-col gap-6 items-center m-8'>
        <div className='flex gap-6 justify-center'>
          <Potion name="red" onQuantitySelection={onQuantitySelection} />
          <Potion name="blue" onQuantitySelection={onQuantitySelection} />
          <Potion name="green" onQuantitySelection={onQuantitySelection} />
          <Potion name="yellow" onQuantitySelection={onQuantitySelection} />
          <Potion name="gray" onQuantitySelection={onQuantitySelection} />
        </div>

        <Button enabled={isBuyButtonEnabled} onClick={setDisplayResultingDamage}>
          Buy
        </Button>
      </div>

      {
        displayResultingDamage && <div className='m-8'>
          <h2>Resulting Damage</h2>
          <div>
            <div>Attack 1: using 1 potion deals 3% damage.</div>
          </div>
        </div>
      }
    </main>
  )
}

type ButtonProps = {
  children: React.ReactNode
  enabled: boolean
  onClick: (enabled: boolean) => void
}

function Button({ children, enabled, onClick }: ButtonProps) {
  return <button type="button"
    disabled={!enabled}
    onClick={() => onClick(true)}
    className='bg-green-500 hover:bg-green-700 
    text-white font-bold py-2 px-4 rounded w-fit
    enabled:cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed'
  >{children}</button>
}