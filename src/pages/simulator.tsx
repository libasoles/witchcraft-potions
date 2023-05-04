import PotionQuantifier from '@/components/Potion'
import { useState } from 'react'
import type { Potions } from '@/types'
import { potions as PotionList } from '@/config'
import DamageReport from '@/components/DamageReport'

type Props = {
  potions: Potions
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

      {displayResultingDamage && <DamageReport />}
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