import { useState } from 'react'
import PotionQuantifier from '@/components/Potion'
import { potions as PotionList } from '@/config'
import DamageReport from '@/components/DamageReport'
import { usePotionQuantifiers } from '@/store/store.hooks'
import type { Potions } from '@/types'

type Props = {
  potions?: Potions
}

export default function Simulator({ potions = PotionList }: Props) {
  const [isDamageReportVisible, setDamageReportVisible] = useState(false)

  return (
    <main className='flex flex-col items-center w-[56em] p-8 h-full text-gray-300'>
      <h1 className="text-6xl font-mono text-center text-gray-500">Attack simulator</h1>

      <div className='flex flex-col gap-6 items-center m-8'>
        <div className='flex gap-6 justify-center'>
          {potions.map((potion) => <PotionQuantifier key={potion.id} potion={potion} />)}
        </div>

        {!isDamageReportVisible &&
          <Button onClick={setDamageReportVisible}>
            Simulate
          </Button>
        }

        {isDamageReportVisible && <DamageReport />}
      </div>
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
    className='bg-green-700 hover:bg-green-800 
    text-gray-300 hover:text-gray-200
      disabled:text-gray-700 font-bold py-2 px-4 rounded w-fit
      enabled:cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed'
  >{children}</button>
}