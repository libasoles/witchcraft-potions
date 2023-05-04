import { SyntheticEvent, useState } from 'react'
import Image from 'next/image'
import { Potion as PotionQuantifier } from '@/types';

type Props = {
    potion: PotionQuantifier;
    onQuantitySelection: (quantity: number) => void
}

const defaultAmount = 0

function PotionQuantifier({ potion, onQuantitySelection }: Props) {
    const [quantity, setQuantity] = useState(defaultAmount)

    // TODO: use callback?
    const onChange = (event: SyntheticEvent) => {
        const target = event.target as HTMLInputElement
        const newQuantity = target.value ? parseInt(target.value) : defaultAmount
        setQuantity(newQuantity)
        onQuantitySelection(newQuantity)
    }

    return (
        <div className='flex flex-col w-32 p-4 box-content items-center gap-2'>
            <div className='font-semibold'>{potion.name}</div>
            <Image src={`/images/${potion.image}`} alt={potion.name} width={40} height={82} />
            <input type="number"
                name="quantity"
                role="spinbutton"
                aria-label='Quantity'
                className='text-center w-16'
                min={0}
                value={quantity}
                onChange={onChange} />
        </div>
    )
}

export default PotionQuantifier