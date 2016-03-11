import React from 'react';

export default class Header extends React.Component {
  render() {
    const props = this.props;

    return  (
      <header {...props}>
        <span className="title topbar-title">Kanban board</span>
      </header>
    );
  }
}