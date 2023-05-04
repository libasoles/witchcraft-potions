import { render, screen, waitFor } from '@testing-library/react'
import Simulator from './index'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import { Potion } from '@/types';

export const potionMocks: Potion[] = [
    { id: "yellow", name: "Yellow Potion", image: "x.png" },
    { id: "blue", name: "Blue Potion", image: "x.png" },
];

describe('Simulator', () => {
    function renderPage() {
        render(<Simulator potions={potionMocks} />)
    }

    it('renders a page heading', () => {
        renderPage()

        const heading = screen.getByRole('heading', { name: /Simulator/i })

        expect(heading).toBeInTheDocument()
    })

    it('renders five different potions with 0 quantity by default', () => {
        renderPage()

        const quantitySelector = screen.getAllByRole('spinbutton', { name: /Quantity/i })

        expect(quantitySelector).toHaveLength(potionMocks.length)
        quantitySelector.forEach((quantity) => {
            expect(quantity).toHaveValue(0)
        })

        const yellowPotion = screen.getByRole('img', { name: /Yellow Potion/i })
        const bluePotion = screen.getByRole('img', { name: /Blue Potion/i })

        expect(yellowPotion).toBeInTheDocument()
        expect(bluePotion).toBeInTheDocument()
    })

    it('renders a submit button', () => {
        renderPage()

        const submitButton = screen.getByRole('button', { name: /Simulate/i })

        expect(submitButton).toBeInTheDocument()
    })

    it('disables the submit button by default because no quantity is selected', () => {
        renderPage()

        const submitButton = screen.getByRole('button', { name: /Simulate/i })

        expect(submitButton).toBeDisabled()
    })

    it('enables the submit button when a quantity is selected', async () => {
        renderPage()

        await selectPotionAmount(0, 1)

        const submitButton = screen.getByRole('button', { name: /Simulate/i })

        expect(submitButton).toBeEnabled()
    })

    it('calculates the resulting damage when the submit button is pressed', async () => {
        renderPage()

        const resultingDamage = screen.queryByRole('heading', { name: /Resulting Damage/i })
        expect(resultingDamage).not.toBeInTheDocument()

        await selectPotionAmount(0, 1)

        pressSimulateButton()

        // TODO: rename this variable
        const resultingDamage2 = await screen.findByRole('heading', { name: /Resulting Damage/i })
        expect(resultingDamage2).toBeInTheDocument()

        assertNumberOfAttacksIs(1)

        const attack1 = screen.getByText(/Attack 1: using 1 potion deals 3% damage./i)
        expect(attack1).toBeInTheDocument()
    })

    it('calculates the resulting damage when two different potions are combined', async () => {
        renderPage()

        await selectPotionAmount(0, 1) // TODO: name these numbers
        await selectPotionAmount(1, 1)

        pressSimulateButton()

        const resultingDamage2 = await screen.findByRole('heading', { name: /Resulting Damage/i })
        expect(resultingDamage2).toBeInTheDocument()

        assertNumberOfAttacksIs(2)

        const attack1 = screen.getByText(/Attack 1: using 1 potion deals 3% damage./i)
        expect(attack1).toBeInTheDocument()

        const attack2 = screen.getByText(/Attack 2: using 2 different potions deals 5% damage./i)
        expect(attack2).toBeInTheDocument()
    })
})

function pressSimulateButton() {
    const submitButton = screen.getByRole('button', { name: /Simulate/i })

    userEvent.click(submitButton)
}

// TODO: identify potion by enum?
async function selectPotionAmount(potion: number, amount: number) {
    const potionQuantifier = screen.getAllByRole('spinbutton', { name: /Quantity/i })[potion]

    userEvent.type(potionQuantifier, String(amount))

    await waitFor(() => {
        expect(potionQuantifier).toHaveValue(amount)
    })
}

function assertNumberOfAttacksIs(amount: number) {
    const bestAttacks = screen.getByTestId('best-attacks')
    expect(bestAttacks.childElementCount).toBe(amount)
}
