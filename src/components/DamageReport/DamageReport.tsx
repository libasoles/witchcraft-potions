import { usePotionQuantifiers } from "@/store"

function onlyAvailablePotions(quantifiers: number[]) {
    return quantifiers.filter((quantity) => quantity > 0)
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

const noAttack = {
    attacks: [],
    total: 0
}

const attackWithOnePotion = {
    attacks: [1],
    total: damagePercentByPotionQuantity[1]
}

type Attack = {
    attacks: number[], // rename to damages
    total: number
}

function potionsMinusOne(quantifiers: number[]) {
    const first = quantifiers.shift() as number

    return [first - 1, ...quantifiers]
}

function reduceAllPotionsInOne(quantifiers: number[]) {
    return quantifiers.map(quantity => quantity - 1)
}

function sum(attack1: Attack, attack2: Attack) {
    return {
        attacks: attack1.attacks.concat(attack2.attacks),
        total: attack1.total + attack2.total
    }
}

function max(attack1: Attack, attack2: Attack) {
    return attack1.total > attack2.total ? attack1 : attack2
}

function attackUsingAllPotions(quantifiers: number[]): [Attack, number[]] {
    const attacks = [quantifiers.length]
    const total = damagePercentByPotionQuantity[quantifiers.length as Quantity]

    const attack = {
        attacks,
        total
    }

    return [attack, reduceAllPotionsInOne(quantifiers)]
}

function calculateDamage(quantifiers: number[]): Attack {
    const availablePotions = onlyAvailablePotions(quantifiers)

    if (availablePotions.length === 0) return noAttack

    const [damageUsingAllPotions, remainingPotions] = attackUsingAllPotions(availablePotions)

    if (availablePotions.length === 1)
        return sum(damageUsingAllPotions, calculateDamage(remainingPotions))

    const firstPlusRestCombination = sum(attackWithOnePotion, calculateDamage(potionsMinusOne(availablePotions)))

    const bestStrategy = max(damageUsingAllPotions, firstPlusRestCombination)
    console.log(bestStrategy)
    return sum(bestStrategy, calculateDamage(remainingPotions))
}

export default function DamageReport() {
    const quantifiers = usePotionQuantifiers()

    const { attacks, total } = calculateDamage(Object.values(quantifiers))

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