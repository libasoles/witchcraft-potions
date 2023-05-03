import Image from 'next/image'
import { useState } from 'react'

const potions = {
    red: { name: 'Red Potion', image: 'redPotion.png' },
    blue: { name: 'Blue Potion', image: 'bluePotion.png' },
    green: { name: 'Green Potion', image: 'greenPotion.png' },
    yellow: { name: 'Yellow Potion', image: 'yellowPotion.png' },
    gray: { name: 'Gray Potion', image: 'grayPotion.png' },
}

type PotionType = keyof typeof potions

type Props = {
    name: PotionType;
    onQuantitySelection: (quantity: number) => void
}

function Potion({ name, onQuantitySelection }: Props) {
    const potion = potions[name]
    const [quantity, setQuantity] = useState(0)

    return (
        <div className='flex flex-col w-32 p-4 box-content items-center gap-2'>
            <div className='font-semibold'>{potion.name}</div>
            <Image src={`/images/${potion.image}`} alt={potion.name} width={40} height={80} />
            <input type="number"
                name="quantity"
                role="spinbutton"
                aria-label='Quantity'
                className='text-center w-16'
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