import PotionQuantifier from '@/components/Potion'
import { useState } from 'react'
import { potions as PotionList } from '@/config'
import DamageReport from '@/components/DamageReport'
import { usePotionQuantifiers } from '@/store'
import type { Potions } from '@/types'

type Props = {
  potions: Potions
}

export default function Simulator({ potions = PotionList }: Props) {
  const [displayResultingDamage, setDisplayResultingDamage] = useState(false)

  return (
    <main className='flex flex-col items-center w-[56em] p-8 h-full'>
      <h1 className="text-6xl font-mono text-center text-gray-800">Attack simulator</h1>

      <div className='flex flex-col gap-6 items-center m-8'>
        <div className='flex gap-6 justify-center'>
          {potions.map((potion) => <PotionQuantifier key={potion.id} potion={potion} />)}
        </div>

        {!displayResultingDamage &&
          <Button onClick={setDisplayResultingDamage}>
            Simulate
          </Button>
        }
      </div>

      {displayResultingDamage && <DamageReport />}
    </main>
  )
}

type ButtonProps = {
  children: React.ReactNode
  onClick: (enabled: boolean) => void
}

function Button({ children, onClick }: ButtonProps) {
  const { isAnyPotionSelected } = usePotionQuantifiers()
  const enabled = isAnyPotionSelected()

  return <button type="button"
    disabled={!enabled}
    onClick={() => onClick(true)}
    className='bg-green-500 hover:bg-green-700 
    text-white font-bold py-2 px-4 rounded w-fit
    enabled:cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed'
  >{children}</button>
}