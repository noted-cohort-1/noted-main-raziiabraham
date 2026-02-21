import { renderHook, act } from '@testing-library/react';
import { useSearch } from '@/hooks/use-search';

describe('useSearch', () => {
    beforeEach(() => {
        // We need to reset the Zustand store state between tests because it's global
        const { result } = renderHook(() => useSearch());
        act(() => {
            result.current.onClose();
        });
    });

    it('initializes with isOpen false', () => {
        const { result } = renderHook(() => useSearch());
        expect(result.current.isOpen).toBe(false);
    });

    it('onOpen sets isOpen to true', () => {
        const { result } = renderHook(() => useSearch());
        act(() => {
            result.current.onOpen();
        });
        expect(result.current.isOpen).toBe(true);
    });

    it('onClose sets isOpen to false', () => {
        const { result } = renderHook(() => useSearch());

        act(() => {
            result.current.onOpen();
        });
        expect(result.current.isOpen).toBe(true);

        act(() => {
            result.current.onClose();
        });
        expect(result.current.isOpen).toBe(false);
    });

    it('toggle flips the isOpen state', () => {
        const { result } = renderHook(() => useSearch());

        expect(result.current.isOpen).toBe(false);

        act(() => {
            result.current.toggle();
        });
        expect(result.current.isOpen).toBe(true);

        act(() => {
            result.current.toggle();
        });
        expect(result.current.isOpen).toBe(false);
    });
});
