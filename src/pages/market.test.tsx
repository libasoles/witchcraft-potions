import { render, screen, waitFor } from '@testing-library/react'
import Home from './index'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'

describe('Market', () => {
    function renderPage() {
        render(<Home />)
    }

    it('renders a page heading', () => {
        renderPage()

        const heading = screen.getByRole('heading', { name: /Market/i })

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

    it('renders a buy button', () => {
        renderPage()

        const buyButton = screen.getByRole('button', { name: /Buy/i })

        expect(buyButton).toBeInTheDocument()
    })

    it('disables the buy button by default because no quantity is selected', () => {
        renderPage()

        const buyButton = screen.getByRole('button', { name: /Buy/i })

        expect(buyButton).toBeDisabled()
    })

    it('enables the buy button when a quantity is selected', async () => {
        renderPage()
        const redPotionQuantiry = screen.getAllByRole('spinbutton', { name: /Quantity/i })[0]

        userEvent.type(redPotionQuantiry, '1')

        await waitFor(() => {
            expect(redPotionQuantiry).toHaveValue(1)
        })

        const buyButton = screen.getByRole('button', { name: /Buy/i })

        expect(buyButton).toBeEnabled()
    })

    it('calculates the resulting damage when the buy button is pressed', async () => {
        renderPage()

        const resultingDamage = screen.queryByRole('heading', { name: /Resulting Damage/i })
        expect(resultingDamage).not.toBeInTheDocument()

        const quantitySelector = screen.getAllByRole('spinbutton', { name: /Quantity/i })[0]

        userEvent.type(quantitySelector, '1')

        await waitFor(() => {
            expect(quantitySelector).toHaveValue(1)
        })

        const buyButton = screen.getByRole('button', { name: /Buy/i })

        userEvent.click(buyButton)

        const resultingDamage2 = await screen.findByRole('heading', { name: /Resulting Damage/i })
        expect(resultingDamage2).toBeInTheDocument()

        const attack1 = screen.getByText(/Attack 1: using 1 potion deals 3% damage./i)
        expect(attack1).toBeInTheDocument()
    })
})
