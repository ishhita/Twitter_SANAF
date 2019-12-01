import React from 'react';
import { connect } from 'react-redux';
import Autosuggest from 'react-autosuggest';
import config from '../../../config/app-config';
import { getRecommendation, handleSearch } from './../../../redux/actions/recommendation-action';
import { followUser } from './../../../redux/actions/user-action';
import { Redirect } from 'react-router-dom';

class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            suggestions: [],
            redirectTo: null
        }
        this.props.getRecommendation(this.props.user.id);
    }
    getSuggestions = value => {
        if (this.props.searchResults) {
            let searchResults = this.props.searchResults;
            const inputValue = value.trim().toLowerCase();
            const inputLength = inputValue.length;
            return inputLength === 0 ? [] : searchResults.filter(result =>
                result.name.toLowerCase().slice(0, inputLength) === inputValue
            );
        }
    };
    getSuggestionValue = (suggestion) => {
        return suggestion.name
    }
    renderSuggestion(suggestion) {
        if (suggestion.hasOwnProperty('tweets')) {
            return this.renderHashtagSuggestion(suggestion);
        }
        else {
            return this.renderUserSuggestion(suggestion);
        }
    }
    renderUserSuggestion(suggestion) {
        return (
            <div data-id={suggestion._id} class="d-flex" onClick={(e) => { this.handleUserRedirect(e.currentTarget.dataset.id) }}>
                <img src={config.image_server + suggestion.avatar} alt="Avatar" class="t-conversationhead-avatar t-margin-right" />
                <div class="d-flex flex-column p-2 t-margin-left" style={{ "textDecoration": "none" }}>
                    <span className="t-medium-text">{suggestion.name}</span>
                    <small> @{suggestion.handle} </small>
                </div>
            </div>
        );
    }
    renderHashtagSuggestion(suggestion) {
        return (
            <div data-id={suggestion._id} class="d-flex" onClick={(e) => { this.handleUserRedirect(e.currentTarget.dataset.id) }}>
                <div class="d-flex flex-column p-2 t-margin-left">
                    <small>Trending in US</small>
                    <span className="t-medium-text">#{suggestion.name}</span>
                    <small>{suggestion.tweets.length} Tweets</small>
                </div>
            </div>
        );
    }
    onChange = (event, { newValue }) => {
        this.setState({
            value: newValue
        });
    };
    onSuggestionsFetchRequested = ({ value }) => {
        this.props.handleSearch(value);
        // var that = this;
        // that.setState({
        //     suggestions: that.getSuggestions(value)
        // });
    };
    onSuggestionsClearRequested = () => {
        // this.setState({
        //     suggestions: []
        // });
    };
    handleUserRedirect = (id) => {
        this.setState({
            redirectTo: `/ui/hashtag/${id}`
        })
    }
    handleHashtagRedirect = (id) => {
        this.setState({
            redirectTo: `/ui/hashtag/${id}`
        })
    }
    renderRecommendations = () => {
        let users = this.props.recommendation.slice(0, 2);
        let ret = [];
        ret.push(<p className="list-group-item list-group-item-action t-recommendation-title"> Who to follow</p>);
        ret.push(users.map((user) => {
            return (
                <div data-id={user._id} class="t-recommendation d-flex p-2">
                    <img src={config.image_server + user.avatar} alt="Avatar" class="t-conversationhead-avatar t-margin-right" />
                    <div class="d-flex flex-column p-2">
                        <span>{user.name}</span>
                        <small> @{user.handle} </small>
                    </div>
                    <button className="btn t-btn-follow" > follow </button>
                </div>
            )
        }));
        ret.push(<p className="list-group-item list-group-item-action t-recommendation-footer" onClick={(e) => e.target.style.display = "none"} data-toggle="collapse" data-target="#showMore"> Show more</p>);
        return ret;
    }
    renderShowMore = () => {
        return (
            <div class="collapse" id="showMore">
                {this.renderShowMoreList()}
            </div>
        )
    }
    renderShowMoreList = () => {
        let users = this.props.recommendation.slice(5);
        return users.map((user) => {
            return (
                <div class="t-recommendation d-flex p-2">
                    <img src={config.image_server + user.avatar} alt="Avatar" class="t-conversationhead-avatar t-margin-right" />
                    <div class="d-flex flex-column p-2">
                        <span>{user.name}</span>
                        <small> @{user.handle} </small>
                    </div>
                    <button className="btn t-btn-follow" data-id={user._id} onClick={this.handleFollow}> follow </button>
                </div>
            )
        })
    }
    handleFollow = (event) => {
        this.props.followUser(this.props.user.id, event.target.dataset.id);
    }
    render() {
        if (this.state.redirectTo) {
            return (
                <Redirect to={this.state.redirectTo} />
            )
        }
        const { value } = this.state;
        const inputProps = {
            placeholder: 'Search Twitter',
            value,
            onChange: this.onChange
        };
        let searchResults = this.props.searchResults || [];
        return (
            <div className="t-search-container">
                <Autosuggest
                    suggestions={searchResults}
                    onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                    onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                    getSuggestionValue={this.getSuggestionValue}
                    renderSuggestion={this.renderSuggestion.bind(this)}
                    inputProps={inputProps}
                />
                <div className="t-rec-container rounded">
                    {this.props.recommendation && this.renderRecommendations()}
                    {this.props.recommendation && this.renderShowMore()}
                </div>
            </div>
        )
    }
}
const mapStateToProps = state => {
    return {
        user: state.auth.user,
        recommendation: state.recommendationReducer.recommendation,
        searchResults: state.recommendationReducer.searchResults
    }
}
const mapDispatchToProps = dispatch => {
    return {
        getRecommendation: (id) => dispatch(getRecommendation(id)),
        followUser: (id, target_id) => dispatch(followUser(id, target_id)),
        handleSearch: (query) => dispatch(handleSearch(query))
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(Search);
