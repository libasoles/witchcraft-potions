import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import Simulator from '../pages/index'
import userEvent from '@testing-library/user-event'
import type { Potions } from '@/types';

export const potionMocks: Potions = [
    { id: "yellow", name: "Yellow Potion", image: "x.png" },
    { id: "blue", name: "Blue Potion", image: "x.png" },
];

const firstPotion = 0

describe('Simulator', () => {
    function renderPage() {
        render(<Simulator potions={potionMocks} />)
    }

    it('renders Simulator without crashing when potions are not provided', () => {
        render(<Simulator />)
    })

    it('renders a page heading', () => {
        renderPage()

        const heading = screen.getByRole('heading', { name: "Attack simulator" })

        expect(heading).toBeInTheDocument()
    })

    it('renders five different potions with 0 quantity by default', () => {
        renderPage()

        const quantitySelector = screen.getAllByRole('spinbutton', { name: "Quantity" })

        expect(quantitySelector).toHaveLength(potionMocks.length)
        quantitySelector.forEach((quantity) => {
            expect(quantity).toHaveValue(0)
        })

        // TODO: assert the actual image was rendered
        const yellowPotion = screen.getByRole('img', { name: "Yellow Potion" })
        const bluePotion = screen.getByRole('img', { name: "Blue Potion" })

        expect(yellowPotion).toBeInTheDocument()
        expect(bluePotion).toBeInTheDocument()
    })

    describe('button', () => {
        it('renders a submit button', () => {
            renderPage()

            const submitButton = getSubmitButton()

            expect(submitButton).toBeInTheDocument()
        })

        it('disables the submit button by default because no quantity is selected', () => {
            renderPage()

            const submitButton = getSubmitButton()

            expect(submitButton).toBeDisabled()
        })

        it('enables the submit button when a quantity is selected', async () => {
            renderPage()

            await selectPotionAmount(firstPotion, 1)

            const submitButton = getSubmitButton()

            expect(submitButton).toBeEnabled()
        })

        it('dissapears after is pressed and damage report is displayed', async () => {
            renderPage()

            await selectPotionAmount(firstPotion, 1)

            pressSubmitButton()

            const submitButton = getSubmitButton()

            await waitFor(() => {
                expect(submitButton).not.toBeInTheDocument()
            })
        })
    })

    describe('damage report', () => {
        it('does not render the damage report by default', () => {
            renderPage()

            assertDamageReportIsHidden()
        })

        it('calculates the resulting damage when the submit button is pressed', async () => {
            renderPage()

            assertDamageReportIsHidden()

            await selectPotionAmount(firstPotion, 1)

            pressSubmitButton()

            const resultingDamageHeader = await screen.findByRole('heading', { name: "Resulting Damage" })
            expect(resultingDamageHeader).toBeInTheDocument()

            await assertNumberOfAttacksIs(1)

            const attack1 = screen.getByText("Attack 1: using 1 potion deals 3% damage.")
            expect(attack1).toBeInTheDocument()
            assertTotalDamageIs(3)
        })

        it('keeps updating when potion quantities are changed', async () => {
            renderPage()

            await selectPotionAmount(firstPotion, 1)

            pressSubmitButton()

            await assertNumberOfAttacksIs(1)

            assertTotalDamageIs(3)

            await selectPotionAmount(firstPotion, 2)

            await assertNumberOfAttacksIs(2)

            assertTotalDamageIs(6)
        })
    })
})

function getSubmitButton() {
    return screen.getByRole('button', { name: "Simulate" })
}

function pressSubmitButton() {
    const submitButton = getSubmitButton()

    userEvent.click(submitButton)
}

async function selectPotionAmount(potionIndex: number, amount: number) {
    const potionQuantifier = screen.getAllByRole('spinbutton', { name: "Quantity" })[potionIndex]

    userEvent.clear(potionQuantifier)
    userEvent.type(potionQuantifier, String(amount))

    await waitFor(() => {
        expect(potionQuantifier).toHaveValue(amount)
    })
}

async function assertNumberOfAttacksIs(amount: number) {
    await waitFor(() => {
        const bestAttacks = screen.getByTestId('best-attacks')
        expect(bestAttacks.childElementCount).toBe(amount)
    })
}

async function assertTotalDamageIs(percentage: number) {
    const totalDamage = await screen.findByTestId("total")
    expect(totalDamage).toHaveTextContent(`Total: the warlock has dealt ${percentage}% damage.`)
}

function assertDamageReportIsHidden() {
    const heading = screen.queryByRole('heading', { name: "Resulting Damage" })
    expect(heading).not.toBeInTheDocument()
}