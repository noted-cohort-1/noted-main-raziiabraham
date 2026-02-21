import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';
import { TransformStream, ReadableStream, WritableStream } from 'stream/web';

Object.assign(global, { TextDecoder, TextEncoder, TransformStream, ReadableStream, WritableStream });


// Mock ResizeObserver for components that measure DOM (like ScrollArea)
if (typeof window !== 'undefined' && !window.ResizeObserver) {
    class ResizeObserver {
        observe() { }
        unobserve() { }
        disconnect() { }
    }
    (window as any).ResizeObserver = ResizeObserver;
}
