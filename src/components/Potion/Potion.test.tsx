import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import PotionQuantifier from './index'
import type { Potion } from '@/types'

const noAction = jest.fn()

export const potionMock: Potion = { id: 'yellow', name: "Yellow Potion", image: "x.png" };

describe('Potion', () => {
    function renderPotion() {
        render(<PotionQuantifier potion={potionMock} onQuantitySelection={noAction} />)
    }

    it('renders a potion with the provided name and image', () => {
        renderPotion()

        const name = screen.getByText(/Yellow Potion/i)
        const image = screen.getByRole('img', { name: /Yellow Potion/i })

        expect(name).toBeInTheDocument()
        expect(image).toBeInTheDocument() // TODO: actually assert that the image was rendered
    })

    it('renders a quantity selector with 0 amount by default', () => {
        renderPotion()

        const quantitySelector = screen.getByRole('spinbutton', { name: /Quantity/i })

        expect(quantitySelector).toBeInTheDocument()
        expect(quantitySelector).toHaveValue(0)
    })

    it('calls onQuantitySelection with the selected quantity', async () => {
        const onQuantitySelection = jest.fn()
        render(<PotionQuantifier potion={potionMock} onQuantitySelection={onQuantitySelection} />)

        const quantitySelector = screen.getByRole('spinbutton', { name: /Quantity/i })

        userEvent.type(quantitySelector, '1')

        await waitFor(() => {
            expect(quantitySelector).toHaveValue(1)
        })

        expect(onQuantitySelection).toHaveBeenCalledWith(1)
    })

    it('does not allow negative quantities', async () => {
        renderPotion()

        const quantitySelector = screen.getByRole('spinbutton', { name: /Quantity/i })

        userEvent.type(quantitySelector, '-1')

        await waitFor(() => {
            expect(quantitySelector).toHaveValue(0)
        })

        userEvent.clear(quantitySelector)

        await waitFor(() => {
            expect(quantitySelector).toHaveValue(0)
        })
    })

    it('does not allow non-numeric quantities', async () => {
        renderPotion()

        const quantitySelector = screen.getByRole('spinbutton', { name: /Quantity/i })

        userEvent.type(quantitySelector, 'a')

        await waitFor(() => {
            expect(quantitySelector).toHaveValue(0)
        })

        userEvent.clear(quantitySelector)

        await waitFor(() => {
            expect(quantitySelector).toHaveValue(0)
        })
    })
})
