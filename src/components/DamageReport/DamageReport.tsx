import { damagePercentByPotionQuantity } from "@/config"
import { usePotionQuantifiers } from "@/store"
import { AmountOfPotions as NumberOfPotions } from "@/types"
import { calculateDamage } from "./calculateDamage"

export default function DamageReport() {
    const quantifiers = usePotionQuantifiers()

    const { attacks, total } = calculateDamage(Object.values(quantifiers))

    if (attacks.length === 0) return <div>No possible attacks. Select at least one potion.</div>

    return (
        <div className='m-8'>
            <h2>Resulting Damage</h2>
            <div data-testid='best-attacks'>
                {attacks.map((numberOfPotions: number, index: number) => {
                    const description = explainAttack(numberOfPotions as NumberOfPotions)

                    return <div key={index}>Attack {index + 1}: {description}</div>
                })}

            </div>
            <div>Total: {explainTotal(total)}</div>
        </div>
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
