import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import MultiRevertModal from '../MultiRevertModal.svelte';
import { i18n } from '../../../lib/i18n/index.svelte';
import { defaultsStore } from '../../../lib/stores/defaults.svelte';
import { DEFAULT_MODAL_DEFAULTS } from '../../../lib/defaults-shape';

beforeEach(() => { i18n.setLocale('en'); });
afterEach(() => { defaultsStore.current = structuredClone(DEFAULT_MODAL_DEFAULTS); });

describe('MultiRevertModal', () => {
  it('lists each selected commit (short SHA)', () => {
    const { container } = render(MultiRevertModal, {
      commits: ['aaaaaaa1', 'bbbbbbb2'], branch: 'main',
      onClose: vi.fn(), onRevert: vi.fn(),
    });
    const pills = container.querySelectorAll('.modal-pill-text');
    expect(pills.length).toBe(2);
  });

  it('forwards noCommit to onRevert and suppresses pushAfter when noCommit is set', async () => {
    const onRevert = vi.fn();
    const { container } = render(MultiRevertModal, {
      commits: ['aaaaaaa1', 'bbbbbbb2'], branch: 'main',
      onClose: vi.fn(), onRevert,
    });
    const noCommit = container.querySelector<HTMLInputElement>('input[type="checkbox"]')!;
    await fireEvent.click(noCommit);
    await fireEvent.click(container.querySelector<HTMLButtonElement>('button.primary')!);
    expect(onRevert).toHaveBeenCalledWith({ noCommit: true, pushAfter: false });
  });

  it('forwards pushAfter when committing', async () => {
    const onRevert = vi.fn();
    const { container } = render(MultiRevertModal, {
      commits: ['aaaaaaa1', 'bbbbbbb2'], branch: 'main',
      onClose: vi.fn(), onRevert,
    });
    // First checkbox is noCommit (off); when off, the pushAfter checkbox shows.
    const pushAfter = container.querySelectorAll<HTMLInputElement>('input[type="checkbox"]')[1]!;
    await fireEvent.click(pushAfter);
    await fireEvent.click(container.querySelector<HTMLButtonElement>('button.primary')!);
    expect(onRevert).toHaveBeenCalledWith({ noCommit: false, pushAfter: true });
  });
});
