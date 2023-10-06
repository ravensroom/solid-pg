import { For, Show, createEffect, createResource, createSignal } from 'solid-js';
import { getData } from './api/getData';

type Record = {
  name: string;
  phone: string;
  address: string;
};

type Cache = Map<string, Record[]>;

export default function Filter() {
  const [input, setInput] = createSignal('');
  const [searchTerm, setSearchTerm] = createSignal<string>();
  const [searchResult] = createResource<Record[], string>(searchTerm, getData);
  const [records, setRecords] = createSignal<Record[]>([]);
  const [cache, setCache] = createSignal<Cache>(new Map());
  const [showLoading, setShowLoading] = createSignal(false);

  const debounce = (func: () => void, delay: number = 600) => {
    let timer: ReturnType<typeof setTimeout>;
    return () => {
      clearTimeout(timer);
      timer = setTimeout(func, delay);
    };
  };

  const handleInput = function (
    e: InputEvent & {
      currentTarget: HTMLInputElement;
      target: HTMLInputElement;
    }
  ) {
    setInput(() => {
      const value = e.currentTarget.value;
      debounce(() => {
        console.log('debounce');
        if (cache().has(value)) setRecords(cache().get(value)!);
        else setSearchTerm(value);
      })();
      return value;
    });
  };

  createEffect(() => {
    if (searchResult() && searchResult.state === 'ready') {
      setCache((prevCache) => {
        const newCache = new Map(prevCache);
        newCache.set(searchTerm()!, searchResult()!);
        if (newCache.size > 3) {
          const oldestKey = newCache.keys().next().value;
          newCache.delete(oldestKey);
        }
        setRecords(searchResult()!);
        return newCache;
      });

      setTimeout(() => {
        setCache((prevCache) => {
          const newCache = new Map(prevCache);
          const oldestKey = newCache.keys().next().value;
          newCache.delete(oldestKey);
          return newCache;
        });
      }, 5000);
    }
  });

  createEffect(() => {
    if (searchResult.loading) {
      setTimeout(() => {
        if (searchResult.loading) setShowLoading(true);
      }, 500);
    } else {
      setShowLoading(false);
    }
  });

  createEffect(() => {
    console.log(input());
    console.log(cache());
  });

  return (
    <>
      <input value={input()} onInput={handleInput} />
      <Show when={!showLoading()} fallback={<>Loading...</>}>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Address</th>
            </tr>
          </thead>
          <tbody>
            <For each={records()}>
              {(record) => (
                <tr>
                  <td>{record.name}</td>
                  <td>{record.phone}</td>
                  <td>{record.address}</td>
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </Show>
    </>
  );
}
