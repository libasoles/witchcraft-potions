import Image from 'next/image'
import { useState } from 'react'

export default function Home() {
  const [quantity, setQuantity] = useState(0)
  const [isBuyButtonDisabled, setIsBuyButtonDisabled] = useState(true)
  const [displayResultingDamage, setDisplayResultingDamage] = useState(false)

  return (
    <main>
      <h1>Market</h1>

      <div>
        <Image src="/images/redPotion.png" alt="Red Potion" width={200} height={200} />
        <input type="number" name="quantity" min="0" max="99" role="spinbutton" aria-label='Quantity'
          value={quantity} onChange={(event) => {
            const newQuantity = event.target.value ? parseInt(event.target.value) : 0
            setQuantity(newQuantity)
            setIsBuyButtonDisabled(newQuantity === 0)
          }} />
      </div>

      <button type="button" disabled={isBuyButtonDisabled} onClick={() => setDisplayResultingDamage(true)}>Buy</button>

      {displayResultingDamage && <div>
        <h2>Resulting Damage</h2>
        <div>
          <div>Attack 1: using 1 potion deals 3% damage.</div>
        </div>
      </div>}
    </main>
  )
}
