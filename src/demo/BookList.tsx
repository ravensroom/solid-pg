import { For } from 'solid-js';
import { Book } from './BookShelf';

export function BookList(props: { books: Book[] }) {
  const totalBooks = () => props.books.length;
  return (
    <>
      <h2>My books ({totalBooks()})</h2>
      <ul>
        <For each={props.books}>
          {(book, i) => {
            return (
              <li>
                {i() + 1}.&nbsp;
                {book.title}
                <span style={{ 'font-style': 'italic' }}> ({book.author})</span>
              </li>
            );
          }}
        </For>
      </ul>
    </>
  );
}
