<script lang="ts">
	import { i18n } from '$lib/i18n.svelte';
	import type { AnilistSuggestion } from '$lib/types';

	interface Props {
		value?: string;
		selectedId?: number | null;
		name?: string;
		placeholder?: string;
		id?: string;
		class?: string;
		disabled?: boolean;
		onselect?: (suggestion: AnilistSuggestion) => void;
		oninput?: (e: Event) => void;
		onkeydown?: (e: KeyboardEvent) => void;
	}

	let {
		value = $bindable(''),
		selectedId = $bindable(null),
		name,
		placeholder = i18n.t('database.search_placeholder'),
		id,
		class: className = '',
		disabled = false,
		onselect,
		oninput,
		onkeydown
	}: Props = $props();

	let inputWrapperEl: HTMLDivElement | undefined = $state();
	let suggestions = $state<AnilistSuggestion[]>([]);
	let showSuggestions = $state(false);
	let activeSuggestionIndex = $state(-1);
	let debounceTimer: any;

	const effectiveId = $derived.by(() => {
		if (selectedId !== null && !isNaN(selectedId)) {
			return selectedId;
		}
		const parsed = parseInt(String(value ?? '').trim(), 10);
		return !isNaN(parsed) ? parsed : null;
	});

	$effect(() => {
		if (!showSuggestions) return;

		const handleClickOutside = (event: MouseEvent) => {
			if (inputWrapperEl && !inputWrapperEl.contains(event.target as Node)) {
				showSuggestions = false;
				activeSuggestionIndex = -1;
			}
		};

		document.addEventListener('click', handleClickOutside);
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	});

	function handleInputChange(e: Event) {
		const target = e.target as HTMLInputElement;
		const query = target.value;
		value = query;

		if (/^\d+$/.test(query.trim())) {
			selectedId = parseInt(query.trim(), 10);
			suggestions = [];
			showSuggestions = false;
			activeSuggestionIndex = -1;
		} else {
			selectedId = null;
		}

		clearTimeout(debounceTimer);
		if (!query.trim() || /^\d+$/.test(query.trim())) {
			suggestions = [];
			showSuggestions = false;
			activeSuggestionIndex = -1;
			oninput?.(e);
			return;
		}

		debounceTimer = setTimeout(async () => {
			try {
				const res = await fetch(
					`https://api.trace.moe/anilist?q=${encodeURIComponent(query.trim())}`
				);
				if (res.ok) {
					const data = await res.json();
					if (Array.isArray(data)) {
						suggestions = data
							.sort((a: any, b: any) => {
								const aSim = a.similarity || 0;
								const bSim = b.similarity || 0;
								const aHigh = aSim > 0.25;
								const bHigh = bSim > 0.25;

								if (aHigh && bHigh) {
									return bSim - aSim;
								}
								if (aHigh) return -1;
								if (bHigh) return 1;

								const aPop = a.anilist?.popularity || 0;
								const bPop = b.anilist?.popularity || 0;
								return bPop - aPop;
							})
							.map((item: any) => {
								const t = item.anilist?.title || {};

								let userTitle = t.native || t.romaji || '';
								if (i18n.locale === 'zh-hans' || i18n.locale === 'zh-hant') {
									userTitle = t.chinese || t.native || t.romaji;
								} else if (i18n.locale === 'en') {
									userTitle = t.english || t.romaji;
								}

								userTitle =
									userTitle ||
									t.romaji ||
									t.english ||
									t.native ||
									item.title ||
									`ID: ${item.id || item.anilist?.id}`;

								let subtitle = item.title;

								let seasonKey:
									| 'season.spring'
									| 'season.summer'
									| 'season.fall'
									| 'season.winter'
									| undefined;
								const rawSeason = item.anilist?.season?.toUpperCase();
								if (rawSeason === 'SPRING') seasonKey = 'season.spring';
								else if (rawSeason === 'SUMMER') seasonKey = 'season.summer';
								else if (rawSeason === 'FALL') seasonKey = 'season.fall';
								else if (rawSeason === 'WINTER') seasonKey = 'season.winter';

								return {
									id: item.id || item.anilist?.id,
									title: userTitle,
									subtitle,
									coverImage:
										item.anilist?.coverImage?.large ||
										item.anilist?.coverImage?.medium ||
										item.anilist?.coverImage?.small,
									seasonYear: item.anilist?.seasonYear,
									season: seasonKey,
									format: item.anilist?.format
								};
							});
						showSuggestions = suggestions.length > 0;
						activeSuggestionIndex = -1;
					}
				}
			} catch (err) {
				console.error('Autocomplete fetch error:', err);
			}
		}, 300);

		oninput?.(e);
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (showSuggestions && suggestions.length > 0) {
			if (e.key === 'ArrowDown') {
				e.preventDefault();
				activeSuggestionIndex = (activeSuggestionIndex + 1) % suggestions.length;
				return;
			} else if (e.key === 'ArrowUp') {
				e.preventDefault();
				activeSuggestionIndex = (activeSuggestionIndex - 1 + suggestions.length) % suggestions.length;
				return;
			} else if (e.key === 'Enter') {
				if (activeSuggestionIndex >= 0 && activeSuggestionIndex < suggestions.length) {
					e.preventDefault();
					selectSuggestion(suggestions[activeSuggestionIndex]);
					return;
				}
			} else if (e.key === 'Escape') {
				showSuggestions = false;
				activeSuggestionIndex = -1;
				return;
			}
		}
		onkeydown?.(e);
	}

	function selectSuggestion(suggestion: AnilistSuggestion) {
		value = suggestion.title;
		selectedId = suggestion.id;
		showSuggestions = false;
		suggestions = [];
		activeSuggestionIndex = -1;
		onselect?.(suggestion);
	}
</script>

<div class="input-wrapper" bind:this={inputWrapperEl}>
	<input
		{id}
		type="text"
		bind:value
		oninput={handleInputChange}
		onkeydown={handleKeyDown}
		{placeholder}
		class="search-input {className}"
		autocomplete="off"
		{disabled}
	/>

	{#if name}
		<input type="hidden" {name} value={effectiveId ?? ''} disabled={effectiveId === null} />
	{/if}

	{#if showSuggestions && suggestions.length > 0}
		<ul class="suggestions-list" role="listbox">
			{#each suggestions as suggestion, index (suggestion.id)}
				<li
					class="suggestion-item"
					class:active={index === activeSuggestionIndex}
					onclick={() => selectSuggestion(suggestion)}
					onkeydown={(e) => {
						if (e.key === 'Enter' || e.key === ' ') {
							e.preventDefault();
							selectSuggestion(suggestion);
						}
					}}
					role="option"
					aria-selected={index === activeSuggestionIndex}
					tabindex="0"
				>
					<div class="suggestion-main">
						<span class="suggestion-title">{suggestion.title}</span>
						{#if suggestion.subtitle}
							<span class="suggestion-subtitle">{suggestion.subtitle}</span>
						{/if}
						<div class="suggestion-meta">
							{#if suggestion.seasonYear || suggestion.season}
								<span class="suggestion-year">
									{suggestion.seasonYear || ''}
									{#if suggestion.season}
										{i18n.t(suggestion.season)}
									{/if}
								</span>
							{/if}
							{#if suggestion.format}
								<span class="suggestion-format">{suggestion.format}</span>
							{/if}
						</div>
					</div>
					{#if suggestion.coverImage}
						<img src={suggestion.coverImage} alt="" class="suggestion-poster" loading="lazy" />
					{/if}
				</li>
			{/each}
		</ul>
	{/if}
</div>

<style>
	.input-wrapper {
		position: relative;
		width: 100%;
		flex: 1;
	}

	.search-input {
		width: 100%;
		padding: 0.75rem 1rem;
		font-size: 0.95rem;
		border-radius: 0.5rem;
		border: 1px solid var(--fg-medium);
		background: var(--fg-light);
		color: var(--text-primary);
		outline: none;
		transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
		box-sizing: border-box;
	}

	.search-input:hover {
		background: var(--fg-medium);
		border-color: var(--fg-heavy);
	}

	.search-input:focus {
		background: var(--fg-medium);
		border-color: var(--color-primary);
		box-shadow: 0 0 0 3px var(--fg-medium);
	}

	.suggestions-list {
		position: absolute;
		top: calc(100% + 0.35rem);
		left: 0;
		right: 0;
		background: var(--bg-solid);
		border: 1px solid var(--fg-medium);
		border-radius: 0.5rem;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		list-style: none;
		margin: 0;
		padding: 0.25rem 0;
		max-height: 25rem;
		overflow-y: auto;
		z-index: 100;
	}

	.suggestion-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.6rem 1rem;
		cursor: pointer;
		font-size: 0.875rem;
		transition: background 0.2s ease;
		color: var(--text-primary);
		gap: 1rem;
	}

	.suggestion-item:hover,
	.suggestion-item.active {
		background: var(--fg-medium);
	}

	.suggestion-main {
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
		min-width: 0;
		flex: 1;
		text-align: left;
	}

	.suggestion-poster {
		width: 2.25rem;
		height: 3.25rem;
		object-fit: cover;
		border-radius: 0.25rem;
		flex-shrink: 0;
	}

	.suggestion-title {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.suggestion-subtitle {
		font-size: 0.8rem;
		color: var(--text-secondary);
		opacity: 0.85;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.suggestion-meta {
		display: flex;
		align-items: center;
		gap: 0.35rem;
		font-size: 0.75rem;
		color: var(--text-secondary);
		opacity: 0.8;
	}

	.suggestion-year,
	.suggestion-format {
		color: var(--color-primary);
	}
</style>
