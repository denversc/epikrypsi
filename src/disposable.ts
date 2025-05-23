export class DisposableStack {
  #state: State = new OpenedState();

  get disposed(): boolean {
    return this.#state.name !== "opened";
  }

  dispose(): void {
    if (this.#state.name === "closed") {
      return;
    } else if (this.#state.name === "disposing") {
      throw new Error("dispose() cannot be called when it is already disposing.");
    }

    const stack = this.#state.stack;
    this.#state = new DisposingState();

    const errors: unknown[] = [];
    while (stack.length > 0) {
      const disposer = stack.pop();
      try {
        doDispose(disposer);
      } catch (error) {
        errors.push(error);
      }
    }

    this.#state = new ClosedState();

    if (errors.length === 1) {
      throw errors[0];
    } else if (errors.length > 1) {
      errors.reverse();
      let suppressedError: SuppressedError = new SuppressedError(errors.shift(), errors.shift());
      while (errors.length > 0) {
        suppressedError = new SuppressedError(suppressedError, errors.shift());
      }
      throw suppressedError;
    }
  }

  use<T extends Disposable | null | undefined>(value: T): T {
    if (this.#state.name !== "opened") {
      throw new Error("use() cannot be called after dispose().");
    }
    this.#state.stack.push(value);
    return value;
  }

  adopt<T>(value: T, onDispose: (value: T) => void): T {
    if (this.#state.name !== "opened") {
      throw new Error("adopt() cannot be called after dispose().");
    }
    this.#state.stack.push(() => {
      onDispose(value);
    });
    return value;
  }

  defer(onDispose: () => void): void {
    if (this.#state.name !== "opened") {
      throw new Error("defer() cannot be called after dispose().");
    }
    this.#state.stack.push(onDispose);
  }

  [Symbol.dispose](): void {
    this.dispose();
  }
}

export class AsyncDisposableStack {
  #state: State = new OpenedState();

  get disposed(): boolean {
    return this.#state.name !== "opened";
  }

  async disposeAsync(): Promise<void> {
    if (this.#state.name === "closed") {
      return;
    } else if (this.#state.name === "disposing") {
      throw new Error("disposeAsync() cannot be called when it is already disposing.");
    }

    const stack = this.#state.stack;
    this.#state = new DisposingState();

    const errors: unknown[] = [];
    while (stack.length > 0) {
      const disposer = stack.pop();
      try {
        await doDispose(disposer);
      } catch (error) {
        errors.push(error);
      }
    }

    this.#state = new ClosedState();

    if (errors.length === 1) {
      throw errors[0];
    } else if (errors.length > 1) {
      errors.reverse();
      let suppressedError: SuppressedError = new SuppressedError(errors.shift(), errors.shift());
      while (errors.length > 0) {
        suppressedError = new SuppressedError(suppressedError, errors.shift());
      }
      throw suppressedError;
    }
  }

  use<T extends AsyncDisposable | Disposable | null | undefined>(value: T): T {
    if (this.#state.name !== "opened") {
      throw new Error("use() cannot be called after dispose().");
    }
    this.#state.stack.push(value);
    return value;
  }

  adopt<T>(value: T, onDisposeAsync: (value: T) => PromiseLike<void> | void): T {
    if (this.#state.name !== "opened") {
      throw new Error("adopt() cannot be called after dispose().");
    }
    this.#state.stack.push(() => onDisposeAsync(value));
    return value;
  }

  defer(onDisposeAsync: () => PromiseLike<void> | void): void {
    if (this.#state.name !== "opened") {
      throw new Error("defer() cannot be called after dispose().");
    }
    this.#state.stack.push(onDisposeAsync);
  }

  [Symbol.asyncDispose](): Promise<void> {
    return this.disposeAsync();
  }
}

function doDispose(disposer: unknown): unknown {
  if (isCallable(disposer)) {
    return disposer();
  } else if (isDisposable(disposer)) {
    disposer[Symbol.dispose]();
    return;
  } else if (isAsyncDisposable(disposer)) {
    return disposer[Symbol.asyncDispose]();
  } else {
    return undefined;
  }
}

function isCallable(value: unknown): value is () => unknown {
  return typeof value === "function";
}

function isDisposable(value: unknown): value is Disposable {
  return (
    typeof value === "object" &&
    value !== null &&
    Symbol.dispose in value &&
    typeof value[Symbol.dispose] === "function"
  );
}

function isAsyncDisposable(value: unknown): value is AsyncDisposable {
  return (
    typeof value === "object" &&
    value !== null &&
    Symbol.asyncDispose in value &&
    typeof value[Symbol.asyncDispose] === "function"
  );
}

class OpenedState {
  readonly name = "opened" as const;
  readonly stack: Array<unknown> = [];
}

class DisposingState {
  readonly name = "disposing" as const;
}

class ClosedState {
  readonly name = "closed" as const;
}

type State = OpenedState | DisposingState | ClosedState;
