import { renderHook, act } from '@testing-library/react';
import { useSettings } from '@/hooks/useSettings';

describe('useSettings', () => {
    beforeEach(() => {
        // Reset global state between tests
        const { result } = renderHook(() => useSettings());
        act(() => {
            result.current.onClose();
        });
    });

    it('initializes with isOpen false', () => {
        const { result } = renderHook(() => useSettings());
        expect(result.current.isOpen).toBe(false);
    });

    it('onOpen sets isOpen to true', () => {
        const { result } = renderHook(() => useSettings());
        act(() => {
            result.current.onOpen();
        });
        expect(result.current.isOpen).toBe(true);
    });

    it('onClose sets isOpen to false', () => {
        const { result } = renderHook(() => useSettings());

        act(() => {
            result.current.onOpen();
        });
        act(() => {
            result.current.onClose();
        });
        expect(result.current.isOpen).toBe(false);
    });
});
