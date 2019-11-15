
import React from 'react';
import config from './../../../config/app-config';
import axios from 'axios';
import CommentModal from '../../components/comment-modal/comment-modal';
import { Redirect } from 'react-router-dom';
class Tweet extends React.Component { 
    constructor(props) {
        super(props);
        this.commentOnTweet = this.commentOnTweet.bind(this);
    }
    componentWillMount() {
        this.setState({
            data: this.props.data,
            currentUser: "5dcb16cf1c9d44000050d8fc",
            hasLiked: this.props.data.likes.includes("5dcb16cf1c9d44000050d8fc") ,
            hasRT: this.props.data.retweetCount.includes("5dcb16cf1c9d44000050d8fc"),
            hasCommented: this.props.data.comments.filter(x => x.user == "5dcb16cf1c9d44000050d8fc")
        })
    }
    render() {
        if(this.state.redirectToTweet) {
            return (
                <Redirect to={`/ui/tweet/${this.state.data._id}`} />
            )
        }
        return ( 
            <div>
            <div className="t-tweet-container" onClick={() => this.redirectToTweet()}>
                <div>
                    <img class="t-tweet-avatar" src={config.base + this.state.data.user.avatar} onClick={(e) => e.stopPropagation()}/>
                </div>
                <div class="t-tweet-right">
                    <div onClick={(e) => e.stopPropagation()}>
                        <span className="t-primary-bold"> {this.state.data.user.name} </span>
                        <span className="t-secondary"> @{this.state.data.user.handle}</span>
                        <span className="t-secondary" style={{marginLeft: "40px"}}> {this.state.data.timeElapsed}</span>
                    </div>
                    <div>
                        <p>{this.state.data.text}</p>
                        {this.state.data.image ? (
                            <img class='t-tweet-pic' src={config.base + this.state.data.image}/>
                        ) : (null)}
                    </div>
                    <div className="t-tweet-actions t-secondary">
                        <span className="t-comment" data-toggle="modal" data-target={"#commentModal"+this.state.data._id} onClick={(e) => e.stopPropagation()}> 
                            <i class={this.state.hasCommented.length > 0 ? "fas fa-comment-alt t-commented" : "far fa-comment-alt"}></i> 
                            {this.state.data.comments.length}
                        </span>  
                        <span className="t-retweet" onClick={(e) => e.stopPropagation()}> 
                            <i class="fas fa-retweet"></i> 
                            {this.state.data.retweetCount.length}
                        </span>
                        <span className="t-like" onClick={(e) => this.likeTweet(e)}> 
                            <i class={this.state.hasLiked ? "fas fa-heart t-liked" : "far fa-heart"}></i> 
                            {this.state.data.likes.length} 
                        </span>  
                    </div>
                </div>
            </div>
            <CommentModal data={this.state.data} postComment={this.commentOnTweet}/>
            </div>
        )
    }
    redirectToTweet() {
        if(!window.location.pathname.includes('/ui/tweet/')) {
            this.setState({
                redirectToTweet: true
            })
        }
    }
    likeTweet(e) {
        e.stopPropagation();
        let body = {
            id: this.state.data._id,
            user_id: this.state.currentUser
        }
        if(this.state.hasLiked) {
            this.unlikeTweet(body);
        } else {
            axios.put(config.api_host + '/tweet/like', body)
            .then(resp => {
                    if(resp.data.success) {
                        this.getTweet();
                    } 
            });
        }
    }

    unlikeTweet(body) {
        axios.delete(config.api_host + '/tweet/like', { data: body})
        .then(resp => {
                if(resp.data.success) {
                    this.getTweet();
                } 
        });
    }

    getTweet() {
        axios.get(config.api_host + '/tweet', {
            params: {
                id: this.state.data._id
            }
        })
        .then(resp => {
                if(resp.data.success) {
                    this.setState({
                        data: resp.data.payload,
                        hasLiked: resp.data.payload.likes.includes(this.state.currentUser) ,
                        hasRT: resp.data.payload.retweetCount.includes(this.state.currentUser)
                    })
                } 
        });
    }

    commentOnTweet(text) {
        debugger;
        let body = {
            text : text,
            user : "5dcb16cf1c9d44000050d8fc",
            id: this.state.data._id
        }
        axios.post(config.api_host + '/tweet/comment', body)
            .then(resp => {
                if(resp.data.success) {
                    this.getTweet();
                } 
        });
    }
}

export default Tweet;