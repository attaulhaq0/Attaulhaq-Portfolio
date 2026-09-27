import { createRoot } from 'react-dom/client';
import { Component, type ReactNode } from 'react';
import SystemScene from './SystemScene';

class SceneBoundary extends Component<{ children: ReactNode; onError: (error: Error) => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error: Error) { this.props.onError(error); }
  render() { return this.state.failed ? null : this.props.children; }
}

// Loaded only after an explicit user request. No React or Three on initial page load.
export function mountScene(container: HTMLElement): Promise<() => void> {
  return new Promise((resolve, reject) => {
    const root = createRoot(container);
    let settled = false;
    const timeout = window.setTimeout(() => fail(new Error('WebGL initialization timed out.')), 15000);
    const fail = (error: Error) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeout);
      // Avoid unmounting synchronously inside React error handling.
      queueMicrotask(() => root.unmount());
      reject(error);
    };
    root.render(<SceneBoundary onError={fail}><SystemScene onReady={() => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeout);
      resolve(() => root.unmount());
    }} /></SceneBoundary>);
  });
}
