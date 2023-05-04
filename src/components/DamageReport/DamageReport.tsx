import { usePotionQuantifiers } from "@/store"
import type { PotionType } from "@/types"

function calculateDamage(quantifiers: Record<PotionType, number>) {
    const availablePotions = Object.values(quantifiers).filter((quantity) => quantity !== 0)

    if (availablePotions.length === 0) return []


    if (availablePotions.length === 1) return ["using 1 potion deals 3% damage."]

    return [
        "using 1 potion deals 3% damage.",
        "using 2 different potions deals 5% damage."
    ]
}

export default function DamageReport() {
    const quantifiers = usePotionQuantifiers()

    const report = calculateDamage(quantifiers)

    if (report.length === 0) return <div>No possible attacks.</div>

    return (
        <div className='m-8'>
            <h2>Resulting Damage</h2>
            <div data-testid='best-attacks'>
                {report.map((attack, index) => <div key={attack}>Attack {index + 1}: {attack}</div>)}
            </div>
        </div>
    )
}