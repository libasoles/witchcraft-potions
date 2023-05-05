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

    beforeEach(jest.clearAllMocks)

    it('renders a potion with the provided name and image', () => {
        renderPotion()

        const name = screen.getByText(/Yellow Potion/i)
        const image = screen.getByRole('img', { name: /Yellow Potion/i })

        expect(name).toBeInTheDocument()
        expect(image).toBeInTheDocument() // TODO: actually assert that the image was rendered
    })

    describe('quantity selector', () => {
        it('renders a quantity selector with 0 amount by default', () => {
            renderPotion()

            const quantitySelector = getNumericInput()

            expect(quantitySelector).toBeInTheDocument()
            expect(quantitySelector).toHaveValue(0)
        })

        it('on change calls onQuantitySelection with the selected quantity', async () => {
            renderPotion()

            write(1)
            await expectToSeeValue(1)

            expect(noAction).toHaveBeenCalledWith(1)
        })

        it('has a button to decrease the quantity', async () => {
            renderPotion()

            const decreaseButton = screen.getByRole('button', { name: /decrease/i })

            write(1)
            await expectToSeeValue(1)

            userEvent.click(decreaseButton)

            await expectToSeeValue(0)
        })

        it('has a button to increase the quantity', async () => {
            renderPotion()

            const increaseButton = screen.getByRole('button', { name: /increase/i })

            await expectToSeeValue(0)

            userEvent.click(increaseButton)

            await expectToSeeValue(1)
        })

        it('does not allow negative quantities', async () => {
            renderPotion()

            write(-1)

            await expectToSeeValue(0)
        })

        it('does not an empty value', async () => {
            renderPotion()

            const quantitySelector = getNumericInput()

            userEvent.clear(quantitySelector)

            await expectToSeeValue(0)
        })

        it('does not allow quantities greater than 100', async () => {
            renderPotion()

            write(101)

            await expectToSeeValue(100)
        })

        it('does not allow non-numeric quantities', async () => {
            renderPotion()

            write('a')

            await expectToSeeValue(0)
        })
    })
})

function getNumericInput() {
    return screen.getByRole('spinbutton', { name: /quantity/i })
}

function write(value: number | string) {
    const quantitySelector = getNumericInput()

    userEvent.type(quantitySelector, String(value))
}

async function expectToSeeValue(value: number) {
    const quantitySelector = getNumericInput()

    await waitFor(() => {
        expect(quantitySelector).toHaveValue(value)
    })
}