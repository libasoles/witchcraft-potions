import '@testing-library/jest-dom'
import { render, renderHook, screen } from '@testing-library/react'
import { usePotionQuantifier } from '@/store';
import DamageReport from './index';
import { PotionType } from '@/types';

describe('Damage Report', () => {
    function renderPage() {
        render(<DamageReport />)
    }

    it('renders a message when there is no possible attacks', () => {
        renderPage()

        const message = screen.getByText(/No possible attacks./i)

        expect(message).toBeInTheDocument()
    })

    it('renders a section heading when there are available results', async () => {
        renderPage()
        buyPotion('blue', 1)

        const heading = await screen.findByRole('heading', { name: /Resulting Damage/i })

        expect(heading).toBeInTheDocument()
    })

    it('calculates a single attack when only one potion is selected and the damage is 3%', async () => {
        renderPage()

        buyPotion('blue', 3)

        const attack1 = await screen.findByText(/Attack 1: using 1 potion deals 3% damage./i)

        expect(attack1).toBeInTheDocument()
        assertNumberOfAttacksIs(1)
    })

    it('calculates two attacks when two different potions are selected and the damage is 5%', async () => {
        renderPage()

        buyPotion('blue', 1)
        buyPotion('red', 1)

        const attack1 = await screen.findByText(/Attack 1: using 1 potion deals 3% damage./i)
        const attack2 = await screen.findByText(/Attack 2: using 2 different potions deals 5% damage./i)

        expect(attack1).toBeInTheDocument()
        expect(attack2).toBeInTheDocument()
        assertNumberOfAttacksIs(2)
    })
})

function buyPotion(potionType: PotionType, amount: number) {
    const { result } = renderHook(() => usePotionQuantifier(potionType))
    const [, buyBluePotion] = result.current

    buyBluePotion(amount)
}

function assertNumberOfAttacksIs(amount: number) {
    const bestAttacks = screen.getByTestId('best-attacks')
    expect(bestAttacks.childElementCount).toBe(amount)
}