<script lang="ts">
  import { onMount } from 'svelte';
  import Modal from '../common/Modal.svelte';
  import { t } from '../../lib/i18n/index.svelte';
  import { tooltip } from '../../lib/actions/tooltip';
  import { defaultsStore } from '../../lib/stores/defaults.svelte';

  interface Props {
    /** Commits to revert, ordered newest→oldest (the order git reverts them). */
    commits: string[];
    branch: string;
    onClose: () => void;
    onRevert: (options: { noCommit: boolean; pushAfter: boolean }) => void;
  }

  let { commits, branch, onClose, onRevert }: Props = $props();
  let noCommit = $state(defaultsStore.current.revert.noCommit);
  let pushAfter = $state(defaultsStore.current.revert.pushAfter);
  let revertBtn: HTMLButtonElement | undefined = $state();

  onMount(() => { revertBtn?.focus(); });
</script>

<Modal title={t('revertMultiple.title')} {onClose}>
  <p class="modal-desc">{t('revertMultiple.desc', { count: String(commits.length), branch })}</p>

  <div class="rv-commit-list">
    {#each commits as hash (hash)}
      <span use:tooltip={hash} class="modal-pill modal-pill--danger">
        <i class="codicon codicon-git-commit"></i>
        <span class="modal-pill-text">{hash.substring(0, 7)}</span>
      </span>
    {/each}
  </div>

  <div class="modal-form-group">
    <label class="modal-checkbox">
      <input type="checkbox" bind:checked={noCommit} />
      <span>{t('revert.noCommit')}</span>
    </label>
  </div>
  {#if !noCommit}
    <div class="modal-form-group">
      <label class="modal-checkbox">
        <input type="checkbox" bind:checked={pushAfter} />
        <span>{t('revert.pushAfter')}</span>
      </label>
    </div>
  {/if}

  <div class="form-actions">
    <button onclick={onClose}>{t('common.cancel')}</button>
    <button class="primary" bind:this={revertBtn} onclick={() => onRevert({ noCommit, pushAfter: !noCommit && pushAfter })}>{t('revert.revert')}</button>
  </div>
</Modal>

<style>
  .rv-commit-list {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    max-height: 9em;
    overflow-y: auto;
    margin-bottom: 12px;
  }
</style>
