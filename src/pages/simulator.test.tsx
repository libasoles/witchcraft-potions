import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import Simulator from './index'
import userEvent from '@testing-library/user-event'
import { Potions } from '@/types';

export const potionMocks: Potions = [
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

        const firstPotion = 0
        await selectPotionAmount(firstPotion, 1)

        const submitButton = screen.getByRole('button', { name: /Simulate/i })

        expect(submitButton).toBeEnabled()
    })

    it('calculates the resulting damage when the submit button is pressed', async () => {
        renderPage()

        const heading = screen.queryByRole('heading', { name: /Resulting Damage/i })
        expect(heading).not.toBeInTheDocument()

        const firstPotion = 0
        await selectPotionAmount(firstPotion, 1)

        pressSimulateButton()

        const resultingDamageHeader = await screen.findByRole('heading', { name: /Resulting Damage/i })
        expect(resultingDamageHeader).toBeInTheDocument()

        assertNumberOfAttacksIs(1)

        const attack1 = screen.getByText(/Attack 1: using 1 potion deals 3% damage./i)
        expect(attack1).toBeInTheDocument()
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
