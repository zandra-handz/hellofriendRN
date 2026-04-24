# Query Keys Reference

Don't maintain a list here — grep the codebase directly. The code is the source of truth.

## Find all usages of a specific key

```
rg "\"userGeckoConfigs\"" -n
```

Catches definitions, `refetchQueries`, `invalidateQueries`, `setQueryData`, `removeQueries`, `cancelQueries`, and commented-out references.

## List every `queryKey` in the repo

```
rg "queryKey:\s*\[" -n
```

## List unique query key names (first string in each array)

```
rg -oN "queryKey:\s*\[\"([^\"]+)\"" -r '$1' | sort -u
```

## Find where a key is mutated vs. read

- Defined / read: search for `queryKey: ["theKey"`
- Refetched: `refetchQueries.*"theKey"`
- Invalidated: `invalidateQueries.*"theKey"`
- Cache-written: `setQueryData.*"theKey"`
- Removed / cancelled: `removeQueries.*"theKey"` or `cancelQueries.*"theKey"`

## In VS Code

Ctrl+Shift+F, toggle regex, search: `queryKey:\s*\["theKey"`
