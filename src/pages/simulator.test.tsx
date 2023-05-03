import { render, screen, waitFor } from '@testing-library/react'
import Simulator from './index'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'

describe('Simulator', () => {
    function renderPage() {
        render(<Simulator />)
    }

    it('renders a page heading', () => {
        renderPage()

        const heading = screen.getByRole('heading', { name: /Simulator/i })

        expect(heading).toBeInTheDocument()
    })

    it('renders five different potions with 0 quantity by default', () => {
        renderPage()

        const quantitySelector = screen.getAllByRole('spinbutton', { name: /Quantity/i })

        expect(quantitySelector).toHaveLength(5)
        quantitySelector.forEach((quantity) => {
            expect(quantity).toHaveValue(0)
        })

        const redPotion = screen.getByRole('img', { name: /Red Potion/i })
        const bluePotion = screen.getByRole('img', { name: /Blue Potion/i })
        const greenPotion = screen.getByRole('img', { name: /Green Potion/i })
        const yellowPotion = screen.getByRole('img', { name: /Yellow Potion/i })
        const grayPotion = screen.getByRole('img', { name: /Gray Potion/i })

        expect(redPotion).toBeInTheDocument()
        expect(bluePotion).toBeInTheDocument()
        expect(greenPotion).toBeInTheDocument()
        expect(yellowPotion).toBeInTheDocument()
        expect(grayPotion).toBeInTheDocument()
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
        const redPotionQuantiry = screen.getAllByRole('spinbutton', { name: /Quantity/i })[0]

        userEvent.type(redPotionQuantiry, '1')

        await waitFor(() => {
            expect(redPotionQuantiry).toHaveValue(1)
        })

        const submitButton = screen.getByRole('button', { name: /Simulate/i })

        expect(submitButton).toBeEnabled()
    })

    it('calculates the resulting damage when the submit button is pressed', async () => {
        renderPage()

        const resultingDamage = screen.queryByRole('heading', { name: /Resulting Damage/i })
        expect(resultingDamage).not.toBeInTheDocument()

        const quantitySelector = screen.getAllByRole('spinbutton', { name: /Quantity/i })[0]

        userEvent.type(quantitySelector, '1')

        await waitFor(() => {
            expect(quantitySelector).toHaveValue(1)
        })

        const submitButton = screen.getByRole('button', { name: /Simulate/i })

        userEvent.click(submitButton)

        const resultingDamage2 = await screen.findByRole('heading', { name: /Resulting Damage/i })
        expect(resultingDamage2).toBeInTheDocument()

        const attack1 = screen.getByText(/Attack 1: using 1 potion deals 3% damage./i)
        expect(attack1).toBeInTheDocument()
    })
})
