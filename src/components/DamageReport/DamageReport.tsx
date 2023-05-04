import { usePotionQuantifiers } from "@/store"
import type { PotionType } from "@/types"

function filterAvailablePotions(quantifiers: Record<PotionType, number>) {
    return Object.values(quantifiers).filter((quantity) => quantity !== 0)
}

const damagePercentByPotionQuantity = {
    1: 3,
    2: 5,
    3: 10,
    4: 20,
    5: 25
}

type Quantity = keyof typeof damagePercentByPotionQuantity

function explainAttack(potionsUsed: keyof typeof damagePercentByPotionQuantity) {
    const potionWording = potionsUsed > 1 ? 'different potions' : 'potion'
    const percentage = damagePercentByPotionQuantity[potionsUsed]

    return `using ${potionsUsed} ${potionWording} deals ${percentage}% damage.`
}

function explainTotal(percentage: number) {
    return `Total: the warlock has dealt ${percentage}% damage.`
}

function calculateDamage(quantifiers: Record<PotionType, number>) {
    const availablePotions = filterAvailablePotions(quantifiers)

    if (availablePotions.length === 0) return {
        attacks: [],
        total: 0
    }

    const attacks = [availablePotions.length]
    const total = damagePercentByPotionQuantity[availablePotions.length as Quantity]

    return {
        attacks,
        total
    }
}

export default function DamageReport() {
    const quantifiers = usePotionQuantifiers()

    const { attacks, total } = calculateDamage(quantifiers)

    if (attacks.length === 0) return <div>No possible attacks.</div>

    const totalDescription = explainTotal(total)

    return (
        <div className='m-8'>
            <h2>Resulting Damage</h2>
            <div data-testid='best-attacks'>
                {attacks.map((numberOfPotions: number, index: number) => {
                    const description = explainAttack(numberOfPotions as Quantity)

                    return <div key={index}>Attack {index + 1}: {description}</div>
                })}

            </div>
            <div>{totalDescription}</div>
        </div>
    )
}