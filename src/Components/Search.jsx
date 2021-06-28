import React from 'react';

class Search extends React.Component {
    state = {
        search: '',
    };

    handleKey = (evt) => {
        this.props.searchCurrencies(this.state.search);
    };

    render() {
        return (
            <input
                type='search'
                className='user-search'
                placeholder='Search'
                value={this.state.search}
                onChange={(e) => this.setState({ search: e.target.value })}
                onKeyDown={this.handleKey}
            />
        );
    }
}

export { Search };
