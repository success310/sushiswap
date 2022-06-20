import { Dialog, Overlay, SlideIn } from '@sushiswap/ui'
import { FC, ReactElement, useState } from 'react'

interface RenderProps {
  open: boolean
  setOpen(open: boolean): void
}

interface ConfirmationComponentController {
  variant: 'overlay' | 'dialog'
  trigger(payload: RenderProps): ReactElement
  children: ReactElement | ReactElement[] | ((payload: RenderProps) => ReactElement)
}

export const ConfirmationComponentController: FC<ConfirmationComponentController> = ({
  variant,
  trigger,
  children,
}) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      {trigger({ setOpen, open })}
      {variant === 'overlay' ? (
        <SlideIn.FromBottom show={open} unmount={false} onClose={() => setOpen(false)}>
          <Overlay.Content className="flex flex-col flex-grow !bg-slate-800">
            <Overlay.Header arrowDirection="bottom" onClose={() => setOpen(false)} title="Confirm Swap" />
            {typeof children === 'function' ? children({ setOpen, open }) : children}
          </Overlay.Content>
        </SlideIn.FromBottom>
      ) : (
        <Dialog open={open} unmount={false} onClose={() => setOpen(false)}>
          <Dialog.Content>
            <Dialog.Header title="Confirm Swap" onClose={() => setOpen(false)} />
            {typeof children === 'function' ? children({ setOpen, open }) : children}
          </Dialog.Content>
        </Dialog>
      )}
    </>
  )
}
