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
        const total = await screen.findByText(/Total: the warlock has dealt 3% damage./i)

        assertNumberOfAttacksIs(1)
        expect(attack1).toBeInTheDocument()
        expect(total).toBeInTheDocument()
    })

    it('renders three attacks when only one potion is selected three times, and the total damage is 9%', async () => {
        renderPage()

        buyPotion('blue', 3)

        const attack1 = await screen.findByText(/Attack 1: using 1 potion deals 3% damage./i)
        const attack2 = await screen.findByText(/Attack 2: using 1 potion deals 3% damage./i)
        const attack3 = await screen.findByText(/Attack 3: using 1 potion deals 3% damage./i)
        const total = await screen.findByText(/Total: the warlock has dealt 9% damage./i)

        assertNumberOfAttacksIs(3)
        expect(attack1).toBeInTheDocument()
        expect(attack2).toBeInTheDocument()
        expect(attack3).toBeInTheDocument()
        expect(total).toBeInTheDocument()
    })

    it('renders two attacks when two potions are selected and the total damage is 6%', async () => {
        renderPage()

        buyPotion('blue', 1)
        buyPotion('yellow', 1)

        const attack1 = await screen.findByText(/Attack 1: using 1 potion deals 3% damage./i)
        const attack2 = await screen.findByText(/Attack 2: using 1 potion deals 3% damage./i)
        const total = await screen.findByText(/Total: the warlock has dealt 6% damage./i)

        assertNumberOfAttacksIs(2)
        expect(attack1).toBeInTheDocument()
        expect(attack2).toBeInTheDocument()
        expect(total).toBeInTheDocument()
    })

    it('renders two attacks when three potions are selected, one of them twice, and the total damage is 13%', async () => {
        renderPage()

        buyPotion('blue', 1)
        buyPotion('yellow', 2)
        buyPotion('gray', 1)

        const attack1 = await screen.findByText(/Attack 1: using 3 different potions deals 10% damage./i)
        const attack2 = await screen.findByText(/Attack 2: using 1 potion deals 3% damage./i)
        const total = await screen.findByText(/Total: the warlock has dealt 13% damage./i)

        assertNumberOfAttacksIs(2)
        expect(attack1).toBeInTheDocument()
        expect(attack2).toBeInTheDocument()
        expect(total).toBeInTheDocument()
    })


    it('renders xxx', async () => {
        renderPage()

        buyPotion('red', 2)
        buyPotion('blue', 2)
        buyPotion('green', 1)
        buyPotion('yellow', 1)
        buyPotion('gray', 1)

        const attack1 = await screen.findByText(/Attack 1: using 5 different potions deals 25% damage./i)
        const attack2 = await screen.findByText(/Attack 2: using 1 potion deals 3% damage./i)
        const attack3 = await screen.findByText(/Attack 3: using 1 potion deals 3% damage./i)
        const total = await screen.findByText(/Total: the warlock has dealt 31% damage./i)

        assertNumberOfAttacksIs(3)
        expect(attack1).toBeInTheDocument()
        expect(attack2).toBeInTheDocument()
        expect(attack3).toBeInTheDocument()
        expect(total).toBeInTheDocument()
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