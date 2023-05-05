import { SyntheticEvent, ReactNode, useCallback } from 'react'
import Image from 'next/image'
import { Potion as PotionQuantifier } from '@/types';
import { usePotionQuantifier } from '@/store';
import { minMaxAllowedQuantities } from '@/config';

type Props = {
    potion: PotionQuantifier;
    onQuantitySelection: (quantity: number) => void
}

const [min, max] = minMaxAllowedQuantities

function constrain(value: number) {
    return Math.min(Math.max(value, min), max);
}

function PotionQuantifier({ potion, onQuantitySelection }: Props) {
    const [quantity, setQuantity] = usePotionQuantifier(potion.id)

    const updateQuantity = useCallback((quantity: number) => {
        const limitedValue = constrain(quantity);

        setQuantity(limitedValue)
        onQuantitySelection(limitedValue)
    }, [setQuantity, onQuantitySelection])

    const handleIncrease = () => {
        updateQuantity(quantity + 1);
    };

    const handleDecrease = () => {
        updateQuantity(quantity - 1);
    };

    const onChange = useCallback((event: SyntheticEvent) => {
        const target = event.target as HTMLInputElement
        const value = parseInt(target.value) || 0

        updateQuantity(value)
    }, [updateQuantity])

    return (
        <div className='flex flex-col w-32 p-4 box-content items-center gap-2'>
            <div className='font-semibold'>{potion.name}</div>

            <Image src={`/images/${potion.image}`} alt={potion.name} width={40} height={82} />

            <div className="flex items-center justify-center">
                <Button onClick={handleDecrease} className="rounded-l-lg border-r-0" name="decrease">-</Button>
                <input type="number"
                    name="quantity"
                    role="spinbutton"
                    aria-label='Quantity'
                    className='text-center w-16 border-gray-400 border rounded-none px-4 py-2 text-center"'
                    min={min}
                    max={max}
                    value={quantity}
                    onChange={onChange} />
                <Button onClick={handleIncrease} className="rounded-r-lg border-l-0" name="increase">+</Button>
            </div>

        </div>
    )
}

type ButtonProps = { onClick: (e: SyntheticEvent) => void, className: string, name: string, children: ReactNode }

function Button({ onClick, className, name, children }: ButtonProps) {
    return (
        <button onClick={onClick} className={`bg-gray-300 text-gray-700 px-4 py-2 border ${className} border-gray-400`} name={name} aria-label={name}>
            {children}
        </button>
    )
}

export default PotionQuantifier
