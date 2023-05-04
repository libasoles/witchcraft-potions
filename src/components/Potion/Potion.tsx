import { SyntheticEvent } from 'react'
import Image from 'next/image'
import { Potion as PotionQuantifier } from '@/types';
import { usePotionQuantifier } from '@/store';
import { minMaxAllowedQuantities } from '@/config';

type Props = {
    potion: PotionQuantifier;
    onQuantitySelection: (quantity: number) => void
}

const [min, max] = minMaxAllowedQuantities

function PotionQuantifier({ potion, onQuantitySelection }: Props) {
    const [quantity, setQuantity] = usePotionQuantifier(potion.id)

    // TODO: use callback?
    const onChange = (event: SyntheticEvent) => {
        const target = event.target as HTMLInputElement

        const value = parseInt(target.value) || 0
        const limitedNum = Math.min(Math.max(value, min), max);

        const newQuantity = limitedNum
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
                min={min}
                max={max}
                value={quantity}
                onChange={onChange} />
        </div>
    )
}

export default PotionQuantifier
