import * as React from 'react';
import * as Dialog from '@radix-ui/react-dialog';

export default function TestDialog() {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button>Open Dialog</button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay
          style={{
            backgroundColor: 'rgba(0,0,0,0.5)',
            position: 'fixed',
            inset: 0,
          }}
        />
        <Dialog.Content
          style={{
            backgroundColor: 'white',
            borderRadius: 8,
            padding: 20,
            position: 'fixed',
            top: '30%',
            left: '50%',
            transform: 'translate(-50%, -30%)',
            width: 300,
            boxShadow: '0 10px 15px rgba(0,0,0,0.1)',
          }}
        >
          <input type="file" />
          <Dialog.Close asChild>
            <button style={{ marginTop: 20 }}>Close</button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
