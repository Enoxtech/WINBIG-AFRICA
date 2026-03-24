'use client';
import { Component, ReactNode } from 'react';

interface Props { children: ReactNode; fallback?: ReactNode; }
interface State { hasError: boolean; message?: string; }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };
  static getDerivedStateFromError(e: Error) {
    return { hasError: true, message: e.message };
  }
  componentDidCatch(e: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary]', e.message, info.componentStack);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', background: '#fee', border: '2px solid red', borderRadius: '8px', margin: '1rem' }}>
          <h2 style={{ color: '#c00' }}>⚠️ Section Error</h2>
          <p style={{ fontSize: '0.8rem', wordBreak: 'break-all' }}>{this.state.message}</p>
        </div>
      );
    }
    return this.props.children;
  }
}
