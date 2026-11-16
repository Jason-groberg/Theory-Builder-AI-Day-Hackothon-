import { useSyncExternalStore } from 'react'

function subscribe(onChange: () => void) {
  window.addEventListener('hashchange', onChange)
  return () => window.removeEventListener('hashchange', onChange)
}

/** Current route from the URL hash, e.g. "#/p/prob-1" gives "p/prob-1". */
export function useHashRoute(): string {
  return useSyncExternalStore(subscribe, () => window.location.hash.replace(/^#\/?/, ''))
}

export const problemHref = (id: string) => `#/p/${id}`
