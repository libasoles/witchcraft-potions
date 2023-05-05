import { damagePercentByPotionQuantity } from "@/config"
import { usePotionQuantifiers } from "@/store"
import { calculateDamage } from "./calculateDamage"
import type { NumberOfPotions } from "@/types"

export default function DamageReport() {
    const { quantifiers } = usePotionQuantifiers()

    const { attacks, total } = calculateDamage(Object.values(quantifiers))

    if (attacks.length === 0) return <div>No possible attacks. Select at least one potion.</div>

    return (
        <div className='bg-gray-800  w-full p-4 m-8 animate-fade-in-out'>
            <h2 className="text-2xl font-bold mb-4">Resulting Damage</h2>
            <ul className="text-gray-400 list-disc list-inside mb-4 max-h-[20em] overflow-y-scroll" data-testid='best-attacks'>
                {attacks.map((numberOfPotions: number, index: number) => {
                    const description = explainAttack(numberOfPotions as NumberOfPotions)

                    return <li key={index} className="mb-2">Attack {index + 1}: {description}</li>
                })}
            </ul>
            <div className="border-t border-gray-700 pt-4">
                <p className="text-lg font-bold" data-testid="total">
                    Total: {explainTotal(total)}
                </p>
            </div>
        </div >
    )
}

function explainAttack(numberOfPotions: NumberOfPotions) {
    const potionWording = numberOfPotions > 1 ? 'different potions' : 'potion'
    const percentage = damagePercentByPotionQuantity[numberOfPotions]

    return `using ${numberOfPotions} ${potionWording} deals ${percentage}% damage.`
}

function explainTotal(percentage: number) {
    return `the warlock has dealt ${percentage}% damage.`
}
