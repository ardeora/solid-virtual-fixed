import { Component, createSignal, For, Show, createEffect } from 'solid-js';

import { createVirtualizer } from '@tanstack/solid-virtual';

const App: Component = () => {
  return (
    <div>
      <p>
        These components are using <strong>fixed</strong> sizes. This means that
        every element's dimensions are hard-coded to the same value and never
        change.
      </p>
      <br />
      <br />

      <h3>Rows</h3>
      <RowVirtualizerFixed />
      <br />
      <br />
      <h3>Columns</h3>
      <ColumnVirtualizerFixed />
      <br />
      <br />
      <h3>Grid</h3>
      <GridVirtualizerFixed />
      <br />
      <br />
    </div>
  );
};

const RowVirtualizerFixed: Component = () => {
  let scrollParentRef: HTMLDivElement | undefined;

  const rowVirtualizer = createVirtualizer({
    count: 10000,
    getScrollElement: () => scrollParentRef,
    estimateSize: () => 35,
    overscan: 5,
  });

  return (
    <>
      <div
        ref={scrollParentRef}
        class="List"
        style={{
          height: `200px`,
          width: `400px`,
          overflow: 'auto',
        }}
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          <For each={rowVirtualizer.getVirtualItems()}>
            {(virtualItem) => {
              return (
                <div
                  class={virtualItem.index % 2 ? 'ListItemOdd' : 'ListItemEven'}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: `${virtualItem.size}px`,
                    transform: `translateY(${virtualItem.start}px)`,
                  }}
                >
                  Row {virtualItem.index + 1}
                </div>
              );
            }}
          </For>
        </div>
      </div>
    </>
  );
};

const ColumnVirtualizerFixed: Component = () => {
  let scrollParentRef: HTMLDivElement | undefined;

  const columnVirtualizer = createVirtualizer({
    horizontal: true,
    count: 10000,
    getScrollElement: () => scrollParentRef,
    estimateSize: () => 100,
    overscan: 5,
  });

  return (
    <>
      <div
        ref={scrollParentRef}
        class="List"
        style={{
          height: `100px`,
          width: `400px`,
          overflow: 'auto',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${columnVirtualizer.getTotalSize()}px`,
            position: 'relative',
          }}
        >
          <For each={columnVirtualizer.getVirtualItems()}>
            {(virtualItem) => {
              return (
                <div
                  class={virtualItem.index % 2 ? 'ListItemOdd' : 'ListItemEven'}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    height: '100%',
                    width: `${virtualItem.size}px`,
                    transform: `translateX(${virtualItem.start}px)`,
                  }}
                >
                  Column {virtualItem.index + 1}
                </div>
              );
            }}
          </For>
        </div>
      </div>
    </>
  );
};

const GridVirtualizerFixed: Component = () => {
  let [scrollParentRef, setScrollParentRef] = createSignal<
    HTMLDivElement | undefined
  >();
  const [show, setShow] = createSignal(true);
  const rows = 10000;
  const rowVirtualizer = createVirtualizer({
    count: rows,
    getScrollElement: () => scrollParentRef(),
    estimateSize: () => 35,
    overscan: 5,
  });

  const columnVirtualizer = createVirtualizer({
    horizontal: true,
    count: 10000,
    getScrollElement: () => scrollParentRef(),
    estimateSize: () => 100,
    overscan: 5,
  });

  const halfWay = Math.floor(rows / 2);

  return (
    <>
      <div class="py-2 flex gap-2">
        <button onClick={() => setShow((s) => !s)}>Toggle Display</button>
        <button
          onClick={() => {
            rowVirtualizer.scrollToIndex(halfWay);
          }}
        >
          Scroll to index {halfWay}
        </button>
        <button onClick={() => rowVirtualizer.scrollToIndex(rows - 1)}>
          Scroll to index {rows - 1}
        </button>
      </div>
      <Show when={show()}>
        <div
          ref={setScrollParentRef}
          class="List"
          style={{
            height: `500px`,
            width: `500px`,
            overflow: 'auto',
          }}
        >
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: `${columnVirtualizer.getTotalSize()}px`,
              position: 'relative',
            }}
          >
            <For each={rowVirtualizer.getVirtualItems()}>
              {(virtualRow) => (
                <For each={columnVirtualizer.getVirtualItems()}>
                  {(virtualColumn) => (
                    <div
                      class={
                        virtualColumn.index % 2
                          ? virtualRow.index % 2 === 0
                            ? 'ListItemOdd'
                            : 'ListItemEven'
                          : virtualRow.index % 2
                          ? 'ListItemOdd'
                          : 'ListItemEven'
                      }
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: `${virtualColumn.size}px`,
                        height: `${virtualRow.size}px`,
                        transform: `translateX(${virtualColumn.start}px) translateY(${virtualRow.start}px)`,
                      }}
                    >
                      Cell {virtualRow.index}, {virtualColumn.index}
                    </div>
                  )}
                </For>
              )}
            </For>
          </div>
        </div>
      </Show>
    </>
  );
};

export default App;
