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
    <main>
      <h1>Market</h1>

      <div>
        <Potion onQuantitySelection={onQuantitySelection} />
      </div>

      <button type="button" disabled={!isBuyButtonEnabled} onClick={() => setDisplayResultingDamage(true)}>Buy</button>

      {
        displayResultingDamage && <div>
          <h2>Resulting Damage</h2>
          <div>
            <div>Attack 1: using 1 potion deals 3% damage.</div>
          </div>
        </div>
      }
    </main>
  )
}
