/// <reference types="vite/client" />
import 'react';

declare module 'react' {
  interface HTMLAttributes<T> {
    // React 18 does not type `inert` yet; pass '' to set it.
    inert?: '' | undefined;
  }
}
