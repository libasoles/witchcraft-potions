import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import Potion from './index'

const noAction = jest.fn()

describe('Potion', () => {
    it('renders a potion', () => {
        render(<Potion onQuantitySelection={noAction} />)
        const potion = screen.getByRole('img', { name: /Red Potion/i })
        expect(potion).toBeInTheDocument()
    })

    it('renders a quantity selector with 0 amount by default', () => {
        render(<Potion onQuantitySelection={noAction} />)
        const quantitySelector = screen.getByRole('spinbutton', { name: /Quantity/i })
        expect(quantitySelector).toBeInTheDocument()
        expect(quantitySelector).toHaveValue(0)
    })

    it('calls onQuantitySelection with the selected quantity', async () => {
        const onQuantitySelection = jest.fn()
        render(<Potion onQuantitySelection={onQuantitySelection} />)

        const quantitySelector = screen.getByRole('spinbutton', { name: /Quantity/i })

        userEvent.type(quantitySelector, '1')

        await waitFor(() => {
            expect(quantitySelector).toHaveValue(1)
        })

        expect(onQuantitySelection).toHaveBeenCalledWith(1)
    })
})
