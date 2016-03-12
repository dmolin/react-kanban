# React Kanban
A work-in-progress Kanban board (think Trello), written in React+Flux while experimenting with the new technology stack.

[![React-Kanban](/assets/react-kanban.png?raw=true)](http://dmolin.github.io/react-kanban/)

The App is simple by design. At the current moment there's no DB (The whole board uses localStorage).

## Can I play with it?
Sure. The current iteration is live at [http://dmolin.github.io/react-kanban/](http://dmolin.github.io/react-kanban/)

## Technology Stack
- React
- Flux implementation (Alt)
- Webpack

## In the queue (to be done):
- Add card Ids
- Add card-linking
- Add customisable card tags (can be used for weighting tasks, flagging etc..) with colours
- Add support for rich content in the card (images, videos, code snippets etc...)
- Add subtasks to a card, with completion status
- Add search functionality
- Add a Realtime Node backend [DeepStream.io](https://deepstream.io/tutorials/getting-started.html)?
- Add proper DB (NoSQL or RDBMS)
- Add Concurrency (multiuser)
- Redux?
- more...