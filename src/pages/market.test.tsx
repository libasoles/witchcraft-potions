import { render, screen, waitFor } from '@testing-library/react'
import Home from './index'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'

describe('Market', () => {
    it('renders a page heading', () => {
        render(<Home />)

        const heading = screen.getByRole('heading', { name: /Market/i })

        expect(heading).toBeInTheDocument()
    })

    it('renders a potion with 0 quantity by default', () => {
        render(<Home />)

        const potion = screen.getByRole('img', { name: /Red Potion/i })
        const quantitySelector = screen.getByRole('spinbutton', { name: /Quantity/i })

        expect(potion).toBeInTheDocument()
        expect(quantitySelector).toBeInTheDocument()
        expect(quantitySelector).toHaveValue(0)
    })

    it('renders a buy button', () => {
        render(<Home />)

        const buyButton = screen.getByRole('button', { name: /Buy/i })

        expect(buyButton).toBeInTheDocument()
    })

    it('disables the buy button by default because no quantity is selected', () => {
        render(<Home />)

        const buyButton = screen.getByRole('button', { name: /Buy/i })

        expect(buyButton).toBeDisabled()
    })

    it('enables the buy button when a quantity is selected', async () => {
        render(<Home />)
        const quantitySelector = screen.getByRole('spinbutton', { name: /Quantity/i })

        userEvent.type(quantitySelector, '1')

        await waitFor(() => {
            expect(quantitySelector).toHaveValue(1)
        })

        const buyButton = screen.getByRole('button', { name: /Buy/i })

        expect(buyButton).toBeEnabled()
    })

    it('calculates the resulting damage when the buy button is pressed', async () => {
        render(<Home />)

        const resultingDamage = screen.queryByRole('heading', { name: /Resulting Damage/i })
        expect(resultingDamage).not.toBeInTheDocument()

        const quantitySelector = screen.getByRole('spinbutton', { name: /Quantity/i })

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
