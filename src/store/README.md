# Store Structure

This folder contains all Zustand stores and their related types.

## Structure

```
store/
├── types/           # TypeScript type definitions
│   ├── count.ts     # Count store types
│   └── index.ts     # Export all types
├── stores/          # Store implementations
│   ├── count-store.ts  # Count store implementation
│   └── index.ts     # Export all stores
└── index.ts         # Main export file
```

## Usage

### Basic Usage

```tsx
import { useCountStore } from "@/store";

function Counter() {
  const { count, increment, decrement, reset } = useCountStore();

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => increment(1)}>+1</button>
      <button onClick={() => decrement(1)}>-1</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}
```

### Selective Usage (Better Performance)

```tsx
import { useCountStore } from "@/store";

function Counter() {
  const count = useCountStore((state) => state.count);
  const increment = useCountStore((state) => state.increment);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => increment(1)}>+1</button>
    </div>
  );
}
```

## Features

- ✅ TypeScript support
- ✅ Redux DevTools integration
- ✅ Organized folder structure
- ✅ Proper action naming for debugging
- ✅ Easy to extend and maintain
