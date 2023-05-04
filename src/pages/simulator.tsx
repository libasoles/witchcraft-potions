import PotionQuantifier from '@/components/Potion'
import { useState } from 'react'
import type { Potion } from '@/types'
import { potions as PotionList } from '@/potions'

type Props = {
  potions: Potion[]
}

export default function Simulator({ potions = PotionList }: Props) {
  const [isSimulationButtonEnabled, setIsSimulationButtonEnabled] = useState(false)
  const [displayResultingDamage, setDisplayResultingDamage] = useState(false)

  const onQuantitySelection = (quantity: number) => {
    const isQuantityValid = quantity !== 0
    setIsSimulationButtonEnabled(isQuantityValid)
  } // TODO: wrap in useCallback?

  return (
    <main className='p-8'>
      <h1 className="text-6xl font-mono text-center text-gray-800">Attack simulator</h1>

      <div className='flex flex-col gap-6 items-center m-8'>
        <div className='flex gap-6 justify-center'>
          {potions.map((potion) => <PotionQuantifier key={potion.id} potion={potion} onQuantitySelection={onQuantitySelection} />)}
        </div>

        <Button enabled={isSimulationButtonEnabled} onClick={setDisplayResultingDamage}>
          Simulate
        </Button>
      </div>

      {
        displayResultingDamage && <div className='m-8'>
          <h2>Resulting Damage</h2>
          <div data-testid='best-attacks'>
            <div>Attack 1: using 1 potion deals 3% damage.</div>
            <div>Attack 2: using 2 different potions deals 5% damage.</div>
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