import { createRoot } from 'react-dom/client';
import { Component, type ReactNode } from 'react';
import SystemScene from './SystemScene';

class SceneBoundary extends Component<{ children: ReactNode; onError: (error: Error) => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error: Error) { this.props.onError(error); }
  render() { return this.state.failed ? null : this.props.children; }
}

// Dynamically started after the static hero is readable. The page never waits for WebGL.
export function mountScene(container: HTMLElement, signal?: AbortSignal, onRuntimeError?: () => void): Promise<() => void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) { reject(new DOMException('Scene initialization cancelled.', 'AbortError')); return; }
    const root = createRoot(container);
    let settled = false;
    let unmounted = false;
    const dispose = () => {
      if (unmounted) return;
      unmounted = true;
      signal?.removeEventListener('abort', abort);
      root.unmount();
    };
    let timeout: number | undefined;
    const activity = (active: boolean) => {
      if (settled) return;
      window.clearTimeout(timeout);
      timeout = active ? window.setTimeout(() => fail(new Error('WebGL initialization timed out.')), 15000) : undefined;
    };
    const fail = (error: Error) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeout);
      // Avoid unmounting synchronously inside React error handling.
      queueMicrotask(dispose);
      reject(error);
    };
    const abort = () => {
      if (!settled) fail(new DOMException('Scene initialization cancelled.', 'AbortError'));
      else dispose();
    };
    signal?.addEventListener('abort', abort, { once: true });
    activity(!document.hidden);
    const contextLost = () => {
      if (!settled) fail(new Error('WebGL context was lost during initialization.'));
      else { queueMicrotask(dispose); onRuntimeError?.(); }
    };
    root.render(<SceneBoundary onError={fail}><SystemScene onActiveChange={activity} onContextLost={contextLost} onReady={() => {
      if (settled || signal?.aborted) return;
      settled = true;
      window.clearTimeout(timeout);
      resolve(dispose);
    }} /></SceneBoundary>);
  });
}
