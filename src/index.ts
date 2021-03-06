import { createServer, Server, IncomingMessage, ServerResponse } from 'http';
import { parse, UrlWithStringQuery, URL } from 'url';
import { readFile } from 'fs';
import { resolve } from 'path';

import createItem from './createItem';

interface TodoItem {
  text: string;
  completed: boolean;
}

const server: Server = createServer();
let list: Array<TodoItem> = [
  {
    text: 'play games',
    completed: false,
  },
  {
    text: 'learn to cook',
    completed: false,
  }
];

server.on('request', (request: IncomingMessage, response: ServerResponse) => {
  const url: UrlWithStringQuery = parse(request.url);
  switch (url.pathname) {
    case '/':
      readFile('dist/index.html', (err, data) => {
        response.end(data);
      });
      break;
    case '/list':
      response.end(JSON.stringify(list));
      break;
    case '/add':
      const Item: TodoItem | boolean = createItem(`http://${server.address().address}${request.url}`);
      if (Item) {
        list.push(Item);
      }
      response.write(JSON.stringify(list));
      response.end();
      break;
    case '/remove':
      const url = new URL(`http://${server.address().address}${request.url}`);
      const indexToRemove: number = parseInt(url.searchParams.get('index'), 10);
      list = [...list.slice(0, indexToRemove), ...list.slice(indexToRemove+1, list.length)];
      response.write(JSON.stringify(list));
      response.end();
      break;
    default:
      response.end('HAHA NO WAY');
      break;
  }
});

server.listen(3000, 'localhost', () => {
  console.log('server started');
});