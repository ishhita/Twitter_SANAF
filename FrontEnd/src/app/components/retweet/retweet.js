import React from 'react';
import config from '../../../config/app-config';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import ContainerLoader from '../container-loader/container-loader';
import { Link } from "react-router-dom";
import { connect } from 'react-redux';
import { setTweetViewData } from '../../../redux/actions/newsfeed-action';

class Retweet extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirectToTweet: false
        }
    }
    componentWillMount() {
        this.getTweet(this.props.retweetID);
    }
    render() {
        console.log(this.props);
        if(this.state.redirectToTweet) {
            return (
                <Redirect to={`/ui/tweet/${this.state.data._id}`} />
            )
        }
        return (
            <div>
            {this.state.data ? (
                <div className="t-tweet-container t-rounded-border" onClick={() => this.redirectToTweet()}>
                    <div>
                        <img class="t-tweet-avatar" src={config.base + this.state.data.userId.avatar} onClick={(e) => e.stopPropagation()}/>
                    </div>
                    <div class="t-tweet-right">
                        <div onClick={(e) => e.stopPropagation()}>
                            <span className="t-primary-bold"> {this.state.data.userId.name} </span>
                            <span className="t-secondary"> @{this.state.data.userId.handle}</span>
                            <span className="t-secondary" style={{marginLeft: "40px"}}> {this.state.data.timeElapsed}</span>
                        </div>
                        <div>
                            <p>{this.state.data.text}</p>
                            {this.state.data.image ? (
                                <img class='t-tweet-pic' src={config.base + this.state.data.image}/>
                            ) : (null)}
                        </div>
                        {this.state.data.parent_id ? (
                             <div>
                                <span className="t-secondary">Retweeted</span> 
                                <Link className="t-leftnav-a t-medium-text t-icon nav-link" to={`/ui/tweet/${this.state.data.parent_id}`}
                                onClick={(e) => e.stopPropagation()}>
                                  <i class="fas fa-link"></i>
                                  &nbsp;View original tweet 
                                </Link>
                             </div>
                        ) : (null)}
                    </div>
                </div>
            ) : (<ContainerLoader/>)}
            </div>
        )
    }   
    redirectToTweet() {
        // if(!window.location.pathname.includes('/ui/tweet/')) {
            this.incrementViewCount();
            this.props.setTweetViewData(this.state.data);
            this.setState({
                redirectToTweet: true
            })
        // }
    }
    incrementViewCount() {
        let body = {
            id: this.props.retweetID
        }
        axios.put('/api/tweet/view', body);
    }
    getTweet() {
        axios.get('/api/tweet', {
            params: {
                id: this.props.retweetID
            }
        })
        .then(resp => {
            if(resp.data.success) {
                this.setState({
                    data: resp.data.payload,
                })
            }
        });
    }
}

const mapDispatchToProps = dispatch => {
    return {
       setTweetViewData: payload => dispatch(setTweetViewData(payload))
    };
}
export default connect(null, mapDispatchToProps)(Retweet);