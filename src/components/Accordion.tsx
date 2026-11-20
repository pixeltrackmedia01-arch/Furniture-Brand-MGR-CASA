import type { ReactNode } from 'react';

export function Accordion({ title, children, open = false }: { title: ReactNode; children: ReactNode; open?: boolean }) {
  return (
    <details className="acc" open={open}>
      <summary>
        <span>{title}</span>
        <span className="plus" aria-hidden="true" />
      </summary>
      <div className="acc-body">{children}</div>
    </details>
  );
}
