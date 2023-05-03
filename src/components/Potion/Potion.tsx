import Image from 'next/image'
import { useState } from 'react'

type Props = {
    onQuantitySelection: (quantity: number) => void
}

function Potion({ onQuantitySelection }: Props) {
    const [quantity, setQuantity] = useState(0)

    return (
        <div className='flex flex-col w-10 p-4 box-content'>
            <Image src="/images/redPotion.png" alt="Red Potion" width={40} height={80} />
            <input type="number"
                name="quantity"
                role="spinbutton"
                aria-label='Quantity'
                className='text-center'
                value={quantity}
                onChange={(event) => {
                    const target = event.target as HTMLInputElement
                    const newQuantity = target.value ? parseInt(target.value) : 0
                    setQuantity(newQuantity)
                    onQuantitySelection(newQuantity)
                }} />
        </div>
    )
}

export default Potion