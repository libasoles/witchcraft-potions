import '@testing-library/jest-dom'
import { act, render, renderHook, screen, waitFor } from '@testing-library/react'
import { usePotionQuantifier } from '@/store';
import DamageReport from './index';
import type { PotionType } from '@/types';

describe('Damage Report', () => {
    function renderPage() {
        render(<DamageReport />)
    }

    it('renders a message when there is no possible attacks', () => {
        renderPage()

        const message = screen.getByText(/No possible attacks. Select at least one potion./i)

        expect(message).toBeInTheDocument()
    })

    it('renders a section heading when there are available results', async () => {
        renderPage()

        buyPotion('blue', 1)

        const heading = await screen.findByRole('heading', { name: /Resulting Damage/i })

        expect(heading).toBeInTheDocument()
    })

    it('renders a single attack when only one potion is selected, and the total damage is 3%', async () => {
        renderPage()

        buyPotion('blue', 1)

        const attack1 = await screen.findByText(/Attack 1: using 1 potion deals 3% damage./i)

        assertNumberOfAttacksIs(1)
        expect(attack1).toBeInTheDocument()
        assertTotalDamageWas(3)
    })

    it('renders two attacks when two potions are selected and the total damage is 6%', async () => {
        renderPage()

        buyPotion('blue', 1)
        buyPotion('yellow', 1)

        const attack1 = await screen.findByText(/Attack 1: using 1 potion deals 3% damage./i)
        const attack2 = await screen.findByText(/Attack 2: using 1 potion deals 3% damage./i)

        assertNumberOfAttacksIs(2)
        expect(attack1).toBeInTheDocument()
        expect(attack2).toBeInTheDocument()
        assertTotalDamageWas(6)
    })

    // TODO: this one will be probably flakey
    it('renders the more expensive calculation in less than 200ms', async () => {
        renderPage()

        buyPotion('red', 100)
        buyPotion('blue', 100)
        buyPotion('green', 100)
        buyPotion('yellow', 100)
        buyPotion('gray', 100)

        assertTotalDamageWas(2500)
    }, 200)
})

function buyPotion(potionType: PotionType, amount: number) {
    const { result } = renderHook(() => usePotionQuantifier(potionType))
    const [, buyBluePotion] = result.current

    act(() => {
        buyBluePotion(amount);
    });
}

function assertNumberOfAttacksIs(amount: number) {
    const bestAttacks = screen.getByTestId('best-attacks')
    expect(bestAttacks.childElementCount).toBe(amount)
}

function assertTotalDamageWas(percentage: number) {
    const total = screen.getByText(`Total: the warlock has dealt ${percentage}% damage.`)
    expect(total).toBeInTheDocument()
}
