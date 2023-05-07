import { SyntheticEvent, ReactNode, useCallback } from 'react'
import Image from 'next/image'
import { usePotionQuantifier } from '@/store/store.hooks';
import { minMaxAllowedQuantities } from '@/config';
import type { Potion as PotionQuantifier } from '@/types';

type Props = {
    potion: PotionQuantifier;
}

const [min, max] = minMaxAllowedQuantities

function PotionQuantifier({ potion }: Props) {
    const [quantity, setQuantity] = usePotionQuantifier(potion.id)

    const handleIncrease = () => {
        setQuantity(potion.id, quantity + 1); // TODO: maybe receive previous value using a lambda
    };

    const handleDecrease = () => {
        setQuantity(potion.id, quantity - 1);
    };

    const onChange = useCallback((event: SyntheticEvent) => {
        const target = event.target as HTMLInputElement
        const value = parseInt(target.value) || 0

        setQuantity(potion.id, value)
    }, [potion.id, setQuantity])

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
                    className='text-center w-16 bg-gray-800 text-gray-300 border-gray-700 border rounded-none px-4 py-2 text-center"'
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
        <button onClick={onClick} className={`bg-gray-700 text-gray-300 px-4 py-2 border ${className} border-gray-700`} name={name} aria-label={name}>
            {children}
        </button>
    )
}

export default PotionQuantifier
